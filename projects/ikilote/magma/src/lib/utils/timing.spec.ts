import type { Mock } from 'vitest';

import { Timing, wait } from './timing';

describe('Timing', () => {
    // Helper to track callback calls
    let callbackSpy: Mock;
    let testId: number;

    beforeEach(() => {
        callbackSpy = vi.fn();
        testId = -1;
    });

    afterEach(() => {
        // Clean up all timers after each test
        Timing.stopAll();
    });

    // 1. Tests for `Timing.start`
    describe('Timing.start', () => {
        it('should start a timer and return a unique ID', () => {
            // Test: Starting a timer returns a valid ID
            testId = Timing.start(callbackSpy, 100);
            expect(testId).toBeGreaterThanOrEqual(0);
            expect(Timing['timers'][testId]).toBeDefined();
        });

        it('should call the callback repeatedly at the specified interval', () => {
            vi.useFakeTimers();
            // Test: Callback is called at the specified interval
            // With 50ms interval, after 200ms we expect 4 calls (at 50, 100, 150, 200ms)
            testId = Timing.start(callbackSpy, 50);
            vi.advanceTimersByTime(200);
            expect(callbackSpy).toHaveBeenCalledTimes(4);
            vi.useRealTimers();
        });
    });

    // 2. Tests for `Timing.stop`
    describe('Timing.stop', () => {
        it('should stop the timer and remove it from the registry', () => {
            vi.useFakeTimers();
            // Test: Stopping a timer removes it and stops further calls
            testId = Timing.start(callbackSpy, 50);
            vi.advanceTimersByTime(60);
            expect(callbackSpy).toHaveBeenCalledTimes(1);
            Timing.stop(testId);
            vi.advanceTimersByTime(60);
            expect(callbackSpy).toHaveBeenCalledTimes(1);
            expect(Timing['timers'][testId]).toBeUndefined();
            vi.useRealTimers();
        });

        it('should do nothing if the timer ID does not exist', () => {
            // Test: Stopping a non-existent timer is safe
            Timing.stop(9999);
            expect(Object.keys(Timing['timers']).length).toBe(0);
        });
    });

    // 3. Tests for `Timing.change`
    describe('Timing.change', () => {
        it('should change the interval of an existing timer', () => {
            vi.useFakeTimers();
            // Test: Changing the interval updates the timer's frequency
            testId = Timing.start(callbackSpy, 50);
            vi.advanceTimersByTime(80); // 1 call at 50ms
            expect(callbackSpy).toHaveBeenCalledTimes(1);
            Timing.change(testId, 100);
            vi.advanceTimersByTime(150); // 1 more call at 100ms after change
            expect(callbackSpy).toHaveBeenCalledTimes(2);
            vi.useRealTimers();
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
        it('should handle multiple timers independently', () => {
            vi.useFakeTimers();
            // Test: Multiple timers run independently
            const spy1 = vi.fn();
            const spy2 = vi.fn();
            const id1 = Timing.start(spy1, 50);
            const id2 = Timing.start(spy2, 100);
            vi.advanceTimersByTime(210);
            // spy1: 50ms interval -> calls at 50, 100, 150, 200 = 4 calls
            expect(spy1).toHaveBeenCalledTimes(4);
            // spy2: 100ms interval -> calls at 100, 200 = 2 calls
            expect(spy2).toHaveBeenCalledTimes(2);
            Timing.stop(id1);
            Timing.stop(id2);
            vi.useRealTimers();
        });

        it('should not leak timers after stopping', () => {
            // Test: No memory leaks after stopping timers
            testId = Timing.start(callbackSpy, 50);
            Timing.stop(testId);
            expect(Object.keys(Timing['timers']).length).toBe(0);
        });
    });
});
