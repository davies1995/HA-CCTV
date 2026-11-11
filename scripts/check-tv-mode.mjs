/** Sanity checks for TV mode geometry helpers. */
import {
  fitStageBox,
  tvPackGap,
  tvStageFromViewport,
  TV_STAGE_ASPECT,
} from "../src/tv-mode.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const box = fitStageBox(1920, 1080);
assert(Math.abs(box.width / box.height - TV_STAGE_ASPECT) < 1e-6, "16:9 full HD");
assert(box.width === 1920 && box.height === 1080, "fills 1920x1080");

const tall = fitStageBox(1000, 2000);
assert(Math.abs(tall.width - 1000) < 1e-6, "width limited");
assert(Math.abs(tall.height - 1000 / TV_STAGE_ASPECT) < 1e-6, "height from aspect");

const wide = fitStageBox(2000, 800);
assert(Math.abs(wide.height - 800) < 1e-6, "height limited");
assert(Math.abs(wide.width - 800 * TV_STAGE_ASPECT) < 1e-6, "width from aspect");

const stage = tvStageFromViewport({ innerWidth: 1920, innerHeight: 1080 }, 80);
assert(stage.stage.height <= 1080 - 80, "chrome reserved");
assert(stage.stage.width / stage.stage.height - TV_STAGE_ASPECT < 1e-6, "stage 16:9");

assert(tvPackGap(1) === 6, "tight gap for 1");
assert(tvPackGap(2) === 6, "tight gap for 2");
assert(tvPackGap(4) === 8, "normal gap for 4");

console.log("tv-mode checks ok");
