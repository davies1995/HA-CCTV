"""Persistent panel/recording config shared by the backend watcher."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_RECORD_ON_DETECTION,
    DEFAULT_RETENTION_DAYS,
    STORAGE_KEY,
    STORAGE_VERSION,
)


def _normalize_links(raw: Any) -> dict[str, list[str]]:
    if not isinstance(raw, dict):
        return {}
    out: dict[str, list[str]] = {}
    for camera_id, sensors in raw.items():
        cam = str(camera_id)
        if not cam.startswith("camera.") or not isinstance(sensors, list):
            continue
        cleaned = []
        seen: set[str] = set()
        for sensor in sensors:
            sid = str(sensor)
            domain = sid.split(".", 1)[0]
            if domain not in {"binary_sensor", "sensor"} or sid in seen:
                continue
            seen.add(sid)
            cleaned.append(sid)
            if len(cleaned) >= 16:
                break
        if cleaned:
            out[cam] = cleaned
    return out


def default_data() -> dict[str, Any]:
    # Site-wide only. Per-user camera mosaic selection stays in frontend user data.
    return {
        "sensor_links": {},
        "retention_days": DEFAULT_RETENTION_DAYS,
        "record_on_detection": DEFAULT_RECORD_ON_DETECTION,
    }


class PanelStore:
    """JSON store under .storage for site-wide links + recording settings."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data = default_data()

    async def async_load(self) -> dict[str, Any]:
        loaded = await self._store.async_load()
        data = default_data()
        if isinstance(loaded, dict):
            data["sensor_links"] = _normalize_links(loaded.get("sensor_links"))
            try:
                days = int(loaded.get("retention_days", DEFAULT_RETENTION_DAYS))
            except (TypeError, ValueError):
                days = DEFAULT_RETENTION_DAYS
            data["retention_days"] = max(1, min(days, 30))
            data["record_on_detection"] = bool(
                loaded.get("record_on_detection", DEFAULT_RECORD_ON_DETECTION)
            )
        self.data = data
        return data

    async def async_save(self, patch: dict[str, Any] | None = None) -> dict[str, Any]:
        data = dict(self.data)
        if patch:
            if "sensor_links" in patch:
                data["sensor_links"] = _normalize_links(patch["sensor_links"])
            if "retention_days" in patch:
                try:
                    days = int(patch["retention_days"])
                except (TypeError, ValueError):
                    days = DEFAULT_RETENTION_DAYS
                data["retention_days"] = max(1, min(days, 30))
            if "record_on_detection" in patch:
                data["record_on_detection"] = bool(patch["record_on_detection"])
        self.data = data
        await self._store.async_save(data)
        return data
