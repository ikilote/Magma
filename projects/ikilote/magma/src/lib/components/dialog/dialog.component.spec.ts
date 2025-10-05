import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaDialog } from './dialog.component';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';

describe('MagmaDialog', () => {
    let component: MagmaDialog;
    let fixture: ComponentFixture<MagmaDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be closed by default', () => {
        expect(component.isOpen()).toBeFalse();
    });

    it('should open when open() is called', () => {
        component.open();
        fixture.detectChanges();
        expect(component.isOpen()).toBeTrue();
    });

    it('should close when close() is called', () => {
        component.open();
        fixture.detectChanges();
        component.close();
        fixture.detectChanges();
        expect(component.isOpen()).toBeFalse();
    });

    it('should emit onClose when closed', () => {
        spyOn(component.onClose, 'emit');
        component.open();
        fixture.detectChanges();
        component.close();
        expect(component.onClose.emit).toHaveBeenCalled();
    });
});

@Component({
    imports: [MagmaDialog, MagmaLimitFocusDirective],
    template: `
        <mg-dialog
            [closeButton]="closeButton"
            [closeBackdrop]="closeBackdrop"
            [closeButtonTitle]="closeButtonTitle"
            [label]="label"
            [title]="title"
            [id]="id"
            (onClose)="onClose()"
            >Content</mg-dialog
        >
    `,
})
class TestWrapperComponent {
    closeButton = false;
    closeBackdrop = false;
    closeButtonTitle = 'Close';
    label = 'Dialog Label';
    title = 'Dialog Title';
    id = 'dialog-1';
    onClose = jasmine.createSpy('onClose');
}

describe('MagmaDialog usage', () => {
    let fixture: ComponentFixture<TestWrapperComponent>;
    let dialogComponent: MagmaDialog;
    let debugElement: DebugElement;
    let wrapperComponent: TestWrapperComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaLimitFocusDirective, MagmaDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(TestWrapperComponent);
        wrapperComponent = fixture.componentInstance;
        debugElement = fixture.debugElement;
        dialogComponent = debugElement.query(By.directive(MagmaDialog)).componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(dialogComponent).toBeTruthy();
    });

    it('should project not open', () => {
        const main = debugElement.query(By.css('.main'));
        expect(main).toBeNull();
    });

    it('should project open with simple content', () => {
        wrapperComponent.title = '';
        dialogComponent.open();
        fixture.detectChanges();
        const main = debugElement.query(By.css('.main'));
        expect(main).toBeDefined();
        expect(main.nativeElement.textContent).toBe('Content');
    });

    it('should display close button if closeButton is true', () => {
        wrapperComponent.closeButton = true;
        dialogComponent.open();
        fixture.detectChanges();
        const closeButton = debugElement.query(By.css('.close'));
        expect(closeButton).toBeTruthy();
    });

    it('should not display close button if closeButton is false', () => {
        wrapperComponent.closeButton = false;
        dialogComponent.open();
        fixture.detectChanges();
        const closeButton = debugElement.query(By.css('.close'));
        expect(closeButton).toBeNull();
    });

    it('should display title if provided', () => {
        wrapperComponent.title = 'Test Title';
        dialogComponent.open();
        fixture.detectChanges();
        const titleElement = debugElement.query(By.css('h1'));
        expect(titleElement).toBeTruthy();
        expect(titleElement.nativeElement.textContent).toContain('Test Title');
    });

    it('should not display title if not provided', () => {
        wrapperComponent.title = '';
        dialogComponent.open();
        fixture.detectChanges();
        const titleElement = debugElement.query(By.css('h1'));
        expect(titleElement).toBeNull();
    });

    it('should close when close button is clicked', () => {
        wrapperComponent.closeButton = true;
        dialogComponent.open();
        fixture.detectChanges();
        const closeButton = debugElement.query(By.css('.close'));
        closeButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(dialogComponent.isOpen()).toBeFalse();
    });

    it('should close when ESC key is pressed', fakeAsync(() => {
        wrapperComponent.closeButton = true;
        dialogComponent.open();
        fixture.detectChanges();
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(event);
        tick();
        fixture.detectChanges();
        expect(dialogComponent.isOpen()).toBeFalse();
    }));

    it('should close when clicking on body with if closeBackdrop is true', () => {
        wrapperComponent.closeBackdrop = true;
        dialogComponent.open();
        fixture.detectChanges();
        const backdrop = debugElement.query(By.css('.content'));
        backdrop.triggerEventHandler('click', { stopPropagation: () => {} });
        fixture.detectChanges();
        expect(dialogComponent.isOpen()).toBeTrue();
    });

    it('should close when clicking on backdrop if closeBackdrop is true', () => {
        wrapperComponent.closeBackdrop = true;
        dialogComponent.open();
        fixture.detectChanges();
        dialogComponent.onClick({ stopPropagation: () => {} } as MouseEvent);
        fixture.detectChanges();
        expect(dialogComponent.isOpen()).toBeFalse();
    });

    it('should close when clicking on backdrop if closeBackdrop is false', () => {
        wrapperComponent.closeBackdrop = false;
        dialogComponent.open();
        fixture.detectChanges();
        dialogComponent.onClick({ stopPropagation: () => {} } as MouseEvent);
        fixture.detectChanges();
        expect(dialogComponent.isOpen()).toBeTrue();
    });
});
