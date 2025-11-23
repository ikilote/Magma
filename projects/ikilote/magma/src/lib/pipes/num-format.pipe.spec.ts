import { NumFormatPipe } from './num-format.pipe';

describe('NumFormatPipe', () => {
    let pipe: NumFormatPipe;

    beforeEach(() => {
        pipe = new NumFormatPipe();
    });

    // --- Basic Tests ---
    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    // --- String Pattern Tests ---
    it('should format number using a string pattern (e.g., "#,##0.00")', () => {
        const result = pipe.transform(1000, '#,##0.00');
        expect(result).toBe('1,000.00');
    });

    it('should format large numbers using a string pattern', () => {
        const result = pipe.transform(1000000, '#,##0');
        expect(result).toBe('1,000,000');
    });

    // --- Intl.NumberFormatOptions Tests ---
    it('should format number using Intl.NumberFormatOptions (e.g., { style: "currency", currency: "USD" })', () => {
        const result = pipe.transform(1000, { style: 'currency', currency: 'USD' });
        expect(result).toContain('$1,000.00');
    });

    it('should format number with minimumFractionDigits', () => {
        const result = pipe.transform(1000, { minimumFractionDigits: 2 });
        expect(result).toBe('1,000.00');
    });

    // --- Custom Language Tests ---
    it('should format number using a custom language (e.g., "fr")', () => {
        const result = pipe.transform(1000.123, { maximumFractionDigits: 2 }, 'fr');
        expect(result).toBe('1 000,12');
    });

    it('should use the static default language if none provided', () => {
        NumFormatPipe.lang = 'fr';
        const result = pipe.transform(1000.123, { maximumFractionDigits: 2 });
        expect(result).toBe('1 000,12');
        NumFormatPipe.lang = 'en'; // Reset
    });

    it('should format number using default language ("en")', () => {
        NumFormatPipe.lang = '';
        const result = pipe.transform(1000.123, { maximumFractionDigits: 2 });
        expect(result).toBe('1,000.12');
        NumFormatPipe.lang = 'en'; // Reset
    });

    // --- Invalid Value Tests ---
    it('should return an empty string for NaN', () => {
        const result = pipe.transform(NaN as unknown as number);
        expect(result).toBe('');
    });

    it('should return an empty string for null', () => {
        const result = pipe.transform(null as unknown as number);
        expect(result).toBe('');
    });

    it('should return an empty string for undefined', () => {
        const result = pipe.transform(undefined as unknown as number);
        expect(result).toBe('');
    });

    it('should return an empty string for empty string input', () => {
        const result = pipe.transform('' as unknown as number);
        expect(result).toBe('');
    });

    // --- Simple Number Tests ---
    it('should format a simple number without params', () => {
        const result = pipe.transform(1000);
        expect(result).toBe('1,000');
    });

    it('should format zero correctly', () => {
        const result = pipe.transform(0, '#,##0.00');
        expect(result).toBe('0.00');
    });

    // --- Negative Number Tests ---
    it('should format negative numbers using a string pattern', () => {
        const result = pipe.transform(-1000, '#,##0.00');
        expect(result).toBe('-1,000.00');
    });

    it('should format negative numbers using Intl.NumberFormatOptions', () => {
        const result = pipe.transform(-1000, { style: 'currency', currency: 'EUR' });
        expect(result).toContain('-€1,000.00');
    });

    // --- Decimal Number Tests ---
    it('should format decimal numbers using a string pattern', () => {
        const result = pipe.transform(1234.567, '#,##0.00');
        expect(result).toBe('1,234.57');
    });

    it('should format decimal numbers using Intl.NumberFormatOptions', () => {
        const result = pipe.transform(1234.567, { maximumFractionDigits: 1 });
        expect(result).toBe('1,234.6');
    });

    // --- Edge Case Tests ---
    it('should handle very large numbers', () => {
        const result = pipe.transform(1e12, '#,##0');
        expect(result).toBe('1,000,000,000,000');
    });

    it('should handle very small numbers', () => {
        const result = pipe.transform(0.0001, '0.00000');
        expect(result).toBe('0.00010');
    });
});
