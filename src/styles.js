import { css } from "lit";

export const sharedStyles = css`
  :host {
    display: block;
    color: var(--primary-text-color, #e8eef5);
    font-family: var(--ha-font-family-body, "Segoe UI", "Helvetica Neue", sans-serif);
    --cctv-accent: var(--primary-color, #3d9cf0);
    --cctv-border: var(--divider-color, #2a3542);
    --cctv-muted: var(--secondary-text-color, #8b9aab);
    --cctv-surface: var(--card-background-color, #1a222c);
    --cctv-ok: var(--success-color, #3ecf8e);
    --cctv-bad: var(--error-color, #e35d6a);
  }

  /* Desktop panel: fill HA content area so the mosaic can use remaining height. */
  @media (min-width: 801px) {
    :host([panel-mode]) {
      height: calc(100dvh - var(--app-header-height, 56px));
      max-height: calc(100dvh - var(--app-header-height, 56px));
      overflow: hidden;
    }

    /* TV mode: page scrolls; full-width 16:9 mosaic above the fold. */
    :host([panel-mode][tv-mode]) {
      height: auto;
      max-height: none;
      min-height: calc(100dvh - var(--app-header-height, 56px));
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .wrap {
    padding: 1rem 1.25rem 1.5rem;
  }

  .panel-wrap {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 80% 50% at 10% -10%, rgba(61, 156, 240, 0.18) 0%, transparent 55%),
      var(--primary-background-color, #0f1419);
  }

  @media (min-width: 801px) {
    .panel-wrap {
      box-sizing: border-box;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 0.75rem;
    }

    .panel-wrap > .top,
    .panel-wrap > .picker,
    .panel-wrap > .settings-panel,
    .panel-wrap > .empty,
    .panel-wrap > .placeholder {
      flex: 0 0 auto;
    }

    .panel-wrap > .layout {
      flex: 1 1 auto;
      min-height: 0;
      height: auto;
      max-height: none;
    }

    .panel-wrap > cctv-detection-timeline,
    .panel-wrap > .recordings {
      flex: 0 1 auto;
      max-height: 24vh;
      overflow: auto;
      margin-top: 0.75rem;
      min-height: 0;
    }

    .panel-wrap > cctv-detection-timeline .timeline {
      margin-top: 0;
    }

    /* TV / kiosk: full-width 16:9 mosaic stage; rest scrolls. */
    .panel-wrap.tv-mode {
      height: auto;
      max-height: none;
      min-height: 0;
      overflow: visible;
      display: flex;
      flex-direction: column;
      padding-top: 0.5rem;
      padding-bottom: 1.25rem;
    }

    .panel-wrap.tv-mode > .top.top-tv {
      margin-bottom: 0.45rem;
    }

    .panel-wrap.tv-mode > .top.top-tv h1 {
      font-size: 1.15rem;
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .panel-wrap.tv-mode .tv-badge {
      display: inline-block;
      font-size: 0.65rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.12rem 0.4rem;
      border-radius: 4px;
      border: 1px solid var(--cctv-border);
      color: var(--cctv-muted);
      font-weight: 600;
    }

    .panel-wrap.tv-mode > .layout.layout-pack-tv {
      flex: 0 0 auto;
      /* 16:9 stage sized to full content width — do not height-limit / shrink width. */
      width: var(--cctv-tv-stage-w, 100%);
      height: var(--cctv-tv-stage-h, auto);
      max-width: 100%;
      aspect-ratio: 16 / 9;
      margin: var(--cctv-tv-stage-offset, 0) auto 0;
      align-self: center;
      box-sizing: border-box;
    }

    .panel-wrap.tv-mode > cctv-detection-timeline,
    .panel-wrap.tv-mode > .recordings {
      flex: 0 0 auto;
      max-height: none;
      overflow: visible;
      margin-top: 1rem;
    }
  }

  .top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .eyebrow {
    margin: 0;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cctv-muted);
  }

  h1,
  h2 {
    margin: 0.15rem 0 0;
    font-weight: 650;
    letter-spacing: -0.02em;
  }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .status {
    font-size: 0.85rem;
    color: var(--cctv-muted);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.85rem;
  }

  .tile {
    border: 1px solid var(--cctv-border);
    background: var(--cctv-surface);
    border-radius: 10px;
    overflow: hidden;
    padding: 0;
    color: inherit;
  }

  .tile:hover,
  .tile:focus-within {
    border-color: var(--cctv-accent);
  }

  .tile-open {
    appearance: none;
    border: 0;
    background: transparent;
    width: 100%;
    cursor: pointer;
    text-align: left;
    color: inherit;
    font: inherit;
    padding: 0;
  }

  .tile-open:focus-visible {
    outline: 2px solid var(--cctv-accent);
    outline-offset: -2px;
  }

  .tile-media {
    display: block;
    width: 100%;
  }

  .tile cctv-stream-player,
  .detail-stage cctv-stream-player {
    width: 100%;
  }

  .tile-body {
    padding: 0.7rem 0.85rem 0.85rem;
  }

  .tile-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .tile-meta {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    color: var(--cctv-muted);
  }

  .dot {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    margin-right: 0.35rem;
    background: var(--cctv-muted);
  }

  .dot.on,
  .dot.idle,
  .dot.streaming,
  .dot.recording {
    background: var(--cctv-ok);
  }

  .dot.off,
  .dot.unavailable,
  .dot.unknown {
    background: var(--cctv-bad);
  }

  .btn {
    appearance: none;
    border: 1px solid var(--cctv-border);
    background: var(--cctv-surface);
    color: inherit;
    border-radius: 8px;
    padding: 0.45rem 0.85rem;
    font: inherit;
    cursor: pointer;
  }

  .btn:hover,
  .btn:focus-visible {
    border-color: var(--cctv-accent);
    outline: none;
  }

  .btn.primary {
    border-color: var(--cctv-accent);
  }

  .btn.linkish {
    border: none;
    background: transparent;
    color: var(--cctv-accent);
    padding-left: 0;
    margin-bottom: 0.75rem;
  }

  .empty,
  .placeholder {
    color: var(--cctv-muted);
  }

  .detail-stage {
    margin-top: 0.75rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    overflow: hidden;
    max-width: 960px;
    background: #0a0e13;
  }

  .detail-stage img {
    min-height: 200px;
    object-fit: contain;
  }

  .meta {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.35rem 1rem;
    margin: 1rem 0;
    max-width: 960px;
  }

  .meta dt {
    color: var(--cctv-muted);
  }

  .meta dd {
    margin: 0;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .quality-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1rem;
    margin: 0.85rem 0 0.25rem;
    max-width: 960px;
  }

  .quality-row label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .quality-row select,
  .quality-row .aspect-input {
    font: inherit;
    color: inherit;
    background: var(--cctv-surface);
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    padding: 0.35rem 0.55rem;
  }

  .quality-row .aspect-input {
    min-width: 8.5rem;
    max-width: 12rem;
  }

  .prefs-save-row {
    margin-top: 0.35rem;
  }

  .hint {
    font-size: 0.8rem;
    color: var(--cctv-muted);
  }

  .picker {
    margin: 0 0 1rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
  }

  .picker-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.85rem;
    align-items: baseline;
    margin-bottom: 0.75rem;
  }

  .picker-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.45rem 0.75rem;
  }

  .picker-item {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 0.55rem;
    align-items: center;
    padding: 0.35rem 0.45rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .picker-item input {
    grid-row: 1 / span 2;
  }

  .picker-item.disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .picker-name {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .picker-id {
    font-size: 0.75rem;
    color: var(--cctv-muted);
  }

  .layout {
    display: grid;
    gap: 0.75rem;
    width: 100%;
    min-height: min(70vh, 720px);
  }

  .layout-1 {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  .layout-2 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }

  .layout-3 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .layout-3 .layout-tile:nth-child(3) {
    grid-column: 1 / -1;
  }

  .layout-4 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .layout-tile {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .layout-tile .tile-media {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    background: #0a0e13;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
  }

  .layout-tile cctv-stream-player {
    height: 100%;
    min-height: 0;
    aspect-ratio: auto;
  }

  @media (max-width: 800px) {
    .layout-tile cctv-stream-player {
      min-height: 160px;
    }
  }

  /* Live + playback: fit entire frame inside the tile (letterbox), never crop. */
  .layout-tile .playback-media,
  .layout-tile .tile-media > img.playback-media,
  .layout-tile .tile-media > video.playback-media {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    background: #0a0e13;
  }

  .layout-tile .tile-media > cctv-stream-player {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 0;
    align-self: stretch;
  }

  /*
   * Trigger-cam highlight during detection playback: overlay inside .tile-media
   * so we never rewrite the tile class/style (that broke src/controls/play).
   * pointer-events:none keeps native <video controls> clickable.
   */
  .layout-tile .trigger-cam-overlay {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: 3px solid var(--cctv-trigger-color, var(--cctv-accent));
    pointer-events: none;
    z-index: 2;
  }

  .layout-tile .trigger-cam-overlay.kind-person {
    --cctv-trigger-color: #5eb1ff;
  }
  .layout-tile .trigger-cam-overlay.kind-car {
    --cctv-trigger-color: #f0b45a;
  }
  .layout-tile .trigger-cam-overlay.kind-animal {
    --cctv-trigger-color: #7dcf8a;
  }
  .layout-tile .trigger-cam-overlay.kind-package {
    --cctv-trigger-color: #c9a0ff;
  }
  .layout-tile .trigger-cam-overlay.kind-bicycle {
    --cctv-trigger-color: #67d5c8;
  }
  .layout-tile .trigger-cam-overlay.kind-motion {
    --cctv-trigger-color: #e6d36a;
  }
  .layout-tile .trigger-cam-overlay.kind-other {
    --cctv-trigger-color: #8b9aab;
  }

  .layout-1 .layout-tile cctv-stream-player {
    min-height: min(65vh, 640px);
  }

  /* Desktop: aspect-aware packed mosaic fills remaining viewport (no cam-to-cam scroll). */
  @media (min-width: 801px) {
    .panel-wrap .layout {
      min-height: 0;
    }

    .panel-wrap .layout-pack {
      position: relative;
      display: block;
      width: 100%;
      flex: 1 1 auto;
      min-height: 0;
    }

    .panel-wrap .layout-pack .pack-tile {
      position: absolute;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      overflow: hidden;
    }

    .panel-wrap .layout-pack .tile-media {
      flex: 1 1 auto;
      min-height: 0;
      height: 100%;
      /* Keep letterboxing visible when cam aspect ≠ packed cell. */
      background: #0a0e13;
    }

    .panel-wrap .layout-pack .pack-caption {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      padding: 0.45rem 0.65rem 0.5rem;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
    }

    .panel-wrap .layout-pack .pack-caption .tile-meta {
      color: rgba(232, 238, 245, 0.82);
    }

    .panel-wrap .layout-pack cctv-stream-player {
      min-height: 0;
      height: 100%;
    }

    /* 1–2 cameras in TV mode: keep captions thinner so tiles use more of the stage. */
    .panel-wrap.tv-mode .layout-pack-maximize .pack-caption {
      padding: 0.3rem 0.55rem 0.35rem;
    }
  }

  /* Mobile: keep the previous stacked mosaic (unchanged from pre-fit behavior). */
  @media (max-width: 800px) {
    .layout-2,
    .layout-3,
    .layout-4 {
      grid-template-columns: 1fr;
      grid-template-rows: none;
      min-height: 0;
    }

    .layout-3 .layout-tile:nth-child(3) {
      grid-column: auto;
    }
  }

  .sensor-settings {
    margin: 1.25rem 0 0;
    padding: 0.85rem 1rem 1rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
    max-width: 960px;
  }

  .sensor-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    align-items: flex-end;
    margin: 0.85rem 0;
  }

  .sensor-filter {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: var(--cctv-muted);
    flex: 1 1 220px;
  }

  .sensor-filter input {
    font: inherit;
    color: inherit;
    background: var(--primary-background-color, #0f1419);
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    padding: 0.4rem 0.55rem;
  }

  .sensor-linked,
  .sensor-candidates {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .sensor-item {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    grid-template-rows: auto auto;
    column-gap: 0.55rem;
    row-gap: 0.1rem;
    align-items: center;
    padding: 0.4rem 0.45rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .sensor-item:hover {
    background: rgba(61, 156, 240, 0.08);
  }

  .sensor-item input {
    grid-row: 1 / span 2;
  }

  .sensor-kind {
    grid-row: 1;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--cctv-accent);
  }

  .sensor-name {
    grid-column: 3;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .sensor-state {
    grid-column: 4;
    grid-row: 1 / span 2;
    font-size: 0.75rem;
    color: var(--cctv-muted);
  }

  .sensor-state.on {
    color: var(--cctv-ok);
  }

  .sensor-item .picker-id {
    grid-column: 3;
  }

  .kind-person { color: #5eb1ff; }
  .kind-car { color: #f0b45a; }
  .kind-animal { color: #7dcf8a; }
  .kind-package { color: #c9a0ff; }
  .kind-bicycle { color: #67d5c8; }
  .kind-motion { color: #e6d36a; }
  .kind-other { color: var(--cctv-muted); }

  .timeline {
    margin: 1.25rem 0 0;
    padding: 0.85rem 1rem 1rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
  }

  .timeline-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .timeline-windows {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .timeline-kind {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .timeline-total {
    font-size: 0.72rem;
    color: var(--cctv-muted);
  }

  .timeline-board {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.35rem 0 0.15rem;
  }

  .timeline-ruler {
    position: relative;
    height: 1.35rem;
    margin-left: min(28%, 9.5rem);
  }

  .timeline-tick {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }

  .timeline-tick-line {
    width: 1px;
    height: 0.45rem;
    background: rgba(255, 255, 255, 0.18);
  }

  .timeline-tick-label {
    font-size: 0.68rem;
    color: var(--cctv-muted);
    white-space: nowrap;
  }

  .timeline-lanes {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .timeline-lane {
    display: grid;
    grid-template-columns: minmax(5.5rem, 28%) 1fr;
    gap: 0.65rem;
    align-items: center;
  }

  .timeline-lane-label {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .timeline-track {
    position: relative;
    height: 1.55rem;
    border-radius: 8px;
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.04),
        rgba(255, 255, 255, 0.02)
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0,
        rgba(255, 255, 255, 0.05) 1px,
        transparent 1px,
        transparent 12.5%
      ),
      rgba(0, 0, 0, 0.28);
    overflow: hidden;
  }

  .timeline-event {
    appearance: none;
    position: absolute;
    top: 3px;
    bottom: 3px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 5px;
    background: transparent;
    cursor: pointer;
    min-width: 4px;
  }

  .timeline-event-mark {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: var(--cctv-accent);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
    opacity: 0.92;
  }

  .timeline-event.kind-person .timeline-event-mark { background: #5eb1ff; }
  .timeline-event.kind-car .timeline-event-mark { background: #f0b45a; }
  .timeline-event.kind-animal .timeline-event-mark { background: #7dcf8a; }
  .timeline-event.kind-package .timeline-event-mark { background: #c9a0ff; }
  .timeline-event.kind-bicycle .timeline-event-mark { background: #67d5c8; }
  .timeline-event.kind-motion .timeline-event-mark { background: #e6d36a; }
  .timeline-event.kind-other .timeline-event-mark { background: #8b9aab; }

  .timeline-event:hover .timeline-event-mark,
  .timeline-event:focus-visible .timeline-event-mark {
    outline: 2px solid #fff;
    outline-offset: 1px;
    opacity: 1;
  }

  .timeline-event.selected .timeline-event-mark {
    outline: 2px solid #fff;
    outline-offset: 1px;
    filter: brightness(1.15);
  }

  .timeline-event.live .timeline-event-mark {
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .timeline-hint,
  .timeline-loading {
    margin: 0.55rem 0 0;
  }

  .timeline-detail {
    margin-top: 0.75rem;
    padding: 0.75rem 0.85rem;
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.22);
  }

  .timeline-detail-head {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    align-items: center;
    margin-bottom: 0.55rem;
  }

  .timeline-detail-actions {
    margin-left: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .timeline-live-badge {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--cctv-ok);
  }

  .timeline-detail-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.35rem 0.85rem;
    margin: 0;
  }

  .timeline-detail-grid dt {
    color: var(--cctv-muted);
    font-size: 0.8rem;
  }

  .timeline-detail-grid dd {
    margin: 0;
    font-size: 0.9rem;
  }

  .timeline-detail-sensors {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .timeline-detail-sensors li {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
  }

  .timeline-error {
    color: var(--cctv-bad);
    font-size: 0.85rem;
  }

  .settings-panel,
  .recordings {
    margin: 1.25rem 0 0;
    padding: 0.85rem 1rem 1rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
  }

  .settings-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem 1.25rem;
    align-items: flex-end;
    margin: 0.75rem 0;
  }

  .settings-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: var(--cctv-muted);
  }

  .settings-field input[type="number"] {
    width: 6rem;
    font: inherit;
    color: inherit;
    background: var(--primary-background-color, #0f1419);
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    padding: 0.4rem 0.55rem;
  }

  .settings-toggle {
    min-width: 220px;
  }

  .kind-filter {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin: 0.35rem 0 0.75rem;
  }

  .kind-filter-title {
    font-size: 0.92rem;
  }

  .kind-filter-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.85rem;
  }

  .kind-filter-item {
    min-width: 7.5rem;
  }

  .settings-panel code {
    font-size: 0.8em;
  }

  .recording-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-items: center;
    justify-content: flex-end;
  }

  .recording-list {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .recording-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.35rem 0.55rem;
    align-items: center;
    width: 100%;
    padding: 0.35rem 0.45rem 0.35rem 0.35rem;
    border: 1px solid var(--cctv-border);
    border-radius: 8px;
    background: transparent;
  }

  .recording-item:hover,
  .recording-item:focus-within {
    border-color: var(--cctv-accent);
  }

  .recording-item.active {
    border-color: var(--cctv-accent);
  }

  .recording-item.selected {
    border-color: var(--cctv-accent);
    background: rgba(61, 156, 240, 0.08);
  }

  .recording-select {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.35rem 0.85rem;
    align-items: center;
    width: 100%;
    min-width: 0;
    text-align: left;
    font: inherit;
    color: inherit;
    cursor: pointer;
    padding: 0.35rem 0.4rem;
    border: 0;
    border-radius: 6px;
    background: transparent;
  }

  .recording-select:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .recording-select:focus-visible {
    outline: 2px solid var(--cctv-accent);
    outline-offset: 1px;
  }

  .recording-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    align-items: center;
    justify-content: flex-end;
  }

  .recording-play {
    flex: 0 0 auto;
  }

  .recording-delete {
    flex: 0 0 auto;
    color: var(--cctv-bad);
    border-color: color-mix(in srgb, var(--cctv-bad) 45%, var(--cctv-border));
  }

  .recording-meta {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .recording-when {
    font-size: 0.92rem;
    font-weight: 600;
  }

  .recording-detected {
    font-size: 0.82rem;
    color: var(--cctv-muted);
  }

  .recording-size {
    font-size: 0.8rem;
    color: var(--cctv-muted);
    white-space: nowrap;
  }

  .playback-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem 0.85rem;
    align-items: center;
    margin: 0 0 0.75rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid var(--cctv-border);
    border-radius: 10px;
    background: var(--cctv-surface);
  }

  .playback-bar-meta {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
    flex: 1 1 180px;
  }

  .playback-bar-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .playback-media {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    background: #0a0e13;
    display: block;
  }

  .playback-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 120px;
    color: var(--cctv-muted);
    font-size: 0.85rem;
  }

  @media (max-width: 800px) {
    .timeline-ruler {
      margin-left: 0;
      height: 1.5rem;
    }

    .timeline-lane {
      grid-template-columns: 1fr;
      gap: 0.3rem;
    }

    .recording-item {
      grid-template-columns: 1fr auto;
    }
  }

  ha-card {
    overflow: hidden;
  }

  .card-inner {
    padding: 0.25rem 0.25rem 0.75rem;
  }
`;
