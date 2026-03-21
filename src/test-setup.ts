// vitest.setup.ts
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

import 'zone.js';
import 'zone.js/testing';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {});

if (typeof Element !== 'undefined' && !Element.prototype.checkVisibility) {
    Element.prototype.checkVisibility = function (_options?: { checkOpacity?: boolean; checkVisibilityCSS?: boolean }) {
        // @ts-ignore
        return !!(this.offsetWidth || this.offsetHeight || this.getClientRects().length);
    };
}
