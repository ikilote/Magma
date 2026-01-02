import { ChangeDetectionStrategy, Component, model } from '@angular/core';

@Component({
    selector: 'mg-loader',
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'loader',
    host: {
        '[class.loading]': 'loading()',
    },
})
export class MagmaLoader {
    readonly loading = model<boolean>(false);

    start() {
        this.loading.set(true);
    }

    stop() {
        this.loading.set(false);
    }
}
