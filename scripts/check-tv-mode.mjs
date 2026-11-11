/** Sanity checks for TV mode geometry helpers. */
import {
  contentBoxWidth,
  tvPackGap,
  tvStageFillWidth,
  tvStageFromViewport,
} from "../src/tv-mode.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const filled = tvStageFillWidth(1600, 1080, 80);
assert(filled.stage.width === 1600, "fills measured content width");
assert(filled.stage.height === 1000, "chrome reserved from height");
assert(filled.availW === 1600 && filled.availH === 1000, "avail matches stage");

const tall = tvStageFillWidth(1000, 2000, 100);
assert(tall.stage.width === 1000, "tall viewport still full width");
assert(tall.stage.height === 1900, "tall height uses remaining chrome space");

const wide = tvStageFillWidth(2400, 900, 100);
assert(wide.stage.width === 2400, "ultrawide uses full content width");
assert(wide.stage.height === 800, "height is chrome-aware, not 16:9 letterbox");
assert(
  Math.abs(wide.stage.width / wide.stage.height - 16 / 9) > 0.2,
  "stage is not forced to 16:9"
);

const stage = tvStageFromViewport({ innerWidth: 1920, innerHeight: 1080 }, 80, 256);
assert(stage.stage.height === 1000, "viewport helper reserves chrome");
assert(stage.stage.width === 1920 - 256 - 40, "subtracts sidebar + side pad");

const fakeEl = {
  clientWidth: 1200,
};
assert(contentBoxWidth(fakeEl) === 1200, "contentBoxWidth without padding");

assert(tvPackGap(1) === 6, "tight gap for 1");
assert(tvPackGap(2) === 6, "tight gap for 2");
assert(tvPackGap(4) === 8, "normal gap for 4");

console.log("tv-mode checks ok");
