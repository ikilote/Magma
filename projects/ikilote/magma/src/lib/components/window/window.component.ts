import { CdkDrag, CdkDragEnd, CdkDragHandle, Point } from '@angular/cdk/drag-drop';
import { OverlayRef } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    HostListener,
    OnChanges,
    OnInit,
    SimpleChanges,
    Type,
    booleanAttribute,
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

export interface MagmaWindowInitParams {
    inputs?: Record<string, any>;
    id?: string;
    position?: 'default' | 'center' | { x: number; y: number };
    zoneSelector?: string;
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
    index: number;
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
        '[style.--index]': 'component()?.index || index || 1',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkDrag, CdkDragHandle, MagmaLimitFocusDirective, NgComponentOutlet, MagmaResize, MagmaNgInitDirective],
})
export class MagmaWindow extends MagmaResizeElement implements OnInit, OnChanges {
    protected readonly elementRef = inject(ElementRef);

    protected readonly cdkDrag = viewChildren(CdkDrag);
    protected readonly elementWin = viewChildren<ElementRef<HTMLDivElement>>('element');

    /** for mg-container-zone */
    readonly component = input<MagmaWindowInfos>();

    /** for mg-container-container */
    index = 0;
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

    readonly resizerHost = model<MagmaResizeHostElement>();
    readonly isOpen = model(false);

    readonly onClose = output();

    protected readonly center = signal(false);
    protected readonly fullscreen = signal(false);

    private initPosition: Point = { x: 0, y: 0 };

    constructor() {
        super({ x: [0, 0], y: [0, 0] });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['position']) {
            this.updatePosition();
        }
    }

    ngOnInit(): void {
        let { x, y } = this.currentPosition();
        this.initPosition = { x, y };
        this.updatePosition();
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
        const element = this.elementRef.nativeElement;
        const zone = this.getZone();

        const position = this.position() || this.component()?.position;

        let { x, y } = this.initPosition;

        if (position === 'center') {
            x += ((zone?.offsetWidth ?? window.innerWidth) - element.offsetWidth) / 2;
            y += ((zone?.offsetHeight ?? window.innerHeight) - element.offsetHeight) / 2;
            this.x = [x, element.offsetWidth];
            this.y = [y, element.offsetHeight];
            this.cdkDrag()?.[0]?.setFreeDragPosition({ x, y });
        } else if (position && typeof position === 'object' && 'x' in position && 'y' in position) {
            this.x = [x + position.x, element.offsetWidth];
            this.y = [y + position.y, element.offsetHeight];
            this.cdkDrag()?.[0]?.setFreeDragPosition({ x: x + position.x, y: y + position.y });
        } else {
            this.x = [0, element.offsetWidth];
            this.y = [y, element.offsetHeight];
            this.cdkDrag()?.[0]?.setFreeDragPosition({ x: 0, y: 0 });
        }
    }

    drag(drag: CdkDragEnd) {
        const { x, y } = drag.distance;
        const element = this.elementRef.nativeElement;
        this.x = [Math.min(Math.max(this.x[0] + x, 0), window.innerWidth - element.offsetWidth), element.offsetWidth];
        this.y = [
            Math.min(Math.max(this.y[0] + y, 0), window.innerHeight - element.offsetHeight),
            element.offsetHeight,
        ];
    }

    open() {
        this.isOpen.set(true);
    }

    winInit() {
        setTimeout(() => {
            this.updatePosition();
        });
    }

    change() {
        this.fullscreen.set(!this.fullscreen());
        const element = this.elementWin()[0]?.nativeElement;

        if (this.fullscreen()) {
            this.cdkDrag()[0].setFreeDragPosition({ x: 0, y: 0 });

            const zone = this.getZone();
            element.style.width = (zone?.offsetWidth ?? window.innerWidth) + 'px';
            element.style.height = (zone?.offsetHeight ?? window.innerHeight) + 'px';
        } else {
            this.cdkDrag()[0].setFreeDragPosition({ x: this.x[0], y: this.y[0] });
            element.style.width = this.x[1] + 'px';
            element.style.height = this.y[1] + 'px';
        }
    }

    close() {
        if (!this.component()) {
            this.resizerHost()?.remove(this);
        }
        this.isOpen.set(false);
        this.onClose.emit();
    }

    @HostListener('mousedown')
    mousedown() {
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
                if (data[0] > 15 && element) {
                    const size = this.x[0] - data[0] + this.x[1];
                    element.style.width = size + 'px';
                    if (size === element.offsetWidth) {
                        this.x = [data[0], element.offsetWidth];
                        this.cdkDrag()[0].setFreeDragPosition({ x: data[0], y: this.y[0] });
                    }
                }
                break;
            case 'right':
                if (data[1] > 15 && element) {
                    element.style.width = data[1] + 'px';
                    this.x = [this.x[0], element.offsetWidth];
                }
                break;
            case 'top':
                const size = this.y[0] - data[0] + this.y[1];
                element.style.height = size + 'px';
                if (data[0] > 15 && size === element.offsetHeight) {
                    this.y = [data[0], element.offsetHeight];
                    this.cdkDrag()[0].setFreeDragPosition({ x: this.x[0], y: data[0] });
                }
                break;
            case 'bottom':
                if (data[1] > 15 && element) {
                    element.style.height = data[1] + 'px';
                    this.y = [this.y[0], element.offsetHeight];
                }
                break;
        }
    }

    protected withContext(inputs?: Record<string, any>) {
        return { ...inputs, ...{ parent: this } };
    }
}
