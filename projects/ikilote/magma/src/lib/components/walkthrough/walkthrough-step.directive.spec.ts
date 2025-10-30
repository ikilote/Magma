import { CdkPortal } from '@angular/cdk/portal';
import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaWalkthroughStep } from './walkthrough-step.directive';

@Component({
    template: `
        <ng-template
            mg-walkthrough-step
            name="step1"
            selector=".target"
            [previousStep]="'prev'"
            [nextStep]="'next'"
            [close]="true"
            [showElement]="true"
            (start)="onStart()"
            (clickElement)="onClickElement()"
            (clickNext)="onClickNext()"
            (clickPrevious)="onClickPrevious()"
            (clickClose)="onClickClose()"
        />
    `,
    imports: [MagmaWalkthroughStep],
})
class TestHostComponent {
    onStart = jasmine.createSpy('onStart');
    onClickElement = jasmine.createSpy('onClickElement');
    onClickNext = jasmine.createSpy('onClickNext');
    onClickPrevious = jasmine.createSpy('onClickPrevious');
    onClickClose = jasmine.createSpy('onClickClose');

    template = viewChild.required(MagmaWalkthroughStep);
}
describe('MagmaWalkthroughStep', () => {
    let directive: MagmaWalkthroughStep;
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;
        fixture.detectChanges();

        directive = hostComponent.template();
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    it('should set required inputs', () => {
        expect(directive.name()).toBe('step1');
        expect(directive.selector()).toBe('.target');
    });

    it('should set optional inputs with default values', () => {
        expect(directive.previousButtonName()).toBe('Previous');
        expect(directive.nextButtonName()).toBe('Next');
        expect(directive.closeButtonName()).toBe('Close');
        expect(directive.close()).toBeTrue();
        expect(directive.showElement()).toBeTrue();
    });

    it('should emit start event', () => {
        directive.start.emit();
        expect(hostComponent.onStart).toHaveBeenCalled();
    });

    it('should emit clickElement event', () => {
        directive.clickElement.emit();
        expect(hostComponent.onClickElement).toHaveBeenCalled();
    });

    it('should emit clickNext event', () => {
        directive.clickNext.emit();
        expect(hostComponent.onClickNext).toHaveBeenCalled();
    });

    it('should emit clickPrevious event', () => {
        directive.clickPrevious.emit();
        expect(hostComponent.onClickPrevious).toHaveBeenCalled();
    });

    it('should emit clickClose event', () => {
        directive.clickClose.emit();
        expect(hostComponent.onClickClose).toHaveBeenCalled();
    });

    it('should inject CdkPortal', () => {
        expect(directive.portal).toBeDefined();
        expect(directive.portal).toBeInstanceOf(CdkPortal);
    });
});
