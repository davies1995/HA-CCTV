/** Persist panel camera selection in Home Assistant user data (no YAML). */

export const PANEL_SELECTION_KEY = "cctv_dashboard";

/**
 * @param {import("home-assistant-js-websocket").HomeAssistant | any} hass
 * @returns {Promise<string[] | null>}
 */
export async function loadPanelSelection(hass) {
  if (!hass?.callWS) return null;
  try {
    const result = await hass.callWS({
      type: "frontend/get_user_data",
      key: PANEL_SELECTION_KEY,
    });
    const value = result?.value ?? result;
    const selected = value?.selectedCameras;
    if (!Array.isArray(selected)) return null;
    return selected.map(String).filter((id) => id.startsWith("camera."));
  } catch (err) {
    console.warn("CCTV: failed to load panel selection", err);
    return null;
  }
}

/**
 * @param {any} hass
 * @param {string[]} selectedCameras
 */
export async function savePanelSelection(hass, selectedCameras) {
  if (!hass?.callWS) return;
  const cleaned = [...new Set(selectedCameras.map(String))]
    .filter((id) => id.startsWith("camera."))
    .slice(0, 4);
  try {
    await hass.callWS({
      type: "frontend/set_user_data",
      key: PANEL_SELECTION_KEY,
      value: { selectedCameras: cleaned },
    });
  } catch (err) {
    console.warn("CCTV: failed to save panel selection", err);
    throw err;
  }
}
