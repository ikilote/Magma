import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector:
        'mg-input-label, mg-input-desc, mg-input-error, mg-input-prefix, mg-input-suffix, mg-input-before, ' +
        'mg-input-after, mg-input-textarea-desc',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: '<ng-content />',
    styleUrls: ['input-element.component.scss'],
})
export class MagmaInputElement {}
