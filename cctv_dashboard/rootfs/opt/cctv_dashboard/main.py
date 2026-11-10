#!/usr/bin/env python3
"""CCTV Dashboard add-on: discover HA cameras and serve an Ingress UI."""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from typing import Any

from aiohttp import ClientSession, ClientTimeout, web

STATIC_DIR = Path(__file__).parent / "static"
HA_API = "http://supervisor/core/api"
INGRESS_PORT = int(os.environ.get("INGRESS_PORT", "8099"))
REFRESH_SECONDS = int(os.environ.get("REFRESH_SECONDS", "5"))
LOG_LEVEL = os.environ.get("LOG_LEVEL", "info").upper()

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger("cctv_dashboard")


def supervisor_headers() -> dict[str, str]:
    token = os.environ.get("SUPERVISOR_TOKEN", "")
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


async def fetch_camera_states(session: ClientSession) -> list[dict[str, Any]]:
    """Return camera entities from Home Assistant Core."""
    url = f"{HA_API}/states"
    async with session.get(url, headers=supervisor_headers()) as resp:
        if resp.status != 200:
            body = await resp.text()
            raise web.HTTPBadGateway(
                text=f"Home Assistant API error {resp.status}: {body[:200]}"
            )
        states = await resp.json()

    cameras: list[dict[str, Any]] = []
    for state in states:
        entity_id = state.get("entity_id", "")
        if not entity_id.startswith("camera."):
            continue
        attrs = state.get("attributes") or {}
        cameras.append(
            {
                "entity_id": entity_id,
                "state": state.get("state"),
                "friendly_name": attrs.get("friendly_name") or entity_id,
                "supported_features": attrs.get("supported_features", 0),
                "frontend_stream_type": attrs.get("frontend_stream_type"),
                "brand": attrs.get("brand"),
                "model": attrs.get("model"),
            }
        )
    cameras.sort(key=lambda c: c["friendly_name"].lower())
    return cameras


async def handle_index(_: web.Request) -> web.FileResponse:
    return web.FileResponse(STATIC_DIR / "index.html")


async def handle_health(_: web.Request) -> web.Response:
    return web.json_response({"ok": True, "service": "cctv_dashboard"})


async def handle_config(_: web.Request) -> web.Response:
    return web.json_response({"refresh_seconds": REFRESH_SECONDS})


async def handle_cameras(request: web.Request) -> web.Response:
    session: ClientSession = request.app["http"]
    try:
        cameras = await fetch_camera_states(session)
    except web.HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 — surface to Ingress UI
        log.exception("Failed to list cameras")
        raise web.HTTPBadGateway(text=str(exc)) from exc
    return web.json_response({"cameras": cameras})


async def handle_camera_proxy(request: web.Request) -> web.StreamResponse:
    """Proxy camera stills through the add-on so Ingress can load them."""
    entity_id = request.match_info["entity_id"]
    if not entity_id.startswith("camera.") or "/" in entity_id or ".." in entity_id:
        raise web.HTTPBadRequest(text="Invalid camera entity_id")

    session: ClientSession = request.app["http"]
    url = f"{HA_API}/camera_proxy/{entity_id}"
    async with session.get(url, headers=supervisor_headers()) as upstream:
        if upstream.status != 200:
            body = await upstream.text()
            raise web.HTTPBadGateway(
                text=f"camera_proxy failed ({upstream.status}): {body[:200]}"
            )
        data = await upstream.read()
        content_type = upstream.headers.get("Content-Type", "image/jpeg")
        return web.Response(body=data, content_type=content_type)


async def handle_service(request: web.Request) -> web.Response:
    """Call a Home Assistant camera service for one entity."""
    payload = await request.json()
    domain = payload.get("domain", "camera")
    service = payload.get("service")
    entity_id = payload.get("entity_id")
    service_data = payload.get("service_data") or {}

    if domain != "camera" or not service or not entity_id:
        raise web.HTTPBadRequest(text="domain, service, and entity_id are required")
    if not entity_id.startswith("camera."):
        raise web.HTTPBadRequest(text="Only camera.* entities are allowed")

    allowed = {"turn_on", "turn_off", "snapshot", "enable_motion_detection", "disable_motion_detection"}
    if service not in allowed:
        raise web.HTTPBadRequest(text=f"Service not allowed: {service}")

    session: ClientSession = request.app["http"]
    url = f"{HA_API}/services/{domain}/{service}"
    body = {"entity_id": entity_id, **service_data}
    async with session.post(url, headers=supervisor_headers(), json=body) as resp:
        text = await resp.text()
        if resp.status >= 400:
            raise web.HTTPBadGateway(text=f"Service call failed ({resp.status}): {text[:200]}")
        try:
            data = json.loads(text) if text else []
        except json.JSONDecodeError:
            data = {"raw": text}
        return web.json_response({"ok": True, "result": data})


async def on_startup(app: web.Application) -> None:
    app["http"] = ClientSession(timeout=ClientTimeout(total=30))
    log.info("CCTV Dashboard listening on %s", INGRESS_PORT)


async def on_cleanup(app: web.Application) -> None:
    await app["http"].close()


def create_app() -> web.Application:
    app = web.Application()
    app.on_startup.append(on_startup)
    app.on_cleanup.append(on_cleanup)

    app.router.add_get("/", handle_index)
    app.router.add_get("/health", handle_health)
    app.router.add_get("/api/config", handle_config)
    app.router.add_get("/api/cameras", handle_cameras)
    app.router.add_get("/api/camera_proxy/{entity_id}", handle_camera_proxy)
    app.router.add_post("/api/service", handle_service)
    app.router.add_static("/", STATIC_DIR, show_index=False)
    return app


def main() -> None:
    if not os.environ.get("SUPERVISOR_TOKEN"):
        log.warning("SUPERVISOR_TOKEN is not set; camera API calls will fail outside Supervisor")
    web.run_app(create_app(), host="0.0.0.0", port=INGRESS_PORT, print=None)


if __name__ == "__main__":
    main()
