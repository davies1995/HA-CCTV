import { LitElement, html, nothing } from "lit";
import { sharedStyles } from "./styles.js";
import {
  cameraPreviewUrl,
  callCameraService,
  listCameras,
  openMoreInfo,
} from "./cameras.js";

const ACTIONS = [
  { service: "turn_on", label: "Turn on" },
  { service: "turn_off", label: "Turn off" },
  { service: "snapshot", label: "Snapshot" },
];

/**
 * Shared CCTV grid + detail UI used by the panel and the Lovelace card.
 *
 * Properties:
 * - hass
 * - config (cameras / exclude / title / refresh_seconds)
 * - panelMode (adds full-page chrome)
 */
export class CctvView extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    panelMode: { type: Boolean, attribute: "panel-mode" },
    _selected: { state: true },
    _tick: { state: true },
    _status: { state: true },
  };

  static styles = sharedStyles;

  constructor() {
    super();
    this.config = {};
    this.panelMode = false;
    this._selected = null;
    this._tick = 0;
    this._status = "";
    this._timer = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._schedule();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timer) clearInterval(this._timer);
  }

  updated(changed) {
    if (changed.has("config") || changed.has("hass")) {
      this._schedule();
    }
  }

  get _refreshSeconds() {
    const value = Number(this.config?.refresh_seconds ?? 5);
    return Number.isFinite(value) ? Math.min(60, Math.max(1, value)) : 5;
  }

  _schedule() {
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => {
      this._tick += 1;
    }, this._refreshSeconds * 1000);
  }

  _cameras() {
    return listCameras(this.hass, this.config);
  }

  _select(entityId) {
    this._selected = entityId;
  }

  _back() {
    this._selected = null;
  }

  async _run(service, entityId) {
    this._status = `Calling ${service}…`;
    try {
      await callCameraService(this.hass, service, entityId);
      this._status = `${service} ok`;
      this._tick += 1;
    } catch (err) {
      this._status = err?.message || String(err);
    }
  }

  render() {
    if (!this.hass) {
      return html`<div class="wrap placeholder">Waiting for Home Assistant…</div>`;
    }

    const cameras = this._cameras();
    const selected = cameras.find((c) => c.entityId === this._selected) || null;
    const title = this.config?.title || "CCTV";

    return html`
      <div class=${this.panelMode ? "panel-wrap wrap" : "wrap"}>
        <div class="top">
          <div>
            ${this.panelMode ? html`<p class="eyebrow">Home Assistant</p>` : nothing}
            <h1>${title}</h1>
          </div>
          <div class="top-actions">
            <button class="btn" type="button" @click=${() => (this._tick += 1)}>Refresh</button>
            <span class="status">
              ${this._status ||
              `${cameras.length} camera${cameras.length === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>

        ${selected ? this._renderDetail(selected) : this._renderGrid(cameras)}
      </div>
    `;
  }

  _renderGrid(cameras) {
    if (!cameras.length) {
      return html`<p class="empty">No camera entities found.</p>`;
    }
    return html`
      <div class="grid" role="list">
        ${cameras.map((cam) => {
          const base = cameraPreviewUrl(this.hass, cam);
          const src = base
            ? `${base}${base.includes("?") ? "&" : "?"}k=${this._tick}`
            : "";
          return html`
            <button
              type="button"
              class="tile"
              role="listitem"
              @click=${() => this._select(cam.entityId)}
            >
              ${src
                ? html`<img alt=${cam.name} src=${src} loading="lazy" />`
                : html`<div class="placeholder tile-body">No preview</div>`}
              <div class="tile-body">
                <p class="tile-title">${cam.name}</p>
                <p class="tile-meta">
                  <span class="dot ${cam.state}"></span>${cam.state} · ${cam.entityId}
                </p>
              </div>
            </button>
          `;
        })}
      </div>
    `;
  }

  _renderDetail(cam) {
    const base = cameraPreviewUrl(this.hass, cam);
    const src = base
      ? `${base}${base.includes("?") ? "&" : "?"}k=${this._tick}`
      : "";
    return html`
      <button class="btn linkish" type="button" @click=${this._back}>← All cameras</button>
      <h2>${cam.name}</h2>
      <div class="detail-stage">
        ${src
          ? html`<img alt=${cam.name} src=${src} />`
          : html`<div class="placeholder tile-body">No preview</div>`}
      </div>
      <dl class="meta">
        <dt>Entity</dt>
        <dd>${cam.entityId}</dd>
        <dt>State</dt>
        <dd>${cam.state}</dd>
        <dt>Brand</dt>
        <dd>${cam.brand || "—"}</dd>
        <dt>Model</dt>
        <dd>${cam.model || "—"}</dd>
      </dl>
      <div class="actions">
        ${ACTIONS.map(
          (action) => html`
            <button
              class="btn primary"
              type="button"
              @click=${() => this._run(action.service, cam.entityId)}
            >
              ${action.label}
            </button>
          `
        )}
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
