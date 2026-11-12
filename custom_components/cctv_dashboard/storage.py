"""Persistent panel/recording config shared by the backend watcher."""

from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_RECORD_DETECTION_KINDS,
    DEFAULT_RECORD_ON_DETECTION,
    DEFAULT_RETENTION_DAYS,
    RECORD_DETECTION_KIND_IDS,
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


def _normalize_stream_groups(raw: Any) -> list[dict[str, Any]]:
    """Physical-camera groups: multiple camera.* streams under one name."""
    if not isinstance(raw, list):
        return []
    out: list[dict[str, Any]] = []
    used: set[str] = set()
    for item in raw:
        if not isinstance(item, dict):
            continue
        members: list[str] = []
        for mid in item.get("members") or []:
            cam = str(mid or "")
            if not cam.startswith("camera.") or cam in used or cam in members:
                continue
            used.add(cam)
            members.append(cam)
            if len(members) >= 8:
                break
        if len(members) < 2:
            continue
        raw_id = str(item.get("id") or "").strip()
        if raw_id and re.fullmatch(r"[a-zA-Z0-9._-]{1,64}", raw_id):
            group_id = raw_id
        else:
            group_id = f"grp_{members[0].removeprefix('camera.')[:40]}"
        name = str(item.get("name") or "").strip()[:64]
        if not name:
            name = members[0].removeprefix("camera.").replace("_", " ")
        out.append({"id": group_id, "name": name, "members": members})
        if len(out) >= 32:
            break
    return out


def sync_sensor_links_across_groups(
    links: dict[str, list[str]], groups: list[dict[str, Any]]
) -> dict[str, list[str]]:
    """Mirror sensor lists onto every member of each stream group."""
    next_links = {str(k): list(v) for k, v in (links or {}).items()}
    for group in groups or []:
        members = [
            str(m)
            for m in (group.get("members") or [])
            if str(m).startswith("camera.")
        ]
        if len(members) < 2:
            continue
        union: list[str] = []
        seen: set[str] = set()
        for mid in members:
            for sid in next_links.get(mid) or []:
                s = str(sid)
                if s in seen:
                    continue
                seen.add(s)
                union.append(s)
                if len(union) >= 16:
                    break
            if len(union) >= 16:
                break
        for mid in members:
            if union:
                next_links[mid] = list(union)
            else:
                next_links.pop(mid, None)
    return _normalize_links(next_links)


def cameras_for_sensor_expanded(
    links: dict[str, list[str]],
    groups: list[dict[str, Any]],
    sensor_id: str,
) -> list[str]:
    """Cameras linked to sensor_id, expanded by physical-camera stream groups."""
    sid = str(sensor_id or "")
    if not sid:
        return []
    direct = [
        cam
        for cam, sensors in (links or {}).items()
        if sid in (sensors or [])
    ]
    member_map: dict[str, list[str]] = {}
    for group in groups or []:
        members = [
            str(m)
            for m in (group.get("members") or [])
            if str(m).startswith("camera.")
        ]
        for mid in members:
            member_map[mid] = members
    out: set[str] = set()
    for cam in direct:
        for mid in member_map.get(cam) or [cam]:
            if str(mid).startswith("camera."):
                out.add(str(mid))
    return sorted(out)


