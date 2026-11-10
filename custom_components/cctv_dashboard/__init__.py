"""CCTV Dashboard — registers a sidebar panel and loads Lovelace cards with no YAML."""

from __future__ import annotations

import logging
from pathlib import Path

import homeassistant.helpers.config_validation as cv
from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_MAX_STREAMS,
    CONF_QUALITY,
    CONF_RECORD_ON_DETECTION,
    CONF_RETENTION_DAYS,
    CONF_SIDEBAR_TITLE,
    CONF_TITLE,
    DEFAULT_MAX_STREAMS,
    DEFAULT_QUALITY,
    DEFAULT_RECORD_ON_DETECTION,
    DEFAULT_RETENTION_DAYS,
    DEFAULT_SIDEBAR_TITLE,
    DEFAULT_TITLE,
    DOMAIN,
    JS_URL,
    PANEL_URL_PATH,
    RECORDINGS_URL_BASE,
    URL_BASE,
    VERSION,
)
from .media_view import CctvRecordingMediaView
from .recordings import RecordingManager
from .storage import PanelStore
from .websocket_api import async_register_websocket

_LOGGER = logging.getLogger(__name__)

# YAML configuration is intentionally unsupported — setup is UI / config-flow only.
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration domain (config entries do the real work)."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up CCTV Dashboard from a config entry — panel + JS, no file edits."""
    data = hass.data.setdefault(DOMAIN, {})

    store = PanelStore(hass)
    await store.async_load()
    # Seed from config entry options when store still has defaults.
    options = {**entry.data, **entry.options}
    if CONF_RETENTION_DAYS in options:
        await store.async_save(
            {
                CONF_RETENTION_DAYS: options.get(
                    CONF_RETENTION_DAYS, DEFAULT_RETENTION_DAYS
                ),
                CONF_RECORD_ON_DETECTION: options.get(
                    CONF_RECORD_ON_DETECTION, DEFAULT_RECORD_ON_DETECTION
                ),
            }
        )
    data["store"] = store

    manager = RecordingManager(hass, store)
    await manager.async_setup()
    data["recording_manager"] = manager

    if not data.get("ws_registered"):
        async_register_websocket(hass)
        data["ws_registered"] = True

    await _async_register_frontend(hass, entry, manager)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the sidebar panel and extra module URL."""
    data = hass.data.get(DOMAIN, {})
    manager = data.pop("recording_manager", None)
    if manager:
        await manager.async_unload()
    data.pop("store", None)
    await _async_unregister_frontend(hass)
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Re-register panel when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_frontend(
    hass: HomeAssistant, entry: ConfigEntry, manager: RecordingManager
) -> None:
    data = hass.data.setdefault(DOMAIN, {})
    www = Path(__file__).parent / "www"

    if not data.get("static_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(www), False)]
        )
        data["static_registered"] = True

    if not data.get("recordings_static"):
        # Legacy static URLs for older clip index entries.
        await hass.http.async_register_static_paths(
            [StaticPathConfig(RECORDINGS_URL_BASE, str(manager.record_dir), False)]
        )
        data["recordings_static"] = True

    if not data.get("media_view_registered"):
        hass.http.register_view(CctvRecordingMediaView(manager.record_dir))
        data["media_view_registered"] = True

    # Loads the module for all users so Lovelace cards work without Resources YAML.
    if not data.get("js_registered"):
        frontend.add_extra_js_url(hass, JS_URL)
        data["js_registered"] = True

    # Drop a previous panel registration before recreating (reload / options).
    frontend.async_remove_panel(hass, PANEL_URL_PATH)

    options = {**entry.data, **entry.options}
    panel_config = {
        "title": options.get(CONF_TITLE, DEFAULT_TITLE),
        "max_streams": int(options.get(CONF_MAX_STREAMS, DEFAULT_MAX_STREAMS)),
        "quality": options.get(CONF_QUALITY, DEFAULT_QUALITY),
        "retention_days": int(
            options.get(
                CONF_RETENTION_DAYS,
                hass.data[DOMAIN]["store"].data.get(
                    CONF_RETENTION_DAYS, DEFAULT_RETENTION_DAYS
                ),
            )
        ),
        "record_on_detection": bool(
            options.get(
                CONF_RECORD_ON_DETECTION,
                hass.data[DOMAIN]["store"].data.get(
                    CONF_RECORD_ON_DETECTION, DEFAULT_RECORD_ON_DETECTION
                ),
            )
        ),
    }

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name="cctv-dashboard-panel",
        sidebar_title=options.get(CONF_SIDEBAR_TITLE, DEFAULT_SIDEBAR_TITLE),
        sidebar_icon="mdi:cctv",
        module_url=f"{JS_URL}?v={VERSION}",
        embed_iframe=False,
        require_admin=False,
        config=panel_config,
    )
    data["panel_registered"] = True
    _LOGGER.info("CCTV Dashboard sidebar panel registered at /%s", PANEL_URL_PATH)


async def _async_unregister_frontend(hass: HomeAssistant) -> None:
    data = hass.data.get(DOMAIN, {})
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    if data.get("js_registered"):
        try:
            frontend.remove_extra_js_url(hass, JS_URL)
        except ValueError:
            pass
        data["js_registered"] = False
    data["panel_registered"] = False
