import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaDatetimePickerDays, MagmaDatetimeType } from './datetime-picker.component';
import { MagmaDatetimePicker } from './datetime-picker.directive';

@Component({
    template: `
        <span
            [datetimePicker]="datetime"
            [datetimePickerType]="type"
            [datetimePickerDisabled]="disabled"
            [datetimePickerReadonly]="readonly"
            [datetimePickerLang]="lang"
            [datetimePickerMin]="min"
            [datetimePickerMax]="max"
            [datetimePickerFirstDayOfWeek]="firstDayOfWeek"
            (datetimeChange)="onDatetimeChange($event)"
            (datetimeClose)="onDatetimeClose($event)"
            class="test"
        ></span>
    `,
    imports: [MagmaDatetimePicker],
})
class TestComponent {
    datetime = '2015-06-12';
    type: MagmaDatetimeType | undefined = 'date';
    disabled = false;
    readonly = false;
    lang: string | undefined = 'fr';
    min: string | number | Date | undefined;
    max: string | number | Date | undefined;
    firstDayOfWeek: MagmaDatetimePickerDays | undefined;

    onDatetimeChange = (val: string) => {};
    onDatetimeClose = (val: string) => {};
}

describe('MagmaDatetimePicker Directive', () => {
    let fixture: ComponentFixture<TestComponent>;
    let directiveElement: DebugElement;
    let directive: MagmaDatetimePicker;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        directiveElement = fixture.debugElement.query(By.directive(MagmaDatetimePicker));
        directive = directiveElement.injector.get(MagmaDatetimePicker);
    });

    afterEach(() => {
        if (MagmaDatetimePicker._overlayRef) {
            MagmaDatetimePicker._overlayRef.dispose();
            MagmaDatetimePicker._overlayRef = undefined;
            MagmaDatetimePicker._component = undefined;
        }
    });

    it('should create directive', () => {
        expect(directive).toBeTruthy();
    });

    it('should set tabIndex to -1 if disabled', () => {
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();
        expect(directiveElement.nativeElement.tabIndex).toBe(-1);
    });

    it('should set tabIndex to 0 if enabled', () => {
        fixture.componentInstance.disabled = false;
        fixture.detectChanges();
        expect(directiveElement.nativeElement.tabIndex).toBe(0);
    });

    it('should open overlay on click (via ClickEnterDirective)', async () => {
        const spy = vi.spyOn(directive, 'open');
        const span = fixture.debugElement.query(By.css('.test')).nativeElement;

        span.click();
        await vi.runAllTicks();

        expect(spy).toHaveBeenCalled();
        expect(MagmaDatetimePicker._overlayRef).toBeDefined();
    });

    it('should open overlay', async () => {
        fixture.componentInstance.disabled = false;
        fixture.detectChanges();

        await directive.open();
        await vi.runAllTicks();

        expect(MagmaDatetimePicker._overlayRef).toBeDefined();
    });

    it('should not open overlay if disabled', async () => {
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();

        await directive.open();
        await vi.runAllTicks();

        expect(MagmaDatetimePicker._overlayRef).toBeUndefined();
    });

    it('should pass correct inputs to the Picker Component', async () => {
        fixture.componentInstance.lang = 'en';
        fixture.componentInstance.type = 'datetime-local';
        fixture.detectChanges();

        directive.open();
        await vi.runAllTicks();

        const componentInstance = MagmaDatetimePicker._component?.instance;
        expect(componentInstance).toBeDefined();
        expect(componentInstance?.value()).toBe('2015-06-12');
        expect(componentInstance?.lang()).toBe('en');
        expect(componentInstance?.type()).toBe('datetime-local');
        expect(componentInstance?.embedded()).toBe(true);
    });

    it('should close overlay on escape key', async () => {
        directive.open();
        await vi.runAllTicks();
        expect(MagmaDatetimePicker._overlayRef).toBeDefined();

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
        await vi.runAllTicks();

        expect(MagmaDatetimePicker._overlayRef).toBeUndefined();
    });

    it('should emit datetimeChange when component value changes', async () => {
        const spy = vi.spyOn(fixture.componentInstance, 'onDatetimeChange');
        directive.open();
        await vi.runAllTicks();

        const component = MagmaDatetimePicker._component;
        component?.instance.datetimeChange.emit('2024-01-01');
        await vi.runAllTicks();

        expect(spy).toHaveBeenCalledWith('2024-01-01');
    });

    it('should emit datetimeClose only if value has changed on backdrop click', async () => {
        const spy = vi.spyOn(fixture.componentInstance, 'onDatetimeClose');
        directive.open();
        await vi.runAllTicks();

        const component = MagmaDatetimePicker._component;
        component?.instance.datetimeChange.emit('2024-01-01');
        await vi.runAllTicks();

        const backdrop = document.querySelector('.overlay-backdrop') as HTMLElement;
        backdrop.click();
        await vi.runAllTicks();

        expect(spy).toHaveBeenCalledWith('2024-01-01');
        expect(MagmaDatetimePicker._overlayRef).toBeUndefined();
    });

    it('should NOT emit datetimeClose if value is identical on backdrop click', async () => {
        const spy = vi.spyOn(fixture.componentInstance, 'onDatetimeClose');
        directive.open();
        await vi.runAllTicks();

        const backdrop = document.querySelector('.overlay-backdrop') as HTMLElement;
        backdrop.click();
        await vi.runAllTicks();

        expect(spy).not.toHaveBeenCalled();
    });

    it('should open overlay on space key', async () => {
        const spy = vi.spyOn(directive, 'open');
        directiveElement.triggerEventHandler('keydown.space', {});
        await vi.runAllTicks();
        expect(spy).toHaveBeenCalled();
    });

    it('should unsubscribe and dispose on destroy', async () => {
        directive.open();
        await vi.runAllTicks();
        const disposeSpy = vi.spyOn(MagmaDatetimePicker._overlayRef!, 'dispose');

        directive.ngOnDestroy();

        expect(disposeSpy).toHaveBeenCalled();
        expect(MagmaDatetimePicker._overlayRef).toBeUndefined();
    });
});
