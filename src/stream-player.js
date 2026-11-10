import { LitElement, html, nothing, css } from "lit";
import {
  addWebRtcCandidate,
  cameraMjpegStreamUrl,
  cameraPreviewUrl,
  fetchCameraCapabilities,
  fetchHlsStreamUrl,
  fetchWebRtcClientConfiguration,
  subscribeWebRtcOffer,
  supportsStream,
} from "./cameras.js";
import {
  preferredTransports,
  resolveQuality,
  resolveStreamCamera,
} from "./quality.js";
import { STREAM_PRIORITY, streamSlots } from "./stream-slots.js";

/**
 * Live camera tile with visibility gating + global max concurrent streams.
 */
export class CctvStreamPlayer extends LitElement {
  static properties = {
    hass: { attribute: false },
    camera: { attribute: false },
    config: { attribute: false },
    quality: { type: String },
    context: { type: String },
    muted: { type: Boolean },
    controls: { type: Boolean },
    large: { type: Boolean, reflect: true },
    mosaic: { type: Boolean, reflect: true },
    eager: { type: Boolean },
    posterOnly: { type: Boolean, attribute: "poster-only" },
    /**
     * When false, fully unload live media (WebRTC/HLS/MJPEG/ha-camera-stream)
     * and release stream slots. Panel sets this false when hidden/away.
     */
    active: { type: Boolean },
    _mode: { state: true },
    _error: { state: true },
    _hlsUrl: { state: true },
    _mjpegUrl: { state: true },
    _stillUrl: { state: true },
    _visible: { state: true },
    _slotHeld: { state: true },
    _queued: { state: true },
    /** Tile box width/height — required by ha-camera-stream for contain letterboxing. */
    _tileAspect: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      background: #0a0e13;
      aspect-ratio: 16 / 10;
      overflow: hidden;
    }

    :host([large]) {
      aspect-ratio: auto;
      min-height: 220px;
    }

    /* Desktop mosaic tiles: fill the grid cell instead of enforcing a tall min-height. */
    :host([large][mosaic]) {
      min-height: 0;
      height: 100%;
    }

    @media (min-width: 801px) {
      :host([large][mosaic]) {
        min-height: 0;
      }

      :host([large][mosaic]) .media,
      :host([large][mosaic]) ha-camera-stream,
      :host([large][mosaic]) video,
      :host([large][mosaic]) img {
        min-height: 0;
      }
    }

