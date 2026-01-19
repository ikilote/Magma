import { StringPipe } from './string.pipe';

describe('StringPipe', () => {
    let pipe: StringPipe;

    beforeEach(() => {
        pipe = new StringPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    describe('Basic String Methods', () => {
        it('should convert string to upper case using "toUpperCase"', () => {
            const result = pipe.transform('hello', 'toUpperCase');
            expect(result).toBe('HELLO');
        });

        it('should trim whitespace using "trim"', () => {
            const result = pipe.transform('  hello  ', 'trim');
            expect(result).toBe('hello');
        });
    });

    describe('Methods with Arguments', () => {
        it('should pad the start of a string using "padStart"', () => {
            // Usage: {{ '123' | string: 'padStart' : 6 : '0' }}
            const result = pipe.transform('123', 'padStart', 6, '0');
            expect(result).toBe('000123');
        });

        it('should pad the end of a string using "padEnd"', () => {
            const result = pipe.transform('123', 'padEnd', 6, '456');
            expect(result).toBe('123456');
        });

        it('should slice a string correctly with start and end index', () => {
            // Usage: {{ 'Angular' | string: 'slice' : 0 : 3 }}
            const result = pipe.transform('Angular', 'slice', 0, 3);
            expect(result).toBe('Ang');
        });
    });

    describe('Input Type Handling', () => {
        it('should handle numeric input by converting it to string', () => {
            const result = pipe.transform(123, 'padStart', 5, '0');
            expect(result).toBe('00123');
        });

        it('should handle boolean input', () => {
            const result = pipe.transform(true, 'toUpperCase');
            expect(result).toBe('TRUE');
        });

        it('should return undefined if an invalid method name is provided', () => {
            // Because of the optional chaining (?.) in the pipe
            const result = pipe.transform('test', 'nonExistentMethod');
            expect(result).toBeUndefined();
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined by converting them to strings "null"/"undefined"', () => {
            expect(pipe.transform(null, 'toUpperCase')).toBe('NULL');
            expect(pipe.transform(undefined, 'toUpperCase')).toBe('UNDEFINED');
        });
    });
});
