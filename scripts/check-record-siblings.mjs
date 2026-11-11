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

function recordableRank(entityId) {
  const name = cameraObjectId(entityId);
  for (let i = 0; i < RECORD_SUFFIXES.length; i++) {
    if (name.endsWith(RECORD_SUFFIXES[i])) return i;
  }
  return null;
}

function stemContainsBase(stem, base) {
  if (!stem || !base) return false;
  if (stem === base) return true;
  const stemTokens = stem.split("_").filter(Boolean);
  const baseTokens = base.split("_").filter(Boolean);
  if (!baseTokens.length || baseTokens.length > stemTokens.length) return false;
  const n = baseTokens.length;
  for (let i = 0; i <= stemTokens.length - n; i++) {
    if (stemTokens.slice(i, i + n).join("_") === baseTokens.join("_")) return true;
  }
  return false;
}

function pickRecordable(candidates, availableSet, exclude) {
  const scored = [];
  for (const cand of candidates) {
    if (!cand.startsWith("camera.") || cand === exclude || !availableSet.has(cand)) {
      continue;
    }
    const rank = recordableRank(cand);
    if (rank === null) continue;
    scored.push([rank, cameraObjectId(cand).length, cand]);
  }
  if (!scored.length) return null;
  scored.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2].localeCompare(b[2]));
  return scored[0][2];
}

function findRecordableSibling(entityId, available, sameDeviceCameras = null) {
  const cam = String(entityId || "");
  if (!cam.startsWith("camera.") || !needsSibling(cam)) return null;
  const availableSet = new Set(available || []);

  const devicePick = pickRecordable(sameDeviceCameras || [], availableSet, cam);
  if (devicePick) return devicePick;

  const base = stripSuffix(cameraObjectId(cam));
  if (!base) return null;

  for (const suffix of RECORD_SUFFIXES) {
    const candidate = `camera.${base}${suffix}`;
    if (candidate !== cam && availableSet.has(candidate)) return candidate;
  }

  const fuzzy = [];
  for (const candidate of availableSet) {
    if (candidate === cam || !candidate.startsWith("camera.")) continue;
    if (recordableRank(candidate) === null) continue;
    const stem = stripSuffix(cameraObjectId(candidate));
    if (stemContainsBase(stem, base)) fuzzy.push(candidate);
  }
  const fuzzyPick = pickRecordable(fuzzy, availableSet, cam);
  if (fuzzyPick) return fuzzyPick;

  const bare = `camera.${base}`;
  if (bare !== cam && availableSet.has(bare) && !needsSibling(bare)) return bare;
  return null;
}

function buildGroups(cameras, available, deviceMap = {}) {
  /** @type {Record<string, string[]>} */
  const groups = {};
  for (const cameraId of cameras) {
    const cam = String(cameraId);
    if (!cam.startsWith("camera.")) continue;
    const sibling = findRecordableSibling(cam, available, deviceMap[cam]);
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
  "camera.back_garden_high_resolution_channel",
  "camera.garden_back_garden_fluent",
  "camera.driveway_high_resolution_channel",
  "camera.garden_driveway_fluent",
  "camera.doorbell_high_resolution_channel",
  "camera.reolink_video_doorbell_poe_w_fluent",
  "camera.inverter_high_resolution_channel",
];

assert(
  findRecordableSibling("camera.drive_high_resolution_channel", available) ===
    "camera.drive_fluent",
  "exact high_resolution_channel → fluent"
);
assert(
  findRecordableSibling("camera.yard", available) === null,
  "plain cam needs no sibling"
);

// Real Reolink naming from session 20261111T200751Z_3d19f9ff
assert(
  findRecordableSibling(
    "camera.back_garden_high_resolution_channel",
    available
  ) === "camera.garden_back_garden_fluent",
  "fuzzy garden_back_garden_fluent"
);
assert(
  findRecordableSibling(
    "camera.driveway_high_resolution_channel",
    available
  ) === "camera.garden_driveway_fluent",
  "fuzzy garden_driveway_fluent"
);
assert(
  findRecordableSibling(
    "camera.doorbell_high_resolution_channel",
    available
  ) === "camera.reolink_video_doorbell_poe_w_fluent",
  "fuzzy reolink doorbell fluent"
);
assert(
  findRecordableSibling(
    "camera.inverter_high_resolution_channel",
    available
  ) === null,
  "no fluent sibling → null"
);

// Device-registry path wins over fuzzy when provided.
assert(
  findRecordableSibling(
    "camera.driveway_high_resolution_channel",
    available,
    [
      "camera.driveway_high_resolution_channel",
      "camera.garden_driveway_fluent",
      "camera.something_else_fluent",
    ]
  ) === "camera.garden_driveway_fluent",
  "device map prefers same-device fluent"
);

const groups = buildGroups(
  [
    "camera.drive_high_resolution_channel",
    "camera.drive_fluent",
    "camera.yard",
    "camera.driveway_high_resolution_channel",
    "camera.garden_driveway_fluent",
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
assert(
  groups["camera.garden_driveway_fluent"]?.includes(
    "camera.driveway_high_resolution_channel"
  ),
  "driveway high-res shares garden_driveway_fluent group"
);
assert(
  groups["camera.garden_driveway_fluent"]?.includes(
    "camera.garden_driveway_fluent"
  ),
  "fluent selected with high-res → one record group (no double-record)"
);
assert(groups["camera.yard"]?.length === 1, "yard records itself");
assert(!groups["camera.drive_high_resolution_channel"], "no direct high-res group");
assert(
  !groups["camera.driveway_high_resolution_channel"],
  "no direct driveway high-res group"
);

console.log("record-siblings checks ok");
