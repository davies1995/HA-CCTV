/**
 * Discover and classify detection sensors related to cameras.
 *
 * Heuristics (no admin required):
 * 1) Same object_id prefix as the camera (Frigate / Reolink / UniFi-style)
 * 2) Friendly-name / entity_id keywords (person, car, animal, package, …)
 * 3) Optional same-device match via entity registry when callable
 *
 * Manual links always win over suggestions and are stored in panel user data.
 */

export const DETECTION_KINDS = [
  {
    id: "person",
    label: "Person",
    tokens: ["person", "people", "human", "pedestrian", "face"],
  },
  {
    id: "car",
    label: "Car",
    tokens: ["car", "vehicle", "automobile", "auto"],
  },
  {
    id: "animal",
    label: "Animal",
    tokens: ["animal", "pet", "dog", "cat", "wildlife"],
  },
  {
    id: "package",
    label: "Package",
    tokens: ["package", "parcel", "delivery", "amazon"],
  },
  {
    id: "bicycle",
    label: "Bicycle",
    tokens: ["bicycle", "bike", "cyclist"],
  },
  {
    id: "motion",
    label: "Motion",
    tokens: ["motion", "occupancy", "presence", "moving"],
  },
  {
    id: "other",
    label: "Other",
    tokens: ["detection", "object", "zone"],
  },
];

const SENSOR_DOMAINS = new Set(["binary_sensor", "sensor"]);
const ON_STATES = new Set(["on", "true", "detected", "active", "1", "home"]);

/**
 * @param {string} entityId
 */
export function cameraBaseId(entityId) {
  return String(entityId || "")
    .replace(/^camera\./i, "")
    .replace(/_(main|hi|high|primary)$/i, "")
    .toLowerCase();
}

/**
 * @param {string} haystack
 * @param {string[]} tokens
 */
function includesToken(haystack, tokens) {
  return tokens.some((token) => {
    const re = new RegExp(`(^|[_\\s.-])${token}([_\\s.-]|$)`, "i");
    return re.test(haystack);
  });
}

/**
 * @param {string} entityId
 * @param {any} stateObj
 * @returns {{ id: string, label: string }}
 */
export function classifyDetectionSensor(entityId, stateObj) {
  const blob = `${entityId} ${stateObj?.attributes?.friendly_name || ""}`.toLowerCase();
  for (const kind of DETECTION_KINDS) {
    if (kind.id === "other") continue;
    if (includesToken(blob, kind.tokens)) {
      return { id: kind.id, label: kind.label };
    }
  }
  return { id: "other", label: "Other" };
}

/**
 * @param {any} stateObj
 */
export function isSensorActive(stateObj) {
  if (!stateObj) return false;
  const state = String(stateObj.state ?? "").trim().toLowerCase();
  if (ON_STATES.has(state)) return true;
  const n = Number(state);
  return Number.isFinite(n) && n > 0;
}

/**
 * @param {string} cameraEntityId
 * @param {string} sensorEntityId
 * @param {any} stateObj
 */
export function scoreSensorForCamera(cameraEntityId, sensorEntityId, stateObj) {
  const camBase = cameraBaseId(cameraEntityId);
  if (!camBase) return 0;

  const sensorId = String(sensorEntityId).toLowerCase();
  const name = String(stateObj?.attributes?.friendly_name || "").toLowerCase();
  const blob = `${sensorId} ${name}`;
  let affinity = 0;

  const objectId = sensorId.replace(/^(binary_sensor|sensor)\./, "");
  if (objectId === camBase || objectId.startsWith(`${camBase}_`)) affinity += 50;
  else if (objectId.includes(camBase)) affinity += 25;
  if (name.includes(camBase.replace(/_/g, " "))) affinity += 15;

  // Detection labels only boost sensors that already look camera-related.
  if (affinity <= 0) return 0;

  const kind = classifyDetectionSensor(sensorEntityId, stateObj);
  let score = affinity;
  if (kind.id !== "other") score += 20;
  else if (includesToken(blob, ["detection", "object", "zone", "motion", "occupancy"])) {
    score += 8;
  }

  // Prefer binary_sensor for on/off timeline segments.
  if (sensorId.startsWith("binary_sensor.")) score += 5;

  return score;
}

/**
 * List candidate detection sensors for a camera (sorted best-first).
 * @param {any} hass
 * @param {string} cameraEntityId
 * @param {{ deviceIds?: Map<string, string>, limit?: number }} [opts]
 */
