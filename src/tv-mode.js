/**
 * TV / kiosk mosaic helpers.
 *
 * Storage is **per-device** via browser localStorage (HA custom panels have no
 * stable device id for backend store; frontend user data would be per-user).
 */

export const TV_MODE_STORAGE_KEY = "cctv_dashboard:tv_mode";

/** Fixed mosaic stage aspect (width / height). */
export const TV_STAGE_ASPECT = 16 / 9;

/**
 * @returns {boolean}
 */
export function loadTvMode() {
  try {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem(TV_MODE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * @param {boolean} enabled
 */
export function saveTvMode(enabled) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(TV_MODE_STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* private mode / blocked storage */
  }
}

/**
 * Estimate chrome that steals vertical space from the mosaic (HA header,
 * optional kiosk inset CSS var, safe areas, panel title row).
 * @param {Document | null | undefined} [doc]
 * @returns {number}
 */
export function estimateTvChromePx(doc = typeof document !== "undefined" ? document : null) {
  let header = 56;
  let safeTop = 0;
  let safeBottom = 0;
  let kiosk = 0;
  try {
    const root = doc?.documentElement;
    if (root) {
      const styles = getComputedStyle(root);
      header = parseFloat(styles.getPropertyValue("--app-header-height")) || header;
      kiosk = parseFloat(styles.getPropertyValue("--cctv-kiosk-inset")) || 0;
    }
  } catch {
    /* ignore */
  }
  // Compact panel title/actions row when TV mode is on.
  const topBar = 56;
  // Small breathing room so the mosaic never clips under HA/kiosk chrome.
  const pad = 12;
  return Math.max(0, header + safeTop + safeBottom + kiosk + topBar + pad);
}

/**
 * Content-box width of an element (clientWidth minus horizontal padding).
 * Prefer measuring the panel wrap so HA sidebar is already excluded.
 * @param {Element | null | undefined} el
 * @returns {number}
 */
export function contentBoxWidth(el) {
  if (!el || typeof el.clientWidth !== "number") return 0;
  let pad = 0;
  try {
    if (typeof getComputedStyle === "function") {
      const styles = getComputedStyle(el);
      pad =
        (parseFloat(styles.paddingLeft) || 0) +
        (parseFloat(styles.paddingRight) || 0);
    }
  } catch {
    /* ignore */
  }
  return Math.max(0, el.clientWidth - pad);
}

/**
 * Largest 16:9 box that fits inside maxW × maxH (inscribed).
 * Prefer {@link tvStageFullContentWidth} for TV mode — inscribing against
 * height shrinks width and leaves side gutters.
 *
 * @param {number} maxW
 * @param {number} maxH
 * @param {number} [aspect]
 * @returns {{ width: number, height: number }}
 */
export function fitStageBox(maxW, maxH, aspect = TV_STAGE_ASPECT) {
  const w = Math.max(0, Number(maxW) || 0);
  const h = Math.max(0, Number(maxH) || 0);
  const a = Number(aspect) > 0 ? Number(aspect) : TV_STAGE_ASPECT;
  if (w <= 0 || h <= 0) return { width: 0, height: 0 };
  if (w / h >= a) {
    return { width: h * a, height: h };
  }
  return { width: w, height: w / a };
}

/**
 * TV mosaic stage: **16:9**, width = full content width (sidebar excluded),
 * height = width / (16/9). Never shrink width to fit chrome height — that
 * was the old inscribed box that left large side gutters. Extra vertical
 * room after chrome is reported as `offsetTop` for centering.
 *
 * @param {number} contentW  Panel content width (sidebar already excluded)
 * @param {number} viewportH Window / viewport height
 * @param {number} [chromePx]
 * @returns {{
 *   availW: number,
 *   availH: number,
 *   offsetTop: number,
 *   stage: { width: number, height: number }
 * }}
 */
export function tvStageFullContentWidth(contentW, viewportH, chromePx) {
  const w = Math.max(0, Number(contentW) || 0);
  const vh = Math.max(0, Number(viewportH) || 0);
  const chrome = Number.isFinite(chromePx) ? Number(chromePx) : estimateTvChromePx();
  const availH = Math.max(0, vh - chrome);
  const stageH = w > 0 ? w / TV_STAGE_ASPECT : 0;
  const offsetTop = Math.max(0, (availH - stageH) / 2);
  return {
    availW: w,
    availH,
    offsetTop,
    stage: { width: w, height: stageH },
  };
}

/** @deprecated Use {@link tvStageFullContentWidth}. */
export function tvStageFillWidth(contentW, viewportH, chromePx) {
  return tvStageFullContentWidth(contentW, viewportH, chromePx);
}

/**
 * @param {{ innerWidth?: number, innerHeight?: number } | null | undefined} [win]
 * @param {number} [chromePx]
 * @param {number} [sidebarPx] Approximate HA sidebar width to subtract
 */
export function tvStageFromViewport(win, chromePx, sidebarPx = 0) {
  const iw = Number(win?.innerWidth) || 0;
  const ih = Number(win?.innerHeight) || 0;
  const side = Math.max(0, Number(sidebarPx) || 0);
  // Horizontal padding from .wrap (~1.25rem each side).
  const sidePad = 40;
  const contentW = Math.max(0, iw - side - sidePad);
  return tvStageFullContentWidth(contentW, ih, chromePx);
}

/**
 * Packing gap: tighter for few cameras so tiles maximize the TV stage.
 * @param {number} cameraCount
 * @returns {number}
 */
export function tvPackGap(cameraCount) {
  const n = Number(cameraCount) || 0;
  if (n <= 2) return 6;
  return 8;
}
