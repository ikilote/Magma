import { Overlay } from '@angular/cdk/overlay';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { cleanupOverlayContainer } from '../test-helpers';
import { MagmaTooltipDirective } from './tooltip.directive';

@Component({
    template: `<div
        [mgTooltip]="tooltipText"
        [mgTooltipEntryDelay]="entryDelay"
        [mgTooltipDisplayDelay]="displayDelay"
        [mgTooltipDescribedBy]="describedBy"
    >
        Hover me
    </div>`,
    imports: [MagmaTooltipDirective],
})
class TestHostComponent {
    tooltipText = 'Test tooltip';
    entryDelay = 200;
    displayDelay = 1000;
    describedBy = '';
}

describe('MagmaTooltipDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let divElement: DebugElement;
    let directive: MagmaTooltipDirective;
    let overlay: Overlay;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        divElement = fixture.debugElement.query(By.css('div'));
        directive = divElement.injector.get(MagmaTooltipDirective);
        overlay = TestBed.inject(Overlay);

        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        // Clean up overlays after each test
        if (MagmaTooltipDirective._overlayRef) {
            MagmaTooltipDirective._overlayRef.dispose();
            MagmaTooltipDirective._overlayRef = undefined;
            MagmaTooltipDirective._component = undefined;
        }
        cleanupOverlayContainer();
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    it('should set aria-describedby attribute', () => {
        const div = divElement.nativeElement;
        expect(div.getAttribute('aria-describedby')).toContain('tooltip-');
    });

    describe('mouse events', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        it('should create tooltip on mouseenter after delay', () => {
            vi.spyOn(directive as any, 'createTooltip');
            divElement.triggerEventHandler('mouseenter', {});
            vi.advanceTimersByTime(200); // Wait for entry delay

            expect(directive['createTooltip']).toHaveBeenCalled();
        });

        it('should cancel tooltip creation if mouseleave before delay', () => {
            vi.spyOn(directive as any, 'createTooltip');
            divElement.triggerEventHandler('mouseenter', {});
            vi.advanceTimersByTime(100); // Half of entry delay
            divElement.triggerEventHandler('mouseleave', {});
            vi.advanceTimersByTime(100); // Wait for remaining delay

            expect(directive['createTooltip']).not.toHaveBeenCalled();
        });

        it('should destroy tooltip on mouseleave', () => {
            vi.spyOn(directive, 'ngOnDestroy');
            divElement.triggerEventHandler('mouseenter', {});
            vi.advanceTimersByTime(200); // Wait for tooltip creation
            divElement.triggerEventHandler('mouseleave', {});

            expect(directive.ngOnDestroy).toHaveBeenCalled();
        });
    });

    describe('tooltip creation', () => {
        /** Helper: trigger mouseenter and wait for the entry delay to elapse */
        async function createTooltipAndWait() {
            component.entryDelay = 0;
            fixture.changeDetectorRef.detectChanges();
            divElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            await new Promise(r => setTimeout(r, 50));
            await fixture.whenStable();
        }

        it('should create tooltip with correct text', async () => {
            await createTooltipAndWait();

            const tooltipComponent = MagmaTooltipDirective._component;
            expect(tooltipComponent).toBeTruthy();
            expect(tooltipComponent?.instance.text()).toBe('Test tooltip');
        });

        it('should create tooltip with correct text updated', async () => {
            component.tooltipText = 'test change';
            fixture.changeDetectorRef.detectChanges();

            await createTooltipAndWait();

            const tooltipComponent = MagmaTooltipDirective._component;
            expect(tooltipComponent).toBeTruthy();
            expect(tooltipComponent?.instance.text()).toBe('test change');
        });

        it('should set correct describedBy id', async () => {
            await createTooltipAndWait();

            const tooltipComponent = MagmaTooltipDirective._component;
            const div = divElement.nativeElement;
            expect(div.getAttribute('aria-describedby')).toBe(tooltipComponent?.instance.describedBy());
        });

        it('should set a describedBy id', async () => {
            component.describedBy = 'test';
            fixture.changeDetectorRef.detectChanges();
            await createTooltipAndWait();

            const tooltipComponent = MagmaTooltipDirective._component;
            const div = divElement.nativeElement;
            expect(div.getAttribute('aria-describedby')).toBe(tooltipComponent?.instance.describedBy());
            expect(div.getAttribute('aria-describedby')).toBe(component.describedBy);
        });

        it('should dispose tooltip after display delay', async () => {
            component.displayDelay = 100;
            fixture.changeDetectorRef.detectChanges();

            await createTooltipAndWait();

            const overlayRef = MagmaTooltipDirective._overlayRef;
            vi.spyOn(overlayRef!, 'dispose');

            await new Promise(r => setTimeout(r, 150));

            expect(overlayRef!.dispose).toHaveBeenCalled();
        });

        it('should not dispose tooltip if displayDelay is 0', async () => {
            component.displayDelay = 0;
            fixture.changeDetectorRef.detectChanges();

            await createTooltipAndWait();

            const overlayRef = MagmaTooltipDirective._overlayRef;
            vi.spyOn(overlayRef!, 'dispose');

            await new Promise(r => setTimeout(r, 200));

            expect(overlayRef!.dispose).not.toHaveBeenCalled();
        });
    });

    describe('custom delays', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        it('should use custom entry delay', () => {
            component.entryDelay = 500;
            fixture.changeDetectorRef.detectChanges();

            vi.spyOn(directive as any, 'createTooltip');
            divElement.triggerEventHandler('mouseenter', {});
            vi.advanceTimersByTime(500);

            expect(directive['createTooltip']).toHaveBeenCalled();
        });

        it('should use custom display delay', async () => {
            component.displayDelay = 100;
            fixture.changeDetectorRef.detectChanges();

            vi.useRealTimers();

            component.entryDelay = 0;
            fixture.changeDetectorRef.detectChanges();
            divElement.triggerEventHandler('mouseenter', {});
            await new Promise(r => setTimeout(r, 50));
            await fixture.whenStable();

            const overlayRef = MagmaTooltipDirective._overlayRef;
            vi.spyOn(overlayRef!, 'dispose');

            await new Promise(r => setTimeout(r, 150));
            expect(overlayRef!.dispose).toHaveBeenCalled();
        });

        it('should not create tooltip if directive is destroyed', () => {
            directive['destroyed'] = true;

            divElement.triggerEventHandler('mouseenter', {});
            vi.advanceTimersByTime(500);

            expect(MagmaTooltipDirective._overlayRef).toBeUndefined();
        });
    });
});
