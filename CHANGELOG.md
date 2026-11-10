# Changelog

All notable changes to this project are documented in this file.

## 0.1.1 — 2026-11-10

Post-merge HACS release cut from `main`.

### Changed

- Republished release asset from merged `main` so HACS updates track the default branch
- Clarified that the **CCTV sidebar requires `panel_custom` in `configuration.yaml`** — HACS alone does not add a sidebar entry

## 0.1.0 — 2026-11-10

First HACS-ready frontend release.

### Added

- Custom sidebar panel `cctv-dashboard-panel` (`panel_custom`, `require_admin: false`)
- Lovelace cards `custom:cctv-cameras-card` (grid) and `custom:cctv-camera-card` (single)
- Live stream tiles via HA native / WebRTC / HLS / MJPEG, with still fallback
- Visible-only mosaic streaming (`IntersectionObserver`)
- Max **4** concurrent live streams (`max_streams`, queued stills when over cap)
- Per-camera quality: Auto / High / Balanced / Low (substream entity + transport preference)
- Safe camera controls when services exist (on/off/toggle, snapshot, motion) + more-info
- HACS packaging: `hacs.json`, release workflow, committed `dist/cctv-dashboard.js`
