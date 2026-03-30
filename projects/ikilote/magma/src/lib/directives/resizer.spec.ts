import { MagmaResizeElement, ResizeDirection } from './resizer';

describe('MagmaResizeElement', () => {
    // Test data
    const initialParams = {
        x: [10, 20] as [number, number],
        y: [30, 40] as [number, number],
    };

    it('should create an instance with provided x and y coordinates', () => {
        const element = new MagmaResizeElement(initialParams);

        expect(element).toBeTruthy();
        expect(element.x).toEqual([10, 20]);
        expect(element.y).toEqual([30, 40]);
    });

    it('should have animation enabled by default', () => {
        const element = new MagmaResizeElement(initialParams);

        expect(element.animation).toBe(true);
    });

    it('should allow toggling the animation property', () => {
        const element = new MagmaResizeElement(initialParams);

        element.animation = false;
        expect(element.animation).toBe(false);
    });

    it('should have a callable update method (placeholder)', () => {
        const element = new MagmaResizeElement(initialParams);
        const data: [number, number] = [5, 15];
        const direction: ResizeDirection = 'left';

        // Since the method is empty, we just ensure it doesn't throw an error
        expect(() => element.update(direction, data)).not.toThrow();
    });

    it('should allow manual updates to x and y arrays', () => {
        const element = new MagmaResizeElement(initialParams);

        element.x = [0, 100];
        element.y = [0, 200];

        expect(element.x).toEqual([0, 100]);
        expect(element.y).toEqual([0, 200]);
    });
});
