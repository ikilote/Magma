import { Component, inject } from '@angular/core';

import { MagmaMessage, getCookie, removeCookie, setCookie } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-cookies',
    templateUrl: './demo-cookies.component.html',
    styleUrls: ['./demo-cookies.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoCookiesComponent {
    readonly mgMessage = inject(MagmaMessage);

    codeTs = `@Component({ ... })
export class TestComponent {
    readonly mgMessage = inject(MagmaMessage);

    addCookie(value: string) {
      setCookie('text', value, 1, '/');
      this.mgMessage.addMessage('setCookie');
    }

    readCookie() {
        this.mgMessage.addMessage('getCookie: ' + getCookie('text'));
    }

    removeCookie() {
        removeCookie('text');
        this.mgMessage.addMessage('removeCookie');
    }
}`;

    addCookie(value: string) {
        setCookie('text', value, 1, '/');
        this.mgMessage.addMessage('setCookie');
    }

    readCookie() {
        this.mgMessage.addMessage('getCookie: ' + getCookie('text'));
    }

    removeCookie() {
        removeCookie('text');
        this.mgMessage.addMessage('removeCookie');
    }
}
