# Changelog

## 0.18.8 — 2026-11-11

### Fixed

- Detection recording prefers real **mp4** clips: wait for `camera.record` files to land, recover late writes, record cameras sequentially (parallel record was a common snapshot-fallback cause), and sign Play URLs via `/api/cctv_dashboard/media/…` even when clip `path` is a filesystem path
- Play prefers video chunks over snapshots when both exist for a camera

### Added

- Settings-only **Recording debug** (copyable) + `sensor.cctv_dashboard_recording_debug` with last session clip kinds/sizes/paths/URLs and snapshot fallback reasons — not shown on the main mosaic

## 0.18.7 — 2026-11-11

### Fixed

- Detection **Play** no longer races TV mosaic stage/pack remounts: freeze TV stage geometry while playing, wait for `video.playback-media` (or snapshot tiles) before kick — fixes toast “Playback ready but no video elements found”

## 0.18.6 — 2026-11-11

### Changed

- **Whole-app restore** to pre-PR **#46** (`c083bac`, parent of trigger-highlight): detection playback and the rest of the tree match that baseline again (no trigger highlight)
- Re-applied **TV mode** (#45) and **full-width 16:9** mosaic stage (#50) only — detection playback code paths untouched by those TV commits
- Kept **#48** slugify import fix (`from homeassistant.util import slugify`) so HA setup does not crash — not playback-related

## 0.18.5 — 2026-11-11

### Fixed

- Detection **Play** waits until mosaic `<video class="playback-media">` nodes exist before kicking `play()` (fixes toast “Playback ready but no video elements found”)

## 0.18.4 — 2026-11-11

### Fixed

- Hard-revert detection mosaic playback to **pre-PR #46** (`c083bac`): `src=`, `autoplay`, `controls`, simple kick; **remove** trigger-cam border / overlay / highlight helpers entirely

## 0.18.3 — 2026-11-11

### Fixed

- Restore **pre-#46** detection playback pipeline (`src=`, `autoplay`, `controls`, simple kick) so clips play with native controls; keep trigger-cam highlight as a `pointer-events: none` overlay (does not rewrite tile class/style)

## 0.18.2 — 2026-11-11

### Fixed

- Detection **Play** actually starts clips again (v0.18.1 left a freeze frame): restore stable `.src` + muted autoplay, stop calling `video.load()` after setting src, wait for pack settle, and re-kick `play()` for Companion/desktop

## 0.18.1 — 2026-11-11

### Fixed

- Detection **Play** no longer freezes / storms HA after trigger-cam highlight: stop packing from playback media probes while playing, bind clip `src` imperatively (not on every Lit re-render), keep trigger outline layout-neutral, and skip timeline refetches when camera ids are unchanged

## 0.18.0 — 2026-11-11

### Fixed

- **TV mode** keeps a centred **16:9** mosaic stage, but sizes it to the **full panel content width** (sidebar excluded; height = width×9/16) instead of inscribing a smaller 16:9 box that left side gutters

## 0.17.1 — 2026-11-11

### Fixed

- Setup crash on current Home Assistant Core: import `slugify` from `homeassistant.util` (with local fallback) instead of the removed `homeassistant.util.slugify` module path

## 0.17.0 — 2026-11-11

### Added

- Per-user **Notify me when recorded** setting: Companion `notify.mobile_app_*` (fallback persistent notification) with detection type + duration when a clip with media is saved
- **TV mode** (per-device via browser localStorage): 16:9 mosaic above the fold for kiosk/TV, up to 4 cams fill the stage, 1–2 cams maximize; timeline + Saved detections scroll below
- During detection playback, the **trigger camera** tile border uses the event-type color (person/car/animal/…) so attention lands there first

## 0.16.0 — 2026-11-11

### Fixed

- Saved detections no longer fill with **0 B** stubs when sensors clear mid-`camera.record`: finish the in-flight chunk instead of cancelling, discard sessions with no playable media, and hide empty stubs from the list

### Added

- Shared **Save video for** detection-type filter (Person / Car / Animal / …) — timeline still logs all types
- Admin **Clear all** deletes every saved detection’s files and resets the shared detection timeline (confirm required)

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
