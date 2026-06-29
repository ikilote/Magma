import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaTextareaAutosizeDirective } from './textarea-autosize.directive';

@Component({
    template: `<textarea autosize [autosizeDisabled]="disabled"></textarea>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTextareaAutosizeDirective],
})
class TestComponent {
    disabled = false;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Force the module-level FIELD_SIZING_SUPPORTED flag by mocking CSS.supports. */
function mockFieldSizingSupport(supported: boolean) {
    vi.spyOn(CSS, 'supports').mockImplementation((prop: string, value?: string) => {
        if (prop === 'field-sizing' && value === 'content') return supported;
        return false;
    });
}

// ---------------------------------------------------------------------------
// Suite: field-sizing supported
// ---------------------------------------------------------------------------

describe('MagmaTextareaAutosizeDirective – field-sizing supported', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let textareaEl: DebugElement;
    let directive: MagmaTextareaAutosizeDirective;

    beforeEach(async () => {
        mockFieldSizingSupport(true);

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
        vi.restoreAllMocks();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    it('should add auto-field class when autosizeDisabled is false', () => {
        fixture.changeDetectorRef.detectChanges();

        expect(textareaEl.nativeElement.classList).toContain('auto-field');
    });

    it('should not add auto-field class when autosizeDisabled is true', () => {
        component.disabled = true;
        fixture.changeDetectorRef.detectChanges();

        expect(textareaEl.nativeElement.classList).not.toContain('auto-field');
    });

    it('should add auto-field class when autosizeDisabled changes from true to false', () => {
        component.disabled = true;
        fixture.changeDetectorRef.detectChanges();

        component.disabled = false;
        fixture.changeDetectorRef.detectChanges();

        expect(textareaEl.nativeElement.classList).toContain('auto-field');
    });

    it('should remove auto-field class when autosizeDisabled changes from false to true', () => {
        fixture.changeDetectorRef.detectChanges();
        expect(textareaEl.nativeElement.classList).toContain('auto-field');

        component.disabled = true;
        fixture.changeDetectorRef.detectChanges();

        expect(textareaEl.nativeElement.classList).not.toContain('auto-field');
    });

    it('should remove auto-field class when component is destroyed', () => {
        fixture.changeDetectorRef.detectChanges();
        expect(textareaEl.nativeElement.classList).toContain('auto-field');

        fixture.destroy();

        expect(textareaEl.nativeElement.classList).not.toContain('auto-field');
    });

    it('should handle ngOnChanges when autosizeDisabled is not in changes', () => {
        fixture.changeDetectorRef.detectChanges();

        directive.ngOnChanges({
            someOtherProperty: {
                currentValue: true,
                previousValue: false,
                firstChange: false,
                isFirstChange: () => false,
            },
        });

        expect(textareaEl.nativeElement.classList).toContain('auto-field');
    });
});

// ---------------------------------------------------------------------------
// Suite: field-sizing NOT supported (autosize fallback)
// ---------------------------------------------------------------------------

describe('MagmaTextareaAutosizeDirective – field-sizing not supported (autosize fallback)', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let textareaEl: DebugElement;
    let directive: MagmaTextareaAutosizeDirective;

    beforeEach(async () => {
        mockFieldSizingSupport(false);

        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        vi.useFakeTimers();
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        textareaEl = fixture.debugElement.query(By.css('textarea[autosize]'));
        directive = textareaEl.injector.get(MagmaTextareaAutosizeDirective);
    });

    afterEach(() => {
        fixture.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    it('should initialize autosize when autosizeDisabled is false', () => {
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('hidden');
        expect(textareaEl.nativeElement.style.resize).toBe('horizontal');
    });

    it('should not add auto-field class', () => {
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.classList).not.toContain('auto-field');
    });

    it('should not initialize autosize when autosizeDisabled is true', () => {
        component.disabled = true;
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    });

    it('should reinitialize autosize when autosizeDisabled changes from true to false', () => {
        // Initially disabled
        component.disabled = true;
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        // Enable autosize
        component.disabled = false;
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('hidden');
        expect(textareaEl.nativeElement.style.resize).toBe('horizontal');
    });

    it('should destroy autosize when autosizeDisabled changes from false to true', () => {
        // Initially enabled
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        // Disable autosize
        component.disabled = true;
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    });

    it('should destroy autosize when component is destroyed', () => {
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        fixture.destroy();

        expect(textareaEl.nativeElement.style.overflow).toBe('');
        expect(textareaEl.nativeElement.style.resize).toBe('');
    });

    it('should not initialize autosize when destroyed before timer completes', () => {
        fixture.changeDetectorRef.detectChanges();
        // Destroy before timer completes
        directive.ngOnDestroy();
        vi.advanceTimersByTime(1);

        // Should not have initialized autosize
        expect(textareaEl.nativeElement.style.overflow).toBe('');
    });

    it('should handle ngOnChanges when autosizeDisabled is not in changes', () => {
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        // Call ngOnChanges with a different property
        directive.ngOnChanges({
            someOtherProperty: {
                currentValue: true,
                previousValue: false,
                firstChange: false,
                isFirstChange: () => false,
            },
        });

        // Should not affect autosize state
        expect(textareaEl.nativeElement.style.overflow).toBe('hidden');
    });

    it('should not initialize autosize on non-textarea element (simulated)', () => {
        Object.defineProperty(textareaEl.nativeElement, 'nodeName', {
            value: 'DIV',
            configurable: true,
        });

        directive.ngOnInit();
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(1);

        // Should not have autosize styles because nodeName is not TEXTAREA
        expect(textareaEl.nativeElement.style.overflow).toBe('');

        // Restore original nodeName
        Object.defineProperty(textareaEl.nativeElement, 'nodeName', {
            value: 'TEXTAREA',
            configurable: true,
        });
    });
});
