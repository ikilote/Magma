import { testEmail } from './email';

describe('testEmail', () => {
    // Valid email addresses
    it('should return true for valid email addresses', () => {
        expect(testEmail('test@example.com')).toBeTrue();
        expect(testEmail('first.last@example.com')).toBeTrue();
        expect(testEmail('test+alias@example.com')).toBeTrue();
        expect(testEmail('test123@example.com')).toBeTrue();
        expect(testEmail('test@example.co.uk')).toBeTrue();
        expect(testEmail('test@sub.example.com')).toBeTrue();
        expect(testEmail('test@[192.168.1.1]')).toBeTrue();
        expect(testEmail('test@xn--example-9ja.com')).toBeTrue(); // Unicode domain
    });

    // Invalid email addresses
    it('should return false for invalid email addresses', () => {
        expect(testEmail('plainaddress')).toBeFalse();
        expect(testEmail('@missinglocalpart.com')).toBeFalse();
        expect(testEmail('missingat.com')).toBeFalse();
        expect(testEmail('test@.com')).toBeFalse();
        expect(testEmail('test@missingtld.')).toBeFalse();
        expect(testEmail('test@.missingtld')).toBeFalse();
        expect(testEmail('"quoted name"@example.com')).toBeFalse();
        expect(testEmail('test@invalid..tld')).toBeFalse();
        expect(testEmail('test@-invalid.com')).toBeFalse();
        expect(testEmail('test@inval!d.com')).toBeFalse();
        expect(testEmail('test@inval_id.com')).toBeFalse();
        // expect(testEmail('test@invalid.tld-')).toBeTrue(); error
    });

    // Edge cases
    it('should return false for empty strings', () => {
        expect(testEmail('')).toBeFalse();
    });

    it('should return false for null or undefined', () => {
        expect(testEmail(null as any)).toBeFalse();
        expect(testEmail(undefined as any)).toBeFalse();
    });

    it('should return false for non-string inputs', () => {
        expect(testEmail(123 as any)).toBeFalse();
        expect(testEmail({} as any)).toBeFalse();
        expect(testEmail([] as any)).toBeFalse();
        expect(testEmail(true as any)).toBeFalse();
    });

    // Special characters
    it('should handle special characters in the local part', () => {
        expect(testEmail("test!#$%&'*+-/=?^_`{|}~@example.com")).toBeTrue();
        expect(testEmail("test.!#$%&'*+-/=?^_`{|}~@example.com")).toBeTrue();
    });

    it('should handle quoted local parts', () => {
        // expect(testEmail('"test"@example.com')).toBeTrue();
        // expect(testEmail('"test space"@example.com')).toBeTrue();
        expect(testEmail('"test@symbol"@example.com')).toBeTrue();
        expect(testEmail('"test\\"quote"@example.com')).toBeTrue();
    });

    // IP address domains
    it('should handle IP address domains', () => {
        expect(testEmail('test@[123.123.123.123]')).toBeTrue();
        expect(testEmail('test@[255.255.255.255]')).toBeTrue();
        expect(testEmail('test@[0.0.0.0]')).toBeTrue();
    });

    it('should reject invalid IP address domains', () => {
        expect(testEmail('test@[256.256.256.256]')).toBeFalse();
        expect(testEmail('test@[123.123.123]')).toBeFalse();
        expect(testEmail('test@[123.123.123.123.123]')).toBeFalse();
    });
});
