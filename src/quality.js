import { cameraFromState } from "./cameras.js";
import { pickLowStreamFromGroup } from "./stream-groups.js";

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
const QUALITY_VALUES = new Set(QUALITY_OPTIONS.map((opt) => opt.value));

export function normalizeQuality(value) {
  const v = String(value || "auto").toLowerCase();
  return QUALITY_VALUES.has(v) ? v : "auto";
}

/**
 * Site-wide per-camera quality map (auto omitted — same shape as backend store).
 * @param {Record<string, string> | null | undefined} raw
 * @returns {Record<string, string>}
 */
export function normalizeCameraQualityMap(raw) {
  if (!raw || typeof raw !== "object") return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const [cameraId, quality] of Object.entries(raw)) {
    if (!String(cameraId).startsWith("camera.")) continue;
    const value = normalizeQuality(quality);
    if (value === "auto") continue;
    out[cameraId] = value;
  }
  return out;
}

/**
 * Look up quality for a camera, falling back to physical-group siblings.
 * @param {Record<string, string> | null | undefined} map
 * @param {string} entityId
 * @param {string[] | null | undefined} groupMembers
 * @returns {string | null}
 */
export function qualityFromMap(map, entityId, groupMembers = null) {
  if (!map || typeof map !== "object") return null;
  const id = String(entityId || "");
  if (map[id]) return normalizeQuality(map[id]);
  for (const mid of groupMembers || []) {
    if (mid && mid !== id && map[mid]) return normalizeQuality(map[mid]);
  }
  return null;
}

/**
 * Write a quality value onto a camera and every stream in its physical group.
 * @param {Record<string, string> | null | undefined} map
 * @param {string} entityId
 * @param {string} quality
 * @param {string[] | null | undefined} groupMembers
 * @returns {Record<string, string>}
 */
export function mirrorQualityAcrossGroup(map, entityId, quality, groupMembers = null) {
  const value = normalizeQuality(quality);
  const targets = [
    ...new Set(
      [...(groupMembers || []), entityId]
        .map(String)
        .filter((id) => id.startsWith("camera."))
    ),
  ];
  /** @type {Record<string, string>} */
  const next = { ...(map || {}) };
  for (const id of targets) {
    if (value === "auto") delete next[id];
    else next[id] = value;
  }
  return normalizeCameraQualityMap(next);
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
 * Precedence when `sharedMap` is provided (panel): shared/draft map →
 * camera_settings.quality → config.quality → auto (skips browser localStorage).
 * Without sharedMap (Lovelace cards): localStorage → camera_settings → config → auto.
 * @param {any} config
 * @param {string} entityId
 * @param {Record<string, string> | null} [sharedMap]
 */
/**
 * @param {any} config
 * @param {string} entityId
 * @param {Record<string, string> | null} [sharedMap]
 * @param {string[] | null} [groupMembers]
 */
export function resolveQuality(
  config,
  entityId,
  sharedMap = null,
  groupMembers = null
) {
  if (sharedMap) {
    const fromShared = qualityFromMap(sharedMap, entityId, groupMembers);
    if (fromShared) return fromShared;
  } else {
    const stored = readStoredQuality(entityId);
    if (stored) return stored;
    for (const mid of groupMembers || []) {
      if (!mid || mid === entityId) continue;
      const sibling = readStoredQuality(mid);
      if (sibling) return sibling;
    }
  }
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
 * @param {any} hass
 * @param {any} camera
 * @param {any} config
 * @param {string} quality
 * @param {string} [context]
 * @param {string[] | null} [groupMembers] physical-camera group streams (HC-77)
 */
export function resolveStreamCamera(
  hass,
  camera,
  config,
  quality,
  context = "mosaic",
  groupMembers = null
) {
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
    pickLowStreamFromGroup(groupMembers, camera.entityId) ||
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
