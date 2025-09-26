import Bowser from 'bowser';

import { ExceptionJsonParse, jsonCopy, jsonParse } from './json';

describe('jsonCopy', () => {
    it('should create a deep copy of an object', () => {
        const original = { a: 1, b: { c: 2 } };
        const copied = jsonCopy(original);

        // Verify the copy is correct
        expect(copied).toEqual(original);

        // Verify the copy is independent
        copied.b.c = 3;
        expect(original.b.c).toBe(2);
    });

    it('should create a deep copy of an array', () => {
        const original: [number, number, { a: number }] = [1, 2, { a: 3 }];
        const copied = jsonCopy(original);

        // Verify the copy is correct
        expect(copied).toEqual(original);

        // Verify the copy is independent
        copied[2].a = 4;
        expect(original[2].a).toBe(3);
    });

    it('should handle primitive values', () => {
        const originalString = 'test';
        const copiedString = jsonCopy(originalString);
        expect(copiedString).toBe(originalString);

        const originalNumber = 42;
        const copiedNumber = jsonCopy(originalNumber);
        expect(copiedNumber).toBe(originalNumber);
    });

    it('should handle null', () => {
        const copiedNull = jsonCopy(null);
        expect(copiedNull).toBeNull();
    });

    it('should not handle undefined', () => {
        let test = false;
        try {
            const copiedUndefined = jsonCopy(undefined);
        } catch (e) {
            test = true;
        }
        expect(test).toBeTrue();
    });
});

describe('ExceptionJsonParse', () => {
    it('should correctly extend Error', () => {
        const message = 'Failed to parse JSON';
        const cause = 'Invalid JSON string';
        const error = new ExceptionJsonParse(message, cause);

        // Verify the error properties
        expect(error.name).toBe('ExceptionJsonParse');
        expect(error.message).toBe(message);
        expect(error.cause).toBe(cause);
    });

    it('should maintain the correct prototype chain', () => {
        const error = new ExceptionJsonParse('Failed to parse JSON', 'Invalid JSON string');

        // Verify the prototype chain
        expect(error instanceof ExceptionJsonParse).toBeTrue();
        expect(error instanceof Error).toBeTrue();
    });

    it('should include the cause in the error', () => {
        const cause = 'Invalid JSON string';
        const error = new ExceptionJsonParse('Failed to parse JSON', cause);

        // Verify the cause property
        expect(error.cause).toBe(cause);
    });
});

describe('jsonParse', () => {
    let bowserParseSpy: jasmine.Spy;

    beforeEach(() => {
        // Mock Bowser.parse to return a specific browser engine
        bowserParseSpy = spyOn(Bowser, 'parse').and.returnValue({ engine: { name: '' } } as any);
    });

    it('should parse valid JSON', () => {
        const validJson = '{"key": "value"}';
        const result = jsonParse(validJson);
        expect(result).toEqual({ key: 'value' });
    });

    it('should throw ExceptionJsonParse with position for Blink engine (line 1)', () => {
        // Mock Blink engine
        bowserParseSpy.and.returnValue({ engine: { name: 'Blink' } } as any);

        // Mock JSON.parse to throw a SyntaxError with position
        const invalidJson = '{"key": "value"';
        spyOn(JSON, 'parse').and.callFake(() => {
            throw new SyntaxError('Unexpected end of JSON input at position 13');
        });

        // Expect the function to throw ExceptionJsonParse with formatted position
        expect(() => jsonParse(invalidJson)).toThrowError(ExceptionJsonParse);
        try {
            jsonParse(invalidJson);
        } catch (error) {
            expect((error as ExceptionJsonParse).cause).toBe('{"key": "value"\n             ^');
        }
    });

    it('should throw ExceptionJsonParse with position for Blink engine (line 2)', () => {
        // Mock Blink engine
        bowserParseSpy.and.returnValue({ engine: { name: 'Blink' } } as any);

        // Mock JSON.parse to throw a SyntaxError with position
        const invalidJson = '{"key": \n"value"';
        spyOn(JSON, 'parse').and.callFake(() => {
            throw new SyntaxError('Unexpected end of JSON input at position 14');
        });

        // Expect the function to throw ExceptionJsonParse with formatted position
        expect(() => jsonParse(invalidJson)).toThrowError(ExceptionJsonParse);
        try {
            jsonParse(invalidJson);
        } catch (error) {
            expect((error as ExceptionJsonParse).cause).toBe('"value"\n     ^');
        }
    });

    it('should throw ExceptionJsonParse with position for Gecko engine', () => {
        // Mock Gecko engine
        bowserParseSpy.and.returnValue({ engine: { name: 'Gecko' } } as any);

        // Mock JSON.parse to throw a SyntaxError with line and column
        const invalidJson = '{"key": "value"';
        spyOn(JSON, 'parse').and.callFake(() => {
            throw new SyntaxError('Unexpected end of JSON input at line 1 column 13');
        });

        // Expect the function to throw ExceptionJsonParse with formatted position
        expect(() => jsonParse(invalidJson)).toThrowError(ExceptionJsonParse);
        try {
            jsonParse(invalidJson);
        } catch (error) {
            expect((error as ExceptionJsonParse).cause).toBe('{"key": "value"\n            ^');
        }
    });

    it('should throw ExceptionJsonParse with position for WebKit engine', () => {
        // Mock WebKit engine
        bowserParseSpy.and.returnValue({ engine: { name: 'WebKit' } } as any);

        // Mock JSON.parse to throw a SyntaxError with WebKit format
        const invalidJson = '{"key": "value"';
        spyOn(JSON, 'parse').and.callFake(() => {
            throw new SyntaxError('JSON Parse error: Unexpected end of JSON input');
        });

        // Expect the function to throw ExceptionJsonParse with the error message
        expect(() => jsonParse(invalidJson)).toThrowError(ExceptionJsonParse);
        try {
            jsonParse(invalidJson);
        } catch (error) {
            expect((error as ExceptionJsonParse).cause).toContain('Unexpected end of JSON input');
        }
    });

    it('should throw ExceptionJsonParse for unknown engine', () => {
        // Mock an unknown engine
        bowserParseSpy.and.returnValue({ engine: { name: 'Unknown' } } as any);

        // Mock JSON.parse to throw a SyntaxError
        const invalidJson = '{"key": "value"';
        spyOn(JSON, 'parse').and.callFake(() => {
            throw new SyntaxError('Unexpected end of JSON input');
        });

        // Expect the function to throw ExceptionJsonParse with the error message
        expect(() => jsonParse(invalidJson)).toThrowError(ExceptionJsonParse);
        try {
            jsonParse(invalidJson);
        } catch (error) {
            expect((error as ExceptionJsonParse).cause).toBe('');
        }
    });
});
