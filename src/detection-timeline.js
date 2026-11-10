import { LitElement, html, nothing } from "lit";
import {
  DETECTION_KINDS,
  formatClock,
  formatDuration,
  mergeOverlappingSegments,
} from "./detection-sensors.js";
import { listDetections } from "./recordings-api.js";

const WINDOW_OPTIONS = [
  { value: 15 * 60 * 1000, label: "15m" },
  { value: 60 * 60 * 1000, label: "1h" },
  { value: 6 * 60 * 60 * 1000, label: "6h" },
  { value: 24 * 60 * 60 * 1000, label: "24h" },
];

/** Poll shared detection store while the CCTV panel is visible. */
const HISTORY_POLL_MS = 90_000;

/**
 * Horizontal detection timeline.
 * Reads site-wide persisted detection events (survives reboot; retention-purged).
 * Lanes stay grouped by type; overlapping same-type sensors merge into one event.
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
    /** When false, stop timers and cancel in-flight history work. */
    active: { type: Boolean },
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
    this.active = true;
    this._windowMs = 60 * 60 * 1000;
    this._loading = false;
    this._error = "";
    this._rows = [];
    this._now = Date.now();
    this._selected = null;
    this._timer = null;
    this._fetchToken = 0;
    this._quietRefreshTimer = 0;
    this._lastEntityKey = "";
    this._onVisibility = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onVisibility = () => {
      if (typeof document !== "undefined" && document.hidden) {
        this._pausePolling();
        return;
      }
      if (this.active) this._scheduleQuietRefresh();
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this._onVisibility);
    }
    if (this.active) this._startPolling();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopPolling();
    if (this._onVisibility && typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this._onVisibility);
    }
  }

  updated(changed) {
    if (changed.has("active")) {
      if (this.active) this._startPolling();
      else this._stopPolling();
    }
    if (!this.active) return;

    if (
      changed.has("cameras") ||
      changed.has("sensorLinks") ||
      changed.has("_windowMs")
    ) {
      this._selected = null;
      this._refresh({ showLoading: true });
      return;
    }
    // Avoid refetching HA history on every hass state tick.
    if (changed.has("hass")) {
      this._scheduleQuietRefresh();
    }
  }

  _startPolling() {
    this._pausePolling();
    if (!this.active) return;
    if (typeof document !== "undefined" && document.hidden) return;
    this._timer = window.setInterval(
      () => this._scheduleQuietRefresh(),
      HISTORY_POLL_MS
    );
    this._refresh({ showLoading: !this._rows.length });
  }

  _pausePolling() {
    if (this._timer) {
      window.clearInterval(this._timer);
      this._timer = null;
    }
    if (this._quietRefreshTimer) {
      window.clearTimeout(this._quietRefreshTimer);
      this._quietRefreshTimer = 0;
    }
  }

  _stopPolling() {
    this._pausePolling();
    // Invalidate in-flight history responses so they cannot apply after leave.
    this._fetchToken += 1;
    this._loading = false;
  }

  _scheduleQuietRefresh() {
    if (!this.active) return;
    if (typeof document !== "undefined" && document.hidden) return;
    if (this._quietRefreshTimer) return;
    this._quietRefreshTimer = window.setTimeout(() => {
      this._quietRefreshTimer = 0;
      this._refresh({ showLoading: false });
    }, 2500);
  }

  /**
   * @param {{ showLoading?: boolean }} [opts]
   */
  async _refresh(opts = {}) {
    if (!this.active) return;
    if (typeof document !== "undefined" && document.hidden) return;

    const showLoading = Boolean(opts.showLoading);
    const cams = [...(this.cameras || [])];
    const entityKey = `${cams.join(",")}|${this._windowMs}`;
    if (!this.hass) {
      this._rows = [];
      this._error = "";
      this._selected = null;
      this._lastEntityKey = entityKey;
      return;
    }

    const token = ++this._fetchToken;
    if (showLoading || entityKey !== this._lastEntityKey) {
      this._loading = true;
    }
    this._error = "";
    const end = Date.now();
    const start = end - this._windowMs;

    try {
      const events = await listDetections(this.hass, {
        start,
        end,
        cameras: cams.length ? cams : undefined,
        limit: 500,
      });
      if (token !== this._fetchToken || !this.active) return;
      this._lastEntityKey = entityKey;
      this._rows = this._buildRowsFromEvents(events, start, end);
      this._now = end;
      this._syncSelected();
    } catch (err) {
      if (token !== this._fetchToken || !this.active) return;
      this._error = err?.message || "Could not load saved detections";
      this._rows = this._buildRowsFromEvents([], start, end);
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

  _sensorName(entityId) {
    return (
      this.hass?.states?.[entityId]?.attributes?.friendly_name ||
      String(entityId || "").replace(/^[^.]+\./, "") ||
      entityId
    );
  }

  /**
   * Build type lanes from persisted shared detection events.
   * @param {Array<any>} events
   * @param {number} start
   * @param {number} end
   */
  _buildRowsFromEvents(events, start, end) {
    /** @type {Map<string, { kind: { id: string, label: string }, raw: any[], active: boolean }>} */
    const byKind = new Map();
    const visible = new Set(this.cameras || []);

    for (const event of events || []) {
      const kindId = event.kind || "other";
      const kindMeta =
        DETECTION_KINDS.find((k) => k.id === kindId) ||
        DETECTION_KINDS[DETECTION_KINDS.length - 1];
      const kind = {
        id: kindMeta.id,
        label: event.kind_label || kindMeta.label,
      };
      const evStart = Date.parse(event.start);
      const evEnd = event.end ? Date.parse(event.end) : end;
      if (!Number.isFinite(evStart)) continue;
      const clipStart = Math.max(start, evStart);
      const clipEnd = Math.min(end, Number.isFinite(evEnd) ? evEnd : end);
      if (clipEnd <= clipStart) continue;

      let cameras = (event.cameras || []).map(String);
      if (visible.size) {
        cameras = cameras.filter((id) => visible.has(id));
        if (!cameras.length && (event.cameras || []).length) continue;
      }

      let bucket = byKind.get(kind.id);
      if (!bucket) {
        bucket = { kind, raw: [], active: false };
        byKind.set(kind.id, bucket);
      }
      bucket.raw.push({
        start: clipStart,
        end: clipEnd,
        cameras,
        sensors: event.sensor_id
          ? [
              {
                entityId: event.sensor_id,
                name: this._sensorName(event.sensor_id),
              },
            ]
          : [],
        sourceId: event.id,
        active: Boolean(event.active || event.end == null),
      });
      if (event.active || event.end == null) bucket.active = true;
    }

    // Ensure lanes exist for kinds linked to visible cams even if quiet.
    for (const cam of this.cameras || []) {
      for (const sensorId of this.sensorLinks?.[cam] || []) {
        const stateObj = this.hass?.states?.[sensorId];
        const blob = `${sensorId} ${stateObj?.attributes?.friendly_name || ""}`.toLowerCase();
        const kindMeta =
          DETECTION_KINDS.find(
            (k) =>
              k.id !== "other" &&
              k.tokens.some((t) =>
                new RegExp(`(^|[_\\s.-])${t}([_\\s.-]|$)`, "i").test(blob)
              )
          ) || DETECTION_KINDS[DETECTION_KINDS.length - 1];
        if (!byKind.has(kindMeta.id)) {
          byKind.set(kindMeta.id, {
            kind: { id: kindMeta.id, label: kindMeta.label },
            raw: [],
            active: false,
          });
        }
      }
    }

    const kindOrder = new Map(DETECTION_KINDS.map((k, i) => [k.id, i]));
    return [...byKind.values()]
      .map((bucket) => {
        const merged = mergeOverlappingSegments(bucket.raw, 1000);
        const eventsOut = merged.map((seg, index) => {
          const cameraIds = seg.cameras || [];
          return {
            id: seg.sourceId || `${bucket.kind.id}:${seg.start}:${seg.end}:${index}`,
            kind: bucket.kind,
            start: seg.start,
            end: seg.end,
            durationMs: Math.max(0, seg.end - seg.start),
            cameras: cameraIds,
            cameraNames: cameraIds.map((id) => this.cameraNames?.[id] || id),
            sensors: seg.sensors || [],
            active: Boolean(bucket.active && seg.end >= end - 5000),
          };
        });
        return {
          kind: bucket.kind,
          events: eventsOut,
          totalMs: eventsOut.reduce((sum, ev) => sum + ev.durationMs, 0),
          active: bucket.active,
        };
      })
      .filter((row) => row.events.length || row.active || this._linkedEntityIds().length)
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

  _requestPlay(event, ev) {
    ev?.stopPropagation?.();
    this.dispatchEvent(
      new CustomEvent("cctv-play-detection", {
        detail: {
          start: event.start,
          end: event.end,
          kind: event.kind,
          sensors: event.sensors || [],
          cameras: event.cameras || [],
        },
        bubbles: true,
        composed: true,
      })
    );
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
                ? `Shared for all users — survives reboot; kept for retention days`
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
          <div class="timeline-detail-actions">
            ${event.active
              ? nothing
              : html`
                  <button
                    class="btn primary"
                    type="button"
                    @click=${(ev) => this._requestPlay(event, ev)}
                  >
                    Play
                  </button>
                `}
            <button class="btn" type="button" @click=${this._clearSelected}>
              Close
            </button>
          </div>
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
