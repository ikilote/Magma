import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    booleanAttribute,
    inject,
    input,
    output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Logger } from '../../services/logger';

@Component({
    selector: 'datetime-picker',
    templateUrl: './datetime-picker.component.html',
    styleUrls: ['./datetime-picker.component.scss'],
    imports: [FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {},
})
export class MagmaDatetimePickerComponent {
    readonly logger = inject(Logger);
    readonly cd = inject(ChangeDetectorRef);

    readonly value = input<string | undefined>('');
    readonly readonly = input(false, { transform: booleanAttribute });

    datetimeChange = output<string>();
}
