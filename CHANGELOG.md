# Changelog

## 0.15.0 — 2026-11-11

### Fixed

- Mosaic tiles stuck on a still with a **queued** badge: release previous stream-slot ids when quality/substream resolution changes, clear slots when entering/leaving detection playback, and do not re-request slots from `releaseAll`

## 0.14.0 — 2026-11-11

### Fixed

- Saved detection **Play** on mobile no longer fails with “No clips for the currently selected mosaic cameras” when selection is empty or selected cams lack playable files — falls back to cameras that have clips; refreshes session metadata before Play
- Detection `camera.record` now waits for each clip file (parallel per camera) and snapshots on empty/missing output so indexed clips are actually playable

## 0.13.0 — 2026-11-10

### Added

- **Play** on each Saved detections row starts the same synced mosaic playback as the desktop playback bar (easier on mobile; row click + bar Play unchanged)

### Changed

- Force-aspect hint shortened to exactly “Shared for all users.”
- Removed the **1920×2560 doorbell (3:4)** force-aspect preset; use **3:4** or **Custom W:H** (e.g. `1920:2560`) instead

## 0.12.0 — 2026-11-10

### Fixed

- Panel stream quality and force-aspect no longer vanish on reload — draft locally, then **Save quality & aspect** writes shared settings for all users

### Added

- Shared `camera_quality` map in the integration store (`cctv_dashboard/set_camera_prefs`)
- Force-aspect preset **1920×2560** doorbell (3:4) plus freeform custom `W:H` / `WxH` entry

## 0.11.0 — 2026-11-10

### Fixed

- Leave CCTV sidebar unloads streams/history/timers without IntersectionObserver remount flicker (`location-changed` / path leave + tab hide + disconnect)
- Detection **Play** auth: clips served via signed `/api/cctv_dashboard/media/…` (fixes unauthorized/unsupported media errors)

### Added

- Home Assistant **admins** can delete a saved detection’s recording file set for all users from Saved detections


## 0.10.0 — 2026-11-10

### Fixed

- Mosaic streams stay live while watching (removed PR20 host IntersectionObserver that remounted tiles on layout blips)
- Leave-page unload kept via tab hide + panel disconnect only

### Added

- Shared per-camera **force aspect ratio** override (e.g. 9:16 doorbell) for all HA users when auto pack/fit fails


## 0.9.0 — 2026-11-10

### Fixed

- Mosaic cameras no longer flicker/restart while in use (hass/config/sensor churn no longer tears down live streams)
- Portrait doorbells **contain**-fit mosaic tiles for live and playback (pass tile `aspectRatio` to `ha-camera-stream`; mosaic attr on all layout tiles)


## 0.8.0 — 2026-11-10

### Fixed

- Event **Play** starts multi-cam mosaic recordings (signed media URLs + reliable muted autoplay kick)
- Mosaic tiles **contain**-fit mixed aspects (no crop) for live and playback
- Opening CCTV no longer keeps HA busy after navigate-away (streams/history fully unload)

### Added

- Shared detection timeline + saved detections persist for all users across HA reboot; purge only by retention days
- HACS/repo camera brand icon

## 0.7.0 — 2026-11-10

### Fixed

- Detection **Play** keeps the same visible mosaic cameras/layout, unloads live streams, and plays those recordings **simultaneously** seek-synced to the event window (not other cams, not one-at-a-time)

### Changed

- Lighter HA frontend load: skip unrelated state re-renders, quieter timeline history refreshes, cached recording file sizes

## 0.6.0 — 2026-11-10

### Added

- Saved detections list shows **time/date**, **what was detected**, and **file sizes**
- Click a saved detection or timeline **Play** to replace the live mosaic with that event’s multi-camera recordings until stop/end
- Horizontal detection timeline with clickable event details
- Desktop mosaic packs by camera aspect so all selected cams fit the viewport

All notable changes to this project are documented in this file.

## 0.5.0 — 2026-11-10

### Changed

- Detection sensor links are **site-wide** (shared for all HA users); mosaic camera selection stays per-user
- Detection timeline grouped by **type** (person / car / animal / package / …); overlapping same-type sensors merge into one event

## 0.4.0 — 2026-11-10

### Added

- Per-camera detection sensor linking (person / car / animal / package / …) with suggestions + manual confirm
- Bottom detection timeline for selected cameras (on/off flags, durations, 15m–24h windows)
- Detection-triggered recordings: when a linked sensor fires, record **all available cameras** until sensors clear
- Retention configurable in panel Settings as **days** (default 1 / 24 hours)
- Saved detections browser (clips via `camera.record`, snapshot fallback)

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
