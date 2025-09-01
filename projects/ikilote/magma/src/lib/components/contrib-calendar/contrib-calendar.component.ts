import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RepeatForPipe } from '../../pipes/repeat-for.pipe';

@Component({
    selector: 'mg-contrib-calendar',
    templateUrl: './contrib-calendar.component.html',
    styleUrls: ['./contrib-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RepeatForPipe],
})
export class MagmaContribCalendar {}
