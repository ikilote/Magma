import { CdkDrag } from '@angular/cdk/drag-drop';
import { OverlayRef } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, Type, input, model, output } from '@angular/core';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';

export type MagmaWindowInfos = {
    component: Type<any>;
    inputs?: Record<string, any>;
    overlayRef?: OverlayRef;
    id: string;
    index: number;
    open: boolean;
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
export class MagmaWindow {
    isOpen = model(false);

    component = input<MagmaWindowInfos>();

    readonly onClose = output();

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
