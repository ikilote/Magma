import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

    it('should initialize autosize when autosizeDisabled is false', () => {
        fixture.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('hidden');
        expect(textareaEl.nativeElement.style.resize).toBe('horizontal');
    });

    it('should not initialize autosize when autosizeDisabled is true', () => {
        component.disabled = true;
        fixture.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    });

    it('should reinitialize autosize when autosizeDisabled changes from true to false', () => {
        // Initially disabled
        component.disabled = true;
        fixture.detectChanges();
        vi.advanceTimersByTime(1);

        // Enable autosize
        component.disabled = false;
        fixture.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('hidden');
        expect(textareaEl.nativeElement.style.resize).toBe('horizontal');
    });

    it('should destroy autosize when autosizeDisabled changes from false to true', () => {
        // Initially enabled
        fixture.detectChanges();
        vi.advanceTimersByTime(1);

        // Disable autosize
        component.disabled = true;
        fixture.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    });

    it('should destroy autosize when component is destroyed', () => {
        fixture.detectChanges();
        vi.advanceTimersByTime(1);

        fixture.destroy();

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    });
});
