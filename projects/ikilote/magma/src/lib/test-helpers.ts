// Test helpers for cleaning up CDK state
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

/**
 * Clean up CDK OverlayContainer singleton between tests
 * Call this in afterEach() for tests that use overlays
 */
export function cleanupOverlayContainer(): void {
    try {
        const overlayContainer = TestBed.inject(OverlayContainer);
        if (overlayContainer) {
            // Get the container element
            const containerElement = overlayContainer.getContainerElement();
            
            // Clear all children but keep the container
            while (containerElement.firstChild) {
                containerElement.removeChild(containerElement.firstChild);
            }
        }
    } catch (e) {
        // OverlayContainer might not be injected, that's ok
        // Silently ignore the error
    }
    
    // Also clean up any stray overlay elements in the DOM
    const backdrops = document.querySelectorAll('.cdk-overlay-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    const panes = document.querySelectorAll('.cdk-overlay-pane');
    panes.forEach(pane => pane.remove());
}
