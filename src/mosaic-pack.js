/**
 * Aspect-aware mosaic packing for desktop CCTV layouts (1–4 cameras).
 *
 * Each camera keeps its width/height ratio. We try row and column partitions
 * and pick the placement that maximizes used video area inside the box.
 */

export const DEFAULT_ASPECT = 16 / 9;

/** Shared UI / store labels for forced mosaic packing. */
export const FORCE_ASPECT_OPTIONS = [
  { value: "auto", label: "Auto (detect)", ratio: null },
  { value: "16:9", label: "16:9 landscape", ratio: 16 / 9 },
  { value: "9:16", label: "9:16 portrait", ratio: 9 / 16 },
  { value: "4:3", label: "4:3 landscape", ratio: 4 / 3 },
  { value: "3:4", label: "3:4 portrait", ratio: 3 / 4 },
  { value: "1:1", label: "1:1 square", ratio: 1 },
  { value: "3:2", label: "3:2 landscape", ratio: 3 / 2 },
  { value: "2:3", label: "2:3 portrait", ratio: 2 / 3 },
  { value: "custom", label: "Custom W:H…", ratio: null },
];

const CUSTOM_ASPECT_RE = /^(\d+(?:\.\d+)?)[:x×*](\d+(?:\.\d+)?)$/i;

/**
 * Parse a preset or custom W:H / WxH label into a normalized store value.
 * @param {string | null | undefined} label
 * @returns {string} normalized label or "auto"
 */
export function normalizeForceAspectLabel(label) {
  let value = String(label || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/×/g, "x")
    .replace(/\*/g, "x");
  if (
    !value ||
    value === "auto" ||
    value === "default" ||
    value === "none" ||
    value === "custom"
  ) {
    return "auto";
  }
  if (FORCE_ASPECT_OPTIONS.some((opt) => opt.value === value && opt.value !== "custom")) {
    return value;
  }
  const match = CUSTOM_ASPECT_RE.exec(value);
  if (!match) return "auto";
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0 ||
    width / height < 0.05 ||
    width / height > 20
  ) {
    return "auto";
  }
  if (Number.isInteger(width) && Number.isInteger(height)) {
    return `${width}:${height}`;
  }
  // Trim trailing zeros via Number → string (matches Python :g).
  return `${Number(width.toPrecision(12))}:${Number(height.toPrecision(12))}`;
}

/**
 * @param {string | null | undefined} label
 * @returns {number | null}
 */
export function forceAspectRatio(label) {
  const normalized = normalizeForceAspectLabel(label);
  if (normalized === "auto") return null;
  const opt = FORCE_ASPECT_OPTIONS.find((row) => row.value === normalized);
  if (opt?.ratio) return opt.ratio;
  const [w, h] = normalized.split(":").map(Number);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
  return w / h;
}

/**
 * Whether a stored label is one of the built-in presets (not freeform custom).
 * @param {string | null | undefined} label
 */
export function isPresetForceAspect(label) {
  const normalized = normalizeForceAspectLabel(label);
  if (normalized === "auto") return true;
  return FORCE_ASPECT_OPTIONS.some(
    (opt) => opt.value === normalized && opt.value !== "custom"
  );
}

/**
 * Select value for the force-aspect dropdown (preset or "custom").
 * @param {string | null | undefined} label
 */
export function forceAspectSelectValue(label) {
  const normalized = normalizeForceAspectLabel(label);
  if (normalized === "auto") return "auto";
  if (isPresetForceAspect(normalized)) return normalized;
  return "custom";
}

/**
 * @param {Record<string, string> | null | undefined} raw
 * @returns {Record<string, string>}
 */
export function normalizeForceAspectMap(raw) {
  if (!raw || typeof raw !== "object") return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const [cameraId, label] of Object.entries(raw)) {
    if (!String(cameraId).startsWith("camera.")) continue;
    const normalized = normalizeForceAspectLabel(label);
    if (normalized === "auto") continue;
    out[cameraId] = normalized;
  }
  return out;
}

/**
 * @param {number | null | undefined} value
 * @returns {number}
 */
export function normalizeAspect(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0.05 || n > 20) return DEFAULT_ASPECT;
  return n;
}

/**
 * @param {number} width
 * @param {number} height
 */
export function aspectFromSize(width, height) {
  const w = Number(width);
  const h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return DEFAULT_ASPECT;
  }
  return normalizeAspect(w / h);
}

/**
 * Ordered partitions into 1..n non-empty contiguous groups (keeps input order).
 * @template T
 * @param {T[]} items
 * @returns {T[][][]}
 */
