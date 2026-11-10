/** Frontend helpers for shared integration config + recordings. */

import { normalizeSensorLinks } from "./detection-sensors.js";
import { normalizeForceAspectMap } from "./mosaic-pack.js";

/**
 * Load site-wide settings (sensor links, force aspect, retention, recording).
 * @param {any} hass
 */
export async function loadSharedConfig(hass) {
  if (!hass?.callWS) return null;
  try {
    const result = await hass.callWS({ type: "cctv_dashboard/get_settings" });
    if (!result || typeof result !== "object") return null;
    return {
      ...result,
      sensorLinks: normalizeSensorLinks(result.sensor_links || {}),
      forceAspect: normalizeForceAspectMap(result.force_aspect || {}),
    };
  } catch (err) {
    console.warn("CCTV: failed to load shared config", err);
    return null;
  }
}

/**
 * Persist camera↔sensor associations for every HA user (integration store).
 * @param {any} hass
 * @param {Record<string, string[]>} sensorLinks
 */
export async function saveSensorLinks(hass, sensorLinks) {
  if (!hass?.callWS) return null;
  const cleaned = normalizeSensorLinks(sensorLinks);
  return hass.callWS({
    type: "cctv_dashboard/set_sensor_links",
    sensor_links: cleaned,
  });
}

/**
 * Persist per-camera mosaic aspect overrides for every HA user.
 * @param {any} hass
 * @param {Record<string, string>} forceAspect
 */
export async function saveForceAspect(hass, forceAspect) {
  if (!hass?.callWS) return null;
  const cleaned = normalizeForceAspectMap(forceAspect);
  return hass.callWS({
    type: "cctv_dashboard/set_force_aspect",
    force_aspect: cleaned,
  });
}

/**
 * @deprecated Prefer saveSensorLinks / loadSharedConfig. Kept for older call sites.
 * @param {any} hass
 * @param {{ selectedCameras?: string[], sensorLinks?: Record<string, string[]> }} data
 */
export async function syncPanelToIntegration(hass, data) {
  if (!hass?.callWS) return null;
  try {
    const payload = {};
    if (data.sensorLinks) payload.sensor_links = normalizeSensorLinks(data.sensorLinks);
    if (!Object.keys(payload).length) return null;
    return await hass.callWS({
      type: "cctv_dashboard/set_sensor_links",
      ...payload,
    });
  } catch (err) {
    console.warn("CCTV: failed to sync sensor links to integration", err);
    return null;
  }
}

/**
 * @param {any} hass
 */
export async function loadRecordingSettings(hass) {
  return loadSharedConfig(hass);
}

/**
 * @param {any} hass
 * @param {{ retention_days?: number, record_on_detection?: boolean }} patch
 */
export async function saveRecordingSettings(hass, patch) {
  if (!hass?.callWS) return null;
  return hass.callWS({
    type: "cctv_dashboard/set_settings",
    ...patch,
  });
}

/**
 * @param {any} hass
 * @param {number} [limit]
 */
export async function listRecordings(hass, limit = 40) {
  if (!hass?.callWS) return [];
  try {
    const result = await hass.callWS({
      type: "cctv_dashboard/list_recordings",
      limit,
    });
    return result?.sessions || [];
  } catch (err) {
    console.warn("CCTV: failed to list recordings", err);
    return [];
  }
}

/**
 * Shared detection timeline events (all users; survives HA reboot).
 * @param {any} hass
 * @param {{ start?: number, end?: number, cameras?: string[], limit?: number }} [opts]
 */
export async function listDetections(hass, opts = {}) {
  if (!hass?.callWS) return [];
  try {
    const result = await hass.callWS({
      type: "cctv_dashboard/list_detections",
      start: opts.start,
      end: opts.end,
      cameras: opts.cameras,
      limit: opts.limit ?? 500,
    });
    return result?.events || [];
  } catch (err) {
    console.warn("CCTV: failed to list detections", err);
    return [];
  }
}

/**
 * @param {any} hass
 * @param {string} sessionId
 */
export async function deleteRecording(hass, sessionId) {
  if (!hass?.callWS) return false;
  const result = await hass.callWS({
    type: "cctv_dashboard/delete_recording",
    session_id: sessionId,
  });
  return Boolean(result?.deleted);
}

/**
 * @param {string} url
 * @param {any} hass
 */
export function recordingMediaUrl(hass, url) {
  if (!url) return "";
  return typeof hass?.hassUrl === "function" ? hass.hassUrl(url) : url;
}

/**
 * Path-only form of a recording URL (for auth/sign_path).
 * @param {string} url
 */
export function recordingPath(url) {
  if (!url) return "";
  try {
    if (/^https?:\/\//i.test(url)) return new URL(url).pathname;
  } catch {
    /* ignore */
  }
  return String(url).startsWith("/") ? String(url) : `/${url}`;
}

/**
 * Sign a recording path so <video>/<img> can load it (no Authorization header).
 * Root cause of silent playback failure: HA requires auth; media elements cannot
 * send Bearer tokens, so unsigned /cctv_dashboard_recordings/* URLs 401.
 * @param {any} hass
 * @param {string} url
 * @param {number} [expires]
 */
export async function signRecordingUrl(hass, url, expires = 3600) {
  if (!url) return "";
  const path = recordingPath(url);
  if (!hass?.callWS) return recordingMediaUrl(hass, path);
  try {
    const result = await hass.callWS({
      type: "auth/sign_path",
      path,
      expires,
    });
    const signed = result?.path || result;
    if (!signed) return recordingMediaUrl(hass, path);
    return typeof hass.hassUrl === "function" ? hass.hassUrl(signed) : signed;
  } catch (err) {
    console.warn("CCTV: sign_path failed, using unsigned URL", path, err);
    return recordingMediaUrl(hass, path);
  }
}

/**
 * Sign every clip URL on playback tracks (mutates items in place).
 * @param {any} hass
 * @param {Array<{ items: Array<{ url: string, path?: string }> }>} tracks
 */
export async function signPlaybackTracks(hass, tracks) {
  await Promise.all(
    (tracks || []).flatMap((track) =>
      (track.items || []).map(async (item) => {
        const raw = item.path || item.url;
        item.path = recordingPath(raw);
        item.url = await signRecordingUrl(hass, item.path);
      })
    )
  );
  return tracks;
}
