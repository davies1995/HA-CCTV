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
    CONF_SIDEBAR_TITLE,
    CONF_TITLE,
    DEFAULT_MAX_STREAMS,
    DEFAULT_QUALITY,
    DEFAULT_SIDEBAR_TITLE,
    DEFAULT_TITLE,
    DOMAIN,
    JS_URL,
    PANEL_URL_PATH,
    URL_BASE,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

# YAML configuration is intentionally unsupported — setup is UI / config-flow only.
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration domain (config entries do the real work)."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up CCTV Dashboard from a config entry — panel + JS, no file edits."""
    await _async_register_frontend(hass, entry)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the sidebar panel and extra module URL."""
    await _async_unregister_frontend(hass)
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Re-register panel when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_frontend(hass: HomeAssistant, entry: ConfigEntry) -> None:
    data = hass.data.setdefault(DOMAIN, {})
    www = Path(__file__).parent / "www"

    if not data.get("static_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(www), False)]
        )
        data["static_registered"] = True

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