export function contiguousPartitions(items) {
  const n = items.length;
  if (!n) return [];
  /** @type {T[][][]} */
  const out = [];

  function walk(start, acc) {
    if (start === n) {
      out.push(acc.map((g) => g.slice()));
      return;
    }
    for (let end = start + 1; end <= n; end += 1) {
      acc.push(items.slice(start, end));
      walk(end, acc);
      acc.pop();
    }
  }

  walk(0, []);
  return out;
}

/**
 * Pack groups as horizontal rows inside the box.
 * @param {Array<Array<{ id: string, aspect: number }>>} rows
 * @param {number} boxW
 * @param {number} boxH
 * @param {number} gap
 */
function packAsRows(rows, boxW, boxH, gap) {
  if (!rows.length || boxW <= 0 || boxH <= 0) return null;

  const rowGaps = Math.max(0, rows.length - 1) * gap;
  const availH = boxH - rowGaps;
  if (availH <= 0) return null;

  // Max height each row can take when stretched to full width.
  const maxH = rows.map((row) => {
    const sumA = row.reduce((s, c) => s + c.aspect, 0);
    const colGaps = Math.max(0, row.length - 1) * gap;
    const innerW = boxW - colGaps;
    if (sumA <= 0 || innerW <= 0) return 0;
    return innerW / sumA;
  });

  if (maxH.some((h) => h <= 0)) return null;

  const sumMax = maxH.reduce((s, h) => s + h, 0);
  // Scale all row heights uniformly so they fit availH (and never exceed per-row max).
  const scale = Math.min(1, availH / sumMax);
  const heights = maxH.map((h) => h * scale);

  /** @type {Array<{ id: string, left: number, top: number, width: number, height: number, aspect: number }>} */
  const cells = [];
  let top = (boxH - (heights.reduce((s, h) => s + h, 0) + rowGaps)) / 2;

  rows.forEach((row, ri) => {
    const h = heights[ri];
    const widths = row.map((c) => c.aspect * h);
    const usedW =
      widths.reduce((s, w) => s + w, 0) + Math.max(0, row.length - 1) * gap;
    let left = (boxW - usedW) / 2;
    row.forEach((cam, ci) => {
      cells.push({
        id: cam.id,
        left,
        top,
        width: widths[ci],
        height: h,
        aspect: cam.aspect,
      });
      left += widths[ci] + gap;
    });
    top += h + gap;
  });

  const totalArea = cells.reduce((s, c) => s + c.width * c.height, 0);
  return { cells, totalArea };
}

/**
 * Pack groups as vertical columns inside the box.
 * @param {Array<Array<{ id: string, aspect: number }>>} cols
 * @param {number} boxW
 * @param {number} boxH
 * @param {number} gap
 */
function packAsColumns(cols, boxW, boxH, gap) {
  // Dual of rows: treat aspect' = 1/aspect and swap width/height.
  const mirrored = cols.map((col) =>
    col.map((c) => ({ id: c.id, aspect: 1 / c.aspect }))
  );
  const packed = packAsRows(mirrored, boxH, boxW, gap);
  if (!packed) return null;
  return {
    totalArea: packed.totalArea,
    cells: packed.cells.map((c) => ({
      id: c.id,
      left: c.top,
      top: c.left,
      width: c.height,
      height: c.width,
      aspect: 1 / c.aspect,
    })),
  };
}

/**
 * Choose the densest packing of cameras into the container.
 * @param {Array<{ id: string, aspect?: number }>} cameras
 * @param {number} boxW
 * @param {number} boxH
 * @param {number} [gap]
 * @returns {Array<{ id: string, left: number, top: number, width: number, height: number, aspect: number }>}
 */
export function packAspectMosaic(cameras, boxW, boxH, gap = 10) {
  const items = (cameras || []).map((c) => ({
    id: String(c.id),
    aspect: normalizeAspect(c.aspect),
  }));
  if (!items.length || boxW <= 1 || boxH <= 1) return [];

  let best = null;
  let bestArea = -1;

  for (const parts of contiguousPartitions(items)) {
    for (const candidate of [packAsRows(parts, boxW, boxH, gap), packAsColumns(parts, boxW, boxH, gap)]) {
      if (candidate && candidate.totalArea > bestArea) {
        bestArea = candidate.totalArea;
        best = candidate.cells;
      }
    }
  }

  return best || [];
}

/**
 * Convert pixel cells to % styles for absolute positioning.
 * @param {Array<{ id: string, left: number, top: number, width: number, height: number }>} cells
 * @param {number} boxW
 * @param {number} boxH
 */
export function cellsToPercentStyles(cells, boxW, boxH) {
  if (!boxW || !boxH) return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const cell of cells) {
    out[cell.id] = [
      `left:${(cell.left / boxW) * 100}%`,
      `top:${(cell.top / boxH) * 100}%`,
      `width:${(cell.width / boxW) * 100}%`,
      `height:${(cell.height / boxH) * 100}%`,
    ].join(";");
  }
  return out;
}
