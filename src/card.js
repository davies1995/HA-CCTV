import { LitElement, html } from "lit";
import { sharedStyles } from "./styles.js";
import "./cctv-view.js";

class CctvCamerasCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { attribute: false },
  };

  static styles = sharedStyles;

  static getConfigElement() {
    return null;
  }

  static getStubConfig(hass) {
    const cameras = Object.keys(hass?.states ?? {})
      .filter((id) => id.startsWith("camera."))
      .slice(0, 4);
    return {
      title: "CCTV",
      max_streams: 4,
      quality: "auto",
      ...(cameras.length ? { cameras } : {}),
    };
  }

  setConfig(config) {
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      throw new Error("Card configuration must be an object");
    }
    this._config = {
      title: "CCTV",
      max_streams: 4,
      quality: "auto",
      ...config,
    };
  }

  getCardSize() {
    const count = this._config?.cameras?.length;
    if (count) return Math.max(3, Math.ceil(count / 2) * 2);
    return 6;
  }

  render() {
    if (!this._config) return html``;
    return html`
      <ha-card>
        <div class="card-inner">
          <cctv-view .hass=${this.hass} .config=${this._config}></cctv-view>
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get("cctv-cameras-card")) {
  customElements.define("cctv-cameras-card", CctvCamerasCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "cctv-cameras-card")) {
  window.customCards.push({
    type: "cctv-cameras-card",
    name: "CCTV Cameras",
    preview: true,
    description:
      "Live stream grid of Home Assistant camera entities with detail view and basic controls.",
    documentationURL: "https://github.com/davies1995/HA-CCTV",
  });
}

export { CctvCamerasCard };
