/** Persist panel settings in Home Assistant user data (no YAML). */

import { normalizeSensorLinks } from "./detection-sensors.js";
import { syncPanelToIntegration } from "./recordings-api.js";

export const PANEL_SELECTION_KEY = "cctv_dashboard";

/**
 * @typedef {{ selectedCameras: string[], sensorLinks: Record<string, string[]> }} PanelData
 */

/**
 * @param {any} hass
 * @returns {Promise<PanelData | null>}
 */
export async function loadPanelData(hass) {
  if (!hass?.callWS) return null;
  try {
    const result = await hass.callWS({
      type: "frontend/get_user_data",
      key: PANEL_SELECTION_KEY,
    });
    const value = result?.value ?? result;
    if (!value || typeof value !== "object") return null;

    const selected = Array.isArray(value.selectedCameras)
      ? value.selectedCameras.map(String).filter((id) => id.startsWith("camera."))
      : [];

    return {
      selectedCameras: selected,
      sensorLinks: normalizeSensorLinks(value.sensorLinks),
    };
  } catch (err) {
    console.warn("CCTV: failed to load panel data", err);
    return null;
  }
}

/**
 * @param {import("home-assistant-js-websocket").HomeAssistant | any} hass
 * @returns {Promise<string[] | null>}
 */
export async function loadPanelSelection(hass) {
  const data = await loadPanelData(hass);
  return data ? data.selectedCameras : null;
}

/**
 * @param {any} hass
 * @param {Partial<PanelData>} patch
 * @param {PanelData} [current]
 */
export async function savePanelData(hass, patch, current) {
  if (!hass?.callWS) return;

  const base = current || (await loadPanelData(hass)) || {
    selectedCameras: [],
    sensorLinks: {},
  };

  const selectedCameras = [
    ...new Set(
      (patch.selectedCameras ?? base.selectedCameras)
        .map(String)
        .filter((id) => id.startsWith("camera."))
    ),
  ].slice(0, 4);

  const sensorLinks = normalizeSensorLinks(
    patch.sensorLinks !== undefined ? patch.sensorLinks : base.sensorLinks
  );

  const saved = { selectedCameras, sensorLinks };

  try {
    await hass.callWS({
      type: "frontend/set_user_data",
      key: PANEL_SELECTION_KEY,
      value: saved,
    });
  } catch (err) {
    console.warn("CCTV: failed to save panel data", err);
    throw err;
  }

  // Backend detection recorder needs the same links (works with panel closed).
  await syncPanelToIntegration(hass, saved);

  return saved;
}

/**
 * @param {any} hass
 * @param {string[]} selectedCameras
 */
export async function savePanelSelection(hass, selectedCameras) {
  return savePanelData(hass, { selectedCameras });
}
