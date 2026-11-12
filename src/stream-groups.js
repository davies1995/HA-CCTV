/**
 * Physical-camera stream groups: multiple camera.* entities under one name.
 * Site-wide; sensor links are mirrored across all members.
 */

/**
 * @typedef {{ id: string, name: string, members: string[] }} StreamGroup
 */

/**
 * @param {any} raw
 * @returns {StreamGroup[]}
 */
export function normalizeStreamGroups(raw) {
  if (!Array.isArray(raw)) return [];
  /** @type {StreamGroup[]} */
  const out = [];
  const used = new Set();
  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const members = [];
    for (const mid of item.members || []) {
      const id = String(mid || "");
      if (!id.startsWith("camera.") || used.has(id) || members.includes(id)) {
        continue;
      }
      used.add(id);
      members.push(id);
      if (members.length >= 8) break;
    }
    if (members.length < 2) continue;
    const idRaw = String(item.id || "").trim();
    const id =
      idRaw && /^[a-zA-Z0-9._-]+$/.test(idRaw)
        ? idRaw.slice(0, 64)
        : `grp_${members[0].replace(/^camera\./, "").slice(0, 40)}`;
    const name =
      String(item.name || "").trim().slice(0, 64) ||
      members[0].replace(/^camera\./, "").replace(/_/g, " ");
    out.push({ id, name, members });
    if (out.length >= 32) break;
  }
  return out;
}

/**
 * @param {StreamGroup[] | null | undefined} groups
 * @param {string} cameraId
 * @returns {StreamGroup | null}
 */
export function groupForCamera(groups, cameraId) {
  const cam = String(cameraId || "");
  if (!cam.startsWith("camera.")) return null;
  for (const group of groups || []) {
    if ((group.members || []).includes(cam)) return group;
  }
  return null;
}

/**
 * All stream ids that share a physical-camera group with cameraId (incl. itself).
 * @param {StreamGroup[] | null | undefined} groups
 * @param {string} cameraId
 * @returns {string[]}
 */
export function groupMembersForCamera(groups, cameraId) {
  const group = groupForCamera(groups, cameraId);
  if (group?.members?.length) return [...group.members];
  const cam = String(cameraId || "");
  return cam.startsWith("camera.") ? [cam] : [];
}

/**
 * Mirror sensor link lists across every group so each member has the same set.
 * @param {Record<string, string[]> | null | undefined} sensorLinks
 * @param {StreamGroup[] | null | undefined} groups
 * @returns {Record<string, string[]>}
 */
export function syncSensorLinksAcrossGroups(sensorLinks, groups) {
  /** @type {Record<string, string[]>} */
  const next = { ...(sensorLinks || {}) };
  for (const group of groups || []) {
    const members = (group.members || []).filter((id) =>
      String(id).startsWith("camera.")
    );
    if (members.length < 2) continue;
    const union = new Set();
    for (const mid of members) {
      for (const sid of next[mid] || []) {
        if (sid) union.add(String(sid));
      }
    }
    const shared = [...union].slice(0, 16);
    for (const mid of members) {
      if (shared.length) next[mid] = [...shared];
      else delete next[mid];
    }
  }
  return next;
}

/**
 * Cameras associated with a sensor, expanded by stream groups.
 * @param {Record<string, string[]> | null | undefined} sensorLinks
 * @param {StreamGroup[] | null | undefined} groups
 * @param {string} sensorId
 * @returns {string[]}
 */
export function camerasForSensorExpanded(sensorLinks, groups, sensorId) {
  const sid = String(sensorId || "");
  if (!sid) return [];
  const direct = [];
  for (const [cameraId, sensors] of Object.entries(sensorLinks || {})) {
    if (!String(cameraId).startsWith("camera.")) continue;
    if ((sensors || []).map(String).includes(sid)) direct.push(cameraId);
  }
  const out = new Set();
  for (const cam of direct) {
    for (const mid of groupMembersForCamera(groups, cam)) out.add(mid);
  }
  return [...out].sort();
}

/**
 * Suggest same-device camera.* siblings not already used in another group.
 * @param {string} cameraId
 * @param {{
 *   cameras?: Array<{ entityId?: string }>,
 *   deviceMap?: Map<string, string> | Record<string, string> | null,
 *   groups?: StreamGroup[] | null,
 * }} [opts]
 * @returns {string[]}
 */
export function suggestGroupMembersFromDevice(cameraId, opts = {}) {
  const cam = String(cameraId || "");
  if (!cam.startsWith("camera.")) return [];
  const deviceMap = opts.deviceMap;
  let deviceId = null;
  if (deviceMap instanceof Map) deviceId = deviceMap.get(cam) || null;
  else if (deviceMap && typeof deviceMap === "object") {
    deviceId = deviceMap[cam] || null;
  }
  if (!deviceId) return [];

  const current = groupForCamera(opts.groups, cam);
  const blocked = new Set();
  for (const group of opts.groups || []) {
    if (current && group.id === current.id) continue;
    for (const mid of group.members || []) blocked.add(mid);
  }

  const available = new Set(
    (opts.cameras || [])
      .map((c) => String(c?.entityId || c || ""))
      .filter((id) => id.startsWith("camera."))
  );

  const out = [];
  const entries =
    deviceMap instanceof Map
      ? deviceMap.entries()
      : Object.entries(deviceMap || {});
  for (const [entityId, did] of entries) {
    const id = String(entityId);
    if (!id.startsWith("camera.") || id === cam) continue;
    if (String(did) !== String(deviceId)) continue;
    if (blocked.has(id)) continue;
    if (available.size && !available.has(id)) continue;
    out.push(id);
  }
  return out.sort();
}

/**
 * Upsert a group; members must be unique across groups.
 * @param {StreamGroup[]} groups
 * @param {{ id?: string, name?: string, members: string[] }} patch
 * @returns {StreamGroup[]}
 */
export function upsertStreamGroup(groups, patch) {
  const members = [
    ...new Set(
      (patch.members || [])
        .map(String)
        .filter((id) => id.startsWith("camera."))
    ),
  ].slice(0, 8);
  if (members.length < 2) {
    // Drop group if fewer than 2 members.
    const id = String(patch.id || "");
    return normalizeStreamGroups(
      (groups || []).filter((g) => g.id !== id)
    );
  }
  const id =
    String(patch.id || "").trim() ||
    `grp_${members[0].replace(/^camera\./, "").slice(0, 40)}`;
  const name =
    String(patch.name || "").trim().slice(0, 64) ||
    members[0].replace(/^camera\./, "").replace(/_/g, " ");
  const withoutMembers = (groups || [])
    .map((g) => ({
      ...g,
      members: (g.members || []).filter((m) => !members.includes(m)),
    }))
    .filter((g) => g.members.length >= 2 && g.id !== id);
  return normalizeStreamGroups([
    ...withoutMembers,
    { id, name, members },
  ]);
}

/**
 * Remove a group by id.
 * @param {StreamGroup[]} groups
 * @param {string} groupId
 * @returns {StreamGroup[]}
 */
export function removeStreamGroup(groups, groupId) {
  const id = String(groupId || "");
  return normalizeStreamGroups((groups || []).filter((g) => g.id !== id));
}
