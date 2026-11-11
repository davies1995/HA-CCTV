/** Sanity checks for detection playback helpers (no HA required). */
import {
  clipCameraId,
  clipPositionAtTime,
  clipTimeBounds,
  parseClipStartedMs,
  playableCameraIdsFromSession,
  playbackTracksFromSession,
  playbackWindow,
  resolvePlaybackCameraIds,
} from "../src/detection-playback.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(parseClipStartedMs("20261110T121500Z") === Date.parse("2026-11-10T12:15:00Z"), "compact stamp");
assert(Number.isFinite(parseClipStartedMs("2026-11-10T12:15:00+00:00")), "iso stamp");

const bounds = clipTimeBounds({ started: "20261110T121500Z", duration: 30 });
assert(bounds.start === Date.parse("2026-11-10T12:15:00Z"), "clip start");
assert(bounds.end === bounds.start + 30_000, "clip end");

const session = {
  started: "2026-11-10T12:14:55Z",
  ended: "2026-11-10T12:16:30Z",
  clips: [
    {
      camera_id: "camera.doorbell",
      url: "/a.mp4",
      kind: "video",
      seq: 1,
      started: "20261110T121455Z",
      duration: 30,
      size: 100,
    },
    {
      camera_id: "camera.driveway",
      url: "/b.mp4",
      kind: "video",
      seq: 1,
      started: "20261110T121455Z",
      duration: 30,
      size: 100,
    },
    {
      camera_id: "camera.backyard",
      url: "/c.mp4",
      kind: "video",
      seq: 1,
      started: "20261110T121455Z",
      duration: 30,
      size: 100,
    },
    {
      camera_id: "camera.doorbell",
      url: "/a2.mp4",
      kind: "video",
      seq: 2,
      started: "20261110T121525Z",
      duration: 30,
      size: 100,
    },
  ],
};

const visible = ["camera.doorbell", "camera.driveway"];
const tracks = playbackTracksFromSession({}, session, visible);
assert(tracks.length === 2, "only visible cams");
assert(tracks[0].cameraId === "camera.doorbell", "order 1");
assert(tracks[1].cameraId === "camera.driveway", "order 2");
assert(tracks[0].items.length === 2, "doorbell chunks");

const at = Date.parse("2026-11-10T12:15:10Z");
const pos = clipPositionAtTime(tracks[0], at);
assert(pos.index === 0, "first chunk");
assert(Math.abs(pos.seekSec - 15) < 0.05, `seek ~15 got ${pos.seekSec}`);

const later = clipPositionAtTime(tracks[0], Date.parse("2026-11-10T12:15:40Z"));
assert(later.index === 1, "second chunk");

const win = playbackWindow(session, {
  start: Date.parse("2026-11-10T12:15:00Z"),
  end: Date.parse("2026-11-10T12:15:45Z"),
});
assert(win.start === Date.parse("2026-11-10T12:15:00Z"), "window start");
assert(win.end === Date.parse("2026-11-10T12:15:45Z"), "window end");

assert(
  clipCameraId({
    path: "/media/cctv_dashboard/recordings/20261110T121500Z_ab12cd34_doorbell_001_20261110T121500Z.mp4",
  }) === "camera.doorbell",
  "camera id from filename"
);

const playableIds = playableCameraIdsFromSession(session);
assert(playableIds.includes("camera.doorbell"), "playable doorbell");
assert(playableIds.includes("camera.driveway"), "playable driveway");

const preferSelected = resolvePlaybackCameraIds(
  session,
  ["camera.driveway", "camera.missing"],
  4
);
assert(preferSelected.cameraIds[0] === "camera.driveway", "prefer selected with clips");
assert(preferSelected.usedFallback === false, "no fallback when match");

const emptySel = resolvePlaybackCameraIds(session, [], 2);
assert(emptySel.reason === "empty-selection", "empty selection reason");
assert(emptySel.cameraIds.length === 2, "empty selection uses playable cams");

const noOverlap = resolvePlaybackCameraIds(
  session,
  ["camera.not_recorded"],
  4
);
assert(noOverlap.reason === "no-selected-clips", "no overlap reason");
assert(noOverlap.cameraIds.includes("camera.doorbell"), "fallback has clips");

const emptyVideos = {
  clips: [
    {
      camera_id: "camera.front",
      url: "/empty.mp4",
      kind: "video",
      size: 0,
      seq: 1,
      started: "20261110T121455Z",
      duration: 30,
    },
  ],
  cameras: ["camera.front"],
};
assert(playableCameraIdsFromSession(emptyVideos).length === 0, "size 0 video skipped");
assert(
  resolvePlaybackCameraIds(emptyVideos, ["camera.front"], 4).cameraIds.length === 0,
  "no fallback when nothing playable"
);

console.log("detection-playback checks ok");
