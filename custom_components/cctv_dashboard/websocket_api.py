"""WebSocket API for shared panel config, recording settings, and clip listing."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN, RECORD_DETECTION_KIND_IDS

_LOGGER = logging.getLogger(__name__)


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_settings)
    websocket_api.async_register_command(hass, ws_set_settings)
    websocket_api.async_register_command(hass, ws_set_user_notify)
    websocket_api.async_register_command(hass, ws_set_sensor_links)
    websocket_api.async_register_command(hass, ws_set_stream_groups)
    websocket_api.async_register_command(hass, ws_set_force_aspect)
    websocket_api.async_register_command(hass, ws_set_camera_prefs)
    websocket_api.async_register_command(hass, ws_list_recordings)
    websocket_api.async_register_command(hass, ws_list_detections)
    websocket_api.async_register_command(hass, ws_delete_recording)
    websocket_api.async_register_command(hass, ws_clear_detections)
    # Backward-compatible alias used by older frontend builds.
    websocket_api.async_register_command(hass, ws_sync_panel)


def _manager(hass: HomeAssistant):
    return hass.data.get(DOMAIN, {}).get("recording_manager")


def _store(hass: HomeAssistant):
    return hass.data.get(DOMAIN, {}).get("store")


@websocket_api.websocket_command({vol.Required("type"): "cctv_dashboard/get_settings"})
@websocket_api.async_response
async def ws_get_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = _store(hass)
    manager = _manager(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    data = dict(store.data)
    data["record_dir"] = str(manager.record_dir) if manager else None
    data["active_session"] = bool(
        manager and manager._session and manager._session.active
    )
    # Settings-only diagnostics (also mirrored on sensor.cctv_dashboard_recording_debug).
    if manager:
        debug = manager.recording_debug_payload()
        data["recording_debug"] = debug.get("text") or ""
        data["recording_debug_summary"] = debug.get("summary") or ""
    else:
        data["recording_debug"] = ""
        data["recording_debug_summary"] = ""
    # Per-user preference only — never expose other users' notify opt-ins.
    user_id = getattr(connection.user, "id", None) if connection.user else None
    data["notify_on_detection"] = store.notify_enabled_for(user_id)
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/set_settings",
        vol.Optional("retention_days"): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=30)
        ),
        vol.Optional("record_on_detection"): bool,
        vol.Optional("record_detection_kinds"): [str],
    }
)
@websocket_api.async_response
async def ws_set_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = _store(hass)
    manager = _manager(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    patch: dict[str, Any] = {}
    if "retention_days" in msg:
        patch["retention_days"] = msg["retention_days"]
    if "record_on_detection" in msg:
        patch["record_on_detection"] = msg["record_on_detection"]
    if "record_detection_kinds" in msg:
        # Reject unknown ids early; store normalizer also filters.
        kinds = [str(k).strip().lower() for k in (msg["record_detection_kinds"] or [])]
        unknown = [k for k in kinds if k and k not in RECORD_DETECTION_KIND_IDS]
        if unknown:
            connection.send_error(
                msg["id"],
                "invalid_format",
                f"Unknown detection kinds: {', '.join(sorted(set(unknown)))}",
            )
            return
        patch["record_detection_kinds"] = kinds
    data = await store.async_save(patch)
    if manager:
        manager.apply_store_update()
        await manager.async_enforce_retention()

    entries = hass.config_entries.async_entries(DOMAIN)
    if entries and patch:
        entry = entries[0]
        new_options = {**entry.options}
        if "retention_days" in patch:
            new_options["retention_days"] = data["retention_days"]
        if "record_on_detection" in patch:
            new_options["record_on_detection"] = data["record_on_detection"]
        hass.config_entries.async_update_entry(entry, options=new_options)

    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/set_user_notify",
        vol.Required("notify_on_detection"): bool,
    }
)
@websocket_api.async_response
async def ws_set_user_notify(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Per-user: enable/disable detection-recorded notifications for this HA user only."""
    store = _store(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    user = connection.user
    if not user or not getattr(user, "id", None):
        connection.send_error(msg["id"], "unauthorized", "User required")
        return
    enabled = bool(msg["notify_on_detection"])
    await store.async_save({"notify_on_detection": {str(user.id): enabled}})
    connection.send_result(
        msg["id"],
        {
            "notify_on_detection": enabled,
            "user_id": str(user.id),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/set_sensor_links",
        vol.Required("sensor_links"): dict,
    }
)
@websocket_api.async_response
async def ws_set_sensor_links(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save site-wide camera↔sensor associations for all HA users."""
    store = _store(hass)
    manager = _manager(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    data = await store.async_save({"sensor_links": msg["sensor_links"]})
    if manager:
        manager.apply_store_update()
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/set_stream_groups",
        vol.Required("stream_groups"): list,
    }
)
@websocket_api.async_response
async def ws_set_stream_groups(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save site-wide physical-camera stream groups (shared sensor assignment)."""
    store = _store(hass)
    manager = _manager(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    data = await store.async_save({"stream_groups": msg["stream_groups"]})
    if manager:
        manager.apply_store_update()
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/set_force_aspect",
        vol.Required("force_aspect"): dict,
    }
)
@websocket_api.async_response
async def ws_set_force_aspect(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save site-wide per-camera mosaic aspect overrides for all HA users."""
    store = _store(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    data = await store.async_save({"force_aspect": msg["force_aspect"]})
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/set_camera_prefs",
        vol.Optional("camera_quality"): dict,
        vol.Optional("force_aspect"): dict,
    }
)
@websocket_api.async_response
async def ws_set_camera_prefs(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save shared per-camera quality + force-aspect (all HA users)."""
    store = _store(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    patch: dict[str, Any] = {}
    if "camera_quality" in msg:
        patch["camera_quality"] = msg["camera_quality"]
    if "force_aspect" in msg:
        patch["force_aspect"] = msg["force_aspect"]
    if not patch:
        connection.send_result(msg["id"], dict(store.data))
        return
    data = await store.async_save(patch)
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/sync_panel",
        vol.Optional("selected_cameras"): [str],
        vol.Optional("sensor_links"): dict,
    }
)
@websocket_api.async_response
async def ws_sync_panel(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Legacy alias — only sensor_links are persisted (site-wide)."""
    store = _store(hass)
    manager = _manager(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    if "sensor_links" not in msg:
        connection.send_result(msg["id"], dict(store.data))
        return
    data = await store.async_save({"sensor_links": msg["sensor_links"]})
    if manager:
        manager.apply_store_update()
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/list_recordings",
        vol.Optional("limit", default=200): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=500)
        ),
    }
)
@websocket_api.async_response
async def ws_list_recordings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    manager = _manager(hass)
    if not manager:
        connection.send_error(msg["id"], "not_ready", "Recording manager not ready")
        return
    # Finalize orphan active sessions before the UI lists "recording…".
    try:
        await manager.async_reconcile_active_session()
    except Exception:  # noqa: BLE001
        pass
    limit = msg["limit"]
    sessions = manager.list_sessions(limit=limit)
    total_bytes = sum(int(item.get("total_bytes") or 0) for item in sessions)
    connection.send_result(
        msg["id"],
        {
            "sessions": sessions,
            "total_bytes": total_bytes,
            "count": len(sessions),
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/list_detections",
        vol.Optional("start"): vol.Coerce(int),
        vol.Optional("end"): vol.Coerce(int),
        vol.Optional("cameras"): [str],
        vol.Optional("limit", default=500): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=2000)
        ),
    }
)
@websocket_api.async_response
async def ws_list_detections(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Shared detection timeline events (all users; survives reboot)."""
    manager = _manager(hass)
    if not manager:
        connection.send_error(msg["id"], "not_ready", "Recording manager not ready")
        return
    connection.send_result(
        msg["id"],
        {
            "events": manager.list_detections(
                start_ms=msg.get("start"),
                end_ms=msg.get("end"),
                cameras=msg.get("cameras"),
                limit=msg["limit"],
            )
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/delete_recording",
        vol.Required("session_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete_recording(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Admin-only: delete a saved detection's recording file set for all users."""
    manager = _manager(hass)
    if not manager:
        connection.send_error(msg["id"], "not_ready", "Recording manager not ready")
        return
    ok = await manager.async_delete_session(msg["session_id"])
    connection.send_result(msg["id"], {"deleted": ok})


@websocket_api.websocket_command(
    {vol.Required("type"): "cctv_dashboard/clear_detections"}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_clear_detections(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Admin-only: delete all saved detections and reset the shared timeline."""
    manager = _manager(hass)
    if not manager:
        connection.send_error(msg["id"], "not_ready", "Recording manager not ready")
        return
    result = await manager.async_clear_all()
    connection.send_result(msg["id"], result)
