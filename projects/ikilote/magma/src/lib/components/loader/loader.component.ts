import { Component, model } from '@angular/core';

export type MagmaLoaderMode = 'absolute' | 'fixed' | 'inline';

@Component({
    selector: 'mg-loader',
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
    exportAs: 'loader',
    host: {
        '[class.loading]': 'loading()',
        '[class.fixed]': `mode() === 'fixed'`,
        '[class.inline]': `mode() === 'inline'`,
    },
})
export class MagmaLoader {
    readonly loading = model<boolean>(false);
    readonly mode = model<MagmaLoaderMode | undefined>();

    start() {
        this.loading.set(true);
    }

    stop() {
        this.loading.set(false);
    }
}
