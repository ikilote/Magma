import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
    AfterContentChecked,
    Component,
    ElementRef,
    OnDestroy,
    contentChildren,
    signal,
    viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { MagmaEllipsisItemComponent } from './ellipsis-item.component';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';

@Component({
    selector: 'mg-ellipsis-button, [mgEllipsisButton]',
    templateUrl: './ellipsis-button.component.html',
    styleUrl: './ellipsis-button.component.scss',
    host: {},
    imports: [CdkOverlayOrigin, CdkConnectedOverlay, MagmaLimitFocusDirective],
})
export class MagmaEllipsisButton implements AfterContentChecked, OnDestroy {
    protected readonly element = viewChild<ElementRef<HTMLDivElement>>('element');
    protected readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');

    readonly inputs = contentChildren(MagmaEllipsisItemComponent);

    protected readonly isOpen = signal(false);
    protected readonly sub = toObservable(this.element).subscribe(() => {
        (this.element()?.nativeElement.querySelector('mg-ellipsis-item:not(.disabled)') as HTMLElement)?.focus();
    });

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        setTimeout(() => {
            this.button().nativeElement.focus();
        });
    }

    ngAfterContentChecked(): void {
        if (this.inputs()?.length) {
            this.inputs().forEach(e => {
                e.host ??= this;
            });
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
