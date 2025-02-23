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

    codeHtml = `<p>
  <input #value />
</p>

<button (click)="addCookie(value.value)">addCookie()</button>
<button (click)="readCookie()">readCookie()</button>
<button (click)="removeCookie()">removeCookie()</button>`;

    codeTs = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [],
})
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
