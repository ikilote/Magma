import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RepeatForPipe } from '../../pipes/repeat-for.pipe';

@Component({
    selector: 'mg-contrib-calendar',
    templateUrl: './contrib-calendar.component.html',
    styleUrls: ['./contrib-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RepeatForPipe],
})
export class MagmaContribCalendar {
    days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    mouths = [
        { pos: 0, name: 'Sep' },
        { pos: 5, name: 'Oct' },
        { pos: 10, name: 'Nov' },
        { pos: 15, name: 'Dec' },
        { pos: 20, name: 'Jan' },
    ];
}
