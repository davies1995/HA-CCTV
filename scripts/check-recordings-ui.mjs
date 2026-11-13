/** Sanity checks for saved-detection playability + paging helpers. */
import {
  clipIsPlayable,
  paginateSessions,
  SAVED_DETECTIONS_PAGE_SIZE,
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
assert(sessionIsPlayable(live) === false, "empty active not playable");

const liveWithMedia = {
  active: true,
  total_bytes: 5_000_000,
  clips: [{ kind: "video", size: 5_000_000, url: "/z.mp4" }],
};
assert(
  sessionIsPlayable(liveWithMedia) === true,
  "active with media is playable"
);

const good = {
  active: false,
  total_bytes: 1_700_000,
  clips: [{ kind: "video", size: 1_700_000, url: "/y.mp4" }],
};
assert(sessionIsPlayable(good) === true, "bytes playable");

assert(SAVED_DETECTIONS_PAGE_SIZE === 10, "page size 10");
const many = Array.from({ length: 23 }, (_, i) => ({ id: i }));
const page1 = paginateSessions(many, 1);
assert(page1.items.length === 10 && page1.pageCount === 3, "page 1");
const page3 = paginateSessions(many, 3);
assert(page3.items.length === 3 && page3.page === 3, "page 3 last");
const clamped = paginateSessions(many, 99);
assert(clamped.page === 3, "clamp high page");

const total = [good, liveWithMedia].reduce((s, x) => s + sessionTotalBytes(x), 0);
assert(total === 1_700_000 + 5_000_000, "shared total size");

console.log("recordings-ui checks ok");
