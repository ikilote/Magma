import { getCookie, removeCookie, setCookie } from './cookies';

describe('Cookie Utilities', () => {
    // Mock document.cookie
    let cookieStore: Record<string, string> = {};
    let cookieString = '';

    beforeEach(() => {
        // Reset cookie store before each test
        cookieStore = {};
        cookieString = '';

        // Mock document.cookie getter and setter
        vi.spyOn(document, 'cookie', 'get').mockImplementation(() => {
            return Object.entries(cookieStore)
                .map(([k, v]) => `${k}=${v}`)
                .join('; ');
        });

        vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
            cookieString = value;
            const [cookiePart] = value.split(';');
            const [name, valuePart] = cookiePart.split('=');
            cookieStore[name.trim()] = valuePart;
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    describe('getCookie', () => {
        it('should return undefined if cookie does not exist', () => {
            expect(getCookie('nonexistent')).toBeUndefined();
        });

        it('should return the cookie value if it exists', () => {
            cookieStore['testCookie'] = 'testValue';
            expect(getCookie('testCookie')).toBe('testValue');
        });

        it('should return the correct cookie value among multiple cookies', () => {
            cookieStore['cookie1'] = 'value1';
            cookieStore['cookie2'] = 'value2';
            cookieStore['cookie3'] = 'value3';

            expect(getCookie('cookie2')).toBe('value2');
        });

        it('should handle cookies with special characters', () => {
            cookieStore['specialCookie'] = 'value=with;equals=and;semicolons';
            expect(getCookie('specialCookie')).toBe('value=with');
        });
    });

    describe('setCookie', () => {
        it('should set a cookie with default parameters', () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));

            setCookie('testCookie', 'testValue');

            expect(cookieStore['testCookie']).toBe('testValue');
            expect(cookieString).toBe('testCookie=testValue; path=/; expires=Wed, 08 Jan 2025 00:00:00 GMT');
        });

        it('should set a cookie with custom expiration and path', () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));

            setCookie('testCookie', 'testValue', 7, '/custom-path');

            expect(cookieStore['testCookie']).toBe('testValue');
            expect(cookieString).toBe('testCookie=testValue; path=/custom-path; expires=Wed, 08 Jan 2025 00:00:00 GMT');
        });
    });

    describe('removeCookie', () => {
        it('should remove a cookie', () => {
            cookieStore['testCookie'] = 'testValue';
            expect(getCookie('testCookie')).toBe('testValue');

            removeCookie('testCookie');
            expect(getCookie('testCookie')).toBe('');
            expect(cookieString).toBe('testCookie=; path=/; Max-Age=0');
        });

        it('should remove a cookie with a custom path', () => {
            cookieStore['testCookie'] = 'testValue';
            expect(getCookie('testCookie')).toBe('testValue');

            removeCookie('testCookie', '/custom-path');
            expect(getCookie('testCookie')).toBe('');
            expect(cookieString).toBe('testCookie=; path=/custom-path; Max-Age=0');
        });
    });

    describe('Integration Tests', () => {
        it('should set, get, and remove a cookie', () => {
            // Set a cookie
            setCookie('integrationTest', 'testValue', 1);

            // Get the cookie
            expect(getCookie('integrationTest')).toBe('testValue');

            // Remove the cookie
            removeCookie('integrationTest');
            expect(getCookie('integrationTest')).toBe('');
        });
    });
});
