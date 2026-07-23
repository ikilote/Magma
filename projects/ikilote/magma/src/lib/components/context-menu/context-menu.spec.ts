import { Overlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContextMenuData, ContextMenuMode } from './context-menu.component';
import { AbstractContextMenuComponent, MagmaContextMenu } from './context-menu.directive';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<div>
        Mock Component <span>{{ customInput() }}</span>
    </div>`,
})
class MockComponent extends AbstractContextMenuComponent {
    customInput = input();
}

@Component({
    template: `
        <div [contextMenu]="menuData" [contextMenuMode]="mode" [contextMenuDisabled]="disabled">Right-click here</div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaContextMenu],
})
class TestHostComponent {
    menuData = {
        contextMenu: [
            { icon: 'edit', label: 'Edit', action: (data: string) => {} },
            { iconText: 'D', label: 'Delete', action: (data: string) => {} },
            { icon: 'close', label: () => 'Close', action: (data: string) => {} },
            { icon: 'E', label: null, action: (data: string) => {} },
            { component: MockComponent, inputs: { customInput: 'test' } },
        ],
        data: 'test-data',
    } as ContextMenuData<any>;
    mode: ContextMenuMode = 'default';
    disabled = false;
}

describe('MagmaContextMenu Integration', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let overlay: Overlay;
    let directiveElement: DebugElement;
    let event: MouseEvent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        directiveElement = fixture.debugElement.query(By.directive(MagmaContextMenu));
        overlay = TestBed.inject(Overlay);
        fixture.changeDetectorRef.detectChanges();

        event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
    });

    afterEach(() => {
        // Clean up overlay if it exists
        if (MagmaContextMenu._overlayRef) {
            MagmaContextMenu._overlayRef.dispose();
            MagmaContextMenu._overlayRef = undefined;
        }
        fixture?.destroy();
    });

    it('should open context menu on right-click', async () => {
        vi.spyOn(event, 'preventDefault');
        vi.spyOn(event, 'stopPropagation');
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(MagmaContextMenu._overlayRef).toBeDefined();
    });

    it('should open context menu on right-click', async () => {
        vi.spyOn(event, 'preventDefault');
        vi.spyOn(event, 'stopPropagation');
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(MagmaContextMenu._overlayRef).toBeDefined();
    });

    it('should close context menu on backdrop click', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        document
            .querySelector('.cdk-overlay-backdrop')
            ?.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
        await fixture.whenStable();
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
    });

    it('should not open context menu if disabled', async () => {
        fixture.componentInstance.disabled = true;
        fixture.changeDetectorRef.detectChanges();

        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        expect(document.querySelector('.cdk-overlay-backdrop')).toBeNull();
    });

    it('should close context menu on window contextmenu event', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        const windowEvent = new MouseEvent('contextmenu', { button: 2, clientX: 200, clientY: 200 });
        vi.spyOn(windowEvent, 'preventDefault');
        vi.spyOn(windowEvent, 'stopPropagation');
        window.dispatchEvent(windowEvent);
        await fixture.whenStable();
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
        expect(windowEvent.preventDefault).toHaveBeenCalled();
        expect(windowEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should close context menu on auxclick event', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        const auxEvent = new MouseEvent('auxclick', { button: 1, clientX: 200, clientY: 200 });
        vi.spyOn(auxEvent, 'preventDefault');
        vi.spyOn(auxEvent, 'stopPropagation');
        window.dispatchEvent(auxEvent);
        await fixture.whenStable();
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
        expect(auxEvent.preventDefault).toHaveBeenCalled();
        expect(auxEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should call action when menu item is clicked', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        const actionSpy = vi.spyOn(directiveElement.componentInstance.menuData.contextMenu[0], 'action');
        document.querySelector('context-menu ul li:first-child')?.dispatchEvent(new Event('click'));
        await fixture.whenStable();
        expect(actionSpy).toHaveBeenCalledWith('test-data');
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
    });

    it('should call onContextMenuContext when middle click on context-menu component', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        const auxEvent = new MouseEvent('auxclick', { button: 2, clientX: 200, clientY: 200 });
        vi.spyOn(auxEvent, 'preventDefault');
        vi.spyOn(auxEvent, 'stopPropagation');
        document.querySelector('context-menu')?.dispatchEvent(auxEvent);
        await fixture.whenStable();
        expect(auxEvent.preventDefault).toHaveBeenCalled();
        expect(auxEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should call onContextMenuContext when contextmenu event on context-menu component', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        const auxEvent = new MouseEvent('contextmenu', { button: 2, clientX: 200, clientY: 200 });
        vi.spyOn(auxEvent, 'preventDefault');
        vi.spyOn(auxEvent, 'stopPropagation');
        document.querySelector('context-menu')?.dispatchEvent(auxEvent);
        await fixture.whenStable();
        expect(auxEvent.preventDefault).toHaveBeenCalled();
        expect(auxEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should call open on context-menu component', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();
        const auxEvent = new MouseEvent('auxclick', { button: 2, clientX: 200, clientY: 200 });
        vi.spyOn(auxEvent, 'preventDefault');
        vi.spyOn(auxEvent, 'stopPropagation');

        const directive = directiveElement.injector.get(MagmaContextMenu);
        expect(directive.open(auxEvent)).toBe(true);

        document.querySelector('context-menu')?.dispatchEvent(auxEvent);
        await fixture.whenStable();
        expect(auxEvent.preventDefault).toHaveBeenCalled();
        expect(auxEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should call open and empty context on context-menu component', async () => {
        await fixture.whenStable();
        const auxEvent = new MouseEvent('auxclick', { button: 2, clientX: 200, clientY: 200 });
        vi.spyOn(auxEvent, 'preventDefault');
        vi.spyOn(auxEvent, 'stopPropagation');

        const directive = directiveElement.injector.get(MagmaContextMenu);
        expect(directive.open(auxEvent, { contextMenu: [], data: undefined })).toBe(false);

        document.querySelector('context-menu')?.dispatchEvent(auxEvent);
        await fixture.whenStable();
        expect(auxEvent.preventDefault).toHaveBeenCalled();
        expect(auxEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should not close on window contextmenu when _overlayRef is undefined ', async () => {
        // Ensure no overlay is open
        expect(MagmaContextMenu._overlayRef).toBeUndefined();

        const windowEvent = new MouseEvent('contextmenu', { button: 2, clientX: 200, clientY: 200 });
        const directive = directiveElement.injector.get(MagmaContextMenu);
        const closeSpy = vi.spyOn(directive, 'close');

        window.dispatchEvent(windowEvent);
        await fixture.whenStable();

        // close should not be called because _overlayRef is undefined
        expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should not close on auxclick when button is not 1', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();

        // Dispatch auxclick with button 0 (left button)
        const auxEvent = new MouseEvent('auxclick', { button: 0, clientX: 200, clientY: 200 });
        const directive = directiveElement.injector.get(MagmaContextMenu);
        const closeSpy = vi.spyOn(directive, 'close');

        window.dispatchEvent(auxEvent);
        await fixture.whenStable();

        // close should not be called because button !== 1
        expect(closeSpy).not.toHaveBeenCalled();
        // Overlay should still be open
        expect(MagmaContextMenu._overlayRef).toBeDefined();
    });

    it('should not close on auxclick when _overlayRef is undefined ', async () => {
        // Ensure no overlay is open
        expect(MagmaContextMenu._overlayRef).toBeUndefined();

        const auxEvent = new MouseEvent('auxclick', { button: 1, clientX: 200, clientY: 200 });
        const directive = directiveElement.injector.get(MagmaContextMenu);
        const closeSpy = vi.spyOn(directive, 'close');

        window.dispatchEvent(auxEvent);
        await fixture.whenStable();

        // close should not be called because _overlayRef is undefined
        expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should close without event parameter', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();

        const directive = directiveElement.injector.get(MagmaContextMenu);

        // Call close without event parameter
        expect(() => directive.close()).not.toThrow();
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
    });

    it('should close without event parameter and empty overlayRef', async () => {
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
        const directive = directiveElement.injector.get(MagmaContextMenu);

        // Call close without event parameter
        expect(() => directive.close()).not.toThrow();
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
    });

    it('should redispatch click to element beneath backdrop on backdrop click', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();

        // Spy on document.elementFromPoint and dispatchEvent
        const fakeElement = document.createElement('button');
        const dispatchSpy = vi.spyOn(fakeElement, 'dispatchEvent');
        vi.spyOn(document, 'elementFromPoint').mockReturnValue(fakeElement);

        const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
        expect(backdrop).not.toBeNull();

        backdrop.dispatchEvent(new MouseEvent('click', { clientX: 150, clientY: 150, bubbles: true }));
        await fixture.whenStable();

        // Overlay should be closed
        expect(MagmaContextMenu._overlayRef).toBeUndefined();

        // Click should have been redispatched to the element below
        expect(document.elementFromPoint).toHaveBeenCalledWith(150, 150);
        expect(dispatchSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'click',
                clientX: 150,
                clientY: 150,
                bubbles: true,
                cancelable: true,
            }),
        );
    });

    it('should redispatch contextmenu to element beneath backdrop on right-click', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();

        const fakeElement = document.createElement('div');
        const dispatchSpy = vi.spyOn(fakeElement, 'dispatchEvent');
        vi.spyOn(document, 'elementFromPoint').mockReturnValue(fakeElement);

        const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
        expect(backdrop).not.toBeNull();

        backdrop.dispatchEvent(new MouseEvent('click', { clientX: 200, clientY: 200, button: 2, bubbles: true }));
        await fixture.whenStable();

        // Overlay should be closed
        expect(MagmaContextMenu._overlayRef).toBeUndefined();

        // Contextmenu event should have been redispatched (not click)
        expect(document.elementFromPoint).toHaveBeenCalledWith(200, 200);
        expect(dispatchSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'contextmenu',
                clientX: 200,
                clientY: 200,
                button: 2,
                bubbles: true,
                cancelable: true,
            }),
        );
    });

    it('should trigger item action on right-click (contextmenu event)', async () => {
        directiveElement.triggerEventHandler('contextmenu', event);
        await fixture.whenStable();

        const actionSpy = vi.spyOn(fixture.componentInstance.menuData.contextMenu[0] as any, 'action');

        const menuItem = document.querySelector('context-menu ul li:first-child') as HTMLElement;
        expect(menuItem).not.toBeNull();

        const contextMenuEvent = new MouseEvent('contextmenu', {
            button: 2,
            clientX: 100,
            clientY: 100,
            bubbles: true,
        });
        vi.spyOn(contextMenuEvent, 'preventDefault');
        vi.spyOn(contextMenuEvent, 'stopPropagation');

        menuItem.dispatchEvent(contextMenuEvent);
        await fixture.whenStable();

        // Action should have been called with the data
        expect(actionSpy).toHaveBeenCalledWith('test-data');
        // Context menu should be closed
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
        // Event should be prevented (no native context menu)
        expect(contextMenuEvent.preventDefault).toHaveBeenCalled();
        expect(contextMenuEvent.stopPropagation).toHaveBeenCalled();
    });
});
