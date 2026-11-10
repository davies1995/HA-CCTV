# HA-CCTV

Home Assistant **CCTV dashboard** as a frontend custom panel + Lovelace cards. It discovers existing `camera.*` entities and shows **live stream tiles** (WebRTC / HLS / MJPEG, with still fallback) plus per-camera detail and basic controls.

This is **not** a Supervisor add-on. Cameras must already exist in Home Assistant (Frigate, go2rtc, ONVIF, generic IP camera, etc.).

## Features

- Auto-discover all `camera.*` entities (optional include/exclude lists)
- **Live stream tiles** early in v1 (not stills-only)
- **Lazy mosaic streaming** — off-screen tiles stay on stills until visible
- Per-camera controls from registered safe `camera` services (on/off/toggle, snapshot, motion) + more-info
- Shared bundle registers:
  - **Panel:** `cctv-dashboard-panel` (sidebar; all users)
  - **Grid card:** `custom:cctv-cameras-card`
  - **Single card:** `custom:cctv-camera-card`

## Install

### HACS (recommended for the cards)

1. HACS → Frontend → Custom repositories → add `https://github.com/davies1995/HA-CCTV` as **Lovelace**.
2. Install **CCTV Dashboard**.
3. Reload the browser.

#### Grid card

```yaml
type: custom:cctv-cameras-card
title: CCTV
# cameras:
#   - camera.front_door
# exclude:
#   - camera.ignored
```

#### Single camera card

```yaml
type: custom:cctv-camera-card
entity: camera.front_door
title: Front door
muted: true
```

HACS serves `dist/cctv-dashboard.js` from the latest GitHub release once releases are published. Until then, use manual install from a built `dist/` file.

### Manual resource

1. Build (see Development) or download `cctv-dashboard.js`.
2. Copy to `config/www/cctv-dashboard.js`.
3. **Settings → Dashboards → Resources → Add resource**  
   URL: `/local/cctv-dashboard.js` · Type: JavaScript module.

### Sidebar custom panel (all users)

After the module is loaded (HACS resource or `/local/...`), add to `configuration.yaml` and restart:

```yaml
panel_custom:
  - name: cctv-dashboard-panel
    url_path: cctv
    sidebar_title: CCTV
    sidebar_icon: mdi:cctv
    require_admin: false
    module_url: /hacsfiles/HA-CCTV/cctv-dashboard.js
    # For manual www install use:
    # module_url: /local/cctv-dashboard.js
    config:
      title: CCTV
```

`require_admin` stays **false** so every user sees the sidebar entry.

`module_url` for HACS may vary by HACS version; if the panel fails to load, copy the card resource URL from **Dashboards → Resources** and reuse it as `module_url`.

## Streaming behaviour

Each tile tries, in order:

1. Native `ha-camera-stream` (when already registered by the HA frontend)
2. WebRTC via Home Assistant Core (`camera/webrtc/offer`)
3. HLS via `camera/stream` when the browser can play HLS natively
4. MJPEG `/api/camera_proxy_stream/...`
5. Still image fallback

Grid tiles only open a live session while (near) visible; scrolled-away tiles drop back to a still. Detail view and the single-camera card stream eagerly while open.

Chrome HLS without HLS.js falls through to MJPEG/WebRTC — that is intentional for a thin v1 bundle.

## Development

Requires Node.js 18+.

```bash
npm install
npm run build
```

Output: `dist/cctv-dashboard.js`.

```bash
npm run watch
```

### Layout

```text
src/
  cctv-dashboard.js   # entry
  panel.js            # sidebar panel
  card.js             # grid Lovelace card
  camera-card.js      # single Lovelace card
  stream-player.js    # live tile
  cctv-view.js        # shared grid/detail UI
  cameras.js          # discovery + stream helpers
  styles.js
dist/cctv-dashboard.js
hacs.json
```

## Architecture

See the project plan: `/cursor/stores/bc-01a1c4ea-5cda-7df5-9269-add18c27ad57/docs/cctv-dashboard-plan.md` (coordinator store).

**Locked defaults:** frontend panel + cards; existing HA cameras; stream tiles in v1; sidebar for all users (`require_admin: false`).
