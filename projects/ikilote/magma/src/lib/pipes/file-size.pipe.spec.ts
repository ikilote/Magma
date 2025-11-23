import { FileSizePipe, FileSizePipeParams } from './file-size.pipe';

describe('FileSizePipe', () => {
    const pipe = new FileSizePipe();

    it('should format file size in binary format by default', () => {
        const result = pipe.transform(566155566400);
        expect(result).toBe('527.3 GiB');
    });

    it('should format file size in decimal format', () => {
        const params: FileSizePipeParams = { format: 'decimal' };
        const result = pipe.transform(566155566400, params);
        expect(result).toBe('566.2 GB');
    });

    it('should format file size with custom language and options', () => {
        const params: FileSizePipeParams = {
            format: 'decimal',
            language: 'fr',
            options: { maximumSignificantDigits: 3 },
        };
        const result = pipe.transform(566155566400, params);
        expect(result).toBe('566 GB');
    });

    // Test: Custom unit table

    it('should format file size with custom binary unit table', () => {
        const params: FileSizePipeParams = {
            format: 'binary',
            translate: {
                unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'],
            },
        };
        const result = pipe.transform(566155566400, params);
        expect(result).toBe('527.3 Gio');
    });

    it('should format file size with custom decimal unit table', () => {
        const params: FileSizePipeParams = {
            format: 'decimal',
            translate: {
                unitTableDecimal: [' o', ' Ko', ' Mo', ' Go', ' To'],
            },
        };
        const result = pipe.transform(566155566400, params);
        expect(result).toBe('566.2 Go');
    });

    // Test: Edge case

    it('should format zero bytes correctly', () => {
        const result = pipe.transform(0);
        expect(result).toBe('0 B');
    });
    it('should format small file size correctly', () => {
        const result = pipe.transform(500);
        expect(result).toBe('500 B');
    });

    it('should format large file size correctly in binary', () => {
        const result = pipe.transform(1.21e12); // ~1.1 TiB
        expect(result).toBe('1,127 GiB');
    });

    it('should format large file size correctly in decimal', () => {
        const params: FileSizePipeParams = { format: 'decimal' };
        const result = pipe.transform(1.21e12, params); // ~1.21 TB
        expect(result).toBe('1,210 GB');
    });
});
