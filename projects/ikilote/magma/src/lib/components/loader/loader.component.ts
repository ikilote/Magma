import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FileSizePipe, FileSizePipeParams } from '../../pipes/file-size.pipe';
import { numberAttributeOrUndefined } from '../../utils/coercion';
import { MagmaSpinner } from '../spinner/spinner.component';

/**
 * Loader with message and/or progress bar
 */
@Component({
    selector: 'mg-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [FileSizePipe, MagmaSpinner],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaLoader {
    // input

    readonly message = input<string>();
    readonly progressLoaded = input(undefined, { transform: numberAttributeOrUndefined });
    readonly progressTotal = input(undefined, { transform: numberAttributeOrUndefined });
    readonly progressSizeFormat = input<FileSizePipeParams>();
}
