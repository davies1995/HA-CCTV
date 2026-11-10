/** Shared helpers for discovering and streaming HA camera entities. */

const UNAVAILABLE = new Set(["unavailable", "unknown", "none", ""]);

/** CameraEntityFeature.STREAM */
export const CAMERA_SUPPORT_STREAM = 2;

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
    .map((entityId) => cameraFromState(entityId, states[entityId]))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export function cameraFromState(entityId, stateObj) {
  const attrs = stateObj?.attributes ?? {};
  return {
    entityId,
    stateObj,
    state: stateObj?.state ?? "unknown",
    name: attrs.friendly_name || entityId,
    brand: attrs.brand,
    model: attrs.model,
    frontendStreamType: attrs.frontend_stream_type,
    supportedFeatures: Number(attrs.supported_features || 0),
    unavailable: !stateObj || UNAVAILABLE.has(String(stateObj.state).trim().toLowerCase()),
  };
}

export function supportsStream(camera) {
  return Boolean(camera?.supportedFeatures & CAMERA_SUPPORT_STREAM);
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

export function cameraMjpegStreamUrl(hass, camera) {
  const token = camera?.stateObj?.attributes?.access_token;
  if (!hass || !camera?.entityId || !token) return "";
  const path = `/api/camera_proxy_stream/${camera.entityId}?token=${token}`;
  return typeof hass.hassUrl === "function" ? hass.hassUrl(path) : path;
}

export async function fetchCameraCapabilities(hass, entityId) {
  if (!hass?.callWS) return null;
  try {
    return await hass.callWS({ type: "camera/capabilities", entity_id: entityId });
  } catch {
    return null;
  }
}

export async function fetchHlsStreamUrl(hass, entityId) {
  if (!hass?.callWS) return "";
  const stream = await hass.callWS({
    type: "camera/stream",
    entity_id: entityId,
  });
  const url = stream?.url || "";
  if (!url) return "";
  return typeof hass.hassUrl === "function" ? hass.hassUrl(url) : url;
}

export function subscribeWebRtcOffer(hass, entityId, offer, callback) {
  if (!hass?.connection?.subscribeMessage) {
    throw new Error("WebSocket connection unavailable");
  }
  return hass.connection.subscribeMessage(callback, {
    type: "camera/webrtc/offer",
    entity_id: entityId,
    offer,
  });
}

export async function addWebRtcCandidate(hass, entityId, sessionId, candidate) {
  if (!hass?.callWS) return;
  await hass.callWS({
    type: "camera/webrtc/candidate",
    entity_id: entityId,
    session_id: sessionId,
    candidate,
  });
}

export async function fetchWebRtcClientConfiguration(hass, entityId) {
  if (!hass?.callWS) return null;
  try {
    return await hass.callWS({
      type: "camera/webrtc/get_client_config",
      entity_id: entityId,
    });
  } catch {
    return null;
  }
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
