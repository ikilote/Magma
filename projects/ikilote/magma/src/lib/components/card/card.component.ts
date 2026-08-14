import { Component, booleanAttribute, input } from '@angular/core';

import { numberAttributeOrUndefined } from '../../utils/coercion';

export type MagmaCardRatio = '1 / 3' | '1 / 2' | '2 / 3' | string;
export type MagmaCardOrientation = 'horizontal' | 'vertical';

@Component({
    selector: 'mg-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    host: {
        '[style.--card-image]': 'image()',
        '[style.--card-ratio]': 'ratio()',
        '[style.--card-height.px]': 'cardHeight()',
        '[style.--card-img-height]': 'imgHeight()',
        '[class.vertical]': 'orientation() === "vertical"',
        '[class.has-image]': '!!image()',
        '[class.image-zoom]': 'imageZoom()',
    },
})
export class MagmaCard {
    /** Image url in CSS format. Example: url(assets/photo.jpg) */
    readonly image = input<string>();

    /** Ratio between image and body. Default '1 / 3' */
    readonly ratio = input<MagmaCardRatio>('1 / 3');

    /**
     * Orientation of the card.
     * - horizontal: image on left, body on right
     * - vertical: image on top, body on bottom
     */
    readonly orientation = input<MagmaCardOrientation>('horizontal');

    /** Fixed height of the card in px (optional) */
    readonly cardHeight = input<number | undefined>(undefined, { transform: numberAttributeOrUndefined });

    /** Height of the image area (CSS value, e.g. '200px' or '50%') */
    readonly imgHeight = input<string>();

    /** Enable a subtle zoom effect on the image on hover */
    readonly imageZoom = input<boolean>(false, { transform: booleanAttribute });
}
