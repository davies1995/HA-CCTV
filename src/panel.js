import { LitElement, html } from "lit";
import "./cctv-view.js";

/**
 * Custom panel element for panel_custom.
 * HA sets hass, narrow, route, and panel.
 *
 * Leave-page unload (in cctv-view): HA `location-changed` / `popstate` when the
 * path leaves this panel, plus `document.hidden` (tab hide) and
 * `disconnectedCallback` (HA removes non-cached custom panels on sidebar leave).
 * No IntersectionObserver — that remounted streams while watching.
 */
class CctvDashboardPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    route: { attribute: false },
    panel: { attribute: false },
  };

  constructor() {
    super();
    /** @type {Record<string, unknown> | null} */
    this._stableConfig = null;
    /** @type {Record<string, unknown> | null} */
    this._stablePanelConfigRef = null;
  }

  createRenderRoot() {
    // Light DOM so HA theme CSS variables apply predictably in the panel shell.
    return this;
  }

  get _config() {
    const fromPanel = this.panel?.config || {};
    // Reuse the same object while HA keeps the same panel.config reference so
    // cctv-view / stream-player do not see a fresh `.config` every hass tick.
    if (fromPanel === this._stablePanelConfigRef && this._stableConfig) {
      return this._stableConfig;
    }
    this._stablePanelConfigRef = fromPanel;
    // Strip HA-injected bookkeeping key.
    const { _panel_custom, ...rest } = fromPanel;
    this._stableConfig = {
      title: "CCTV",
      max_streams: 4,
      quality: "auto",
      ...rest,
    };
    return this._stableConfig;
  }

  connectedCallback() {
    super.connectedCallback();
    // Let the panel fill HA's content pane so desktop mosaic can size to the viewport.
    this.style.display = "block";
    this.style.height = "100%";
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Belt-and-suspenders: force child view to unload if still present.
    const view = this.querySelector?.("cctv-view");
    if (view) {
      try {
        view._setPanelActive?.(false);
      } catch {
        /* ignore */
      }
    }
  }

  render() {
    return html`
      <cctv-view
        .hass=${this.hass}
        .config=${this._config}
        .panelUrlPath=${this.panel?.url_path || "cctv"}
        panel-mode
      ></cctv-view>
    `;
  }
}

if (!customElements.get("cctv-dashboard-panel")) {
  customElements.define("cctv-dashboard-panel", CctvDashboardPanel);
}

export { CctvDashboardPanel };
