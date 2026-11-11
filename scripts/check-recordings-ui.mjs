/** Sanity checks for saved-detection playability helpers. */
import {
  clipIsPlayable,
  sessionIsPlayable,
  sessionTotalBytes,
} from "../src/detection-playback.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(clipIsPlayable({ kind: "video", size: 100 }) === true, "video ok");
assert(clipIsPlayable({ kind: "video", size: 0 }) === false, "empty video");
assert(clipIsPlayable({ kind: "snapshot", size: 12 }) === true, "snap ok");
assert(clipIsPlayable({ kind: "snapshot", size: 0 }) === false, "empty snap");

const empty = {
  active: false,
  total_bytes: 0,
  clips: [{ kind: "video", size: 0, url: "/x.mp4" }],
};
assert(sessionTotalBytes(empty) === 0, "total 0");
assert(sessionIsPlayable(empty) === false, "empty not playable");

const live = {
  active: true,
  total_bytes: 0,
  clips: [],
};
assert(sessionIsPlayable(live) === false, "active not playable via helper");

const good = {
  active: false,
  total_bytes: 1_700_000,
  clips: [{ kind: "video", size: 1_700_000, url: "/y.mp4" }],
};
assert(sessionIsPlayable(good) === true, "bytes playable");

console.log("recordings-ui checks ok");
