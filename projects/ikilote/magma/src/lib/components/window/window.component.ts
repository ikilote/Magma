import { CdkDrag, CdkDragEnd, CdkDragHandle, Point } from '@angular/cdk/drag-drop';
import { OverlayRef } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import {
    Component,
    Directive,
    ElementRef,
    HostListener,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    Type,
    WritableSignal,
    booleanAttribute,
    computed,
    inject,
    input,
    model,
    output,
    signal,
    viewChildren,
} from '@angular/core';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';
import { MagmaNgInitDirective } from '../../directives/ng-init.directive';
import { MagmaResizeElement, MagmaResizeHostElement, ResizeDirection } from '../../directives/resizer';
import { MagmaResize } from '../../directives/resizer.directive';

export type MagmaWindowFixed = boolean | 'top' | 'left' | 'right' | 'bottom';

export interface MagmaWindowInitParams {
    inputs?: Record<string, any>;
    id?: string;
    position?: 'default' | 'center' | { x: number; y: number };
    zoneSelector?: string;
    over?: boolean;
    fixed?: MagmaWindowFixed;
    bar?: {
        active?: boolean;
        title?: string;
        buttons?: boolean;
    };
    size?: {
        lock?: boolean;
        width?: { min?: string; init?: string; max?: string };
        height?: { min?: string; init?: string; max?: string };
    };
}

export interface MagmaWindowInfos extends MagmaWindowInitParams {
    component: Type<any>;
    id: string;
    overlayRef?: OverlayRef;
    index: WritableSignal<number>;
}

@Directive()
export abstract class AbstractWindowComponent {
    parent = input.required<MagmaWindow>();

    close() {
        this.parent().onClose.emit();
    }
}

@Component({
    selector: 'mg-window',
    templateUrl: './window.component.html',
    styleUrl: './window.component.scss',
    host: {
        '[style.--index]': '_index()',
        '[style.position]': 'fixedEdgeClass() ? "absolute" : null',
        '[class.fixed-edge]': '!!fixedEdgeClass()',
        '[class.fixed-top]': 'fixedEdgeClass() === "fixed-top"',
        '[class.fixed-bottom]': 'fixedEdgeClass() === "fixed-bottom"',
        '[class.fixed-left]': 'fixedEdgeClass() === "fixed-left"',
        '[class.fixed-right]': 'fixedEdgeClass() === "fixed-right"',
    },
    imports: [CdkDrag, CdkDragHandle, MagmaLimitFocusDirective, NgComponentOutlet, MagmaResize, MagmaNgInitDirective],
})
export class MagmaWindow extends MagmaResizeElement implements OnInit, OnChanges, OnDestroy {
    protected readonly elementRef = inject(ElementRef);

    protected readonly cdkDrag = viewChildren(CdkDrag);
    protected readonly elementWin = viewChildren<ElementRef<HTMLDivElement>>('element');

    /** for mg-container-zone */
    readonly component = input<MagmaWindowInfos>();

    /** for mg-container-container */
    index = signal(0);
    readonly zoneSelector = input<string>();
    readonly position = input<'default' | 'center' | { x: number; y: number }>();
    readonly bar = input(undefined, { transform: booleanAttribute });
    readonly barTitle = input<string>(undefined, { alias: 'bar-title' });
    readonly barButtons = input(undefined, { alias: 'bar-buttons', transform: booleanAttribute });
    readonly width = input<string>();
    readonly minWidth = input<string>(undefined, { alias: 'min-width' });
    readonly maxWidth = input<string>(undefined, { alias: 'max-width' });
    readonly height = input<string>();
    readonly minHeight = input<string>(undefined, { alias: 'min-height' });
    readonly maxHeight = input<string>(undefined, { alias: 'max-height' });
    readonly fixed = input<MagmaWindowFixed>();
    readonly over = input(undefined, { transform: booleanAttribute });

    readonly resizerHost = model<MagmaResizeHostElement>();
    readonly isOpen = model(false);

    readonly onClose = output();
    readonly onMinimize = output<void>();
    readonly onMaximize = output<void>();
    readonly onRestore = output<void>();
    readonly onFocus = output<void>();

    protected readonly center = signal(false);
    protected readonly fullscreen = signal(false);
    protected readonly minimized = signal(false);

