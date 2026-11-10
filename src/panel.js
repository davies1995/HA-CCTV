import { LitElement, html } from "lit";
import "./cctv-view.js";

/**
 * Custom panel element for panel_custom.
 * HA sets hass, narrow, route, and panel.
 *
 * Note: Home Assistant's partial-panel-resolver may keep this element mounted
 * for ~5 minutes after navigate-away (suspendWhenHidden). cctv-view watches
 * intersection + document visibility and fully unloads streams/timers while
 * the panel is off-screen so HA is not kept busy in the background.
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
      max_streams: 4,
      quality: "auto",
      ...rest,
    };
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
        panel-mode
      ></cctv-view>
    `;
  }
}

if (!customElements.get("cctv-dashboard-panel")) {
  customElements.define("cctv-dashboard-panel", CctvDashboardPanel);
}

export { CctvDashboardPanel };
