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
  deleteRecording,
  listRecordings,
  loadSharedConfig,
  recordingMediaUrl,
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
    /** @type {Map<string, string>} */
    this._deviceMap = new Map();
  }

  updated(changed) {
    if (this.panelMode && (changed.has("hass") || changed.has("panelMode"))) {
      this._ensureSelectionLoaded();
    }
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
      this._status = "Recording deleted";
    } catch (err) {
      this._status = err?.message || "Could not delete recording";
    }
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

        ${detail
          ? this._renderDetail(detail)
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
              ></cctv-detection-timeline>
              ${this._renderRecordings()}
            `
          : nothing}
      </div>
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
      <section class="recordings" aria-label="Detection recordings">
        <div class="timeline-head">
          <div>
            <strong>Saved detections</strong>
            <span class="hint">
              Kept for ${this._retentionDays} day${this._retentionDays === 1 ? "" : "s"}, then deleted.
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
    const started = session.started
      ? new Date(session.started).toLocaleString()
      : "—";
    const ended = session.active
      ? "recording…"
      : session.ended
        ? new Date(session.ended).toLocaleString()
        : "—";
    const clips = session.clips || [];
    return html`
      <article class="recording-item ${session.active ? "active" : ""}">
        <div class="recording-meta">
          <strong>${session.active ? "Live session" : "Session"} ${session.session_id}</strong>
          <span class="hint">${started} → ${ended} · ${session.mode || "record"} · ${clips.length} clip${clips.length === 1 ? "" : "s"}</span>
          <span class="hint">Triggers: ${(session.trigger_sensors || []).join(", ") || "—"}</span>
        </div>
        <div class="recording-clips">
          ${clips.slice(0, 12).map((clip) => {
            const href = recordingMediaUrl(this.hass, clip.url);
            return html`
              <a class="recording-clip" href=${href} target="_blank" rel="noopener">
                ${clip.kind === "snapshot" ? "JPG" : "MP4"} · ${(clip.camera_id || "").replace("camera.", "")}
              </a>
            `;
          })}
          ${clips.length > 12
            ? html`<span class="hint">+${clips.length - 12} more</span>`
            : nothing}
        </div>
        ${session.active
          ? nothing
          : html`
              <button
                class="btn"
                type="button"
                @click=${() => this._deleteSession(session.session_id)}
              >
                Delete
              </button>
            `}
      </article>
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

    const count = Math.min(cameras.length, 4);
    return html`
      <div class="layout layout-${count}" role="list">
        ${cameras.slice(0, 4).map((cam) => {
          const quality = resolveQuality(this.config, cam.entityId);
          const linked = this._linksFor(cam.entityId).length;
          return html`
            <article class="tile layout-tile" role="listitem">
              <div class="tile-media">
                <cctv-stream-player
                  large
                  mosaic
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
                class="tile-body tile-open"
                @click=${() => this._openDetail(cam.entityId)}
              >
                <p class="tile-title">${cam.name}</p>
                <p class="tile-meta">
                  <span class="dot ${cam.state}"></span>${cam.state} · ${quality}
                  ${linked
                    ? html` · ${linked} detection`
                    : nothing}
                </p>
              </button>
            </article>
          `;
        })}
      </div>
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
