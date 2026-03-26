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
    it('should convert a Blob to base64 and resolve the promise with the correct result', async () => {
        const mockBlob = new Blob(['test'], { type: 'text/plain' });

        const result = await blobToBase64(mockBlob);

        // The result should be a data URL containing base64
        expect(result).toContain('data:');
        expect(result).toContain('base64');
    });

    it('should handle empty blob', async () => {
        const mockBlob = new Blob([], { type: 'text/plain' });

        const result = await blobToBase64(mockBlob);

        expect(result).toContain('data:');
    });
});

describe('ulrToBase64', () => {
    let mockFetch: Mock;

    beforeEach(() => {
        mockFetch = vi.spyOn(window, 'fetch');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should convert a URL to base64 and resolve with base64 data', async () => {
        const mockBlob = new Blob(['mock-image-data'], { type: 'image/png' });
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            blob: () => Promise.resolve(mockBlob),
        } as unknown as Response);

        const result = await ulrToBase64('http://example.com/image.png');

        expect(result).toContain('data:');
        expect(mockFetch).toHaveBeenCalledWith('http://example.com/image.png', expect.any(Object));
    });

    it('should reject on HTTP error', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
        } as unknown as Response);

        await expect(ulrToBase64('http://example.com/image.png')).rejects.toEqual('HTTP-Error: 404');
    });

    it('should reject on CORS error', async () => {
        mockFetch.mockRejectedValue('HTTP-Error: CORS');

        await expect(ulrToBase64('http://example.com/image.png')).rejects.toEqual('HTTP-Error: CORS');
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
