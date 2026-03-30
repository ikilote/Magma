import { testEmail } from './email';

describe('testEmail', () => {
    // Valid email addresses
    it('should return true for valid email addresses', () => {
        expect(testEmail('test@example.com')).toBe(true);
        expect(testEmail('first.last@example.com')).toBe(true);
        expect(testEmail('test+alias@example.com')).toBe(true);
        expect(testEmail('test123@example.com')).toBe(true);
        expect(testEmail('test@example.co.uk')).toBe(true);
        expect(testEmail('test@sub.example.com')).toBe(true);
        expect(testEmail('test@[192.168.1.1]')).toBe(true);
        expect(testEmail('test@xn--example-9ja.com')).toBe(true); // Unicode domain
    });

    // Invalid email addresses
    it('should return false for invalid email addresses', () => {
        expect(testEmail('plainaddress')).toBe(false);
        expect(testEmail('@missinglocalpart.com')).toBe(false);
        expect(testEmail('missingat.com')).toBe(false);
        expect(testEmail('test@.com')).toBe(false);
        expect(testEmail('test@missingtld.')).toBe(false);
        expect(testEmail('test@.missingtld')).toBe(false);
        expect(testEmail('"quoted name"@example.com')).toBe(false);
        expect(testEmail('test@invalid..tld')).toBe(false);
        expect(testEmail('test@-invalid.com')).toBe(false);
        expect(testEmail('test@inval!d.com')).toBe(false);
        expect(testEmail('test@inval_id.com')).toBe(false);
        // expect(testEmail('test@invalid.tld-')).toBeTrue(); error
    });

    // Edge cases
    it('should return false for empty strings', () => {
        expect(testEmail('')).toBe(false);
    });

    it('should return false for null or undefined', () => {
        expect(testEmail(null as any)).toBe(false);
        expect(testEmail(undefined as any)).toBe(false);
    });

    it('should return false for non-string inputs', () => {
        expect(testEmail(123 as any)).toBe(false);
        expect(testEmail({} as any)).toBe(false);
        expect(testEmail([] as any)).toBe(false);
        expect(testEmail(true as any)).toBe(false);
    });

    // Special characters
    it('should handle special characters in the local part', () => {
        expect(testEmail("test!#$%&'*+-/=?^_`{|}~@example.com")).toBe(true);
        expect(testEmail("test.!#$%&'*+-/=?^_`{|}~@example.com")).toBe(true);
    });

    it('should handle quoted local parts', () => {
        // expect(testEmail('"test"@example.com')).toBeTrue();
        // expect(testEmail('"test space"@example.com')).toBeTrue();
        expect(testEmail('"test@symbol"@example.com')).toBe(true);
        expect(testEmail('"test\\"quote"@example.com')).toBe(true);
    });

    // IP address domains
    it('should handle IP address domains', () => {
        expect(testEmail('test@[123.123.123.123]')).toBe(true);
        expect(testEmail('test@[255.255.255.255]')).toBe(true);
        expect(testEmail('test@[0.0.0.0]')).toBe(true);
    });

    it('should reject invalid IP address domains', () => {
        expect(testEmail('test@[256.256.256.256]')).toBe(false);
        expect(testEmail('test@[123.123.123]')).toBe(false);
        expect(testEmail('test@[123.123.123.123.123]')).toBe(false);
    });
});
