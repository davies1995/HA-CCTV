import { LitElement, html, nothing } from "lit";
import {
  DETECTION_KINDS,
  describeLinkedSensors,
  fetchSensorHistory,
  formatClock,
  formatDuration,
  isSensorActive,
  mergeOverlappingSegments,
  segmentsFromHistory,
} from "./detection-sensors.js";

const WINDOW_OPTIONS = [
  { value: 15 * 60 * 1000, label: "15m" },
  { value: 60 * 60 * 1000, label: "1h" },
  { value: 6 * 60 * 60 * 1000, label: "6h" },
  { value: 24 * 60 * 60 * 1000, label: "24h" },
];

/**
 * Bottom timeline of detection flags for the current camera selection.
 * Rows are grouped by detection type (person/car/…); overlapping same-type
 * sensor events collapse into one instance.
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

  /**
   * Build one row per detection type; merge overlapping same-type segments.
   */
  _buildRows(history, start, end) {
    /** @type {Map<string, { kind: { id: string, label: string }, raw: Array<{start:number,end:number}>, sensors: Set<string>, cameras: Set<string>, active: boolean }>} */
    const byKind = new Map();

    for (const cam of this.cameras || []) {
      const linked = describeLinkedSensors(this.hass, this.sensorLinks?.[cam] || []);
      for (const sensor of linked) {
        const kind = sensor.kind || { id: "other", label: "Other" };
        const points =
          history?.[sensor.entityId] || history?.[sensor.entityId.toLowerCase()] || [];
        let segments = segmentsFromHistory(
          points,
          start,
          end,
          (state) => isSensorActive({ state })
        );

        if (sensor.active && !sensor.missing) {
          const last = segments[segments.length - 1];
          if (last && last.end >= end - 5000) {
            last.end = end;
          } else if (!points.length) {
            segments = [{ start: Math.max(start, end - 60_000), end }];
          }
        }

        let bucket = byKind.get(kind.id);
        if (!bucket) {
          bucket = {
            kind,
            raw: [],
            sensors: new Set(),
            cameras: new Set(),
            active: false,
          };
          byKind.set(kind.id, bucket);
        }
        bucket.raw.push(...segments);
        bucket.sensors.add(sensor.entityId);
        bucket.cameras.add(cam);
        if (sensor.active && !sensor.missing) bucket.active = true;
      }
    }

    const kindOrder = new Map(DETECTION_KINDS.map((k, i) => [k.id, i]));
    return [...byKind.values()]
      .map((bucket) => {
        const segments = mergeOverlappingSegments(bucket.raw, 1000);
        const cameraNames = [...bucket.cameras].map(
          (id) => this.cameraNames?.[id] || id
        );
        return {
          kind: bucket.kind,
          segments,
          totalMs: segments.reduce((sum, s) => sum + Math.max(0, s.end - s.start), 0),
          sensorCount: bucket.sensors.size,
          cameraNames,
          active: bucket.active,
        };
      })
      .sort(
        (a, b) =>
          (kindOrder.get(a.kind.id) ?? 99) - (kindOrder.get(b.kind.id) ?? 99) ||
          a.kind.label.localeCompare(b.kind.label)
      );
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
                ? `Grouped by type — overlapping same-type sensors merge into one flag`
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
      DETECTION_KINDS.find((k) => k.id === row.kind.id) ||
      DETECTION_KINDS[DETECTION_KINDS.length - 1];
    const start = this._now - this._windowMs;
    const span = Math.max(1, this._windowMs);
    const cams = (row.cameraNames || []).join(", ");

    return html`
      <div class="timeline-row">
        <div class="timeline-label">
          <span class="timeline-kind kind-${kind.id}">${kind.label}</span>
          <span class="timeline-cam" title=${cams}>
            ${cams || "Selected cameras"}
          </span>
          <span class="timeline-sensor">
            ${row.sensorCount} sensor${row.sensorCount === 1 ? "" : "s"}
          </span>
          <span class="timeline-total">
            ${row.segments.length
              ? `${row.segments.length} event${row.segments.length === 1 ? "" : "s"} · ${formatDuration(row.totalMs)}`
              : row.active
                ? "active now"
                : "quiet"}
          </span>
        </div>
        <div class="timeline-track" role="img" aria-label="${kind.label} activity">
          ${row.segments.map((seg) => {
            const left = ((seg.start - start) / span) * 100;
            const width = Math.max(0.4, ((seg.end - seg.start) / span) * 100);
            const title = `${kind.label}: ${formatClock(seg.start)}–${formatClock(seg.end)} (${formatDuration(seg.end - seg.start)})`;
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
