ARG BUILD_FROM=ghcr.io/home-assistant/aarch64-base-python:3.13-alpine3.22
FROM ${BUILD_FROM}

RUN pip3 install --no-cache-dir --break-system-packages \
    aiohttp==3.11.18

COPY rootfs /

RUN chmod a+x /run.sh

CMD ["/run.sh"]

LABEL \
  io.hass.name="CCTV Dashboard" \
  io.hass.description="View and control Home Assistant cameras from a dedicated CCTV dashboard." \
  io.hass.type="addon" \
  io.hass.version="0.1.0"