export function suggestDetectionSensors(hass, cameraEntityId, opts = {}) {
  const states = hass?.states || {};
  const limit = opts.limit ?? 24;
  const deviceIds = opts.deviceIds;
  const camDevice = deviceIds?.get(cameraEntityId);

  /** @type {Array<{ entityId: string, name: string, kind: { id: string, label: string }, score: number, state: string, active: boolean }>} */
  const scored = [];

  for (const [entityId, stateObj] of Object.entries(states)) {
    const domain = entityId.split(".")[0];
    if (!SENSOR_DOMAINS.has(domain)) continue;

    let score = scoreSensorForCamera(cameraEntityId, entityId, stateObj);
    if (camDevice && deviceIds?.get(entityId) === camDevice) {
      score += 40;
    }
    if (score < 20) continue;

    const kind = classifyDetectionSensor(entityId, stateObj);
    scored.push({
      entityId,
      name: stateObj?.attributes?.friendly_name || entityId,
      kind,
      score,
      state: String(stateObj?.state ?? "unknown"),
      active: isSensorActive(stateObj),
    });
  }

  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored.slice(0, limit);
}

/**
 * All linkable sensors (for manual picker), lightly filtered to detection-ish entities.
 * @param {any} hass
 */
export function listLinkableSensors(hass) {
  const states = hass?.states || {};
  return Object.entries(states)
    .filter(([entityId, stateObj]) => {
      const domain = entityId.split(".")[0];
      if (!SENSOR_DOMAINS.has(domain)) return false;
      const kind = classifyDetectionSensor(entityId, stateObj);
      return kind.id !== "other" || /detection|object|zone|occupancy|motion/i.test(entityId);
    })
    .map(([entityId, stateObj]) => ({
      entityId,
      name: stateObj?.attributes?.friendly_name || entityId,
      kind: classifyDetectionSensor(entityId, stateObj),
      state: String(stateObj?.state ?? "unknown"),
      active: isSensorActive(stateObj),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

/**
 * Resolve linked sensor descriptors for UI / timeline.
 * @param {any} hass
 * @param {string[]} entityIds
 */
export function describeLinkedSensors(hass, entityIds) {
  const states = hass?.states || {};
  return (entityIds || [])
    .map(String)
    .filter((id) => SENSOR_DOMAINS.has(id.split(".")[0]))
    .map((entityId) => {
      const stateObj = states[entityId];
      return {
        entityId,
        name: stateObj?.attributes?.friendly_name || entityId,
        kind: classifyDetectionSensor(entityId, stateObj),
        state: String(stateObj?.state ?? "unknown"),
        active: isSensorActive(stateObj),
        missing: !stateObj,
      };
    });
}

/**
 * Best-effort device_id map for same-device association.
 * Soft-fails when registry is unavailable.
 * @param {any} hass
 * @returns {Promise<Map<string, string>>}
 */
export async function loadEntityDeviceMap(hass) {
  const map = new Map();
  if (!hass?.callWS) return map;
  try {
    const entries = await hass.callWS({ type: "config/entity_registry/list" });
    if (!Array.isArray(entries)) return map;
    for (const entry of entries) {
      if (entry?.entity_id && entry?.device_id) {
        map.set(String(entry.entity_id), String(entry.device_id));
      }
    }
  } catch (err) {
    console.warn("CCTV: entity registry unavailable for sensor linking", err);
  }
  return map;
}

/**
 * Normalize stored sensorLinks map.
 * @param {any} value
 * @returns {Record<string, string[]>}
 */
export function normalizeSensorLinks(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const [cameraId, sensors] of Object.entries(value)) {
    if (!String(cameraId).startsWith("camera.")) continue;
    if (!Array.isArray(sensors)) continue;
    out[cameraId] = [
      ...new Set(
        sensors
          .map(String)
          .filter((id) => SENSOR_DOMAINS.has(id.split(".")[0]))
      ),
    ].slice(0, 16);
  }
  return out;
}

/**
 * Build on/off segments from HA history points for one entity.
 * @param {Array<{ state?: string, s?: string, last_changed?: string, lu?: number, last_updated?: string }>} points
 * @param {number} rangeStartMs
 * @param {number} rangeEndMs
 * @param {(state: string) => boolean} isActive
 */
export function segmentsFromHistory(points, rangeStartMs, rangeEndMs, isActive) {
  if (!Array.isArray(points) || !points.length) return [];

  const normalized = points
    .map((p) => {
      const state = String(p.state ?? p.s ?? "").toLowerCase();
      let t = rangeStartMs;
      if (typeof p.lu === "number") t = p.lu * 1000;
      else if (p.last_changed) t = Date.parse(p.last_changed);
      else if (p.last_updated) t = Date.parse(p.last_updated);
      return { t, state, active: isActive(state) };
    })
    .filter((p) => Number.isFinite(p.t))
    .sort((a, b) => a.t - b.t);

  if (!normalized.length) return [];

  /** @type {Array<{ start: number, end: number }>} */
  const segments = [];
  let openStart = null;
  let cursorState = null;

  // Seed state before the window from the first sample if it starts after rangeStart.
  const first = normalized[0];
  if (first.t > rangeStartMs) {
    // Unknown prior — wait until first transition inside/after window.
    cursorState = null;
  }

  for (const point of normalized) {
    const t = Math.max(rangeStartMs, Math.min(rangeEndMs, point.t));
    if (cursorState === null) {
      cursorState = point.active;
      if (point.active) openStart = Math.max(rangeStartMs, point.t <= rangeStartMs ? rangeStartMs : t);
      continue;
    }
    if (point.active === cursorState) continue;
    if (cursorState && openStart != null) {
      const end = Math.max(openStart, t);
      if (end > openStart) segments.push({ start: openStart, end });
      openStart = null;
    }
    cursorState = point.active;
    if (point.active) openStart = t;
  }

  if (cursorState && openStart != null && openStart < rangeEndMs) {
    segments.push({ start: openStart, end: rangeEndMs });
  }

  // If history starts with an "on" sample at/before window, ensure coverage.
  if (!segments.length && first.active && first.t <= rangeStartMs) {
    segments.push({ start: rangeStartMs, end: rangeEndMs });
  }

  return segments;
}

/**
 * Merge overlapping / contiguous segments into single instances.
 * Used to collapse concurrent same-type detections (e.g. 2 car sensors → 1 car flag).
 * Extra fields (cameras, sensors, …) are unioned onto the merged event.
 * @param {Array<{ start: number, end: number, cameras?: string[], sensors?: Array<{entityId:string,name:string}> }>} segments
 * @param {number} [padMs] treat gaps <= pad as the same instance
 * @returns {Array<{ start: number, end: number, cameras: string[], sensors: Array<{entityId:string,name:string}> }>}
 */
export function mergeOverlappingSegments(segments, padMs = 0) {
  if (!Array.isArray(segments) || !segments.length) return [];
  const sorted = segments
    .map((s) => ({
      start: Number(s.start),
      end: Number(s.end),
      cameras: Array.isArray(s.cameras) ? [...s.cameras] : [],
      sensors: Array.isArray(s.sensors) ? [...s.sensors] : [],
    }))
    .filter((s) => Number.isFinite(s.start) && Number.isFinite(s.end) && s.end > s.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);

  if (!sorted.length) return [];

  const out = [cloneMerged(sorted[0])];
  for (let i = 1; i < sorted.length; i += 1) {
    const cur = sorted[i];
    const last = out[out.length - 1];
    if (cur.start <= last.end + padMs) {
      last.end = Math.max(last.end, cur.end);
      unionMeta(last, cur);
    } else {
      out.push(cloneMerged(cur));
    }
  }
  return out;
}

function cloneMerged(seg) {
  return {
    start: seg.start,
    end: seg.end,
    cameras: [...(seg.cameras || [])],
    sensors: [...(seg.sensors || [])],
  };
}

function unionMeta(target, source) {
  const camSet = new Set(target.cameras);
  for (const id of source.cameras || []) camSet.add(id);
  target.cameras = [...camSet];

  const sensorMap = new Map(
    (target.sensors || []).map((s) => [s.entityId, s])
  );
  for (const s of source.sensors || []) {
    if (s?.entityId) sensorMap.set(s.entityId, s);
  }
  target.sensors = [...sensorMap.values()];
}

/**
 * Fetch history for linked sensors in a time window.
 * @param {any} hass
 * @param {string[]} entityIds
 * @param {Date} start
 * @param {Date} end
 */
export async function fetchSensorHistory(hass, entityIds, start, end) {
  if (!hass?.callWS || !entityIds?.length) return {};
  try {
    const result = await hass.callWS({
      type: "history/history_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      entity_ids: entityIds,
      // Leaner payload — on/off edges are enough for detection segments.
      significant_changes_only: true,
      minimal_response: true,
      no_attributes: true,
    });
    return result && typeof result === "object" ? result : {};
  } catch (err) {
    console.warn("CCTV: history fetch failed", err);
    return {};
  }
}

/**
 * Format a duration in a short human label.
 * @param {number} ms
 */
export function formatDuration(ms) {
  const sec = Math.max(0, Math.round(ms / 1000));
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  if (min < 60) return rem ? `${min}m ${rem}s` : `${min}m`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  return remMin ? `${hr}h ${remMin}m` : `${hr}h`;
}

/**
 * @param {number} ms
 */
export function formatClock(ms) {
  try {
    return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
