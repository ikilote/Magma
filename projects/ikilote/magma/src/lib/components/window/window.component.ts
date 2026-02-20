import { CdkDrag } from '@angular/cdk/drag-drop';
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

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';

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
    imports: [CdkDrag, MagmaLimitFocusDirective, NgComponentOutlet],
})
export class MagmaWindow implements AfterViewInit {
    private readonly elementRef = inject(ElementRef);
    private readonly cdkDrag = viewChildren(CdkDrag);

    isOpen = model(false);

    component = input<MagmaWindowInfos>();

    center = signal(false);

    readonly onClose = output();

    ngAfterViewInit(): void {
        if (this.component()?.position === 'center') {
            this.cdkDrag()[0].freeDragPosition = {
                x: (window.innerWidth - this.elementRef.nativeElement.clientWidth) / 2,
                y: (window.innerHeight - this.elementRef.nativeElement.clientHeight) / 2,
            };
        }
    }

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.onClose.emit();
    }

    protected withContext(inputs?: Record<string, any>) {
        return { ...inputs, ...{ parent: this } };
    }
}
