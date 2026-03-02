import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    contentChildren,
    inject,
} from '@angular/core';

import { MagmaWindow } from './window.component';

import { MagmaResizeHostElement } from '../../directives/resizer';

@Component({
    selector: 'mg-windows-container',
    templateUrl: './windows-container.component.html',
    styleUrl: './windows-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaWindowsContainer implements MagmaResizeHostElement, AfterContentChecked {
    protected readonly windows = contentChildren(MagmaWindow, { descendants: true });

    protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
    readonly cd = inject(ChangeDetectorRef);

    heightElementNumber = 0;
    widthElementNumber = 0;
    elementSize = 1;

    ngAfterContentChecked(): void {
        this.heightElementNumber = this.element.nativeElement.offsetHeight;
        this.widthElementNumber = this.element.nativeElement.offsetWidth;
        const win = this.windows();
        if (win?.length) {
            win.forEach((element, index) => {
                element.resizerHost.set(this);
                element.index = index;
            });
        }
    }

    select(window: MagmaWindow) {
        const index = window.index;
        const win = this.windows();
        win.forEach(window => {
            if (window.index > index) {
                window.index -= 1;
            }
        });
        window.index = win.length - 1;
    }

    remove(window: MagmaWindow) {
        const win = this.windows();
        const index = win.indexOf(window);
        if (index !== -1) {
            win.slice(index, 1);
        }
    }
}
