/**
 * TV / kiosk mosaic helpers.
 *
 * Storage is **per-device** via browser localStorage (HA custom panels have no
 * stable device id for backend store; frontend user data would be per-user).
 */

export const TV_MODE_STORAGE_KEY = "cctv_dashboard:tv_mode";

/** Target stage aspect for wall TVs / kiosk displays. */
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
      safeTop = parseFloat(styles.getPropertyValue("env(safe-area-inset-top)")) || 0;
      // env() via getPropertyValue is unreliable; try padding on body as fallback later.
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
 * Largest 16:9 rectangle that fits in the available area.
 * @param {number} availW
 * @param {number} availH
 * @param {number} [aspect]
 * @returns {{ width: number, height: number }}
 */
export function fitStageBox(availW, availH, aspect = TV_STAGE_ASPECT) {
  const w = Number(availW) || 0;
  const h = Number(availH) || 0;
  const r = Number(aspect) > 0.05 ? Number(aspect) : TV_STAGE_ASPECT;
  if (w <= 1 || h <= 1) return { width: 0, height: 0 };
  if (w / h >= r) {
    const height = h;
    return { width: height * r, height };
  }
  const width = w;
  return { width, height: width / r };
}

/**
 * Available mosaic viewport for TV mode (window minus chrome).
 * @param {{ innerWidth?: number, innerHeight?: number } | null | undefined} [win]
 * @param {number} [chromePx]
 * @returns {{ availW: number, availH: number, stage: { width: number, height: number } }}
 */
export function tvStageFromViewport(win, chromePx) {
  const iw = Number(win?.innerWidth) || 0;
  const ih = Number(win?.innerHeight) || 0;
  const chrome = Number.isFinite(chromePx) ? chromePx : estimateTvChromePx();
  // Horizontal padding from .wrap (~1.25rem each side).
  const sidePad = 40;
  const availW = Math.max(0, iw - sidePad);
  const availH = Math.max(0, ih - chrome);
  return {
    availW,
    availH,
    stage: fitStageBox(availW, availH, TV_STAGE_ASPECT),
  };
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
