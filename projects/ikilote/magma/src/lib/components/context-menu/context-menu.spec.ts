import { Overlay } from '@angular/cdk/overlay';
import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContextMenuData, ContextMenuMode } from './context-menu.component';
import { AbstractContextMenuComponent, MagmaContextMenu } from './context-menu.directive';

@Component({
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
    imports: [MagmaContextMenu],
})
class TestHostComponent {
    menuData = {
        contextMenu: [
            { icon: 'edit', label: 'Edit', action: (data: string) => {} },
            { iconText: 'D', label: 'Delete', action: (data: string) => {} },
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
        fixture.detectChanges();

        event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
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
        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));
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
});
