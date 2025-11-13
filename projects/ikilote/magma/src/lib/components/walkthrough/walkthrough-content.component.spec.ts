import { ConnectedOverlayPositionChange, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { Component, DebugElement, viewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MagmaWalkthroughContent } from './walkthrough-content.component';
import { MagmaWalkthroughStep } from './walkthrough-step.directive';
import { MagmaWalkthrough } from './walkthrough.component';

@Component({
    template: `
        <mg-walkthrough #walkthrough>
            <ng-template mg-walkthrough-step name="first" group="test" selector=".target">
                <div>First step content</div>
            </ng-template>
            <ng-template mg-walkthrough-step name="second" group="test" selector=".target2">
                <div>Second step content</div>
            </ng-template>
        </mg-walkthrough>
        <div class="target"></div>
        <div class="target2"></div>
    `,
    imports: [MagmaWalkthrough, MagmaWalkthroughStep],
})
class TestHostComponent {
    walkthrough = viewChild.required(MagmaWalkthrough);
}

describe('MagmaWalkthroughContent through MagmaWalkthrough', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let walkthrough: MagmaWalkthrough;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PortalModule, OverlayModule, MagmaWalkthroughContent, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;
        walkthrough = hostComponent.walkthrough();
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        // Clean up any open overlays
        if (walkthrough?.['overlayRef']) {
            walkthrough['overlayRef'].dispose();
        }
    });

    it('should create walkthrough component', () => {
        expect(walkthrough).toBeTruthy();
    });

    describe('walkthrough content', () => {
        it('should open walkthrough content on start', fakeAsync(() => {
            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            const contentComponent = walkthrough['overlayComponent'];
            expect(contentComponent).toBeTruthy();
            expect(contentComponent instanceof MagmaWalkthroughContent).toBeTrue();
        }));

        it('should display correct content for first step', fakeAsync(() => {
            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('First step content');
        }));

        // it('should change to second step when next is clicked', fakeAsync(() => {
        //     // Start with first step
        //     walkthrough.start({ group: 'test' });
        //     tick();
        //     fixture.detectChanges();

        //     // Get the content component and click next
        //     const contentComponent = walkthrough['overlayComponent'];
        //     contentComponent?.next();
        //     tick(20);
        //     fixture.detectChanges();
        //     tick();

        //     // Verify second step content is displayed
        //     expect(document.querySelector('mg-walkthrough-content')?.textContent).toContain('Second step content');
        // }));

        it('should close walkthrough when close is clicked', fakeAsync(() => {
            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            const contentComponent = walkthrough['overlayComponent'];

            contentComponent?.close();
            tick(10);
            fixture.detectChanges();

            expect(walkthrough['overlayRef']).toBeUndefined();
            expect(walkthrough['content']).toBeUndefined();
            expect(walkthrough['overlayRef']).toBeUndefined();
            expect(walkthrough['overlayComponent']).toBeUndefined();
        }));

        it('should position content correctly based on target element', fakeAsync(() => {
            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            const contentComponent = walkthrough['overlayComponent'];
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

            expect(contentComponent?.['top']()).toBeFalse();
            expect(contentComponent?.['right']()).toBeFalse();
        }));

        it('should handle escape key with not action event', fakeAsync(() => {
            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            spyOn(walkthrough.overlayComponent!, 'close');
            spyOn(walkthrough.overlayComponent!, 'next');

            // Simulate escape key press
            const event = new KeyboardEvent('keydown', { key: 'Escape' });

            document.dispatchEvent(event);
            tick(10);

            expect(walkthrough.overlayComponent!.next).not.toHaveBeenCalled();
            expect(walkthrough.overlayComponent!.close).not.toHaveBeenCalled();
        }));

        it('should handle escape key to close', fakeAsync(() => {
            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            spyOn(walkthrough.overlayComponent!, 'close');
            spyOn(walkthrough.overlayComponent!, 'next');

            // Simulate escape key press
            const event = new KeyboardEvent('keydown', { key: 'Escape' });

            (walkthrough.overlayComponent!.portal().close as any) = () => true;
            document.dispatchEvent(event);
            tick();

            expect(walkthrough.overlayComponent!.next).not.toHaveBeenCalled();
            expect(walkthrough.overlayComponent!.close).toHaveBeenCalled();
        }));

        it('should handle escape key to next step', fakeAsync(() => {
            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            spyOn(walkthrough.overlayComponent!, 'close');
            spyOn(walkthrough.overlayComponent!, 'next');

            // Simulate escape key press
            const event = new KeyboardEvent('keydown', { key: 'Escape' });

            (walkthrough.overlayComponent!.portal()!.nextStep as any) = () => 'second';
            document.dispatchEvent(event);
            tick();

            expect(walkthrough.overlayComponent!.next).toHaveBeenCalled();
            expect(walkthrough.overlayComponent!.close).not.toHaveBeenCalled();
        }));

        it('should show element clone when showElement is true', fakeAsync(() => {
            // Modify the step to show element
            const steps = walkthrough['stepsDirective']();
            (steps[0] as any).showElement = () => true;

            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            const contentComponent = walkthrough['overlayComponent'];
            const contentElement = contentComponent?.['elementContent']().nativeElement;

            // Verify the cloned element exists
            expect(contentElement?.querySelector('.target')).toBeTruthy();
        }));

        it('should handle click on cloned element when clickElementActive is true', fakeAsync(() => {
            // Modify the step to show element and enable click
            const steps = walkthrough['stepsDirective']();
            (steps[0] as any).showElement = () => true;
            (steps[0] as any).clickElementActive = () => true;

            walkthrough.start({ group: 'test' });
            tick();
            fixture.detectChanges();

            const contentComponent = walkthrough['overlayComponent'];
            const clonedElement = contentComponent?.['elementContent']().nativeElement?.querySelector('.target');

            spyOn(steps[0].clickElement, 'emit');
            clonedElement?.dispatchEvent(new Event('click'));
            tick();

            expect(steps[0].clickElement.emit).toHaveBeenCalled();
        }));
    });
});
