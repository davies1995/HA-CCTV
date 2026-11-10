# HA-CCTV

Home Assistant **Supervisor add-on** that provides a dedicated CCTV dashboard: discover all `camera.*` entities, show a live grid, open per-camera detail, and run basic camera controls through the Home Assistant API.

Works with Frigate, go2rtc, ONVIF, and other stacks **when they expose cameras as Home Assistant camera entities**.

## Install (Home Assistant OS / Supervised)

1. **Settings → Add-ons → Add-on store → ⋮ → Repositories**
2. Add: `https://github.com/davies1995/HA-CCTV`
3. Install **CCTV Dashboard**
4. Start the add-on, then open it from the sidebar (**CCTV**) or via **Open Web UI** (Ingress)

The add-on needs the Home Assistant API (enabled in `config.yaml`). No separate camera credentials are stored in the add-on.

> Until a published container image is configured, Supervisor builds the add-on locally from this repository’s `Dockerfile` (first install can take a few minutes).

## Development

### Layout

```text
repository.yaml          # Add-on repository metadata
cctv_dashboard/          # Add-on (slug must match folder)
  config.yaml
  Dockerfile
  rootfs/
    run.sh
    opt/cctv_dashboard/  # Python aiohttp app + static UI
```

### Local UI / API smoke (without Supervisor)

```bash
cd cctv_dashboard/rootfs/opt/cctv_dashboard
python3 -m venv .venv
source .venv/bin/activate
pip install aiohttp
export SUPERVISOR_TOKEN=dev-token   # optional; API calls fail without a real token
export REFRESH_SECONDS=5
python3 main.py
# open http://127.0.0.1:8099/
```

Camera listing and proxies require a real Supervisor/`SUPERVISOR_TOKEN` against Home Assistant Core. Local mode is mainly for static UI and `/health`.

### On-device add-on build

1. Copy or mount this repo as a local add-on repository, or push a branch and add the GitHub URL as a custom repository.
2. Rebuild/restart the add-on after changes under `cctv_dashboard/`.

## Architecture notes

See the product plan in the project store (coordinator): `docs/cctv-dashboard-plan.md`.

**Defaults:** Supervisor add-on + Ingress (not a Lovelace card); discovery via HA `camera.*` only; no direct RTSP/NVR access in v1.
