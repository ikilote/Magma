import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

import { ClassListPipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-class-list',
    templateUrl: './demo-class-list.component.html',
    styleUrls: ['./demo-class-list.component.scss'],
    imports: [CodeTabsComponent, ClassListPipe, JsonPipe],
})
export class DemoClassListComponent {
    default = "{{ ['test', ['class-1 class-2'], 'class-a class-b'] | class-list }}";
}
