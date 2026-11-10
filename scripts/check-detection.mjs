/** Quick sanity checks for detection sensor helpers (no HA required). */
import {
  cameraBaseId,
  classifyDetectionSensor,
  formatDuration,
  mergeOverlappingSegments,
  normalizeSensorLinks,
  scoreSensorForCamera,
  segmentsFromHistory,
} from "../src/detection-sensors.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(cameraBaseId("camera.front_door_main") === "front_door", "base id");
assert(classifyDetectionSensor("binary_sensor.front_door_person").id === "person", "person");
assert(classifyDetectionSensor("binary_sensor.driveway_package_detected").id === "package", "package");
assert(
  scoreSensorForCamera(
    "camera.front_door",
    "binary_sensor.front_door_person",
    { attributes: { friendly_name: "Front Door Person" } }
  ) > 50,
  "score related"
);
assert(
  scoreSensorForCamera(
    "camera.front_door",
    "binary_sensor.kitchen_motion",
    { attributes: { friendly_name: "Kitchen Motion" } }
  ) < 20,
  "score unrelated"
);

const segs = segmentsFromHistory(
  [
    { s: "off", lu: 1000 },
    { s: "on", lu: 1100 },
    { s: "off", lu: 1200 },
  ],
  1000_000,
  1300_000,
  (s) => s === "on"
);
assert(segs.length === 1, "one segment");
assert(segs[0].start === 1100_000 && segs[0].end === 1200_000, "segment bounds");
assert(formatDuration(90_000) === "1m 30s", "duration");
const normalized = normalizeSensorLinks({
  "camera.a": ["binary_sensor.a_person", "light.x", "binary_sensor.a_person"],
  nope: ["binary_sensor.x"],
});
assert(normalized["camera.a"].length === 1, "normalize");
assert(!normalized.nope, "normalize drops non-camera keys");

const merged = mergeOverlappingSegments(
  [
    { start: 100, end: 200 },
    { start: 150, end: 250 }, // overlap → one car-like instance
    { start: 400, end: 500 },
    { start: 501, end: 600 }, // near-contiguous with 1ms pad
  ],
  1
);
assert(merged.length === 2, "merge overlapping + near-contiguous");
assert(merged[0].start === 100 && merged[0].end === 250, "merged bounds");
assert(merged[1].start === 400 && merged[1].end === 600, "padded merge");

console.log("detection-sensors checks ok");
