import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mg-contrib-calendar',
    templateUrl: './contrib-calendar.component.html',
    styleUrls: ['./contrib-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaContribCalendar {}
