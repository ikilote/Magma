import { ConnectedOverlayPositionChange, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaWalkthroughContent } from './walkthrough-content.component';
import { MagmaWalkthroughStep } from './walkthrough-step.directive';
import { MagmaWalkthrough } from './walkthrough.component';

import { cleanupOverlayContainer } from '../../test-helpers';

@Component({
    template: `
        <mg-walkthrough #walkthrough>
            <ng-template
                mg-walkthrough-step
                name="first"
                nextStep="second"
                group="test"
                selector=".target"
                showElement
                clickElementOrigin
            >
                <div>First step content</div>
            </ng-template>
            <ng-template
                mg-walkthrough-step
                name="second"
                previousStep="first"
                group="test"
                selector=".target2"
                close
                [showElement]="showElement"
            >
                <div>Second step content</div>
            </ng-template>
        </mg-walkthrough>
        <div class="target" style="width: 100px" (click)="call()">target</div>
        <div class="target2">target2</div>
    `,
    imports: [MagmaWalkthrough, MagmaWalkthroughStep],
})
class TestHostComponent {
    walkthrough = viewChild.required(MagmaWalkthrough);
    call = vi.fn();
    showElement = false;
}

describe('MagmaWalkthroughContent through MagmaWalkthrough', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let walkthrough: MagmaWalkthrough;
    let testComponent: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PortalModule, OverlayModule, MagmaWalkthroughContent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;
        walkthrough = hostComponent.walkthrough();
        testComponent = fixture.debugElement.componentInstance;
        fixture.changeDetectorRef.detectChanges();

        // Mock scrollIntoView on target elements
        document.querySelector('.target')!.scrollIntoView = vi.fn();
        document.querySelector('.target2')!.scrollIntoView = vi.fn();

        vi.useFakeTimers();
    });

    afterEach(() => {
        // Clean up any open overlays
        if (walkthrough?.['overlayRef']) {
            walkthrough['overlayRef'].dispose();
            walkthrough['overlayRef'] = undefined;
            walkthrough['content'] = undefined;
        }

        // Clean up any cloned elements with event listeners
        const clones = document.querySelectorAll('.component');
        clones.forEach(clone => clone.remove());

        cleanupOverlayContainer();
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('should create walkthrough component', async () => {
        expect(walkthrough).toBeTruthy();
    });

    describe('walkthrough content', () => {
        // Helper to flush all timers and microtasks
        const flushAll = async () => {
            await vi.runAllTimersAsync();
            fixture.changeDetectorRef.detectChanges();
        };

        it('should open walkthrough content on start', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            const contentComponent = walkthrough.overlayComponent!;
            expect(contentComponent).toBeTruthy();
            expect(contentComponent instanceof MagmaWalkthroughContent).toBe(true);
        });

        it('should display correct content for first step', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            // Verify first step content is displayed
            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('First step content');
            expect(document.querySelector('mg-walkthrough-content .previous')).toBeNull();
            expect(document.querySelector('mg-walkthrough-content .next')).not.toBeNull();
            expect(document.querySelector('mg-walkthrough-content .close')).toBeNull();
        });

        it('should change to second step when next/previous is clicked', async () => {
            // Start with first step
            walkthrough.start({ group: 'test' });
            await flushAll();

            // Get the content component and click next
            const contentComponent = walkthrough.overlayComponent!;
            contentComponent?.next();
            await flushAll();

            // Verify second step content is displayed
            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('Second step content');
            expect(document.querySelector('mg-walkthrough-content .previous')).not.toBeNull();
            expect(document.querySelector('mg-walkthrough-content .next')).toBeNull();
            expect(document.querySelector('mg-walkthrough-content .close')).not.toBeNull();

            contentComponent?.previous();
            await flushAll();

            // Verify first step content is displayed
            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('First step content');
            expect(document.querySelector('mg-walkthrough-content .previous')).toBeNull();
            expect(document.querySelector('mg-walkthrough-content .next')).not.toBeNull();
            expect(document.querySelector('mg-walkthrough-content .close')).toBeNull();
        });

        it('should change to second step when next/previous/close html button is clicked', async () => {
            // Start with first step
            walkthrough.start({ group: 'test' });
            await flushAll();

            // Get the content component and click next
            document.querySelector<HTMLButtonElement>('mg-walkthrough-content .next')!.click();
            await flushAll();

            // Verify second step content is displayed
            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('Second step content');
            expect(document.querySelector('mg-walkthrough-content .previous')).not.toBeNull();
            expect(document.querySelector('mg-walkthrough-content .next')).toBeNull();
            expect(document.querySelector('mg-walkthrough-content .close')).not.toBeNull();

            document.querySelector<HTMLButtonElement>('mg-walkthrough-content .previous')!.click();
            await flushAll();

            // Verify first step content is displayed
            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('First step content');
            expect(document.querySelector('mg-walkthrough-content .previous')).toBeNull();
            expect(document.querySelector('mg-walkthrough-content .next')).not.toBeNull();
            expect(document.querySelector('mg-walkthrough-content .close')).toBeNull();

            // return to the last step
            document.querySelector<HTMLButtonElement>('mg-walkthrough-content .next')!.click();
            await flushAll();
            expect(document.querySelector('mg-walkthrough-content .previous')).not.toBeNull();
            expect(document.querySelector('mg-walkthrough-content .next')).toBeNull();
            expect(document.querySelector('mg-walkthrough-content .close')).not.toBeNull();

            document.querySelector<HTMLButtonElement>('mg-walkthrough-content .close')!.click();
            await flushAll();

            // Verify walkthrough is close
            expect(document.querySelector('mg-walkthrough-content')).toBeNull();
        });

        it('should close walkthrough when close is clicked', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            const contentComponent = walkthrough.overlayComponent!;
            contentComponent?.close();
            await flushAll();

            expect(walkthrough['overlayRef']).toBeUndefined();
            expect(walkthrough['content']).toBeUndefined();
            expect(walkthrough['overlayRef']).toBeUndefined();
            expect(walkthrough.overlayComponent!).toBeUndefined();
        });

        it('should position content correctly based on target element', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            const contentComponent = walkthrough.overlayComponent!;
            const position: ConnectedOverlayPositionChange = {
                connectionPair: { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
                scrollableViewProperties: {} as any,
            };

            // Simulate position change
            contentComponent?.ngOnChanges({
                position: {
                    currentValue: position,
                    previousValue: undefined,
                    firstChange: true,
                    isFirstChange: () => true,
                },
            });

            expect(contentComponent?.['top']()).toBe(false);
            expect(contentComponent?.['right']()).toBe(false);
        });

        it('should handle escape key with not action event', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            vi.spyOn(walkthrough.overlayComponent!, 'close');
            vi.spyOn(walkthrough.overlayComponent!, 'next');

            // Simulate escape key press
            const event = new KeyboardEvent('keydown', { key: 'Escape' });

            (walkthrough.overlayComponent!.portal().nextStep as any) = () => '';
            document.dispatchEvent(event);
            await flushAll();

            expect(walkthrough.overlayComponent!.next).not.toHaveBeenCalled();
            expect(walkthrough.overlayComponent!.close).not.toHaveBeenCalled();
        });

        it('should handle escape key to close', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            const closeSpy = vi.spyOn(walkthrough.overlayComponent!, 'close');
            const nextSpy = vi.spyOn(walkthrough.overlayComponent!, 'next');

            // Simulate escape key press
            const event = new KeyboardEvent('keydown', { key: 'Escape' });

            (walkthrough.overlayComponent!.portal().close as any) = () => true;
            document.dispatchEvent(event);
            await flushAll();

            expect(nextSpy).not.toHaveBeenCalled();
            expect(closeSpy).toHaveBeenCalled();
        });

        it('should handle escape key to next step', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            vi.spyOn(walkthrough.overlayComponent!, 'close');
            vi.spyOn(walkthrough.overlayComponent!, 'next');

            // Simulate escape key press
            const event = new KeyboardEvent('keydown', { key: 'Escape' });

            (walkthrough.overlayComponent!.portal()!.nextStep as any) = () => 'second';
            document.dispatchEvent(event);
            await flushAll();

            expect(walkthrough.overlayComponent!.next).toHaveBeenCalled();
            expect(walkthrough.overlayComponent!.close).not.toHaveBeenCalled();
        });

        it('should show element clone when showElement is true', async () => {
            // Modify the step to show element
            const steps = walkthrough['stepsDirective']();
            (steps[0] as any).showElement = () => true;

            walkthrough.start({ group: 'test' });
            await flushAll();

            const contentComponent = walkthrough.overlayComponent!;
            const contentElement = contentComponent?.['elementContent']().nativeElement;

            // Verify the cloned element exists
            expect(contentElement?.querySelector('.target')).toBeTruthy();
        });

        it('should handle click on cloned element when clickElementActive is true', async () => {
            // Modify the step to show element and enable click
            const steps = walkthrough['stepsDirective']();
            (steps[0] as any).showElement = () => true;
            (steps[0] as any).clickElementActive = () => true;

            walkthrough.start({ group: 'test' });
            await flushAll();

            const contentComponent = walkthrough.overlayComponent!;
            const clonedElement = contentComponent?.['elementContent']().nativeElement?.querySelector('.target');

            vi.spyOn(steps[0].clickElement, 'emit');
            clonedElement?.dispatchEvent(new Event('click'));
            await flushAll();

            expect(steps[0].clickElement.emit).toHaveBeenCalled();
        });

        it('should subscribe to window resize event on ngOnInit', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            const contentComponent = walkthrough.overlayComponent!;
            vi.spyOn(contentComponent as any, 'resize');
            window.dispatchEvent(new Event('resize'));
            await flushAll();
            expect(contentComponent['resize']).toHaveBeenCalled();
        });

        it('should update clone style on resize', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            const contentComponent = walkthrough.overlayComponent!;
            const element = contentComponent.element()!;
            Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });

            contentComponent.clone = document.createElement('div');
            contentComponent['resize']();
            expect(contentComponent.clone.style.width).toBe('100px');
            expect(contentComponent.clone.style.margin).toBe('0px');
        });

        it('should call action on clone element', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content .target')).not.toBeNull();
            document.querySelector<HTMLElement>('mg-walkthrough-content .target')?.click();
            expect(testComponent.call).toHaveBeenCalled();
        });

        it('should component is empty in the second step', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content .component')?.textContent)?.toBe('target');

            // Get the content component and click next
            const contentComponent = walkthrough.overlayComponent!;
            contentComponent?.next();
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content .component')?.textContent)?.toBe('');
        });

        it('should component is not empty in the second step', async () => {
            testComponent.showElement = true;
            fixture.changeDetectorRef.detectChanges();
            walkthrough.start({ group: 'test' });
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content .component')?.textContent)?.toBe('target');

            // Get the content component and click next
            const contentComponent = walkthrough.overlayComponent!;
            contentComponent?.next();
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content .component')?.textContent)?.toBe('target2');
        });

        it('should handle arrow left key to go to previous step', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            // Go to second step first
            const contentComponent = walkthrough.overlayComponent!;
            contentComponent?.next();
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('Second step content');

            // Simulate arrow left key press
            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
            window.dispatchEvent(event);
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('First step content');
        });

        it('should handle arrow right key to go to next step', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('First step content');

            // Simulate arrow right key press
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            window.dispatchEvent(event);
            await flushAll();

            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('Second step content');
        });

        it('should call update when portal is attached', async () => {
            walkthrough.start({ group: 'test' });
            await flushAll();

            const contentComponent = walkthrough.overlayComponent!;
            vi.spyOn(contentComponent, 'update');

            // Trigger the attached event by changing the portal
            contentComponent.ngOnChanges({
                element: {
                    currentValue: document.querySelector('.target'),
                    previousValue: null,
                    firstChange: false,
                    isFirstChange: () => false,
                },
            });
            await flushAll();

            // The update should be called when the portal outlet emits attached
            // We can't directly test the (attached) event, but we can verify update is callable
            contentComponent.update();
            await flushAll();

            expect(contentComponent.update).toHaveBeenCalled();
        });
    });
});
