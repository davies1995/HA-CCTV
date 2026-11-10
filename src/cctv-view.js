import { LitElement, html, nothing } from "lit";
import { sharedStyles } from "./styles.js";
import {
  availableCameraActions,
  callCameraService,
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
  playbackTracksFromSession,
  playbackWindow,
  sessionTotalBytes,
} from "./detection-playback.js";
import {
  cellsToPercentStyles,
  DEFAULT_ASPECT,
  FORCE_ASPECT_OPTIONS,
  forceAspectRatio,
  forceAspectSelectValue,
  isPresetForceAspect,
  normalizeAspect,
  normalizeForceAspectLabel,
  normalizeForceAspectMap,
  packAspectMosaic,
} from "./mosaic-pack.js";
import {
  deleteRecording,
  listRecordings,
  loadSharedConfig,
  saveCameraPrefs,
  saveRecordingSettings,
  saveSensorLinks,
  signPlaybackTracks,
  signRecordingUrl,
} from "./recordings-api.js";
import { loadPanelData, savePanelSelection } from "./selection-store.js";
import { DEFAULT_MAX_STREAMS, streamSlots } from "./stream-slots.js";
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
    /** @type {Array<any>} */
    _sessions: { state: true },
    _recordDir: { state: true },
    _isDesktop: { state: true },
    /** @type {Record<string, number>} */
    _aspectById: { state: true },
    /** @type {Record<string, string>} */
    _packStyles: { state: true },
    /** @type {{ session: any, labels: string[], playing: boolean, tracks: any[], windowStart: number, windowEnd: number } | null} */
    _playback: { state: true },
    /**
     * Panel/resources active. HA may keep the panel mounted for minutes after
     * navigate-away (suspendWhenHidden); we flip this false immediately.
     */
    _panelActive: { state: true },
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
    this._sessions = [];
    this._recordDir = "";
    this._loadedForUser = null;
    this._isDesktop = false;
    this._aspectById = {};
    this._packStyles = {};
    this._playback = null;
    this._panelActive = true;
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
    if (typeof window !== "undefined" && window.matchMedia) {
      this._mq = window.matchMedia("(min-width: 801px)");
      this._onMq = () => {
        if (!this._panelActive) return;
        this._isDesktop = this._mq.matches;
        this._schedulePack();
      };
      this._isDesktop = this._mq.matches;
      if (this._mq.addEventListener) this._mq.addEventListener("change", this._onMq);
      else this._mq.addListener(this._onMq);
    }
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._panelActive) {
      this._panelActive = false;
      this._suspendResources();
    }
    this._unbindPanelVisibility();
    if (this._mq && this._onMq) {
      if (this._mq.removeEventListener) this._mq.removeEventListener("change", this._onMq);
      else this._mq.removeListener(this._onMq);
    }
    this._tearDownObservers();
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
    this._teardownPlaybackMedia();
    this._playback = null;
    this._playbackIndex = new Map();
    this._playbackSeek = new Map();
    this._playbackDone = new Map();
    this._tearDownObservers();
    // Stop media before Lit removes the nodes (HA may keep this panel mounted).
    this._unloadStreamPlayers();
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
        changed.has("_panelActive"))
    ) {
      this._schedulePack();
      this.updateComplete.then(() => this._bindPackObserver());
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
    const el = this.renderRoot?.querySelector?.(".layout-pack");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const boxW = Math.max(0, rect.width);
    const boxH = Math.max(0, rect.height);
    if (boxW < 8 || boxH < 8) return;

    // Always pack the same visible mosaic cameras (live or playback).
    const cameras = this._visibleCameras(this._cameras()).slice(0, 4);
    const items = cameras.map((cam) => ({
      id: cam.entityId,
      aspect: this._effectiveAspect(cam.entityId),
    }));
    const cells = packAspectMosaic(items, boxW, boxH, 10);
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
    const forced = forceAspectRatio(this._forceAspect?.[entityId]);
    if (forced) return normalizeAspect(forced);
    return normalizeAspect(this._aspectById[entityId] || DEFAULT_ASPECT);
  }

  /**
   * @param {string} entityId
   */
  _forceAspectLabel(entityId) {
    return normalizeForceAspectLabel(this._forceAspect?.[entityId]);
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

    this._sensorLinks = links;
    if (shared) {
      this._retentionDays = Number(shared.retention_days) || 1;
      this._recordOnDetection = shared.record_on_detection !== false;
      this._recordDir = shared.record_dir || "";
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
      this._recordDir = settings.record_dir || "";
      if (settings.sensorLinks) this._sensorLinks = settings.sensorLinks;
      // Don't clobber unsaved quality/aspect drafts while editing.
      if (!this._prefsDirty) this._applySharedCameraPrefs(settings);
    } else if (this.config?.retention_days) {
      this._retentionDays = Number(this.config.retention_days) || 1;
      this._recordOnDetection = this.config.record_on_detection !== false;
    }
    this._sessions = await listRecordings(this.hass);
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
    this._customAspectDraft = "";
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
   * @param {string} entityId
   */
  _qualityFor(entityId) {
    return resolveQuality(
      this.config,
      entityId,
      this.panelMode ? this._cameraQuality : null
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

  _linksFor(cameraId) {
    return this._sensorLinks?.[cameraId] || [];
  }

  async _toggleVisible(entityId, checked) {
    const max = this._maxStreams();
    let next = [...this._visibleIds];
    if (checked) {
      if (next.includes(entityId)) return;
      if (next.length >= max) {
        this._status = `Select at most ${max} cameras`;
        return;
      }
      next.push(entityId);
    } else {
      next = next.filter((id) => id !== entityId);
    }
    this._visibleIds = next;
    if (this._detailId && !next.includes(this._detailId)) {
      this._detailId = null;
    }
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
    this._sensorLinks = next;
    try {
      const saved = await saveSensorLinks(this.hass, next);
      if (saved?.sensor_links) {
        this._sensorLinks = saved.sensor_links;
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
   * @param {string} cameraId
   * @param {string} label
   */
  _setForceAspect(cameraId, label) {
    if (label === "custom") {
      const existing = this._forceAspect?.[cameraId] || "";
      this._customAspectDraft =
        existing && !isPresetForceAspect(existing) ? existing : "1920:2560";
      const normalized = normalizeForceAspectLabel(this._customAspectDraft);
      const next = { ...this._forceAspect };
      if (normalized === "auto") delete next[cameraId];
      else next[cameraId] = normalized;
      this._forceAspect = next;
      this._syncPrefsDirty();
      this._schedulePack();
      return;
    }
    const normalized = normalizeForceAspectLabel(label);
    const next = { ...this._forceAspect };
    if (normalized === "auto") delete next[cameraId];
    else next[cameraId] = normalized;
    this._forceAspect = next;
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
    const next = { ...this._forceAspect };
    if (normalized === "auto") delete next[cameraId];
    else next[cameraId] = normalized;
    this._forceAspect = next;
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
    const current = new Set(this._linksFor(cameraId));
    if (linked) current.add(sensorId);
    else current.delete(sensorId);
    const next = {
      ...this._sensorLinks,
      [cameraId]: [...current],
    };
    if (!next[cameraId].length) delete next[cameraId];
    await this._persistSensorLinks(next);
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
    const next = {
      ...this._sensorLinks,
      [cameraId]: [
        ...new Set([
          ...this._linksFor(cameraId),
          ...suggestions.map((s) => s.entityId),
        ]),
      ].slice(0, 16),
    };
    await this._persistSensorLinks(next);
    this._status = `Linked ${suggestions.length} suggested sensor${suggestions.length === 1 ? "" : "s"} (all users)`;
  }

  _openDetail(entityId) {
    this._detailId = entityId;
    this._sensorFilter = "";
    const current = this._forceAspect?.[entityId];
    this._customAspectDraft =
      current && !isPresetForceAspect(current) ? current : "";
  }

  _back() {
    this._detailId = null;
    this._sensorFilter = "";
    this._customAspectDraft = "";
  }

  /**
   * Quality change: panel drafts into shared map (Save required); cards use
   * browser localStorage.
   * @param {string} entityId
   * @param {string} quality
   */
  _setQuality(entityId, quality) {
    if (!this.panelMode) {
      writeStoredQuality(entityId, quality);
      this._qualityTick += 1;
      return;
    }
    const value = String(quality || "auto").toLowerCase();
    const next = { ...this._cameraQuality };
    if (!value || value === "auto") delete next[entityId];
    else next[entityId] = value;
    this._cameraQuality = normalizeCameraQualityMap(next);
    this._syncPrefsDirty();
    this._qualityTick += 1;
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

  async _refreshSessions() {
    this._sessions = await listRecordings(this.hass);
    this._status = "Recordings refreshed";
  }

  _isAdmin() {
    return Boolean(this.hass?.user?.is_admin);
  }

  async _deleteSession(sessionId, event) {
    event?.stopPropagation?.();
    event?.preventDefault?.();
    if (!this._isAdmin()) {
      this._status = "Only Home Assistant admins can delete saved detections";
      return;
    }
    if (
      typeof window !== "undefined" &&
      !window.confirm("Delete this saved detection’s recordings for all users?")
    ) {
      return;
    }
    try {
      const ok = await deleteRecording(this.hass, sessionId);
      this._sessions = await listRecordings(this.hass);
      if (this._playback?.session?.session_id === sessionId) {
        this._stopPlayback();
      }
      this._status = ok
        ? "Saved detection deleted for all users"
        : "Recording was already removed";
    } catch (err) {
      this._status = err?.message || "Could not delete recording";
    }
  }

  /**
   * @param {any} session
   * @param {{ start?: number, end?: number } | null} [event]
   */
  async _selectPlaybackSession(session, event = null) {
    if (!session || session.active || !(session.clips || []).length) {
      this._status = "No playable recording for that detection";
      return;
    }
    const visibleIds = this._visibleIds.slice(0, this._maxStreams());
    if (!visibleIds.length) {
      this._status = "Select cameras in the mosaic before playing a detection";
      return;
    }
    const labels = detectionLabelsFromTriggers(
      this.hass,
      session.trigger_sensors || []
    );
    // Only the user's currently visible mosaic cameras — same order/slots as live.
    const tracks = playbackTracksFromSession(this.hass, session, visibleIds);
    const playable = tracks.some((t) =>
      (t.items || []).some((item) => item.kind === "video" || item.kind === "snapshot")
    );
    if (!playable) {
      this._status = "No clips for the currently selected mosaic cameras";
      return;
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
      playing: false,
      tracks,
      windowStart: window.start,
      windowEnd: window.end,
      eventDetail: event,
    };
    this._status = `Selected ${labels.join(", ")} — Play replaces live mosaic for ${visibleIds.length} cam${visibleIds.length === 1 ? "" : "s"}`;
    this._schedulePack();
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
    // Unload live streams by swapping mosaic media to recordings (same tiles).
    this._playback = { ...this._playback, playing: true };
    this._status = `Playing ${this._playback.labels.join(", ")} (synced)`;
    await this.updateComplete;
    // Wait a frame so <video> nodes exist after the live→playback swap.
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await this._kickPlaybackVideos();
  }

  _stopPlayback() {
    this._teardownPlaybackMedia();
    this._playback = null;
    this._playbackIndex = new Map();
    this._playbackSeek = new Map();
    this._playbackDone = new Map();
    this._status = "Live mosaic";
    this._schedulePack();
  }

  _pausePlaybackToLive() {
    if (!this._playback) return;
    this._teardownPlaybackMedia();
    this._playback = { ...this._playback, playing: false };
    this._status = "Stopped — back to live mosaic";
    this._schedulePack();
  }

  _teardownPlaybackMedia() {
    const root = this.renderRoot;
    if (!root) return;
    root.querySelectorAll("video.playback-media").forEach((video) => {
      try {
        video.pause?.();
        video.removeAttribute("src");
        video.load?.();
      } catch {
        /* ignore */
      }
    });
  }

  async _kickPlaybackVideos() {
    const root = this.renderRoot;
    if (!root || !this._playback?.playing) return;
    const videos = [...root.querySelectorAll("video.playback-media")];
    if (!videos.length) {
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
    const seek = this._playbackSeek.get(cameraId) || 0;

    // Autoplay policies require muted + playsInline; set properties not just attrs.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";

    const playNow = async () => {
      try {
        if (seek > 0) {
          try {
            video.currentTime = seek;
          } catch {
            /* seek may fail on some containers */
          }
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
    if (!this._playback?.playing) return;
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
      item.url = await signRecordingUrl(this.hass, item.path || item.url);
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
    if (allDone) this._pausePlaybackToLive();
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
      ? this._visibleCameras(cameras)
      : cameras;

    const cameraNames = this._stableCameraNames(cameras);
    const playing = Boolean(this._playback?.playing);
    const streamsActive = this._panelActive;

    return html`
      <div class=${this.panelMode ? "panel-wrap wrap" : "wrap"}>
        <div class="top">
          <div>
            ${this.panelMode ? html`<p class="eyebrow">Home Assistant</p>` : nothing}
            <h1>${title}</h1>
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
                ? `${visible.length}/${maxStreams} selected · ${playing ? "playback" : `${streamSlots.activeCount()} live`}`
                : `${cameras.length} camera${cameras.length === 1 ? "" : "s"} · ${streamSlots.activeCount()}/${maxStreams} live`)}
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
    return html`
      <div class="playback-bar" role="region" aria-label="Detection playback">
        <div class="playback-bar-meta">
          <strong>${pb.labels.join(", ")}</strong>
          <span class="hint">${when} · ${formatBytes(sessionTotalBytes(pb.session))}</span>
        </div>
        <div class="playback-bar-actions">
          ${pb.playing
            ? html`
                <button class="btn primary" type="button" @click=${this._pausePlaybackToLive}>
                  Stop
                </button>
              `
            : html`
                <button class="btn primary" type="button" @click=${this._startPlayback}>
                  Play
                </button>
              `}
          <button class="btn" type="button" @click=${this._stopPlayback}>
            Back to live
          </button>
        </div>
      </div>
    `;
  }

  _renderSettings() {
    return html`
      <section class="settings-panel" aria-label="CCTV settings">
        <div class="picker-head">
          <strong>Detection recordings</strong>
          <span class="hint">
            When any site-wide linked detection sensor triggers, HA logs the event for
            the shared timeline and (if enabled) saves clips for <em>all</em> available
            cameras until sensors clear. Timeline + saved detections survive reboot and
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
        </div>
        <p class="hint">
          Storage: ${this._recordDir || "HA media / www /cctv_dashboard/recordings"}.
          Multi-cam continuous video needs a writable media folder and cameras that support streaming;
          otherwise snapshots are saved instead. Also configurable under
          Settings → Devices &amp; services → CCTV Dashboard → Configure.
        </p>
      </section>
    `;
  }

  _renderRecordings() {
    const sessions = this._sessions || [];
    const admin = this._isAdmin();
    return html`
      <section class="recordings" aria-label="Saved detections">
        <div class="timeline-head">
          <div>
            <strong>Saved detections</strong>
            <span class="hint">
              Time, what was detected, and file size. Click to load Play.
              Shared for all users; survives reboot; kept for ${this._retentionDays} day${this._retentionDays === 1 ? "" : "s"}.
              ${admin
                ? " Admins can delete a detection’s file set for everyone."
                : ""}
            </span>
          </div>
          <button class="btn" type="button" @click=${() => this._refreshSessions()}>
            Refresh
          </button>
        </div>
        ${!sessions.length
          ? html`<p class="empty">No detection recordings yet.</p>`
          : html`
              <div class="recording-list">
                ${sessions.map((session) => this._renderSession(session, admin))}
              </div>
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
    const canPlay = !session.active && (session.clips || []).length;
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
        ${admin && !session.active
          ? html`
              <button
                type="button"
                class="btn recording-delete"
                title="Delete recordings for all users"
                @click=${(e) => this._deleteSession(session.session_id, e)}
              >
                Delete
              </button>
            `
          : nothing}
      </div>
    `;
  }

  _renderPicker(cameras, maxStreams) {
    if (!cameras.length) {
      return html`<p class="empty">No camera entities found.</p>`;
    }
    return html`
      <section class="picker" aria-label="Camera selection">
        <div class="picker-head">
          <strong>Visible streams</strong>
          <span class="hint">Select 1–${maxStreams}. Layout updates automatically. Saved to your HA profile (per user).</span>
        </div>
        <div class="picker-list">
          ${cameras.map((cam) => {
            const checked = this._visibleIds.includes(cam.entityId);
            const disabled = !checked && this._visibleIds.length >= maxStreams;
            const linked = this._linksFor(cam.entityId).length;
            return html`
              <label class="picker-item ${disabled ? "disabled" : ""}">
                <input
                  type="checkbox"
                  .checked=${checked}
                  ?disabled=${disabled}
                  @change=${(e) =>
                    this._toggleVisible(cam.entityId, e.target.checked)}
                />
                <span class="picker-name">${cam.name}</span>
                <span class="picker-id">
                  ${cam.entityId}${linked ? ` · ${linked} sensor${linked === 1 ? "" : "s"}` : ""}
                </span>
              </label>
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

    return html`
      <div
        class="layout layout-pack"
        role="list"
        @cctv-media-aspect=${this._onMediaAspect}
      >
        ${list.map((cam) => this._renderLayoutTile(cam, true, streamsActive))}
      </div>
    `;
  }

  _renderLayoutTile(cam, packed, streamsActive = true) {
    const quality = this._qualityFor(cam.entityId);
    const linked = this._linksFor(cam.entityId).length;
    const packStyle = packed ? this._packStyles?.[cam.entityId] : "";
    const positioned = Boolean(packed && packStyle);
    const playing = Boolean(this._playback?.playing);
    const track = playing ? this._trackForCamera(cam.entityId) : null;
    const item = track ? this._currentPlaybackItem(track) : null;
    const forceLabel = this._forceAspectLabel(cam.entityId);
    const forcedRatio = forceAspectRatio(forceLabel);
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
                ? html`<img
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
                : html`
                    <video
                      class="playback-media"
                      data-camera=${cam.entityId}
                      src=${item.url}
                      autoplay
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
            : html`
                <cctv-stream-player
                  large
                  mosaic
                  eager
                  .active=${streamsActive}
                  .hass=${this.hass}
                  .camera=${cam}
                  .config=${this.config}
                  .quality=${quality}
                  context="mosaic"
                  muted
                ></cctv-stream-player>
              `}
        </div>
        ${playing
          ? html`
              <div class="tile-body ${packed ? "pack-caption" : ""}">
                <p class="tile-title">${cam.name}</p>
                <p class="tile-meta">Playback</p>
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
    const forceSelect = forceAspectSelectValue(this._forceAspect?.[cam.entityId]);
    const showCustomAspect =
      this.panelMode &&
      (forceSelect === "custom" || Boolean(this._customAspectDraft));
    const customAspectValue =
      this._customAspectDraft ||
      (forceSelect === "custom"
        ? this._forceAspectLabel(cam.entityId)
        : "");
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
          context="detail"
          .muted=${false}
          controls
        ></cctv-stream-player>
      </div>
      <div class="quality-row">
        <label>
          Stream quality
          <select
            .value=${quality}
            @change=${(e) => this._setQuality(cam.entityId, e.target.value)}
          >
            ${QUALITY_OPTIONS.map(
              (opt) => html`<option value=${opt.value}>${opt.label}</option>`
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
                  .value=${forceSelect}
                  @change=${(e) =>
                    this._setForceAspect(cam.entityId, e.target.value)}
                >
                  ${FORCE_ASPECT_OPTIONS.map(
                    (opt) =>
                      html`<option value=${opt.value}>${opt.label}</option>`
                  )}
                </select>
              </label>
              <span class="hint">
                Shared for all users after Save. Use 1920×2560 / 3:4 for
                portrait doorbells when auto fit fails.
              </span>
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
      ${this.panelMode ? this._renderSensorSettings(cam) : nothing}
    `;
  }

  _renderSensorSettings(cam) {
    const linkedIds = this._linksFor(cam.entityId);
    const linked = describeLinkedSensors(this.hass, linkedIds);
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
