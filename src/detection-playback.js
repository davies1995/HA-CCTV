/** Helpers for saved-detection summaries and mosaic playback. */

import { classifyDetectionSensor } from "./detection-sensors.js";
import { recordingMediaUrl } from "./recordings-api.js";

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
    const cam = String(clip.camera_id || "");
    if (!cam) continue;
    if (!byCam.has(cam)) byCam.set(cam, []);
    byCam.get(cam).push(clip);
  }

  const ids =
    cameraIds && cameraIds.length
      ? cameraIds.map(String)
      : [...byCam.keys()].sort((a, b) => {
          const na =
            hass?.states?.[a]?.attributes?.friendly_name ||
            a.replace(/^camera\./, "");
          const nb =
            hass?.states?.[b]?.attributes?.friendly_name ||
            b.replace(/^camera\./, "");
          return na.localeCompare(nb);
        });

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
      items: ordered
        .filter((clip) => {
          // Empty/incomplete camera.record files are unplayable in <video>.
          if (clip.kind === "snapshot") return true;
          return Number(clip.size) > 0 || !("size" in (clip || {}));
        })
        .map((clip) => {
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
