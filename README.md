# HA-CCTV

Home Assistant **CCTV dashboard** as a frontend custom panel + Lovelace card. It discovers existing `camera.*` entities and shows a live stills grid with per-camera detail and basic controls (turn on/off, snapshot, more-info).

This is **not** a Supervisor add-on. Cameras must already exist in Home Assistant (Frigate, go2rtc, ONVIF, generic IP camera, etc.).

## Features (MVP scaffold)

- Auto-discover all `camera.*` entities (optional include/exclude lists)
- Responsive mosaic + detail view
- Basic `camera` service actions and Home Assistant more-info
- Shared bundle registers:
  - **Panel** element: `cctv-dashboard-panel`
  - **Lovelace card**: `custom:cctv-cameras-card`

## Install

### HACS (recommended for the card)

1. HACS → Frontend → Custom repositories → add `https://github.com/davies1995/HA-CCTV` as **Lovelace**.
2. Install **CCTV Dashboard**.
3. Reload the browser.
4. Add **CCTV Cameras** from the card picker, or use YAML:

```yaml
type: custom:cctv-cameras-card
title: CCTV
refresh_seconds: 5
# cameras:
#   - camera.front_door
# exclude:
#   - camera.ignored
```

HACS serves `dist/cctv-dashboard.js` from the latest GitHub release once releases are published. Until then, use manual install from a built `dist/` file.

### Manual resource

1. Build (see Development) or download `cctv-dashboard.js`.
2. Copy to `config/www/cctv-dashboard.js`.
3. **Settings → Dashboards → Resources → Add resource**  
   URL: `/local/cctv-dashboard.js` · Type: JavaScript module.

### Sidebar custom panel

After the module is loaded (HACS resource or `/local/...`), add to `configuration.yaml` and restart:

```yaml
panel_custom:
  - name: cctv-dashboard-panel
    url_path: cctv
    sidebar_title: CCTV
    sidebar_icon: mdi:cctv
    module_url: /hacsfiles/HA-CCTV/cctv-dashboard.js
    # For manual www install use:
    # module_url: /local/cctv-dashboard.js
    config:
      title: CCTV
      refresh_seconds: 5
```

`module_url` for HACS may vary by HACS version; if the panel fails to load, copy the card resource URL from **Dashboards → Resources** and reuse it as `module_url`.

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
  card.js             # Lovelace card
  cctv-view.js        # shared grid/detail UI
  cameras.js          # discovery helpers
  styles.js
dist/cctv-dashboard.js
hacs.json
```

## Architecture

See the project plan: `/cursor/stores/bc-01a1c4ea-5cda-7df5-9269-add18c27ad57/docs/cctv-dashboard-plan.md` (coordinator store).

**Locked defaults:** frontend panel/card only; discover existing HA cameras; stills-first grid; no Supervisor add-on.
