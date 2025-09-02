import { Component } from '@angular/core';

import { ContribCalendar, MagmaContribCalendar } from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-contrib-calendar',
    templateUrl: './demo-contrib-calendar.component.html',
    styleUrls: ['./demo-contrib-calendar.component.scss'],
    imports: [MagmaContribCalendar],
})
export class DemoContribCalendarComponent {
    calendar: ContribCalendar = [
        { value: 1, date: '2024-12-30' },
        { value: 15, date: '2025-03-10' },
        { value: 6, date: '2025-08-10' },
    ];
}
