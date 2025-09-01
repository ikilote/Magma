import { Component } from '@angular/core';

import { MagmaContribCalendar } from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-contrib-calendar',
    templateUrl: './demo-contrib-calendar.component.html',
    styleUrls: ['./demo-contrib-calendar.component.scss'],
    imports: [MagmaContribCalendar],
})
export class DemoContribCalendarComponent {}
