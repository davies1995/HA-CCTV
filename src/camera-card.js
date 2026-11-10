import { LitElement, html } from "lit";
import { sharedStyles } from "./styles.js";
import {
  availableCameraActions,
  callCameraService,
  cameraFromState,
  openMoreInfo,
} from "./cameras.js";
import {
  QUALITY_OPTIONS,
  qualityHelp,
  resolveQuality,
  resolveStreamCamera,
  writeStoredQuality,
} from "./quality.js";
import "./stream-player.js";

/**
 * Single-camera Lovelace card with live stream + available controls.
 */
class CctvCameraCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { attribute: false },
    _status: { state: true },
    _qualityTick: { state: true },
  };

  static styles = sharedStyles;

  static getStubConfig(hass) {
    const entity =
      Object.keys(hass?.states ?? {}).find((id) => id.startsWith("camera.")) ||
      "camera.demo";
    return {
      entity,
      title: "",
      muted: true,
      quality: "auto",
    };
  }

  constructor() {
    super();
    this._status = "";
    this._qualityTick = 0;
  }

  setConfig(config) {
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      throw new Error("Card configuration must be an object");
    }
    if (!config.entity || !String(config.entity).startsWith("camera.")) {
      throw new Error("cctv-camera-card requires a camera.* entity");
    }
    this._config = {
      muted: true,
      quality: "auto",
      max_streams: 4,
      ...config,
      entity: String(config.entity),
    };
  }

  getCardSize() {
    return 4;
  }

  _setQuality(quality) {
    writeStoredQuality(this._config.entity, quality);
    this._qualityTick += 1;
  }

  async _run(service) {
    this._status = `Calling ${service}…`;
    try {
      await callCameraService(this.hass, service, this._config.entity);
      this._status = `${service} ok`;
    } catch (err) {
      this._status = err?.message || String(err);
    }
  }

  render() {
    if (!this._config || !this.hass) return html``;
    void this._qualityTick;
    const stateObj = this.hass.states?.[this._config.entity];
    const camera = cameraFromState(this._config.entity, stateObj);
    const title = this._config.title || camera.name;
    const actions = availableCameraActions(this.hass, camera);
    const quality = resolveQuality(this._config, this._config.entity);
    const streamCam = resolveStreamCamera(
      this.hass,
      camera,
      this._config,
      quality,
      "detail"
    );

    return html`
      <ha-card>
        <div class="card-inner">
          <div class="top">
            <div>
              <h2>${title}</h2>
            </div>
            <span class="status">${this._status || camera.state}</span>
          </div>
          <div class="detail-stage">
            <cctv-stream-player
              large
              eager
              .hass=${this.hass}
              .camera=${camera}
              .config=${this._config}
              .quality=${quality}
              context="detail"
              .muted=${this._config.muted !== false}
              controls
            ></cctv-stream-player>
          </div>
          <div class="quality-row">
            <label>
              Stream quality
              <select
                .value=${quality}
                @change=${(e) => this._setQuality(e.target.value)}
              >
                ${QUALITY_OPTIONS.map(
                  (opt) => html`<option value=${opt.value}>${opt.label}</option>`
                )}
              </select>
            </label>
            <span class="hint">${qualityHelp(quality)} · using ${streamCam.entityId}</span>
          </div>
          <div class="actions" style="margin-top: 0.75rem">
            ${actions.map(
              (action) => html`
                <button
                  class="btn primary"
                  type="button"
                  @click=${() => this._run(action.service)}
                >
                  ${action.label}
                </button>
              `
            )}
            <button
              class="btn"
              type="button"
              @click=${() => openMoreInfo(this, this._config.entity)}
            >
              More info
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get("cctv-camera-card")) {
  customElements.define("cctv-camera-card", CctvCameraCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "cctv-camera-card")) {
  window.customCards.push({
    type: "cctv-camera-card",
    name: "CCTV Camera",
    preview: true,
    description: "Live stream for a single Home Assistant camera entity.",
    documentationURL: "https://github.com/davies1995/HA-CCTV",
  });
}

export { CctvCameraCard };
