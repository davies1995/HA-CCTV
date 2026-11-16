/** Zones + high-stream pick helpers. */
import assert from "node:assert/strict";
import {
  normalizeStreamGroups,
  pickHighStreamFromGroup,
} from "../src/stream-groups.js";
import {
  normalizeZones,
  removeZone,
  upsertZone,
  zoneById,
  zonesForGroup,
} from "../src/zones.js";

const groups = normalizeStreamGroups([
  {
    id: "grp_driveway",
    name: "Driveway",
    members: [
      "camera.driveway_high_resolution_channel",
      "camera.garden_driveway_fluent",
    ],
  },
  {
    id: "grp_porch",
    name: "Porch",
    members: ["camera.porch_main", "camera.porch_fluent"],
  },
]);

assert.equal(
  pickHighStreamFromGroup(groups[0].members),
  "camera.driveway_high_resolution_channel",
  "high-res preferred"
);

let zones = normalizeZones(
  [
    { id: "zone_front", name: "Front", group_ids: ["grp_driveway", "missing"] },
    { name: "Back", group_ids: ["grp_porch"] },
  ],
  groups
);
assert.equal(zones[0].group_ids.length, 1, "drops unknown group ids");
assert.ok(zoneById(zones, "zone_front"), "zone by id");
assert.equal(zonesForGroup(zones, "grp_porch").length, 1, "zones for group");

zones = upsertZone(
  zones,
  { id: "zone_front", name: "Front yard", group_ids: ["grp_driveway", "grp_porch"] },
  groups
);
assert.deepEqual(zoneById(zones, "zone_front").group_ids, [
  "grp_driveway",
  "grp_porch",
]);
zones = removeZone(zones, "zone_front", groups);
assert.equal(zoneById(zones, "zone_front"), null, "removed");

console.log("zones checks ok");