# Known presets; custom W:H / WxH values are also accepted.
FORCE_ASPECT_LABELS = {
    "16:9",
    "9:16",
    "4:3",
    "3:4",
    "1:1",
    "3:2",
    "2:3",
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


def _normalize_record_detection_kinds(raw: Any) -> list[str]:
    """Shared allow-list of detection kinds that start video recording."""
    allowed = set(RECORD_DETECTION_KIND_IDS)
    if raw is None:
        return list(DEFAULT_RECORD_DETECTION_KINDS)
    if not isinstance(raw, (list, tuple, set)):
        return list(DEFAULT_RECORD_DETECTION_KINDS)
    cleaned: list[str] = []
    seen: set[str] = set()
    for item in raw:
        kind = str(item or "").strip().lower()
        if kind not in allowed or kind in seen:
            continue
        seen.add(kind)
        cleaned.append(kind)
    # Empty list is intentional (record nothing); missing/invalid → defaults.
    if not cleaned and raw not in ([], (), set()):
        return list(DEFAULT_RECORD_DETECTION_KINDS)
    return cleaned


def _normalize_notify_on_detection(raw: Any) -> dict[str, bool]:
    """Per-user opt-in map: HA user id → True (only opted-in users stored)."""
    if not isinstance(raw, dict):
        return {}
    out: dict[str, bool] = {}
    for user_id, enabled in raw.items():
        uid = str(user_id or "").strip()
        if not uid:
            continue
        if enabled is True or enabled in {1, "1", "true", "on", "yes"}:
            out[uid] = True
    return out


def default_data() -> dict[str, Any]:
    # Site-wide settings + per-user maps (notify_on_detection keyed by HA user id).
    # Per-user camera mosaic selection stays in frontend user data.
    return {
        "sensor_links": {},
        "stream_groups": [],
        "force_aspect": {},
        "camera_quality": {},
        "retention_days": DEFAULT_RETENTION_DAYS,
        "record_on_detection": DEFAULT_RECORD_ON_DETECTION,
        "record_detection_kinds": list(DEFAULT_RECORD_DETECTION_KINDS),
        "notify_on_detection": {},
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
            data["stream_groups"] = _normalize_stream_groups(
                loaded.get("stream_groups")
            )
            data["sensor_links"] = sync_sensor_links_across_groups(
                _normalize_links(loaded.get("sensor_links")),
                data["stream_groups"],
            )
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
            data["record_detection_kinds"] = _normalize_record_detection_kinds(
                loaded.get(
                    "record_detection_kinds", DEFAULT_RECORD_DETECTION_KINDS
                )
            )
            data["notify_on_detection"] = _normalize_notify_on_detection(
                loaded.get("notify_on_detection")
            )
        self.data = data
        return data

    async def async_save(self, patch: dict[str, Any] | None = None) -> dict[str, Any]:
        data = dict(self.data)
        if patch:
            if "stream_groups" in patch:
                data["stream_groups"] = _normalize_stream_groups(
                    patch["stream_groups"]
                )
            if "sensor_links" in patch:
                data["sensor_links"] = _normalize_links(patch["sensor_links"])
            # Keep sensor lists aligned whenever groups or links change.
            if "stream_groups" in patch or "sensor_links" in patch:
                data["sensor_links"] = sync_sensor_links_across_groups(
                    data.get("sensor_links") or {},
                    data.get("stream_groups") or [],
                )
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
            if "record_detection_kinds" in patch:
                data["record_detection_kinds"] = _normalize_record_detection_kinds(
                    patch["record_detection_kinds"]
                )
            if "notify_on_detection" in patch:
                # Merge per-user keys; callers should only patch the current user id.
                merged = dict(data.get("notify_on_detection") or {})
                incoming = patch["notify_on_detection"]
                if isinstance(incoming, dict):
                    for user_id, enabled in incoming.items():
                        uid = str(user_id or "").strip()
                        if not uid:
                            continue
                        if enabled is True or enabled in {1, "1", "true", "on", "yes"}:
                            merged[uid] = True
                        else:
                            merged.pop(uid, None)
                data["notify_on_detection"] = _normalize_notify_on_detection(merged)
        self.data = data
        await self._store.async_save(data)
        return data

    def notify_enabled_for(self, user_id: str | None) -> bool:
        if not user_id:
            return False
        return bool((self.data.get("notify_on_detection") or {}).get(str(user_id)))

    def opted_in_notify_user_ids(self) -> list[str]:
        return sorted(
            uid
            for uid, enabled in (self.data.get("notify_on_detection") or {}).items()
            if enabled
        )
