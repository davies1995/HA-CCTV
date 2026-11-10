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
 * Horizontal detection timeline.
 * Lanes stay grouped by type (person/car/…); overlapping same-type sensors
 * merge into one event. Click an event for details.
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
    /** @type {any | null} */
    _selected: { state: true },
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
    this._selected = null;
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
      this._selected = null;
      this._refresh();
    }
  }

  async _refresh() {
    const entityIds = this._linkedEntityIds();
    if (!this.hass || !entityIds.length) {
      this._rows = [];
      this._error = "";
      this._selected = null;
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
      this._syncSelected();
    } catch (err) {
      if (token !== this._fetchToken) return;
      this._error = err?.message || "Could not load detection history";
      this._rows = this._buildRows({}, start, end);
      this._syncSelected();
    } finally {
      if (token === this._fetchToken) this._loading = false;
    }
  }

  _syncSelected() {
    if (!this._selected) return;
    const still = this._rows
      .flatMap((row) => row.events)
      .find((ev) => ev.id === this._selected.id);
    this._selected = still || null;
  }

  _linkedEntityIds() {
    const ids = [];
    for (const cam of this.cameras || []) {
      for (const sensor of this.sensorLinks?.[cam] || []) ids.push(sensor);
    }
    return [...new Set(ids)];
  }

  /**
   * One lane per detection type; merged events carry cameras/sensors for detail.
   */
  _buildRows(history, start, end) {
    /** @type {Map<string, { kind: { id: string, label: string }, raw: any[], active: boolean }>} */
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
          bucket = { kind, raw: [], active: false };
          byKind.set(kind.id, bucket);
        }
        for (const seg of segments) {
          bucket.raw.push({
            start: seg.start,
            end: seg.end,
            cameras: [cam],
            sensors: [{ entityId: sensor.entityId, name: sensor.name }],
          });
        }
        if (sensor.active && !sensor.missing) bucket.active = true;
      }
    }

    const kindOrder = new Map(DETECTION_KINDS.map((k, i) => [k.id, i]));
    return [...byKind.values()]
      .map((bucket) => {
        const merged = mergeOverlappingSegments(bucket.raw, 1000);
        const events = merged.map((seg, index) => {
          const cameraIds = seg.cameras || [];
          return {
            id: `${bucket.kind.id}:${seg.start}:${seg.end}:${index}`,
            kind: bucket.kind,
            start: seg.start,
            end: seg.end,
            durationMs: Math.max(0, seg.end - seg.start),
            cameras: cameraIds,
            cameraNames: cameraIds.map((id) => this.cameraNames?.[id] || id),
            sensors: seg.sensors || [],
            active: bucket.active && seg.end >= end - 5000,
          };
        });
        return {
          kind: bucket.kind,
          events,
          totalMs: events.reduce((sum, ev) => sum + ev.durationMs, 0),
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

  _selectEvent(event, ev) {
    ev?.stopPropagation?.();
    this._selected =
      this._selected?.id === event.id ? null : event;
  }

  _clearSelected() {
    this._selected = null;
  }

  _tickMarks() {
    const start = this._now - this._windowMs;
    const count = this._windowMs <= 15 * 60 * 1000 ? 4 : this._windowMs <= 60 * 60 * 1000 ? 6 : 8;
    const marks = [];
    for (let i = 0; i <= count; i += 1) {
      const t = start + (this._windowMs * i) / count;
      marks.push({ t, label: formatClock(t), pct: (i / count) * 100 });
    }
    return marks;
  }

  render() {
    const linkedCount = this._linkedEntityIds().length;
    if (!(this.cameras || []).length) return nothing;
    const rangeStart = this._now - this._windowMs;
    const span = Math.max(1, this._windowMs);
    const ticks = this._tickMarks();

    return html`
      <section class="timeline" aria-label="Detection timeline">
        <div class="timeline-head">
          <div>
            <strong>Detection timeline</strong>
            <span class="hint">
              ${linkedCount
                ? `Horizontal timeline by type — click an event for details`
                : `Link detection sensors in a camera’s settings to see events here`}
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
                <div class="timeline-board" @click=${this._clearSelected}>
                  <div class="timeline-ruler" aria-hidden="true">
                    ${ticks.map(
                      (tick) => html`
                        <span class="timeline-tick" style="left:${tick.pct}%">
                          <span class="timeline-tick-line"></span>
                          <span class="timeline-tick-label">${tick.label}</span>
                        </span>
                      `
                    )}
                  </div>
                  <div class="timeline-lanes">
                    ${this._rows.map((row) =>
                      this._renderLane(row, rangeStart, span)
                    )}
                  </div>
                </div>
                ${this._selected
                  ? this._renderDetail(this._selected)
                  : html`<p class="hint timeline-hint">Select a highlighted event on the timeline.</p>`}
                ${this._loading
                  ? html`<p class="hint timeline-loading">Refreshing…</p>`
                  : nothing}
              `}
      </section>
    `;
  }

  _renderLane(row, rangeStart, span) {
    const kind =
      DETECTION_KINDS.find((k) => k.id === row.kind.id) ||
      DETECTION_KINDS[DETECTION_KINDS.length - 1];

    return html`
      <div class="timeline-lane">
        <div class="timeline-lane-label">
          <span class="timeline-kind kind-${kind.id}">${kind.label}</span>
          <span class="timeline-total">
            ${row.events.length
              ? `${row.events.length} event${row.events.length === 1 ? "" : "s"} · ${formatDuration(row.totalMs)}`
              : row.active
                ? "active now"
                : "quiet"}
          </span>
        </div>
        <div
          class="timeline-track"
          role="listbox"
          aria-label="${kind.label} events"
        >
          ${row.events.map((event) => {
            const left = ((event.start - rangeStart) / span) * 100;
            const width = Math.max(
              0.6,
              ((event.end - event.start) / span) * 100
            );
            const selected = this._selected?.id === event.id;
            return html`
              <button
                type="button"
                class="timeline-event kind-${kind.id} ${selected ? "selected" : ""} ${event.active ? "live" : ""}"
                style="left:${left}%;width:${width}%"
                title="${kind.label}: ${formatClock(event.start)}–${formatClock(event.end)}"
                aria-pressed=${selected ? "true" : "false"}
                @click=${(ev) => this._selectEvent(event, ev)}
              >
                <span class="timeline-event-mark"></span>
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }

  _renderDetail(event) {
    const kind =
      DETECTION_KINDS.find((k) => k.id === event.kind.id) ||
      DETECTION_KINDS[DETECTION_KINDS.length - 1];
    const cams = event.cameraNames?.length
      ? event.cameraNames.join(", ")
      : "—";
    const sensors = event.sensors?.length
      ? event.sensors
      : [];

    return html`
      <aside class="timeline-detail" aria-live="polite">
        <div class="timeline-detail-head">
          <span class="timeline-kind kind-${kind.id}">${kind.label}</span>
          ${event.active
            ? html`<span class="timeline-live-badge">Live</span>`
            : nothing}
          <button class="btn" type="button" @click=${this._clearSelected}>
            Close
          </button>
        </div>
        <dl class="timeline-detail-grid">
          <dt>When</dt>
          <dd>
            ${formatClock(event.start)} – ${formatClock(event.end)}
            <span class="hint">(${new Date(event.start).toLocaleString()} → ${new Date(event.end).toLocaleString()})</span>
          </dd>
          <dt>Duration</dt>
          <dd>${formatDuration(event.durationMs)}${event.active ? " (ongoing)" : ""}</dd>
          <dt>Cameras</dt>
          <dd>${cams}</dd>
          <dt>Sensors</dt>
          <dd>
            ${sensors.length
              ? html`
                  <ul class="timeline-detail-sensors">
                    ${sensors.map(
                      (s) => html`
                        <li>
                          <strong>${s.name || s.entityId}</strong>
                          <span class="hint">${s.entityId}</span>
                        </li>
                      `
                    )}
                  </ul>
                `
              : "—"}
          </dd>
        </dl>
      </aside>
    `;
  }
}

if (!customElements.get("cctv-detection-timeline")) {
  customElements.define("cctv-detection-timeline", CctvDetectionTimeline);
}
