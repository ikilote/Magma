import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
    AfterContentChecked,
    Component,
    ElementRef,
    OnDestroy,
    contentChildren,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { MagmaEllipsisItemComponent } from './ellipsis-item.component';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';
import { MagmaPointerModeService } from '../../services/pointer-mode.service';
import { redispatchAtPoint } from '../../utils/dom';

@Component({
    selector: 'mg-ellipsis-button, [mgEllipsisButton]',
    templateUrl: './ellipsis-button.component.html',
    styleUrl: './ellipsis-button.component.scss',
    imports: [CdkOverlayOrigin, CdkConnectedOverlay, MagmaLimitFocusDirective],
})
export class MagmaEllipsisButton implements AfterContentChecked, OnDestroy {
    protected readonly element = viewChild<ElementRef<HTMLDivElement>>('element');
    protected readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');
    private readonly pointerMode = inject(MagmaPointerModeService);

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
        if (this.pointerMode.isKeyboard()) {
            setTimeout(() => this.button().nativeElement.focus());
        }
    }

    closeAndRedispatch(event: MouseEvent) {
        this.close();
        redispatchAtPoint(event.clientX, event.clientY, 'click', event.button);
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
