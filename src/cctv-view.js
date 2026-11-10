import { LitElement, html, nothing } from "lit";
import { sharedStyles } from "./styles.js";
import {
  availableCameraActions,
  callCameraService,
  listCameras,
  openMoreInfo,
} from "./cameras.js";
import {
  QUALITY_OPTIONS,
  qualityHelp,
  resolveQuality,
  resolveStreamCamera,
  writeStoredQuality,
} from "./quality.js";
import { loadPanelSelection, savePanelSelection } from "./selection-store.js";
import { DEFAULT_MAX_STREAMS, streamSlots } from "./stream-slots.js";
import "./stream-player.js";

/**
 * Shared CCTV UI for the sidebar panel and Lovelace cards.
 *
 * Panel mode: pick up to 4 cameras; layout fills 1 / splits 2–4; selection
 * persists in HA user data. Card mode keeps a simple mosaic of configured cameras.
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
    _pickerOpen: { state: true },
    _selectionReady: { state: true },
    _saving: { state: true },
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
    this._pickerOpen = true;
    this._selectionReady = false;
    this._saving = false;
    this._loadedForUser = null;
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
    const stored = await loadPanelSelection(this.hass);
    const all = this._cameras().map((c) => c.entityId);
    if (stored?.length) {
      this._visibleIds = stored.filter((id) => all.includes(id)).slice(0, this._maxStreams());
      this._pickerOpen = this._visibleIds.length === 0;
    } else {
      this._visibleIds = [];
      this._pickerOpen = true;
    }
    this._selectionReady = true;
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
      await savePanelSelection(this.hass, ids);
      this._status = ids.length
        ? `${ids.length} camera${ids.length === 1 ? "" : "s"} on screen`
        : "No cameras selected";
    } catch (err) {
      this._status = err?.message || "Could not save selection";
    } finally {
      this._saving = false;
    }
  }

  _openDetail(entityId) {
    this._detailId = entityId;
  }

  _back() {
    this._detailId = null;
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

  render() {
    if (!this.hass) {
      return html`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;
    }

    void this._qualityTick;

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

        ${detail
          ? this._renderDetail(detail)
          : this.panelMode
            ? this._renderLayout(visible)
            : this._renderCardGrid(cameras)}
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
          <span class="hint">Select 1–${maxStreams}. Layout updates automatically. Saved to your HA profile.</span>
        </div>
        <div class="picker-list">
          ${cameras.map((cam) => {
            const checked = this._visibleIds.includes(cam.entityId);
            const disabled = !checked && this._visibleIds.length >= maxStreams;
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
                <span class="picker-id">${cam.entityId}</span>
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
          return html`
            <article class="tile layout-tile" role="listitem">
              <div class="tile-media">
                <cctv-stream-player
                  large
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
    `;
  }
}

if (!customElements.get("cctv-view")) {
  customElements.define("cctv-view", CctvView);
}
