import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaClickEnterDirective } from './click-enter.directive';

@Component({
    template: `
        <div [disabled]="testDisabledFalse" (clickEnter)="onClickEnter($event)">Clickable Element</div>
        <div [disabled]="testDisabledTrue" (clickEnter)="onClickEnter($event)">Disabled Element</div>
    `,
    imports: [MagmaClickEnterDirective],
})
class TestComponent {
    testDisabledFalse = false;
    testDisabledTrue = true;

    onClickEnter(_event: KeyboardEvent | MouseEvent) {
        // This will be spied on in tests
    }
}

describe('MagmaClickEnterDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let elements: DebugElement[];
    let clickableElement: DebugElement;
    let disabledElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        spyOn(component, 'onClickEnter');
        fixture.detectChanges();

        elements = fixture.debugElement.queryAll(By.directive(MagmaClickEnterDirective));
        clickableElement = elements[0];
        disabledElement = elements[1];
    });

    it('should create an instance', () => {
        expect(elements.length).toBe(2);
        expect(clickableElement).toBeTruthy();
        expect(disabledElement).toBeTruthy();
    });

    describe('Host Bindings', () => {
        it('should add click-enter class to host element', () => {
            expect(clickableElement.nativeElement.classList.contains('click-enter')).toBeTrue();
            expect(disabledElement.nativeElement.classList.contains('click-enter')).toBeTrue();
        });

        it('should set tabindex to 0 when not disabled', () => {
            expect(clickableElement.nativeElement.getAttribute('tabindex')).toBe('0');
        });

        it('should not set tabindex when disabled', () => {
            expect(disabledElement.nativeElement.getAttribute('tabindex')).toBeNull();
        });

        it('should set role to button when not disabled', () => {
            expect(clickableElement.nativeElement.getAttribute('role')).toBe('button');
        });

        it('should not set role when disabled', () => {
            expect(disabledElement.nativeElement.getAttribute('role')).toBeNull();
        });
    });

    describe('Event Handling', () => {
        it('should emit event on click when not disabled', () => {
            const clickEvent = new MouseEvent('click');
            clickableElement.nativeElement.dispatchEvent(clickEvent);
            fixture.detectChanges();

            expect(component.onClickEnter).toHaveBeenCalledTimes(1);
            expect(component.onClickEnter).toHaveBeenCalledWith(clickEvent);
        });

        it('should not emit event on click when disabled', () => {
            const clickEvent = new MouseEvent('click');
            disabledElement.nativeElement.dispatchEvent(clickEvent);
            fixture.detectChanges();

            expect(component.onClickEnter).not.toHaveBeenCalled();
        });

        it('should emit event on Enter key press when not disabled', fakeAsync(() => {
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            clickableElement.nativeElement.dispatchEvent(keyboardEvent);
            fixture.detectChanges();
            tick();

            expect(component.onClickEnter).toHaveBeenCalledTimes(1);
            expect(component.onClickEnter).toHaveBeenCalledWith(keyboardEvent);
        }));

        it('should not emit event on Enter key press when disabled', fakeAsync(() => {
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            disabledElement.nativeElement.dispatchEvent(keyboardEvent);
            fixture.detectChanges();
            tick();

            expect(component.onClickEnter).not.toHaveBeenCalled();
        }));

        it('should not emit event on other key presses', fakeAsync(() => {
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Space' });
            clickableElement.nativeElement.dispatchEvent(keyboardEvent);
            fixture.detectChanges();
            tick();

            expect(component.onClickEnter).not.toHaveBeenCalled();
        }));
    });

    describe('Disabled Input', () => {
        it('should update disabled state when input changes', () => {
            // Change disabled state from false to true
            component.testDisabledFalse = true;
            fixture.detectChanges();

            expect(clickableElement.nativeElement.getAttribute('tabindex')).toBeNull();
            expect(clickableElement.nativeElement.getAttribute('role')).toBeNull();
        });

        it('should update disabled state when input changes from true to false', () => {
            // Change disabled state from true to false
            component.testDisabledTrue = false;
            fixture.detectChanges();

            expect(disabledElement.nativeElement.getAttribute('tabindex')).toBe('0');
            expect(disabledElement.nativeElement.getAttribute('role')).toBe('button');
        });
    });

    describe('Output Event', () => {
        it('should emit event through output when clicked', () => {
            const clickEvent = new MouseEvent('click');
            const directiveInstance = clickableElement.injector.get(MagmaClickEnterDirective);

            let emittedEvent: KeyboardEvent | MouseEvent | undefined;
            directiveInstance.clickEnter.subscribe(event => {
                emittedEvent = event;
            });

            clickableElement.nativeElement.dispatchEvent(clickEvent);
            fixture.detectChanges();

            expect(emittedEvent).toBe(clickEvent);
        });

        it('should emit event through output when Enter is pressed', fakeAsync(() => {
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            const directiveInstance = clickableElement.injector.get(MagmaClickEnterDirective);

            let emittedEvent: KeyboardEvent | MouseEvent | undefined;
            directiveInstance.clickEnter.subscribe(event => {
                emittedEvent = event;
            });

            clickableElement.nativeElement.dispatchEvent(keyboardEvent);
            fixture.detectChanges();
            tick();

            expect(emittedEvent).toBe(keyboardEvent);
        }));
    });
});
