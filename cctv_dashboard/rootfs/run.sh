#!/command/with-contenv bashio
# ==============================================================================
# Start CCTV Dashboard
# ==============================================================================
set -euo pipefail

export LOG_LEVEL="$(bashio::config 'log_level')"
export REFRESH_SECONDS="$(bashio::config 'refresh_seconds')"

bashio::log.info "Starting CCTV Dashboard (refresh=${REFRESH_SECONDS}s, log=${LOG_LEVEL})"
exec python3 -u /opt/cctv_dashboard/main.py
