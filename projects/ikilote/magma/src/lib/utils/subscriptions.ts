import { Subscription } from 'rxjs';

/**
 * A lightweight container for RxJS `Subscription` objects that simplifies
 * bulk teardown. Instances must be created via the static `Subscriptions.instance()` factory.
 *
 * @example
 * const subs = Subscriptions.instance();
 * subs.push(obs1$.subscribe(...), obs2$.subscribe(...));
 * // later:
 * subs.clear();
 */
export class Subscriptions {
    private listener = new Subscription();

    /**
     * Creates and returns a new `Subscriptions` instance.
     */
    public static instance() {
        return new Subscriptions();
    }

    private size = 0;

    get length() {
        return this.size;
    }

    /** Private on purpose: instances are obtained through the static API. */
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    private constructor() {}

    /**
     * Adds one or more subscriptions to the internal pool.
     *
     * @param list Subscriptions to track.
     */
    push(...list: Subscription[]) {
        list.forEach(sub => this.listener.add(sub));
        this.size += list.length;
    }

    /**
     * Unsubscribes from all tracked subscriptions and resets the internal counter.
     */
    clear() {
        this.listener.unsubscribe();
        this.size = 0;
    }
}
