import { cameraFromState } from "./cameras.js";

/**
 * Per-camera stream quality helpers.
 *
 * HA Core limits (important):
 * - `camera/stream` only accepts `format` (typically `hls`) — no resolution/bitrate.
 * - WebRTC offer APIs have no quality / substream parameter.
 * - Practical quality control in HA is therefore:
 *   1) Prefer a different `camera.*` entity (main vs substream), and/or
 *   2) Prefer a lighter transport (MJPEG / still) vs WebRTC/HLS.
 *
 * Frigate / go2rtc / many ONVIF setups expose a low-res sibling entity
 * (`_sub`, `_lq`, `_low`, `_fluent`, `_sd`). We auto-detect those when present.
 */

export const QUALITY_OPTIONS = [
  {
    value: "auto",
    label: "Auto",
    help: "High for detail, prefer low/substream in the mosaic when available.",
  },
  {
    value: "high",
    label: "High",
    help: "Main camera entity; prefer WebRTC/HLS.",
  },
  {
    value: "balanced",
    label: "Balanced",
    help: "Main entity; prefer HA native / WebRTC, then HLS/MJPEG.",
  },
  {
    value: "low",
    label: "Low",
    help: "Substream entity when available, else MJPEG on the main camera.",
  },
];

const LOW_SUFFIXES = ["_sub", "_lq", "_low", "_fluent", "_sd", "_substream"];
const STORAGE_PREFIX = "cctv-dashboard:quality:";

export function normalizeQuality(value) {
  const v = String(value || "auto").toLowerCase();
  return QUALITY_OPTIONS.some((opt) => opt.value === v) ? v : "auto";
}

export function getCameraSettings(config, entityId) {
  const map = config?.camera_settings || config?.cameras_settings || {};
  const fromMap = map?.[entityId] || map?.[entityId?.toLowerCase?.()] || {};
  // Single-camera card may put overrides on the root config.
  const rootOverrides = {};
  if (config?.entity && config.entity === entityId) {
    if (config.low_entity) rootOverrides.low_entity = config.low_entity;
    if (config.high_entity) rootOverrides.high_entity = config.high_entity;
    if (config.substream_entity) rootOverrides.substream_entity = config.substream_entity;
    if (config.main_entity) rootOverrides.main_entity = config.main_entity;
  }
  return { ...rootOverrides, ...fromMap };
}

export function readStoredQuality(entityId) {
  try {
    const value = localStorage.getItem(STORAGE_PREFIX + entityId);
    return value ? normalizeQuality(value) : null;
  } catch {
    return null;
  }
}

export function writeStoredQuality(entityId, quality) {
  try {
    localStorage.setItem(STORAGE_PREFIX + entityId, normalizeQuality(quality));
  } catch {
    /* private mode / blocked storage */
  }
}

/**
 * Resolve effective quality for a camera.
 * Precedence: stored UI choice → camera_settings.quality → config.quality → auto
 */
export function resolveQuality(config, entityId) {
  const stored = readStoredQuality(entityId);
  if (stored) return stored;
  const perCam = getCameraSettings(config, entityId);
  if (perCam.quality) return normalizeQuality(perCam.quality);
  if (config?.quality) return normalizeQuality(config.quality);
  return "auto";
}

function findSibling(hass, entityId, suffixes) {
  const states = hass?.states || {};
  const base = entityId.replace(/^camera\./, "");
  for (const suffix of suffixes) {
    const candidate = `camera.${base}${suffix}`;
    if (states[candidate]) return candidate;
    const alt = `camera.${base.replace(/_main$/, "")}${suffix}`;
    if (alt !== candidate && states[alt]) return alt;
  }
  return "";
}

/**
 * Pick which camera entity to stream for the requested quality.
 */
export function resolveStreamCamera(hass, camera, config, quality, context = "mosaic") {
  const q = normalizeQuality(quality);
  const settings = getCameraSettings(config, camera.entityId);
  const states = hass?.states || {};

  const highEntity =
    settings.high_entity ||
    settings.main_entity ||
    camera.entityId;
  const lowEntity =
    settings.low_entity ||
    settings.substream_entity ||
    findSibling(hass, camera.entityId, LOW_SUFFIXES) ||
    "";

  let entityId = camera.entityId;
  if (q === "high") {
    entityId = highEntity;
  } else if (q === "low") {
    entityId = lowEntity || highEntity;
  } else if (q === "auto") {
    entityId = context === "mosaic" && lowEntity ? lowEntity : highEntity;
  } else {
    // balanced
    entityId = highEntity;
  }

  if (!states[entityId]) entityId = camera.entityId;
  return cameraFromState(entityId, states[entityId]);
}

/**
 * Preferred live transports for a quality level.
 * `still` means do not open a live session (poster only).
 */
export function preferredTransports(quality, context = "mosaic") {
  const q = normalizeQuality(quality);
  if (q === "low") {
    return ["mjpeg", "ha", "webrtc", "hls"];
  }
  if (q === "high") {
    return ["webrtc", "ha", "hls", "mjpeg"];
  }
  if (q === "balanced") {
    return ["ha", "webrtc", "hls", "mjpeg"];
  }
  // auto
  if (context === "mosaic") {
    return ["mjpeg", "ha", "webrtc", "hls"];
  }
  return ["webrtc", "ha", "hls", "mjpeg"];
}

export function qualityHelp(quality) {
  return (
    QUALITY_OPTIONS.find((opt) => opt.value === normalizeQuality(quality))?.help ||
    ""
  );
}
