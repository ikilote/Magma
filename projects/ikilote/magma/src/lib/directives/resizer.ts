export type ResizeDirection = 'left' | 'right' | 'top' | 'bottom';

export class MagmaResizeElement {
    animation = true;
    x: [number, number];
    y: [number, number];

    constructor(params: { x: [number, number]; y: [number, number] }) {
        this.x = params.x;
        this.y = params.y;
    }

    update(_resize: ResizeDirection, _data: [number, number]) {}
}

export interface MagmaResizeHostElement {
    widthElementNumber: number;
    heightElementNumber: number;
    elementSize: number; // px
}
