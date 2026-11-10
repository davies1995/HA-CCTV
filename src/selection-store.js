/** Per-user panel prefs in Home Assistant frontend user data (no YAML). */

export const PANEL_SELECTION_KEY = "cctv_dashboard";

/**
 * @typedef {{ selectedCameras: string[] }} UserPanelData
 */

/**
 * Load this user's visible-camera selection.
 * Also returns legacy `sensorLinks` if present (for one-time migration to shared store).
 * @param {any} hass
 * @returns {Promise<{ selectedCameras: string[], legacySensorLinks: Record<string, string[]> | null } | null>}
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

    const legacySensorLinks =
      value.sensorLinks && typeof value.sensorLinks === "object"
        ? value.sensorLinks
        : null;

    return { selectedCameras: selected, legacySensorLinks };
  } catch (err) {
    console.warn("CCTV: failed to load panel user data", err);
    return null;
  }
}

/**
 * @param {any} hass
 * @returns {Promise<string[] | null>}
 */
export async function loadPanelSelection(hass) {
  const data = await loadPanelData(hass);
  return data ? data.selectedCameras : null;
}

/**
 * Save this user's camera selection only (site-wide sensor links live in the integration store).
 * @param {any} hass
 * @param {string[]} selectedCameras
 * @param {{ clearLegacySensorLinks?: boolean }} [opts]
 */
export async function savePanelSelection(hass, selectedCameras, opts = {}) {
  if (!hass?.callWS) return;

  const cleaned = [
    ...new Set(selectedCameras.map(String).filter((id) => id.startsWith("camera."))),
  ].slice(0, 4);

  const value = { selectedCameras: cleaned };
  // Drop legacy per-user sensorLinks once migrated to shared storage.
  if (!opts.clearLegacySensorLinks) {
    // Keep payload minimal — never re-write sensorLinks into user data.
  }

  try {
    await hass.callWS({
      type: "frontend/set_user_data",
      key: PANEL_SELECTION_KEY,
      value,
    });
  } catch (err) {
    console.warn("CCTV: failed to save panel selection", err);
    throw err;
  }

  return { selectedCameras: cleaned };
}

/**
 * @deprecated Use savePanelSelection for per-user prefs; sensor links go through recordings-api.
 * Kept as a thin wrapper so older call sites can pass selectedCameras only.
 * @param {any} hass
 * @param {{ selectedCameras?: string[] }} patch
 * @param {{ selectedCameras?: string[] }} [current]
 */
export async function savePanelData(hass, patch, current) {
  const selected =
    patch.selectedCameras ?? current?.selectedCameras ?? (await loadPanelSelection(hass)) ?? [];
  return savePanelSelection(hass, selected);
}
