/** Helpers for saved-detection summaries and mosaic playback. */

import { classifyDetectionSensor } from "./detection-sensors.js";
import { recordingMediaUrl } from "./recordings-api.js";
import { camerasForSensorExpanded } from "./stream-groups.js";

/** Border colors — keep in sync with styles.js `.kind-*` / timeline marks. */
export const DETECTION_KIND_COLORS = {
  person: "#5eb1ff",
  car: "#f0b45a",
  animal: "#7dcf8a",
  package: "#c9a0ff",
  bicycle: "#67d5c8",
  motion: "#e6d36a",
  other: "#8b9aab",
};

/**
 * @param {string} kindId
 */
export function detectionKindColor(kindId) {
  const id = String(kindId || "").toLowerCase();
  return DETECTION_KIND_COLORS[id] || DETECTION_KIND_COLORS.other;
}

/**
 * Cameras linked to any of the given trigger sensors (site-wide sensor_links).
 * Expands physical-camera stream groups when provided.
 * @param {Record<string, string[]> | null | undefined} sensorLinks
 * @param {string[]} triggerSensors
 * @param {import("./stream-groups.js").StreamGroup[] | null | undefined} [streamGroups]
 * @returns {string[]}
 */
export function camerasForTriggerSensors(
  sensorLinks,
  triggerSensors,
  streamGroups = null
) {
  const triggers = new Set(
    (triggerSensors || []).map(String).filter(Boolean)
  );
  if (!triggers.size) return [];
  if (streamGroups?.length) {
    const out = new Set();
    for (const sid of triggers) {
      for (const cam of camerasForSensorExpanded(sensorLinks, streamGroups, sid)) {
        out.add(cam);
      }
    }
    return [...out];
  }
  const out = [];
  for (const [cameraId, sensors] of Object.entries(sensorLinks || {})) {
    if (!String(cameraId).startsWith("camera.")) continue;
    if ((sensors || []).some((sid) => triggers.has(String(sid)))) {
      out.push(cameraId);
    }
  }
  return out;
}

/**
 * Per-camera highlight while playing back a detection: which mosaic tiles are
 * the trigger cams, and which event-type color to use for their border.
 *
 * Overlay-only — callers must not rewrite tile class/style or video src/kick.
 *
 * @param {any} hass
 * @param {any} session
 * @param {Record<string, string[]> | null | undefined} sensorLinks
 * @param {{ kind?: { id?: string }, cameras?: string[], sensors?: Array<{ entityId?: string }> } | null} [eventDetail]
 * @param {import("./stream-groups.js").StreamGroup[] | null | undefined} [streamGroups]
 * @returns {Record<string, { kindId: string, color: string }>}
 */
export function triggerHighlightsForPlayback(
  hass,
  session,
  sensorLinks,
  eventDetail = null,
  streamGroups = null
) {
  /** @type {Record<string, { kindId: string, color: string }>} */
  const byCamera = {};

  const assign = (cameraId, kindId) => {
    const cam = String(cameraId || "");
    if (!cam.startsWith("camera.") || byCamera[cam]) return;
    const id = String(kindId || "other").toLowerCase();
    byCamera[cam] = { kindId: id, color: detectionKindColor(id) };
  };

  // Timeline Play carries kind + linked cameras when available.
  const eventKindId = eventDetail?.kind?.id;
  if (eventKindId && Array.isArray(eventDetail?.cameras)) {
    for (const cameraId of eventDetail.cameras) {
      assign(cameraId, eventKindId);
    }
  }

  const triggerSensors = [
    ...(session?.trigger_sensors || []),
    ...((eventDetail?.sensors || [])
      .map((s) => s?.entityId)
      .filter(Boolean)),
  ];

  for (const sensorId of triggerSensors) {
    const kind = classifyDetectionSensor(
      sensorId,
      hass?.states?.[sensorId]
    );
    for (const cameraId of camerasForTriggerSensors(
      sensorLinks,
      [sensorId],
      streamGroups
    )) {
      assign(cameraId, kind.id);
    }
  }

  return byCamera;
}

