/**
 * Sanity checks for detection playback control state machine (HC-75).
 * Pure logic mirrors src/cctv-view.js Play/Pause/Restart/Back-to-live.
 */

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

/**
 * @param {{ playing?: boolean, paused?: boolean } | null} pb
 */
function playPauseLabel(pb) {
  if (!pb) return null;
  if (pb.playing && !pb.paused) return "Pause";
  return "Play";
}

/**
 * @param {{ playing?: boolean, paused?: boolean } | null} pb
 */
function showRestart(pb) {
  return Boolean(pb?.playing);
}

/**
 * Simulate control transitions without DOM.
 */
function selectSession() {
  return { playing: false, paused: false, labels: ["person"] };
}

function start(pb) {
  return { ...pb, playing: true, paused: false };
}

function pauseClips(pb) {
  assert(pb.playing, "pause requires playing mosaic");
  return { ...pb, paused: true };
}

function resume(pb) {
  assert(pb.playing, "resume requires playing mosaic");
  return { ...pb, paused: false };
}

/**
 * Restart remounts media (playbackMountGen++) and resets index/seek to window start.
 * @param {{ playing?: boolean, paused?: boolean, mountGen?: number, index?: number }} pb
 * @param {{ index?: number, seekSec?: number }} [pos]
 */
function restart(pb, pos = { index: 0, seekSec: 0 }) {
  assert(pb.tracks || true, "restart needs session");
  return {
    ...pb,
    playing: true,
    paused: false,
    mountGen: (pb.mountGen || 0) + 1,
    index: pos.index ?? 0,
    seekSec: pos.seekSec ?? 0,
  };
}

function returnToLive(_pb) {
  return null;
}

let pb = selectSession();
assert(playPauseLabel(pb) === "Play", "selected → Play");
assert(!showRestart(pb), "no Restart before start");

pb = start(pb);
assert(playPauseLabel(pb) === "Pause", "playing → Pause");
assert(showRestart(pb), "Restart while on clips");

pb = pauseClips(pb);
assert(pb.playing === true && pb.paused === true, "pause keeps clip tiles");
assert(playPauseLabel(pb) === "Play", "paused → Play");
assert(showRestart(pb), "Restart while paused");

pb = resume(pb);
assert(pb.paused === false, "resume clears paused");
assert(playPauseLabel(pb) === "Pause", "resumed → Pause");

pb = { ...pb, mountGen: 0, index: 2, seekSec: 12 };
pb = restart(pb, { index: 0, seekSec: 0 });
assert(pb.playing && !pb.paused, "restart plays from start");
assert(pb.mountGen === 1, "restart bumps media mount gen");
assert(pb.index === 0 && pb.seekSec === 0, "restart seeks window start");

// Restart from EOF / finished-paused also remounts.
pb = pauseClips({ ...pb, index: 3, seekSec: 40, mountGen: 1 });
pb = restart(pb, { index: 0, seekSec: 0 });
assert(pb.mountGen === 2 && pb.index === 0, "restart from finished remounts");

pb = returnToLive(pb);
assert(pb === null, "Back to live clears playback session");
assert(playPauseLabel(pb) === null, "no Play/Pause without session");

// Finished-all-cams should pause in place (not return to live).
pb = start(selectSession());
pb = pauseClips(pb);
assert(pb.playing === true, "finished → still on clip mosaic");
assert(returnToLive(pb) === null, "only Back to live exits");

console.log("playback-controls checks ok");
