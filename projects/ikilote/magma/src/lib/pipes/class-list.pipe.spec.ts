// class-list.pipe.spec.ts
import { ClassListPipe } from './class-list.pipe';

describe('ClassListPipe', () => {
    let pipe: ClassListPipe;

    beforeEach(() => {
        pipe = new ClassListPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should flatten a simple array of strings', () => {
        const input = ['test', 'class-a', 'class-b'];
        const result = pipe.transform(input);
        expect(result).toEqual(['test', 'class-a', 'class-b']);
    });

    it('should flatten an array with nested arrays', () => {
        const input = ['test', ['class-1', 'class-2'], 'class-a'];
        const result = pipe.transform(input);
        expect(result).toEqual(['test', 'class-1', 'class-2', 'class-a']);
    });

    it('should split space-separated strings into individual classes', () => {
        const input = ['test', 'class-a class-b', ['class-1 class-2']];
        const result = pipe.transform(input);
        expect(result).toEqual(['test', 'class-a', 'class-b', 'class-1', 'class-2']);
    });

    it('should handle empty strings in the input', () => {
        const input = ['test', '', 'class-a', ['', 'class-b']];
        const result = pipe.transform(input);
        expect(result).toEqual(['test', 'class-a', 'class-b']);
    });

    it('should handle strings with multiple spaces', () => {
        const input = ['test', '  class-a   class-b  ', ['class-1  class-2']];
        const result = pipe.transform(input);
        expect(result).toEqual(['test', 'class-a', 'class-b', 'class-1', 'class-2']);
    });

    it('should return an empty array for empty input', () => {
        const input: any[] = [];
        const result = pipe.transform(input);
        expect(result).toEqual([]);
    });

    it('should handle null input', () => {
        const input = null;
        // @ts-ignore - Testing null input
        const result = pipe.transform(input);
        expect(result).toEqual([]);
    });

    it('should handle undefined input', () => {
        const input = undefined;
        // @ts-ignore - Testing undefined input
        const result = pipe.transform(input);
        expect(result).toEqual([]);
    });

    it('should handle mixed input with non-string, non-array values', () => {
        const input = ['test', 123, true, null, undefined, { key: 'value' }];
        // @ts-ignore - Testing undefined input
        const result = pipe.transform(input);
        expect(result).toEqual(['test']);
    });

    it('should handle deeply nested arrays', () => {
        const input = ['test', ['class-1', ['class-2', ['class-3']]], 'class-a'];
        const result = pipe.transform(input);
        expect(result).toEqual(['test', 'class-1', 'class-2', 'class-3', 'class-a']);
    });

    it('should handle input with only nested arrays', () => {
        const input = [['class-1', ['class-2']], ['class-3']];
        const result = pipe.transform(input);
        expect(result).toEqual(['class-1', 'class-2', 'class-3']);
    });

    it('should filter out falsy values explicitly', () => {
        const input = ['class-a', '', 'class-b', '   ', 'class-c'];
        const result = pipe.transform(input);
        // Empty strings and whitespace-only strings should be filtered out
        expect(result).toEqual(['class-a', 'class-b', 'class-c']);
        expect(result.length).toBe(3);
    });

    it('should handle array with only empty strings', () => {
        const input = ['', '  ', '   '];
        const result = pipe.transform(input);
        expect(result).toEqual([]);
    });

    it('should handle array with tabs and newlines', () => {
        const input = ['class-a\tclass-b', 'class-c\nclass-d'];
        const result = pipe.transform(input);
        expect(result).toEqual(['class-a', 'class-b', 'class-c', 'class-d']);
    });

    it('should handle a plain string input', () => {
        // MagmaStringArray accepts string — flattenedListItems splits on whitespace
        const result = pipe.transform('class-a class-b class-c' as any);
        expect(result).toEqual(['class-a', 'class-b', 'class-c']);
    });

    it('should handle a plain string with no spaces', () => {
        const result = pipe.transform('single-class' as any);
        expect(result).toEqual(['single-class']);
    });
});
