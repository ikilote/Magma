import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mg-input-label, mg-input-desc, mg-input-prefix, mg-input-suffix',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: '<ng-content></ng-content>',
    styleUrls: ['input-element.component.scss'],
})
export class MagmaInputElement {}
