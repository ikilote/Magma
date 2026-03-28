// stop-propagation.directive.spec.ts
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaStopPropagationDirective } from './stop-propagation.directive';

@Component({
    template: `
        <div (keydown)="onKeydown($event)" (click)="onClick($event)">
            <div
                stop-propagation
                [stopKeydown]="stopKeydown"
                [stopClick]="stopClick"
                (keydown)="onInnerKeydown($event)"
                (click)="onInnerClick($event)"
            >
                Inner Element
            </div>
        </div>
    `,
    imports: [MagmaStopPropagationDirective],
})
class TestComponent {
    stopKeydown = false;
    stopClick = false;
    onKeydown = vi.fn();
    onClick = vi.fn();
    onInnerKeydown = vi.fn();
    onInnerClick = vi.fn();
}

describe('MagmaStopPropagationDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let innerElement: DebugElement;
    let directive: MagmaStopPropagationDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();

        innerElement = fixture.debugElement.query(By.directive(MagmaStopPropagationDirective));
        directive = innerElement.injector.get(MagmaStopPropagationDirective);
    });

    afterEach(() => {
        fixture?.destroy();
    });

    /** Helper to update inputs without ExpressionChangedAfterItHasBeenCheckedError */
    function updateInputs(changes: Partial<TestComponent>) {
        Object.assign(component, changes);
        fixture.changeDetectorRef.detectChanges();
    }

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('stopPropagation behavior', () => {
        describe('keydown events', () => {
            it('should not stop propagation when stopKeydown is false', () => {
                const keydownEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                });

                innerElement.nativeElement.dispatchEvent(keydownEvent);

                expect(component.onInnerKeydown).toHaveBeenCalled();
                expect(component.onKeydown).toHaveBeenCalled();
            });

            it('should stop propagation when stopKeydown is true', () => {
                updateInputs({ stopKeydown: true });

                const keydownEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                });

                innerElement.nativeElement.dispatchEvent(keydownEvent);

                expect(component.onInnerKeydown).toHaveBeenCalled();
                expect(component.onKeydown).not.toHaveBeenCalled();
            });
        });

        describe('click events', () => {
            it('should not stop propagation when stopClick is false', () => {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });

                innerElement.nativeElement.dispatchEvent(clickEvent);

                expect(component.onInnerClick).toHaveBeenCalled();
                expect(component.onClick).toHaveBeenCalled();
            });

            it('should stop propagation when stopClick is true', () => {
                updateInputs({ stopClick: true });

                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });

                innerElement.nativeElement.dispatchEvent(clickEvent);

                expect(component.onInnerClick).toHaveBeenCalled();
                expect(component.onClick).not.toHaveBeenCalled();
            });
        });

        describe('both events', () => {
            it('should stop propagation for both events when both inputs are true', () => {
                updateInputs({ stopKeydown: true, stopClick: true });

                // Test keydown
                const keydownEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                });
                vi.spyOn(keydownEvent, 'stopPropagation');
                innerElement.nativeElement.dispatchEvent(keydownEvent);

                expect(keydownEvent.stopPropagation).toHaveBeenCalled();
                expect(component.onInnerKeydown).toHaveBeenCalled();
                expect(component.onKeydown).not.toHaveBeenCalled();

                // Reset spies
                component.onKeydown.mockClear();
                component.onInnerKeydown.mockClear();

                // Test click
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });
                vi.spyOn(clickEvent, 'stopPropagation');
                innerElement.nativeElement.dispatchEvent(clickEvent);

                expect(clickEvent.stopPropagation).toHaveBeenCalled();
                expect(component.onInnerClick).toHaveBeenCalled();
                expect(component.onClick).not.toHaveBeenCalled();
            });

            it('should not stop propagation for any event when both inputs are false', () => {
                // Test keydown
                const keydownEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                });
                vi.spyOn(keydownEvent, 'stopPropagation');
                innerElement.nativeElement.dispatchEvent(keydownEvent);

                expect(keydownEvent.stopPropagation).not.toHaveBeenCalled();
                expect(component.onInnerKeydown).toHaveBeenCalled();
                expect(component.onKeydown).toHaveBeenCalled();

                // Reset spies
                component.onKeydown.mockClear();
                component.onInnerKeydown.mockClear();
                component.onClick.mockClear();
                component.onInnerClick.mockClear();

                // Test click
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });
                vi.spyOn(clickEvent, 'stopPropagation');
                innerElement.nativeElement.dispatchEvent(clickEvent);

                expect(clickEvent.stopPropagation).not.toHaveBeenCalled();
                expect(component.onInnerClick).toHaveBeenCalled();
                expect(component.onClick).toHaveBeenCalled();
            });
        });
    });

    describe('block method', () => {
        it('should call stopPropagation for keydown when stopKeydown is true', () => {
            updateInputs({ stopKeydown: true, stopClick: false });

            const keydownEvent = new KeyboardEvent('keydown');
            vi.spyOn(keydownEvent, 'stopPropagation');

            directive.block(keydownEvent);

            expect(keydownEvent.stopPropagation).toHaveBeenCalled();
        });

        it('should call stopPropagation for click when stopClick is true', () => {
            updateInputs({ stopKeydown: false, stopClick: true });

            const clickEvent = new MouseEvent('click');
            vi.spyOn(clickEvent, 'stopPropagation');

            directive.block(clickEvent);

            expect(clickEvent.stopPropagation).toHaveBeenCalled();
        });

        it('should not call stopPropagation when both inputs are false', () => {
            const keydownEvent = new KeyboardEvent('keydown');
            const clickEvent = new MouseEvent('click');
            vi.spyOn(keydownEvent, 'stopPropagation');
            vi.spyOn(clickEvent, 'stopPropagation');

            directive.block(keydownEvent);
            directive.block(clickEvent);

            expect(keydownEvent.stopPropagation).not.toHaveBeenCalled();
            expect(clickEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });
});
