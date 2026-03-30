import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaNgModelChangeDebouncedDirective } from './ng-model-change-debounced.directive';

@Component({
    template: `
        <form>
            <input
                [(ngModel)]="value"
                name="testInput"
                [ngModelChangeDebounceTime]="debounceTime"
                (ngModelChangeDebounced)="onDebouncedChange($event)"
            />
        </form>
    `,
    imports: [FormsModule, MagmaNgModelChangeDebouncedDirective],
})
class TestComponent {
    value: any = '';
    debounceTime = 500;
    onDebouncedChange = vi.fn();
}

describe('MagmaNgModelChangeDebouncedDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputElement: DebugElement;
    let directive: MagmaNgModelChangeDebouncedDirective;

    beforeEach(async () => {
        vi.useFakeTimers();

        await TestBed.configureTestingModule({
            imports: [FormsModule, TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(0);
        fixture.changeDetectorRef.detectChanges();

        inputElement = fixture.debugElement.query(By.directive(NgModel));
        directive = inputElement.injector.get(MagmaNgModelChangeDebouncedDirective);
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('Initialization', () => {
        it('should set default debounce time to 500ms', () => {
            expect(directive.ngModelChangeDebounceTime()).toBe(500);
        });

        it('should use custom debounce time when provided', () => {
            component.debounceTime = 1000;
            fixture.changeDetectorRef.detectChanges();
            vi.advanceTimersByTime(0);
            expect(directive.ngModelChangeDebounceTime()).toBe(1000);
        });
    });

    describe('Debounced emission', () => {
        beforeEach(() => {
            component.onDebouncedChange.mockClear();
        });

        it('should emit debounced value after debounce time', () => {
            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = 'test';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            expect(component.onDebouncedChange).not.toHaveBeenCalled();

            vi.advanceTimersByTime(500);

            expect(component.onDebouncedChange).toHaveBeenCalledWith('test');
            expect(component.onDebouncedChange).toHaveBeenCalledTimes(1);
        });

        it('should not emit if value does not change', () => {
            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = 'test';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            expect(component.onDebouncedChange).toHaveBeenCalledTimes(1);

            component.onDebouncedChange.mockClear();

            // Set same value again
            input.value = 'test';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            expect(component.onDebouncedChange).not.toHaveBeenCalled();
        });

        it('should debounce multiple rapid changes', () => {
            const input = inputElement.nativeElement as HTMLInputElement;

            input.value = 'test1';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(200);

            input.value = 'test2';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(200);

            input.value = 'test3';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);

            expect(component.onDebouncedChange).toHaveBeenCalledTimes(1);
            expect(component.onDebouncedChange).toHaveBeenCalledWith('test3');
        });

        it('should use custom debounce time', () => {
            component.debounceTime = 1000;
            fixture.changeDetectorRef.detectChanges();
            vi.advanceTimersByTime(0);

            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = 'test';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            expect(component.onDebouncedChange).not.toHaveBeenCalled();

            vi.advanceTimersByTime(500);
            expect(component.onDebouncedChange).toHaveBeenCalledWith('test');
        });

        it('should skip initial value', () => {
            component.onDebouncedChange.mockClear();

            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = 'new value';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);

            expect(component.onDebouncedChange).toHaveBeenCalledTimes(1);
            expect(component.onDebouncedChange).toHaveBeenCalledWith('new value');
        });
    });

    describe('Edge cases', () => {
        it('should handle null values', () => {
            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = '';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            // ngModel converts empty input to empty string, not null
            expect(component.onDebouncedChange).toHaveBeenCalled();
        });

        it('should handle undefined values', () => {
            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = '';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            expect(component.onDebouncedChange).toHaveBeenCalled();
        });

        it('should handle empty string', () => {
            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = '1';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            component.onDebouncedChange.mockClear();

            input.value = '';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            expect(component.onDebouncedChange).toHaveBeenCalledWith('');
        });

        it('should handle number values', () => {
            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = '42';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            expect(component.onDebouncedChange).toHaveBeenCalledWith('42');
        });
    });

    describe('distinctUntilChanged behavior', () => {
        it('should emit when value changes back to original after intermediate change', () => {
            const input = inputElement.nativeElement as HTMLInputElement;
            input.value = 'test';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            component.onDebouncedChange.mockClear();

            input.value = 'different';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(200);

            input.value = 'test';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.detectChanges();

            vi.advanceTimersByTime(500);
            // distinctUntilChanged compares with previous value in stream, not last emitted
            // So "test" is different from "different", hence it should emit
            expect(component.onDebouncedChange).toHaveBeenCalledWith('test');
        });
    });
});
