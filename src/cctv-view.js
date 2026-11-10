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
  qualityHelp,
  resolveQuality,
  resolveStreamCamera,
  writeStoredQuality,
} from "./quality.js";
import {
  detectionLabelsFromTriggers,
  findSessionForTimelineEvent,
  formatBytes,
  playbackTracksFromSession,
  sessionTotalBytes,
} from "./detection-playback.js";
import {
  cellsToPercentStyles,
  DEFAULT_ASPECT,
  normalizeAspect,
  packAspectMosaic,
} from "./mosaic-pack.js";
import {
  deleteRecording,
  listRecordings,
  loadSharedConfig,
  saveRecordingSettings,
  saveSensorLinks,
} from "./recordings-api.js";
import { loadPanelData, savePanelSelection } from "./selection-store.js";
import { DEFAULT_MAX_STREAMS, streamSlots } from "./stream-slots.js";
import "./stream-player.js";
import "./detection-timeline.js";

/**
 * Shared CCTV UI for the sidebar panel and Lovelace cards.
 *
 * Panel mode: pick up to 4 cameras; layout fills 1 / splits 2–4.
 * Visible-camera selection is per-user. Detection sensor links and recording
 * settings are site-wide in the integration store (all HA users share them).
 */
export class CctvView extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    panelMode: { type: Boolean, attribute: "panel-mode" },
    _detailId: { state: true },
    _status: { state: true },
    _qualityTick: { state: true },
    /** @type {string[]} */
    _visibleIds: { state: true },
    /** @type {Record<string, string[]>} */
    _sensorLinks: { state: true },
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
    /** @type {{ session: any, labels: string[], playing: boolean, tracks: any[] } | null} */
    _playback: { state: true },
  };

  static styles = sharedStyles;

  constructor() {
    super();
    this.config = {};
    this.panelMode = false;
    this._detailId = null;
    this._status = "";
    this._qualityTick = 0;
    this._visibleIds = [];
    this._sensorLinks = {};
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
    /** @type {Map<string, string>} */
    this._deviceMap = new Map();
    this._packObserver = null;
    this._mq = null;
    this._onMq = null;
    this._packRaf = 0;
    /** @type {Map<string, number>} */
    this._playbackIndex = new Map();
  }

  connectedCallback() {
    super.connectedCallback();
    if (typeof window !== "undefined" && window.matchMedia) {
      this._mq = window.matchMedia("(min-width: 801px)");
      this._onMq = () => {
        this._isDesktop = this._mq.matches;
        this._schedulePack();
      };
      this._isDesktop = this._mq.matches;
      if (this._mq.addEventListener) this._mq.addEventListener("change", this._onMq);
      else this._mq.addListener(this._onMq);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._mq && this._onMq) {
      if (this._mq.removeEventListener) this._mq.removeEventListener("change", this._onMq);
      else this._mq.removeListener(this._onMq);
    }
    if (this._packObserver) {
      this._packObserver.disconnect();
      this._packObserver = null;
    }
    if (this._packRaf) cancelAnimationFrame(this._packRaf);
  }

  updated(changed) {
    if (this.panelMode && (changed.has("hass") || changed.has("panelMode"))) {
      this._ensureSelectionLoaded();
    }
    if (
      this.panelMode &&
      (changed.has("_visibleIds") ||
        changed.has("_isDesktop") ||
        changed.has("_detailId") ||
        changed.has("_pickerOpen") ||
        changed.has("_settingsOpen") ||
        changed.has("_aspectById") ||
        changed.has("_playback"))
    ) {
      this._schedulePack();
    }
    this.updateComplete.then(() => this._bindPackObserver());
  }

  _bindPackObserver() {
    const el = this.renderRoot?.querySelector?.(".layout-pack");
    if (!el) {
      if (this._packObserver) {
        this._packObserver.disconnect();
        this._packObserver = null;
      }
      return;
    }
    if (this._packObserver) this._packObserver.disconnect();
    if (typeof ResizeObserver === "undefined") {
      this._recomputePack();
      return;
    }
    this._packObserver = new ResizeObserver(() => this._schedulePack());
    this._packObserver.observe(el);
    this._recomputePack();
  }

  _schedulePack() {
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

    let items;
    if (this._playback?.playing) {
      items = (this._playback.tracks || []).map((track) => ({
        id: track.cameraId,
        aspect: normalizeAspect(this._aspectById[track.cameraId] || DEFAULT_ASPECT),
      }));
    } else {
      const cameras = this._visibleCameras(this._cameras()).slice(0, 4);
      items = cameras.map((cam) => ({
        id: cam.entityId,
        aspect: normalizeAspect(this._aspectById[cam.entityId] || DEFAULT_ASPECT),
      }));
    }
    const cells = packAspectMosaic(items, boxW, boxH, 10);
    this._packStyles = cellsToPercentStyles(cells, boxW, boxH);
  }

  _onMediaAspect(event) {
    const entityId = event?.detail?.entityId;
    const aspect = normalizeAspect(event?.detail?.aspect);
    if (!entityId) return;
    if (Math.abs((this._aspectById[entityId] || 0) - aspect) < 0.01) return;
    this._aspectById = { ...this._aspectById, [entityId]: aspect };
  }

  async _ensureSelectionLoaded() {
    const userId = this.hass?.user?.id || "default";
    if (!this.hass || this._loadedForUser === userId) return;
    this._loadedForUser = userId;
    this._selectionReady = false;

    const [userData, shared] = await Promise.all([
      loadPanelData(this.hass),
      loadSharedConfig(this.hass),
    ]);

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
    } else if (this.config?.retention_days) {
      this._retentionDays = Number(this.config.retention_days) || 1;
      this._recordOnDetection = this.config.record_on_detection !== false;
    }

    this._selectionReady = true;
    this._loadDeviceMap();
    this._sessions = await listRecordings(this.hass);
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
    } else if (this.config?.retention_days) {
      this._retentionDays = Number(this.config.retention_days) || 1;
      this._recordOnDetection = this.config.record_on_detection !== false;
    }
    this._sessions = await listRecordings(this.hass);
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
  }

  _back() {
    this._detailId = null;
    this._sensorFilter = "";
  }

  _setQuality(entityId, quality) {
    writeStoredQuality(entityId, quality);
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

  async _deleteSession(sessionId) {
    try {
      await deleteRecording(this.hass, sessionId);
      this._sessions = await listRecordings(this.hass);
      if (this._playback?.session?.session_id === sessionId) {
        this._stopPlayback();
      }
      this._status = "Recording deleted";
    } catch (err) {
      this._status = err?.message || "Could not delete recording";
    }
  }

  _selectPlaybackSession(session) {
    if (!session || session.active || !(session.clips || []).length) {
      this._status = "No playable recording for that detection";
      return;
    }
    const labels = detectionLabelsFromTriggers(
      this.hass,
      session.trigger_sensors || []
    );
    const tracks = playbackTracksFromSession(this.hass, session);
    if (!tracks.length) {
      this._status = "Recording has no clips yet";
      return;
    }
    this._detailId = null;
    this._playbackIndex = new Map(tracks.map((t) => [t.cameraId, 0]));
    this._playback = {
      session,
      labels,
      playing: false,
      tracks,
    };
    this._status = `Selected ${labels.join(", ")} recording — press Play`;
    this._schedulePack();
  }

  _onPlayDetection(event) {
    const detail = event?.detail;
    const session = findSessionForTimelineEvent(this._sessions || [], detail);
    if (!session) {
      this._status = "No saved recording overlaps that timeline event";
      return;
    }
    this._selectPlaybackSession(session);
  }

  _startPlayback() {
    if (!this._playback?.tracks?.length) return;
    this._playback = { ...this._playback, playing: true };
    this._status = `Playing ${this._playback.labels.join(", ")}`;
    this.updateComplete.then(() => this._kickPlaybackVideos());
  }

  _stopPlayback() {
    this._playback = null;
    this._playbackIndex = new Map();
    this._status = "Live mosaic";
    this._schedulePack();
  }

  _pausePlaybackToLive() {
    if (!this._playback) return;
    this._playback = { ...this._playback, playing: false };
    this._status = "Stopped — back to live mosaic";
    this._schedulePack();
  }

  _kickPlaybackVideos() {
    const root = this.renderRoot;
    if (!root) return;
    root.querySelectorAll("video.playback-media").forEach((video) => {
      try {
        video.currentTime = 0;
        video.play?.().catch(() => undefined);
      } catch {
        /* ignore */
      }
    });
  }

  _onPlaybackEnded(cameraId) {
    if (!this._playback?.playing) return;
    const track = this._playback.tracks.find((t) => t.cameraId === cameraId);
    if (!track) return;
    const idx = this._playbackIndex.get(cameraId) || 0;
    if (idx + 1 < track.items.length) {
      this._playbackIndex.set(cameraId, idx + 1);
      this._playback = { ...this._playback };
      this.updateComplete.then(() => {
        const safeId = String(cameraId).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        const video = this.renderRoot?.querySelector?.(
          `video.playback-media[data-camera="${safeId}"]`
        );
        video?.play?.().catch(() => undefined);
      });
      return;
    }
    // Finished this camera's playlist — if all video cams are done, return to live.
    this._playbackIndex.set(cameraId, track.items.length);
    const allDone = this._playback.tracks.every((t) => {
      if (t.items.every((item) => item.kind === "snapshot")) return true;
      const i = this._playbackIndex.get(t.cameraId) || 0;
      return i >= t.items.length;
    });
    if (allDone) this._pausePlaybackToLive();
  }

  _currentPlaybackItem(track) {
    const idx = Math.min(
      this._playbackIndex.get(track.cameraId) || 0,
      Math.max(0, track.items.length - 1)
    );
    return track.items[idx] || null;
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

    const detail = cameras.find((c) => c.entityId === this._detailId) || null;
    const visible = this.panelMode
      ? this._visibleCameras(cameras)
      : cameras;

    const cameraNames = Object.fromEntries(
      cameras.map((c) => [c.entityId, c.name])
    );

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
                ? `${visible.length}/${maxStreams} selected · ${streamSlots.activeCount()} live`
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
          ? this._renderDetail(detail)
          : this.panelMode && this._playback?.playing
            ? this._renderPlaybackLayout()
            : this.panelMode
              ? this._renderLayout(visible)
              : this._renderCardGrid(cameras)}

        ${this.panelMode && !detail
          ? html`
              <cctv-detection-timeline
                .hass=${this.hass}
                .cameras=${visible.map((c) => c.entityId)}
                .sensorLinks=${this._sensorLinks}
                .cameraNames=${cameraNames}
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

  _renderPlaybackLayout() {
    const tracks = this._playback?.tracks || [];
    if (!tracks.length) {
      return html`<p class="empty">No clips in this recording.</p>`;
    }

    if (!this._isDesktop) {
      return html`
        <div class="layout layout-${Math.min(tracks.length, 4)}" role="list">
          ${tracks.slice(0, 4).map((track) => this._renderPlaybackTile(track, false))}
        </div>
      `;
    }

    return html`
      <div class="layout layout-pack" role="list">
        ${tracks.map((track) => this._renderPlaybackTile(track, true))}
      </div>
    `;
  }

  _renderPlaybackTile(track, packed) {
    const item = this._currentPlaybackItem(track);
    const packStyle = packed ? this._packStyles?.[track.cameraId] : "";
    const positioned = Boolean(packed && packStyle);
    return html`
      <article
        class="tile layout-tile ${positioned ? "pack-tile" : ""}"
        role="listitem"
        style=${positioned ? packStyle : nothing}
      >
        <div class="tile-media">
          ${!item
            ? html`<div class="playback-empty">No clip</div>`
            : item.kind === "snapshot"
              ? html`<img class="playback-media" alt="" src=${item.url} />`
              : html`
                  <video
                    class="playback-media"
                    data-camera=${track.cameraId}
                    src=${item.url}
                    autoplay
                    playsinline
                    muted
                    controls
                    @ended=${() => this._onPlaybackEnded(track.cameraId)}
                  ></video>
                `}
        </div>
        <div class="tile-body pack-caption">
          <p class="tile-title">${track.name}</p>
          <p class="tile-meta">Playback</p>
        </div>
      </article>
    `;
  }

  _renderSettings() {
    return html`
      <section class="settings-panel" aria-label="CCTV settings">
        <div class="picker-head">
          <strong>Detection recordings</strong>
          <span class="hint">
            When any site-wide linked detection sensor triggers, HA starts saving
            clips for <em>all</em> available cameras until sensors clear.
            Uses <code>camera.record</code> (30s chunks + lookback) with snapshot fallback.
            Sensor links are shared for every HA user; your mosaic selection stays personal.
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
    return html`
      <section class="recordings" aria-label="Saved detections">
        <div class="timeline-head">
          <div>
            <strong>Saved detections</strong>
            <span class="hint">
              Time, what was detected, and file size. Click to load Play.
              Kept for ${this._retentionDays} day${this._retentionDays === 1 ? "" : "s"}.
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
                ${sessions.map((session) => this._renderSession(session))}
              </div>
            `}
      </section>
    `;
  }

  _renderSession(session) {
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
    return html`
      <button
        type="button"
        class="recording-item ${session.active ? "active" : ""} ${selected ? "selected" : ""}"
        ?disabled=${session.active || !(session.clips || []).length}
        @click=${() => this._selectPlaybackSession(session)}
      >
        <div class="recording-meta">
          <span class="recording-when">${when}${session.active ? " · recording…" : ""}</span>
          <span class="recording-detected">${labels.join(", ")}</span>
        </div>
        <span class="recording-size">${size}</span>
      </button>
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

  _renderLayout(cameras) {
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
          ${list.map((cam) => this._renderLayoutTile(cam, false))}
        </div>
      `;
    }

    return html`
      <div
        class="layout layout-pack"
        role="list"
        @cctv-media-aspect=${this._onMediaAspect}
      >
        ${list.map((cam) => this._renderLayoutTile(cam, true))}
      </div>
    `;
  }

  _renderLayoutTile(cam, packed) {
    const quality = resolveQuality(this.config, cam.entityId);
    const linked = this._linksFor(cam.entityId).length;
    const packStyle = packed ? this._packStyles?.[cam.entityId] : "";
    const positioned = Boolean(packed && packStyle);
    return html`
      <article
        class="tile layout-tile ${positioned ? "pack-tile" : ""}"
        role="listitem"
        style=${positioned ? packStyle : nothing}
      >
        <div class="tile-media">
          <cctv-stream-player
            large
            ?mosaic=${packed}
            eager
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
          class="tile-body tile-open ${packed ? "pack-caption" : ""}"
          @click=${() => this._openDetail(cam.entityId)}
        >
          <p class="tile-title">${cam.name}</p>
          <p class="tile-meta">
            <span class="dot ${cam.state}"></span>${cam.state} · ${quality}
            ${linked ? html` · ${linked} detection` : nothing}
          </p>
        </button>
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
          const quality = resolveQuality(this.config, cam.entityId);
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

  _renderDetail(cam) {
    const actions = availableCameraActions(this.hass, cam);
    const quality = resolveQuality(this.config, cam.entityId);
    const streamCam = resolveStreamCamera(
      this.hass,
      cam,
      this.config,
      quality,
      "detail"
    );
    return html`
      <button class="btn linkish" type="button" @click=${this._back}>
        ← ${this.panelMode ? "Back to layout" : "All cameras"}
      </button>
      <h2>${cam.name}</h2>
      <div class="detail-stage">
        <cctv-stream-player
          large
          eager
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
