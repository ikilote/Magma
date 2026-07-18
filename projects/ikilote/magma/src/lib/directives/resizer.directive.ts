import { CdkDrag, Point } from '@angular/cdk/drag-drop';
import { Directive, ElementRef, HostListener, booleanAttribute, inject, input, output } from '@angular/core';

import { MagmaResizeElement, MagmaResizeEvent, MagmaResizeHostElement, ResizeDirection } from './resizer';

let index = 0;

@Directive({
    selector: '[resizer]',
    host: {
        '[class.ew-resize]': "resize === 'left' || resize === 'right'",
        '[class.ns-resize]': "resize === 'top' || resize === 'bottom'",
        '[class.nw-resize]': "resize === 'top-left' || resize === 'bottom-right'",
        '[class.ne-resize]': "resize === 'top-right' || resize === 'bottom-left'",
    },
})
export class MagmaResize {
    private static active = '';

    private readonly ref = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly cdkDrag = inject(CdkDrag, { optional: true });

    readonly resizer = input.required<MagmaResizeElement>();
    readonly resizerHost = input<MagmaResizeHostElement>();
    readonly resizerDisabled = input(false, { transform: booleanAttribute });
    readonly resizerInit = input<Point>({ x: 0, y: 0 });

    readonly resizerStart = output<MagmaResizeEvent>();
    readonly resizerChange = output<MagmaResizeEvent>();
    readonly resizerEnd = output<MagmaResizeEvent>();

    private id = `resizer-${index++}`;

    resize?: ResizeDirection;
    resizeActive?: {
        mousePosInit: [number, number];
        itemSource: MagmaResizeElement;
    };

    private timer: any;

    @HostListener('mousedown', ['$event'])
    mousedown(event: MouseEvent) {
        if (this.resize && !this.resizerDisabled()) {
            MagmaResize.active = this.id;
            this.resizeActive = {
                mousePosInit: [event.x, event.y],
                itemSource: new MagmaResizeElement({ x: [...this.resizer().x], y: [...this.resizer().y] }),
            };
            this.resizerStart.emit({
                direction: this.resize,
                x: [...this.resizer().x],
                y: [...this.resizer().y],
            });
            event.stopPropagation();
        }
    }

    @HostListener('window:mouseup')
    mouseupWindow() {
        if (MagmaResize.active === this.id) {
            MagmaResize.active = '';
            this.resizeActive = undefined;
            this.resizerEnd.emit({
                direction: this.resize!,
                x: [...this.resizer().x],
                y: [...this.resizer().y],
            });
        }
    }

    @HostListener('window:mousemove', ['$event'])
    mouseoverWindow(event: MouseEvent) {
        if (!this.resizerDisabled() && MagmaResize.active === this.id) {
            const resizeActive = this.resizeActive;
            const resizes = this.resize?.split('-') as ResizeDirection[];
            const host = this.resizerHost();

            if (resizes) {
                for (const resize of resizes) {
                    if (host && resizeActive && resize) {
                        const [changeX, changeY] = [
                            Math.round((resizeActive.mousePosInit[0] - event.x) / host.elementSize),
                            Math.round((resizeActive.mousePosInit[1] - event.y) / host.elementSize),
                        ];

                        let data: [number, number] | undefined;
                        const itemSource = resizeActive.itemSource;

                        if (resize === 'top') {
                            data = [Math.max(itemSource.y[0] - changeY, this.resizerInit().y), itemSource.y[1]];
                        }
                        if (resize === 'bottom') {
                            data = [
                                itemSource.y[0],
                                Math.min(
                                    itemSource.y[1] - changeY,
                                    host.heightElementNumber + this.resizerInit().y - itemSource.y[0],
                                ),
                            ];
                        }
                        if (resize === 'left') {
                            data = [Math.max(itemSource.x[0] - changeX, this.resizerInit().x), itemSource.x[1]];
                        }
                        if (resize === 'right') {
                            data = [
                                itemSource.x[0],
                                Math.min(
                                    itemSource.x[1] - changeX,
                                    host.widthElementNumber + this.resizerInit().x - itemSource.x[0],
                                ),
                            ];
                        }

                        if (this.resize) {
                            clearTimeout(this.timer);
                        }

                        if (data) {
                            this.resizer().animation = false;
                            this.resizer().update(resize, data);
                            this.resizerChange.emit({
                                direction: this.resize!,
                                x: [...this.resizer().x],
                                y: [...this.resizer().y],
                            });
                            setTimeout(() => {
                                this.resizer().animation = true;
                            }, 10);
                        }
                    }
                }
            }
        }
    }

    @HostListener('mousemove', ['$event'])
    mouseover(event: MouseEvent) {
        // Si un autre resize est actif, ne pas interférer
        if (MagmaResize.active && MagmaResize.active !== this.id) {
            return;
        }

        if (!this.resizeActive && !this.resizerDisabled()) {
            const element = this.ref.nativeElement;
            const rect = element.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (x < 5) {
                if (y < 5) {
                    this.resize = 'top-left';
                } else if (element.offsetHeight - y < 5) {
                    this.resize = 'bottom-left';
                } else {
                    this.resize = 'left';
                }
            } else if (element.offsetWidth - x < 5) {
                if (y < 5) {
                    this.resize = 'top-right';
                } else if (element.offsetHeight - y < 5) {
                    this.resize = 'bottom-right';
                } else {
                    this.resize = 'right';
                }
            } else if (y < 5) {
                this.resize = 'top';
            } else if (element.offsetHeight - y < 5) {
                this.resize = 'bottom';
            } else {
                this.resize = undefined;
            }

            if (this.resize) {
                clearTimeout(this.timer);
                // Stopper la propagation uniquement si on est sur une bordure de resize
                // pour éviter qu'une zone en dessous ne prenne le focus
                event.stopPropagation();
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
