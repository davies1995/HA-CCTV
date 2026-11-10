"""Persistent panel/recording config shared by the backend watcher."""

from __future__ import annotations

import re
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


# Known presets; custom W:H / WxH values are also accepted.
FORCE_ASPECT_LABELS = {
    "16:9",
    "9:16",
    "4:3",
    "3:4",
    "1:1",
    "3:2",
    "2:3",
    "1920:2560",  # common doorbell portrait (same ratio as 3:4)
}

QUALITY_VALUES = {"auto", "high", "balanced", "low"}

_CUSTOM_ASPECT = re.compile(
    r"^(\d+(?:\.\d+)?)[:x×*](\d+(?:\.\d+)?)$", re.IGNORECASE
)


def _normalize_force_aspect_label(label: Any) -> str | None:
    value = (
        str(label or "")
        .strip()
        .lower()
        .replace(" ", "")
        .replace("×", "x")
        .replace("*", "x")
    )
    if value in {"", "auto", "default", "none", "custom"}:
        return None
    if value in FORCE_ASPECT_LABELS:
        return value
    match = _CUSTOM_ASPECT.match(value)
    if not match:
        return None
    width = float(match.group(1))
    height = float(match.group(2))
    if width <= 0 or height <= 0 or width / height < 0.05 or width / height > 20:
        return None
    # Prefer integer form when possible (1920:2560).
    if width.is_integer() and height.is_integer():
        return f"{int(width)}:{int(height)}"
    return f"{width:g}:{height:g}"


def _normalize_force_aspect(raw: Any) -> dict[str, str]:
    if not isinstance(raw, dict):
        return {}
    out: dict[str, str] = {}
    for camera_id, label in raw.items():
        cam = str(camera_id)
        if not cam.startswith("camera."):
            continue
        normalized = _normalize_force_aspect_label(label)
        if normalized:
            out[cam] = normalized
    return out


def _normalize_camera_quality(raw: Any) -> dict[str, str]:
    if not isinstance(raw, dict):
        return {}
    out: dict[str, str] = {}
    for camera_id, quality in raw.items():
        cam = str(camera_id)
        if not cam.startswith("camera."):
            continue
        value = str(quality or "").strip().lower()
        if value not in QUALITY_VALUES or value == "auto":
            continue
        out[cam] = value
    return out


def default_data() -> dict[str, Any]:
    # Site-wide only. Per-user camera mosaic selection stays in frontend user data.
    return {
        "sensor_links": {},
        "force_aspect": {},
        "camera_quality": {},
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
            data["force_aspect"] = _normalize_force_aspect(loaded.get("force_aspect"))
            data["camera_quality"] = _normalize_camera_quality(
                loaded.get("camera_quality")
            )
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
            if "force_aspect" in patch:
                data["force_aspect"] = _normalize_force_aspect(patch["force_aspect"])
            if "camera_quality" in patch:
                data["camera_quality"] = _normalize_camera_quality(
                    patch["camera_quality"]
                )
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
