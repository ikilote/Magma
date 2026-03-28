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

// Create root elements IMMEDIATELY (not in beforeAll)
// Angular creates components with selectors like #root0, #root1, etc.
// We need to pre-create these elements to avoid "selector not found" errors
if (typeof document !== 'undefined') {
    for (let i = 0; i < 1000; i++) {
        if (!document.getElementById(`root${i}`)) {
            const el = document.createElement('div');
            el.id = `root${i}`;
            document.body.appendChild(el);
        }
    }
}

// Global cleanup after each test
afterEach(() => {
    // Always reset timers to prevent hanging tests
    vi.clearAllTimers();
    vi.useRealTimers();
    
    // Wait a tick to allow any pending operations to complete
    return new Promise(resolve => setTimeout(resolve, 0));
});
