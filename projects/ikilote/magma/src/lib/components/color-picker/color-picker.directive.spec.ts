import { Overlay } from '@angular/cdk/overlay';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
        fixture.detectChanges();
        spanElement = fixture.debugElement.query(By.css('.test'));

        directive = directiveElement.injector.get(MagmaColorPicker);
    });

    it('should create directive', () => {
        expect(directiveElement).toBeTruthy();
    });

    it('should set tabIndex to -1 if disabled', () => {
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();
        expect(directiveElement.nativeElement.tabIndex).toBe(-1);
    });

    it('should open overlay on click', fakeAsync(() => {
        const event = new MouseEvent('click');
        const eventSpy = spyOn(event, 'preventDefault');
        tick();
        document.querySelector('.test')?.dispatchEvent(event);
        expect(eventSpy).toHaveBeenCalled(); // in open
    }));

    it('should not open overlay if disabled', fakeAsync(() => {
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();
        const event = new MouseEvent('click');
        const eventSpy = spyOn(event, 'preventDefault');
        tick();
        document.querySelector('.test')?.dispatchEvent(event);
        expect(eventSpy).not.toHaveBeenCalled(); // in open
    }));

    it('should create overlay with correct inputs', fakeAsync(() => {
        directive.open();
        tick();
        const overlayRef = MagmaColorPicker._overlayRef;
        const component = MagmaColorPicker._component;
        expect(overlayRef).toBeDefined();
        expect(component).toBeDefined();
        expect(component?.instance.color()).toBe('#ff0000');
        expect(component?.instance.alpha()).toBe(false);
    }));

    it('should close overlay on escape', fakeAsync(() => {
        directive.open();
        tick();
        expect(MagmaColorPicker._overlayRef).toBeDefined();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        tick();
        expect(MagmaColorPicker._overlayRef).toBeUndefined();
    }));

    it('should close overlay on backdrop click', fakeAsync(() => {
        directive.open();
        tick();
        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));
        tick();
        expect(MagmaColorPicker._overlayRef).toBeUndefined();
    }));

    it('should emit colorChange on color selection', fakeAsync(() => {
        spyOn(directive.colorChange, 'emit');
        directive.open();
        tick();
        const component = MagmaColorPicker._component;
        component?.instance.colorChange.emit('#00ff00');
        tick();
        expect(directive.colorChange.emit).toHaveBeenCalledWith('#00ff00');
    }));

    it('should emit colorClose on backdrop click if color changed', fakeAsync(() => {
        spyOn(directive.colorClose, 'emit');
        directive.open();
        tick();
        const component = MagmaColorPicker._component;
        component?.instance.colorChange.emit('#00ff00');
        tick();
        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));
        tick();
        expect(directive.colorClose.emit).toHaveBeenCalledWith('#00ff00');
    }));

    it('should open overlay on space key', fakeAsync(() => {
        const directive = directiveElement.injector.get(MagmaColorPicker);
        const openSpy = spyOn(directive, 'open');
        directiveElement.triggerEventHandler('keydown.space', new KeyboardEvent('keydown', { key: ' ' }));
        tick();
        expect(openSpy).toHaveBeenCalled();
    }));

    it('should update alpha input dynamically', fakeAsync(() => {
        const directive = directiveElement.injector.get(MagmaColorPicker);
        directive.open();
        tick();
        fixture.componentInstance.alpha = true;
        fixture.detectChanges();
        const component = MagmaColorPicker._component;
        expect(component?.instance.alpha()).toBe(true);
    }));

    it('should clean up on destroy', fakeAsync(() => {
        const directive = directiveElement.injector.get(MagmaColorPicker);
        directive.open();
        tick();
        directive.ngOnDestroy();
        expect(MagmaColorPicker._overlayRef).toBeUndefined();
        expect(MagmaColorPicker._component).toBeUndefined();
    }));
});
