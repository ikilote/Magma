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
    let ngModel: NgModel;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule, TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        inputElement = fixture.debugElement.query(By.directive(NgModel));
        directive = inputElement.injector.get(MagmaNgModelChangeDebouncedDirective);
        ngModel = inputElement.injector.get(NgModel);
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
            fixture.detectChanges();
            expect(directive.ngModelChangeDebounceTime()).toBe(1000);
        });
    });

    describe('Debounced emission', () => {
        beforeEach(() => {
            component.onDebouncedChange.mockClear();
        });

        it('should emit debounced value after debounce time', () => {
            // Change the value
            component.value = 'test';
            fixture.detectChanges();

            // First change should not emit immediately
            expect(component.onDebouncedChange).not.toHaveBeenCalled();

            // Advance time by debounce time
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();

            // Should emit after debounce time
            expect(component.onDebouncedChange).toHaveBeenCalledWith('test');
            expect(component.onDebouncedChange).toHaveBeenCalledTimes(1);
        });

        it('should not emit if value does not change', () => {
            // Set initial value
            component.value = 'test';
            fixture.detectChanges();

            // Advance time by debounce time
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();

            // First emission
            expect(component.onDebouncedChange).toHaveBeenCalledTimes(1);

            // Reset spy
            component.onDebouncedChange.mockClear();

            // Set same value again
            component.value = 'test';
            fixture.detectChanges();

            // Advance time by debounce time
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();

            // Should not emit again for same value
            expect(component.onDebouncedChange).not.toHaveBeenCalled();
        });

        it('should debounce multiple rapid changes', () => {
            // First change
            component.value = 'test1';
            fixture.detectChanges();

            // Second change before debounce time
            vi.useFakeTimers({ advanceTimeDelta: 200 });
            component.value = 'test2';
            fixture.detectChanges();

            // Third change before debounce time
            vi.useFakeTimers({ advanceTimeDelta: 200 });
            component.value = 'test3';
            fixture.detectChanges();

            // Advance to debounce time from last change
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();

            // Should emit only the last value after debounce time
            expect(component.onDebouncedChange).toHaveBeenCalledTimes(1);
            expect(component.onDebouncedChange).toHaveBeenCalledWith('test3');
        });

        it('should use custom debounce time', () => {
            // Set custom debounce time
            component.debounceTime = 1000;
            fixture.detectChanges();

            // Change the value
            component.value = 'test';
            fixture.detectChanges();

            // Should not emit before custom debounce time
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            expect(component.onDebouncedChange).not.toHaveBeenCalled();

            // Should emit after custom debounce time
            vi.useFakeTimers({ advanceTimeDelta: 1000 }); // Total 1000ms
            fixture.detectChanges();
            expect(component.onDebouncedChange).toHaveBeenCalledWith('test');
        });

        it('should skip initial value', () => {
            // Initial value is set in the component
            // We should verify that the first emission is skipped
            // Reset the spy to ignore any calls during initialization
            component.onDebouncedChange.mockClear();

            // Change the value
            component.value = 'new value';
            fixture.detectChanges();

            // Should emit after debounce time
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();

            // Should emit only once (initial value was skipped)
            expect(component.onDebouncedChange).toHaveBeenCalledTimes(1);
            expect(component.onDebouncedChange).toHaveBeenCalledWith('new value');
        });
    });

    describe('Edge cases', () => {
        it('should handle null values', () => {
            // Set to null
            // @ts-ignore - Testing undefined input
            component.value = null;
            fixture.detectChanges();
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();
            expect(component.onDebouncedChange).toHaveBeenCalledWith(null);
        });

        it('should handle undefined values', () => {
            // Set to undefined
            // @ts-ignore - Testing undefined input
            component.value = undefined;
            fixture.detectChanges();
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();
            expect(component.onDebouncedChange).toHaveBeenCalledWith(undefined);
        });

        it('should handle empty string', () => {
            // initial value is '', if set to '', Angular does not detect any change
            component.value = '1';
            fixture.detectChanges();
            component.value = '';
            fixture.detectChanges();
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();
            expect(component.onDebouncedChange).toHaveBeenCalledWith(component.value);
        });

        it('should handle number values', () => {
            // @ts-ignore - Testing undefined input
            component.value = 42;
            fixture.detectChanges();
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();
            expect(component.onDebouncedChange).toHaveBeenCalledWith(42);
        });
    });

    describe('distinctUntilChanged behavior', () => {
        it('should not emit if value changes to the same value', () => {
            // Set initial value
            component.value = 'test';
            fixture.detectChanges();
            // Wait for initial debounce
            vi.useFakeTimers({ advanceTimeDelta: 500 });
            fixture.detectChanges();
            // Reset spy
            component.onDebouncedChange.mockClear();
            // Change to different value
            component.value = 'different';
            fixture.detectChanges();
            // Change back to original value before debounce completes
            vi.useFakeTimers({ advanceTimeDelta: 200 });
            component.value = 'test';
            fixture.detectChanges();
            // Wait for debounce time
            vi.useFakeTimers({ advanceTimeDelta: 300 });
            // Should not emit because final value is same as previous emitted value
            expect(component.onDebouncedChange).not.toHaveBeenCalled();
        });
    });
});
