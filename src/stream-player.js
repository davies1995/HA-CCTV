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

/**
 * Live camera tile: prefer HA native stream element, then WebRTC / HLS / MJPEG / still.
 *
 * Mosaic tiles should leave `eager` unset/false so IntersectionObserver only
 * opens live streams while the tile is (near) visible. Detail / single-camera
 * views set `eager` to keep the stream active while mounted.
 */
export class CctvStreamPlayer extends LitElement {
  static properties = {
    hass: { attribute: false },
    camera: { attribute: false },
    muted: { type: Boolean },
    controls: { type: Boolean },
    large: { type: Boolean, reflect: true },
    /** When true, stream immediately while connected (detail / single card). */
    eager: { type: Boolean },
    posterOnly: { type: Boolean, attribute: "poster-only" },
    _mode: { state: true },
    _error: { state: true },
    _hlsUrl: { state: true },
    _mjpegUrl: { state: true },
    _stillUrl: { state: true },
    _visible: { state: true },
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
    this._pc = null;
    this._unsubWebRtc = null;
    this._sessionId = null;
    this._startToken = 0;
    this._observer = null;
    this._live = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._bindObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unbindObserver();
    this._stopLive();
  }

  updated(changed) {
    if (changed.has("eager")) {
      this._bindObserver();
      this._reconcilePlayback();
    }
    if (
      changed.has("hass") ||
      changed.has("camera") ||
      changed.has("posterOnly")
    ) {
      this._reconcilePlayback();
    }
    if (changed.has("muted")) {
      const video = this.renderRoot?.querySelector("video");
      if (video) video.muted = this.muted;
    }
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
      {
        root: null,
        // Start a bit before the tile enters the viewport.
        rootMargin: "120px 0px",
        threshold: 0.15,
      }
    );
    this._observer.observe(this);
  }

  _unbindObserver() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  _shouldStream() {
    if (this.posterOnly) return false;
    if (this.eager) return true;
    return this._visible;
  }

  _refreshPosterUrls() {
    if (!this.hass || !this.camera?.stateObj) {
      this._stillUrl = "";
      this._mjpegUrl = "";
      return;
    }
    this._stillUrl = cameraPreviewUrl(this.hass, this.camera, true);
    this._mjpegUrl = cameraMjpegStreamUrl(this.hass, this.camera);
  }

  _stopLive() {
    this._live = false;
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

  _showIdlePoster() {
    this._stopLive();
    this._refreshPosterUrls();
    if (!this.hass || !this.camera?.stateObj) {
      this._mode = "empty";
      return;
    }
    this._mode = this._stillUrl ? "still" : "empty";
    if (!this._stillUrl) this._error = "No preview";
  }

  _reconcilePlayback() {
    if (!this.hass || !this.camera?.stateObj) {
      this._stopLive();
      this._mode = "empty";
      return;
    }
    if (!this._shouldStream()) {
      this._showIdlePoster();
      return;
    }
    this._startLive();
  }

  async _startLive() {
    this._stopLive();
    const token = this._startToken;
    this._live = true;
    this._error = "";
    this._mode = "loading";
    this._refreshPosterUrls();

    // 1) Prefer HA's own stream element when already loaded by the frontend.
    if (customElements.get("ha-camera-stream")) {
      if (token !== this._startToken) return;
      this._mode = "ha";
      return;
    }

    const caps = await fetchCameraCapabilities(this.hass, this.camera.entityId);
    if (token !== this._startToken) return;
    const types = caps?.frontend_stream_types || [];
    const legacy = this.camera.frontendStreamType;
    const wantsWebRtc = types.includes("web_rtc") || legacy === "web_rtc";
    const wantsHls =
      types.includes("hls") || legacy === "hls" || supportsStream(this.camera);

    // 2) WebRTC via Core websocket API
    if (wantsWebRtc && typeof RTCPeerConnection !== "undefined") {
      try {
        await this._startWebRtc(token);
        if (token !== this._startToken) return;
        this._mode = "webrtc";
        return;
      } catch (err) {
        console.warn("CCTV WebRTC failed, falling back", err);
      }
    }

    // 3) HLS (native Safari / some browsers); else fall through
    if (wantsHls) {
      try {
        const url = await fetchHlsStreamUrl(this.hass, this.camera.entityId);
        if (token !== this._startToken) return;
        if (url && this._canPlayHlsNatively()) {
          this._hlsUrl = url;
          this._mode = "hls";
          return;
        }
      } catch (err) {
        console.warn("CCTV HLS failed, falling back", err);
      }
    }

    // 4) MJPEG continuous stream
    if (this._mjpegUrl) {
      this._mode = "mjpeg";
      return;
    }

    // 5) Still fallback
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

  async _startWebRtc(token) {
    const clientConfig =
      (await fetchWebRtcClientConfiguration(this.hass, this.camera.entityId)) ||
      {};
    if (token !== this._startToken) return;

    const pc = new RTCPeerConnection(clientConfig.configuration || {});
    this._pc = pc;
    pc.addTransceiver("video", { direction: "recvonly" });
    try {
      pc.addTransceiver("audio", { direction: "recvonly" });
    } catch {
      /* some cameras are video-only */
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
        this.camera.entityId,
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
      this.camera.entityId,
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
            /* ignore late candidates */
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

    const badge =
      this._live && this._mode !== "still"
        ? this._mode
        : this._shouldStream()
          ? this._mode
          : "idle";

    return html`
      ${this._renderMedia()}
      <span class="badge">${badge}</span>
    `;
  }

  _renderMedia() {
    if (this._mode === "ha") {
      return html`
        <ha-camera-stream
          class="media"
          .hass=${this.hass}
          .stateObj=${this.camera.stateObj}
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
