/** Shared helpers for discovering and previewing HA camera entities. */

const UNAVAILABLE = new Set(["unavailable", "unknown", "none", ""]);

export function listCameras(hass, config = {}) {
  const states = hass?.states ?? {};
  const include = normalizeList(config.cameras);
  const exclude = new Set(normalizeList(config.exclude).map((id) => id.toLowerCase()));

  let ids = Object.keys(states).filter((id) => id.startsWith("camera."));
  if (include.length) {
    const wanted = new Set(include.map((id) => id.toLowerCase()));
    ids = ids.filter((id) => wanted.has(id.toLowerCase()));
  }
  ids = ids.filter((id) => !exclude.has(id.toLowerCase()));

  return ids
    .map((entityId) => {
      const stateObj = states[entityId];
      const attrs = stateObj?.attributes ?? {};
      return {
        entityId,
        stateObj,
        state: stateObj?.state ?? "unknown",
        name: attrs.friendly_name || entityId,
        brand: attrs.brand,
        model: attrs.model,
        unavailable: !stateObj || UNAVAILABLE.has(String(stateObj.state).trim().toLowerCase()),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export function cameraPreviewUrl(hass, camera, cacheBust = true) {
  if (!hass || !camera?.stateObj) return "";
  const attrs = camera.stateObj.attributes || {};
  let path = attrs.entity_picture;
  if (!path && attrs.access_token) {
    path = `/api/camera_proxy/${camera.entityId}?token=${attrs.access_token}`;
  }
  if (!path) return "";
  const base = typeof hass.hassUrl === "function" ? hass.hassUrl(path) : path;
  if (!cacheBust) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}t=${Date.now()}`;
}

export async function callCameraService(hass, service, entityId, data = {}) {
  if (!hass?.callService) throw new Error("hass.callService is unavailable");
  return hass.callService("camera", service, { entity_id: entityId, ...data });
}

export function openMoreInfo(host, entityId) {
  if (!entityId) return;
  const event = new Event("hass-more-info", { bubbles: true, composed: true });
  event.detail = { entityId };
  host.dispatchEvent(event);
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
