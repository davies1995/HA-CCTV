/** Frontend helpers for shared integration config + recordings. */

import { normalizeSensorLinks } from "./detection-sensors.js";
import { normalizeForceAspectMap } from "./mosaic-pack.js";
import { normalizeCameraQualityMap } from "./quality.js";
import {
  normalizeStreamGroups,
  syncSensorLinksAcrossGroups,
} from "./stream-groups.js";

/**
 * Load site-wide settings (sensor links, force aspect, quality, retention).
 * @param {any} hass
 */
export async function loadSharedConfig(hass) {
  if (!hass?.callWS) return null;
  try {
    const result = await hass.callWS({ type: "cctv_dashboard/get_settings" });
    if (!result || typeof result !== "object") return null;
    const streamGroups = normalizeStreamGroups(result.stream_groups || []);
    const sensorLinks = syncSensorLinksAcrossGroups(
      normalizeSensorLinks(result.sensor_links || {}),
      streamGroups
    );
    return {
      ...result,
      sensorLinks,
      streamGroups,
      forceAspect: normalizeForceAspectMap(result.force_aspect || {}),
      cameraQuality: normalizeCameraQualityMap(result.camera_quality || {}),
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
 * Persist physical-camera stream groups (shared for all HA users).
 * @param {any} hass
 * @param {import("./stream-groups.js").StreamGroup[]} groups
 */
export async function saveStreamGroups(hass, groups) {
  if (!hass?.callWS) return null;
  const cleaned = normalizeStreamGroups(groups);
  return hass.callWS({
    type: "cctv_dashboard/set_stream_groups",
    stream_groups: cleaned,
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
 * Persist shared per-camera quality + force-aspect (all HA users).
 * @param {any} hass
 * @param {{ cameraQuality?: Record<string, string>, forceAspect?: Record<string, string> }} prefs
 */
export async function saveCameraPrefs(hass, prefs) {
  if (!hass?.callWS) return null;
  /** @type {Record<string, any>} */
  const payload = { type: "cctv_dashboard/set_camera_prefs" };
  if (prefs.cameraQuality !== undefined) {
    payload.camera_quality = normalizeCameraQualityMap(prefs.cameraQuality);
  }
  if (prefs.forceAspect !== undefined) {
    payload.force_aspect = normalizeForceAspectMap(prefs.forceAspect);
  }
  return hass.callWS(payload);
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
 * @param {{
 *   retention_days?: number,
 *   record_on_detection?: boolean,
 *   record_detection_kinds?: string[],
 * }} patch
 */
export async function saveRecordingSettings(hass, patch) {
  if (!hass?.callWS) return null;
  return hass.callWS({
    type: "cctv_dashboard/set_settings",
    ...patch,
  });
}

/**
 * Per-user: enable/disable Companion/HA notifications when a detection is recorded.
 * @param {any} hass
 * @param {boolean} enabled
 */
export async function saveUserNotifyPreference(hass, enabled) {
  if (!hass?.callWS) return null;
  return hass.callWS({
    type: "cctv_dashboard/set_user_notify",
    notify_on_detection: Boolean(enabled),
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
 * Admin-only: delete every saved detection and reset the shared timeline.
 * @param {any} hass
 * @returns {Promise<{ sessions_cleared?: number, events_cleared?: number, files_removed?: number } | null>}
 */
export async function clearAllDetections(hass) {
  if (!hass?.callWS) return null;
  return hass.callWS({ type: "cctv_dashboard/clear_detections" });
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
 * Strips query (e.g. prior authSig) so the signed claims match request.path.
 * @param {string} url
 */
export function recordingPath(url) {
  if (!url) return "";
  let path = String(url);
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  } catch {
    /* ignore */
  }
  path = path.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = `/${path}`;
  // Prefer the authenticated API media route; rewrite legacy static URLs.
  const legacy = "/cctv_dashboard_recordings/";
  if (path.startsWith(legacy)) {
    const name = path.slice(legacy.length).split("/").pop();
    if (name) path = `/api/cctv_dashboard/media/${name}`;
  }
  return path;
}

/**
 * auth/sign_path must receive the HTTP media route — never a filesystem path.
 * Clip objects often carry `path` as an on-disk absolute path; prefer `url`.
 * @param {{ url?: string, path?: string, filePath?: string } | null | undefined} item
 */
export function mediaApiPathFromClip(item) {
  const api = "/api/cctv_dashboard/media/";
  const legacy = "/cctv_dashboard_recordings/";
  const candidates = [item?.url, item?.path, item?.filePath];
  for (const raw of candidates) {
    if (!raw) continue;
    let value = String(raw);
    try {
      if (/^https?:\/\//i.test(value)) value = new URL(value).pathname;
    } catch {
      /* ignore */
    }
    value = value.split("?")[0].split("#")[0];
    if (value.includes(api) || value.includes(legacy)) {
      return recordingPath(value);
    }
  }
  for (const raw of candidates) {
    if (!raw) continue;
    const name = String(raw)
      .split("?")[0]
      .split("/")
      .pop();
    if (name && /\.(mp4|m4v|webm|jpg|jpeg|png|webp)$/i.test(name)) {
      return `${api}${name}`;
    }
  }
  return recordingPath(item?.url || item?.path || "");
}

/**
 * Sign a recording path so <video>/<img> can load it (no Authorization header).
 * Unsigned API/static media returns 401 HTML → browser MEDIA_ERR_SRC_NOT_SUPPORTED.
 * @param {any} hass
 * @param {string} url
 * @param {number} [expires]
 */
export async function signRecordingUrl(hass, url, expires = 3600) {
  if (!url) return "";
  const path = recordingPath(url);
  if (!path) return "";
  if (!hass?.callWS) {
    throw new Error("Home Assistant WebSocket unavailable for auth/sign_path");
  }
  const result = await hass.callWS({
    type: "auth/sign_path",
    path,
    expires,
  });
  const signed = result?.path;
  if (typeof signed !== "string" || !signed.includes("authSig")) {
    throw new Error(`auth/sign_path returned no authSig for ${path}`);
  }
  // hassUrl must preserve the ?authSig= query string.
  return typeof hass.hassUrl === "function" ? hass.hassUrl(signed) : signed;
}

/**
 * Sign every clip URL on playback tracks (mutates items in place).
 * Skips empty files (size 0) which are unplayable.
 * @param {any} hass
 * @param {Array<{ items: Array<{ url: string, path?: string, size?: number, kind?: string }> }>} tracks
 */
export async function signPlaybackTracks(hass, tracks) {
  const jobs = [];
  for (const track of tracks || []) {
    const nextItems = [];
    for (const item of track.items || []) {
      if (Number(item.size) === 0 && item.kind === "video") {
        console.warn("CCTV: skipping empty video clip", item.path || item.url);
        continue;
      }
      nextItems.push(item);
      jobs.push(
        (async () => {
          // Keep on-disk path separately; sign the HTTP media API route.
          if (item.filePath == null && item.path && !String(item.path).includes("/api/")) {
            item.filePath = item.path;
          }
          item.path = mediaApiPathFromClip(item);
          item.url = await signRecordingUrl(hass, item.path);
        })()
      );
    }
    track.items = nextItems;
  }
  await Promise.all(jobs);
  return tracks;
}