    /** Whether drag should be disabled (fixed is truthy) */
    protected readonly isFixed = computed(() => !!this.fixed() || !!this.component()?.fixed);

    /** CSS class for edge-fixed positioning */
    protected readonly fixedEdgeClass = computed(() => {
        const fixedValue = this.fixed() || this.component()?.fixed;
        if (typeof fixedValue === 'string') {
            return `fixed-${fixedValue}`;
        }
        return '';
    });

    initPosition: Point = { x: 0, y: 0 };
    private destroyed = false;
    private restoring = false;

    protected _index = computed(() => {
        return (
            (this.component()?.index() || this.index() || 0) +
            (this.over() || this.component()?.over ? 1000 : 0) +
            (this.fullscreen() ? 10000 : 0)
        );
    });

    constructor() {
        super({ x: [0, 0], y: [0, 0] });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['position']) {
            this.updatePosition();
        }
    }

    ngOnInit(): void {
        if (!this.isEdgeFixed()) {
            let { x, y } = this.currentPosition();
            this.initPosition = { x, y };
            this.updatePosition();
        }
    }

    currentPosition() {
        const rectZone = this.getZone()?.getBoundingClientRect();
        const element = this.elementRef.nativeElement;
        const rectElem = element.getBoundingClientRect();

        let x = 0;
        let y = 0;

        if (rectZone) {
            x = rectZone.left - rectElem.left;
            y = rectZone.top - rectElem.top;
        }

        return { x, y };
    }

    updatePosition() {
        if (this.destroyed) {
            return;
        }

        const element = this.elementRef.nativeElement;
        const zone = this.getZone();
        const dragInstance = this.cdkDrag()?.[0];

        const position = this.position() || this.component()?.position;

        let { x, y } = this.initPosition;

        if (position === 'center') {
            x += ((zone?.offsetWidth ?? window.innerWidth) - element.offsetWidth) / 2;
            y += ((zone?.offsetHeight ?? window.innerHeight) - element.offsetHeight) / 2;
            this.x = [x, element.offsetWidth];
            this.y = [y, element.offsetHeight];
            dragInstance?.setFreeDragPosition({ x, y });
        } else if (position && typeof position === 'object' && 'x' in position && 'y' in position) {
            this.x = [x + position.x, element.offsetWidth];
            this.y = [y + position.y, element.offsetHeight];
            dragInstance?.setFreeDragPosition({ x: x + position.x, y: y + position.y });
        } else {
            this.x = [0, element.offsetWidth];
            this.y = [0, element.offsetHeight];
            dragInstance?.setFreeDragPosition({ x: 0, y: 0 });
        }
    }

    drag(drag: CdkDragEnd) {
        const { x, y } = drag.distance;
        const element = this.elementWin()?.[0].nativeElement;
        const zone = this.getZone();
        this.x = [
            Math.min(
                Math.max(this.x[0] + x, this.initPosition.x),
                (zone?.offsetWidth ?? window.innerWidth) - element.offsetWidth + this.initPosition.x,
            ),
            element.offsetWidth,
        ];
        this.y = [
            Math.min(
                Math.max(this.y[0] + y, this.initPosition.y),
                (zone?.offsetHeight ?? window.innerHeight) - element.offsetHeight + this.initPosition.y,
            ),
            element.offsetHeight,
        ];
    }

    open() {
        this.isOpen.set(true);
    }

    minimize() {
        this.minimized.set(true);
        this.onMinimize.emit();
    }

    restore() {
        this.restoring = true;
        this.minimized.set(false);
        this.onRestore.emit();
    }

    winInit() {
        if (this.restoring) {
            // Restoring from minimize: re-apply the stored drag position
            this.restoring = false;
            setTimeout(() => {
                this.cdkDrag()?.[0]?.setFreeDragPosition({ x: this.x[0], y: this.y[0] });
            });
        } else if (this.isEdgeFixed()) {
            // Edge-fixed: positioning is handled entirely by CSS, no drag positioning needed
        } else {
            // First render: compute and apply initial position
            setTimeout(() => {
                this.updatePosition();
            });
        }
    }

    /** Whether fixed is an edge direction string */
    private isEdgeFixed(): boolean {
        const fixedValue = this.fixed() || this.component()?.fixed;
        return typeof fixedValue === 'string';
    }

    /**
     * Returns the cdkDragBoundary selector.
     * If the zone element is an ancestor (container mode), uses the zone selector.
     * Otherwise (overlay mode), uses 'body' as a loose boundary — the precise
     * clamping to the zone is handled in drag() at the end of the drag gesture.
     */
    getDragBoundary(): string {
        const selector = this.zoneSelector() || this.component()?.zoneSelector;
        if (!selector) return 'body';

        const zone = document.querySelector(selector);
        if (zone && zone.contains(this.elementRef.nativeElement)) {
            return selector;
        }
        // Zone exists but is not an ancestor (overlay mode) — use body as boundary
        return 'body';
    }

    /**
     * CDK Drag constrain function — called on every frame during drag.
     * Clamps the position within the zone boundaries (or viewport if no zone).
     */
    constrainPosition = (point: Point, _dragRef: any): Point => {
        const zone = this.getZone();
        const element = this.elementWin()?.[0]?.nativeElement;

        const maxWidth = zone?.offsetWidth ?? window.innerWidth;
        const maxHeight = zone?.offsetHeight ?? window.innerHeight;
        const elWidth = element?.offsetWidth ?? 0;
        const elHeight = element?.offsetHeight ?? 0;

        const minX = this.initPosition.x;
        const minY = this.initPosition.y;
        const maxX = maxWidth - elWidth + this.initPosition.x;
        const maxY = maxHeight - elHeight + this.initPosition.y;

        return {
            x: Math.min(Math.max(point.x, minX), maxX),
            y: Math.min(Math.max(point.y, minY), maxY),
        };
    };

    change() {
        this.fullscreen.set(!this.fullscreen());
        const element = this.elementWin()[0]?.nativeElement;

        if (this.fullscreen()) {
            this.onMaximize.emit();
            let { x, y } = this.initPosition;
            this.cdkDrag()[0].setFreeDragPosition({ x, y });

            const zone = this.getZone();
            element.style.width = (zone?.offsetWidth ?? window.innerWidth) + 'px';
            element.style.height = (zone?.offsetHeight ?? window.innerHeight) + 'px';
        } else {
            this.onRestore.emit();
            this.cdkDrag()[0].setFreeDragPosition({ x: this.x[0], y: this.y[0] });
            element.style.width = this.x[1] + 'px';
            element.style.height = this.y[1] + 'px';
        }
    }

    close() {
        this.resizerHost()?.remove(this);
        this.isOpen.set(false);
        this.onClose.emit();
    }

    @HostListener('mousedown')
    mousedown() {
        this.onFocus.emit();
        if (!this.component()) {
            this.resizerHost()?.select(this);
        }
    }

    private getZone() {
        const component = this.component();
        const zoneSelector = this.zoneSelector() || component?.zoneSelector;
        return zoneSelector ? document.querySelector<HTMLElement>(zoneSelector) : null;
    }

    override update(resize: ResizeDirection, data: [number, number]): void {
        const element = this.elementWin()[0]?.nativeElement;

        switch (resize) {
            case 'left':
                if (data[0] > this.initPosition.x && element) {
                    const size = this.x[0] - data[0] + this.x[1];
                    element.style.width = size + 'px';
                    if (size === element.offsetWidth) {
                        this.x = [data[0], element.offsetWidth];
                        this.cdkDrag()[0].setFreeDragPosition({ x: data[0], y: this.y[0] });
                    }
                }
                break;
            case 'right':
                if (data[1] > this.initPosition.x && element) {
                    element.style.width = data[1] + 'px';
                    this.x = [this.x[0], element.offsetWidth];
                }
                break;
            case 'top':
                const size = this.y[0] - data[0] + this.y[1];
                element.style.height = size + 'px';
                if (data[0] > this.initPosition.y && size === element.offsetHeight) {
                    this.y = [data[0], element.offsetHeight];
                    this.cdkDrag()[0].setFreeDragPosition({ x: this.x[0], y: data[0] });
                }
                break;
            case 'bottom':
                if (data[1] > this.initPosition.y && element) {
                    element.style.height = data[1] + 'px';
                    this.y = [this.y[0], element.offsetHeight];
                }
                break;
        }
    }

    protected withContext(inputs?: Record<string, any>): Record<string, any> & { parent: MagmaWindow } {
        return { ...inputs, ...{ parent: this } };
    }

    ngOnDestroy(): void {
        this.destroyed = true;
    }
}
