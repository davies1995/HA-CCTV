import { LitElement, html, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { sharedStyles } from "./styles.js";
import {
  availableCameraActions,
  callCameraService,
  cameraFromState,
  listCameras,
  openMoreInfo,
} from "./cameras.js";
import {
  DETECTION_KINDS,
  describeLinkedSensors,
  listLinkableSensors,
  loadEntityDeviceMap,
  suggestDetectionSensors,
} from "./detection-sensors.js";
import {
  QUALITY_OPTIONS,
  mirrorQualityAcrossGroup,
  normalizeCameraQualityMap,
  qualityHelp,
  resolveQuality,
  resolveStreamCamera,
  writeStoredQuality,
} from "./quality.js";
import {
  clipPositionAtTime,
  detectionLabelsFromTriggers,
  findSessionForTimelineEvent,
  formatBytes,
  paginateSessions,
  playbackTracksFromSession,
  playbackWindow,
  resolvePlaybackCameraIds,
  SAVED_DETECTIONS_PAGE_SIZE,
  sessionIsPlayable,
  sessionTotalBytes,
  triggerHighlightsForPlayback,
} from "./detection-playback.js";
import {
  cellsToPercentStyles,
  DEFAULT_ASPECT,
  FORCE_ASPECT_OPTIONS,
  forceAspectFromMap,
  forceAspectRatio,
  forceAspectSelectValue,
  isPresetForceAspect,
  mirrorForceAspectAcrossGroup,
  normalizeAspect,
  normalizeForceAspectLabel,
  normalizeForceAspectMap,
  packAspectMosaic,
} from "./mosaic-pack.js";
import {
  clearAllDetections,
  deleteRecording,
  listRecordings,
  loadSharedConfig,
  saveCameraPrefs,
  saveRecordingSettings,
  saveSensorLinks,
  saveStreamGroups,
  saveUserNotifyPreference,
  signPlaybackTracks,
  mediaApiPathFromClip,
  signRecordingUrl,
} from "./recordings-api.js";
import { loadPanelData, savePanelSelection } from "./selection-store.js";
import {
  failoverStreamOrder,
  groupForCamera,
  groupMembersForCamera,
  normalizeStreamGroups,
  removeStreamGroup,
  suggestGroupMembersFromDevice,
  syncSensorLinksAcrossGroups,
  upsertStreamGroup,
} from "./stream-groups.js";
import { DEFAULT_MAX_STREAMS, streamSlots } from "./stream-slots.js";
import {
  contentBoxWidth,
  estimateTvChromePx,
  loadTvMode,
  saveTvMode,
  tvPackGap,
  tvStageFullContentWidth,
} from "./tv-mode.js";
import "./stream-player.js";
import "./detection-timeline.js";

/**
 * Shared CCTV UI for the sidebar panel and Lovelace cards.
 *
 * Panel mode: pick up to 4 cameras; layout fills 1 / splits 2–4.
 * Visible-camera selection is per-user. Detection sensor links, quality,
 * force-aspect, and recording settings are site-wide (all HA users share them).
 */
export class CctvView extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    panelMode: { type: Boolean, attribute: "panel-mode" },
    /** HA panel url_path (default cctv) — used to detect sidebar leave. */
    panelUrlPath: { type: String, attribute: "panel-url-path" },
    _detailId: { state: true },
    _status: { state: true },
    _qualityTick: { state: true },
    /** @type {string[]} */
    _visibleIds: { state: true },
    /** @type {Record<string, string[]>} */
    _sensorLinks: { state: true },
    /** @type {import("./stream-groups.js").StreamGroup[]} physical-camera groups */
    _streamGroups: { state: true },
    /** Draft member entity ids while editing a stream group on detail. */
    _groupDraftMembers: { state: true },
    /** Draft display name for the stream group on detail. */
    _groupDraftName: { state: true },
    /** @type {Record<string, string>} draft forced aspect labels */
    _forceAspect: { state: true },
    /** @type {Record<string, string>} last saved forced aspect */
    _savedForceAspect: { state: true },
    /** @type {Record<string, string>} draft shared quality (auto omitted) */
    _cameraQuality: { state: true },
    /** @type {Record<string, string>} last saved shared quality */
    _savedCameraQuality: { state: true },
    /** Freeform custom aspect text while editing */
    _customAspectDraft: { state: true },
    _prefsDirty: { state: true },
    _pickerOpen: { state: true },
    _settingsOpen: { state: true },
    _selectionReady: { state: true },
    _saving: { state: true },
    _sensorFilter: { state: true },
    _deviceMapReady: { state: true },
    _retentionDays: { state: true },
    _recordOnDetection: { state: true },
    /** @type {string[]} detection kinds that save video clips */
    _recordDetectionKinds: { state: true },
    /** Per-user: notify this HA account when a detection is recorded */
    _notifyOnDetection: { state: true },
    /** @type {Array<any>} */
    _sessions: { state: true },
    /** 1-based page for Saved detections (10 per page). */
    _recordingsPage: { state: true },
    _recordDir: { state: true },
    /** Settings-only copyable recording diagnostics (not on main dashboard). */
    _recordingDebug: { state: true },
    _recordingDebugSummary: { state: true },
    _isDesktop: { state: true },
    /** Per-device TV / kiosk mosaic layout (localStorage). */
    _tvMode: { state: true },
    /** @type {Record<string, number>} */
    _aspectById: { state: true },
    /** @type {Record<string, string>} */
    _packStyles: { state: true },
    /** Pixel size of the TV mosaic stage when TV mode is on. */
    _tvStage: { state: true },
    /** @type {{ session: any, labels: string[], playing: boolean, paused?: boolean, tracks: any[], windowStart: number, windowEnd: number } | null} */
    _playback: { state: true },
    /**
     * Panel/resources active. HA may keep the panel mounted for minutes after
     * navigate-away (suspendWhenHidden); we flip this false immediately.
     */
    _panelActive: { state: true },
    /** Bumped on Back to live / suspend so mosaic stream players remount. */
    _liveMountGen: { state: true },
    /** Bumped on Restart so playback media remounts and replays from start. */
    _playbackMountGen: { state: true },
  };

  static styles = sharedStyles;

  constructor() {
    super();
    this.config = {};
    this.panelMode = false;
    this.panelUrlPath = "cctv";
    this._detailId = null;
    this._status = "";
    this._qualityTick = 0;
    this._visibleIds = [];
    this._sensorLinks = {};
    this._streamGroups = [];
    this._groupDraftMembers = [];
    this._groupDraftName = "";
    this._forceAspect = {};
    this._savedForceAspect = {};
    this._cameraQuality = {};
    this._savedCameraQuality = {};
    this._customAspectDraft = "";
    this._prefsDirty = false;
    this._pickerOpen = true;
    this._settingsOpen = false;
    this._selectionReady = false;
    this._saving = false;
    this._sensorFilter = "";
    this._deviceMapReady = false;
    this._retentionDays = 1;
    this._recordOnDetection = true;
    this._recordDetectionKinds = DETECTION_KINDS.map((k) => k.id);
    this._notifyOnDetection = false;
    this._sessions = [];
    this._recordingsPage = 1;
    this._recordDir = "";
    this._recordingDebug = "";
    this._recordingDebugSummary = "";
    this._loadedForUser = null;
    this._isDesktop = false;
    this._tvMode = false;
    this._aspectById = {};
    this._packStyles = {};
    this._tvStage = { width: 0, height: 0 };
    this._playback = null;
    this._panelActive = true;
    /** Bumped to force remount of live <cctv-stream-player> after Back to live. */
    this._liveMountGen = 0;
    this._playbackMountGen = 0;
    /** @type {Map<string, string>} */
    this._deviceMap = new Map();
    this._packObserver = null;
    this._packObservedEl = null;
    this._mq = null;
    this._onMq = null;
    this._packRaf = 0;
    /** @type {Map<string, number>} */
    this._playbackIndex = new Map();
    /** @type {Map<string, number>} */
    this._playbackSeek = new Map();
    /** @type {Map<string, boolean>} */
    this._playbackDone = new Map();
    this._cameraNamesCache = {};
    this._cameraNamesKey = "";
    this._lastHassSig = "";
    this._onDocVisibility = null;
    this._onLocationChange = null;
    this._loadToken = 0;
  }

  /**
   * Skip pure hass churn that does not touch visible cams / linked sensors.
   * @param {Map<string, unknown>} changed
   */
  shouldUpdate(changed) {
    if (this.panelMode && !this._panelActive && !changed.has("_panelActive")) {
      // While suspended after navigate-away, ignore hass spam entirely.
      if (changed.has("hass") && changed.size === 1) return false;
    }
    if (!changed.has("hass")) return true;
    if (changed.size > 1) return true;
    const prev = changed.get("hass");
    const next = this.hass;
    if (!prev || !next) return true;
    return this._hassRelevantChanged(prev, next);
  }

  /**
   * @param {any} prev
   * @param {any} next
   */
  _hassRelevantChanged(prev, next) {
    const ids = this._watchedEntityIds();
    for (const id of ids) {
      const a = prev.states?.[id];
      const b = next.states?.[id];
      if (a === b) continue;
      if (!a || !b) return true;
      // Ignore last_changed-only churn — it re-renders mosaic tiles and was
      // feeding stream-player prop updates. State / token / name still update UI.
      if (a.state !== b.state) return true;
      if (a.attributes?.access_token !== b.attributes?.access_token) return true;
      if (a.attributes?.friendly_name !== b.attributes?.friendly_name) return true;
    }
    if ((prev.user?.id || "") !== (next.user?.id || "")) return true;
    return false;
  }

  _watchedEntityIds() {
    // Only cameras — linked motion/person sensors flip often and would
    // re-render the whole mosaic (restarting streams). Timeline polls itself.
    const ids = new Set(this._visibleIds || []);
    if (this._pickerOpen || this._settingsOpen) {
      for (const cam of this._cameras()) ids.add(cam.entityId);
    }
    return ids;
  }

  connectedCallback() {
    super.connectedCallback();
    this._tvMode = loadTvMode();
    this._syncTvModeAttr();
    if (typeof window !== "undefined" && window.matchMedia) {
      this._mq = window.matchMedia("(min-width: 801px)");
      this._onMq = () => {
        if (!this._panelActive) return;
        this._isDesktop = this._mq.matches;
        this._refreshTvStage();
        this._schedulePack();
      };
      this._isDesktop = this._mq.matches;
      if (this._mq.addEventListener) this._mq.addEventListener("change", this._onMq);
      else this._mq.addListener(this._onMq);
    }
    this._bindTvViewport();
    this._bindPanelVisibility();
    // Re-entering / first mount: only go live when this panel is the current route.
    if (
      this._isCctvLocation() &&
      !(typeof document !== "undefined" && document.hidden)
    ) {
      this._setPanelActive(true);
    } else {
      this._setPanelActive(false);
    }
    this._refreshTvStage();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._panelActive) {
      this._panelActive = false;
      this._suspendResources();
    }
    this._unbindTvViewport();
    this._unbindPanelVisibility();
    if (this._mq && this._onMq) {
      if (this._mq.removeEventListener) this._mq.removeEventListener("change", this._onMq);
      else this._mq.removeListener(this._onMq);
    }
    this._tearDownObservers();
  }

  _syncTvModeAttr() {
    const on = Boolean(this.panelMode && this._tvMode);
    this.toggleAttribute("tv-mode", on);
  }

  _bindTvViewport() {
    if (typeof window === "undefined") return;
    this._unbindTvViewport();
    this._onTvResize = () => {
      if (!this._panelActive) return;
      this._refreshTvStage();
      this._schedulePack();
    };
    window.addEventListener("resize", this._onTvResize);
  }

  _unbindTvViewport() {
    if (typeof window === "undefined" || !this._onTvResize) return;
    window.removeEventListener("resize", this._onTvResize);
    this._onTvResize = null;
  }

  /**
   * Size the above-the-fold 16:9 mosaic stage for TV / kiosk displays.
   * Width = full panel content width; height = width/(16/9). Never shrink
   * width to fit chrome height (that left side gutters).
   */
  _refreshTvStage() {
    if (!this._tvMode || !this.panelMode) {
      if (this._tvStage?.width || this._tvStage?.height) {
        this._tvStage = { width: 0, height: 0 };
      }
      return;
    }
    const chrome = estimateTvChromePx();
    const wrap = this.renderRoot?.querySelector?.(".panel-wrap");
    const layout = this.renderRoot?.querySelector?.(".layout-pack-tv");
    // Prefer measured panel / layout width so the HA sidebar is already excluded.
    let contentW = contentBoxWidth(wrap);
    if (contentW < 8) contentW = contentBoxWidth(layout);
    if (contentW < 8 && typeof this.clientWidth === "number") {
      contentW = Math.max(0, this.clientWidth);
    }
    if (contentW < 8 && typeof window !== "undefined") {
      // Last resort before first layout: viewport minus a typical HA sidebar + pad.
      contentW = Math.max(0, (Number(window.innerWidth) || 0) - 256 - 40);
    }
    const viewportH =
      typeof window !== "undefined" ? Number(window.innerHeight) || 0 : 0;
    const { stage, offsetTop } = tvStageFullContentWidth(
      contentW,
      viewportH,
      chrome
    );
    const next = {
      width: Math.round(stage.width),
      height: Math.round(stage.height),
    };
    // Avoid stamping a 0×N stage before the panel has laid out.
    if (next.width < 8) {
      this.style.setProperty("--cctv-tv-chrome", `${chrome}px`);
      return;
    }
    if (
      next.width !== this._tvStage?.width ||
      next.height !== this._tvStage?.height
    ) {
      this._tvStage = next;
    }
    this.style.setProperty("--cctv-tv-stage-w", `${next.width}px`);
    this.style.setProperty("--cctv-tv-stage-h", `${next.height}px`);
    this.style.setProperty("--cctv-tv-chrome", `${chrome}px`);
    this.style.setProperty(
      "--cctv-tv-stage-offset",
      `${Math.round(offsetTop)}px`
    );
  }

  /**
   * Leave-page unload without IntersectionObserver (PR20 remount flicker).
   *
   * Signals (safe while watching):
   * - HA `location-changed` / `popstate` when pathname leaves this panel
   *   (closes the brief gap before non-cached custom panels are removeChild'd)
   * - `document.hidden` for browser tab hide (suspendWhenHidden path)
   * - `disconnectedCallback` when HA actually unmounts the panel
   */
  _bindPanelVisibility() {
    if (!this.panelMode) return;
    this._unbindPanelVisibility();

    this._onDocVisibility = () => {
      if (typeof document !== "undefined" && document.hidden) {
        this._setPanelActive(false);
        return;
      }
      if (this.isConnected && this._isCctvLocation()) {
        this._setPanelActive(true);
      }
    };

    this._onLocationChange = () => {
      if (!this.isConnected) return;
      if (typeof document !== "undefined" && document.hidden) {
        this._setPanelActive(false);
        return;
      }
      // Path still this panel → stay live (never remount while watching).
      if (this._isCctvLocation()) {
        if (!this._panelActive) this._setPanelActive(true);
        return;
      }
      // Sidebar / in-app navigate away — unload immediately.
      this._setPanelActive(false);
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this._onDocVisibility);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("location-changed", this._onLocationChange);
      window.addEventListener("popstate", this._onLocationChange);
    }
  }

  _unbindPanelVisibility() {
    if (this._onDocVisibility && typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this._onDocVisibility);
      this._onDocVisibility = null;
    }
    if (this._onLocationChange && typeof window !== "undefined") {
      window.removeEventListener("location-changed", this._onLocationChange);
      window.removeEventListener("popstate", this._onLocationChange);
      this._onLocationChange = null;
    }
  }

  /**
   * True while the browser URL is still this HA custom panel.
   * Prefer location.pathname — outgoing panels do not get updated hass.panelUrl
   * while partial-panel-resolver is replacing them.
   */
  _isCctvLocation() {
    if (typeof location === "undefined") return true;
    const path = location.pathname || "";
    const slug =
      String(this.panelUrlPath || "cctv")
        .trim()
        .replace(/^\/+|\/+$/g, "") || "cctv";
    const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|/)${escaped}(?:/|$)`).test(path);
  }

  /**
   * @param {boolean} active
   */
  _setPanelActive(active) {
    const next = Boolean(active);
    if (this._panelActive === next) return;
    this._panelActive = next;
    if (next) {
      this._status = this._status === "Suspended — streams unloaded" ? "" : this._status;
      this._schedulePack();
    } else {
      this._suspendResources();
    }
  }

  /** Unload streams/playback/timers/observers while panel is away. */
  _suspendResources() {
    this._loadToken += 1;
    this._teardownPlaybackMedia({ clearSrc: true });
    this._playback = null;
    this._playbackIndex = new Map();
    this._playbackSeek = new Map();
    this._playbackDone = new Map();
    this._tearDownObservers();
    // Stop media before Lit removes the nodes (HA may keep this panel mounted).
    this._resetLiveStreamSlots();
    this._liveMountGen += 1;
    if (this.panelMode) {
      this._status = "Suspended — streams unloaded";
    }
  }

  _tearDownObservers() {
    if (this._packObserver) {
      this._packObserver.disconnect();
      this._packObserver = null;
      this._packObservedEl = null;
    }
    if (this._packRaf) {
      cancelAnimationFrame(this._packRaf);
      this._packRaf = 0;
    }
  }

  _unloadStreamPlayers() {
    const root = this.renderRoot || this;
    root.querySelectorAll?.("cctv-stream-player").forEach((el) => {
      try {
        el.active = false;
        el._unloadCompletely?.();
      } catch {
        /* ignore */
      }
    });
  }

  updated(changed) {
    if (!this._panelActive && this.panelMode) {
      if (changed.has("_panelActive") && this._panelActive) {
        /* resumed below */
      } else {
        return;
      }
    }
    if (this.panelMode && this._panelActive && (changed.has("hass") || changed.has("panelMode") || changed.has("_panelActive"))) {
      this._ensureSelectionLoaded();
    }
    if (changed.has("_tvMode") || changed.has("panelMode")) {
      this._syncTvModeAttr();
      this._refreshTvStage();
    }
    if (
      this.panelMode &&
      this._panelActive &&
      (changed.has("_visibleIds") ||
        changed.has("_isDesktop") ||
        changed.has("_detailId") ||
        changed.has("_pickerOpen") ||
        changed.has("_settingsOpen") ||
        changed.has("_aspectById") ||
        changed.has("_forceAspect") ||
        changed.has("_playback") ||
        changed.has("_tvMode") ||
        changed.has("_tvStage") ||
        changed.has("_panelActive"))
    ) {
      this._schedulePack();
      this.updateComplete.then(() => {
        // Restamping the TV stage while playing remounts mosaic tiles and races
        // _kickPlaybackVideos (toast: no video elements found). Freeze geometry.
        if (this._tvMode && !this._playback?.playing) this._refreshTvStage();
        this._bindPackObserver();
      });
    }
  }

  firstUpdated() {
    if (this._tvMode && this.panelMode) {
      this.updateComplete.then(() => {
        this._refreshTvStage();
        this._schedulePack();
        this._bindPackObserver();
      });
    }
  }

  _bindPackObserver() {
    const el = this.renderRoot?.querySelector?.(".layout-pack");
    if (!el) {
      if (this._packObserver) {
        this._packObserver.disconnect();
        this._packObserver = null;
        this._packObservedEl = null;
      }
      return;
    }
    if (this._packObserver && this._packObservedEl === el) {
      this._recomputePack();
      return;
    }
    if (this._packObserver) this._packObserver.disconnect();
    this._packObservedEl = el;
    if (typeof ResizeObserver === "undefined") {
      this._recomputePack();
      return;
    }
    this._packObserver = new ResizeObserver(() => this._schedulePack());
    this._packObserver.observe(el);
    this._recomputePack();
  }

  _schedulePack() {
    if (!this._panelActive) return;
    if (this._packRaf) cancelAnimationFrame(this._packRaf);
    this._packRaf = requestAnimationFrame(() => {
      this._packRaf = 0;
      this._recomputePack();
    });
  }

  _recomputePack() {
    if (!this._isDesktop || !this.panelMode || this._detailId) {
      if (Object.keys(this._packStyles).length) this._packStyles = {};
      return;
    }
    // Freeze TV stage size during detection playback so pack/resize does not
    // remount <video class="playback-media"> under the kick.
    if (this._tvMode && !this._playback?.playing) this._refreshTvStage();
    const el = this.renderRoot?.querySelector?.(".layout-pack");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let boxW = Math.max(0, rect.width);
    let boxH = Math.max(0, rect.height);
    // TV mode: pack into the full-width 16:9 stage (not an arbitrary stretch box).
    if (this._tvMode && this._tvStage?.width >= 8 && this._tvStage?.height >= 8) {
      boxW = this._tvStage.width;
      boxH = this._tvStage.height;
    }
    if (boxW < 8 || boxH < 8) return;

    // Always pack the same visible mosaic cameras (live or playback).
    const cameras = this._layoutCameras(this._cameras()).slice(0, 4);
    const items = cameras.map((cam) => ({
      id: cam.entityId,
      aspect: this._effectiveAspect(cam.entityId),
    }));
    const gap = this._tvMode ? tvPackGap(items.length) : 10;
    const cells = packAspectMosaic(items, boxW, boxH, gap);
    const nextStyles = cellsToPercentStyles(cells, boxW, boxH);
    if (!this._packStylesEqual(this._packStyles, nextStyles)) {
      this._packStyles = nextStyles;
    }
  }

  /**
   * Forced shared aspect wins over probed / default (doorbell override).
   * @param {string} entityId
   */
  _effectiveAspect(entityId) {
    const label = this._forceAspectLabel(entityId);
    const forced = forceAspectRatio(label);
    if (forced) return normalizeAspect(forced);
    return normalizeAspect(this._aspectById[entityId] || DEFAULT_ASPECT);
  }

  /**
   * @param {string} entityId
   */
  _groupMembers(entityId) {
    return groupMembersForCamera(this._streamGroups, entityId);
  }

  /**
   * @param {string} entityId
   */
  _forceAspectLabel(entityId) {
    return forceAspectFromMap(
      this._forceAspect,
      entityId,
      this._groupMembers(entityId)
    );
  }

  /**
   * @param {Record<string, string>} a
   * @param {Record<string, string>} b
   */
  _packStylesEqual(a, b) {
    const ak = Object.keys(a || {});
    const bk = Object.keys(b || {});
    if (ak.length !== bk.length) return false;
    for (const key of ak) {
      if (a[key] !== b[key]) return false;
    }
    return true;
  }

  _onMediaAspect(event) {
    const entityId = event?.detail?.entityId;
    const aspect = normalizeAspect(event?.detail?.aspect);
    if (!entityId) return;
    // Manual site-wide override owns packing for this camera.
    if (forceAspectRatio(this._forceAspect?.[entityId])) return;
    if (Math.abs((this._aspectById[entityId] || 0) - aspect) < 0.01) return;
    this._aspectById = { ...this._aspectById, [entityId]: aspect };
  }

  /**
   * Feed playback intrinsic size into the desktop pack so portrait doorbells
   * get portrait-shaped cells (same path as live cctv-media-aspect).
   * @param {string} entityId
   * @param {number} width
   * @param {number} height
   */
  _onPlaybackMediaSize(entityId, width, height) {
    const w = Number(width);
    const h = Number(height);
    if (!entityId || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      return;
    }
    this._onMediaAspect({ detail: { entityId, aspect: w / h } });
  }

  async _ensureSelectionLoaded() {
    if (!this._panelActive) return;
    const userId = this.hass?.user?.id || "default";
    if (!this.hass || this._loadedForUser === userId) return;
    this._loadedForUser = userId;
    this._selectionReady = false;
    const token = ++this._loadToken;

    const [userData, shared] = await Promise.all([
      loadPanelData(this.hass),
      loadSharedConfig(this.hass),
    ]);
    if (token !== this._loadToken || !this._panelActive) return;

    const all = this._cameras().map((c) => c.entityId);
    if (userData?.selectedCameras?.length) {
      this._visibleIds = userData.selectedCameras
        .filter((id) => all.includes(id))
        .slice(0, this._maxStreams());
      this._pickerOpen = this._visibleIds.length === 0;
    } else {
      this._visibleIds = [];
      this._pickerOpen = true;
    }

    let links = shared?.sensorLinks || {};
    // One-time migrate: older builds stored links in per-user frontend data.
    const legacy = userData?.legacySensorLinks;
    if (
      legacy &&
      typeof legacy === "object" &&
      Object.keys(legacy).length &&
      !Object.keys(links).length
    ) {
      try {
        const saved = await saveSensorLinks(this.hass, legacy);
        if (token !== this._loadToken || !this._panelActive) return;
        links = saved?.sensor_links
          ? Object.fromEntries(
              Object.entries(saved.sensor_links).map(([k, v]) => [k, v])
            )
          : legacy;
        await savePanelSelection(this.hass, this._visibleIds);
        this._status = "Detection sensor links moved to shared settings";
      } catch (err) {
        console.warn("CCTV: legacy sensor-link migration failed", err);
        links = legacy;
      }
    }

    this._streamGroups = normalizeStreamGroups(shared?.streamGroups || []);
    this._sensorLinks = syncSensorLinksAcrossGroups(
      links,
      this._streamGroups
    );
    if (shared) {
      this._retentionDays = Number(shared.retention_days) || 1;
      this._recordOnDetection = shared.record_on_detection !== false;
      this._recordDetectionKinds = this._normalizeRecordKinds(
        shared.record_detection_kinds
      );
      this._notifyOnDetection = Boolean(shared.notify_on_detection);
      this._recordDir = shared.record_dir || "";
      this._recordingDebug = String(shared.recording_debug || "");
      this._recordingDebugSummary = String(shared.recording_debug_summary || "");
      this._applySharedCameraPrefs(shared);
    } else if (this.config?.retention_days) {
      this._retentionDays = Number(this.config.retention_days) || 1;
      this._recordOnDetection = this.config.record_on_detection !== false;
    }

    this._selectionReady = true;
    this._loadDeviceMap();
    // Defer recordings index until Saved detections is needed / refreshed.
    if (!this._sessions?.length) {
      this._sessions = await listRecordings(this.hass);
      if (token !== this._loadToken || !this._panelActive) return;
    }
  }

  async _loadDeviceMap() {
    if (!this.hass || this._deviceMapReady) return;
    this._deviceMap = await loadEntityDeviceMap(this.hass);
    this._deviceMapReady = true;
  }

  async _loadRecordingUi() {
    if (!this.hass) return;
    const settings = await loadSharedConfig(this.hass);
    if (settings) {
      this._retentionDays = Number(settings.retention_days) || 1;
      this._recordOnDetection = settings.record_on_detection !== false;
      this._recordDetectionKinds = this._normalizeRecordKinds(
        settings.record_detection_kinds
      );
      this._notifyOnDetection = Boolean(settings.notify_on_detection);
      this._recordDir = settings.record_dir || "";
      this._recordingDebug = String(settings.recording_debug || "");
      this._recordingDebugSummary = String(settings.recording_debug_summary || "");
      if (settings.streamGroups) {
        this._streamGroups = normalizeStreamGroups(settings.streamGroups);
      }
      if (settings.sensorLinks) {
        this._sensorLinks = syncSensorLinksAcrossGroups(
          settings.sensorLinks,
          this._streamGroups
        );
      }
      // Don't clobber unsaved quality/aspect drafts while editing.
      if (!this._prefsDirty) this._applySharedCameraPrefs(settings);
    } else if (this.config?.retention_days) {
      this._retentionDays = Number(this.config.retention_days) || 1;
      this._recordOnDetection = this.config.record_on_detection !== false;
    }
    this._sessions = await listRecordings(this.hass);
  }

  async _copyRecordingDebug() {
    const text =
      this._recordingDebug ||
      "No recording session debug yet. Trigger a detection to populate.";
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        this._status = "Recording debug copied";
        return;
      }
    } catch (err) {
      console.warn("CCTV: clipboard copy failed", err);
    }
    this._status = "Could not copy — select the debug text manually";
  }

  /**
   * @param {unknown} raw
   * @returns {string[]}
   */
  _normalizeRecordKinds(raw) {
    const allowed = new Set(DETECTION_KINDS.map((k) => k.id));
    if (!Array.isArray(raw)) return DETECTION_KINDS.map((k) => k.id);
    const out = [];
    const seen = new Set();
    for (const item of raw) {
      const id = String(item || "").trim().toLowerCase();
      if (!allowed.has(id) || seen.has(id)) continue;
      seen.add(id);
      out.push(id);
    }
    return out;
  }

  /**
   * Apply shared quality + force-aspect from the integration store.
   * @param {any} shared
   */
  _applySharedCameraPrefs(shared) {
    const force = normalizeForceAspectMap(
      shared?.forceAspect || shared?.force_aspect || {}
    );
    const quality = normalizeCameraQualityMap(
      shared?.cameraQuality || shared?.camera_quality || {}
    );
    this._forceAspect = { ...force };
    this._savedForceAspect = { ...force };
    this._cameraQuality = { ...quality };
    this._savedCameraQuality = { ...quality };
    this._prefsDirty = false;
    // Keep detail custom-aspect field bound to the saved value when reopening.
    if (this._detailId) {
      const current = forceAspectFromMap(
        force,
        this._detailId,
        this._groupMembers(this._detailId)
      );
      this._customAspectDraft =
        current && current !== "auto" && !isPresetForceAspect(current)
          ? current
          : "";
    } else {
      this._customAspectDraft = "";
    }
    this._qualityTick += 1;
  }

  /**
   * @param {Record<string, string>} a
   * @param {Record<string, string>} b
   */
  _prefsMapsEqual(a, b) {
    const left = a || {};
    const right = b || {};
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    for (const key of keys) {
      if ((left[key] || "") !== (right[key] || "")) return false;
    }
    return true;
  }

  _syncPrefsDirty() {
    this._prefsDirty =
      !this._prefsMapsEqual(this._forceAspect, this._savedForceAspect) ||
      !this._prefsMapsEqual(this._cameraQuality, this._savedCameraQuality);
  }

  /**
   * Quality for mosaic/detail. Panel uses shared/draft map; cards use localStorage.
   * Falls back to other streams in the same physical group when the preferred
   * entity has no explicit quality saved yet.
   * @param {string} entityId
   */
  _qualityFor(entityId) {
    return resolveQuality(
      this.config,
      entityId,
      this.panelMode ? this._cameraQuality : null,
      this._groupMembers(entityId)
    );
  }

  _cameras() {
    return listCameras(this.hass, this.config);
  }

  _maxStreams() {
    const value = Number(this.config?.max_streams);
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_MAX_STREAMS;
  }

  _visibleCameras(cameras) {
    const order = this._visibleIds;
    return order
      .map((id) => cameras.find((c) => c.entityId === id))
      .filter(Boolean);
  }

  /**
   * While detection playback is active, mosaic slots follow playback tracks
   * (selected cams with clips, or fallback cams that have recordings).
   * When not playing, keep the user's live mosaic selection.
   * @param {ReturnType<typeof listCameras>} cameras
   */
  _layoutCameras(cameras) {
    const tracks = this._playback?.playing ? this._playback.tracks : null;
    if (!tracks?.length) return this._visibleCameras(cameras);
    const byId = new Map(cameras.map((c) => [c.entityId, c]));
    return tracks.map((track) => {
      if (byId.has(track.cameraId)) return byId.get(track.cameraId);
      return cameraFromState(track.cameraId, this.hass?.states?.[track.cameraId]);
    });
  }

  /** Clear global live-stream slots before swapping mosaic live ↔ playback. */
  _resetLiveStreamSlots() {
    try {
      streamSlots.releaseAll();
    } catch (err) {
      console.warn("CCTV: stream slot reset failed", err);
    }
    this._unloadStreamPlayers();
  }

  _linksFor(cameraId) {
    return this._sensorLinks?.[cameraId] || [];
  }

  _groupFor(cameraId) {
    return groupForCamera(this._streamGroups, cameraId);
  }

  _applyStreamGroupsResult(saved) {
    if (!saved || typeof saved !== "object") return;
    if (Array.isArray(saved.stream_groups)) {
      this._streamGroups = normalizeStreamGroups(saved.stream_groups);
    }
    if (saved.sensor_links) {
      this._sensorLinks = syncSensorLinksAcrossGroups(
        saved.sensor_links,
        this._streamGroups
      );
    }
  }

  async _toggleVisible(entityId, checked) {
    const max = this._maxStreams();
    let next = [...this._visibleIds];
    const group = groupForCamera(this._streamGroups, entityId);
    const groupMembers = new Set(group?.members || []);
    if (checked) {
      if (next.includes(entityId)) return;
      // One mosaic slot per physical group — swap sibling if already selected.
      if (groupMembers.size) {
        const existing = next.find((id) => groupMembers.has(id));
        if (existing) {
          next = next.map((id) => (id === existing ? entityId : id));
        } else {
          if (next.length >= max) {
            this._status = `Select at most ${max} cameras`;
            return;
          }
          next.push(entityId);
        }
      } else {
        if (next.length >= max) {
          this._status = `Select at most ${max} cameras`;
          return;
        }
        next.push(entityId);
      }
    } else {
      next = next.filter((id) => id !== entityId);
    }
    this._visibleIds = next;
    if (this._detailId && !next.includes(this._detailId)) {
      this._detailId = null;
    }
    // Selection change while event playback is up — free clips and remount live.
    if (this._playback) this._returnToLive();
    await this._persistSelection(next);
  }

  /**
   * Change preferred live stream within a physical group (same mosaic slot).
   * @param {string} previousId
   * @param {string} nextId
   */
  async _setPreferredStream(previousId, nextId) {
    const prev = String(previousId || "");
    const nextStream = String(nextId || "");
    if (!nextStream.startsWith("camera.") || prev === nextStream) return;
    const group = groupForCamera(this._streamGroups, prev);
    if (group && !group.members.includes(nextStream)) return;
    let next = [...this._visibleIds];
    const idx = next.indexOf(prev);
    if (idx >= 0) next[idx] = nextStream;
    else if (!next.includes(nextStream)) {
      if (next.length >= this._maxStreams()) {
        this._status = `Select at most ${this._maxStreams()} cameras`;
        return;
      }
      next.push(nextStream);
    }
    // Drop any other group siblings from selection.
    if (group) {
      next = next.filter(
        (id) => id === nextStream || !group.members.includes(id)
      );
    }
    this._visibleIds = next;
    if (this._playback) this._returnToLive();
    await this._persistSelection(next);
  }

  async _persistSelection(ids) {
    this._saving = true;
    try {
      const saved = await savePanelSelection(this.hass, ids);
      if (saved?.selectedCameras) this._visibleIds = saved.selectedCameras;
      const next = saved?.selectedCameras || ids;
      this._status = next.length
        ? `${next.length} camera${next.length === 1 ? "" : "s"} on screen`
        : "No cameras selected";
    } catch (err) {
      this._status = err?.message || "Could not save camera selection";
    } finally {
      this._saving = false;
    }
  }

  async _persistSensorLinks(next) {
    this._saving = true;
    const synced = syncSensorLinksAcrossGroups(next, this._streamGroups);
    this._sensorLinks = synced;
    try {
      const saved = await saveSensorLinks(this.hass, synced);
      if (saved?.sensor_links) {
        this._sensorLinks = syncSensorLinksAcrossGroups(
          saved.sensor_links,
          this._streamGroups
        );
      }
      this._status = "Detection sensors saved for all users";
    } catch (err) {
      this._status = err?.message || "Could not save detection sensors";
    } finally {
      this._saving = false;
    }
  }

  /**
   * Draft force-aspect change (not persisted until Save).
   * Mirrors across physical-group members so reopen/picker stay consistent.
   * @param {string} cameraId
   * @param {string} label
   */
  _setForceAspect(cameraId, label) {
    const members = this._groupMembers(cameraId);
    if (label === "custom") {
      const existing = this._forceAspectLabel(cameraId);
      this._customAspectDraft =
        existing && !isPresetForceAspect(existing) ? existing : "1920:2560";
      const normalized = normalizeForceAspectLabel(this._customAspectDraft);
      this._forceAspect = mirrorForceAspectAcrossGroup(
        this._forceAspect,
        cameraId,
        normalized,
        members
      );
      this._syncPrefsDirty();
      this._schedulePack();
      return;
    }
    const normalized = normalizeForceAspectLabel(label);
    this._forceAspect = mirrorForceAspectAcrossGroup(
      this._forceAspect,
      cameraId,
      normalized,
      members
    );
    if (isPresetForceAspect(normalized) || normalized === "auto") {
      this._customAspectDraft = "";
    }
    this._syncPrefsDirty();
    this._schedulePack();
  }

  /**
   * @param {string} cameraId
   * @param {string} raw
   */
  _setCustomForceAspect(cameraId, raw) {
    this._customAspectDraft = raw;
    const normalized = normalizeForceAspectLabel(raw);
    this._forceAspect = mirrorForceAspectAcrossGroup(
      this._forceAspect,
      cameraId,
      normalized,
      this._groupMembers(cameraId)
    );
    this._syncPrefsDirty();
    this._schedulePack();
  }

  /**
   * Persist draft quality + force-aspect for every HA user.
   */
  async _saveCameraPrefs() {
    this._saving = true;
    try {
      const saved = await saveCameraPrefs(this.hass, {
        cameraQuality: this._cameraQuality,
        forceAspect: this._forceAspect,
      });
      if (saved) {
        this._applySharedCameraPrefs({
          force_aspect: saved.force_aspect,
          camera_quality: saved.camera_quality,
        });
      } else {
        this._savedForceAspect = { ...this._forceAspect };
        this._savedCameraQuality = { ...this._cameraQuality };
        this._prefsDirty = false;
      }
      this._status = "Quality & aspect saved for all users";
      this._schedulePack();
    } catch (err) {
      this._status = err?.message || "Could not save camera preferences";
    } finally {
      this._saving = false;
    }
  }

  async _setSensorLinked(cameraId, sensorId, linked) {
    const members = groupForCamera(this._streamGroups, cameraId)?.members || [
      cameraId,
    ];
    const current = new Set(this._linksFor(cameraId));
    if (linked) current.add(sensorId);
    else current.delete(sensorId);
    const shared = [...current];
    const next = { ...this._sensorLinks };
    for (const mid of members) {
      if (shared.length) next[mid] = [...shared];
      else delete next[mid];
    }
    await this._persistSensorLinks(
      syncSensorLinksAcrossGroups(next, this._streamGroups)
    );
  }

  async _applySuggestions(cameraId) {
    const suggestions = suggestDetectionSensors(this.hass, cameraId, {
      deviceIds: this._deviceMap,
      limit: 8,
    });
    if (!suggestions.length) {
      this._status = "No related detection sensors found";
      return;
    }
    const members = groupForCamera(this._streamGroups, cameraId)?.members || [
      cameraId,
    ];
    const shared = [
      ...new Set([
        ...this._linksFor(cameraId),
        ...suggestions.map((s) => s.entityId),
      ]),
    ].slice(0, 16);
    const next = { ...this._sensorLinks };
    for (const mid of members) next[mid] = [...shared];
    await this._persistSensorLinks(
      syncSensorLinksAcrossGroups(next, this._streamGroups)
    );
    this._status = `Linked ${suggestions.length} suggested sensor${suggestions.length === 1 ? "" : "s"} (all users)`;
  }

  async _persistStreamGroups(groups) {
    this._saving = true;
    try {
      const normalized = normalizeStreamGroups(groups);
      const syncedLinks = syncSensorLinksAcrossGroups(
        this._sensorLinks,
        normalized
      );
      const saved = await saveStreamGroups(this.hass, normalized);
      this._applyStreamGroupsResult(saved);
      if (!saved?.stream_groups) {
        this._streamGroups = normalized;
        // Persist mirrored sensor links when WS response is minimal.
        await this._persistSensorLinks(syncedLinks);
      } else if (saved?.sensor_links == null && Object.keys(syncedLinks).length) {
        await this._persistSensorLinks(syncedLinks);
      }
      this._status = "Stream groups saved for all users";
    } catch (err) {
      this._status = err?.message || "Could not save stream groups";
    } finally {
      this._saving = false;
    }
  }

  _syncGroupDraftFromCamera(cameraId) {
    const group = groupForCamera(this._streamGroups, cameraId);
    if (group) {
      this._groupDraftMembers = [...group.members];
      this._groupDraftName = group.name || "";
      return;
    }
    this._groupDraftMembers = [cameraId];
    this._groupDraftName = "";
  }

  _toggleGroupDraftMember(cameraId, memberId, checked) {
    const cam = String(cameraId);
    const mid = String(memberId);
    let next = [...(this._groupDraftMembers || [])];
    if (!next.includes(cam)) next.unshift(cam);
    if (checked) {
      if (!next.includes(mid)) next.push(mid);
    } else {
      next = next.filter((id) => id !== mid);
      if (!next.includes(cam)) next.unshift(cam);
    }
    this._groupDraftMembers = [...new Set(next)].slice(0, 8);
  }

  async _saveGroupDraft(cameraId) {
    const members = [...new Set([cameraId, ...(this._groupDraftMembers || [])])]
      .filter((id) => String(id).startsWith("camera."))
      .slice(0, 8);
    if (members.length < 2) {
      this._status = "Add at least one other stream to form a physical camera";
      return;
    }
    const existing = groupForCamera(this._streamGroups, cameraId);
    const next = upsertStreamGroup(this._streamGroups, {
      id: existing?.id,
      name: this._groupDraftName,
      members,
    });
    await this._persistStreamGroups(next);
    this._syncGroupDraftFromCamera(cameraId);
  }

  async _suggestGroupFromDevice(cameraId) {
    await this._loadDeviceMap();
    const suggested = suggestGroupMembersFromDevice(cameraId, {
      cameras: this._cameras(),
      deviceMap: this._deviceMap,
      groups: this._streamGroups,
    });
    if (!suggested.length) {
      this._status = "No same-device camera streams found to group";
      return;
    }
    this._groupDraftMembers = [
      ...new Set([cameraId, ...this._groupDraftMembers, ...suggested]),
    ].slice(0, 8);
    if (!this._groupDraftName) {
      this._groupDraftName = cameraId
        .replace(/^camera\./, "")
        .replace(/_high_resolution_channel$/, "")
        .replace(/_/g, " ");
    }
    this._status = `Suggested ${suggested.length} stream${suggested.length === 1 ? "" : "s"} from the same device`;
  }

  async _ungroupCamera(cameraId) {
    const group = groupForCamera(this._streamGroups, cameraId);
    if (!group) {
      this._status = "This stream is not in a group";
      return;
    }
    await this._persistStreamGroups(
      removeStreamGroup(this._streamGroups, group.id)
    );
    this._syncGroupDraftFromCamera(cameraId);
  }

  _openDetail(entityId) {
    this._detailId = entityId;
    this._sensorFilter = "";
    // Bind custom draft from persisted/group-resolved aspect (not defaults).
    const current = this._forceAspectLabel(entityId);
    this._customAspectDraft =
      current && current !== "auto" && !isPresetForceAspect(current)
        ? current
        : "";
    this._syncGroupDraftFromCamera(entityId);
  }

  _back() {
    this._detailId = null;
    this._sensorFilter = "";
    this._customAspectDraft = "";
    this._groupDraftMembers = [];
    this._groupDraftName = "";
  }

  /**
   * Quality change: panel drafts into shared map (Save required); cards use
   * browser localStorage.
   * @param {string} entityId
   * @param {string} quality
   */
  _setQuality(entityId, quality) {
    if (!this.panelMode) {
      const members = this._groupMembers(entityId);
      writeStoredQuality(entityId, quality);
      for (const mid of members) {
        if (mid !== entityId) writeStoredQuality(mid, quality);
      }
      this._qualityTick += 1;
      return;
    }
    this._cameraQuality = mirrorQualityAcrossGroup(
      this._cameraQuality,
      entityId,
      quality,
      this._groupMembers(entityId)
    );
    this._syncPrefsDirty();
    this._qualityTick += 1;
  }

  /** Choose-cameras quality change: draft + persist shared map immediately. */
  async _setPickerQuality(entityId, quality) {
    this._setQuality(entityId, quality);
    if (!this.panelMode) return;
    try {
      await this._saveCameraPrefs();
    } catch (err) {
      this._status = err?.message || "Could not save quality";
    }
  }

  /** Choose-cameras aspect change: draft + persist shared map immediately. */
  async _setPickerForceAspect(entityId, label) {
    this._setForceAspect(entityId, label);
    if (!this.panelMode) return;
    try {
      await this._saveCameraPrefs();
    } catch (err) {
      this._status = err?.message || "Could not save aspect";
    }
  }

  async _run(service, entityId) {
    this._status = `Calling ${service}…`;
    try {
      await callCameraService(this.hass, service, entityId);
      this._status = `${service} ok`;
    } catch (err) {
      this._status = err?.message || String(err);
    }
  }

  async _saveRetentionDays(days) {
    const value = Math.max(1, Math.min(30, Number(days) || 1));
    this._retentionDays = value;
    this._saving = true;
    try {
      await saveRecordingSettings(this.hass, { retention_days: value });
      this._status = `Retention set to ${value} day${value === 1 ? "" : "s"}`;
    } catch (err) {
      this._status = err?.message || "Could not save retention";
    } finally {
      this._saving = false;
    }
  }

  async _toggleRecordOnDetection(enabled) {
    this._recordOnDetection = enabled;
    this._saving = true;
    try {
      await saveRecordingSettings(this.hass, {
        record_on_detection: enabled,
      });
      this._status = enabled
        ? "Detection recording enabled"
        : "Detection recording paused";
    } catch (err) {
      this._status = err?.message || "Could not save recording setting";
    } finally {
      this._saving = false;
    }
  }

  async _toggleNotifyOnDetection(enabled) {
    this._notifyOnDetection = enabled;
    this._saving = true;
    try {
      await saveUserNotifyPreference(this.hass, enabled);
      this._status = enabled
        ? "You will be notified when a detection is recorded (this account only)"
        : "Detection notifications disabled for your account";
    } catch (err) {
      this._status = err?.message || "Could not save notification preference";
      await this._loadRecordingUi();
    } finally {
      this._saving = false;
    }
  }

  _toggleTvMode(enabled) {
    this._tvMode = Boolean(enabled);
    saveTvMode(this._tvMode);
    this._syncTvModeAttr();
    // Keep the first viewport focused on the mosaic when enabling TV mode.
    if (this._tvMode) {
      this._pickerOpen = false;
      this._settingsOpen = false;
    }
    this._refreshTvStage();
    this._status = this._tvMode
      ? "TV mode on — 16:9 mosaic fills this display width (saved on this device)"
      : "TV mode off";
    this._schedulePack();
    this.updateComplete.then(() => this._bindPackObserver());
  }

  async _toggleRecordKind(kindId, enabled) {
    const id = String(kindId || "");
    const next = new Set(this._recordDetectionKinds || []);
    if (enabled) next.add(id);
    else next.delete(id);
    const ordered = DETECTION_KINDS.map((k) => k.id).filter((k) => next.has(k));
    this._recordDetectionKinds = ordered;
    this._saving = true;
    try {
      await saveRecordingSettings(this.hass, {
        record_detection_kinds: ordered,
      });
      const labels = DETECTION_KINDS.filter((k) => ordered.includes(k.id)).map(
        (k) => k.label
      );
      this._status = ordered.length
        ? `Saving video for: ${labels.join(", ")}`
        : "Video save disabled for all detection types (timeline still logs events)";
    } catch (err) {
      this._status = err?.message || "Could not save detection-type filter";
      await this._loadRecordingUi();
    } finally {
      this._saving = false;
    }
  }

  async _refreshSessions() {
    this._sessions = await listRecordings(this.hass);
    this._setRecordingsPage(this._recordingsPage);
    this._status = "Recordings refreshed";
  }

  _refreshTimeline() {
    const timeline = this.renderRoot?.querySelector?.("cctv-detection-timeline");
    timeline?.reload?.();
  }

  _isAdmin() {
    return Boolean(this.hass?.user?.is_admin);
  }

  async _deleteSession(sessionId, event, session = null) {
    event?.stopPropagation?.();
    event?.preventDefault?.();
    if (!this._isAdmin()) {
      this._status = "Only Home Assistant admins can delete saved detections";
      return;
    }
    const active = Boolean(session?.active);
    const confirmMsg = active
      ? "Stop and delete this in-progress recording for all users?"
      : "Delete this saved detection’s recordings for all users?";
    if (typeof window !== "undefined" && !window.confirm(confirmMsg)) {
      return;
    }
    try {
      const ok = await deleteRecording(this.hass, sessionId);
      this._sessions = await listRecordings(this.hass);
      if (this._playback?.session?.session_id === sessionId) {
        this._returnToLive();
      }
      this._status = ok
        ? active
          ? "In-progress recording stopped and deleted"
          : "Saved detection deleted for all users"
        : "Recording was already removed";
    } catch (err) {
      this._status = err?.message || "Could not delete recording";
    }
  }

  _setRecordingsPage(page) {
    const sessions = this._savedDetectionSessions();
    const { page: safe } = paginateSessions(
      sessions,
      page,
      SAVED_DETECTIONS_PAGE_SIZE
    );
    this._recordingsPage = safe;
  }

  /** Visible/playable sessions for Saved detections (newest first from API). */
  _savedDetectionSessions() {
    return (this._sessions || []).filter(
      (session) => session.active || sessionIsPlayable(session)
    );
  }

  async _clearAllDetections(event) {
    event?.stopPropagation?.();
    event?.preventDefault?.();
    if (!this._isAdmin()) {
      this._status = "Only Home Assistant admins can clear saved detections";
      return;
    }
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Delete ALL saved detections and reset the detection timeline for every Home Assistant user? This cannot be undone."
      )
    ) {
      return;
    }
    this._saving = true;
    try {
      const result = await clearAllDetections(this.hass);
      this._sessions = await listRecordings(this.hass);
      this._refreshTimeline();
      if (this._playback) this._returnToLive();
      const sessions = Number(result?.sessions_cleared) || 0;
      const events = Number(result?.events_cleared) || 0;
      this._status = `Cleared ${sessions} recording${sessions === 1 ? "" : "s"} and ${events} timeline event${events === 1 ? "" : "s"} for all users`;
    } catch (err) {
      this._status = err?.message || "Could not clear detections";
    } finally {
      this._saving = false;
    }
  }

  /**
   * @param {any} session
   * @param {{ start?: number, end?: number } | null} [event]
   */
  async _selectPlaybackSession(session, event = null) {
    if (!sessionIsPlayable(session)) {
      this._status = "No playable recording for that detection";
      return false;
    }
    const labels = detectionLabelsFromTriggers(
      this.hass,
      session.trigger_sensors || []
    );
    const maxStreams = this._maxStreams();
    const visibleIds = this._visibleIds.slice(0, maxStreams);
    const resolved = resolvePlaybackCameraIds(session, visibleIds, maxStreams);
    if (!resolved.cameraIds.length) {
      this._status = visibleIds.length
        ? "No playable clips for this detection (files missing or empty)"
        : "No playable clips for this detection — select cameras or wait for recordings";
      return false;
    }
    // Prefer mosaic selection order/slots; fall back to cams that have clips.
    const tracks = playbackTracksFromSession(
      this.hass,
      session,
      resolved.cameraIds
    );
    const playable = tracks.some((t) =>
      (t.items || []).some((item) => item.kind === "video" || item.kind === "snapshot")
    );
    if (!playable) {
      this._status = "No playable clips for this detection (files missing or empty)";
      return false;
    }
    const window = playbackWindow(session, event);
    this._detailId = null;
    this._playbackIndex = new Map();
    this._playbackSeek = new Map();
    this._playbackDone = new Map();
    for (const track of tracks) {
      const pos = clipPositionAtTime(track, window.start);
      this._playbackIndex.set(track.cameraId, pos.index);
      this._playbackSeek.set(track.cameraId, pos.seekSec);
      this._playbackDone.set(track.cameraId, !track.items.length);
    }
    this._playback = {
      session,
      labels,
      /** Mosaic shows clip tiles when true (live stream players when false). */
      playing: false,
      /** When playing, pause freezes clip elements without restoring live. */
      paused: false,
      tracks,
      windowStart: window.start,
      windowEnd: window.end,
      eventDetail: event,
      /** @type {Record<string, { kindId: string, color: string }>} */
      triggerHighlights: triggerHighlightsForPlayback(
        this.hass,
        session,
        this._sensorLinks,
        event,
        this._streamGroups
      ),
    };
    const n = resolved.cameraIds.length;
    if (resolved.reason === "empty-selection") {
      this._status = `No mosaic selection — playing ${n} camera${n === 1 ? "" : "s"} with clips`;
    } else if (resolved.reason === "no-selected-clips") {
      this._status = `Selected mosaic cams had no clips — playing ${n} camera${n === 1 ? "" : "s"} with recordings`;
    } else {
      this._status = `Selected ${labels.join(", ")} — Play replaces live mosaic for ${n} cam${n === 1 ? "" : "s"}`;
    }
    this._schedulePack();
    return true;
  }

  /**
   * Fresh session row from the server (clip sizes / camera ids), else original.
   * @param {any} session
   */
  async _freshPlaybackSession(session) {
    if (!session?.session_id || !this.hass) return session;
    try {
      const sessions = await listRecordings(this.hass);
      this._sessions = sessions;
      const fresh = sessions.find((s) => s.session_id === session.session_id);
      return fresh || session;
    } catch (err) {
      console.warn("CCTV: could not refresh recordings before Play", err);
      return session;
    }
  }

  /**
   * Select a saved detection and start the same synced mosaic playback as the
   * desktop playback-bar Play control (handy on mobile).
   * @param {any} session
   * @param {Event | null} [domEvent]
   */
  async _playSavedDetection(session, domEvent = null) {
    domEvent?.stopPropagation?.();
    domEvent?.preventDefault?.();
    const fresh = await this._freshPlaybackSession(session);
    const ok = await this._selectPlaybackSession(fresh);
    if (!ok) return;
    if (
      !this._playback ||
      this._playback.session?.session_id !== fresh.session_id ||
      this._playback.playing
    ) {
      return;
    }
    await this._startPlayback();
  }

  _onPlayDetection(event) {
    const detail = event?.detail;
    const session = findSessionForTimelineEvent(this._sessions || [], detail);
    if (!session) {
      this._status = "No saved recording overlaps that timeline event";
      return;
    }
    this._selectPlaybackSession(session, detail);
  }

  async _startPlayback() {
    if (!this._playback?.tracks?.length) return;
    this._status = "Signing recording URLs…";
    try {
      await signPlaybackTracks(this.hass, this._playback.tracks);
    } catch (err) {
      console.warn("CCTV: could not sign playback URLs", err);
      this._status =
        err?.message ||
        "Could not sign recording URLs (auth/sign_path failed)";
      return;
    }
    const playable = this._playback.tracks.some((t) =>
      (t.items || []).some((item) => item.kind === "video" || item.kind === "snapshot")
    );
    if (!playable) {
      this._status = "No playable clips (files missing or empty)";
      return;
    }
    // Drop live slots before swapping mosaic media to recordings.
    this._resetLiveStreamSlots();
    this._playback = { ...this._playback, playing: true, paused: false };
    this._status = `Playing ${this._playback.labels.join(", ")} (synced)`;
    // Force a fresh paint of mosaic playback tiles. A bare updateComplete can
    // resolve a stale cycle (common when TV pack/stage also schedules updates)
    // and kick before <video class="playback-media"> exists.
    this.requestUpdate();
    await this.updateComplete;
    await this._waitForPlaybackMedia();
    await this._kickPlaybackVideos();
  }

  /**
   * Play / Pause toggle while event clips are on the mosaic.
   * Pause freezes videos in place — does not restore live.
   */
  async _togglePlaybackPause() {
    if (!this._playback) return;
    if (!this._playback.playing) {
      await this._startPlayback();
      return;
    }
    if (this._playback.paused) {
      await this._resumePlayback();
      return;
    }
    this._pausePlaybackClips();
  }

  /** Freeze clip videos; keep playback tiles mounted. */
  _pausePlaybackClips() {
    if (!this._playback?.playing) return;
    const root = this.renderRoot;
    root?.querySelectorAll?.("video.playback-media").forEach((video) => {
      try {
        video.pause?.();
      } catch {
        /* ignore */
      }
    });
    this._playback = { ...this._playback, paused: true };
    this._status = `Paused ${this._playback.labels.join(", ")}`;
  }

  async _resumePlayback() {
    if (!this._playback?.playing) {
      await this._startPlayback();
      return;
    }
    this._playback = { ...this._playback, paused: false };
    this._status = `Playing ${this._playback.labels.join(", ")} (synced)`;
    // Resume in place — do not reseek/reload (that would jump to clip start).
    const { videos } = this._playbackMediaEls();
    if (!videos.length) {
      await this._kickPlaybackVideos();
      return;
    }
    await Promise.all(
      videos.map(async (video) => {
        try {
          video.muted = true;
          video.playsInline = true;
          await video.play();
        } catch (err) {
          console.warn("CCTV resume play() failed", err);
        }
      })
    );
  }

  /**
   * Replay the same event/session from the window start on the same cams.
   * Remounts media elements: Lit will not re-apply an unchanged src after we
   * clear it, so Restart previously left tiles stuck mid-clip / at EOF.
   */
  async _restartPlayback() {
    if (!this._playback?.tracks?.length) return;
    const windowStart = Number(this._playback.windowStart);
    this._playbackDone = new Map();
    this._playbackIndex = new Map();
    this._playbackSeek = new Map();
    for (const track of this._playback.tracks) {
      const pos = clipPositionAtTime(track, windowStart);
      this._playbackIndex.set(track.cameraId, pos.index);
      this._playbackSeek.set(track.cameraId, pos.seekSec);
      this._playbackDone.set(track.cameraId, !track.items.length);
    }
    // Stay on clip tiles; clear src, then remount so the first clip loads again.
    this._teardownPlaybackMedia({ clearSrc: true });
    this._playbackMountGen += 1;
    this._playback = { ...this._playback, playing: true, paused: false };
    this._status = `Restarting ${this._playback.labels.join(", ")}…`;
    this.requestUpdate();
    await this.updateComplete;
    await this._waitForPlaybackMedia();
    await this._kickPlaybackVideos();
    if (this._playback?.playing && !this._playback?.paused) {
      this._status = `Playing ${this._playback.labels.join(", ")} (restarted)`;
    }
  }

  /**
   * Unload event playback and restore live mosaic (former reliable Stop path).
   * Bumps live mount generation so stream players remount — avoids stuck
   * "No preview" when existing live players were hard-unloaded in place.
   */
  _returnToLive() {
    this._teardownPlaybackMedia({ clearSrc: true });
    this._playback = null;
    this._playbackIndex = new Map();
    this._playbackSeek = new Map();
    this._playbackDone = new Map();
    try {
      streamSlots.releaseAll();
    } catch (err) {
      console.warn("CCTV: stream slot reset failed", err);
    }
    this._unloadStreamPlayers();
    this._liveMountGen += 1;
    this._status = "Live mosaic";
    this._schedulePack();
    this.updateComplete.then(() => {
      this._wakeLiveStreamPlayers();
      if (this._tvMode) this._refreshTvStage();
    });
  }

  /** @deprecated Use _returnToLive — kept for any leftover call sites. */
  _stopPlayback() {
    this._returnToLive();
  }

  _wakeLiveStreamPlayers() {
    const root = this.renderRoot;
    if (!root?.querySelectorAll) return;
    root.querySelectorAll("cctv-stream-player").forEach((el) => {
      try {
        el.active = true;
        el._idleReason = "";
        el._reconcilePlayback?.();
      } catch {
        /* ignore */
      }
    });
  }

  /**
   * @param {{ clearSrc?: boolean }} [opts]
   */
  _teardownPlaybackMedia(opts = {}) {
    const clearSrc = opts.clearSrc !== false;
    const root = this.renderRoot;
    if (!root) return;
    root.querySelectorAll("video.playback-media").forEach((video) => {
      try {
        video.pause?.();
        if (clearSrc) {
          video.removeAttribute("src");
          video.load?.();
        }
      } catch {
        /* ignore */
      }
    });
  }

  /**
   * Mosaic playback media currently in the render root.
   * @returns {{ videos: HTMLVideoElement[], snapshots: Element[], empty: Element[] }}
   */
  _playbackMediaEls() {
    const root = this.renderRoot;
    if (!root?.querySelectorAll) {
      return { videos: [], snapshots: [], empty: [] };
    }
    return {
      videos: [...root.querySelectorAll("video.playback-media")],
      snapshots: [...root.querySelectorAll("img.playback-media")],
      empty: [...root.querySelectorAll(".playback-empty")],
    };
  }

  _playbackHasVideoClips() {
    return (this._playback?.tracks || []).some((track) =>
      (track.items || []).some((item) => item.kind === "video")
    );
  }

  /**
   * Wait until mosaic playback tiles mount (video, snapshot, or empty).
   * @param {{ timeoutMs?: number }} [opts]
   * @returns {Promise<{ videos: HTMLVideoElement[], snapshots: Element[], empty: Element[] }>}
   */
  async _waitForPlaybackMedia(opts = {}) {
    const timeoutMs = Number(opts.timeoutMs) > 0 ? Number(opts.timeoutMs) : 2500;
    const deadline = Date.now() + timeoutMs;
    let attempt = 0;
    while (this._playback?.playing && Date.now() < deadline) {
      const media = this._playbackMediaEls();
      if (media.videos.length || media.snapshots.length || media.empty.length) {
        return media;
      }
      attempt += 1;
      if (attempt % 3 === 0) {
        this.requestUpdate();
        await this.updateComplete;
      }
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    }
    return this._playbackMediaEls();
  }

  async _kickPlaybackVideos() {
    if (!this._playback?.playing || this._playback?.paused) return;
    let { videos } = this._playbackMediaEls();
    if (!videos.length) {
      ({ videos } = await this._waitForPlaybackMedia({ timeoutMs: 1500 }));
    }
    if (!videos.length) {
      const media = this._playbackMediaEls();
      if (media.snapshots.length && !this._playbackHasVideoClips()) {
        this._status = `Playing ${this._playback.labels.join(", ")} (snapshots)`;
        return;
      }
      if (media.empty.length && !media.snapshots.length && !this._playbackHasVideoClips()) {
        this._status = "No recording tiles for the selected cameras";
        return;
      }
      this._status = "Playback ready but no video elements found";
      return;
    }
    // Start every visible camera together (not one-at-a-time).
    const results = await Promise.all(
      videos.map((video) => this._startOnePlaybackVideo(video))
    );
    const failed = results.filter((r) => !r.ok);
    if (failed.length && failed.length === results.length) {
      this._status = `Playback failed to start (${failed[0].reason || "media error"})`;
    } else if (failed.length) {
      this._status = `Playing ${results.length - failed.length}/${results.length} cameras`;
    }
  }

  /**
   * Ensure muted/playsInline, wait for media data, seek, then play.
   * @param {HTMLVideoElement} video
   */
  _startOnePlaybackVideo(video) {
    const cameraId = video.getAttribute("data-camera") || "";
    const seek = Number(this._playbackSeek.get(cameraId)) || 0;
    const track = this._trackForCamera(cameraId);
    const item = track ? this._currentPlaybackItem(track) : null;

    // Autoplay policies require muted + playsInline; set properties not just attrs.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";

    // After Restart teardown, Lit may leave src empty when the URL is unchanged.
    if (item?.kind === "video" && item.url) {
      const current = video.getAttribute("src") || video.currentSrc || "";
      if (!current || current !== item.url) {
        video.setAttribute("src", item.url);
        video.src = item.url;
        try {
          video.load?.();
        } catch {
          /* ignore */
        }
      }
    }

    const playNow = async () => {
      try {
        // Always seek (incl. 0) so Restart from EOF / mid-clip starts cleanly.
        try {
          if (Number.isFinite(seek) && Math.abs((video.currentTime || 0) - seek) > 0.05) {
            video.currentTime = seek;
          } else if (seek === 0 && (video.currentTime || 0) > 0.05) {
            video.currentTime = 0;
          }
        } catch {
          /* seek may fail on some containers */
        }
        await video.play();
        return { ok: true, cameraId };
      } catch (err) {
        const reason = err?.name || err?.message || "play() rejected";
        console.warn("CCTV playback play() failed", cameraId, err);
        try {
          video.muted = true;
          await video.play();
          return { ok: true, cameraId };
        } catch (err2) {
          console.warn("CCTV playback retry failed", cameraId, err2);
          return { ok: false, cameraId, reason };
        }
      }
    };

    return new Promise((resolve) => {
      const onError = () => {
        const code = video.error?.code;
        const reason =
          code === 4
            ? "unsupported/unauthorized media (check signed URL)"
            : code === 2
              ? "network error loading clip"
              : `media error ${code || ""}`.trim();
        console.warn("CCTV playback media error", cameraId, video.error, video.currentSrc);
        resolve({ ok: false, cameraId, reason });
      };

      if (video.readyState >= 2) {
        playNow().then(resolve);
        return;
      }
      video.addEventListener(
        "loadeddata",
        () => {
          playNow().then(resolve);
        },
        { once: true }
      );
      video.addEventListener("error", onError, { once: true });
      try {
        video.load();
      } catch {
        playNow().then(resolve);
      }
    });
  }

  _playbackVideoEl(cameraId) {
    const safeId = String(cameraId).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return this.renderRoot?.querySelector?.(
      `video.playback-media[data-camera="${safeId}"]`
    );
  }

  _onPlaybackEnded(cameraId) {
    if (!this._playback?.playing || this._playback?.paused) return;
    const track = this._playback.tracks.find((t) => t.cameraId === cameraId);
    if (!track) return;
    const idx = this._playbackIndex.get(cameraId) || 0;
    const next = idx + 1;
    const windowEnd = Number(this._playback.windowEnd);

    if (next < track.items.length) {
      const item = track.items[next];
      // Stay inside the event time window when advancing chunks.
      if (
        Number.isFinite(windowEnd) &&
        Number.isFinite(item.startedMs) &&
        item.startedMs >= windowEnd
      ) {
        this._markPlaybackCameraDone(cameraId);
        return;
      }
      this._playbackIndex.set(cameraId, next);
      this._playbackSeek.set(cameraId, 0);
      // Advance only this camera's element — do not re-render/remount siblings.
      if (item.kind === "snapshot") {
        this.requestUpdate();
        return;
      }
      this._advancePlaybackVideo(cameraId, item);
      return;
    }

    this._markPlaybackCameraDone(cameraId);
  }

  async _advancePlaybackVideo(cameraId, item) {
    const video = this._playbackVideoEl(cameraId);
    if (!video) {
      this._markPlaybackCameraDone(cameraId);
      return;
    }
    try {
      item.path = mediaApiPathFromClip(item);
      item.url = await signRecordingUrl(this.hass, item.path);
      video.muted = true;
      video.playsInline = true;
      video.src = item.url;
      video.load?.();
      await this._startOnePlaybackVideo(video);
    } catch (err) {
      console.warn("CCTV chunk advance failed", cameraId, err);
      this._markPlaybackCameraDone(cameraId);
    }
  }

  _markPlaybackCameraDone(cameraId) {
    this._playbackDone.set(cameraId, true);
    const tracks = this._playback?.tracks || [];
    const allDone = tracks.every((t) => {
      if (!t.items.length) return true;
      if (t.items.every((item) => item.kind === "snapshot")) return true;
      return this._playbackDone.get(t.cameraId);
    });
    if (allDone && this._playback?.playing) {
      // Freeze on last frame — do not tear down to live (use Back to live).
      this._pausePlaybackClips();
      this._status = `Finished ${this._playback.labels.join(", ")} — Restart or Back to live`;
    }
  }

  _trackForCamera(cameraId) {
    return this._playback?.tracks?.find((t) => t.cameraId === cameraId) || null;
  }

  _currentPlaybackItem(track) {
    if (!track?.items?.length) return null;
    const idx = Math.min(
      this._playbackIndex.get(track.cameraId) || 0,
      Math.max(0, track.items.length - 1)
    );
    return track.items[idx] || null;
  }

  _stableCameraNames(cameras) {
    const key = cameras.map((c) => `${c.entityId}:${c.name}`).join("|");
    if (key === this._cameraNamesKey) return this._cameraNamesCache;
    this._cameraNamesKey = key;
    this._cameraNamesCache = Object.fromEntries(
      cameras.map((c) => [c.entityId, c.name])
    );
    return this._cameraNamesCache;
  }

  render() {
    if (!this.hass) {
      return html`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;
    }

    void this._qualityTick;
    void this._deviceMapReady;

    const cameras = this._cameras();
    const maxStreams = this._maxStreams();
    streamSlots.setMax(maxStreams);
    const title = this.config?.title || "CCTV";

    if (this.panelMode && !this._selectionReady) {
      return html`
        <div class="panel-wrap wrap">
          <p class="placeholder">Loading camera selection…</p>
        </div>
      `;
    }

    // Navigated away but HA still holds the panel in DOM — keep UI minimal
    // so no live streams / history polling / playback stay active.
    if (this.panelMode && !this._panelActive) {
      return html`
        <div class="panel-wrap wrap">
          <p class="placeholder">CCTV paused — streams unloaded while you are away.</p>
        </div>
      `;
    }

    const detail = cameras.find((c) => c.entityId === this._detailId) || null;
    const visible = this.panelMode
      ? this._layoutCameras(cameras)
      : cameras;

    const cameraNames = this._stableCameraNames(cameras);
    const playing = Boolean(this._playback?.playing);
    const playbackPaused = Boolean(playing && this._playback?.paused);
    const streamsActive = this._panelActive;

    const wrapClass = [
      this.panelMode ? "panel-wrap wrap" : "wrap",
      this.panelMode && this._tvMode ? "tv-mode" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div class=${wrapClass}>
        <div class="top ${this._tvMode ? "top-tv" : ""}">
          <div>
            ${this.panelMode && !this._tvMode
              ? html`<p class="eyebrow">Home Assistant</p>`
              : nothing}
            <h1>${title}${this._tvMode ? html`<span class="tv-badge">TV</span>` : nothing}</h1>
          </div>
          <div class="top-actions">
            ${this.panelMode
              ? html`
                  <button
                    class="btn"
                    type="button"
                    @click=${() => (this._pickerOpen = !this._pickerOpen)}
                  >
                    ${this._pickerOpen ? "Hide cameras" : "Choose cameras"}
                  </button>
                  <button
                    class="btn"
                    type="button"
                    @click=${() => {
                      this._settingsOpen = !this._settingsOpen;
                      if (this._settingsOpen) this._loadRecordingUi();
                    }}
                  >
                    ${this._settingsOpen ? "Hide settings" : "Settings"}
                  </button>
                `
              : nothing}
            <span class="status">
              ${this._status ||
              (this.panelMode
                ? `${visible.length}/${maxStreams} selected · ${playing ? (playbackPaused ? "paused" : "playback") : `${streamSlots.activeCount()} live`}`
                : `${cameras.length} camera${cameras.length === 1 ? "" : "s"} · ${streamSlots.activeCount()} live`)}
              ${this._saving ? " · saving…" : ""}
            </span>
          </div>
        </div>

        ${this.panelMode && this._pickerOpen
          ? this._renderPicker(cameras, maxStreams)
          : nothing}

        ${this.panelMode && this._settingsOpen
          ? this._renderSettings()
          : nothing}

        ${this.panelMode && this._playback
          ? this._renderPlaybackBar()
          : nothing}

        ${detail
          ? this._renderDetail(detail, streamsActive)
          : this.panelMode
            ? this._renderLayout(visible, streamsActive)
            : this._renderCardGrid(cameras)}

        ${this.panelMode && !detail
          ? html`
              <cctv-detection-timeline
                .hass=${this.hass}
                .cameras=${visible.map((c) => c.entityId)}
                .sensorLinks=${this._sensorLinks}
                .cameraNames=${cameraNames}
                .active=${streamsActive}
                @cctv-play-detection=${this._onPlayDetection}
              ></cctv-detection-timeline>
              ${this._renderRecordings()}
            `
          : nothing}
      </div>
    `;
  }

  _renderPlaybackBar() {
    const pb = this._playback;
    if (!pb) return nothing;
    const when = pb.session?.started
      ? new Date(pb.session.started).toLocaleString()
      : "—";
    const showPause = pb.playing && !pb.paused;
    const playPauseLabel = showPause ? "Pause" : "Play";
    return html`
      <div class="playback-bar" role="region" aria-label="Detection playback">
        <div class="playback-bar-meta">
          <strong>${pb.labels.join(", ")}</strong>
          <span class="hint">${when} · ${formatBytes(sessionTotalBytes(pb.session))}${pb.playing && pb.paused ? " · paused" : ""}</span>
        </div>
        <div class="playback-bar-actions">
          <button
            class="btn primary"
            type="button"
            @click=${this._togglePlaybackPause}
          >
            ${playPauseLabel}
          </button>
          ${pb.playing
            ? html`
                <button class="btn" type="button" @click=${this._restartPlayback}>
                  Restart
                </button>
              `
            : nothing}
          <button class="btn" type="button" @click=${this._returnToLive}>
            Back to live
          </button>
        </div>
      </div>
    `;
  }

  _renderSettings() {
    const kinds = this._recordDetectionKinds || [];
    return html`
      <section class="settings-panel" aria-label="CCTV settings">
        <div class="picker-head">
          <strong>Detection recordings</strong>
          <span class="hint">
            When any site-wide linked detection sensor triggers, HA logs the event for
            the shared timeline and (if enabled) saves clips for <em>all</em> available
            cameras until sensors clear. Choose which detection types save video — shared
            for all users. Timeline + saved detections survive reboot and
            are purged only after retention days. Uses <code>camera.record</code>
            (30s chunks + lookback) with snapshot fallback. Mosaic selection stays personal.
          </span>
        </div>
        <div class="settings-grid">
          <label class="settings-field">
            Retention (days)
            <input
              type="number"
              min="1"
              max="30"
              .value=${String(this._retentionDays)}
              @change=${(e) => this._saveRetentionDays(e.target.value)}
            />
          </label>
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._recordOnDetection}
              @change=${(e) => this._toggleRecordOnDetection(e.target.checked)}
            />
            <span class="picker-name">Record on detection</span>
            <span class="picker-id">Default retention is 1 day (24 hours).</span>
          </label>
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._notifyOnDetection}
              ?disabled=${this._saving}
              @change=${(e) => this._toggleNotifyOnDetection(e.target.checked)}
            />
            <span class="picker-name">Notify me when recorded</span>
            <span class="picker-id">
              Per-user. Sends type + duration to your Companion app (or HA notification).
              Only fires when a clip with media was saved.
            </span>
          </label>
          <label class="picker-item settings-toggle">
            <input
              type="checkbox"
              .checked=${this._tvMode}
              ?disabled=${this._saving}
              @change=${(e) => this._toggleTvMode(e.target.checked)}
            />
            <span class="picker-name">TV mode</span>
            <span class="picker-id">
              Per-device (this browser / kiosk). Fits a 16:9 mosaic above the fold
              (accounts for HA / kiosk chrome); up to 4 cams fill the stage; 1–2 cams
              maximize. Timeline and Saved detections scroll below.
            </span>
          </label>
        </div>
        <div class="kind-filter" role="group" aria-label="Detection types that save video">
          <strong class="kind-filter-title">Save video for</strong>
          <span class="hint">
            Unchecked types still appear on the timeline, but do not start a recording.
            Shared for all Home Assistant users.
          </span>
          <div class="kind-filter-list">
            ${DETECTION_KINDS.map(
              (kind) => html`
                <label class="picker-item kind-filter-item">
                  <input
                    type="checkbox"
                    .checked=${kinds.includes(kind.id)}
                    ?disabled=${!this._recordOnDetection || this._saving}
                    @change=${(e) =>
                      this._toggleRecordKind(kind.id, e.target.checked)}
                  />
                  <span class="picker-name">${kind.label}</span>
                </label>
              `
            )}
          </div>
        </div>
        <p class="hint">
          Storage: ${this._recordDir || "HA media / www /cctv_dashboard/recordings"}.
          Multi-cam continuous video needs a writable media folder and cameras that support streaming;
          otherwise snapshots are saved instead. Also configurable under
          Settings → Devices &amp; services → CCTV Dashboard → Configure.
        </p>
        <div class="settings-debug" aria-label="Recording debug">
          <div class="picker-head">
            <strong>Recording debug</strong>
            <button class="btn" type="button" @click=${this._copyRecordingDebug}>
              Copy
            </button>
          </div>
          <span class="hint">
            Settings-only. Last session clip kinds/sizes/paths/URLs and why
            <code>camera.record</code> fell back to snapshot. Also available as
            <code>sensor.cctv_dashboard_recording_debug</code> (attribute
            <code>debug_text</code>) — not shown on the main mosaic.
          </span>
          ${this._recordingDebugSummary
            ? html`<p class="hint"><code>${this._recordingDebugSummary}</code></p>`
            : nothing}
          <textarea
            class="settings-debug-text"
            readonly
            rows="12"
            .value=${this._recordingDebug ||
            "No recording session debug yet. Trigger a detection to populate."}
          ></textarea>
        </div>
      </section>
    `;
  }

  _renderRecordings() {
    const sessions = this._savedDetectionSessions();
    const totalBytes = sessions.reduce(
      (sum, session) => sum + sessionTotalBytes(session),
      0
    );
    const paged = paginateSessions(
      sessions,
      this._recordingsPage,
      SAVED_DETECTIONS_PAGE_SIZE
    );
    const admin = this._isAdmin();
    return html`
      <section class="recordings" aria-label="Saved detections">
        <div class="timeline-head">
          <div>
            <strong>Saved detections</strong>
            <span class="hint">
              Time, what was detected, and file size. Play starts mosaic
              playback for the visible cameras; click the row to load it first
              (desktop bar still works). Shared for all users; survives reboot;
              kept for ${this._retentionDays} day${this._retentionDays === 1 ? "" : "s"}.
              Showing ${SAVED_DETECTIONS_PAGE_SIZE} per page.
              Empty 0&nbsp;B stubs are hidden.
              ${admin
                ? " Admins can delete one detection (including stuck in-progress) or clear all for everyone."
                : ""}
            </span>
          </div>
          <div class="recording-toolbar">
            <span class="recording-total" title="Total size of saved detections">
              Total ${formatBytes(totalBytes)}
              ${sessions.length
                ? html` · ${sessions.length} detection${sessions.length === 1 ? "" : "s"}`
                : nothing}
            </span>
            <button class="btn" type="button" @click=${() => this._refreshSessions()}>
              Refresh
            </button>
            ${admin
              ? html`
                  <button
                    class="btn recording-delete"
                    type="button"
                    ?disabled=${this._saving}
                    title="Delete all saved detections and reset the timeline"
                    @click=${(e) => this._clearAllDetections(e)}
                  >
                    Clear all
                  </button>
                `
              : nothing}
          </div>
        </div>
        ${!sessions.length
          ? html`<p class="empty">No detection recordings yet.</p>`
          : html`
              <div class="recording-list">
                ${paged.items.map((session) => this._renderSession(session, admin))}
              </div>
              ${paged.pageCount > 1
                ? html`
                    <div class="recording-pager" role="navigation" aria-label="Saved detections pages">
                      <button
                        class="btn"
                        type="button"
                        ?disabled=${paged.page <= 1}
                        @click=${() => this._setRecordingsPage(paged.page - 1)}
                      >
                        Previous
                      </button>
                      <span class="recording-page-label">
                        Page ${paged.page} / ${paged.pageCount}
                      </span>
                      <button
                        class="btn"
                        type="button"
                        ?disabled=${paged.page >= paged.pageCount}
                        @click=${() => this._setRecordingsPage(paged.page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  `
                : nothing}
            `}
      </section>
    `;
  }

  _renderSession(session, admin = false) {
    const when = session.started
      ? new Date(session.started).toLocaleString()
      : "—";
    const labels = detectionLabelsFromTriggers(
      this.hass,
      session.trigger_sensors || []
    );
    const size = formatBytes(sessionTotalBytes(session));
    const selected =
      this._playback?.session?.session_id === session.session_id;
    const canPlay = sessionIsPlayable(session);
    return html`
      <div
        class="recording-item ${session.active ? "active" : ""} ${selected ? "selected" : ""}"
      >
        <button
          type="button"
          class="recording-select"
          ?disabled=${!canPlay}
          @click=${() => this._selectPlaybackSession(session)}
        >
          <div class="recording-meta">
            <span class="recording-when">${when}${session.active ? " · recording…" : ""}</span>
            <span class="recording-detected">${labels.join(", ")}</span>
          </div>
          <span class="recording-size">${size}</span>
        </button>
        <div class="recording-actions">
          <button
            type="button"
            class="btn primary recording-play"
            title="Play this detection on the mosaic"
            ?disabled=${!canPlay}
            @click=${(e) => this._playSavedDetection(session, e)}
          >
            Play
          </button>
          ${admin
            ? html`
                <button
                  type="button"
                  class="btn recording-delete"
                  title=${session.active
                    ? "Stop and delete this in-progress recording"
                    : "Delete recordings for all users"}
                  @click=${(e) =>
                    this._deleteSession(session.session_id, e, session)}
                >
                  Delete
                </button>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  /**
   * Picker rows: one per physical group + ungrouped cameras.
   * @param {ReturnType<typeof listCameras>} cameras
   */
  _pickerRows(cameras) {
    const byId = new Map(cameras.map((c) => [c.entityId, c]));
    const seen = new Set();
    /** @type {Array<{ type: "group", group: any, members: any[], selectedId: string | null } | { type: "camera", cam: any }>} */
    const rows = [];
    for (const cam of cameras) {
      if (seen.has(cam.entityId)) continue;
      const group = this._groupFor(cam.entityId);
      if (group) {
        for (const mid of group.members) seen.add(mid);
        const members = group.members
          .map((id) => byId.get(id) || cameraFromState(id, this.hass?.states?.[id]))
          .filter(Boolean);
        const selectedId =
          this._visibleIds.find((id) => group.members.includes(id)) || null;
        rows.push({ type: "group", group, members, selectedId });
      } else {
        seen.add(cam.entityId);
        rows.push({ type: "camera", cam });
      }
    }
    return rows;
  }

  _renderPicker(cameras, maxStreams) {
    if (!cameras.length) {
      return html`<p class="empty">No camera entities found.</p>`;
    }
    const rows = this._pickerRows(cameras);
    return html`
      <section class="picker" aria-label="Camera selection">
        <div class="picker-head">
          <strong>Visible streams</strong>
          <span class="hint">
            Select 1–${maxStreams}. For grouped physical cameras, pick which stream and quality.
            Live failover uses another group stream if the preferred one fails.
            Selection is per user; sensors/groups stay shared.
          </span>
        </div>
        <div class="picker-list">
          ${rows.map((row) => {
            if (row.type === "group") {
              const selectedId = row.selectedId;
              const checked = Boolean(selectedId);
              const disabled = !checked && this._visibleIds.length >= maxStreams;
              const preferred = selectedId || row.members[0]?.entityId || "";
              const quality = preferred ? this._qualityFor(preferred) : "auto";
              const forceSelect = preferred
                ? forceAspectSelectValue(this._forceAspectLabel(preferred))
                : "auto";
              const linked = preferred ? this._linksFor(preferred).length : 0;
              return html`
                <div class="picker-item picker-group ${disabled ? "disabled" : ""}">
                  <label class="picker-group-main">
                    <input
                      type="checkbox"
                      .checked=${checked}
                      ?disabled=${disabled && !checked}
                      @change=${(e) =>
                        this._toggleVisible(
                          preferred || row.members[0]?.entityId,
                          e.target.checked
                        )}
                    />
                    <span class="picker-name">
                      ${row.group.name}
                      <span class="group-badge">${row.members.length} streams</span>
                    </span>
                  </label>
                  <span class="picker-id">
                    ${linked
                      ? `${linked} sensor${linked === 1 ? "" : "s"} shared`
                      : "No sensors linked yet"}
                    · quality ${quality} · aspect ${forceSelect}
                  </span>
                  <div class="picker-stream-controls">
                    <label>
                      Stream
                      <select
                        ?disabled=${!checked || this._saving}
                        @change=${(e) =>
                          this._setPreferredStream(
                            selectedId || preferred,
                            e.target.value
                          )}
                      >
                        ${row.members.map(
                          (m) =>
                            html`<option
                              value=${m.entityId}
                              ?selected=${m.entityId === preferred}
                            >
                              ${m.name || m.entityId}
                            </option>`
                        )}
                      </select>
                    </label>
                    <label>
                      Quality
                      <select
                        ?disabled=${!checked || this._saving}
                        @change=${(e) =>
                          this._setPickerQuality(preferred, e.target.value)}
                      >
                        ${QUALITY_OPTIONS.map(
                          (opt) =>
                            html`<option
                              value=${opt.value}
                              ?selected=${opt.value === quality}
                            >
                              ${opt.label}
                            </option>`
                        )}
                      </select>
                    </label>
                    <label>
                      Aspect
                      <select
                        ?disabled=${!checked || this._saving}
                        @change=${(e) =>
                          this._setPickerForceAspect(preferred, e.target.value)}
                      >
                        ${FORCE_ASPECT_OPTIONS.map(
                          (opt) =>
                            html`<option
                              value=${opt.value}
                              ?selected=${opt.value === forceSelect}
                            >
                              ${opt.label}
                            </option>`
                        )}
                      </select>
                    </label>
                  </div>
                </div>
              `;
            }
            const cam = row.cam;
            const checked = this._visibleIds.includes(cam.entityId);
            const disabled = !checked && this._visibleIds.length >= maxStreams;
            const linked = this._linksFor(cam.entityId).length;
            const quality = this._qualityFor(cam.entityId);
            const forceSelect = forceAspectSelectValue(
              this._forceAspectLabel(cam.entityId)
            );
            return html`
              <div class="picker-item ${disabled ? "disabled" : ""}">
                <label class="picker-group-main">
                  <input
                    type="checkbox"
                    .checked=${checked}
                    ?disabled=${disabled}
                    @change=${(e) =>
                      this._toggleVisible(cam.entityId, e.target.checked)}
                  />
                  <span class="picker-name">${cam.name}</span>
                </label>
                <span class="picker-id">
                  ${cam.entityId}${linked ? ` · ${linked} sensor${linked === 1 ? "" : "s"}` : ""}
                  · quality ${quality} · aspect ${forceSelect}
                </span>
                <div class="picker-stream-controls">
                  <label>
                    Quality
                    <select
                      ?disabled=${!checked || this._saving}
                      @change=${(e) =>
                        this._setPickerQuality(cam.entityId, e.target.value)}
                    >
                      ${QUALITY_OPTIONS.map(
                        (opt) =>
                          html`<option
                            value=${opt.value}
                            ?selected=${opt.value === quality}
                          >
                            ${opt.label}
                          </option>`
                      )}
                    </select>
                  </label>
                  <label>
                    Aspect
                    <select
                      ?disabled=${!checked || this._saving}
                      @change=${(e) =>
                        this._setPickerForceAspect(cam.entityId, e.target.value)}
                    >
                      ${FORCE_ASPECT_OPTIONS.map(
                        (opt) =>
                          html`<option
                            value=${opt.value}
                            ?selected=${opt.value === forceSelect}
                          >
                            ${opt.label}
                          </option>`
                      )}
                    </select>
                  </label>
                </div>
              </div>
            `;
          })}
        </div>
      </section>
    `;
  }

  _renderLayout(cameras, streamsActive = true) {
    if (!cameras.length) {
      return html`
        <p class="empty">
          Select cameras above to start streaming.
          One camera fills the view; two to four split the screen equally (max ${this._maxStreams()}).
        </p>
      `;
    }

    const list = cameras.slice(0, 4);
    // Mobile: previous stacked layout-N. Desktop: aspect-aware absolute pack.
    if (!this._isDesktop) {
      const count = list.length;
      return html`
        <div class="layout layout-${count}" role="list">
          ${list.map((cam) => this._renderLayoutTile(cam, false, streamsActive))}
        </div>
      `;
    }

    // Full content width × 16:9 height (never a height-limited narrower box).
    const tvStage =
      this._tvMode && this._tvStage?.width >= 8 && this._tvStage?.height >= 8
        ? `width:${this._tvStage.width}px;height:${this._tvStage.height}px;max-width:100%;aspect-ratio:16/9;`
        : this._tvMode
          ? `width:100%;max-width:100%;aspect-ratio:16/9;`
          : nothing;
    const countClass =
      this._tvMode && list.length <= 2 ? "layout-pack-maximize" : "";

    return html`
      <div
        class="layout layout-pack ${this._tvMode ? "layout-pack-tv" : ""} ${countClass}"
        role="list"
        style=${tvStage}
        @cctv-media-aspect=${this._onMediaAspect}
      >
        ${list.map((cam) => this._renderLayoutTile(cam, true, streamsActive))}
      </div>
    `;
  }

  _renderLayoutTile(cam, packed, streamsActive = true) {
    const quality = this._qualityFor(cam.entityId);
    const groupMembers = groupMembersForCamera(this._streamGroups, cam.entityId);
    const failoverIds = failoverStreamOrder(cam.entityId, groupMembers);
    const linked = this._linksFor(cam.entityId).length;
    const packStyle = packed ? this._packStyles?.[cam.entityId] : "";
    const positioned = Boolean(packed && packStyle);
    const playing = Boolean(this._playback?.playing);
    const paused = Boolean(playing && this._playback?.paused);
    const track = playing ? this._trackForCamera(cam.entityId) : null;
    const item = track ? this._currentPlaybackItem(track) : null;
    const forceLabel = this._forceAspectLabel(cam.entityId);
    const forcedRatio = forceAspectRatio(forceLabel);
    // Trigger highlight is a pointer-events:none overlay — never rewrite the
    // tile class/style or video src/kick (that broke pre-#46 playback).
    const triggerMeta =
      playing && this._playback?.triggerHighlights
        ? this._playback.triggerHighlights[cam.entityId]
        : null;
    // Mobile / unpacked tiles: seed a definite box from the shared override.
    const mediaStyle =
      !positioned && forcedRatio
        ? `aspect-ratio:${forcedRatio}; width:100%;`
        : nothing;
    return html`
      <article
        class="tile layout-tile ${positioned ? "pack-tile" : ""}"
        role="listitem"
        style=${positioned ? packStyle : nothing}
      >
        <div class="tile-media" style=${mediaStyle}>
          ${playing
            ? !item
              ? html`<div class="playback-empty">No recording for this camera</div>`
              : item.kind === "snapshot"
                ? keyed(
                    `${this._playbackMountGen}:${cam.entityId}:snap:${item.url}`,
                    html`<img
                      class="playback-media"
                      alt=""
                      src=${item.url}
                      @load=${(e) =>
                        this._onPlaybackMediaSize(
                          cam.entityId,
                          e.target.naturalWidth,
                          e.target.naturalHeight
                        )}
                    />`
                  )
                : keyed(
                    `${this._playbackMountGen}:${cam.entityId}:vid:${item.url}`,
                    html`
                      <video
                        class="playback-media"
                        data-camera=${cam.entityId}
                        src=${item.url}
                        ?autoplay=${!paused}
                        muted
                        playsinline
                        webkit-playsinline
                        preload="auto"
                        .muted=${true}
                        .playsInline=${true}
                        controls
                        @loadedmetadata=${(e) =>
                          this._onPlaybackMediaSize(
                            cam.entityId,
                            e.target.videoWidth,
                            e.target.videoHeight
                          )}
                        @ended=${() => this._onPlaybackEnded(cam.entityId)}
                      ></video>
                    `
                  )
            : keyed(
                `${this._liveMountGen}:${cam.entityId}`,
                html`
                  <cctv-stream-player
                    large
                    mosaic
                    eager
                    .active=${streamsActive}
                    .hass=${this.hass}
                    .camera=${cam}
                    .config=${this.config}
                    .quality=${quality}
                    .groupMembers=${groupMembers}
                    .failoverEntityIds=${failoverIds}
                    context="mosaic"
                    muted
                    @cctv-stream-failover=${(e) => {
                      const to = e?.detail?.to;
                      if (to) {
                        this._status = `Live failover → ${to.replace(/^camera\./, "")}`;
                      }
                    }}
                  ></cctv-stream-player>
                `
              )}
          ${triggerMeta
            ? html`<div
                class="trigger-cam-overlay kind-${triggerMeta.kindId}"
                style=${`--cctv-trigger-color:${triggerMeta.color}`}
                aria-hidden="true"
              ></div>`
            : nothing}
        </div>
        ${playing
          ? html`
              <div class="tile-body ${packed ? "pack-caption" : ""}">
                <p class="tile-title">${cam.name}</p>
                <p class="tile-meta">${paused ? "Paused" : "Playback"}</p>
              </div>
            `
          : html`
              <button
                type="button"
                class="tile-body tile-open ${packed ? "pack-caption" : ""}"
                @click=${() => this._openDetail(cam.entityId)}
              >
                <p class="tile-title">${cam.name}</p>
                <p class="tile-meta">
                  <span class="dot ${cam.state}"></span>${cam.state} · ${quality}
                  ${linked ? html` · ${linked} detection` : nothing}
                </p>
              </button>
            `}
      </article>
    `;
  }

  _renderCardGrid(cameras) {
    if (!cameras.length) {
      return html`<p class="empty">No camera entities found.</p>`;
    }
    return html`
      <div class="grid" role="list">
        ${cameras.map((cam) => {
          const quality = this._qualityFor(cam.entityId);
          return html`
            <article class="tile" role="listitem">
              <div class="tile-media">
                <cctv-stream-player
                  .hass=${this.hass}
                  .camera=${cam}
                  .config=${this.config}
                  .quality=${quality}
                  context="mosaic"
                  muted
                ></cctv-stream-player>
              </div>
              <button
                type="button"
                class="tile-body tile-open"
                @click=${() => this._openDetail(cam.entityId)}
              >
                <p class="tile-title">${cam.name}</p>
                <p class="tile-meta">
                  <span class="dot ${cam.state}"></span>${cam.state} · ${quality}
                </p>
              </button>
            </article>
          `;
        })}
      </div>
    `;
  }

  _renderDetail(cam, streamsActive = true) {
    const actions = availableCameraActions(this.hass, cam);
    const quality = this._qualityFor(cam.entityId);
    const streamCam = resolveStreamCamera(
      this.hass,
      cam,
      this.config,
      quality,
      "detail"
    );
    const forceSelect = forceAspectSelectValue(this._forceAspectLabel(cam.entityId));
    const showCustomAspect =
      this.panelMode &&
      (forceSelect === "custom" || Boolean(this._customAspectDraft));
    const customAspectValue =
      this._customAspectDraft ||
      (forceSelect === "custom"
        ? this._forceAspectLabel(cam.entityId)
        : "");
    const group = this._groupFor(cam.entityId);
    const groupMembers = this._groupMembers(cam.entityId);
    return html`
      <button class="btn linkish" type="button" @click=${this._back}>
        ← ${this.panelMode ? "Back to layout" : "All cameras"}
      </button>
      <h2>${cam.name}</h2>
      <div class="detail-stage">
        <cctv-stream-player
          large
          eager
          .active=${streamsActive}
          .hass=${this.hass}
          .camera=${cam}
          .config=${this.config}
          .quality=${quality}
          .groupMembers=${groupMembers}
          .failoverEntityIds=${failoverStreamOrder(cam.entityId, groupMembers)}
          context="detail"
          .muted=${false}
          controls
        ></cctv-stream-player>
      </div>
      ${group
        ? html`
            <div class="quality-row">
              <label>
                Live stream
                <select
                  @change=${(e) => {
                    const nextId = e.target.value;
                    void this._setPreferredStream(cam.entityId, nextId);
                    this._detailId = nextId;
                    this._syncGroupDraftFromCamera(nextId);
                  }}
                >
                  ${group.members.map((mid) => {
                    const member =
                      this._cameras().find((c) => c.entityId === mid) ||
                      cameraFromState(mid, this.hass?.states?.[mid]);
                    return html`<option
                      value=${mid}
                      ?selected=${mid === cam.entityId}
                    >
                      ${member?.name || mid}
                    </option>`;
                  })}
                </select>
              </label>
              <span class="hint">Physical group: ${group.name}</span>
            </div>
          `
        : nothing}
      <div class="quality-row">
        <label>
          Stream quality
          <select
            @change=${(e) => this._setQuality(cam.entityId, e.target.value)}
          >
            ${QUALITY_OPTIONS.map(
              (opt) =>
                html`<option
                  value=${opt.value}
                  ?selected=${opt.value === quality}
                >
                  ${opt.label}
                </option>`
            )}
          </select>
        </label>
        <span class="hint">${qualityHelp(quality)}</span>
      </div>
      ${this.panelMode
        ? html`
            <div class="quality-row">
              <label>
                Force aspect ratio
                <select
                  @change=${(e) =>
                    this._setForceAspect(cam.entityId, e.target.value)}
                >
                  ${FORCE_ASPECT_OPTIONS.map(
                    (opt) =>
                      html`<option
                        value=${opt.value}
                        ?selected=${opt.value === forceSelect}
                      >
                        ${opt.label}
                      </option>`
                  )}
                </select>
              </label>
              <span class="hint">Shared for all users.</span>
            </div>
            ${showCustomAspect
              ? html`
                  <div class="quality-row">
                    <label>
                      Custom W:H
                      <input
                        type="text"
                        class="aspect-input"
                        placeholder="1920:2560"
                        .value=${customAspectValue}
                        @input=${(e) =>
                          this._setCustomForceAspect(
                            cam.entityId,
                            e.target.value
                          )}
                      />
                    </label>
                    <span class="hint">Examples: 1920:2560, 3:4, 1080x1920</span>
                  </div>
                `
              : nothing}
            <div class="quality-row prefs-save-row">
              <button
                class="btn primary"
                type="button"
                ?disabled=${this._saving || !this._prefsDirty}
                @click=${() => this._saveCameraPrefs()}
              >
                ${this._saving ? "Saving…" : "Save quality & aspect"}
              </button>
              <span class="hint">
                ${this._prefsDirty
                  ? "Unsaved changes — writes shared settings for all users."
                  : "No unsaved changes."}
              </span>
            </div>
          `
        : nothing}
      <dl class="meta">
        <dt>Entity</dt>
        <dd>${cam.entityId}</dd>
        <dt>Streaming</dt>
        <dd>${streamCam.entityId}</dd>
        <dt>State</dt>
        <dd>${cam.state}</dd>
        <dt>Brand</dt>
        <dd>${cam.brand || "—"}</dd>
        <dt>Model</dt>
        <dd>${cam.model || "—"}</dd>
      </dl>
      <div class="actions">
        ${actions.length
          ? actions.map(
              (action) => html`
                <button
                  class="btn primary"
                  type="button"
                  @click=${() => this._run(action.service, cam.entityId)}
                >
                  ${action.label}
                </button>
              `
            )
          : html`<span class="placeholder">No camera services available</span>`}
        <button
          class="btn"
          type="button"
          @click=${() => openMoreInfo(this, cam.entityId)}
        >
          More info
        </button>
      </div>
      ${this.panelMode ? this._renderStreamGroupSettings(cam) : nothing}
      ${this.panelMode ? this._renderSensorSettings(cam) : nothing}
    `;
  }

  _renderStreamGroupSettings(cam) {
    const group = this._groupFor(cam.entityId);
    const draft = new Set(this._groupDraftMembers || [cam.entityId]);
    if (!draft.has(cam.entityId)) draft.add(cam.entityId);
    const cameras = this._cameras();
    const usedElsewhere = new Set();
    for (const g of this._streamGroups || []) {
      if (group && g.id === group.id) continue;
      for (const mid of g.members || []) usedElsewhere.add(mid);
    }
    const candidates = cameras.filter(
      (c) => c.entityId === cam.entityId || !usedElsewhere.has(c.entityId)
    );
    return html`
      <section class="sensor-settings" aria-label="Physical camera stream group">
        <div class="picker-head">
          <strong>Physical camera (stream group)</strong>
          <span class="hint">
            Combine high-res + fluent (or other) <code>camera.*</code> streams into one physical camera.
            Detection sensors are assigned once and apply to <strong>all streams in the group</strong>
            (shared for all users). Mosaic still selects which stream(s) to show live.
          </span>
        </div>
        <div class="quality-row">
          <label>
            Group name
            <input
              type="text"
              class="aspect-input"
              placeholder="Driveway"
              .value=${this._groupDraftName || ""}
              @input=${(e) => (this._groupDraftName = e.target.value)}
            />
          </label>
          <span class="hint">${group ? `Saved as ${group.id}` : "Not grouped yet"}</span>
        </div>
        <div class="sensor-candidates">
          <p class="hint">Streams in this physical camera</p>
          ${candidates.map((c) => {
            const checked = draft.has(c.entityId);
            const locked = c.entityId === cam.entityId;
            return html`
              <label class="sensor-item ${locked ? "disabled" : ""}">
                <input
                  type="checkbox"
                  .checked=${checked}
                  ?disabled=${locked || this._saving}
                  @change=${(e) =>
                    this._toggleGroupDraftMember(
                      cam.entityId,
                      c.entityId,
                      e.target.checked
                    )}
                />
                <span class="sensor-name">${c.name}</span>
                <span class="picker-id">${c.entityId}</span>
              </label>
            `;
          })}
        </div>
        <div class="sensor-tools">
          <button
            class="btn primary"
            type="button"
            ?disabled=${this._saving}
            @click=${() => this._saveGroupDraft(cam.entityId)}
          >
            ${this._saving ? "Saving…" : "Save stream group"}
          </button>
          <button
            class="btn"
            type="button"
            ?disabled=${this._saving}
            @click=${() => this._suggestGroupFromDevice(cam.entityId)}
          >
            Suggest from device
          </button>
          ${group
            ? html`
                <button
                  class="btn"
                  type="button"
                  ?disabled=${this._saving}
                  @click=${() => this._ungroupCamera(cam.entityId)}
                >
                  Ungroup
                </button>
              `
            : nothing}
        </div>
      </section>
    `;
  }

  _renderSensorSettings(cam) {
    const linkedIds = this._linksFor(cam.entityId);
    const linked = describeLinkedSensors(this.hass, linkedIds);
    const group = this._groupFor(cam.entityId);
    const suggestions = suggestDetectionSensors(this.hass, cam.entityId, {
      deviceIds: this._deviceMap,
      limit: 12,
    }).filter((s) => !linkedIds.includes(s.entityId));

    const filter = this._sensorFilter.trim().toLowerCase();
    const pickerRows = filter
      ? listLinkableSensors(this.hass)
          .filter((s) => !linkedIds.includes(s.entityId))
          .filter(
            (s) =>
              s.entityId.toLowerCase().includes(filter) ||
              s.name.toLowerCase().includes(filter) ||
              s.kind.label.toLowerCase().includes(filter)
          )
          .slice(0, 40)
      : suggestions;

    return html`
      <section class="sensor-settings" aria-label="Detection sensors">
        <div class="picker-head">
          <strong>Detection sensors</strong>
          <span class="hint">
            Link person / car / animal / package sensors for the timeline and recordings.
            Associations are <strong>shared for all Home Assistant users</strong> (site-wide).
            ${group
              ? html` Assigned once for physical camera <strong>${group.name}</strong> (${group.members.length} streams). `
              : nothing}
            Suggestions use name + device heuristics; confirm or pick manually.
          </span>
        </div>

        ${linked.length
          ? html`
              <div class="sensor-linked">
                ${linked.map(
                  (sensor) => html`
                    <label class="sensor-item">
                      <input
                        type="checkbox"
                        .checked=${true}
                        @change=${(e) =>
                          this._setSensorLinked(
                            cam.entityId,
                            sensor.entityId,
                            e.target.checked
                          )}
                      />
                      <span class="sensor-kind kind-${sensor.kind.id}">${sensor.kind.label}</span>
                      <span class="sensor-name">${sensor.name}</span>
                      <span class="sensor-state ${sensor.active ? "on" : ""}">
                        ${sensor.missing ? "missing" : sensor.state}
                      </span>
                      <span class="picker-id">${sensor.entityId}</span>
                    </label>
                  `
                )}
              </div>
            `
          : html`<p class="empty">No sensors linked to this camera yet.</p>`}

        <div class="sensor-tools">
          <button
            class="btn primary"
            type="button"
            @click=${() => this._applySuggestions(cam.entityId)}
          >
            Link suggested sensors
          </button>
          <label class="sensor-filter">
            Search sensors
            <input
              type="search"
              .value=${this._sensorFilter}
              placeholder="person, package, driveway…"
              @input=${(e) => (this._sensorFilter = e.target.value)}
            />
          </label>
        </div>

        ${pickerRows.length
          ? html`
              <div class="sensor-candidates">
                <p class="hint">
                  ${filter ? "Matching sensors" : "Suggested associations"}
                </p>
                ${pickerRows.map(
                  (sensor) => html`
                    <label class="sensor-item">
                      <input
                        type="checkbox"
                        .checked=${false}
                        @change=${(e) =>
                          this._setSensorLinked(
                            cam.entityId,
                            sensor.entityId,
                            e.target.checked
                          )}
                      />
                      <span class="sensor-kind kind-${sensor.kind.id}">${sensor.kind.label}</span>
                      <span class="sensor-name">${sensor.name}</span>
                      <span class="sensor-state ${sensor.active ? "on" : ""}">${sensor.state}</span>
                      <span class="picker-id">${sensor.entityId}</span>
                    </label>
                  `
                )}
              </div>
            `
          : filter
            ? html`<p class="empty">No sensors match “${filter}”.</p>`
            : html`
                <p class="hint">
                  No strong suggestions. Search above to link any binary_sensor/sensor
                  (${DETECTION_KINDS.map((k) => k.label).join(", ")}).
                </p>
              `}
      </section>
    `;
  }
}

if (!customElements.get("cctv-view")) {
  customElements.define("cctv-view", CctvView);
}
