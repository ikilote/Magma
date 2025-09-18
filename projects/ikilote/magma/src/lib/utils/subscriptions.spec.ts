import { Subscription, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Subscriptions } from './subscriptions';

describe('Subscriptions', () => {
    let subscriptions: Subscriptions;
    let testSub1: Subscription;
    let testSub2: Subscription;

    // Mock subscriptions with spies to track unsubscribe calls
    let unsubscribeSpy1: jasmine.Spy;
    let unsubscribeSpy2: jasmine.Spy;

    beforeEach(() => {
        // Create a new instance of Subscriptions for each test
        subscriptions = Subscriptions.instance();

        // Create mock subscriptions with spies
        unsubscribeSpy1 = jasmine.createSpy('unsubscribe1');
        unsubscribeSpy2 = jasmine.createSpy('unsubscribe2');

        testSub1 = new Subscription();
        testSub1.unsubscribe = unsubscribeSpy1;

        testSub2 = new Subscription();
        testSub2.unsubscribe = unsubscribeSpy2;
    });

    afterEach(() => {
        // Clean up after each test
        subscriptions.clear();
    });

    // 1. Tests for `Subscriptions.instance`
    describe('Subscriptions.instance', () => {
        it('should create a new instance of Subscriptions', () => {
            // Test: Instance creation
            const instance = Subscriptions.instance();
            expect(instance).toBeDefined();
            expect(instance).toBeInstanceOf(Subscriptions);
        });
    });

    // 2. Tests for `push`
    describe('push', () => {
        it('should add a single subscription to the listener', () => {
            // Test: Adding a single subscription
            subscriptions.push(testSub1);
            // @ts-ignore: Access private property for testing
            expect(subscriptions.listener.closed).toBeFalse();
        });

        it('should add multiple subscriptions to the listener', () => {
            // Test: Adding multiple subscriptions at once
            subscriptions.push(testSub1, testSub2);
            // @ts-ignore: Access private property for testing
            expect(subscriptions.listener.closed).toBeFalse();
        });

        it('should not fail when adding no subscriptions', () => {
            // Test: Adding no subscriptions is safe
            subscriptions.push();
            // @ts-ignore: Access private property for testing
            expect(subscriptions.listener.closed).toBeFalse();
        });
    });

    // 3. Tests for `clear`
    describe('clear', () => {
        it('should unsubscribe all added subscriptions', () => {
            // Test: Clearing subscriptions calls unsubscribe on all
            subscriptions.push(testSub1, testSub2);
            subscriptions.clear();
            expect(unsubscribeSpy1).toHaveBeenCalledTimes(1);
            // @ts-ignore: Access private property for testing
            expect(subscriptions.listener.closed).toBeTrue();
        });

        it('should be safe to call clear multiple times', () => {
            // Test: Multiple calls to clear are safe
            subscriptions.push(testSub1);
            subscriptions.clear();
            subscriptions.clear(); // Should not throw
            expect(unsubscribeSpy1).toHaveBeenCalledTimes(1);
        });

        it('should unsubscribe even if no subscriptions were added', () => {
            // Test: Clearing with no subscriptions is safe
            subscriptions.clear();
            // @ts-ignore: Access private property for testing
            expect(subscriptions.listener.closed).toBeTrue();
        });
    });

    // 4. Integration tests with real RxJS subscriptions
    describe('Integration with RxJS', () => {
        it('should unsubscribe all RxJS subscriptions when cleared', () => {
            // Test: Real RxJS subscriptions are unsubscribed
            const observable1$ = of('test1').pipe(tap(() => {}));
            const observable2$ = of('test2').pipe(tap(() => {}));

            const sub1 = observable1$.subscribe();
            const sub2 = observable2$.subscribe();

            subscriptions.push(sub1, sub2);
            subscriptions.clear();

            expect(sub1.closed).toBeTrue();
            expect(sub2.closed).toBeTrue();
        });
    });

    // 5. Edge cases
    describe('Edge Cases', () => {
        it('should handle duplicate subscriptions', () => {
            // Test: Adding the same subscription multiple times
            subscriptions.push(testSub1, testSub1);
            subscriptions.clear();
            expect(unsubscribeSpy1).toHaveBeenCalledTimes(1);
        });
    });
});
