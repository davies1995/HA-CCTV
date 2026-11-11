/** Sanity checks for concurrent stream slot manager. */
import { streamSlots } from "../src/stream-slots.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

streamSlots.releaseAll();
streamSlots.setMax(2);

let grants = 0;
let revokes = 0;
const onGrant = () => {
  grants += 1;
};
const onRevoke = () => {
  revokes += 1;
};

assert(streamSlots.request("camera.a", 50, { onGrant, onRevoke }) === true, "a granted");
assert(streamSlots.request("camera.b", 50, { onGrant, onRevoke }) === true, "b granted");
assert(streamSlots.request("camera.c", 50, { onGrant, onRevoke }) === false, "c queued");
assert(streamSlots.activeCount() === 2, "two holders");

// Substream id change with higher priority steals a slot (onRevoke expected).
assert(streamSlots.request("camera.a_sub", 100, { onGrant, onRevoke }) === true, "sub steals");
assert(revokes === 1, "preempt revokes one holder");
assert(streamSlots.activeCount() === 2, "still two after steal");
assert(streamSlots.has("camera.a") === false || streamSlots.has("camera.b") === false, "lowest revoked");

const revokesBeforeClear = revokes;
streamSlots.releaseAll();
assert(streamSlots.activeCount() === 0, "releaseAll clears holders");
assert(revokes === revokesBeforeClear, "releaseAll must not invoke onRevoke");

assert(streamSlots.request("camera.a", 50, { onGrant, onRevoke }) === true, "a after reset");
assert(streamSlots.request("camera.b", 50, { onGrant, onRevoke }) === true, "b after reset");
assert(streamSlots.request("camera.c", 50, { onGrant, onRevoke }) === false, "c queued again");

streamSlots.release("camera.a");
assert(streamSlots.activeCount() === 2, "drain grants queued c");
assert(streamSlots.has("camera.c") === true, "c promoted");

streamSlots.releaseAll();
console.log("stream-slots checks ok");
