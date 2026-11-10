/** Sanity checks for aspect-aware mosaic packing. */
import {
  aspectFromSize,
  contiguousPartitions,
  normalizeAspect,
  packAspectMosaic,
} from "../src/mosaic-pack.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(normalizeAspect(0) === 16 / 9, "bad aspect falls back");
assert(Math.abs(aspectFromSize(1080, 1920) - 1080 / 1920) < 1e-9, "portrait aspect");

assert(contiguousPartitions(["a", "b"]).length === 2, "partitions of 2");
// [a][b] and [a,b]
assert(
  contiguousPartitions(["a", "b", "c"]).length === 4,
  "partitions of 3"
);

const boxW = 1200;
const boxH = 800;

const one = packAspectMosaic([{ id: "camera.a", aspect: 16 / 9 }], boxW, boxH, 10);
assert(one.length === 1, "one camera");
assert(one[0].width <= boxW && one[0].height <= boxH, "one fits");

const mixed = packAspectMosaic(
  [
    { id: "camera.wide", aspect: 16 / 9 },
    { id: "camera.tall", aspect: 9 / 16 },
    { id: "camera.wide2", aspect: 16 / 9 },
  ],
  boxW,
  boxH,
  10
);
assert(mixed.length === 3, "mixed count");
for (const cell of mixed) {
  assert(cell.left >= -0.5 && cell.top >= -0.5, "in box");
  assert(cell.left + cell.width <= boxW + 0.5, "width fits");
  assert(cell.top + cell.height <= boxH + 0.5, "height fits");
  assert(Math.abs(cell.width / cell.height - cell.aspect) < 0.05, "keeps aspect");
}

const twoPortrait = packAspectMosaic(
  [
    { id: "camera.p1", aspect: 9 / 16 },
    { id: "camera.p2", aspect: 9 / 16 },
  ],
  boxW,
  boxH,
  10
);
const area = twoPortrait.reduce((s, c) => s + c.width * c.height, 0);
assert(area > boxW * boxH * 0.35, "two portraits use meaningful area");

console.log("mosaic-pack checks ok");