/**
 * @param {number} bytes
 */
export function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10 * 1024 ? 1 : 0)} KB`;
  if (n < 1024 * 1024 * 1024) {
    return `${(n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0)} MB`;
  }
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Labels for what was detected from trigger sensor entity ids.
 * @param {any} hass
 * @param {string[]} triggerSensors
 */
export function detectionLabelsFromTriggers(hass, triggerSensors) {
  const labels = [];
  const seen = new Set();
  for (const entityId of triggerSensors || []) {
    const stateObj = hass?.states?.[entityId];
    const kind = classifyDetectionSensor(entityId, stateObj);
    if (seen.has(kind.id)) continue;
    seen.add(kind.id);
    labels.push(kind.label);
  }
  return labels.length ? labels : ["Detection"];
}

/**
 * @param {any} session
 */
export function sessionTotalBytes(session) {
  if (Number.isFinite(session?.total_bytes)) return Number(session.total_bytes);
  return (session?.clips || []).reduce((sum, c) => sum + (Number(c.size) || 0), 0);
}

/**
 * Parse clip/session stamp to epoch ms.
 * Accepts ISO strings or compact `YYYYMMDDTHHMMSSZ`.
 * @param {string | number | Date | null | undefined} value
 */
export function parseClipStartedMs(value) {
  if (value == null || value === "") return NaN;
  if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
  if (value instanceof Date) return value.getTime();
  const raw = String(value).trim();
  const compact = raw.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/i
  );
  if (compact) {
    const iso = `${compact[1]}-${compact[2]}-${compact[3]}T${compact[4]}:${compact[5]}:${compact[6]}Z`;
    return Date.parse(iso);
  }
  return Date.parse(raw);
}

/**
 * Absolute start/end for a clip item (ms).
 * @param {{ started?: string, duration?: number }} clip
 */
export function clipTimeBounds(clip) {
  const start = parseClipStartedMs(clip?.started);
  const durationSec = Number(clip?.duration);
  const durationMs = Number.isFinite(durationSec) && durationSec > 0
    ? durationSec * 1000
    : 30_000;
  return {
    start,
    end: Number.isFinite(start) ? start + durationMs : NaN,
    durationMs,
  };
}

/**
 * @param {any} clip
 * @returns {boolean}
 */
export function clipIsPlayable(clip) {
  if (!clip) return false;
  // Empty/incomplete camera.record or snapshot files are unplayable.
  if ("size" in (clip || {}) && Number(clip.size) <= 0) return false;
  if (clip.kind === "snapshot") return true;
  return Number(clip.size) > 0 || !("size" in (clip || {}));
}

/**
 * When a camera has both mp4 and snapshot chunks, prefer real video for Play.
 * @param {any[]} clips
 * @returns {any[]}
 */
export function preferVideoClips(clips) {
  const list = Array.isArray(clips) ? clips : [];
  const videos = list.filter((clip) => clip && clip.kind !== "snapshot");
  return videos.length ? videos : list;
}

/**
 * True when a saved detection has at least one playable clip / non-zero bytes.
 * @param {any} session
 */
export function sessionIsPlayable(session) {
  if (!session || session.active) return false;
  if (sessionTotalBytes(session) > 0) return true;
  return (session.clips || []).some(clipIsPlayable);
}

/**
 * Resolve camera.* id from a clip (index field, else filename hint).
 * @param {any} clip
 * @returns {string}
 */
export function clipCameraId(clip) {
  const direct = String(clip?.camera_id || "").trim();
  if (direct.startsWith("camera.")) return direct;
  // Filename: {session_id}_{cam_safe}_{seq}_{stamp}.(mp4|jpg)
  // session_id is YYYYMMDDTHHMMSSZ_<8 hex>.
  const name = String(clip?.path || clip?.url || "")
    .split("?")[0]
    .split("/")
    .pop();
  if (!name) return "";
  const match = name.match(
    /^(\d{8}T\d{6}Z_[a-f0-9]{8})_(.+)_(\d{3})_(\d{8}T\d{6}Z)\.(?:mp4|jpg|jpeg|webp)$/i
  );
  if (!match) return "";
  return `camera.${match[2]}`;
}

/**
 * Cameras in a session that have at least one playable clip.
 * @param {any} session
 * @returns {string[]}
 */
export function playableCameraIdsFromSession(session) {
  /** @type {Map<string, boolean>} */
  const found = new Map();
  for (const clip of session?.clips || []) {
    const cam = clipCameraId(clip);
    if (!cam || found.get(cam)) continue;
    if (clipIsPlayable(clip)) found.set(cam, true);
  }
  // Prefer session.cameras order when present (recording order).
  const preferred = Array.isArray(session?.cameras)
    ? session.cameras.map(String).filter((id) => found.has(id))
    : [];
  if (preferred.length) {
    for (const id of found.keys()) {
      if (!preferred.includes(id)) preferred.push(id);
    }
    return preferred;
  }
  return [...found.keys()];
}

/**
 * Choose which cameras to play for a saved detection.
 * Prefers the user's mosaic selection (same slots) when those cams have clips;
 * if selection is empty or none of the selected cams have playable clips, fall
 * back to cameras that do have clips (capped at maxStreams).
 *
 * @param {any} session
 * @param {string[] | null | undefined} visibleIds
 * @param {number} [maxStreams]
 * @returns {{ cameraIds: string[], usedFallback: boolean, reason: "" | "empty-selection" | "no-selected-clips" }}
 */
export function resolvePlaybackCameraIds(session, visibleIds, maxStreams = 4) {
  const max = Math.max(1, Number(maxStreams) || 4);
  const playable = playableCameraIdsFromSession(session);
  const playableSet = new Set(playable);
  const selected = (visibleIds || [])
    .map(String)
    .filter((id) => id.startsWith("camera."));

  if (selected.length) {
    const matched = selected.filter((id) => playableSet.has(id)).slice(0, max);
    if (matched.length) {
      return { cameraIds: matched, usedFallback: false, reason: "" };
    }
    return {
      cameraIds: playable.slice(0, max),
      usedFallback: true,
      reason: "no-selected-clips",
    };
  }

  return {
    cameraIds: playable.slice(0, max),
    usedFallback: true,
    reason: "empty-selection",
  };
}

/**
 * Group session clips by camera.
 * When `cameraIds` is provided, return tracks in that exact order (visible mosaic
 * order) and only for those cameras — never extra cams from the recording.
 * @param {any} hass
 * @param {any} session
 * @param {string[] | null} [cameraIds]
 */
export function playbackTracksFromSession(hass, session, cameraIds = null) {
  /** @type {Map<string, Array<any>>} */
  const byCam = new Map();
  for (const clip of session?.clips || []) {
    const cam = clipCameraId(clip);
    if (!cam) continue;
    if (!byCam.has(cam)) byCam.set(cam, []);
    byCam.get(cam).push(clip);
  }

  let ids;
  if (cameraIds && cameraIds.length) {
    ids = cameraIds.map(String);
  } else {
    const playableIds = playableCameraIdsFromSession(session);
    ids = playableIds.length
      ? playableIds
      : [...byCam.keys()].sort((a, b) => {
          const na =
            hass?.states?.[a]?.attributes?.friendly_name ||
            a.replace(/^camera\./, "");
          const nb =
            hass?.states?.[b]?.attributes?.friendly_name ||
            b.replace(/^camera\./, "");
          return na.localeCompare(nb);
        });
  }

  return ids.map((cameraId) => {
    const clips = byCam.get(cameraId) || [];
    const ordered = [...clips].sort(
      (a, b) => Number(a.seq || 0) - Number(b.seq || 0)
    );
    return {
      cameraId,
      name:
        hass?.states?.[cameraId]?.attributes?.friendly_name ||
        cameraId.replace(/^camera\./, ""),
      items: preferVideoClips(ordered.filter(clipIsPlayable)).map((clip) => {
        const bounds = clipTimeBounds(clip);
        const path = String(clip.url || "");
        return {
          path,
          // Unsigned until Play; signRecordingUrl is required for <video src>.
          url: recordingMediaUrl(hass, path),
          kind: clip.kind === "snapshot" ? "snapshot" : "video",
          size: Number(clip.size) || 0,
          seq: Number(clip.seq) || 0,
          started: clip.started,
          startedMs: bounds.start,
          durationMs: bounds.durationMs,
          endMs: bounds.end,
          fallback_reason: clip.fallback_reason || "",
          filePath: clip.path || "",
        };
      }),
    };
  });
}

/**
 * Pick clip index + seek seconds so playback aligns to absolute event time.
 * @param {{ items: Array<any> }} track
 * @param {number} atMs
 */
export function clipPositionAtTime(track, atMs) {
  const items = track?.items || [];
  if (!items.length || !Number.isFinite(atMs)) {
    return { index: 0, seekSec: 0 };
  }

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const start = Number(item.startedMs);
    const end = Number(item.endMs);
    if (!Number.isFinite(start)) continue;
    if (atMs < start) {
      return { index: i, seekSec: 0 };
    }
    if (!Number.isFinite(end) || atMs < end) {
      const seekSec = Math.max(0, (atMs - start) / 1000);
      return { index: i, seekSec };
    }
  }

  return { index: Math.max(0, items.length - 1), seekSec: 0 };
}

/**
 * Session / timeline window for synced multi-cam playback.
 * @param {any} session
 * @param {{ start?: number, end?: number } | null} [event]
 */
export function playbackWindow(session, event = null) {
  const eventStart = Number(event?.start);
  const eventEnd = Number(event?.end);
  const sessionStart = parseClipStartedMs(session?.started);
  const sessionEnd = parseClipStartedMs(session?.ended || session?.started);

  const start = Number.isFinite(eventStart)
    ? eventStart
    : sessionStart;
  let end = Number.isFinite(eventEnd) ? eventEnd : sessionEnd;
  if (!Number.isFinite(end) && Number.isFinite(start)) {
    end = start + 60_000;
  }
  if (Number.isFinite(start) && Number.isFinite(end) && end < start) {
    end = start;
  }
  return { start, end };
}

/**
 * Find the best saved recording session overlapping a timeline event window.
 * @param {any[]} sessions
 * @param {{ start: number, end: number, sensors?: Array<{entityId:string}> }} event
 */
export function findSessionForTimelineEvent(sessions, event) {
  if (!sessions?.length || !event) return null;
  const start = Number(event.start);
  const end = Number(event.end);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;

  const sensorIds = new Set(
    (event.sensors || []).map((s) => s.entityId).filter(Boolean)
  );

  let best = null;
  let bestScore = -1;
  for (const session of sessions) {
    if (session.active) continue;
    if (!(session.clips || []).length) continue;
    const sStart = Date.parse(session.started);
    const sEnd = Date.parse(session.ended || session.started);
    if (!Number.isFinite(sStart) || !Number.isFinite(sEnd)) continue;
    const overlap = Math.min(end, sEnd) - Math.max(start, sStart);
    if (overlap <= 0) continue;

    let score = overlap;
    const triggers = session.trigger_sensors || [];
    if (sensorIds.size && triggers.some((id) => sensorIds.has(id))) {
      score += 60_000;
    }
    if (score > bestScore) {
      bestScore = score;
      best = session;
    }
  }
  return best;
}
