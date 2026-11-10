import { LitElement, html, nothing } from "lit";
import { sharedStyles } from "./styles.js";
import { callCameraService, listCameras, openMoreInfo } from "./cameras.js";
import "./stream-player.js";

const ACTIONS = [
  { service: "turn_on", label: "Turn on" },
  { service: "turn_off", label: "Turn off" },
  { service: "snapshot", label: "Snapshot" },
];

/**
 * Shared CCTV grid + detail UI used by the panel and Lovelace cards.
 */
export class CctvView extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    panelMode: { type: Boolean, attribute: "panel-mode" },
    _selected: { state: true },
    _status: { state: true },
  };

  static styles = sharedStyles;

  constructor() {
    super();
    this.config = {};
    this.panelMode = false;
    this._selected = null;
    this._status = "";
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
            <span class="status">
              ${this._status ||
              `${cameras.length} camera${cameras.length === 1 ? "" : "s"} · live`}
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
        ${cameras.map(
          (cam) => html`
            <article class="tile" role="listitem">
              <div class="tile-media">
                <cctv-stream-player
                  .hass=${this.hass}
                  .camera=${cam}
                  muted
                ></cctv-stream-player>
              </div>
              <button
                type="button"
                class="tile-body tile-open"
                @click=${() => this._select(cam.entityId)}
              >
                <p class="tile-title">${cam.name}</p>
                <p class="tile-meta">
                  <span class="dot ${cam.state}"></span>${cam.state} · ${cam.entityId}
                </p>
              </button>
            </article>
          `
        )}
      </div>
    `;
  }

  _renderDetail(cam) {
    return html`
      <button class="btn linkish" type="button" @click=${this._back}>← All cameras</button>
      <h2>${cam.name}</h2>
      <div class="detail-stage">
        <cctv-stream-player
          large
          .hass=${this.hass}
          .camera=${cam}
          .muted=${false}
          controls
        ></cctv-stream-player>
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
