import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mg-input-label, mg-input-desc',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: '<ng-content></ng-content>',
})
export class MagmaInputElement {}
