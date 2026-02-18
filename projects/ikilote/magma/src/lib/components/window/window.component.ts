import { CdkDrag } from '@angular/cdk/drag-drop';
import { OverlayRef } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Directive,
    Type,
    input,
    output,
    signal,
} from '@angular/core';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';
import { MagmaWindows } from '../../services/windows';

export type MagmaWindowInfos = {
    component: Type<any>;
    inputs?: Record<string, any>;
    overlayRef?: OverlayRef;
    id: string;
};

@Directive()
export abstract class AbstractWindowComponent {
    parent = input.required<MagmaWindow>();
    context = input.required<MagmaWindows>();

    close() {
        console.log(this);
        this.context()?.removeWindow(this.parent().component()!);
    }
}

@Component({
    selector: 'mg-window',
    templateUrl: './window.component.html',
    styleUrl: './window.component.scss',
    host: {},
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkDrag, MagmaLimitFocusDirective, NgComponentOutlet],
})
export class MagmaWindow implements AfterViewInit {
    isOpen = signal(false);

    component = input<MagmaWindowInfos>();
    context = input<MagmaWindows>();

    readonly onClose = output();

    ngAfterViewInit(): void {
        console.log('component', this.component);
    }

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.onClose.emit();
    }

    protected withContext(inputs?: Record<string, any>) {
        return { ...inputs, ...{ parent: this, context: this.context() } };
    }
}
