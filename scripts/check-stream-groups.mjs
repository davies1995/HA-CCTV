/** Sanity checks for physical-camera stream groups. */
import {
  camerasForSensorExpanded,
  failoverStreamOrder,
  groupForCamera,
  normalizeStreamGroups,
  pickLowStreamFromGroup,
  removeStreamGroup,
  suggestGroupMembersFromDevice,
  syncSensorLinksAcrossGroups,
  upsertStreamGroup,
} from "../src/stream-groups.js";
import { camerasForTriggerSensors } from "../src/detection-playback.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const raw = [
  {
    id: "grp_driveway",
    name: "Driveway",
    members: [
      "camera.driveway_high_resolution_channel",
      "camera.garden_driveway_fluent",
      "not_a_camera",
      "camera.driveway_high_resolution_channel",
    ],
  },
  {
    id: "solo",
    name: "Solo",
    members: ["camera.only_one"],
  },
];

const groups = normalizeStreamGroups(raw);
assert(groups.length === 1, "solo dropped");
assert(groups[0].members.length === 2, "dedupe members");
assert(
  groupForCamera(groups, "camera.garden_driveway_fluent")?.id === "grp_driveway",
  "lookup member"
);

let links = {
  "camera.driveway_high_resolution_channel": ["binary_sensor.drive_person"],
};
links = syncSensorLinksAcrossGroups(links, groups);
assert(
  links["camera.garden_driveway_fluent"]?.includes("binary_sensor.drive_person"),
  "mirror sensors to fluent"
);
assert(
  camerasForSensorExpanded(links, groups, "binary_sensor.drive_person").includes(
    "camera.driveway_high_resolution_channel"
  ),
  "expand high-res"
);
assert(
  camerasForSensorExpanded(links, groups, "binary_sensor.drive_person").includes(
    "camera.garden_driveway_fluent"
  ),
  "expand fluent"
);

const triggers = camerasForTriggerSensors(
  links,
  ["binary_sensor.drive_person"],
  groups
);
assert(triggers.length === 2, "trigger expand via groups");

const next = upsertStreamGroup(groups, {
  id: "grp_doorbell",
  name: "Doorbell",
  members: [
    "camera.doorbell_high_resolution_channel",
    "camera.reolink_video_doorbell_poe_w_fluent",
  ],
});
assert(next.length === 2, "second group");
assert(
  !groupForCamera(next, "camera.driveway_high_resolution_channel")
    ?.members.includes("camera.doorbell_high_resolution_channel"),
  "groups stay separate"
);

const deviceMap = new Map([
  ["camera.back_garden_high_resolution_channel", "dev1"],
  ["camera.garden_back_garden_fluent", "dev1"],
  ["camera.other", "dev2"],
]);
const suggested = suggestGroupMembersFromDevice(
  "camera.back_garden_high_resolution_channel",
  {
    cameras: [
      { entityId: "camera.back_garden_high_resolution_channel" },
      { entityId: "camera.garden_back_garden_fluent" },
      { entityId: "camera.other" },
    ],
    deviceMap,
    groups: next,
  }
);
assert(
  suggested.includes("camera.garden_back_garden_fluent"),
  "device suggest fluent"
);
assert(!suggested.includes("camera.other"), "other device excluded");

const cleared = removeStreamGroup(next, "grp_driveway");
assert(!groupForCamera(cleared, "camera.garden_driveway_fluent"), "ungroup");

const failover = failoverStreamOrder(
  "camera.driveway_high_resolution_channel",
  [
    "camera.driveway_high_resolution_channel",
    "camera.garden_driveway_fluent",
    "camera.driveway_clear",
  ]
);
assert(failover[0] === "camera.garden_driveway_fluent", "failover prefers fluent");
assert(
  pickLowStreamFromGroup(
    [
      "camera.driveway_high_resolution_channel",
      "camera.garden_driveway_fluent",
    ],
    "camera.driveway_high_resolution_channel"
  ) === "camera.garden_driveway_fluent",
  "low stream from group"
);

console.log("stream-groups checks ok");
