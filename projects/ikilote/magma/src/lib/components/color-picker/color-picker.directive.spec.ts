import { Overlay } from '@angular/cdk/overlay';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaColorPicker } from './color-picker.directive';

@Component({
    template: `<span
        [colorPicker]="color"
        [colorPickerAlpha]="alpha"
        [colorPickerDisabled]="disabled"
        class="test"
    ></span>`,
    imports: [MagmaColorPicker],
})
class TestComponent {
    color = '#ff0000';
    alpha = false;
    disabled = false;
}

describe('MagmaColorPicker Directive', () => {
    let fixture: ComponentFixture<TestComponent>;
    let overlay: Overlay;
    let directiveElement: DebugElement;
    let directive: MagmaColorPicker;
    let spanElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        directiveElement = fixture.debugElement.query(By.directive(MagmaColorPicker));
        overlay = TestBed.inject(Overlay);
        fixture.changeDetectorRef.detectChanges();
        spanElement = fixture.debugElement.query(By.css('.test'));

        directive = directiveElement.injector.get(MagmaColorPicker);
    });

    it('should create directive', () => {
        expect(directiveElement).toBeTruthy();
    });

    it('should set tabIndex to -1 if disabled', () => {
        fixture.componentInstance.disabled = true;
        fixture.changeDetectorRef.detectChanges();
        expect(directiveElement.nativeElement.tabIndex).toBe(-1);
    });

    it('should open overlay on click', async () => {
        const event = new MouseEvent('click');
        const eventSpy = vi.spyOn(event, 'preventDefault');
        await fixture.whenStable();
        document.querySelector('.test')?.dispatchEvent(event);
        expect(eventSpy).toHaveBeenCalled(); // in open
    });

    it('should not open overlay if disabled', async () => {
        fixture.componentInstance.disabled = true;
        fixture.changeDetectorRef.detectChanges();
        const event = new MouseEvent('click');
        const eventSpy = vi.spyOn(event, 'preventDefault');
        await fixture.whenStable();
        document.querySelector('.test')?.dispatchEvent(event);
        expect(eventSpy).not.toHaveBeenCalled(); // in open
    });

    it('should create overlay with correct inputs', async () => {
        directive.open();
        await fixture.whenStable();
        const overlayRef = MagmaColorPicker._overlayRef;
        const component = MagmaColorPicker._component;
        expect(overlayRef).toBeDefined();
        expect(component).toBeDefined();
        expect(component?.instance.color()).toBe('#ff0000');
        expect(component?.instance.alpha()).toBe(false);
    });

    it('should close overlay on escape', async () => {
        directive.open();
        await fixture.whenStable();
        expect(MagmaColorPicker._overlayRef).toBeDefined();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await fixture.whenStable();
        expect(MagmaColorPicker._overlayRef).toBeUndefined();
    });

    it('should close overlay on backdrop click', async () => {
        directive.open();
        await fixture.whenStable();
        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));
        await fixture.whenStable();
        expect(MagmaColorPicker._overlayRef).toBeUndefined();
    });

    it('should emit colorChange on color selection', async () => {
        vi.spyOn(directive.colorChange, 'emit');
        directive.open();
        await fixture.whenStable();
        const component = MagmaColorPicker._component;
        component?.instance.colorChange.emit('#00ff00');
        await fixture.whenStable();
        expect(directive.colorChange.emit).toHaveBeenCalledWith('#00ff00');
    });

    it('should emit colorClose on backdrop click if color changed', async () => {
        vi.spyOn(directive.colorClose, 'emit');
        directive.open();
        await fixture.whenStable();
        const component = MagmaColorPicker._component;
        component?.instance.colorChange.emit('#00ff00');
        await fixture.whenStable();
        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));
        await fixture.whenStable();
        expect(directive.colorClose.emit).toHaveBeenCalledWith('#00ff00');
    });

    it('should open overlay on space key', async () => {
        const directive = directiveElement.injector.get(MagmaColorPicker);
        const openSpy = vi.spyOn(directive, 'open');
        directiveElement.triggerEventHandler('keydown.space', new KeyboardEvent('keydown', { key: ' ' }));
        await fixture.whenStable();
        expect(openSpy).toHaveBeenCalled();
    });

    it('should update alpha input dynamically', async () => {
        const directive = directiveElement.injector.get(MagmaColorPicker);
        directive.open();
        fixture.changeDetectorRef.detectChanges();
        await fixture.whenStable();

        fixture.componentInstance.alpha = true;

        fixture.changeDetectorRef.detectChanges();
        const component = MagmaColorPicker._component;
        expect(component?.instance.alpha()).toBe(true);
    });

    it('should clean up on destroy', async () => {
        const directive = directiveElement.injector.get(MagmaColorPicker);
        directive.open();
        await fixture.whenStable();
        directive.ngOnDestroy();
        expect(MagmaColorPicker._overlayRef).toBeUndefined();
        expect(MagmaColorPicker._component).toBeUndefined();
    });
});
