/** Frontend helpers for shared integration config + recordings. */

import { normalizeSensorLinks } from "./detection-sensors.js";

/**
 * Load site-wide settings (sensor links, retention, recording toggle).
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
