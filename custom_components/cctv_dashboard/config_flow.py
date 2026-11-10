"""Config flow — enable CCTV Dashboard from the HA UI with no YAML."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

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
    QUALITY_OPTIONS,
)


def _schema(defaults: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(
                CONF_SIDEBAR_TITLE,
                default=defaults.get(CONF_SIDEBAR_TITLE, DEFAULT_SIDEBAR_TITLE),
            ): str,
            vol.Optional(
                CONF_TITLE,
                default=defaults.get(CONF_TITLE, DEFAULT_TITLE),
            ): str,
            vol.Optional(
                CONF_MAX_STREAMS,
                default=defaults.get(CONF_MAX_STREAMS, DEFAULT_MAX_STREAMS),
            ): vol.All(vol.Coerce(int), vol.Range(min=1, max=16)),
            vol.Optional(
                CONF_QUALITY,
                default=defaults.get(CONF_QUALITY, DEFAULT_QUALITY),
            ): vol.In(QUALITY_OPTIONS),
            vol.Optional(
                CONF_RETENTION_DAYS,
                default=defaults.get(CONF_RETENTION_DAYS, DEFAULT_RETENTION_DAYS),
            ): vol.All(vol.Coerce(int), vol.Range(min=1, max=30)),
            vol.Optional(
                CONF_RECORD_ON_DETECTION,
                default=defaults.get(
                    CONF_RECORD_ON_DETECTION, DEFAULT_RECORD_ON_DETECTION
                ),
            ): bool,
        }
    )


class CctvDashboardConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for CCTV Dashboard."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Single-instance enablement — optional defaults only."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(
                title="CCTV Dashboard",
                data={},
                options={
                    CONF_SIDEBAR_TITLE: user_input.get(
                        CONF_SIDEBAR_TITLE, DEFAULT_SIDEBAR_TITLE
                    ),
                    CONF_TITLE: user_input.get(CONF_TITLE, DEFAULT_TITLE),
                    CONF_MAX_STREAMS: user_input.get(
                        CONF_MAX_STREAMS, DEFAULT_MAX_STREAMS
                    ),
                    CONF_QUALITY: user_input.get(CONF_QUALITY, DEFAULT_QUALITY),
                    CONF_RETENTION_DAYS: user_input.get(
                        CONF_RETENTION_DAYS, DEFAULT_RETENTION_DAYS
                    ),
                    CONF_RECORD_ON_DETECTION: user_input.get(
                        CONF_RECORD_ON_DETECTION, DEFAULT_RECORD_ON_DETECTION
                    ),
                },
            )

        return self.async_show_form(step_id="user", data_schema=_schema({}))

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        return CctvDashboardOptionsFlow(config_entry)


class CctvDashboardOptionsFlow(config_entries.OptionsFlowWithConfigEntry):
    """Options flow for sidebar title / quality / stream cap / retention."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=_schema(dict(self.options)),
        )
