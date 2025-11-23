// math.pipe.spec.ts
import { MathPipe } from './math.pipe';

describe('MathPipe', () => {
    let pipe: MathPipe;

    beforeEach(() => {
        pipe = new MathPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    // Test basic Math number functions

    it('should apply Math.abs', () => {
        expect(pipe.transform(-150.5, 'abs')).toBe(150.5);
        expect(pipe.transform(150.5, 'abs')).toBe(150.5);
    });

    it('should apply Math.trunc', () => {
        expect(pipe.transform(-159.5599, 'trunc')).toBe(-159);
        expect(pipe.transform(159.5599, 'trunc')).toBe(159);
    });

    it('should apply Math.random when value is empty', () => {
        const result = pipe.transform('', 'random');
        expect(typeof result).toBe('number');
    });

    it('should apply Math.min with multiple arguments', () => {
        expect(pipe.transform(150, 'min', 10, -5, 155)).toBe(-5);
        expect(pipe.transform(-10, 'min', 10, 0, 5)).toBe(-10);
    });

    it('should apply Math.max with multiple arguments', () => {
        expect(pipe.transform(150, 'max', 10, -5, 155)).toBe(155);
        expect(pipe.transform(200, 'max', 10, 50, 100)).toBe(200);
    });

    // Test other Math functions

    it('should apply Math.ceil', () => {
        expect(pipe.transform(4.3, 'ceil')).toBe(5);
        expect(pipe.transform(-4.3, 'ceil')).toBe(-4);
    });

    it('should apply Math.floor', () => {
        expect(pipe.transform(4.7, 'floor')).toBe(4);
        expect(pipe.transform(-4.7, 'floor')).toBe(-5);
    });

    it('should apply Math.round', () => {
        expect(pipe.transform(4.4, 'round')).toBe(4);
        expect(pipe.transform(4.5, 'round')).toBe(5);
        expect(pipe.transform(-4.4, 'round')).toBe(-4);
    });

    it('should apply Math.pow', () => {
        expect(pipe.transform(2, 'pow', 3)).toBe(8);
        expect(pipe.transform(3, 'pow', 2)).toBe(9);
    });

    it('should apply Math.sqrt', () => {
        expect(pipe.transform(16, 'sqrt')).toBe(4);
        expect(pipe.transform(25, 'sqrt')).toBe(5);
    });

    // Test trigonometric functions

    it('should apply Math.cos', () => {
        expect(pipe.transform(0, 'cos')).toBe(1);
    });

    it('should apply Math.sin', () => {
        expect(pipe.transform(0, 'sin')).toBe(0);
    });

    it('should apply Math.tan', () => {
        expect(pipe.transform(0, 'tan')).toBe(0);
    });

    // Test edge cases
    it('should handle invalid function names', () => {
        expect(pipe.transform(10, 'invalidFunction')).toBeUndefined();
    });

    it('should handle non-numeric values', () => {
        expect(pipe.transform('not a number', 'abs')).toBeNaN();
        expect(pipe.transform(null, 'abs')).toBe(0);
        expect(pipe.transform(undefined, 'abs')).toBeNaN();
    });

    it('should handle missing arguments', () => {
        expect(pipe.transform(10, 'max')).toBe(10);
        expect(pipe.transform(undefined, 'max', 10, 20)).toBeNaN();
    });

    // This will return undefined since 'notAMathFunction' is not a Math method
    it('should pass through non-Math function calls', () => {
        expect(pipe.transform(10, 'notAMathFunction')).toBeUndefined();
    });
});
