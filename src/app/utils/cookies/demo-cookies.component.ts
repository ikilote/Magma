import { Component, inject } from '@angular/core';

import { MagmaMessages, getCookie, removeCookie, setCookie } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-cookies',
    templateUrl: './demo-cookies.component.html',
    styleUrls: ['./demo-cookies.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoCookiesComponent {
    readonly mgMessages = inject(MagmaMessages);

    codeTs = `@Component({ ... })
export class TestComponent {
    readonly mgMessages = inject(MagmaMessages);

    addCookie(value: string) {
      setCookie('text', value, 1, '/');
      this.mgMessages.addMessage('setCookie');
    }

    readCookie() {
        this.mgMessages.addMessage('getCookie: ' + getCookie('text'));
    }

    removeCookie() {
        removeCookie('text');
        this.mgMessages.addMessage('removeCookie');
    }
}`;

    addCookie(value: string) {
        setCookie('text', value, 1, '/');
        this.mgMessages.addMessage('setCookie');
    }

    readCookie() {
        this.mgMessages.addMessage('getCookie: ' + getCookie('text'));
    }

    removeCookie() {
        removeCookie('text');
        this.mgMessages.addMessage('removeCookie');
    }
}
