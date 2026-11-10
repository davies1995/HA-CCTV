import { LitElement, html } from "lit";
import "./cctv-view.js";

/**
 * Custom panel element for panel_custom.
 * HA sets hass, narrow, route, and panel.
 */
class CctvDashboardPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    route: { attribute: false },
    panel: { attribute: false },
  };

  createRenderRoot() {
    // Light DOM so HA theme CSS variables apply predictably in the panel shell.
    return this;
  }

  get _config() {
    const fromPanel = this.panel?.config || {};
    // Strip HA-injected bookkeeping key.
    const { _panel_custom, ...rest } = fromPanel;
    return {
      title: "CCTV",
      ...rest,
    };
  }

  render() {
    return html`
      <cctv-view
        .hass=${this.hass}
        .config=${this._config}
        panel-mode
      ></cctv-view>
    `;
  }
}

if (!customElements.get("cctv-dashboard-panel")) {
  customElements.define("cctv-dashboard-panel", CctvDashboardPanel);
}

export { CctvDashboardPanel };
