import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, ElementRef, HostListener, booleanAttribute, inject, input } from '@angular/core';

import { MagmaResizeElement, MagmaResizeHostElement, ResizeDirection } from './resizer';

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

    readonly resizer = input.required<MagmaResizeElement>();
    readonly resizerHost = input<MagmaResizeHostElement>();
    readonly resizerDisabled = input(false, { transform: booleanAttribute });

    resize?: ResizeDirection;
    resizeActive?: {
        mousePosInit: [number, number];
        itemSource: MagmaResizeElement;
    };

    private timer: any;

    @HostListener('mousedown', ['$event'])
    mousedown(event: MouseEvent) {
        if (this.resize && !this.resizerDisabled()) {
            this.resizeActive = {
                mousePosInit: [event.x, event.y],
                itemSource: new MagmaResizeElement({ x: [...this.resizer().x], y: [...this.resizer().y] }),
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
        if (!this.resizerDisabled()) {
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

                if (this.resize) {
                    clearTimeout(this.timer);
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
    }

    @HostListener('mousemove', ['$event'])
    mouseover(event: MouseEvent) {
        if (!this.resizeActive && !this.resizerDisabled()) {
            const element = this.ref.nativeElement;
            const rect = element.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (x < 5) {
                this.resize = 'left';
            } else if (element.offsetWidth - x < 5) {
                this.resize = 'right';
            } else if (y < 5) {
                this.resize = 'top';
            } else if (element.offsetHeight - y < 5) {
                this.resize = 'bottom';
            } else {
                this.resize = undefined;
            }

            if (this.resize) {
                clearTimeout(this.timer);
            }

            if (this.cdkDrag) {
                this.cdkDrag.disabled = this.resize !== undefined;
            }
        }
    }

    @HostListener('mouseout')
    mouseout() {
        if (this.resize) {
            this.timer = setTimeout(() => {
                this.resize = undefined;
                this.resizeActive = undefined;
                if (this.cdkDrag) {
                    this.cdkDrag.disabled = false;
                }
            }, 50);
        }
    }
}
