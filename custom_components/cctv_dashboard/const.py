"""Constants for the CCTV Dashboard integration."""

DOMAIN = "cctv_dashboard"
VERSION = "0.2.0"
PANEL_URL_PATH = "cctv"
URL_BASE = "/cctv_dashboard"
JS_FILENAME = "cctv-dashboard.js"
JS_URL = f"{URL_BASE}/{JS_FILENAME}"

CONF_SIDEBAR_TITLE = "sidebar_title"
CONF_TITLE = "title"
CONF_MAX_STREAMS = "max_streams"
CONF_QUALITY = "quality"

DEFAULT_SIDEBAR_TITLE = "CCTV"
DEFAULT_TITLE = "CCTV"
DEFAULT_MAX_STREAMS = 4
DEFAULT_QUALITY = "auto"
