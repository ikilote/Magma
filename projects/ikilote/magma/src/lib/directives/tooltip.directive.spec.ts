import { Overlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaTooltipDirective } from './tooltip.directive';

import { cleanupOverlayContainer } from '../test-helpers';

@Component({
    template: `<div
        [mgTooltip]="tooltipText"
        [mgTooltipEntryDelay]="entryDelay"
        [mgTooltipDisplayDelay]="displayDelay"
        [mgTooltipDescribedBy]="describedBy"
    >
        Hover me
    </div>`,
    changeDetection: ChangeDetectionStrategy.Eager,
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
        // 1. Destroy fixture first (runs component ngOnDestroy which clears timers and overlay)
        fixture?.destroy();
        // 2. Belt-and-suspenders: clean up static refs and overlay container
        if (MagmaTooltipDirective._overlayRef) {
            MagmaTooltipDirective._overlayRef.dispose();
            MagmaTooltipDirective._overlayRef = undefined;
            MagmaTooltipDirective._component = undefined;
        }
        cleanupOverlayContainer();
        // 3. Clean up timers
        vi.clearAllTimers();
        vi.useRealTimers();
        // 4. Reset TestBed last
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

        afterEach(() => {
            vi.useRealTimers();
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
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        /** Helper: trigger mouseenter and flush the entry delay synchronously */
        function createTooltipAndFlush() {
            component.entryDelay = 0;
            fixture.changeDetectorRef.detectChanges();
            divElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            // entryDelay = 0 → setTimeout(createTooltip, 0)
            vi.advanceTimersByTime(0);
        }

        it('should create tooltip with correct text', () => {
            createTooltipAndFlush();

            const tooltipComponent = MagmaTooltipDirective._component;
            expect(tooltipComponent).toBeTruthy();
            expect(tooltipComponent?.instance.text()).toBe('Test tooltip');
        });

        it('should create tooltip with correct text updated', () => {
            component.tooltipText = 'test change';
            fixture.changeDetectorRef.detectChanges();

            createTooltipAndFlush();

            const tooltipComponent = MagmaTooltipDirective._component;
            expect(tooltipComponent).toBeTruthy();
            expect(tooltipComponent?.instance.text()).toBe('test change');
        });

        it('should set correct describedBy id', () => {
            createTooltipAndFlush();

            const tooltipComponent = MagmaTooltipDirective._component;
            const div = divElement.nativeElement;
            expect(tooltipComponent).toBeTruthy();
            expect(div.getAttribute('aria-describedby')).toBe(tooltipComponent?.instance.describedBy());
        });

        it('should set a describedBy id', () => {
            component.describedBy = 'test';
            fixture.changeDetectorRef.detectChanges();
            createTooltipAndFlush();

            const tooltipComponent = MagmaTooltipDirective._component;
            const div = divElement.nativeElement;
            expect(tooltipComponent).toBeTruthy();
            expect(div.getAttribute('aria-describedby')).toBe(tooltipComponent?.instance.describedBy());
            expect(div.getAttribute('aria-describedby')).toBe(component.describedBy);
        });

        it('should dispose tooltip after display delay', () => {
            component.displayDelay = 100;
            fixture.changeDetectorRef.detectChanges();

            createTooltipAndFlush();

            const overlayRef = MagmaTooltipDirective._overlayRef;
            expect(overlayRef).toBeDefined();
            vi.spyOn(overlayRef!, 'dispose');

            vi.advanceTimersByTime(150);

            expect(overlayRef!.dispose).toHaveBeenCalled();
        });

        it('should not dispose tooltip if displayDelay is 0', () => {
            component.displayDelay = 0;
            fixture.changeDetectorRef.detectChanges();

            createTooltipAndFlush();

            const overlayRef = MagmaTooltipDirective._overlayRef;
            expect(overlayRef).toBeDefined();
            vi.spyOn(overlayRef!, 'dispose');

            vi.advanceTimersByTime(200);

            expect(overlayRef!.dispose).not.toHaveBeenCalled();
        });
    });

    describe('custom delays', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should use custom entry delay', () => {
            component.entryDelay = 500;
            fixture.changeDetectorRef.detectChanges();

            vi.spyOn(directive as any, 'createTooltip');
            divElement.triggerEventHandler('mouseenter', {});
            vi.advanceTimersByTime(500);

            expect(directive['createTooltip']).toHaveBeenCalled();
        });

        it('should use custom display delay', () => {
            component.displayDelay = 100;
            component.entryDelay = 0;
            fixture.changeDetectorRef.detectChanges();

            divElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            vi.advanceTimersByTime(0); // flush entryDelay=0

            const overlayRef = MagmaTooltipDirective._overlayRef;
            expect(overlayRef).toBeDefined();
            vi.spyOn(overlayRef!, 'dispose');

            vi.advanceTimersByTime(150); // past the 100ms displayDelay
            expect(overlayRef!.dispose).toHaveBeenCalled();
        });
    });

    describe('edge cases', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should not create tooltip when destroyed flag is true', () => {
            directive['destroyed'] = true;
            directive['createTooltip']();

            expect(MagmaTooltipDirective._overlayRef).toBeUndefined();
        });

        it('should clear timer on mouseleave when timer exists', () => {
            divElement.triggerEventHandler('mouseenter', {});
            expect(directive['timer']).toBeDefined();

            divElement.triggerEventHandler('mouseleave', {});
            expect(directive['timer']).toBeUndefined();
        });

        it('should handle mouseleave when timer is undefined', () => {
            directive['timer'] = undefined;
            expect(() => {
                divElement.triggerEventHandler('mouseleave', {});
            }).not.toThrow();
        });

        it('should clear timer in createTooltip when timer exists', () => {
            directive['timer'] = setTimeout(() => {}, 1000) as any;
            const timerId = directive['timer'];

            divElement.triggerEventHandler('mouseenter', {});
            vi.advanceTimersByTime(200);

            expect(directive['timer']).not.toBe(timerId);
        });

        it('should dispose tooltip in displayDelay callback when destroyed is false', () => {
            component.displayDelay = 100;
            component.entryDelay = 0;
            fixture.changeDetectorRef.detectChanges();

            divElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            vi.advanceTimersByTime(0); // flush entryDelay=0

            const overlayRef = MagmaTooltipDirective._overlayRef;
            expect(overlayRef).toBeDefined();
            vi.spyOn(overlayRef!, 'dispose');

            // destroyed is false by default
            expect(directive['destroyed']).toBe(false);

            vi.advanceTimersByTime(150); // past 100ms displayDelay

            // Should have called dispose because !destroyed is true
            expect(overlayRef!.dispose).toHaveBeenCalled();
        });

        it('should not dispose tooltip in displayDelay callback when destroyed is true (line 161 else branch)', () => {
            component.displayDelay = 100;
            component.entryDelay = 0;
            fixture.changeDetectorRef.detectChanges();

            divElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            vi.advanceTimersByTime(0); // flush entryDelay=0

            const overlayRef = MagmaTooltipDirective._overlayRef;
            expect(overlayRef).toBeDefined();
            const disposeSpy = vi.spyOn(overlayRef!, 'dispose');

            // Set destroyed to true before the displayDelay timer fires
            directive['destroyed'] = true;

            vi.advanceTimersByTime(150); // past 100ms displayDelay

            // Should NOT have called dispose because destroyed is true
            expect(disposeSpy).not.toHaveBeenCalled();
        });

        it('should not clear timer in createTooltip when timer is undefined (line 138 else branch)', () => {
            // Ensure timer is undefined and destroyed is false
            directive['timer'] = undefined;
            directive['destroyed'] = false;

            // Call createTooltip directly - should not throw
            expect(() => {
                directive['createTooltip']();
            }).not.toThrow();

            // Tooltip should be created even without timer
            expect(MagmaTooltipDirective._overlayRef).toBeDefined();
        });
    });
});
