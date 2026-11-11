"""Detection-triggered multi-camera recording via HA camera.record / snapshot."""

from __future__ import annotations

import asyncio
import json
import logging
import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from homeassistant.const import STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

from .const import (
    DEFAULT_RECORD_DETECTION_KINDS,
    DOMAIN,
    MEDIA_API_URL_BASE,
    RECORD_CHUNK_SECONDS,
    RECORD_DETECTION_KIND_IDS,
    RECORD_LOOKBACK_SECONDS,
    RECORDINGS_URL_BASE,
    SNAPSHOT_INTERVAL_SECONDS,
)
from .storage import PanelStore

_LOGGER = logging.getLogger(__name__)

ON_STATES = {STATE_ON, "true", "detected", "active", "home", "1"}
SAFE_NAME = re.compile(r"[^a-zA-Z0-9._-]+")


def clip_media_url(filename: str) -> str:
    """Public authenticated media URL for a clip filename."""
    name = Path(str(filename)).name
    return f"{MEDIA_API_URL_BASE}/{name}"

# Keep in sync with frontend detection-sensors.js kind tokens.
_KIND_TOKENS: list[tuple[str, str, tuple[str, ...]]] = [
    ("person", "Person", ("person", "people", "human", "pedestrian", "face")),
    ("car", "Car", ("car", "vehicle", "automobile", "auto")),
    ("animal", "Animal", ("animal", "pet", "dog", "cat", "wildlife")),
    ("package", "Package", ("package", "parcel", "delivery", "amazon")),
    ("bicycle", "Bicycle", ("bicycle", "bike", "cyclist")),
    ("motion", "Motion", ("motion", "occupancy", "presence", "moving")),
]


def _clip_has_media(clip: dict[str, Any] | None) -> bool:
    """True when a clip points at a non-empty on-disk file."""
    if not clip:
        return False
    path = Path(clip.get("path") or "")
    if path.is_file():
        try:
            return path.stat().st_size > 0
        except OSError:
            return False
    size = clip.get("size")
    return isinstance(size, (int, float)) and size > 0


def _is_active_state(state: str | None) -> bool:
    if state is None:
        return False
    value = str(state).strip().lower()
    if value in ON_STATES:
        return True
    try:
        return float(value) > 0
    except ValueError:
        return False


def _safe(value: str) -> str:
    return SAFE_NAME.sub("_", value).strip("._") or "cam"


def _classify_kind(entity_id: str, friendly_name: str | None = None) -> dict[str, str]:
    blob = f"{entity_id} {friendly_name or ''}".lower()
    for kind_id, label, tokens in _KIND_TOKENS:
        for token in tokens:
            if re.search(rf"(^|[_\s.-]){re.escape(token)}([_\s.-]|$)", blob):
                return {"id": kind_id, "label": label}
    return {"id": "other", "label": "Other"}


def _parse_iso(value: Any) -> datetime | None:
    if value is None:
        return None
    try:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except Exception:  # noqa: BLE001
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


@dataclass
class RecordingSession:
    session_id: str
    started: datetime
    trigger_sensors: list[str]
    cameras: list[str]
    clips: list[dict[str, Any]] = field(default_factory=list)
    active: bool = True
    ended: datetime | None = None
    mode: str = "record"  # record | snapshot


