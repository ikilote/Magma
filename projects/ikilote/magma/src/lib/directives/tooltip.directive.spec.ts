import { Overlay } from '@angular/cdk/overlay';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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
        vi.useFakeTimers();

        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        divElement = fixture.debugElement.query(By.css('div'));
        directive = divElement.injector.get(MagmaTooltipDirective);
        overlay = TestBed.inject(Overlay);

        fixture.detectChanges();
    });

    afterEach(() => {
        vi.useRealTimers();
        // Clean up overlays after each test
        if (MagmaTooltipDirective._overlayRef) {
            MagmaTooltipDirective._overlayRef.dispose();
            MagmaTooltipDirective._overlayRef = undefined;
            MagmaTooltipDirective._component = undefined;
        }
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    it('should set aria-describedby attribute', () => {
        const div = divElement.nativeElement;
        expect(div.getAttribute('aria-describedby')).toContain('tooltip-');
    });

    describe('mouse events', () => {
        it('should create tooltip on mouseenter after delay', () => {
            vi.spyOn(directive as any, 'createTooltip');
            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 }); // Wait for entry delay

            expect(directive['createTooltip']).toHaveBeenCalled();
        });

        it('should cancel tooltip creation if mouseleave before delay', () => {
            vi.spyOn(directive as any, 'createTooltip');
            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 100 }); // Half of entry delay
            divElement.triggerEventHandler('mouseleave', {});
            vi.useFakeTimers({ advanceTimeDelta: 100 }); // Wait for remaining delay

            expect(directive['createTooltip']).not.toHaveBeenCalled();
        });

        it('should destroy tooltip on mouseleave', () => {
            vi.spyOn(directive, 'ngOnDestroy');
            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 }); // Wait for tooltip creation
            divElement.triggerEventHandler('mouseleave', {});

            expect(directive.ngOnDestroy).toHaveBeenCalled();
        });
    });

    describe('tooltip creation', () => {
        it('should create tooltip with correct text', () => {
            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 }); // Wait for entry delay

            const tooltipComponent = MagmaTooltipDirective._component;
            expect(tooltipComponent).toBeTruthy();
            expect(tooltipComponent?.instance.text()).toBe('Test tooltip');
        });

        it('should create tooltip with correct text updated', () => {
            component.tooltipText = 'test change';
            fixture.detectChanges();

            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 }); // Wait for entry delay

            const tooltipComponent = MagmaTooltipDirective._component;
            expect(tooltipComponent).toBeTruthy();
            expect(tooltipComponent?.instance.text()).toBe('test change');
        });

        it('should set correct describedBy id', () => {
            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 });

            const tooltipComponent = MagmaTooltipDirective._component;
            const div = divElement.nativeElement;
            expect(div.getAttribute('aria-describedby')).toBe(tooltipComponent?.instance.describedBy());
        });

        it('should set a describedBy id', () => {
            component.describedBy = 'test';
            fixture.detectChanges();
            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 });

            const tooltipComponent = MagmaTooltipDirective._component;
            const div = divElement.nativeElement;
            expect(div.getAttribute('aria-describedby')).toBe(tooltipComponent?.instance.describedBy());
            expect(div.getAttribute('aria-describedby')).toBe(component.describedBy);
        });

        it('should dispose tooltip after display delay', () => {
            component.displayDelay = 500;
            fixture.detectChanges();

            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 }); // Wait for creation

            const overlayRef = MagmaTooltipDirective._overlayRef;
            vi.spyOn(overlayRef!, 'dispose');

            vi.useFakeTimers({ advanceTimeDelta: 500 }); // Wait for display delay

            expect(overlayRef!.dispose).toHaveBeenCalled();
        });

        it('should not dispose tooltip if displayDelay is 0', () => {
            component.displayDelay = 0;
            fixture.detectChanges();

            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 });

            const overlayRef = MagmaTooltipDirective._overlayRef;
            vi.spyOn(overlayRef!, 'dispose');

            vi.useFakeTimers({ advanceTimeDelta: 1000 }); // Wait longer than default delay

            expect(overlayRef!.dispose).not.toHaveBeenCalled();
        });
    });

    describe('custom delays', () => {
        it('should use custom entry delay', () => {
            component.entryDelay = 500;
            fixture.detectChanges();

            vi.spyOn(directive as any, 'createTooltip');
            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 500 });

            expect(directive['createTooltip']).toHaveBeenCalled();
        });

        it('should use custom display delay', () => {
            component.displayDelay = 2000;
            fixture.detectChanges();

            divElement.triggerEventHandler('mouseenter', {});
            vi.useFakeTimers({ advanceTimeDelta: 200 });

            const overlayRef = MagmaTooltipDirective._overlayRef;
            vi.spyOn(overlayRef!, 'dispose');

            vi.useFakeTimers({ advanceTimeDelta: 2000 });
            expect(overlayRef!.dispose).toHaveBeenCalled();
        });
    });
});
