import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

export type ResizeDirection = 'left' | 'right' | 'top' | 'bottom';

export class ResizeElement {
    animation = true;
    x: [number, number];
    y: [number, number];

    constructor(params: { x: [number, number]; y: [number, number] }) {
        this.x = params.x;
        this.y = params.y;
    }

    update(_resize: ResizeDirection, _data: [number, number]) {}
}

export interface HostElement {
    widthElementNumber: number;
    heightElementNumber: number;
    elementSize: number; // px
}

@Directive({
    selector: '[resizer]',
    host: {
        '[class.ew-resize]': "resize === 'left' || resize === 'right'",
        '[class.ns-resize]': "resize === 'top' || resize === 'bottom'",
    },
})
export class MagmaResize {
    private readonly ref = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly cdkDrag = inject(CdkDrag, { optional: true });

    resizer = input.required<ResizeElement>();
    resizerHost = input<HostElement>();

    resize?: ResizeDirection;
    resizeActive?: {
        mousePosInit: [number, number];
        itemSource: ResizeElement;
    };

    @HostListener('mousedown', ['$event'])
    mousedown(event: MouseEvent) {
        if (this.resize) {
            this.resizeActive = {
                mousePosInit: [event.x, event.y],
                itemSource: new ResizeElement({ x: [...this.resizer().x], y: [...this.resizer().y] }),
            };
        }
    }

    @HostListener('window:mouseup')
    mouseupWindow() {
        if (this.resize && this.resizeActive) {
            this.resizeActive = undefined;
        }
    }

    @HostListener('window:mousemove', ['$event'])
    mouseoverWindow(event: MouseEvent) {
        const resizeActive = this.resizeActive;
        const resize = this.resize;
        const host = this.resizerHost();

        if (host && resizeActive && resize) {
            const [changeX, changeY] = [
                Math.round((resizeActive.mousePosInit[0] - event.x) / host.elementSize),
                Math.round((resizeActive.mousePosInit[1] - event.y) / host.elementSize),
            ];

            let data: [number, number] | undefined;
            const itemSource = resizeActive.itemSource;

            if (resize === 'top') {
                data = [Math.max(itemSource.y[0] - changeY, 0), itemSource.y[1]];
            } else if (resize === 'bottom') {
                data = [itemSource.y[0], Math.min(itemSource.y[1] - changeY, host.heightElementNumber - 1)];
            } else if (resize === 'left') {
                data = [Math.max(itemSource.x[0] - changeX, 0), itemSource.x[1]];
            } else if (resize === 'right') {
                data = [itemSource.x[0], Math.min(itemSource.x[1] - changeX, host.widthElementNumber - 1)];
            }

            if (data) {
                this.resizer().animation = false;
                this.resizer().update(resize, data);
                setTimeout(() => {
                    this.resizer().animation = true;
                }, 10);
            }
        }
    }

    @HostListener('mousemove', ['$event'])
    mouseover(event: MouseEvent) {
        if (!this.resizeActive) {
            const element = this.ref.nativeElement;

            if (event.layerX < 5) {
                this.resize = 'left';
            } else if (element.offsetWidth - event.layerX < 5) {
                this.resize = 'right';
            } else if (event.layerY < 5) {
                this.resize = 'top';
            } else if (element.offsetHeight - event.layerY < 5) {
                this.resize = 'bottom';
            } else {
                this.resize = undefined;
            }

            if (this.cdkDrag) {
                this.cdkDrag.disabled = this.resize !== undefined;
            }
        }
    }
}
