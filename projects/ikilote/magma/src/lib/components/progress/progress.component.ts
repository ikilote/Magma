import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FileSizePipe, FileSizePipeParams } from '../../pipes/file-size.pipe';
import { numberAttributeOrUndefined } from '../../utils/coercion';

/**
 * Loader with message and/or progress bar
 */
@Component({
    selector: 'mg-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss'],
    imports: [FileSizePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaProgress {
    // input

    readonly loaded = input(undefined, { transform: numberAttributeOrUndefined });
    readonly total = input(undefined, { transform: numberAttributeOrUndefined });
    readonly sizeFormat = input<FileSizePipeParams>();
}
