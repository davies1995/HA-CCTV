"""Authenticated HTTP view for detection recording playback files."""

from __future__ import annotations

from pathlib import Path

from aiohttp import web
from homeassistant.components.http import HomeAssistantView

CONTENT_TYPES = {
    ".mp4": "video/mp4",
    ".m4v": "video/mp4",
    ".webm": "video/webm",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}


class CctvRecordingMediaView(HomeAssistantView):
    """
    Serve clip files under /api/cctv_dashboard/media/{filename}.

    Uses HA's standard auth middleware (Bearer or auth/sign_path). StaticPath
    under a non-/api prefix was a common source of <video> MEDIA_ERR_SRC_NOT_SUPPORTED
    when unsigned/401 HTML was returned instead of playable media.
    """

    url = "/api/cctv_dashboard/media/{filename}"
    name = "api:cctv_dashboard:media"
    requires_auth = True

    def __init__(self, record_dir: Path) -> None:
        self._record_dir = Path(record_dir)

    async def get(self, request: web.Request, filename: str) -> web.StreamResponse:
        name = Path(str(filename)).name
        if not name or name != str(filename) or name in {".", ".."}:
            raise web.HTTPBadRequest(text="Invalid filename")

        base = self._record_dir.resolve()
        path = (base / name).resolve()
        try:
            path.relative_to(base)
        except ValueError as err:
            raise web.HTTPForbidden(text="Invalid path") from err

        if not path.is_file():
            raise web.HTTPNotFound(text="Recording not found")

        content_type = CONTENT_TYPES.get(path.suffix.lower(), "application/octet-stream")
        # FileResponse supports Range requests needed for <video> seek/play.
        return web.FileResponse(
            path,
            headers={
                "Content-Type": content_type,
                "Cache-Control": "no-store",
            },
        )
