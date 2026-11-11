/** Sanity checks for TV mode geometry helpers. */
import {
  contentBoxWidth,
  fitStageBox,
  tvPackGap,
  tvStageFullContentWidth,
  tvStageFromViewport,
  TV_STAGE_ASPECT,
} from "../src/tv-mode.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const box = fitStageBox(1920, 1080);
assert(Math.abs(box.width / box.height - TV_STAGE_ASPECT) < 1e-6, "16:9 full HD");
assert(box.width === 1920 && box.height === 1080, "fills 1920x1080");

const inscribed = fitStageBox(2000, 800);
assert(Math.abs(inscribed.height - 800) < 1e-6, "inscribe height limited");
assert(Math.abs(inscribed.width - 800 * TV_STAGE_ASPECT) < 1e-6, "inscribe shrinks width");

const filled = tvStageFullContentWidth(1600, 1080, 80);
assert(filled.stage.width === 1600, "fills measured content width");
assert(
  Math.abs(filled.stage.height - 1600 / TV_STAGE_ASPECT) < 1e-6,
  "height from 16:9"
);
assert(Math.abs(filled.stage.width / filled.stage.height - TV_STAGE_ASPECT) < 1e-6, "stage 16:9");
assert(filled.availH === 1000, "chrome reserved in availH");
assert(filled.offsetTop === Math.max(0, (1000 - filled.stage.height) / 2), "vertical center offset");

const short = tvStageFullContentWidth(1920, 900, 100);
assert(short.stage.width === 1920, "never shrink width for short viewport");
assert(
  Math.abs(short.stage.height - 1920 / TV_STAGE_ASPECT) < 1e-6,
  "16:9 height may exceed availH"
);
assert(short.stage.height > short.availH, "timeline can sit below fold");
assert(short.offsetTop === 0, "no top offset when stage taller than avail");

const wide = tvStageFullContentWidth(2400, 1600, 100);
assert(wide.stage.width === 2400, "ultrawide uses full content width");
assert(Math.abs(wide.stage.width / wide.stage.height - TV_STAGE_ASPECT) < 1e-6, "ultrawide still 16:9");

const stage = tvStageFromViewport({ innerWidth: 1920, innerHeight: 1080 }, 80, 256);
assert(stage.stage.width === 1920 - 256 - 40, "subtracts sidebar + side pad");
assert(Math.abs(stage.stage.width / stage.stage.height - TV_STAGE_ASPECT) < 1e-6, "viewport helper 16:9");

assert(contentBoxWidth({ clientWidth: 1200 }) === 1200, "contentBoxWidth without padding");

assert(tvPackGap(1) === 6, "tight gap for 1");
assert(tvPackGap(2) === 6, "tight gap for 2");
assert(tvPackGap(4) === 8, "normal gap for 4");

console.log("tv-mode checks ok");
