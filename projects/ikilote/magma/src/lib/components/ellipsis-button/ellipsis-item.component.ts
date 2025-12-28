import { ChangeDetectionStrategy, Component, OnDestroy, inject, output } from '@angular/core';

import { MagmaEllipsisButton } from './ellipsis-button.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';

@Component({
    selector: 'mg-ellipsis-item',
    templateUrl: './ellipsis-item.component.html',
    styleUrls: ['./ellipsis-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [MagmaClickEnterDirective],
})
export class MagmaEllipsisItemComponent implements OnDestroy {
    host?: MagmaEllipsisButton;

    protected readonly clickEnter = inject(MagmaClickEnterDirective);

    protected readonly action = output();

    protected readonly sub = this.clickEnter.clickEnter.subscribe(() => {
        this.action.emit();
        this.host?.close();
    });

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