class RecordingManager:
    """Watch linked sensors; on trigger record all cameras until clear."""

    def __init__(self, hass: HomeAssistant, store: PanelStore) -> None:
        self.hass = hass
        self.store = store
        self.record_dir = self._resolve_record_dir()
        self._unsub = None
        self._session: RecordingSession | None = None
        self._chunk_task: asyncio.Task | None = None
        self._cleanup_task: asyncio.Task | None = None
        # True while finishing the in-flight chunk after sensors clear.
        self._ending = False
        self._index_path = self.record_dir / "index.json"
        self._detections_path = self.record_dir / "detections.json"
        self._sessions_meta: list[dict[str, Any]] = []
        # Shared detection timeline events (all users; survives reboot).
        self._detection_events: list[dict[str, Any]] = []
        # sensor_id -> open event dict (end is None)
        self._open_detections: dict[str, dict[str, Any]] = {}
        # path -> (size, mtime) so list_sessions does not re-stat every poll
        self._size_cache: dict[str, tuple[int, float]] = {}

    def _resolve_record_dir(self) -> Path:
        media_dirs = getattr(self.hass.config, "media_dirs", None) or {}
        if "local" in media_dirs:
            base = Path(media_dirs["local"])
        elif media_dirs:
            base = Path(next(iter(media_dirs.values())))
        else:
            base = Path(self.hass.config.path("www"))
        path = base / "cctv_dashboard" / "recordings"
        path.mkdir(parents=True, exist_ok=True)
        return path

    async def async_setup(self) -> None:
        self.record_dir.mkdir(parents=True, exist_ok=True)
        self._sessions_meta = await self.hass.async_add_executor_job(
            self._load_index_sync
        )
        self._detection_events = await self.hass.async_add_executor_job(
            self._load_detections_sync
        )
        self._rebuild_open_detections()
        await self._reconcile_open_detections()
        self._rebind_listeners()
        self._cleanup_task = self.hass.async_create_task(self._cleanup_loop())
        await self.async_enforce_retention()
        _LOGGER.info(
            "CCTV recordings ready at %s (retention=%sd, detections=%s)",
            self.record_dir,
            self.store.data.get("retention_days"),
            len(self._detection_events),
        )

    async def async_unload(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None
        if self._chunk_task:
            self._chunk_task.cancel()
            self._chunk_task = None
        if self._cleanup_task:
            self._cleanup_task.cancel()
            self._cleanup_task = None
        if self._session and self._session.active:
            await self._end_session()

    def _rebind_listeners(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None
        entity_ids = self._watched_sensors()
        if not entity_ids:
            return
        self._unsub = async_track_state_change_event(
            self.hass, entity_ids, self._on_sensor_event
        )

    def _watched_sensors(self) -> list[str]:
        # Site-wide links — watch every linked detection sensor for all users.
        links = self.store.data.get("sensor_links") or {}
        sensors: list[str] = []
        for linked in links.values():
            sensors.extend(linked)
        return sorted(set(sensors))

    def apply_store_update(self) -> None:
        """Rebind after frontend sync / settings change."""
        self._rebind_listeners()
        # If recording disabled mid-session, stop scheduling new chunks.
        if not self.store.data.get("record_on_detection", True) and self._session:
            self.hass.async_create_task(self._end_session())

    @callback
    def _on_sensor_event(self, event: Event) -> None:
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")
        entity_id = event.data.get("entity_id")
        if not entity_id or new_state is None:
            return
        was_on = _is_active_state(old_state.state if old_state else None)
        is_on = _is_active_state(new_state.state)
        if is_on and not was_on:
            self.hass.async_create_task(self._handle_trigger(str(entity_id)))
        elif was_on and not is_on:
            self.hass.async_create_task(self._handle_sensor_clear(str(entity_id)))

    def _cameras_for_sensor(self, sensor_id: str) -> list[str]:
        links = self.store.data.get("sensor_links") or {}
        cams = [
            cam
            for cam, sensors in links.items()
            if sensor_id in (sensors or [])
        ]
        return sorted(cams)

    def _enabled_record_kinds(self) -> set[str]:
        raw = self.store.data.get("record_detection_kinds")
        if raw is None:
            return set(DEFAULT_RECORD_DETECTION_KINDS)
        kinds = {str(k).strip().lower() for k in (raw or [])}
        return kinds.intersection(RECORD_DETECTION_KIND_IDS)

    def _sensor_kind_id(self, sensor_id: str) -> str:
        state = self.hass.states.get(sensor_id)
        friendly = (
            state.attributes.get("friendly_name") if state is not None else None
        )
        return _classify_kind(
            sensor_id, friendly if isinstance(friendly, str) else None
        )["id"]

    def _kind_enabled_for_recording(self, sensor_id: str) -> bool:
        """Whether this sensor's detection kind may start/extend video capture."""
        enabled = self._enabled_record_kinds()
        if not enabled:
            return False
        return self._sensor_kind_id(sensor_id) in enabled

    def _active_record_sensors(self) -> list[str]:
        """Watched sensors that are ON and allowed to keep a recording session open."""
        active: list[str] = []
        for sid in self._watched_sensors():
            if not self._kind_enabled_for_recording(sid):
                continue
            state = self.hass.states.get(sid)
            if state is not None and _is_active_state(state.state):
                active.append(sid)
        return active

    def _rebuild_open_detections(self) -> None:
        self._open_detections = {}
        for event in self._detection_events:
            if event.get("end") is None and event.get("sensor_id"):
                self._open_detections[str(event["sensor_id"])] = event

    async def _reconcile_open_detections(self) -> None:
        """After reboot, close events whose sensors are no longer active."""
        dirty = False
        now = dt_util.utcnow().isoformat()
        for sensor_id, event in list(self._open_detections.items()):
            state = self.hass.states.get(sensor_id)
            if state is None or not _is_active_state(state.state):
                event["end"] = now
                self._open_detections.pop(sensor_id, None)
                dirty = True
        if dirty:
            await self.hass.async_add_executor_job(self._save_detections_sync)

    async def _open_detection_event(self, sensor_id: str) -> None:
        """Persist a timeline event for every user (independent of recording)."""
        if sensor_id in self._open_detections:
            return
        state = self.hass.states.get(sensor_id)
        friendly = (
            state.attributes.get("friendly_name") if state is not None else None
        )
        kind = _classify_kind(sensor_id, friendly if isinstance(friendly, str) else None)
        event = {
            "id": uuid4().hex,
            "sensor_id": sensor_id,
            "kind": kind["id"],
            "kind_label": kind["label"],
            "cameras": self._cameras_for_sensor(sensor_id),
            "start": dt_util.utcnow().isoformat(),
            "end": None,
        }
        self._detection_events.insert(0, event)
        self._open_detections[sensor_id] = event
        # Bound memory; retention purge also trims by age.
        if len(self._detection_events) > 5000:
            self._detection_events = self._detection_events[:5000]
            self._rebuild_open_detections()
        await self.hass.async_add_executor_job(self._save_detections_sync)

    async def _close_detection_event(self, sensor_id: str) -> None:
        event = self._open_detections.pop(sensor_id, None)
        if not event:
            return
        event["end"] = dt_util.utcnow().isoformat()
        await self.hass.async_add_executor_job(self._save_detections_sync)

    async def _handle_trigger(self, sensor_id: str) -> None:
        # Always log the detection for the shared timeline (survives reboot).
        await self._open_detection_event(sensor_id)

        if not self.store.data.get("record_on_detection", True):
            return
        if not self._kind_enabled_for_recording(sensor_id):
            _LOGGER.debug(
                "Skipping video for %s — kind %s not in record_detection_kinds",
                sensor_id,
                self._sensor_kind_id(sensor_id),
            )
            return
        # Finishing in-flight chunk after clear; restart is checked when end completes.
        if self._ending:
            return
        if self._session and self._session.active:
            if sensor_id not in self._session.trigger_sensors:
                self._session.trigger_sensors.append(sensor_id)
            return
        await self._start_session([sensor_id])

    async def _start_session(self, trigger_sensors: list[str]) -> None:
        cameras = self._all_cameras()
        if not cameras:
            _LOGGER.warning("Detection recording skipped — no cameras available")
            return
        triggers = [sid for sid in trigger_sensors if sid]
        if not triggers:
            return
        session = RecordingSession(
            session_id=datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
            + "_"
            + uuid4().hex[:8],
            started=dt_util.utcnow(),
            trigger_sensors=list(dict.fromkeys(triggers)),
            cameras=cameras,
        )
        self._session = session
        _LOGGER.info(
            "Detection recording session %s started by %s (%s cameras)",
            session.session_id,
            ",".join(session.trigger_sensors),
            len(cameras),
        )
        self._chunk_task = self.hass.async_create_task(self._chunk_loop(session))

    async def _handle_sensor_clear(self, sensor_id: str) -> None:
        await self._close_detection_event(sensor_id)
        if not self._session or not self._session.active or self._ending:
            return
        # Keep recording while any *video-enabled* detection sensor is still on.
        if self._active_record_sensors():
            return
        await self._end_session()

    async def _end_session(self) -> None:
        session = self._session
        if not session:
            return
        if self._ending:
            return
        self._ending = True
        try:
            # Stop scheduling new chunks, but finish the in-flight capture.
            # Cancelling mid-camera.record left empty 0 B stub sessions when
            # sensors cleared in a few seconds (common for person/animal pulses).
            session.active = False
            if self._chunk_task and not self._chunk_task.done():
                try:
                    await self._chunk_task
                except asyncio.CancelledError:
                    pass
            self._chunk_task = None
            session.ended = dt_util.utcnow()
            playable = [clip for clip in session.clips if _clip_has_media(clip)]
            if playable:
                meta = {
                    "session_id": session.session_id,
                    "started": session.started.isoformat(),
                    "ended": session.ended.isoformat() if session.ended else None,
                    "trigger_sensors": session.trigger_sensors,
                    "cameras": session.cameras,
                    "clips": playable,
                    "mode": session.mode,
                }
                self._sessions_meta.insert(0, meta)
                self._sessions_meta = self._sessions_meta[:500]
                await self.hass.async_add_executor_job(self._save_index_sync)
                _LOGGER.info(
                    "Detection recording session %s ended (%s playable clip(s))",
                    session.session_id,
                    len(playable),
                )
            else:
                await self.hass.async_add_executor_job(
                    self._purge_session_files_sync, session.session_id
                )
                _LOGGER.info(
                    "Detection recording session %s discarded — no playable media",
                    session.session_id,
                )
            self._session = None
        finally:
            self._ending = False

        # Sensors may have re-triggered while we finished the last chunk.
        if self.store.data.get("record_on_detection", True):
            still_on = self._active_record_sensors()
            if still_on and not self._session:
                await self._start_session(still_on)

    def _all_cameras(self) -> list[str]:
        cameras = []
        for state in self.hass.states.async_all():
            if state.domain != "camera":
                continue
            if state.state in {STATE_UNAVAILABLE, STATE_UNKNOWN}:
                continue
            cameras.append(state.entity_id)
        return sorted(cameras)

    async def _chunk_loop(self, session: RecordingSession) -> None:
        seq = 0
        try:
            while session.active and self._session is session:
                seq += 1
                await self._capture_chunk(session, seq)
                if not session.active:
                    break
                await asyncio.sleep(RECORD_CHUNK_SECONDS)
        except asyncio.CancelledError:
            raise
        except Exception:  # noqa: BLE001 — keep watcher alive
            _LOGGER.exception("Recording chunk loop failed")

    async def _capture_chunk(self, session: RecordingSession, seq: int) -> None:
        stamp = dt_util.utcnow().strftime("%Y%m%dT%H%M%SZ")
        # Parallel per-camera capture; each call blocks until that clip finishes
        # so we can verify the file (or fall back to snapshot) before indexing.
        results = await asyncio.gather(
            *[
                self._record_or_snapshot(session, camera_id, stamp, seq)
                for camera_id in session.cameras
            ]
        )
        for clip in results:
            if clip:
                session.clips.append(clip)

    async def _record_or_snapshot(
        self,
        session: RecordingSession,
        camera_id: str,
        stamp: str,
        seq: int,
    ) -> dict[str, Any] | None:
        cam_safe = _safe(camera_id.replace("camera.", ""))
        filename = self.record_dir / f"{session.session_id}_{cam_safe}_{seq:03d}_{stamp}.mp4"
        try:
            await self.hass.services.async_call(
                "camera",
                "record",
                {
                    "entity_id": camera_id,
                    "filename": str(filename),
                    "duration": RECORD_CHUNK_SECONDS,
                    "lookback": RECORD_LOOKBACK_SECONDS,
                },
                blocking=True,
            )
            # Non-blocking used to index clips before bytes landed → size 0 →
            # frontend Play filtered them out ("No clips for … selected …").
            if not await self.hass.async_add_executor_job(filename.is_file):
                raise RuntimeError("record finished but file missing")
            size = await self.hass.async_add_executor_job(
                lambda: filename.stat().st_size
            )
            if size <= 0:
                raise RuntimeError("record finished with empty file")
            return {
                "camera_id": camera_id,
                "path": str(filename),
                "url": clip_media_url(filename.name),
                "kind": "video",
                "seq": seq,
                "started": stamp,
                "duration": RECORD_CHUNK_SECONDS,
                "size": int(size),
            }
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning(
                "camera.record failed for %s (%s); falling back to snapshot",
                camera_id,
                err,
            )
            session.mode = "snapshot"
            snap = self.record_dir / f"{session.session_id}_{cam_safe}_{seq:03d}_{stamp}.jpg"
            try:
                await self.hass.services.async_call(
                    "camera",
                    "snapshot",
                    {"entity_id": camera_id, "filename": str(snap)},
                    blocking=True,
                )
                if not await self.hass.async_add_executor_job(snap.is_file):
                    raise RuntimeError("snapshot finished but file missing")
                snap_size = await self.hass.async_add_executor_job(
                    lambda: snap.stat().st_size
                )
                if snap_size <= 0:
                    raise RuntimeError("snapshot finished with empty file")
                return {
                    "camera_id": camera_id,
                    "path": str(snap),
                    "url": clip_media_url(snap.name),
                    "kind": "snapshot",
                    "seq": seq,
                    "started": stamp,
                    "duration": SNAPSHOT_INTERVAL_SECONDS,
                    "size": int(snap_size),
                }
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Snapshot fallback failed for %s", camera_id)
                return None

    def _load_index_sync(self) -> list[dict[str, Any]]:
        if not self._index_path.exists():
            return []
        try:
            data = json.loads(self._index_path.read_text(encoding="utf-8"))
            return data if isinstance(data, list) else []
        except Exception:  # noqa: BLE001
            _LOGGER.warning("Could not read recordings index")
            return []

    def _save_index_sync(self) -> None:
        self.record_dir.mkdir(parents=True, exist_ok=True)
        self._index_path.write_text(
            json.dumps(self._sessions_meta, indent=2), encoding="utf-8"
        )

    def _load_detections_sync(self) -> list[dict[str, Any]]:
        if not self._detections_path.exists():
            return []
        try:
            data = json.loads(self._detections_path.read_text(encoding="utf-8"))
            return data if isinstance(data, list) else []
        except Exception:  # noqa: BLE001
            _LOGGER.warning("Could not read detections log")
            return []

    def _save_detections_sync(self) -> None:
        self.record_dir.mkdir(parents=True, exist_ok=True)
        self._detections_path.write_text(
            json.dumps(self._detection_events, indent=2), encoding="utf-8"
        )

    def list_detections(
        self,
        *,
        start_ms: int | None = None,
        end_ms: int | None = None,
        cameras: list[str] | None = None,
        limit: int = 500,
    ) -> list[dict[str, Any]]:
        """Return shared detection events for the timeline (all HA users)."""
        cam_filter = set(cameras or [])
        start_dt = (
            datetime.fromtimestamp(start_ms / 1000, tz=timezone.utc)
            if start_ms is not None
            else None
        )
        end_dt = (
            datetime.fromtimestamp(end_ms / 1000, tz=timezone.utc)
            if end_ms is not None
            else None
        )
        now = dt_util.utcnow()
        out: list[dict[str, Any]] = []
        for event in self._detection_events:
            ev_start = _parse_iso(event.get("start"))
            if ev_start is None:
                continue
            ev_end = _parse_iso(event.get("end")) or now
            if start_dt and ev_end < start_dt:
                continue
            if end_dt and ev_start > end_dt:
                continue
            ev_cams = [str(c) for c in (event.get("cameras") or [])]
            if cam_filter and ev_cams and not cam_filter.intersection(ev_cams):
                continue
            if cam_filter and not ev_cams:
                # Event has no linked cams yet — still show if any visible cam
                # shares this sensor via current links.
                linked = set(self._cameras_for_sensor(str(event.get("sensor_id") or "")))
                if linked and not cam_filter.intersection(linked):
                    continue
                ev_cams = sorted(linked)
            out.append(
                {
                    **event,
                    "cameras": ev_cams,
                    "start": ev_start.isoformat(),
                    "end": None if event.get("end") is None else ev_end.isoformat(),
                    "active": event.get("end") is None,
                }
            )
            if len(out) >= limit:
                break
        return out

    async def _cleanup_loop(self) -> None:
        try:
            while True:
                await self.async_enforce_retention()
                await asyncio.sleep(3600)
        except asyncio.CancelledError:
            raise

    async def async_enforce_retention(self) -> None:
        days = int(self.store.data.get("retention_days") or 1)
        cutoff = dt_util.utcnow() - timedelta(days=max(1, days))
        kept: list[dict[str, Any]] = []
        removed = 0
        for meta in self._sessions_meta:
            ended = _parse_iso(meta.get("ended") or meta.get("started"))
            if ended is None:
                kept.append(meta)
                continue
            if ended < cutoff:
                for clip in meta.get("clips") or []:
                    path = Path(clip.get("path") or "")
                    if path.is_file():
                        try:
                            path.unlink()
                            removed += 1
                        except OSError:
                            _LOGGER.debug("Could not delete %s", path)
            else:
                kept.append(meta)

        # Purge shared timeline events older than retention (keep open events).
        det_kept: list[dict[str, Any]] = []
        det_removed = 0
        for event in self._detection_events:
            if event.get("end") is None:
                det_kept.append(event)
                continue
            ended = _parse_iso(event.get("end") or event.get("start"))
            if ended is None or ended >= cutoff:
                det_kept.append(event)
            else:
                det_removed += 1

        # Also purge orphaned media files older than cutoff.
        def _purge_orphans() -> int:
            count = 0
            keep_names = {"index.json", "detections.json"}
            for path in self.record_dir.glob("*"):
                if path.name in keep_names or not path.is_file():
                    continue
                mtime = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
                if mtime < cutoff:
                    try:
                        path.unlink()
                        count += 1
                    except OSError:
                        pass
            return count

        removed += await self.hass.async_add_executor_job(_purge_orphans)
        # Drop empty stub sessions left by older builds that cancelled mid-record.
        playable_kept: list[dict[str, Any]] = []
        stubs = 0
        for meta in kept:
            enriched = self._enrich_session({**meta, "active": False})
            if enriched.get("total_bytes", 0) > 0 or any(
                _clip_has_media(c) for c in (enriched.get("clips") or [])
            ):
                playable_kept.append(meta)
            else:
                stubs += 1
                await self.hass.async_add_executor_job(
                    self._purge_session_files_sync, str(meta.get("session_id") or "")
                )
        if stubs:
            _LOGGER.info("Purged %s empty (0 B) stub recording session(s)", stubs)
        self._sessions_meta = playable_kept
        self._detection_events = det_kept
        self._rebuild_open_detections()
        await self.hass.async_add_executor_job(self._save_index_sync)
        await self.hass.async_add_executor_job(self._save_detections_sync)
        if removed or det_removed or stubs:
            _LOGGER.info(
                "Purged %s recording file(s), %s detection event(s), %s stub session(s) (retention=%s day(s))",
                removed,
                det_removed,
                stubs,
                days,
            )

    def list_sessions(self, limit: int = 50) -> list[dict[str, Any]]:
        active = None
        if self._session and (self._session.active or self._ending):
            active = {
                "session_id": self._session.session_id,
                "started": self._session.started.isoformat(),
                "ended": None,
                "trigger_sensors": list(self._session.trigger_sensors),
                "cameras": list(self._session.cameras),
                "clips": list(self._session.clips),
                "mode": self._session.mode,
                "active": True,
            }
        items = []
        if active:
            items.append(self._enrich_session(active))
        for meta in self._sessions_meta:
            enriched = self._enrich_session({**meta, "active": False})
            # Prefer not listing empty stubs as playable saved detections.
            if enriched.get("total_bytes", 0) <= 0 and not enriched.get("active"):
                continue
            items.append(enriched)
        return items[:limit]

    def _cached_file_size(self, path: Path) -> int:
        key = str(path)
        try:
            st = path.stat()
        except OSError:
            self._size_cache.pop(key, None)
            return 0
        cached = self._size_cache.get(key)
        if cached and cached[1] == st.st_mtime:
            return cached[0]
        size = int(st.st_size)
        self._size_cache[key] = (size, st.st_mtime)
        return size

    def _enrich_session(self, meta: dict[str, Any]) -> dict[str, Any]:
        """Attach on-disk file sizes + rewrite clip URLs for authenticated API media."""
        clips_out: list[dict[str, Any]] = []
        total = 0
        for clip in meta.get("clips") or []:
            path = Path(clip.get("path") or "")
            name = path.name
            if not name:
                legacy = str(clip.get("url") or "")
                name = Path(legacy.split("?", 1)[0]).name
            size = self._cached_file_size(path) if path.name else 0
            total += size
            url = clip_media_url(name) if name else str(clip.get("url") or "")
            # Keep a legacy static URL hint for older frontends; prefer API path.
            clips_out.append(
                {
                    **clip,
                    "size": size,
                    "url": url,
                    "legacy_url": (
                        f"{RECORDINGS_URL_BASE}/{name}" if name else clip.get("url")
                    ),
                }
            )
        return {**meta, "clips": clips_out, "total_bytes": total}

    def _purge_session_files_sync(self, session_id: str) -> int:
        """Delete media files for a session id. Returns number removed."""
        if not session_id:
            return 0
        removed = 0
        prefix = f"{session_id}_"
        try:
            for path in self.record_dir.glob(f"{prefix}*"):
                if not path.is_file() or path.name in {"index.json", "detections.json"}:
                    continue
                try:
                    path.unlink(missing_ok=True)
                    removed += 1
                    self._size_cache.pop(str(path), None)
                except OSError:
                    _LOGGER.debug("Could not delete %s", path)
        except OSError:
            _LOGGER.debug("Could not purge orphan files for %s", session_id)
        return removed

    async def async_delete_session(self, session_id: str) -> bool:
        """Delete a saved detection's file set + index entry (site-wide)."""
        found = False
        remaining = []
        for meta in self._sessions_meta:
            if meta.get("session_id") == session_id:
                found = True
                for clip in meta.get("clips") or []:
                    path = Path(clip.get("path") or "")
                    if path.is_file():
                        path.unlink(missing_ok=True)
                        self._size_cache.pop(str(path), None)
                await self.hass.async_add_executor_job(
                    self._purge_session_files_sync, session_id
                )
            else:
                remaining.append(meta)
        self._sessions_meta = remaining
        if found:
            await self.hass.async_add_executor_job(self._save_index_sync)
        return found

    async def async_clear_all(self) -> dict[str, Any]:
        """Admin: delete every saved recording + reset the shared detection timeline."""
        if self._session:
            # Discard in-flight session without indexing.
            session = self._session
            self._ending = True
            try:
                session.active = False
                if self._chunk_task and not self._chunk_task.done():
                    self._chunk_task.cancel()
                    try:
                        await self._chunk_task
                    except asyncio.CancelledError:
                        pass
                self._chunk_task = None
                await self.hass.async_add_executor_job(
                    self._purge_session_files_sync, session.session_id
                )
                self._session = None
            finally:
                self._ending = False

        files_removed = 0
        for meta in list(self._sessions_meta):
            sid = str(meta.get("session_id") or "")
            for clip in meta.get("clips") or []:
                path = Path(clip.get("path") or "")
                if path.is_file():
                    try:
                        path.unlink(missing_ok=True)
                        files_removed += 1
                    except OSError:
                        pass
            files_removed += await self.hass.async_add_executor_job(
                self._purge_session_files_sync, sid
            )

        def _wipe_media() -> int:
            count = 0
            keep = {"index.json", "detections.json"}
            for path in self.record_dir.glob("*"):
                if path.name in keep or not path.is_file():
                    continue
                try:
                    path.unlink(missing_ok=True)
                    count += 1
                except OSError:
                    pass
            return count

        files_removed += await self.hass.async_add_executor_job(_wipe_media)
        events_cleared = len(self._detection_events)
        sessions_cleared = len(self._sessions_meta)
        self._sessions_meta = []
        self._detection_events = []
        self._open_detections = {}
        self._size_cache.clear()
        await self.hass.async_add_executor_job(self._save_index_sync)
        await self.hass.async_add_executor_job(self._save_detections_sync)
        # Re-open timeline events for sensors that are still active.
        for sid in self._watched_sensors():
            state = self.hass.states.get(sid)
            if state is not None and _is_active_state(state.state):
                await self._open_detection_event(sid)
        _LOGGER.info(
            "Cleared all detections (%s sessions, %s events, %s files)",
            sessions_cleared,
            events_cleared,
            files_removed,
        )
        return {
            "sessions_cleared": sessions_cleared,
            "events_cleared": events_cleared,
            "files_removed": files_removed,
        }
