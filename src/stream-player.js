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
    eager: { type: Boolean },
    posterOnly: { type: Boolean, attribute: "poster-only" },
    _mode: { state: true },
    _error: { state: true },
    _hlsUrl: { state: true },
    _mjpegUrl: { state: true },
    _stillUrl: { state: true },
    _visible: { state: true },
    _slotHeld: { state: true },
    _queued: { state: true },
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

    .media,
    ha-camera-stream,
    video,
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
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
    this.eager = false;
    this.posterOnly = false;
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
    this._slotId = "";
    this._streamCamera = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._bindObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unbindObserver();
    this._releaseSlot();
    this._stopLive();
  }

  updated(changed) {
    if (changed.has("eager") || changed.has("posterOnly")) {
      this._bindObserver();
    }
    if (
      changed.has("hass") ||
      changed.has("camera") ||
      changed.has("config") ||
      changed.has("quality") ||
      changed.has("context") ||
      changed.has("eager") ||
      changed.has("posterOnly")
    ) {
      this._reconcilePlayback();
    }
    if (changed.has("muted")) {
      const video = this.renderRoot?.querySelector("video");
      if (video) video.muted = this.muted;
    }
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
    if (this.posterOnly) return false;
    if (this.eager) return true;
    return this._visible;
  }

  _refreshPosterUrls(streamCamera) {
    const cam = streamCamera || this.camera;
    if (!this.hass || !cam?.stateObj) {
      this._stillUrl = "";
      this._mjpegUrl = "";
      return;
    }
    this._stillUrl = cameraPreviewUrl(this.hass, cam, true);
    this._mjpegUrl = cameraMjpegStreamUrl(this.hass, cam);
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
        this._pc.close();
      } catch {
        /* ignore */
      }
      this._pc = null;
    }
    this._sessionId = null;
    this._hlsUrl = "";
  }

  _releaseSlot() {
    if (this._slotId) {
      streamSlots.release(this._slotId);
    }
    this._slotHeld = false;
    this._queued = false;
  }

  _showIdle(reason = "idle") {
    this._stopLive();
    this._refreshPosterUrls(this._streamCamera || this.camera);
    if (!this.hass || !this.camera?.stateObj) {
      this._mode = "empty";
      return;
    }
    this._mode = this._stillUrl ? "still" : "empty";
    this._error = this._stillUrl ? "" : "No preview";
    this._idleReason = reason;
  }

  _reconcilePlayback() {
    const max = Number(this.config?.max_streams);
    if (Number.isFinite(max) && max > 0) {
      streamSlots.setMax(max);
    }

    if (!this.hass || !this.camera?.stateObj) {
      this._releaseSlot();
      this._stopLive();
      this._mode = "empty";
      this._playKey = "";
      return;
    }

    this._streamCamera = resolveStreamCamera(
      this.hass,
      this.camera,
      this.config,
      this._effectiveQuality,
      this.context
    );
    this._slotId = this._streamCamera.entityId || this.camera.entityId;
    this._refreshPosterUrls(this._streamCamera);

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
    if (
      this._slotHeld &&
      this._playKey === playKey &&
      this._mode !== "loading" &&
      this._mode !== "empty" &&
      !(this._mode === "still" && this._queued)
    ) {
      return;
    }

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
    this._refreshPosterUrls(streamCamera);
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
      return html`
        <ha-camera-stream
          class="media"
          .hass=${this.hass}
          .stateObj=${streamCamera.stateObj}
          .muted=${this.muted}
          .controls=${this.controls}
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
        ></video>
      `;
    }
    if (this._mode === "mjpeg") {
      return html`<img class="media" alt="" src=${this._mjpegUrl} />`;
    }
    if (this._mode === "still") {
      return html`<img class="media" alt="" src=${this._stillUrl} />`;
    }
    return nothing;
  }
}

if (!customElements.get("cctv-stream-player")) {
  customElements.define("cctv-stream-player", CctvStreamPlayer);
}
