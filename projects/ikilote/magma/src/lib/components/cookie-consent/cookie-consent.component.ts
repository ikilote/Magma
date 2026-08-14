import { Component, inject, viewChild } from '@angular/core';

import { CookieConsent } from '../../services/cookie-consent';
import { MagmaDialog } from '../dialog/dialog.component';
import { MagmaInputCheckbox } from '../input/input-checkbox.component';
import { MagmaInputElement } from '../input/input-element.component';
import { MagmaInput } from '../input/input.component';

/**
 * Cookie consent banner and preferences dialog.
 *
 * This component is injected dynamically by the `CookieConsent` service via CDK Overlay.
 * There is no need to place it manually in a template.
 */
@Component({
    selector: 'mg-cookie-consent',
    templateUrl: './cookie-consent.component.html',
    styleUrl: './cookie-consent.component.scss',
    imports: [MagmaDialog, MagmaInput, MagmaInputCheckbox, MagmaInputElement],
})
export class MagmaCookieConsent {
    protected readonly cookieConsent = inject(CookieConsent);

    readonly dialog = viewChild<MagmaDialog>('dialog');

    acceptAll(mode: boolean) {
        this.cookieConsent.setAll(mode);
    }

    manage() {
        this.cookieConsent.hideBanner();
        this.dialog()?.open();
    }

    save() {
        this.cookieConsent.save();
        this.dialog()?.close();
    }

    toggleOption(index: number) {
        this.cookieConsent.options.update(opts =>
            opts.map((o, i) => (i === index && !o.locked ? { ...o, accept: !o.accept } : o)),
        );
    }
}
