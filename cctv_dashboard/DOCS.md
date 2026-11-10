# CCTV Dashboard

## What it does

Provides a sidebar **CCTV** panel (Ingress) that discovers Home Assistant `camera.*` entities and shows them in a grid. Open a camera for a larger preview and any basic controls HA already exposes (for example turn on/off or snapshot, when the entity supports them).

Cameras from Frigate, go2rtc, ONVIF, and generic IP camera integrations appear automatically **if they create Home Assistant camera entities**.

## Configuration

| Option | Description |
| --- | --- |
| `log_level` | Add-on log verbosity. |
| `refresh_seconds` | How often the UI refreshes camera state (1–60). |

Ingress is on by default. Optionally map host port `8099` if you need direct access outside Ingress.

## Requirements

- Home Assistant OS or Supervised (Supervisor required).
- At least one `camera` entity in Home Assistant.
