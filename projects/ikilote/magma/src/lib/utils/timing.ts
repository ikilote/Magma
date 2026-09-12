/**
 * Static manager for recurring `setInterval` timers identified by numeric IDs.
 *
 * Each timer is stored in a shared registry so it can be paused, rescheduled,
 * or cleared by ID without keeping external references to `NodeJS.Timeout` handles.
 *
 * @example
 * const id = Timing.start(() => doWork(), 1000);
 * Timing.change(id, 500); // speed up
 * Timing.stop(id);        // cancel
 */
export class Timing {
    private static timers: Record<number, { timer: NodeJS.Timeout; func: () => void }> = {};
    private static inc = 0;

    /**
     * Starts a new recurring timer.
     *
     * @param cb  Callback to invoke on each tick.
     * @param gap Interval in milliseconds.
     * @returns Numeric ID that can be passed to `stop` or `change`.
     */
    static start(cb: () => void, gap: number): number {
        const key = Timing.inc++;
        Timing.timers[key] = { timer: setInterval(cb, gap), func: cb };
        return key;
    }

    /**
     * Stops and removes the timer with the given ID.
     * Does nothing if the ID does not exist.
     *
     * @param id Timer ID returned by `start`.
     */
    static stop(id: number) {
        if (Timing.timers[id]) {
            clearInterval(Timing.timers[id].timer);
            delete Timing.timers[id];
        }
    }

    /**
     * Changes the interval of an existing timer without changing its callback.
     * Does nothing if the ID does not exist.
     *
     * @param id    Timer ID returned by `start`.
     * @param delay New interval in milliseconds.
     */
    static change(id: number, delay: number) {
        if (Timing.timers[id]) {
            clearInterval(Timing.timers[id].timer);
            Timing.timers[id].timer = setInterval(Timing.timers[id].func, delay);
        }
    }

    /** Stops all active timers. Primarily intended for test teardown. */
    static stopAll() {
        Object.keys(Timing.timers).forEach(key => {
            Timing.stop(parseInt(key));
        });
    }
}

/**
 * Returns a promise that resolves after `delay` milliseconds.
 * Useful for introducing deliberate pauses in async flows or tests.
 *
 * @param delay Duration in milliseconds.
 * @returns A promise that resolves (with `void`) once the timeout fires.
 */
export const wait = async (delay: number) =>
    await new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
