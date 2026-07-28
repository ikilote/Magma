import { MagmaWindow, MagmaWindowInfos } from '../../public-api';

export type ResizeDirection =
    'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

export interface MagmaResizeEvent {
    direction: ResizeDirection;
    x: [number, number];
    y: [number, number];
}

export class MagmaResizeElement {
    animation = true;
    x: [number, number];
    y: [number, number];

    constructor(params: { x: [number, number]; y: [number, number] }) {
        this.x = params.x;
        this.y = params.y;
    }

    /** Overridable hook: subclasses react to a resize step. No-op by default. */
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    update(_resize: ResizeDirection, _data: [number, number]) {}
}

export interface MagmaResizeHostElement {
    widthElementNumber: number;
    heightElementNumber: number;
    elementSize: number; // px

    select(window: MagmaWindowInfos | MagmaWindow): void;
    remove(window: MagmaWindowInfos | MagmaWindow): void;
}
