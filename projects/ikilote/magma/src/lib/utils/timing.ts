export class Timing {
    private static timers: Record<number, { timer: NodeJS.Timeout; func: () => void }> = {};
    private static inc = 0;
    static start(cb: () => void, gap: number): number {
        let key = Timing.inc++;
        Timing.timers[key] = { timer: setInterval(cb, gap), func: cb };
        return key;
    }
    static stop(id: number) {
        if (Timing.timers[id]) {
            clearInterval(Timing.timers[id].timer);
            delete Timing.timers[id];
        }
    }
    static change(id: number, delay: number) {
        if (Timing.timers[id]) {
            clearInterval(Timing.timers[id].timer);
            Timing.timers[id].timer = setInterval(Timing.timers[id].func, delay);
        }
    }
}

export const wait = async (delay: number) =>
    await new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
