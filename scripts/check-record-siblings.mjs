/**
 * Sanity checks for high-res → fluent/recordable sibling capture mapping.
 * Mirrors custom_components/cctv_dashboard/recordings.py helpers in JS for CI.
 */

const HIGH_SUFFIXES = [
  "_high_resolution_channel",
  "_high_resolution",
  "_high_res",
  "_clear",
];
const RECORD_SUFFIXES = ["_fluent", "_sub", "_lq", "_low", "_sd", "_substream"];

function cameraObjectId(entityId) {
  return String(entityId || "").replace(/^camera\./, "");
}

function stripSuffix(objectId) {
  let name = String(objectId || "");
  for (const suffix of [...HIGH_SUFFIXES, ...RECORD_SUFFIXES, "_main"]) {
    if (name.endsWith(suffix)) return name.slice(0, -suffix.length);
  }
  return name;
}

function needsSibling(entityId) {
  const name = cameraObjectId(entityId);
  return HIGH_SUFFIXES.some((suffix) => name.endsWith(suffix));
}

function findRecordableSibling(entityId, available) {
  const cam = String(entityId || "");
  if (!cam.startsWith("camera.") || !needsSibling(cam)) return null;
  const availableSet = new Set(available || []);
  const base = stripSuffix(cameraObjectId(cam));
  if (!base) return null;
  for (const suffix of RECORD_SUFFIXES) {
    const candidate = `camera.${base}${suffix}`;
    if (candidate !== cam && availableSet.has(candidate)) return candidate;
  }
  const bare = `camera.${base}`;
  if (bare !== cam && availableSet.has(bare)) return bare;
  return null;
}

function buildGroups(cameras, available) {
  /** @type {Record<string, string[]>} */
  const groups = {};
  for (const cameraId of cameras) {
    const cam = String(cameraId);
    if (!cam.startsWith("camera.")) continue;
    const sibling = findRecordableSibling(cam, available);
    const recordEntity = sibling || cam;
    const attrs = groups[recordEntity] || (groups[recordEntity] = []);
    if (!attrs.includes(cam)) attrs.push(cam);
  }
  return groups;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const available = [
  "camera.drive_high_resolution_channel",
  "camera.drive_fluent",
  "camera.yard",
  "camera.yard_fluent",
];

assert(
  findRecordableSibling("camera.drive_high_resolution_channel", available) ===
    "camera.drive_fluent",
  "high_resolution_channel → fluent"
);
assert(
  findRecordableSibling("camera.yard", available) === null,
  "plain cam needs no sibling"
);

const groups = buildGroups(
  [
    "camera.drive_high_resolution_channel",
    "camera.drive_fluent",
    "camera.yard",
  ],
  available
);
assert(
  groups["camera.drive_fluent"]?.includes(
    "camera.drive_high_resolution_channel"
  ),
  "high-res attributed onto fluent record group"
);
assert(
  groups["camera.drive_fluent"]?.includes("camera.drive_fluent"),
  "fluent itself stays in same record group"
);
assert(groups["camera.yard"]?.length === 1, "yard records itself");
assert(!groups["camera.drive_high_resolution_channel"], "no direct high-res group");

console.log("record-siblings checks ok");
