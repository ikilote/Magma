import { Timing, wait } from './timing';

describe('Timing', () => {
    // Helper to track callback calls
    let callbackSpy: jasmine.Spy;
    let testId: number;

    beforeEach(() => {
        callbackSpy = jasmine.createSpy('callback');
        testId = -1;
    });

    afterEach(() => {
        // Clean up all timers after each test
        Object.keys(Timing['timers']).forEach(key => {
            Timing.stop(parseInt(key));
        });
    });

    // 1. Tests for `Timing.start`
    describe('Timing.start', () => {
        it('should start a timer and return a unique ID', () => {
            // Test: Starting a timer returns a valid ID
            testId = Timing.start(callbackSpy, 100);
            expect(testId).toBeGreaterThanOrEqual(0);
            expect(Timing['timers'][testId]).toBeDefined();
        });

        it('should call the callback repeatedly at the specified interval', async () => {
            // Test: Callback is called at the specified interval
            testId = Timing.start(callbackSpy, 50);
            await wait(150);
            expect(callbackSpy).toHaveBeenCalledTimes(3);
        });
    });

    // 2. Tests for `Timing.stop`
    describe('Timing.stop', () => {
        it('should stop the timer and remove it from the registry', async () => {
            // Test: Stopping a timer removes it and stops further calls
            testId = Timing.start(callbackSpy, 50);
            await wait(60);
            Timing.stop(testId);
            await wait(60);
            expect(callbackSpy).toHaveBeenCalledTimes(1);
            expect(Timing['timers'][testId]).toBeUndefined();
        });

        it('should do nothing if the timer ID does not exist', () => {
            // Test: Stopping a non-existent timer is safe
            Timing.stop(9999);
            expect(Object.keys(Timing['timers']).length).toBe(0);
        });
    });

    // 3. Tests for `Timing.change`
    describe('Timing.change', () => {
        it('should change the interval of an existing timer', async () => {
            // Test: Changing the interval updates the timer's frequency
            testId = Timing.start(callbackSpy, 50);
            await wait(60);
            Timing.change(testId, 100);
            await wait(120);
            expect(callbackSpy).toHaveBeenCalledTimes(2);
        });

        it('should do nothing if the timer ID does not exist', () => {
            // Test: Changing a non-existent timer is safe
            Timing.change(9999, 100);
            expect(Object.keys(Timing['timers']).length).toBe(0);
        });
    });

    // 4. Tests for `wait`
    describe('wait', () => {
        it('should resolve after the specified delay', async () => {
            // Test: `wait` resolves after the correct delay
            const start = Date.now();
            await wait(100);
            const end = Date.now();
            expect(end - start).toBeGreaterThanOrEqual(100);
        });
    });

    // 5. Edge cases
    describe('Edge Cases', () => {
        it('should handle multiple timers independently', async () => {
            // Test: Multiple timers run independently
            const spy1 = jasmine.createSpy('callback1');
            const spy2 = jasmine.createSpy('callback2');
            const id1 = Timing.start(spy1, 50);
            const id2 = Timing.start(spy2, 100);
            await wait(210);
            expect(spy1).toHaveBeenCalledTimes(4);
            expect(spy2).toHaveBeenCalledTimes(2);
            Timing.stop(id1);
            Timing.stop(id2);
        });

        it('should not leak timers after stopping', async () => {
            // Test: No memory leaks after stopping timers
            testId = Timing.start(callbackSpy, 50);
            Timing.stop(testId);
            expect(Object.keys(Timing['timers']).length).toBe(0);
        });
    });
});
