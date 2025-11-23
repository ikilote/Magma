import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaTextareaAutosizeDirective } from './textarea-autosize.directive';

@Component({
    template: `<textarea autosize [autosizeDisabled]="disabled"></textarea>`,
    imports: [MagmaTextareaAutosizeDirective],
})
class TestComponent {
    disabled = false;
}

describe('MagmaTextareaAutosizeDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let textareaEl: DebugElement;
    let directive: MagmaTextareaAutosizeDirective;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        textareaEl = fixture.debugElement.query(By.css('textarea[autosize]'));
        directive = textareaEl.injector.get(MagmaTextareaAutosizeDirective);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    it('should initialize autosize when autosizeDisabled is false', fakeAsync(() => {
        fixture.detectChanges();
        tick(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('hidden');
        expect(textareaEl.nativeElement.style.resize).toBe('horizontal');
    }));

    it('should not initialize autosize when autosizeDisabled is true', fakeAsync(() => {
        component.disabled = true;
        fixture.detectChanges();
        tick(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    }));

    it('should reinitialize autosize when autosizeDisabled changes from true to false', fakeAsync(() => {
        // Initially disabled
        component.disabled = true;
        fixture.detectChanges();
        tick(1);

        // Enable autosize
        component.disabled = false;
        fixture.detectChanges();
        tick(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('hidden');
        expect(textareaEl.nativeElement.style.resize).toBe('horizontal');
    }));

    it('should destroy autosize when autosizeDisabled changes from false to true', fakeAsync(() => {
        // Initially enabled
        fixture.detectChanges();
        tick(1);

        // Disable autosize
        component.disabled = true;
        fixture.detectChanges();
        tick(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    }));

    it('should destroy autosize when component is destroyed', fakeAsync(() => {
        fixture.detectChanges();
        tick(1);

        fixture.destroy();

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    }));
});
