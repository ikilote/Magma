import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

import { MathPipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-math',
    templateUrl: './demo-math.component.html',
    styleUrls: ['./demo-math.component.scss'],
    imports: [CodeTabsComponent, MathPipe, JsonPipe],
})
export class DemoMathComponent {
    abs = "{{ -150.5 | math: 'abs' }}";
    trunc = "{{ -159.5599 | math: 'trunc' }}";
    round = "{{ -159.5599 | math: 'round' }}";
    random = "{{ '' | math: 'random' }}";
    min = "{{ 150 | math: 'min' : 10 : -5 : 155 }}";
    max = "{{ 150 | math: 'max' : 10 : -5 : 155 }}";
}
