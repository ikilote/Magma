import { CdkDrag, CdkDragEnd, CdkDragHandle } from '@angular/cdk/drag-drop';
import { OverlayRef } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    Type,
    inject,
    input,
    model,
    output,
    signal,
    viewChildren,
} from '@angular/core';

import { MagmaWindowsZone } from './windows-zone.component';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';
import { MagmaResizeElement, ResizeDirection } from '../../directives/resizer';
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
        '[style.--index]': 'component()?.index || 0',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkDrag, CdkDragHandle, MagmaLimitFocusDirective, NgComponentOutlet, MagmaResize],
})
export class MagmaWindow extends MagmaResizeElement implements AfterViewInit {
    protected readonly elementRef = inject(ElementRef);

    protected readonly cdkDrag = viewChildren(CdkDrag);
    protected readonly elementWin = viewChildren<ElementRef<HTMLDivElement>>('element');

    readonly isOpen = model(false);

    readonly component = input<MagmaWindowInfos>();
    readonly resizerHost = input<MagmaWindowsZone>();

    readonly onClose = output();

    protected readonly center = signal(false);
    protected readonly fullscreen = signal(false);

    private retry = false;

    constructor() {
        super({ x: [0, 0], y: [0, 0] });
    }

    ngAfterViewInit(): void {
        const element = this.elementRef.nativeElement;
        const component = this.component();
        const zone = this.getZone();

        if (component?.position === 'center') {
            const x = ((zone?.offsetWidth ?? window.innerWidth) - element.offsetWidth) / 2;
            const y = ((zone?.offsetHeight ?? window.innerHeight) - element.offsetHeight) / 2;
            this.x = [x, element.offsetWidth];
            this.y = [y, element.offsetHeight];
            this.cdkDrag()[0].setFreeDragPosition({ x, y });

            if ((x < 0 || y < 0) && !this.retry) {
                // retry when size is invalide
                setTimeout(() => {
                    this.ngAfterViewInit();
                });
                this.retry = true;
            }
        } else if (
            component?.position &&
            typeof component.position === 'object' &&
            'x' in component.position &&
            'y' in component.position
        ) {
            this.x = [component.position.x, element.offsetWidth];
            this.y = [component.position.y, element.offsetHeight];
            this.cdkDrag()[0].setFreeDragPosition(component.position);
        } else {
            this.x = [this.x[0], element.offsetWidth];
            this.y = [this.y[0], element.offsetHeight];
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

    change() {
        this.fullscreen.set(!this.fullscreen());
        const element = this.elementWin()[0]?.nativeElement;

        if (this.fullscreen()) {
            this.cdkDrag()[0].setFreeDragPosition({ x: 0, y: 0 });

            const zone = this.getZone();
            console.log(zone?.offsetWidth, zone?.offsetHeight);
            element.style.width = (zone?.offsetWidth ?? window.innerWidth) + 'px';
            element.style.height = (zone?.offsetHeight ?? window.innerHeight) + 'px';
        } else {
            this.cdkDrag()[0].setFreeDragPosition({ x: this.x[0], y: this.y[0] });
            element.style.width = this.x[1] + 'px';
            element.style.height = this.y[1] + 'px';
        }
    }

    close() {
        this.isOpen.set(false);
        this.onClose.emit();
    }

    private getZone() {
        const component = this.component();
        return component?.zoneSelector ? document.querySelector<HTMLElement>(component.zoneSelector) : null;
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
