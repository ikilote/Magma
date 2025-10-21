import { Overlay } from '@angular/cdk/overlay';
import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        directiveElement = fixture.debugElement.query(By.directive(MagmaContextMenu));
        overlay = TestBed.inject(Overlay);
        fixture.detectChanges();
    });

    it('should open context menu on right-click', fakeAsync(() => {
        const event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');
        directiveElement.triggerEventHandler('contextmenu', event);
        tick();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(MagmaContextMenu._overlayRef).toBeDefined();
    }));

    it('should open context menu on right-click', fakeAsync(() => {
        const event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');
        directiveElement.triggerEventHandler('contextmenu', event);
        tick();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(MagmaContextMenu._overlayRef).toBeDefined();
    }));

    it('should close context menu on backdrop click', fakeAsync(() => {
        const event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
        directiveElement.triggerEventHandler('contextmenu', event);
        tick();
        document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(new Event('click'));
        tick();
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
    }));

    it('should not open context menu if disabled', fakeAsync(() => {
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();
        const event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
        directiveElement.triggerEventHandler('contextmenu', event);
        tick();
        expect(document.querySelector('.cdk-overlay-backdrop')).toBeNull();
    }));

    it('should close context menu on window contextmenu event', fakeAsync(() => {
        const event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
        directiveElement.triggerEventHandler('contextmenu', event);
        tick();
        const windowEvent = new MouseEvent('contextmenu', { button: 2, clientX: 200, clientY: 200 });
        spyOn(windowEvent, 'preventDefault');
        spyOn(windowEvent, 'stopPropagation');
        window.dispatchEvent(windowEvent);
        tick();
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
        expect(windowEvent.preventDefault).toHaveBeenCalled();
        expect(windowEvent.stopPropagation).toHaveBeenCalled();
    }));

    it('should close context menu on auxclick event', fakeAsync(() => {
        const event = new MouseEvent('contextmenu', { button: 2, clientX: 100, clientY: 100 });
        directiveElement.triggerEventHandler('contextmenu', event);
        tick();
        const auxEvent = new MouseEvent('auxclick', { button: 1, clientX: 200, clientY: 200 });
        spyOn(auxEvent, 'preventDefault');
        spyOn(auxEvent, 'stopPropagation');
        window.dispatchEvent(auxEvent);
        tick();
        expect(MagmaContextMenu._overlayRef).toBeUndefined();
        expect(auxEvent.preventDefault).toHaveBeenCalled();
        expect(auxEvent.stopPropagation).toHaveBeenCalled();
    }));
});
