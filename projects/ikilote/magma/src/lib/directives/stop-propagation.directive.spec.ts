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
    onKeydown = jasmine.createSpy('onKeydown');
    onClick = jasmine.createSpy('onClick');
    onInnerKeydown = jasmine.createSpy('onInnerKeydown');
    onInnerClick = jasmine.createSpy('onInnerClick');
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
        fixture.detectChanges();

        innerElement = fixture.debugElement.query(By.directive(MagmaStopPropagationDirective));
        directive = innerElement.injector.get(MagmaStopPropagationDirective);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('stopPropagation behavior', () => {
        describe('keydown events', () => {
            it('should not stop propagation when stopKeydown is false', () => {
                component.stopKeydown = false;
                fixture.detectChanges();

                const keydownEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                });

                innerElement = fixture.debugElement.query(By.directive(MagmaStopPropagationDirective));
                innerElement.nativeElement.dispatchEvent(keydownEvent);

                expect(component.onInnerKeydown).toHaveBeenCalled();
                expect(component.onKeydown).toHaveBeenCalled();
            });

            it('should stop propagation when stopKeydown is true', () => {
                component.stopKeydown = true;
                fixture.detectChanges();

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
                component.stopClick = false;
                fixture.detectChanges();

                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });

                innerElement.nativeElement.dispatchEvent(clickEvent);

                expect(component.onInnerClick).toHaveBeenCalled();
                expect(component.onClick).toHaveBeenCalled();
            });

            it('should stop propagation when stopClick is true', () => {
                component.stopClick = true;
                fixture.detectChanges();

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
                component.stopKeydown = true;
                component.stopClick = true;
                fixture.detectChanges();

                // Test keydown
                const keydownEvent = new KeyboardEvent('keydown');
                spyOn(keydownEvent, 'stopPropagation');
                innerElement.nativeElement.dispatchEvent(keydownEvent, {
                    bubbles: true,
                    cancelable: true,
                });

                expect(keydownEvent.stopPropagation).toHaveBeenCalled();
                expect(component.onInnerKeydown).toHaveBeenCalled();
                expect(component.onKeydown).not.toHaveBeenCalled();

                // Reset spies
                component.onKeydown.calls.reset();
                component.onInnerKeydown.calls.reset();

                // Test click
                const clickEvent = new MouseEvent('click');
                spyOn(clickEvent, 'stopPropagation');
                innerElement.nativeElement.dispatchEvent(clickEvent, {
                    bubbles: true,
                    cancelable: true,
                });

                expect(clickEvent.stopPropagation).toHaveBeenCalled();
                expect(component.onInnerClick).toHaveBeenCalled();
                expect(component.onClick).not.toHaveBeenCalled();
            });

            it('should not stop propagation for any event when both inputs are false', () => {
                component.stopKeydown = false;
                component.stopClick = false;
                fixture.detectChanges();

                // Test keydown
                const keydownEvent = new KeyboardEvent('keydown');
                spyOn(keydownEvent, 'stopPropagation');
                innerElement.nativeElement.dispatchEvent(keydownEvent, {
                    bubbles: true,
                    cancelable: true,
                });

                expect(keydownEvent.stopPropagation).not.toHaveBeenCalled();
                expect(component.onInnerKeydown).toHaveBeenCalled();
                expect(component.onKeydown).not.toHaveBeenCalled();

                // Reset spies
                component.onKeydown.calls.reset();
                component.onInnerKeydown.calls.reset();
                component.onClick.calls.reset();
                component.onInnerClick.calls.reset();

                // Test click
                const clickEvent = new MouseEvent('click');
                spyOn(clickEvent, 'stopPropagation');
                innerElement.nativeElement.dispatchEvent(clickEvent, {
                    bubbles: true,
                    cancelable: true,
                });

                expect(clickEvent.stopPropagation).not.toHaveBeenCalled();
                expect(component.onInnerClick).toHaveBeenCalled();
                expect(component.onClick).not.toHaveBeenCalled();
            });
        });
    });

    describe('block method', () => {
        it('should call stopPropagation for keydown when stopKeydown is true', () => {
            component.stopKeydown = true;
            component.stopClick = false;
            fixture.detectChanges();

            const keydownEvent = new KeyboardEvent('keydown');
            spyOn(keydownEvent, 'stopPropagation');

            directive.block(keydownEvent);

            expect(keydownEvent.stopPropagation).toHaveBeenCalled();
        });

        it('should call stopPropagation for click when stopClick is true', () => {
            component.stopKeydown = false;
            component.stopClick = true;
            fixture.detectChanges();

            const clickEvent = new MouseEvent('click');
            spyOn(clickEvent, 'stopPropagation');

            directive.block(clickEvent);

            expect(clickEvent.stopPropagation).toHaveBeenCalled();
        });

        it('should not call stopPropagation when both inputs are false', () => {
            component.stopKeydown = false;
            component.stopClick = false;
            fixture.detectChanges();

            const keydownEvent = new KeyboardEvent('keydown');
            const clickEvent = new MouseEvent('click');
            spyOn(keydownEvent, 'stopPropagation');
            spyOn(clickEvent, 'stopPropagation');

            directive.block(keydownEvent);
            directive.block(clickEvent);

            expect(keydownEvent.stopPropagation).not.toHaveBeenCalled();
            expect(clickEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });
});
