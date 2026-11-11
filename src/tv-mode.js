/**
 * TV / kiosk mosaic helpers.
 *
 * Storage is **per-device** via browser localStorage (HA custom panels have no
 * stable device id for backend store; frontend user data would be per-user).
 */

export const TV_MODE_STORAGE_KEY = "cctv_dashboard:tv_mode";

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
 * TV mosaic stage: **full content width** × chrome-aware height (above the fold).
 * Do not letterbox to 16:9 — that left large side gutters on wide TVs.
 *
 * @param {number} contentW  Panel content width (sidebar already excluded)
 * @param {number} viewportH Window / viewport height
 * @param {number} [chromePx]
 * @returns {{ availW: number, availH: number, stage: { width: number, height: number } }}
 */
export function tvStageFillWidth(contentW, viewportH, chromePx) {
  const w = Math.max(0, Number(contentW) || 0);
  const vh = Math.max(0, Number(viewportH) || 0);
  const chrome = Number.isFinite(chromePx) ? Number(chromePx) : estimateTvChromePx();
  const h = Math.max(0, vh - chrome);
  return {
    availW: w,
    availH: h,
    stage: { width: w, height: h },
  };
}

/**
 * @deprecated Prefer tvStageFillWidth with measured panel content width.
 * Kept for older call sites / tests that only have window metrics.
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
  return tvStageFillWidth(contentW, ih, chromePx);
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
