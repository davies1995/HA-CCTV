"""Constants for the CCTV Dashboard integration."""

DOMAIN = "cctv_dashboard"
VERSION = "0.20.0"
PANEL_URL_PATH = "cctv"
URL_BASE = "/cctv_dashboard"
JS_FILENAME = "cctv-dashboard.js"
JS_URL = f"{URL_BASE}/{JS_FILENAME}"
# Sibling path (not nested under URL_BASE) so it does not collide with the JS static root.
# Legacy static mount (kept for older saved clip URLs); new clips use MEDIA_API_URL_BASE.
RECORDINGS_URL_BASE = "/cctv_dashboard_recordings"
# Authenticated API media path for <video>/<img> playback (Bearer or auth/sign_path).
MEDIA_API_URL_BASE = "/api/cctv_dashboard/media"

CONF_SIDEBAR_TITLE = "sidebar_title"
CONF_TITLE = "title"
CONF_MAX_STREAMS = "max_streams"
CONF_QUALITY = "quality"
CONF_RETENTION_DAYS = "retention_days"
CONF_RECORD_ON_DETECTION = "record_on_detection"

DEFAULT_SIDEBAR_TITLE = "CCTV"
DEFAULT_TITLE = "CCTV"
DEFAULT_MAX_STREAMS = 4
DEFAULT_QUALITY = "auto"
DEFAULT_RETENTION_DAYS = 1  # 24 hours
DEFAULT_RECORD_ON_DETECTION = True

# Which detection kinds start/extend video recording (timeline still logs all).
# Keep ids in sync with recordings._KIND_TOKENS / frontend DETECTION_KINDS.
RECORD_DETECTION_KIND_IDS = (
    "person",
    "car",
    "animal",
    "package",
    "bicycle",
    "motion",
    "other",
)
DEFAULT_RECORD_DETECTION_KINDS = list(RECORD_DETECTION_KIND_IDS)

# Chunked camera.record while a detection session is active.
RECORD_CHUNK_SECONDS = 30
RECORD_LOOKBACK_SECONDS = 5
SNAPSHOT_INTERVAL_SECONDS = 10

STORAGE_KEY = f"{DOMAIN}.panel"
STORAGE_VERSION = 1

QUALITY_OPTIONS = ["auto", "high", "balanced", "low"]
