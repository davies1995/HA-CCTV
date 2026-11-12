/**
 * Shared quality/aspect map helpers used by settings + Choose cameras.
 */
import assert from "node:assert/strict";
import {
  mirrorForceAspectAcrossGroup,
  forceAspectFromMap,
  forceAspectSelectValue,
} from "../src/mosaic-pack.js";
import {
  mirrorQualityAcrossGroup,
  qualityFromMap,
  resolveQuality,
} from "../src/quality.js";

const members = [
  "camera.driveway_high_resolution_channel",
  "camera.garden_driveway_fluent",
];

const qualityMap = mirrorQualityAcrossGroup(
  {},
  "camera.driveway_high_resolution_channel",
  "high",
  members
);
assert.equal(
  qualityMap["camera.driveway_high_resolution_channel"],
  "high",
  "quality mirrored to preferred"
);
assert.equal(
  qualityMap["camera.garden_driveway_fluent"],
  "high",
  "quality mirrored to sibling"
);
assert.equal(
  qualityFromMap(qualityMap, "camera.garden_driveway_fluent", members),
  "high",
  "sibling lookup"
);
assert.equal(
  resolveQuality({}, "camera.garden_driveway_fluent", qualityMap, members),
  "high",
  "resolveQuality group fallback"
);

const aspectMap = mirrorForceAspectAcrossGroup(
  {},
  "camera.garden_driveway_fluent",
  "9:16",
  members
);
assert.equal(
  forceAspectFromMap(aspectMap, "camera.driveway_high_resolution_channel", members),
  "9:16",
  "aspect group fallback"
);
assert.equal(
  forceAspectSelectValue(
    forceAspectFromMap(aspectMap, "camera.driveway_high_resolution_channel", members)
  ),
  "9:16",
  "select value for preset"
);

const cleared = mirrorQualityAcrossGroup(
  qualityMap,
  "camera.driveway_high_resolution_channel",
  "auto",
  members
);
assert.deepEqual(cleared, {}, "auto clears mirrored quality");

console.log("prefs-display checks ok");
