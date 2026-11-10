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
 * Group session clips by camera, sorted by seq for sequential playback.
 * @param {any} hass
 * @param {any} session
 */
export function playbackTracksFromSession(hass, session) {
  /** @type {Map<string, Array<any>>} */
  const byCam = new Map();
  for (const clip of session?.clips || []) {
    const cam = String(clip.camera_id || "");
    if (!cam) continue;
    if (!byCam.has(cam)) byCam.set(cam, []);
    byCam.get(cam).push(clip);
  }

  return [...byCam.entries()]
    .map(([cameraId, clips]) => {
      const ordered = [...clips].sort(
        (a, b) => Number(a.seq || 0) - Number(b.seq || 0)
      );
      return {
        cameraId,
        name:
          hass?.states?.[cameraId]?.attributes?.friendly_name ||
          cameraId.replace(/^camera\./, ""),
        items: ordered.map((clip) => ({
          url: recordingMediaUrl(hass, clip.url),
          kind: clip.kind === "snapshot" ? "snapshot" : "video",
          size: Number(clip.size) || 0,
          seq: Number(clip.seq) || 0,
        })),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
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
