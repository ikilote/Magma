import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { MagmaWalkthroughContent } from './walkthrough-content.component';
import { MagmaWalkthroughStep } from './walkthrough-step.directive';
import { MagmaWalkthrough } from './walkthrough.component';

class MockOverlayRef {
    backdropClick = () => of({});
    dispose = vi.fn();
    updatePosition = vi.fn();
    getConfig = () => ({ positionStrategy: new MockFlexibleConnectedPositionStrategy() });
    attach = vi.fn().mockReturnValue(new MockComponentRef());
}

class MockFlexibleConnectedPositionStrategy {
    setOrigin = vi.fn();
    apply = vi.fn();
    reapplyLastPosition = vi.fn();
    positionChanges = of({});
}

class MockComponentRef {
    instance = { clone: { click: vi.fn() } };
    setInput = vi.fn();
}

class MockOverlay {
    create = vi.fn().mockReturnValue(new MockOverlayRef());
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

    it('should start walkthrough and create overlay', async () => {
        const mockElement = document.querySelector('.target');
        vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);
        vi.spyOn(mockElement as any, 'scrollIntoView');

        component.start({ group: 'test' });

        await vi.runAllTicks();

        expect(overlay.create).toHaveBeenCalled();
        expect((mockElement as any).scrollIntoView).toHaveBeenCalledWith({
            behavior: 'instant',
            block: 'center',
            inline: 'center',
        });
        expect((component as any).overlayRef.attach).toHaveBeenCalledWith(expect.any(ComponentPortal));
    });

    it('should handle backdrop click actions', async () => {
        const mockElement = document.querySelector('.target');
        vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);
        component.start({ group: 'test' });
        await vi.runAllTicks();

        component['portal'] = {
            backdropAction: () => 'close',
            nextStep: () => 'second',
        } as unknown as MagmaWalkthroughStep;

        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            component.close();
        });

        expect(component['content']).toBeUndefined();
        expect(component['overlayRef']).toBeUndefined();
    });

    it('should change step and update overlay', async () => {
        const mockElement = document.querySelector('.target');
        const mockElement2 = document.querySelector('.target2');
        vi.spyOn(document, 'querySelector').mockImplementation((selector: string) =>
            selector === '.target' ? mockElement : mockElement2,
        );

        component.start({ group: 'test' });
        await vi.runAllTicks();

        component.changeStep('second', 'test');
        await vi.runAllTicks();

        expect((component as any)['positionStrategy'].setOrigin).toHaveBeenCalledWith(mockElement2);
        expect((component as any)['content'].setInput).toHaveBeenCalledWith('portal', expect.any(Object));
        expect((component as any)['content'].setInput).toHaveBeenCalledWith('element', mockElement2);
    });

    it('should change step (close) and update overlay', async () => {
        const mockElement = document.querySelector('.target');
        const mockElement2 = document.querySelector('.target2');
        vi.spyOn(document, 'querySelector').mockImplementation((selector: string) =>
            selector === '.target' ? mockElement : mockElement2,
        );

        component.start({ group: 'test' });
        await vi.runAllTicks();

        component.changeStep();
        await vi.runAllTicks();

        expect(component['content']).toBeUndefined();
        expect(component['overlayRef']).toBeUndefined();
    });

    it('should close overlay and clean references', async () => {
        const mockElement = document.querySelector('.target');
        vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);

        component.start({ group: 'test' });
        await vi.runAllTicks();

        component.close();

        expect(component['content']).toBeUndefined();
        expect(component['overlayRef']).toBeUndefined();
    });

    it('should not start if target element is not found', async () => {
        vi.spyOn(document, 'querySelector').mockReturnValue(null);
        component.start({ group: 'test' });
        await vi.runAllTicks();
        expect(overlay.create).not.toHaveBeenCalled();
    });

    it('should call close() if backdropAction is "close"', async () => {
        component['portal'] = {
            backdropAction: () => 'close',
            nextStep: () => 'second',
            group: () => 'test',
        } as unknown as MagmaWalkthroughStep;

        vi.spyOn(component, 'close' as any);

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        await vi.runAllTicks();

        expect(component['close']).toHaveBeenCalled();
    });

    it('should call changeStep() if backdropAction is "next" and nextStep is defined', async () => {
        component['portal'] = {
            backdropAction: () => 'next',
            nextStep: () => 'second',
            group: () => 'test',
        } as unknown as MagmaWalkthroughStep;

        vi.spyOn(component, 'changeStep' as any);

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        await vi.runAllTicks();

        expect(component['changeStep']).toHaveBeenCalledWith('second', 'test');
    });

    it('should call content.instance.clone.click() if backdropAction is "clickElement" and clickElementActive or \
clickElementOrigin is true', async () => {
        component['portal'] = {
            backdropAction: () => 'clickElement',
            clickElementActive: () => true,
            clickElementOrigin: () => false,
        } as unknown as MagmaWalkthroughStep;

        component['content'] = {
            instance: { clone: { click: vi.fn() } },
        } as unknown as ComponentRef<MagmaWalkthroughContent>;

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        await vi.runAllTicks();

        expect((component as any)['content'].instance.clone.click).toHaveBeenCalled();
    });

    it('should call content.instance.clone.click() if backdropAction is "clickElement" and clickElementActive or \
clickElementOrigin is true', async () => {
        component['portal'] = {
            backdropAction: () => 'clickElement',
            clickElementActive: () => false,
            clickElementOrigin: () => true,
        } as unknown as MagmaWalkthroughStep;

        component['content'] = {
            instance: { clone: { click: vi.fn() } },
        } as unknown as ComponentRef<MagmaWalkthroughContent>;

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        await vi.runAllTicks();

        expect((component as any)['content'].instance.clone.click).toHaveBeenCalled();
    });

    it('should do nothing if backdropAction is not defined or does not match any case', async () => {
        component['portal'] = { backdropAction: () => undefined } as unknown as MagmaWalkthroughStep;

        vi.spyOn(component, 'close' as any);
        vi.spyOn(component, 'changeStep' as any);

        (component as any)['overlayRef'] = new MockOverlayRef();
        (component as any)['overlayRef'].backdropClick().subscribe(() => {
            (component as any).backdropAction();
        });

        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));

        await vi.runAllTicks();

        expect(component['close']).not.toHaveBeenCalled();
        expect(component['changeStep']).not.toHaveBeenCalled();
    });
});
