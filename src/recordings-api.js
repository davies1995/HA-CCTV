/** Frontend helpers for CCTV recording settings + session list. */

/**
 * Sync selected cameras + sensor links so the integration can watch detections
 * even when the panel is closed.
 * @param {any} hass
 * @param {{ selectedCameras?: string[], sensorLinks?: Record<string, string[]> }} data
 */
export async function syncPanelToIntegration(hass, data) {
  if (!hass?.callWS) return null;
  try {
    return await hass.callWS({
      type: "cctv_dashboard/sync_panel",
      selected_cameras: data.selectedCameras,
      sensor_links: data.sensorLinks,
    });
  } catch (err) {
    console.warn("CCTV: failed to sync panel to integration", err);
    return null;
  }
}

/**
 * @param {any} hass
 */
export async function loadRecordingSettings(hass) {
  if (!hass?.callWS) return null;
  try {
    return await hass.callWS({ type: "cctv_dashboard/get_settings" });
  } catch (err) {
    console.warn("CCTV: failed to load recording settings", err);
    return null;
  }
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
