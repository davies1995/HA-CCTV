# HA-CCTV

Home Assistant **CCTV dashboard** as a frontend custom panel + Lovelace cards. It discovers existing `camera.*` entities and shows **live stream tiles** (WebRTC / HLS / MJPEG, with still fallback), with a **max of 4 concurrent live streams**, per-camera quality options, and basic controls.

This is **not** a Supervisor add-on. Cameras must already exist in Home Assistant (Frigate, go2rtc, ONVIF, generic IP camera, etc.).

## Features

- Auto-discover all `camera.*` entities (optional include/exclude lists)
- **Live stream tiles** (not stills-only)
- **Lazy + capped streaming** — off-screen tiles stay on stills; at most **4** live streams at once (configurable via `max_streams`)
- **Per-camera quality** — Auto / High / Balanced / Low (substream entity when available)
- Controls from registered safe `camera` services + more-info
- Shared HACS bundle registers:
  - **Panel:** `cctv-dashboard-panel` (sidebar; all users)
  - **Grid card:** `custom:cctv-cameras-card`
  - **Single card:** `custom:cctv-camera-card`

## Install with HACS (recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed.
2. HACS → **Frontend** (Dashboard) → ⋮ → **Custom repositories**.
3. Repository: `https://github.com/davies1995/HA-CCTV`  
   Category: **Lovelace** (Dashboard).
4. Find **CCTV Dashboard** → **Download**.
5. Reload the browser (or clear frontend cache).

HACS installs `cctv-dashboard.js` and adds it as a dashboard resource. Prefer installing from a **GitHub release** (versioned). Publishing a release runs the workflow that builds and attaches `dist/cctv-dashboard.js`.

Minimum Home Assistant: **2024.11.0** (WebRTC camera APIs). Declared in `hacs.json`.

### Add the grid card

```yaml
type: custom:cctv-cameras-card
title: CCTV
max_streams: 4
quality: auto
# cameras:
#   - camera.front_door
# exclude:
#   - camera.ignored
# camera_settings:
#   camera.front_door:
#     quality: high
#     low_entity: camera.front_door_sub
```

### Add the single camera card

```yaml
type: custom:cctv-camera-card
entity: camera.front_door
title: Front door
quality: auto
muted: true
# low_entity can also be set under camera_settings in a shared config shape
```

### Sidebar custom panel (all users)

**HACS alone never creates a sidebar item.** After HACS installs the module, you must register the panel in `configuration.yaml` and restart Home Assistant.

```yaml
panel_custom:
  - name: cctv-dashboard-panel
    url_path: cctv
    sidebar_title: CCTV
    sidebar_icon: mdi:cctv
    require_admin: false
    module_url: /hacsfiles/HA-CCTV/cctv-dashboard.js
    config:
      title: CCTV
      max_streams: 4
      quality: auto
      # camera_settings:
      #   camera.driveway:
      #     quality: low
      #     low_entity: camera.driveway_sub
```

#### Sidebar checklist

1. HACS shows **CCTV Dashboard** downloaded (prefer latest release, e.g. `v0.1.1`).
2. **Settings → Dashboards → Resources** lists a JavaScript module for this repo (copy that URL).
3. `configuration.yaml` contains the `panel_custom` block above.
4. `module_url` **exactly matches** the HACS resource path (often `/hacsfiles/HA-CCTV/cctv-dashboard.js` or `/local/community/HA-CCTV/cctv-dashboard.js` — use whatever Resources shows).
5. Restart Home Assistant Core (YAML change), then hard-reload the browser.
6. Look for **CCTV** in the sidebar (not only a Lovelace card).

`require_admin` stays **false** so every user sees the sidebar entry.

Without step 3–5 you can still use the Lovelace cards from the card picker; you will **not** get a sidebar panel.

## Manual install (without HACS)

1. Download `cctv-dashboard.js` from the latest [GitHub release](https://github.com/davies1995/HA-CCTV/releases), or build locally.
2. Copy to `config/www/cctv-dashboard.js`.
3. **Settings → Dashboards → Resources → Add resource**  
   URL: `/local/cctv-dashboard.js` · Type: **JavaScript module**.
4. Reload the browser. For the sidebar panel, set `module_url: /local/cctv-dashboard.js`.

## Streaming behaviour

### Concurrency

- Mosaic tiles only request a live slot while (near) visible.
- Global cap: **4** live streams by default (`max_streams`).
- Extra visible cameras stay on stills with a `queued` badge until a slot frees.
- Detail / single-card views use higher priority and can preempt a mosaic tile.

### Transport order

Each live tile tries transports by quality preference, typically:

1. Native `ha-camera-stream` (when registered)
2. WebRTC (`camera/webrtc/offer`)
3. HLS (`camera/stream`) when the browser can play HLS natively
4. MJPEG `/api/camera_proxy_stream/...`
5. Still image fallback

### Per-camera quality (HA API limits)

Home Assistant Core does **not** expose a bitrate/resolution knob on `camera/stream` or WebRTC offer APIs. Quality in this dashboard therefore means:

| Setting | Behaviour |
| --- | --- |
| **Auto** | Mosaic prefers a detected substream + lighter transport; detail prefers main + WebRTC/HLS |
| **High** | Main entity; prefer WebRTC/HLS |
| **Balanced** | Main entity; prefer HA native / WebRTC, then HLS/MJPEG |
| **Low** | Substream entity when available (`*_sub`, `*_lq`, `*_low`, `*_fluent`, `*_sd`), else MJPEG on main |

Set defaults in YAML (`quality`, `camera_settings`) or change **Stream quality** in the detail / single-card UI (stored in `localStorage` per entity).

## Development

Requires Node.js 18+.

```bash
npm install
npm run build
```

Output: `dist/cctv-dashboard.js`.

### Releasing for HACS

Version source of truth: `package.json` `version` (currently **0.1.1**) and matching git tag `v0.1.1`.

1. Merge release-ready changes to `main`.
2. Bump `version` in `package.json` / `src/cctv-dashboard.js` `VERSION` and update `CHANGELOG.md` for later releases.
3. Publish a GitHub release tagged `vX.Y.Z` (target `main`).
4. Attach `dist/cctv-dashboard.js` as a release asset (the **Release CCTV Dashboard** workflow does this on `release: published` once the workflow file is on `main`), **or** upload the asset manually when creating the release.
5. In HACS, users install/update **CCTV Dashboard**; the version shown is the GitHub release tag.

### Layout

```text
src/
  cctv-dashboard.js   # entry
  panel.js            # sidebar panel
  card.js             # grid Lovelace card
  camera-card.js      # single Lovelace card
  stream-player.js    # live tile
  stream-slots.js     # max concurrent streams
  quality.js          # quality / substream resolution
  cctv-view.js        # shared grid/detail UI
  cameras.js          # discovery + stream helpers
  styles.js
dist/cctv-dashboard.js
hacs.json
CHANGELOG.md
```

## Architecture

See the project plan: `/cursor/stores/bc-01a1c4ea-5cda-7df5-9269-add18c27ad57/docs/cctv-dashboard-plan.md` (coordinator store).
