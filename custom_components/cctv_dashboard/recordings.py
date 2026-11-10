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
    DOMAIN,
    RECORD_CHUNK_SECONDS,
    RECORD_LOOKBACK_SECONDS,
    RECORDINGS_URL_BASE,
    SNAPSHOT_INTERVAL_SECONDS,
)
from .storage import PanelStore

_LOGGER = logging.getLogger(__name__)

ON_STATES = {STATE_ON, "true", "detected", "active", "home", "1"}
SAFE_NAME = re.compile(r"[^a-zA-Z0-9._-]+")


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
        self._index_path = self.record_dir / "index.json"
        self._sessions_meta: list[dict[str, Any]] = []

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
        self._rebind_listeners()
        self._cleanup_task = self.hass.async_create_task(self._cleanup_loop())
        _LOGGER.info(
            "CCTV recordings ready at %s (retention=%sd)",
            self.record_dir,
            self.store.data.get("retention_days"),
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
            self.hass.async_create_task(self._handle_clear())

    async def _handle_trigger(self, sensor_id: str) -> None:
        if not self.store.data.get("record_on_detection", True):
            return
        if self._session and self._session.active:
            if sensor_id not in self._session.trigger_sensors:
                self._session.trigger_sensors.append(sensor_id)
            return
        cameras = self._all_cameras()
        if not cameras:
            _LOGGER.warning("Detection trigger ignored — no cameras available")
            return
        session = RecordingSession(
            session_id=datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
            + "_"
            + uuid4().hex[:8],
            started=dt_util.utcnow(),
            trigger_sensors=[sensor_id],
            cameras=cameras,
        )
        self._session = session
        _LOGGER.info(
            "Detection recording session %s started by %s (%s cameras)",
            session.session_id,
            sensor_id,
            len(cameras),
        )
        self._chunk_task = self.hass.async_create_task(self._chunk_loop(session))

    async def _handle_clear(self) -> None:
        if not self._session or not self._session.active:
            return
        # End only when every watched sensor is clear.
        if any(
            _is_active_state(self.hass.states.get(sid).state)
            if self.hass.states.get(sid)
            else False
            for sid in self._watched_sensors()
        ):
            return
        await self._end_session()

    async def _end_session(self) -> None:
        session = self._session
        if not session:
            return
        session.active = False
        session.ended = dt_util.utcnow()
        if self._chunk_task and not self._chunk_task.done():
            self._chunk_task.cancel()
            try:
                await self._chunk_task
            except asyncio.CancelledError:
                pass
        self._chunk_task = None
        meta = {
            "session_id": session.session_id,
            "started": session.started.isoformat(),
            "ended": session.ended.isoformat() if session.ended else None,
            "trigger_sensors": session.trigger_sensors,
            "cameras": session.cameras,
            "clips": session.clips,
            "mode": session.mode,
        }
        self._sessions_meta.insert(0, meta)
        self._sessions_meta = self._sessions_meta[:500]
        await self.hass.async_add_executor_job(self._save_index_sync)
        _LOGGER.info("Detection recording session %s ended", session.session_id)
        self._session = None

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
        for camera_id in session.cameras:
            clip = await self._record_or_snapshot(session, camera_id, stamp, seq)
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
                blocking=False,
            )
            return {
                "camera_id": camera_id,
                "path": str(filename),
                "url": f"{RECORDINGS_URL_BASE}/{filename.name}",
                "kind": "video",
                "seq": seq,
                "started": stamp,
                "duration": RECORD_CHUNK_SECONDS,
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
                return {
                    "camera_id": camera_id,
                    "path": str(snap),
                    "url": f"{RECORDINGS_URL_BASE}/{snap.name}",
                    "kind": "snapshot",
                    "seq": seq,
                    "started": stamp,
                    "duration": SNAPSHOT_INTERVAL_SECONDS,
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
            ended_raw = meta.get("ended") or meta.get("started")
            try:
                ended = datetime.fromisoformat(str(ended_raw).replace("Z", "+00:00"))
            except Exception:  # noqa: BLE001
                kept.append(meta)
                continue
            if ended.tzinfo is None:
                ended = ended.replace(tzinfo=timezone.utc)
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
        # Also purge orphaned files older than cutoff.
        def _purge_orphans() -> int:
            count = 0
            for path in self.record_dir.glob("*"):
                if path.name == "index.json" or not path.is_file():
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
        self._sessions_meta = kept
        await self.hass.async_add_executor_job(self._save_index_sync)
        if removed:
            _LOGGER.info("Purged %s recording files older than %s day(s)", removed, days)

    def list_sessions(self, limit: int = 50) -> list[dict[str, Any]]:
        active = None
        if self._session and self._session.active:
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
            items.append(active)
        for meta in self._sessions_meta:
            items.append({**meta, "active": False})
        return items[:limit]

    async def async_delete_session(self, session_id: str) -> bool:
        found = False
        remaining = []
        for meta in self._sessions_meta:
            if meta.get("session_id") == session_id:
                found = True
                for clip in meta.get("clips") or []:
                    path = Path(clip.get("path") or "")
                    if path.is_file():
                        path.unlink(missing_ok=True)
            else:
                remaining.append(meta)
        self._sessions_meta = remaining
        if found:
            await self.hass.async_add_executor_job(self._save_index_sync)
        return found
