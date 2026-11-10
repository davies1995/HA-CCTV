"""WebSocket API for panel sync, recording settings, and clip listing."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_sync_panel)
    websocket_api.async_register_command(hass, ws_get_settings)
    websocket_api.async_register_command(hass, ws_set_settings)
    websocket_api.async_register_command(hass, ws_list_recordings)
    websocket_api.async_register_command(hass, ws_delete_recording)


def _manager(hass: HomeAssistant):
    return hass.data.get(DOMAIN, {}).get("recording_manager")


def _store(hass: HomeAssistant):
    return hass.data.get(DOMAIN, {}).get("store")


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
    store = _store(hass)
    manager = _manager(hass)
    if not store:
        connection.send_error(msg["id"], "not_ready", "CCTV store not ready")
        return
    patch: dict[str, Any] = {}
    if "selected_cameras" in msg:
        patch["selected_cameras"] = msg["selected_cameras"]
    if "sensor_links" in msg:
        patch["sensor_links"] = msg["sensor_links"]
    data = await store.async_save(patch)
    if manager:
        manager.apply_store_update()
    connection.send_result(msg["id"], data)


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
    data["active_session"] = bool(manager and manager._session and manager._session.active)
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/set_settings",
        vol.Optional("retention_days"): vol.All(vol.Coerce(int), vol.Range(min=1, max=30)),
        vol.Optional("record_on_detection"): bool,
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
    data = await store.async_save(patch)
    if manager:
        manager.apply_store_update()
        await manager.async_enforce_retention()

    # Mirror retention into config entry options when possible.
    entries = hass.config_entries.async_entries(DOMAIN)
    if entries and "retention_days" in patch:
        entry = entries[0]
        new_options = {**entry.options, "retention_days": data["retention_days"]}
        if "record_on_detection" in patch:
            new_options["record_on_detection"] = data["record_on_detection"]
        hass.config_entries.async_update_entry(entry, options=new_options)

    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/list_recordings",
        vol.Optional("limit", default=40): vol.All(vol.Coerce(int), vol.Range(min=1, max=200)),
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
    connection.send_result(
        msg["id"], {"sessions": manager.list_sessions(limit=msg["limit"])}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cctv_dashboard/delete_recording",
        vol.Required("session_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_recording(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    manager = _manager(hass)
    if not manager:
        connection.send_error(msg["id"], "not_ready", "Recording manager not ready")
        return
    ok = await manager.async_delete_session(msg["session_id"])
    connection.send_result(msg["id"], {"deleted": ok})
