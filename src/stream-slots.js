/** Global concurrent live-stream slot limiter for the CCTV dashboard. */

export const DEFAULT_MAX_STREAMS = 4;

export const STREAM_PRIORITY = {
  EAGER: 100,
  VISIBLE: 50,
};

class StreamSlotManager {
  constructor(max = DEFAULT_MAX_STREAMS) {
    this.max = max;
    /** @type {Map<string, { priority: number, onRevoke: Function }>} */
    this.holders = new Map();
    /** @type {Array<{ id: string, priority: number, onGrant: Function, onRevoke: Function }>} */
    this.queue = [];
  }

  setMax(max) {
    const next = Math.max(1, Number(max) || DEFAULT_MAX_STREAMS);
    if (next === this.max) return;
    this.max = next;
    this._drain();
    while (this.holders.size > this.max) {
      this._revokeLowest();
    }
  }

  activeCount() {
    return this.holders.size;
  }

  has(id) {
    return this.holders.has(id);
  }

  /**
   * Request a live slot. Returns true if granted immediately.
   * Otherwise queued until a slot frees or a lower-priority holder is revoked.
   */
  request(id, priority, { onGrant, onRevoke }) {
    if (!id) return false;

    // Already holding — refresh callbacks/priority.
    if (this.holders.has(id)) {
      const holder = this.holders.get(id);
      holder.priority = priority;
      holder.onRevoke = onRevoke;
      this.queue = this.queue.filter((item) => item.id !== id);
      return true;
    }

    // Already queued — update entry.
    const existing = this.queue.find((item) => item.id === id);
    if (existing) {
      existing.priority = priority;
      existing.onGrant = onGrant;
      existing.onRevoke = onRevoke;
      this._drain();
      return this.holders.has(id);
    }

    if (this.holders.size < this.max) {
      this.holders.set(id, { priority, onRevoke });
      // Caller starts playback when request() returns true.
      return true;
    }

    const lowest = this._lowestHolder();
    if (lowest && priority > lowest.priority) {
      this._revoke(lowest.id);
      this.holders.set(id, { priority, onRevoke });
      return true;
    }

    this.queue.push({ id, priority, onGrant, onRevoke });
    this.queue.sort((a, b) => b.priority - a.priority);
    return false;
  }

  release(id) {
    if (!id) return;
    this.queue = this.queue.filter((item) => item.id !== id);
    if (!this.holders.has(id)) return;
    this.holders.delete(id);
    this._drain();
  }

  /** Drop every holder/queue entry (panel suspend / hard reset). */
  releaseAll() {
    const ids = [...this.holders.keys()];
    this.queue = [];
    for (const id of ids) {
      const holder = this.holders.get(id);
      this.holders.delete(id);
      try {
        holder?.onRevoke?.();
      } catch (err) {
        console.warn("CCTV stream slot revoke failed", err);
      }
    }
  }

  _lowestHolder() {
    let lowest = null;
    for (const [id, holder] of this.holders) {
      if (!lowest || holder.priority < lowest.priority) {
        lowest = { id, priority: holder.priority };
      }
    }
    return lowest;
  }

  _revoke(id) {
    const holder = this.holders.get(id);
    if (!holder) return;
    this.holders.delete(id);
    try {
      holder.onRevoke?.();
    } catch (err) {
      console.warn("CCTV stream slot revoke failed", err);
    }
  }

  _revokeLowest() {
    const lowest = this._lowestHolder();
    if (lowest) this._revoke(lowest.id);
  }

  _drain() {
    while (this.holders.size < this.max && this.queue.length) {
      const next = this.queue.shift();
      this.holders.set(next.id, {
        priority: next.priority,
        onRevoke: next.onRevoke,
      });
      try {
        next.onGrant?.();
      } catch (err) {
        console.warn("CCTV stream slot grant failed", err);
        this.holders.delete(next.id);
      }
    }
  }
}

/** Shared across panel + all cards in the same browser tab. */
export const streamSlots = new StreamSlotManager(DEFAULT_MAX_STREAMS);
