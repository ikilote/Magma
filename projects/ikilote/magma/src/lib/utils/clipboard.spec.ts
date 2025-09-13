import { clipboardWrite } from './clipboard';

describe('clipboardWrite', () => {
    // Save the original `navigator` object
    const originalNavigator = window.navigator;

    beforeEach(() => {
        // Create a mock for `navigator.clipboard`
        const mockClipboard = {
            writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve()),
        };

        // Redefine the `navigator` property of `window` to make it writable
        Object.defineProperty(window, 'navigator', {
            value: { clipboard: mockClipboard },
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        // Restore the original `navigator` object
        Object.defineProperty(window, 'navigator', {
            value: originalNavigator,
            writable: false,
            configurable: true,
        });
    });

    it('should resolve the promise if writeText succeeds', async () => {
        // Call the function
        await expectAsync(clipboardWrite('test')).toBeResolved();
        // Verify that `writeText` was called with the correct text
        expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('test');
    });

    it('should reject the promise if writeText fails', async () => {
        // Mock `writeText` to return a rejected promise
        (window as any).navigator.clipboard.writeText.and.returnValue(Promise.reject());
        // Verify that the promise is rejected
        await expectAsync(clipboardWrite('test')).toBeRejected();
    });
});
