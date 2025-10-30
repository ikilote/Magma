import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';

import { MagmaWalkthroughContent } from './walkthrough-content.component';
import { MagmaWalkthroughStep } from './walkthrough-step.directive';
import { MagmaWalkthrough } from './walkthrough.component';

class MockOverlayRef {
    backdropClick = () => of({});
    dispose = jasmine.createSpy('dispose');
    updatePosition = jasmine.createSpy('updatePosition');
    getConfig = () => ({ positionStrategy: new MockFlexibleConnectedPositionStrategy() });
    attach = jasmine.createSpy('attach').and.returnValue(new MockComponentRef());
}

class MockFlexibleConnectedPositionStrategy {
    setOrigin = jasmine.createSpy('setOrigin');
    apply = jasmine.createSpy('apply');
    reapplyLastPosition = jasmine.createSpy('reapplyLastPosition');
    positionChanges = of({});
}

class MockComponentRef {
    instance = { clone: { click: jasmine.createSpy('click') } };
    setInput = jasmine.createSpy('setInput');
}

class MockOverlay {
    create = jasmine.createSpy('create').and.returnValue(new MockOverlayRef());
    position = () => ({
        flexibleConnectedTo: () => ({
            withPositions: () => new MockFlexibleConnectedPositionStrategy(),
        }),
    });
    scrollStrategies = { block: () => ({}) };
}

@Component({
    template: `
        <mg-walkthrough>
            <ng-template mg-walkthrough-step name="first" group="test" selector=".target"></ng-template>
            <ng-template mg-walkthrough-step name="second" group="test" selector=".target2"></ng-template>
        </mg-walkthrough>
        <div class="target"></div>
        <div class="target2"></div>
    `,
    imports: [MagmaWalkthrough, MagmaWalkthroughStep],
})
class TestHostComponent {}

describe('MagmaWalkthrough', () => {
    let component: MagmaWalkthrough;
    let fixture: ComponentFixture<TestHostComponent>;
    let overlay: Overlay;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [{ provide: Overlay, useClass: MockOverlay }],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        overlay = TestBed.inject(Overlay);
        component = fixture.debugElement.children[0].componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should start walkthrough and create overlay', fakeAsync(() => {
        const mockElement = document.querySelector('.target');
        spyOn(document, 'querySelector').and.returnValue(mockElement);
        spyOn(mockElement as any, 'scrollIntoView');

        component.start({ group: 'test' });

        tick();

        expect(overlay.create).toHaveBeenCalled();
        expect((mockElement as any).scrollIntoView).toHaveBeenCalledWith({
            behavior: 'instant',
            block: 'center',
            inline: 'center',
        });
        expect((component as any).overlayRef.attach).toHaveBeenCalledWith(jasmine.any(ComponentPortal));
    }));

    it('should handle backdrop click actions', fakeAsync(() => {
        const mockElement = document.querySelector('.target');
        spyOn(document, 'querySelector').and.returnValue(mockElement);
        component.start({ group: 'test' });
        tick();

        component['portal'] = {
            backdropAction: () => 'close',
            nextStep: () => 'second',
        } as unknown as MagmaWalkthroughStep;

        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            component.close();
        });

        expect(component['content']).toBeUndefined();
        expect(component['overlayRef']).toBeUndefined();
    }));

    it('should change step and update overlay', fakeAsync(() => {
        const mockElement = document.querySelector('.target');
        const mockElement2 = document.querySelector('.target2');
        spyOn(document, 'querySelector').and.callFake((selector: string) =>
            selector === '.target' ? mockElement : mockElement2,
        );

        component.start({ group: 'test' });
        tick();

        component.changeStep('second', 'test');
        tick();

        expect((component as any)['positionStrategy'].setOrigin).toHaveBeenCalledWith(mockElement2);
        expect((component as any)['content'].setInput).toHaveBeenCalledWith('portal', jasmine.any(Object));
        expect((component as any)['content'].setInput).toHaveBeenCalledWith('element', mockElement2);
    }));

    it('should change step (close) and update overlay', fakeAsync(() => {
        const mockElement = document.querySelector('.target');
        const mockElement2 = document.querySelector('.target2');
        spyOn(document, 'querySelector').and.callFake((selector: string) =>
            selector === '.target' ? mockElement : mockElement2,
        );

        component.start({ group: 'test' });
        tick();

        component.changeStep();
        tick();

        expect(component['content']).toBeUndefined();
        expect(component['overlayRef']).toBeUndefined();
    }));

    it('should close overlay and clean references', fakeAsync(() => {
        const mockElement = document.querySelector('.target');
        spyOn(document, 'querySelector').and.returnValue(mockElement);

        component.start({ group: 'test' });
        tick();

        component.close();

        expect(component['content']).toBeUndefined();
        expect(component['overlayRef']).toBeUndefined();
    }));

    it('should not start if target element is not found', fakeAsync(() => {
        spyOn(document, 'querySelector').and.returnValue(null);
        component.start({ group: 'test' });
        tick();
        expect(overlay.create).not.toHaveBeenCalled();
    }));

    it('should call close() if backdropAction is "close"', fakeAsync(() => {
        component['portal'] = {
            backdropAction: () => 'close',
            nextStep: () => 'second',
            group: () => 'test',
        } as unknown as MagmaWalkthroughStep;

        spyOn(component, 'close' as any);

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        tick();

        expect(component['close']).toHaveBeenCalled();
    }));

    it('should call changeStep() if backdropAction is "next" and nextStep is defined', fakeAsync(() => {
        component['portal'] = {
            backdropAction: () => 'next',
            nextStep: () => 'second',
            group: () => 'test',
        } as unknown as MagmaWalkthroughStep;

        spyOn(component, 'changeStep' as any);

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        tick();

        expect(component['changeStep']).toHaveBeenCalledWith('second', 'test');
    }));

    it('should call content.instance.clone.click() if backdropAction is "clickElement" and clickElementActive or \
clickElementOrigin is true', fakeAsync(() => {
        component['portal'] = {
            backdropAction: () => 'clickElement',
            clickElementActive: () => true,
            clickElementOrigin: () => false,
        } as unknown as MagmaWalkthroughStep;

        component['content'] = {
            instance: { clone: { click: jasmine.createSpy('click') } },
        } as unknown as ComponentRef<MagmaWalkthroughContent>;

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        tick();

        expect((component as any)['content'].instance.clone.click).toHaveBeenCalled();
    }));

    it('should call content.instance.clone.click() if backdropAction is "clickElement" and clickElementActive or \
clickElementOrigin is true', fakeAsync(() => {
        component['portal'] = {
            backdropAction: () => 'clickElement',
            clickElementActive: () => false,
            clickElementOrigin: () => true,
        } as unknown as MagmaWalkthroughStep;

        component['content'] = {
            instance: { clone: { click: jasmine.createSpy('click') } },
        } as unknown as ComponentRef<MagmaWalkthroughContent>;

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        tick();

        expect((component as any)['content'].instance.clone.click).toHaveBeenCalled();
    }));

    it('should do nothing if backdropAction is not defined or does not match any case', fakeAsync(() => {
        component['portal'] = { backdropAction: () => undefined } as unknown as MagmaWalkthroughStep;

        spyOn(component, 'close' as any);
        spyOn(component, 'changeStep' as any);

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        tick();

        expect(component['close']).not.toHaveBeenCalled();
        expect(component['changeStep']).not.toHaveBeenCalled();
    }));
});