    .media,
    ha-camera-stream,
    video,
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
      background: #0a0e13;
      border: 0;
    }

    :host([large]) .media,
    :host([large]) ha-camera-stream,
    :host([large]) video,
    :host([large]) img {
      object-fit: contain;
      min-height: 220px;
    }

    /*
     * Mosaic tiles (mixed landscape + doorbell/portrait): always letterbox /
     * pillarbox so the full frame stays visible — never crop with cover.
     */
    :host([large][mosaic]) {
      background: #0a0e13;
    }

    :host([large][mosaic]) .media,
    :host([large][mosaic]) ha-camera-stream,
    :host([large][mosaic]) video,
    :host([large][mosaic]) img {
      min-height: 0;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
    }

    /* HA host is a custom element — force it to fill the tile box. */
    :host([large][mosaic]) ha-camera-stream {
      display: block;
      overflow: hidden;
    }

    .badge {
      position: absolute;
      left: 0.5rem;
      top: 0.5rem;
      font-size: 0.65rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      pointer-events: none;
    }

    .error,
    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 120px;
      color: var(--secondary-text-color, #8b9aab);
      padding: 0.75rem;
      text-align: center;
      font-size: 0.85rem;
    }
  `;

  constructor() {
    super();
    this.config = {};
    this.quality = "";
    this.context = "mosaic";
    this.muted = true;
    this.controls = false;
    this.large = false;
    this.mosaic = false;
    this.eager = false;
    this.posterOnly = false;
    this.active = true;
    this._mode = "loading";
    this._error = "";
    this._hlsUrl = "";
    this._mjpegUrl = "";
    this._stillUrl = "";
    this._visible = false;
    this._slotHeld = false;
    this._queued = false;
    this._pc = null;
    this._unsubWebRtc = null;
    this._sessionId = null;
    this._startToken = 0;
    this._observer = null;
    this._hostRo = null;
    this._slotId = "";
    this._streamCamera = null;
    this._stableStateObj = null;
    this._tileAspect = 0;
    this._lastEmittedAspect = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._bindObserver();
    this._bindHostResize();
    if (this.active) this._reconcilePlayback();
    else this._unloadCompletely();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unbindObserver();
    this._unbindHostResize();
    this._unloadCompletely();
  }

  /**
   * Skip hass/camera/config identity churn that does not affect the live session.
   * @param {Map<string, unknown>} changed
   */
  shouldUpdate(changed) {
    for (const key of changed.keys()) {
      if (key.startsWith("_")) return true;
      if (!["hass", "camera", "config"].includes(key)) return true;
    }
    if (changed.has("hass") && this._cameraHassChanged(changed.get("hass"), this.hass)) {
      return true;
    }
    if (changed.has("camera") && this._cameraMeaningful(changed.get("camera"), this.camera)) {
      return true;
    }
    if (changed.has("config") && this._configMeaningful(changed.get("config"), this.config)) {
      return true;
    }
    return false;
  }

  updated(changed) {
    if (changed.has("eager") || changed.has("posterOnly")) {
      this._bindObserver();
    }
    if (changed.has("large") || changed.has("mosaic")) {
      this._bindHostResize();
    }

    if (changed.has("active") && !this.active) {
      this._unloadCompletely();
      return;
    }

    const hassRelevant =
      changed.has("hass") && this._cameraHassChanged(changed.get("hass"), this.hass);
    const cameraRelevant =
      changed.has("camera") && this._cameraMeaningful(changed.get("camera"), this.camera);
    const configRelevant =
      changed.has("config") && this._configMeaningful(changed.get("config"), this.config);

    if (
      hassRelevant ||
      cameraRelevant ||
      configRelevant ||
      changed.has("quality") ||
      changed.has("context") ||
      changed.has("eager") ||
      changed.has("posterOnly") ||
      (changed.has("active") && this.active)
    ) {
      this._reconcilePlayback();
    }
    if (changed.has("muted")) {
      const video = this.renderRoot?.querySelector("video");
      if (video) video.muted = this.muted;
    }
    if (
      changed.has("_mode") ||
      cameraRelevant ||
      changed.has("_tileAspect")
    ) {
      this.updateComplete.then(() => {
        this._probeMediaSize();
        this._forceNestedContain();
      });
    }
  }

  /**
   * Ignore unrelated HA state churn so live streams are not restarted.
   * @param {any} prev
   * @param {any} next
   */
  _cameraHassChanged(prev, next) {
    const entityId = this._streamCamera?.entityId || this.camera?.entityId;
    if (!entityId) return true;
    const a = prev?.states?.[entityId];
    const b = next?.states?.[entityId];
    if (a === b) return false;
    if (!a || !b) return true;
    const unavail = (s) =>
      !s || ["unavailable", "unknown"].includes(String(s.state).trim().toLowerCase());
    return (
      unavail(a) !== unavail(b) ||
      a.attributes?.access_token !== b.attributes?.access_token
    );
  }

  /**
   * @param {any} prev
   * @param {any} next
   */
  _cameraMeaningful(prev, next) {
    if (prev === next) return false;
    if (!prev || !next) return true;
    return (
      prev.entityId !== next.entityId ||
      Boolean(prev.unavailable) !== Boolean(next.unavailable) ||
      prev.stateObj?.attributes?.access_token !== next.stateObj?.attributes?.access_token
    );
  }

  /**
   * @param {any} prev
   * @param {any} next
   */
  _configMeaningful(prev, next) {
    if (prev === next) return false;
    if (!prev || !next) return true;
    return (
      prev.max_streams !== next.max_streams ||
      prev.quality !== next.quality ||
      JSON.stringify(prev.camera_settings || null) !==
        JSON.stringify(next.camera_settings || null) ||
      JSON.stringify(prev.cameras_settings || null) !==
        JSON.stringify(next.cameras_settings || null)
    );
  }

  _bindHostResize() {
    this._unbindHostResize();
    this._updateTileAspect();
    if (typeof ResizeObserver === "undefined") return;
    this._hostRo = new ResizeObserver(() => this._updateTileAspect());
    this._hostRo.observe(this);
  }

  _unbindHostResize() {
    if (this._hostRo) {
      this._hostRo.disconnect();
      this._hostRo = null;
    }
  }

  _updateTileAspect() {
    const w = this.clientWidth;
    const h = this.clientHeight;
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 2 || h < 2) return;
    const aspect = w / h;
    if (this._tileAspect && Math.abs(this._tileAspect - aspect) < 0.005) return;
    this._tileAspect = aspect;
  }

  /**
   * HA nested media ignores host object-fit; fitMode+aspectRatio is the real API.
   * As a fallback for older builds, force contain on nested video/img.
   */
  _forceNestedContain() {
    if (!(this.mosaic || this.large) || this._mode !== "ha") return;
    const ha = this.renderRoot?.querySelector("ha-camera-stream");
    const root = ha?.shadowRoot;
    if (!root) return;
    root.querySelectorAll("video, img").forEach((el) => {
      el.style.objectFit = "contain";
      el.style.objectPosition = "center";
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.maxWidth = "100%";
      el.style.maxHeight = "100%";
    });
  }

  get _effectiveQuality() {
    if (this.quality) return this.quality;
    return resolveQuality(this.config, this.camera?.entityId);
  }

  get _priority() {
    return this.eager ? STREAM_PRIORITY.EAGER : STREAM_PRIORITY.VISIBLE;
  }

  _bindObserver() {
    this._unbindObserver();
    if (this.eager || this.posterOnly) {
      this._visible = true;
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      this._visible = true;
      return;
    }
    this._observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible === this._visible) return;
        this._visible = visible;
        this._reconcilePlayback();
      },
      { root: null, rootMargin: "120px 0px", threshold: 0.15 }
    );
    this._observer.observe(this);
  }

  _unbindObserver() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  _wantsLive() {
    if (!this.active) return false;
    if (typeof document !== "undefined" && document.hidden) return false;
    if (this.posterOnly) return false;
    if (this.eager) return true;
    return this._visible;
  }

  _refreshPosterUrls(streamCamera, { cacheBust = false } = {}) {
    const cam = streamCamera || this.camera;
    if (!this.hass || !cam?.stateObj) {
      this._stillUrl = "";
      this._mjpegUrl = "";
      return;
    }
    const nextStill = cameraPreviewUrl(this.hass, cam, cacheBust);
    const nextMjpeg = cameraMjpegStreamUrl(this.hass, cam);
    // Avoid rewriting reactive URLs when unchanged (Date.now cache-bust flickered tiles).
    if (this._stillUrl !== nextStill) this._stillUrl = nextStill;
    if (this._mjpegUrl !== nextMjpeg) this._mjpegUrl = nextMjpeg;
  }

  /**
   * Keep a stable stateObj reference for ha-camera-stream so routine hass
   * ticks do not tear down WebRTC/HLS inside HA's element.
   * @param {any} streamCamera
   */
  _syncStableStreamCamera(streamCamera) {
    const next = streamCamera?.stateObj || null;
    const prev = this._stableStateObj;
    const unavail = (s) =>
      !s || ["unavailable", "unknown"].includes(String(s.state).trim().toLowerCase());
    const changed =
      !prev ||
      !next ||
      prev.entity_id !== next.entity_id ||
      prev.attributes?.access_token !== next.attributes?.access_token ||
      unavail(prev) !== unavail(next);
    if (changed) {
      this._stableStateObj = next;
      this._streamCamera = streamCamera;
    } else if (!this._streamCamera) {
      this._streamCamera = streamCamera;
    }
  }

  /**
   * Drop client media handles so browsers close MJPEG/HLS/WebRTC sockets.
   */
  _clearMediaElements() {
    const root = this.renderRoot;
    if (!root) return;
    root.querySelectorAll("video").forEach((video) => {
      try {
        video.pause?.();
        const stream = video.srcObject;
        if (stream && typeof stream.getTracks === "function") {
          stream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {
              /* ignore */
            }
          });
        }
        video.srcObject = null;
        video.removeAttribute("src");
        video.load?.();
      } catch {
        /* ignore */
      }
    });
    root.querySelectorAll("img.media").forEach((img) => {
      try {
        img.removeAttribute("src");
        // Break lingering MJPEG camera_proxy_stream connections.
        img.src = "";
      } catch {
        /* ignore */
      }
    });
  }

  _stopLive() {
    this._startToken += 1;
    if (this._unsubWebRtc) {
      try {
        this._unsubWebRtc();
      } catch {
        /* ignore */
      }
      this._unsubWebRtc = null;
    }
    if (this._pc) {
      try {
        this._pc.getSenders?.().forEach((sender) => {
          try {
            sender.track?.stop?.();
          } catch {
            /* ignore */
          }
        });
        this._pc.getReceivers?.().forEach((receiver) => {
          try {
            receiver.track?.stop?.();
          } catch {
            /* ignore */
          }
        });
        this._pc.close();
      } catch {
        /* ignore */
      }
      this._pc = null;
    }
    this._sessionId = null;
    this._hlsUrl = "";
    this._clearMediaElements();
  }

  _releaseSlot() {
    if (this._slotId) {
      streamSlots.release(this._slotId);
    }
    this._slotHeld = false;
    this._queued = false;
  }

  /**
   * Hard unload used when the panel is hidden/disconnected — frees HA stream
   * workers and browser CPU/RAM (no posters, no MJPEG, no peer connections).
   */
  _unloadCompletely() {
    this._releaseSlot();
    this._stopLive();
    this._stillUrl = "";
    this._mjpegUrl = "";
    this._mode = "empty";
    this._error = "";
    this._playKey = "";
    this._idleReason = "suspended";
    this._queued = false;
    this._stableStateObj = null;
    this._streamCamera = null;
  }

  _showIdle(reason = "idle") {
    this._stopLive();
    // Suspended / inactive: do not open still/MJPEG proxies either.
    if (!this.active || (typeof document !== "undefined" && document.hidden)) {
      this._stillUrl = "";
      this._mjpegUrl = "";
      this._mode = "empty";
      this._error = "";
      this._idleReason = reason;
      return;
    }
    this._refreshPosterUrls(this._streamCamera || this.camera, { cacheBust: true });
    if (!this.hass || !this.camera?.stateObj) {
      this._mode = "empty";
      return;
    }
    this._mode = this._stillUrl ? "still" : "empty";
    this._error = this._stillUrl ? "" : "No preview";
    this._idleReason = reason;
  }

  _reconcilePlayback() {
    if (!this.active || (typeof document !== "undefined" && document.hidden)) {
      this._unloadCompletely();
      return;
    }

    const max = Number(this.config?.max_streams);
    if (Number.isFinite(max) && max > 0) {
      streamSlots.setMax(max);
    }

    if (!this.hass || !this.camera?.stateObj) {
      this._releaseSlot();
      this._stopLive();
      this._mode = "empty";
      this._playKey = "";
      this._stableStateObj = null;
      return;
    }

    const resolved = resolveStreamCamera(
      this.hass,
      this.camera,
      this.config,
      this._effectiveQuality,
      this.context
    );
    this._syncStableStreamCamera(resolved);
    this._slotId = this._streamCamera?.entityId || this.camera.entityId;

    const want = this._wantsLive();
    const playKey = [
      want ? "live" : "idle",
      this._slotId,
      this._effectiveQuality,
      this.context,
      this.eager ? "eager" : "lazy",
    ].join("|");

    if (!want) {
      this._releaseSlot();
      this._showIdle("idle");
      this._playKey = playKey;
      return;
    }

    // Avoid tearing down a healthy live session on routine hass state churn.
    // Do not refresh poster URLs here — cache-busting _stillUrl forced re-renders.
    if (
      this._slotHeld &&
      this._playKey === playKey &&
      this._mode !== "loading" &&
      this._mode !== "empty" &&
      !(this._mode === "still" && this._queued)
    ) {
      return;
    }

    this._refreshPosterUrls(this._streamCamera, { cacheBust: false });

    const onGrant = () => {
      this._slotHeld = true;
      this._queued = false;
      this._playKey = playKey;
      this._startLive();
    };
    const onRevoke = () => {
      this._slotHeld = false;
      this._queued = this._wantsLive();
      this._playKey = "";
      this._showIdle("queued");
      if (this._wantsLive()) {
        const requeued = streamSlots.request(this._slotId, this._priority, {
          onGrant,
          onRevoke,
        });
        if (requeued) onGrant();
      }
    };

    const granted = streamSlots.request(this._slotId, this._priority, {
      onGrant,
      onRevoke,
    });

    if (granted) {
      onGrant();
    } else {
      this._slotHeld = false;
      this._queued = true;
      this._playKey = playKey;
      this._showIdle("queued");
    }
  }

  async _startLive() {
    this._stopLive();
    const token = this._startToken;
    this._error = "";
    this._mode = "loading";
    this._idleReason = "";

    const streamCamera = this._streamCamera || this.camera;
    this._refreshPosterUrls(streamCamera, { cacheBust: false });
    const transports = preferredTransports(
      this._effectiveQuality,
      this.context
    );

    for (const transport of transports) {
      if (token !== this._startToken || !this._slotHeld) return;

      if (transport === "ha" && customElements.get("ha-camera-stream")) {
        this._mode = "ha";
        return;
      }

      if (transport === "webrtc" && typeof RTCPeerConnection !== "undefined") {
        const caps = await fetchCameraCapabilities(
          this.hass,
          streamCamera.entityId
        );
        if (token !== this._startToken || !this._slotHeld) return;
        const types = caps?.frontend_stream_types || [];
        const legacy = streamCamera.frontendStreamType;
        const wants =
          types.includes("web_rtc") ||
          legacy === "web_rtc" ||
          supportsStream(streamCamera);
        if (wants || !types.length) {
          try {
            await this._startWebRtc(token, streamCamera);
            if (token !== this._startToken || !this._slotHeld) return;
            this._mode = "webrtc";
            return;
          } catch (err) {
            console.warn("CCTV WebRTC failed, falling back", err);
          }
        }
      }

      if (transport === "hls") {
        try {
          const url = await fetchHlsStreamUrl(this.hass, streamCamera.entityId);
          if (token !== this._startToken || !this._slotHeld) return;
          if (url && this._canPlayHlsNatively()) {
            this._hlsUrl = url;
            this._mode = "hls";
            return;
          }
        } catch (err) {
          console.warn("CCTV HLS failed, falling back", err);
        }
      }

      if (transport === "mjpeg" && this._mjpegUrl) {
        this._mode = "mjpeg";
        return;
      }
    }

    this._mode = this._stillUrl ? "still" : "empty";
    if (!this._stillUrl) this._error = "No stream or preview available";
  }

  _canPlayHlsNatively() {
    const video = document.createElement("video");
    return (
      video.canPlayType("application/vnd.apple.mpegurl") !== "" ||
      video.canPlayType("application/x-mpegURL") !== ""
    );
  }

  async _startWebRtc(token, streamCamera) {
    const clientConfig =
      (await fetchWebRtcClientConfiguration(this.hass, streamCamera.entityId)) ||
      {};
    if (token !== this._startToken) return;

    const pc = new RTCPeerConnection(clientConfig.configuration || {});
    this._pc = pc;
    pc.addTransceiver("video", { direction: "recvonly" });
    try {
      pc.addTransceiver("audio", { direction: "recvonly" });
    } catch {
      /* video-only */
    }

    pc.ontrack = (event) => {
      const video = this.renderRoot?.querySelector("video#webrtc");
      if (!video) return;
      const [stream] = event.streams;
      video.srcObject = stream || new MediaStream([event.track]);
      video.muted = this.muted;
      video.play?.().catch(() => undefined);
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate || !this._sessionId) return;
      addWebRtcCandidate(
        this.hass,
        streamCamera.entityId,
        this._sessionId,
        event.candidate.toJSON()
      ).catch(() => undefined);
    };

    const offer = await pc.createOffer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: true,
    });
    await pc.setLocalDescription(offer);

    this._unsubWebRtc = await subscribeWebRtcOffer(
      this.hass,
      streamCamera.entityId,
      offer.sdp,
      async (event) => {
        if (token !== this._startToken || !this._pc) return;
        if (event.type === "session") {
          this._sessionId = event.session_id;
          return;
        }
        if (event.type === "answer") {
          await this._pc.setRemoteDescription({
            type: "answer",
            sdp: event.answer,
          });
          return;
        }
        if (event.type === "candidate" && event.candidate) {
          try {
            await this._pc.addIceCandidate(event.candidate);
          } catch {
            /* ignore */
          }
          return;
        }
        if (event.type === "error") {
          this._error = event.message || event.code || "WebRTC error";
          this._mode = this._mjpegUrl ? "mjpeg" : this._stillUrl ? "still" : "empty";
        }
      }
    );
  }

  _emitMediaAspect(width, height) {
    const entityId = this.camera?.entityId;
    const w = Number(width);
    const h = Number(height);
    if (!entityId || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      return;
    }
    const aspect = w / h;
    if (this._lastEmittedAspect && Math.abs(this._lastEmittedAspect - aspect) < 0.01) {
      return;
    }
    this._lastEmittedAspect = aspect;
    this.dispatchEvent(
      new CustomEvent("cctv-media-aspect", {
        detail: { entityId, width: w, height: h, aspect },
        bubbles: true,
        composed: true,
      })
    );
  }

  _probeMediaSize() {
    const root = this.renderRoot;
    if (!root) return;
    const video = root.querySelector("video");
    if (video) {
      if (video.videoWidth && video.videoHeight) {
        this._emitMediaAspect(video.videoWidth, video.videoHeight);
      }
      return;
    }
    const img = root.querySelector("img.media");
    if (img && img.naturalWidth && img.naturalHeight) {
      this._emitMediaAspect(img.naturalWidth, img.naturalHeight);
      return;
    }
    const haStream = root.querySelector("ha-camera-stream");
    const nestedVideo = haStream?.shadowRoot?.querySelector?.("video");
    if (nestedVideo?.videoWidth && nestedVideo?.videoHeight) {
      this._emitMediaAspect(nestedVideo.videoWidth, nestedVideo.videoHeight);
      return;
    }
    const nestedImg = haStream?.shadowRoot?.querySelector?.("img");
    if (nestedImg?.naturalWidth && nestedImg?.naturalHeight) {
      this._emitMediaAspect(nestedImg.naturalWidth, nestedImg.naturalHeight);
    }
  }

  render() {
    if (this._mode === "loading") {
      return html`<div class="placeholder">Connecting…</div>`;
    }
    if (this._mode === "empty") {
      return html`<div class="error">${this._error || "No preview"}</div>`;
    }

    let badge = this._mode;
    if (this._queued) badge = "queued";
    else if (!this._slotHeld && this._mode === "still") badge = this._idleReason || "idle";

    return html`
      ${this._renderMedia()}
      <span class="badge">${badge}</span>
    `;
  }

  _renderMedia() {
    const streamCamera = this._streamCamera || this.camera;
    if (this._mode === "ha") {
      // HA letterboxes only when fitMode=contain AND aspectRatio is the tile box
      // ratio. Without aspectRatio, portrait MJPEG stays intrinsically tall and
      // is clipped by overflow:hidden (looks like crop).
      const fitMode = this.mosaic || this.large ? "contain" : "cover";
      const tileAspect =
        this._tileAspect > 0
          ? this._tileAspect
          : this.clientWidth > 1 && this.clientHeight > 1
            ? this.clientWidth / this.clientHeight
            : undefined;
      const stateObj = this._stableStateObj || streamCamera?.stateObj;
      return html`
        <ha-camera-stream
          class="media"
          .hass=${this.hass}
          .stateObj=${stateObj}
          .muted=${this.muted}
          .controls=${this.controls}
          .fitMode=${fitMode}
          .aspectRatio=${tileAspect}
          @loadeddata=${() => {
            this._probeMediaSize();
            this._forceNestedContain();
          }}
        ></ha-camera-stream>
      `;
    }
    if (this._mode === "webrtc") {
      return html`
        <video
          id="webrtc"
          class="media"
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${(e) =>
            this._emitMediaAspect(e.target.videoWidth, e.target.videoHeight)}
        ></video>
      `;
    }
    if (this._mode === "hls") {
      return html`
        <video
          class="media"
          src=${this._hlsUrl}
          autoplay
          playsinline
          .muted=${this.muted}
          ?controls=${this.controls}
          @loadedmetadata=${(e) =>
            this._emitMediaAspect(e.target.videoWidth, e.target.videoHeight)}
        ></video>
      `;
    }
    if (this._mode === "mjpeg") {
      return html`
        <img
          class="media"
          alt=""
          src=${this._mjpegUrl}
          @load=${(e) =>
            this._emitMediaAspect(e.target.naturalWidth, e.target.naturalHeight)}
        />
      `;
    }
    if (this._mode === "still") {
      return html`
        <img
          class="media"
          alt=""
          src=${this._stillUrl}
          @load=${(e) =>
            this._emitMediaAspect(e.target.naturalWidth, e.target.naturalHeight)}
        />
      `;
    }
    return nothing;
  }
}

if (!customElements.get("cctv-stream-player")) {
  customElements.define("cctv-stream-player", CctvStreamPlayer);
}
