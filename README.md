# HA-CCTV

Home Assistant **CCTV dashboard** as a **HACS integration**: a sidebar **CCTV** panel plus Lovelace cards for existing `camera.*` entities.

**No `configuration.yaml` edits. No copying files by hand.** Install with HACS, then enable once in the Home Assistant UI.

## Why an integration?

A HACS *frontend/Lovelace* plugin can only load JavaScript. It **cannot** add a sidebar item without `panel_custom` YAML.

This package is a HACS **Integration** that, on setup:

1. Serves the dashboard module
2. Registers the **CCTV** sidebar panel (`require_admin: false`)
3. Loads the module for everyone (Lovelace cards work without adding a Resource)

## Install (HACS only)

1. HACS → **Integrations** → ⋮ → **Custom repositories**
2. Repository: `https://github.com/davies1995/HA-CCTV`  
   Category: **Integration**
3. Download **CCTV Dashboard** (use **v0.2.0+**)
4. Restart Home Assistant when HACS asks
5. **Settings → Devices & services → Add integration → CCTV Dashboard**  
   Accept the defaults (or set sidebar title / max streams / quality) → **Submit**
6. Hard-reload the browser — **CCTV** appears in the sidebar

That is the full setup. Optional later: **Configure** on the integration to change title / `max_streams` / default quality.

### Migrating from the old Lovelace plugin install

If you added this repo earlier as a **Lovelace / Frontend** custom repository:

1. Remove the old Frontend download in HACS (and any manual `panel_custom` block if you added one)
2. Re-add the repo as category **Integration** and follow the steps above

## Features

- Sidebar **CCTV** panel for all users (no admin gate)
- **Choose cameras in the panel UI** (checkboxes) — selection is **per-user**; on **desktop**, tiles pack by each camera’s aspect (landscape + portrait) so all selected cams fit the viewport; each tile **contains** the full frame (letterbox, no crop) for live and playback; on **mobile**, keep the stacked mosaic
- **Detection sensors** per camera (person / car / animal / package / …) — suggested by name/device heuristics, confirm or link manually; associations are **site-wide for all HA users**
- **Horizontal detection timeline** (grouped by type) — click events for details; **Play** loads the matching saved recording
- **Saved detections** — time/date, what was detected, and file size; click then **Play** to replace live mosaic feeds with that event’s recordings for the **same visible cameras**, synced and simultaneous in the same mosaic layout
- **Persisted for all users** — timeline events + saved detections live in the integration store/media (survive HA reboot); purged only after **retention days** (default 1)
- **Leaves cleanly** — navigating away or hiding the CCTV panel unloads live streams (WebRTC/HLS/MJPEG), playback, timers, and history polling so HA is not kept busy in the background
- **Detection recordings** — when any linked sensor triggers, the integration records **all available cameras** until sensors clear (HA `camera.record` chunks; snapshot fallback)
- **Retention** configurable in panel **Settings** as days (default **1 day / 24 hours**)
- Auto-discover `camera.*` (optional include/exclude on cards)
- Live stream tiles (HA / WebRTC / HLS / MJPEG / still)
- Max **4** concurrent live streams by default (`max_streams`)
- Per-camera quality: Auto / High / Balanced / Low
- Lovelace cards (loaded automatically with the integration):
  - `custom:cctv-cameras-card` (grid)
  - `custom:cctv-camera-card` (single)

### Detection recording limits (HA-native)

- Uses Home Assistant `camera.record` (≈30s chunks + lookback) while the event is active; if record fails, falls back to `camera.snapshot`
- Files land under the HA **media** folder (`…/cctv_dashboard/recordings`) when media dirs are configured; otherwise under `www`
- Multi-camera continuous video is CPU/disk heavy — ensure a writable media mount and that cameras support streaming
- Sensor links are stored in the integration (shared); saving them once makes them available to every user and to the backend with the UI closed
- Not a full NVR: no guaranteed pre-roll beyond `lookback`, and overlapping long events create multiple chunk files

## Lovelace cards (optional)

After the integration is enabled, add cards from the UI card picker — no Resource entry needed.

```yaml
type: custom:cctv-cameras-card
title: CCTV
max_streams: 4
quality: auto
```

```yaml
type: custom:cctv-camera-card
entity: camera.front_door
quality: auto
```

(Card YAML above is dashboard UI / storage — not `configuration.yaml`.)

## Development

```bash
npm install
npm run build
```

Build writes `dist/cctv-dashboard.js` and copies it to `custom_components/cctv_dashboard/www/`.

### Layout

```text
custom_components/cctv_dashboard/   # HACS integration
  www/cctv-dashboard.js             # built frontend (copied on npm run build)
  __init__.py                       # registers panel + extra JS URL
  config_flow.py                    # UI setup / options
  manifest.json
src/                                # frontend sources
hacs.json
```

### Releasing

1. Bump `package.json`, `src/cctv-dashboard.js` `VERSION`, `custom_components/.../const.py` `VERSION`, and `manifest.json` `version`
2. `npm run build`
3. Merge to `main` and publish GitHub release tag `vX.Y.Z` (HACS uses the tag for integrations)

## Architecture notes

Home Assistant Core does not expose camera bitrate knobs on stream/WebRTC APIs; quality uses main vs substream entities + transport preference. See the project plan in the coordinator store.
