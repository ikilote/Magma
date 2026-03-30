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
afterEach(async () => {
    // Restore all mocks and spies (important for global objects)
    vi.restoreAllMocks();
    
    // Always reset timers to prevent hanging tests
    vi.clearAllTimers();
    vi.useRealTimers();
    
    // Reset system time if it was mocked
    vi.setSystemTime(Date.now());
    
    // Clean up DOM to prevent contamination between tests
    if (typeof document !== 'undefined') {
        // Reset focus to body
        if (document.activeElement && document.activeElement !== document.body) {
            (document.activeElement as HTMLElement).blur();
        }
        document.body.focus();
        
        // Clean up ALL overlays and backdrop elements
        const overlays = document.querySelectorAll('.cdk-overlay-container, .cdk-overlay-backdrop, .cdk-overlay-pane');
        overlays.forEach(el => el.remove());
        
        // Clean up content inside root elements
        for (let i = 0; i < 1000; i++) {
            const root = document.getElementById(`root${i}`);
            if (root) {
                root.innerHTML = '';
            }
        }
        
        // Clean up any remaining elements that might have been added to body
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach(child => {
            const id = (child as HTMLElement).id;
            // Keep only root elements and script/style tags
            if (!id?.startsWith('root') && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                child.remove();
            }
        });
    }
    
    // NOTE: We do NOT call TestBed.resetTestingModule() here because it causes
    // "Cannot configure the test module when the test module has already been instantiated"
    // errors when tests run in parallel. Each test file should handle its own TestBed
    // configuration in beforeEach/afterEach if needed.
});
