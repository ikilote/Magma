import { Subscription } from 'rxjs';

export class Subscriptions {
    private listener = new Subscription();

    public static instance() {
        return new Subscriptions();
    }

    private size = 0;

    get length() {
        return this.size;
    }

    private constructor() {}

    push(...list: Subscription[]) {
        list.forEach(sub => this.listener.add(sub));
        this.size += list.length;
    }

    clear() {
        this.listener.unsubscribe();
        this.size = 0;
    }
}
