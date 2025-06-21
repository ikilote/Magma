import { Component, computed, input } from '@angular/core';

@Component({
    selector: 'mg-loader-tile',
    templateUrl: './loader-tile.component.html',
    styleUrls: ['./loader-tile.component.scss'],
    host: {
        '[style.--width]': 'width()',
        '[style.--height]': 'height()',
    },
})
export class MagmaLoaderTile {
    readonly size = input<string>();

    readonly width = computed(() => {
        const width = this.size()?.split(/\s*\/\s*/)[0];
        if (width === 'flex') {
            return '1 1 0';
        } else if (width) {
            return '0 0 ' + width;
        } else {
            return null;
        }
    });

    readonly height = computed(() => {
        const size = this.size()?.split(/\s*\/\s*/);
        const value = size && (size[1] ?? size[0]);
        if (value === 'flex') {
            return null;
        } else if (value) {
            return value;
        } else {
            return null;
        }
    });
}
