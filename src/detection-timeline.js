import { LitElement, html, nothing } from "lit";
import {
  DETECTION_KINDS,
  describeLinkedSensors,
  fetchSensorHistory,
  formatClock,
  formatDuration,
  isSensorActive,
  segmentsFromHistory,
} from "./detection-sensors.js";

const WINDOW_OPTIONS = [
  { value: 15 * 60 * 1000, label: "15m" },
  { value: 60 * 60 * 1000, label: "1h" },
  { value: 6 * 60 * 60 * 1000, label: "6h" },
  { value: 24 * 60 * 60 * 1000, label: "24h" },
];

/**
 * Bottom timeline of detection sensor flags for the current camera selection.
 */
export class CctvDetectionTimeline extends LitElement {
  static properties = {
    hass: { attribute: false },
    /** @type {string[]} cameras currently on screen */
    cameras: { attribute: false },
    /** @type {Record<string, string[]>} */
    sensorLinks: { attribute: false },
    /** camera id → friendly name */
    cameraNames: { attribute: false },
    _windowMs: { state: true },
    _loading: { state: true },
    _error: { state: true },
    /** @type {Array<any>} */
    _rows: { state: true },
    _now: { state: true },
  };

  createRenderRoot() {
    // Use light DOM so shared panel styles apply without duplicating CSS.
    return this;
  }

  constructor() {
    super();
    this.cameras = [];
    this.sensorLinks = {};
    this.cameraNames = {};
    this._windowMs = 60 * 60 * 1000;
    this._loading = false;
    this._error = "";
    this._rows = [];
    this._now = Date.now();
    this._timer = null;
    this._fetchToken = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._timer = window.setInterval(() => {
      this._now = Date.now();
      this._refresh();
    }, 30_000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timer) window.clearInterval(this._timer);
  }

  updated(changed) {
    if (
      changed.has("hass") ||
      changed.has("cameras") ||
      changed.has("sensorLinks") ||
      changed.has("_windowMs")
    ) {
      this._refresh();
    }
  }

  async _refresh() {
    const entityIds = this._linkedEntityIds();
    if (!this.hass || !entityIds.length) {
      this._rows = [];
      this._error = "";
      return;
    }

    const token = ++this._fetchToken;
    this._loading = true;
    this._error = "";
    const end = Date.now();
    const start = end - this._windowMs;

    try {
      const history = await fetchSensorHistory(
        this.hass,
        entityIds,
        new Date(start),
        new Date(end)
      );
      if (token !== this._fetchToken) return;
      this._rows = this._buildRows(history, start, end);
      this._now = end;
    } catch (err) {
      if (token !== this._fetchToken) return;
      this._error = err?.message || "Could not load detection history";
      this._rows = this._buildRows({}, start, end);
    } finally {
      if (token === this._fetchToken) this._loading = false;
    }
  }

  _linkedEntityIds() {
    const ids = [];
    for (const cam of this.cameras || []) {
      for (const sensor of this.sensorLinks?.[cam] || []) ids.push(sensor);
    }
    return [...new Set(ids)];
  }

  _buildRows(history, start, end) {
    const rows = [];
    for (const cam of this.cameras || []) {
      const linked = describeLinkedSensors(this.hass, this.sensorLinks?.[cam] || []);
      for (const sensor of linked) {
        const points =
          history?.[sensor.entityId] || history?.[sensor.entityId.toLowerCase()] || [];
        let segments = segmentsFromHistory(
          points,
          start,
          end,
          (state) => isSensorActive({ state })
        );

        // Keep the trailing flag open when history says active through "now",
        // or synthesize a short live flag when recorder history is empty.
        if (sensor.active && !sensor.missing) {
          const last = segments[segments.length - 1];
          if (last && last.end >= end - 5000) {
            last.end = end;
          } else if (!points.length) {
            segments = [{ start: Math.max(start, end - 60_000), end }];
          }
        }

        rows.push({
          cameraId: cam,
          cameraName: this.cameraNames?.[cam] || cam,
          sensor,
          segments,
          totalMs: segments.reduce((sum, s) => sum + Math.max(0, s.end - s.start), 0),
        });
      }
    }
    return rows;
  }

  _setWindow(ms) {
    this._windowMs = ms;
  }

  render() {
    const linkedCount = this._linkedEntityIds().length;
    if (!(this.cameras || []).length) return nothing;

    return html`
      <section class="timeline" aria-label="Detection timeline">
        <div class="timeline-head">
          <div>
            <strong>Detection timeline</strong>
            <span class="hint">
              ${linkedCount
                ? `Flags for linked sensors on the selected cameras`
                : `Link detection sensors in a camera’s settings to see flags here`}
            </span>
          </div>
          <div class="timeline-windows">
            ${WINDOW_OPTIONS.map(
              (opt) => html`
                <button
                  type="button"
                  class="btn ${this._windowMs === opt.value ? "primary" : ""}"
                  @click=${() => this._setWindow(opt.value)}
                >
                  ${opt.label}
                </button>
              `
            )}
          </div>
        </div>

        ${this._error
          ? html`<p class="timeline-error">${this._error}</p>`
          : nothing}
        ${!linkedCount
          ? html`<p class="empty">No detection sensors linked yet.</p>`
          : this._rows.length === 0
            ? html`<p class="empty">No linked sensors for the current selection.</p>`
            : html`
                <div class="timeline-axis" aria-hidden="true">
                  <span>${formatClock(this._now - this._windowMs)}</span>
                  <span>now ${formatClock(this._now)}</span>
                </div>
                <div class="timeline-rows">
                  ${this._rows.map((row) => this._renderRow(row))}
                </div>
                ${this._loading
                  ? html`<p class="hint timeline-loading">Refreshing…</p>`
                  : nothing}
              `}
      </section>
    `;
  }

  _renderRow(row) {
    const kind =
      DETECTION_KINDS.find((k) => k.id === row.sensor.kind.id) ||
      DETECTION_KINDS[DETECTION_KINDS.length - 1];
    const start = this._now - this._windowMs;
    const span = Math.max(1, this._windowMs);

    return html`
      <div class="timeline-row">
        <div class="timeline-label">
          <span class="timeline-kind kind-${kind.id}">${kind.label}</span>
          <span class="timeline-cam">${row.cameraName}</span>
          <span class="timeline-sensor" title=${row.sensor.entityId}>${row.sensor.name}</span>
          <span class="timeline-total">
            ${row.segments.length
              ? `${row.segments.length} flag${row.segments.length === 1 ? "" : "s"} · ${formatDuration(row.totalMs)}`
              : row.sensor.active
                ? "active now"
                : "quiet"}
          </span>
        </div>
        <div class="timeline-track" role="img" aria-label="${kind.label} activity">
          ${row.segments.map((seg) => {
            const left = ((seg.start - start) / span) * 100;
            const width = Math.max(0.4, ((seg.end - seg.start) / span) * 100);
            const title = `${formatClock(seg.start)}–${formatClock(seg.end)} (${formatDuration(seg.end - seg.start)})`;
            return html`
              <span
                class="timeline-flag kind-${kind.id}"
                style="left:${left}%;width:${width}%"
                title=${title}
              ></span>
            `;
          })}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("cctv-detection-timeline")) {
  customElements.define("cctv-detection-timeline", CctvDetectionTimeline);
}
