import type { Mock } from 'vitest';

import { blobToBase64, downloadFile, normalizeFileName, ulrToBase64 } from './file';

describe('downloadFile', () => {
    let createElementSpy: Mock;
    let createObjectURLSpy: Mock;
    let clickSpy: Mock;

    beforeEach(() => {
        createElementSpy = vi.spyOn(document, 'createElement');
        createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');
        clickSpy = vi.fn();
        vi.spyOn(URL, 'revokeObjectURL');
    });

    it('should create a download link with a Blob if content is not a data URL', () => {
        const content = 'test content';
        const fileName = 'test.txt';
        const contentType = 'text/plain';

        const aElement = downloadFile(content, fileName, contentType);

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(createObjectURLSpy).toHaveBeenCalled();
        expect(aElement.download).toBe(fileName);
        expect(aElement.href).toContain('mock-url');
    });

    it('should use the content directly if it is a data URL', () => {
        const content = 'data:text/plain;base64,test';
        const fileName = 'test.txt';

        const aElement = downloadFile(content, fileName);

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(aElement.href).toBe(content);
        expect(aElement.download).toBe(fileName);
    });

    it('should return the created anchor element', () => {
        const content = 'test content';
        const fileName = 'test.txt';

        const aElement = downloadFile(content, fileName);

        expect(aElement.tagName).toBe('A');
        expect(aElement.download).toBe(fileName);
    });
});

describe('blobToBase64', () => {
    // Test for success
    it('should convert a Blob to base64 and resolve the promise with the correct result', async () => {
        // mocks
        const mockBlob = new Blob(['test'], { type: 'text/plain' });
        const mockResult = 'data:text/plain;base64,dGVzdA==';
        const mockReader = {
            readAsDataURL: vi.fn(),
            result: mockResult,
            onloadend: null as (() => void) | null,
            onerror: null as (() => void) | null,
        };

        vi.spyOn(window, 'FileReader').mockReturnValue(mockReader as unknown as FileReader);

        // Call the function
        const promise = blobToBase64(mockBlob);

        // Manually trigger the loadend event via microtask
        await new Promise<void>(resolve => {
            queueMicrotask(() => {
                mockReader.onloadend?.();
                resolve();
            });
        });

        // Await the promise resolution
        const result = await promise;

        expect(result).toBe(mockResult);
        expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
    });

    // Test for failure
    it('should reject the promise if FileReader fails', async () => {
        // mocks
        const mockBlob = new Blob(['test'], { type: 'text/plain' });
        const mockReader = {
            readAsDataURL: vi.fn(),
            onloadend: null as (() => void) | null,
            onerror: null as (() => void) | null,
        };
        vi.spyOn(window, 'FileReader').mockReturnValue(mockReader as unknown as FileReader);

        // Call the function
        const promise = blobToBase64(mockBlob);

        // Manually trigger the onerror event via microtask
        await new Promise<void>(resolve => {
            queueMicrotask(() => {
                mockReader.onerror?.();
                resolve();
            });
        });

        // Await and verify the promise is rejected
        await expect(promise).rejects.toThrowError('Failed to read blob as base64');
    });
});

describe('ulrToBase64', () => {
    let mockFetch: Mock;
    let mockBlob: Blob;
    let mockReader: any;

    beforeEach(() => {
        mockBlob = new Blob(['mock-image-data'], { type: 'image/png' });

        mockReader = {
            readAsDataURL: vi.fn(),
            result: null, // Default to null, will be overridden in tests
            onloadend: null as (() => void) | null,
            onerror: null as (() => void) | null,
        };

        mockFetch = vi.spyOn(window, 'fetch').mockReturnValue(
            Promise.resolve({
                ok: true,
                status: 200,
                blob: () => Promise.resolve(mockBlob),
            } as unknown as Response),
        );

        vi.spyOn(window, 'FileReader').mockReturnValue(mockReader);
    });

    it('should convert a URL to base64 and resolve with base64 data', async () => {
        mockReader.result = 'data:image/png;base64,mock-base64-data';

        const promise = ulrToBase64('http://example.com/image.png');

        await new Promise<void>(resolve => {
            queueMicrotask(() => {
                mockReader.onloadend?.();
                resolve();
            });
        });

        const result = await promise;
        expect(result).toBe('data:image/png;base64,mock-base64-data');
        expect(mockFetch).toHaveBeenCalledWith('http://example.com/image.png', expect.any(Object));
        expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
    });

    it('should convert a URL to base64 and resolve with ArrayBuffer data', async () => {
        const mockArrayBuffer = new ArrayBuffer(8);
        mockReader.result = mockArrayBuffer;

        const promise = ulrToBase64('http://example.com/image.png');

        await new Promise<void>(resolve => {
            queueMicrotask(() => {
                mockReader.onloadend?.();
                resolve();
            });
        });

        const result = await promise;

        expect(result).toEqual(mockArrayBuffer);
        expect(mockFetch).toHaveBeenCalledWith('http://example.com/image.png', expect.any(Object));
        expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
    });

    it('should reject with "Image error" if reader.result is null', async () => {
        mockReader.result = null;

        const promise = ulrToBase64('http://example.com/image.png');

        await new Promise<void>(resolve => {
            queueMicrotask(() => {
                mockReader.onloadend?.();
                resolve();
            });
        });

        await expect(promise).rejects.toEqual('Image error');
    });

    it('should reject on HTTP error', async () => {
        mockFetch.mockReturnValue(
            Promise.resolve({
                ok: false,
                status: 404,
            } as unknown as Response),
        );

        await expect(ulrToBase64('http://example.com/image.png')).rejects.toEqual('HTTP-Error: 404');
    });

    it('should reject on CORS error', async () => {
        mockFetch.mockReturnValue(Promise.reject('HTTP-Error: CORS'));

        await expect(ulrToBase64('http://example.com/image.png')).rejects.toEqual('HTTP-Error: CORS');
    });

    it('should reject with "Image error" if FileReader fails', async () => {
        const promise = ulrToBase64('http://example.com/image.png');

        await new Promise<void>(resolve => {
            queueMicrotask(() => {
                mockReader.onerror?.();
                resolve();
            });
        });

        await expect(promise).rejects.toEqual('Image error');
    });
});

describe('normalizeFileName', () => {
    it('should remove all non-ASCII characters', () => {
        const input = 'Café_Été_日本語_Привет_😊';
        const expected = 'cafe_ete_';
        const result = normalizeFileName(input);
        expect(result).toBe(expected);
    });

    it('should remove forbidden filename characters', () => {
        const input = 'File/Name:With*Invalid|Chars?';
        const expected = 'filenamewithinvalidchars';
        const result = normalizeFileName(input);
        expect(result).toBe(expected);
    });

    it('should truncate to the specified limit', () => {
        const input = 'a'.repeat(250);
        const expected = 'a'.repeat(200);
        const result = normalizeFileName(input);
        expect(result).toBe(expected);
    });

    it('should return an empty string if input is empty', () => {
        const input = '';
        const expected = '';
        const result = normalizeFileName(input);
        expect(result).toBe(expected);
    });
});
