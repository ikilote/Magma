import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
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
import { MagmaResize, ResizeDirection, ResizeElement } from '../../directives/resizer.directive';

export type MagmaWindowInfos = {
    component: Type<any>;
    inputs?: Record<string, any>;
    overlayRef?: OverlayRef;
    id: string;
    index: number;
    position?: 'default' | 'center';
};

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
    imports: [CdkDrag, MagmaLimitFocusDirective, NgComponentOutlet, MagmaResize],
})
export class MagmaWindow extends ResizeElement implements AfterViewInit {
    private readonly elementRef = inject(ElementRef);
    private readonly cdkDrag = viewChildren(CdkDrag);
    private readonly elementWin = viewChildren<ElementRef<HTMLDivElement>>('element');

    readonly isOpen = model(false);

    readonly component = input<MagmaWindowInfos>();
    readonly resizerHost = input<MagmaWindowsZone>();

    readonly center = signal(false);

    readonly onClose = output();

    constructor() {
        super({ x: [0, 0], y: [0, 0] });
    }

    ngAfterViewInit(): void {
        const element = this.elementRef.nativeElement;

        if (this.component()?.position === 'center') {
            const x = (window.innerWidth - element.offsetWidth) / 2;
            const y = (window.innerHeight - element.offsetHeight) / 2;
            this.x = [x, element.offsetWidth];
            this.y = [y, element.offsetHeight];
            this.cdkDrag()[0].freeDragPosition = { x, y };
        } else {
            this.x[1] = element.offsetWidth;
            this.y[1] = element.offsetHeight;
        }
    }

    drag(drag: CdkDragEnd) {
        console.log('drag', drag, this.elementRef.nativeElement);
        const { x, y } = drag.distance;
        this.x = [this.x[0] + x, this.elementRef.nativeElement.offsetWidth];
        this.y = [this.y[0] + y, this.elementRef.nativeElement.offsetHeight];
    }

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.onClose.emit();
    }

    override update(resize: ResizeDirection, data: [number, number]): void {
        console.log(resize, data);
        const element = this.elementWin()[0]?.nativeElement;

        switch (resize) {
            case 'left':
                break;
            case 'right':
                if (data[1] > 15 && element) {
                    element.style.width = data[1] + 'px';
                    this.x = [this.x[0], element.offsetWidth];
                }
                break;
            case 'top':
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
