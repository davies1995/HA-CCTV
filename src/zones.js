/**
 * Zones: named collections of physical camera stream groups (site-wide).
 */

/**
 * @typedef {{ id: string, name: string, group_ids: string[] }} CameraZone
 */

/** Soft default; callers pass store/settings value when enforcing. */
export const DEFAULT_MAX_CAMERAS_PER_ZONE = 4;
export const MAX_CAMERAS_PER_ZONE_LIMIT = 4;

/**
 * @param {any} raw
 * @returns {number}
 */
export function normalizeMaxCamerasPerZone(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_MAX_CAMERAS_PER_ZONE;
  return Math.max(1, Math.min(Math.floor(n), MAX_CAMERAS_PER_ZONE_LIMIT));
}

/**
 * @param {any} raw
 * @param {Array<{ id?: string }> | null | undefined} [groups]
 * @param {number | null | undefined} [maxCameras]
 * @returns {CameraZone[]}
 */
export function normalizeZones(raw, groups = null, maxCameras = null) {
  const valid = new Set(
    (groups || []).map((g) => String(g?.id || "")).filter(Boolean)
  );
  const limit = normalizeMaxCamerasPerZone(
    maxCameras == null ? DEFAULT_MAX_CAMERAS_PER_ZONE : maxCameras
  );
  if (!Array.isArray(raw)) return [];
  /** @type {CameraZone[]} */
  const out = [];
  const used = new Set();
  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const groupIds = [];
    for (const gid of item.group_ids || item.groups || []) {
      const id = String(gid || "").trim();
      if (!id || groupIds.includes(id)) continue;
      if (valid.size && !valid.has(id)) continue;
      groupIds.push(id);
      if (groupIds.length >= limit) break;
    }
    const idRaw = String(item.id || "").trim();
    const id =
      idRaw && /^[a-zA-Z0-9._-]+$/.test(idRaw)
        ? idRaw.slice(0, 64)
        : `zone_${String(item.name || "zone")
            .replace(/[^a-zA-Z0-9._-]+/g, "_")
            .slice(0, 40)}`;
    if (used.has(id)) continue;
    used.add(id);
    const name =
      String(item.name || "").trim().slice(0, 64) ||
      id.replace(/^zone_/, "").replace(/_/g, " ") ||
      "Zone";
    out.push({ id, name, group_ids: groupIds });
    if (out.length >= 32) break;
  }
  return out;
}

/**
 * @param {CameraZone[] | null | undefined} zones
 * @param {string} zoneId
 * @returns {CameraZone | null}
 */
export function zoneById(zones, zoneId) {
  const id = String(zoneId || "");
  if (!id) return null;
  return (zones || []).find((z) => z.id === id) || null;
}

/**
 * @param {CameraZone[] | null | undefined} zones
 * @param {string} groupId
 * @returns {CameraZone[]}
 */
export function zonesForGroup(zones, groupId) {
  const gid = String(groupId || "");
  if (!gid) return [];
  return (zones || []).filter((z) => (z.group_ids || []).includes(gid));
}

/**
 * Upsert a zone; group_ids must reference known groups when provided.
 * @param {CameraZone[]} zones
 * @param {{ id?: string, name?: string, group_ids?: string[] }} patch
 * @param {Array<{ id?: string }> | null} [groups]
 * @param {number | null | undefined} [maxCameras]
 * @returns {CameraZone[]}
 */
export function upsertZone(zones, patch, groups = null, maxCameras = null) {
  const valid = new Set(
    (groups || []).map((g) => String(g?.id || "")).filter(Boolean)
  );
  const limit = normalizeMaxCamerasPerZone(
    maxCameras == null ? DEFAULT_MAX_CAMERAS_PER_ZONE : maxCameras
  );
  const groupIds = [
    ...new Set(
      (patch.group_ids || [])
        .map(String)
        .filter((id) => id && (!valid.size || valid.has(id)))
    ),
  ].slice(0, limit);
  const id =
    String(patch.id || "").trim() ||
    `zone_${String(patch.name || "zone")
      .replace(/[^a-zA-Z0-9._-]+/g, "_")
      .slice(0, 40)}`;
  const name =
    String(patch.name || "").trim().slice(0, 64) ||
    id.replace(/^zone_/, "").replace(/_/g, " ") ||
    "Zone";
  const without = (zones || []).filter((z) => z.id !== id);
  return normalizeZones(
    [...without, { id, name, group_ids: groupIds }],
    groups,
    limit
  );
}

/**
 * @param {CameraZone[]} zones
 * @param {string} zoneId
 * @param {Array<{ id?: string }> | null} [groups]
 * @param {number | null | undefined} [maxCameras]
 * @returns {CameraZone[]}
 */
export function removeZone(zones, zoneId, groups = null, maxCameras = null) {
  const id = String(zoneId || "");
  return normalizeZones(
    (zones || []).filter((z) => z.id !== id),
    groups,
    maxCameras
  );
}
