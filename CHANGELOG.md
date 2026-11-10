# Changelog

All notable changes to this project are documented in this file.

## 0.3.0 — 2026-11-10

### Added

- CCTV panel camera picker (select up to 4 `camera.*` entities)
- Adaptive layouts: 1 large / 2 columns / 3 with wide bottom / 4 as 2×2
- Selection persisted in Home Assistant user data (survives reload; no YAML)

## 0.2.0 — 2026-11-10

### Breaking — HACS Integration (zero file edits)

- Delivered as a **HACS Integration** (not a Lovelace-only plugin)
- On UI setup, registers the **CCTV** sidebar panel and loads the frontend module automatically
- **No `configuration.yaml` / `panel_custom` / Resources edits**
- Migrate: remove any old Frontend HACS download, add this repo as **Integration**, then **Add integration → CCTV Dashboard**

### Kept

- Live stream tiles, max 4 concurrent streams, per-camera quality, grid + single Lovelace cards

## 0.1.1 — 2026-11-10

Post-merge HACS frontend release from `main` (Lovelace plugin era).

## 0.1.0 — 2026-11-10

First HACS-ready frontend release (required `panel_custom` for sidebar).
