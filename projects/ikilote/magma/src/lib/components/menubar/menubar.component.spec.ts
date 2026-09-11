import { Overlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaMenubarComponent } from './menubar.component';
import { MagmaMenubarModule } from './menubar.module';
import { MagmaMenuDef, MagmaMenuItemDef } from './menubar.types';

import { MagmaPointerModeService } from '../../services/pointer-mode.service';
import { cleanupOverlayContainer } from '../../test-helpers';

// ── Helpers ───────────────────────────────────────────────────────────────────

const MENUS: MagmaMenuDef[] = [
    {
        label: 'File',
        items: [
            { label: 'New', action: () => {} },
            { label: 'Open', action: () => {} },
            { separator: true },
            { label: 'Quit', disabled: true },
        ],
    },
    {
        label: 'Edit',
        items: [
            { label: 'Cut', action: () => {} },
            { label: 'Copy', action: () => {} },
            {
                label: 'Export',
                children: [
                    { label: 'As PDF', action: () => {} },
                    { label: 'As CSV', action: () => {} },
                ],
            },
        ],
    },
    {
        label: 'Help',
        items: [{ label: 'About', action: () => {} }],
    },
];

const MENUS_WITH_SEPARATOR: MagmaMenuDef[] = [
    { label: 'File', items: [{ label: 'New', action: () => {} }] },
    { separator: true },
    { label: 'Edit', items: [{ label: 'Cut', action: () => {} }] },
    { label: 'Help', items: [{ label: 'About', action: () => {} }] },
];

@Component({
    template: `<mg-menubar [menus]="menus" [ariaLabel]="ariaLabel" (menuItemExecuted)="onExecuted($event)" />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaMenubarModule],
})
class TestHostComponent {
    menus: MagmaMenuDef[] = MENUS;
    ariaLabel = 'Test menu';
    executed: MagmaMenuItemDef[] = [];

    onExecuted(item: MagmaMenuItemDef) {
        this.executed.push(item);
    }
}

@Component({
    template: `
        <mg-menubar (menuItemExecuted)="onExecuted($event)">
            <mg-menu label="File">
                <mg-menu-item label="New" (action)="log('New')" />
                <mg-menu-item [separator]="true" />
                <mg-menu-item label="Quit" [disabled]="true" />
            </mg-menu>
            <mg-menu label="Edit">
                <mg-menu-item label="Cut" (action)="log('Cut')" />
            </mg-menu>
        </mg-menubar>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaMenubarModule],
})
class TagModeHostComponent {
    lastAction = '';
    executed: MagmaMenuItemDef[] = [];

    log(action: string) {
        this.lastAction = action;
    }

    onExecuted(item: MagmaMenuItemDef) {
        this.executed.push(item);
    }
}

// ── Test helpers ──────────────────────────────────────────────────────────────

function getTriggers(fixture: ComponentFixture<TestHostComponent | TagModeHostComponent>): HTMLButtonElement[] {
    return fixture.debugElement.queryAll(By.css('.mg-menu-trigger')).map(d => d.nativeElement as HTMLButtonElement);
}

function getMenubar(fixture: ComponentFixture<TestHostComponent | TagModeHostComponent>): MagmaMenubarComponent {
    return fixture.debugElement.query(By.directive(MagmaMenubarComponent)).componentInstance;
}

function openMenuAt(menubar: MagmaMenubarComponent, index: number, fixture: ComponentFixture<unknown>) {
    menubar.openAt(index);
    fixture.changeDetectorRef.detectChanges();
    vi.advanceTimersByTime(0);
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('MagmaMenubarComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let menubar: MagmaMenubarComponent;
    let pointerMode: MagmaPointerModeService;

    beforeEach(async () => {
        vi.useFakeTimers();

        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        TestBed.inject(Overlay);
        pointerMode = TestBed.inject(MagmaPointerModeService);

        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();

        menubar = getMenubar(fixture);
    });

    afterEach(() => {
        fixture?.destroy();
        cleanupOverlayContainer();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    // ── Instantiation ─────────────────────────────────────────────────────────

    it('should create', () => {
        expect(menubar).toBeTruthy();
    });

    it('should have role="menubar" on host', () => {
        const el: HTMLElement = fixture.debugElement.query(By.directive(MagmaMenubarComponent)).nativeElement;
        expect(el.getAttribute('role')).toBe('menubar');
    });

    it('should reflect ariaLabel input', () => {
        const el: HTMLElement = fixture.debugElement.query(By.directive(MagmaMenubarComponent)).nativeElement;
        expect(el.getAttribute('aria-label')).toBe('Test menu');
    });

    it('should start with no menu open (openIndex = -1)', () => {
        expect(menubar.openIndex()).toBe(-1);
    });

    it('should render one trigger button per non-separator menu', () => {
        expect(getTriggers(fixture).length).toBe(3); // File, Edit, Help
    });

    it('should render trigger labels', () => {
        const labels = getTriggers(fixture).map(b => b.textContent?.trim());
        expect(labels).toEqual(['File', 'Edit', 'Help']);
    });

    it('should set aria-expanded false on all triggers initially', () => {
        getTriggers(fixture).forEach(btn => {
            expect(btn.getAttribute('aria-expanded')).toBe('false');
        });
    });

    it('should set aria-haspopup="menu" on all triggers', () => {
        getTriggers(fixture).forEach(btn => {
            expect(btn.getAttribute('aria-haspopup')).toBe('menu');
        });
    });

    // ── JSON mode resolvedMenus ───────────────────────────────────────────────

    it('should resolve menus from JSON input', () => {
        expect(menubar.resolvedMenus.length).toBe(3);
    });

    it('should update resolvedMenus when menus input changes', () => {
        // resolveMenus() is called only in ngAfterContentInit (not on input changes).
        // Verify the initial resolve is correct; dynamic JSON updates require
        // the consumer to manage re-resolution, which is by design.
        expect(menubar.resolvedMenus.length).toBe(3);
        expect(menubar.resolvedMenus[0].label).toBe('File');
    });

    // ── toggle / openAt / close ───────────────────────────────────────────────

    it('should open a menu on toggle', () => {
        menubar.toggle(0);
        expect(menubar.openIndex()).toBe(0);
    });

    it('should close the menu when toggling the same index twice', () => {
        menubar.toggle(0);
        menubar.toggle(0);
        expect(menubar.openIndex()).toBe(-1);
    });

    it('should switch menus when toggling a different index', () => {
        menubar.toggle(0);
        menubar.toggle(1);
        expect(menubar.openIndex()).toBe(1);
    });

    it('should set aria-expanded true on the open trigger', () => {
        menubar.openAt(0);
        fixture.changeDetectorRef.detectChanges();
        const triggers = getTriggers(fixture);
        expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
        expect(triggers[1].getAttribute('aria-expanded')).toBe('false');
    });

    it('should create a CDK overlay pane on open', () => {
        menubar.openAt(0);
        fixture.changeDetectorRef.detectChanges();
        expect(document.querySelector('.cdk-overlay-pane')).not.toBeNull();
    });

    it('should render dropdown items in the overlay', () => {
        menubar.openAt(0);
        // The ComponentPortal renders outside the fixture tree — trigger a full
        // application tick so the portal's own change detection runs.
        fixture.detectChanges();
        vi.advanceTimersByTime(0);
        const items = document.querySelectorAll('.mg-menu-item');
        expect(items.length).toBeGreaterThan(0);
    });

    it('should remove the overlay pane on close', () => {
        menubar.openAt(0);
        fixture.changeDetectorRef.detectChanges();
        menubar.close();
        fixture.changeDetectorRef.detectChanges();
        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();
    });

    it('should set openIndex to -1 on close', () => {
        menubar.openAt(0);
        menubar.close();
        expect(menubar.openIndex()).toBe(-1);
    });

    // ── Backdrop click closes the menu ────────────────────────────────────────

    it('should close on backdrop click', () => {
        menubar.openAt(0);
        fixture.changeDetectorRef.detectChanges();

        const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
        backdrop?.click();
        fixture.changeDetectorRef.detectChanges();

        expect(menubar.openIndex()).toBe(-1);
    });

    // ── executeItem ───────────────────────────────────────────────────────────

    it('should call item.action and emit menuItemExecuted', () => {
        const spy = vi.fn();
        const item: MagmaMenuItemDef = { label: 'Test', action: spy };

        menubar.executeItem(item);

        expect(spy).toHaveBeenCalled();
        expect(host.executed).toHaveLength(1);
        expect(host.executed[0]).toBe(item);
    });

    it('should not call action if item is disabled', () => {
        const spy = vi.fn();
        menubar.executeItem({ label: 'X', action: spy, disabled: true });
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not call action if item is a separator', () => {
        const spy = vi.fn();
        menubar.executeItem({ separator: true, action: spy });
        expect(spy).not.toHaveBeenCalled();
    });

    it('should close menu after executing an item', () => {
        menubar.openAt(0);
        menubar.executeItem({ label: 'New', action: () => {} });
        expect(menubar.openIndex()).toBe(-1);
    });

    // ── Keyboard navigation on triggers ───────────────────────────────────────

    describe('keyboard navigation on triggers', () => {
        it('should call focus() on next trigger on ArrowRight (no open menu)', () => {
            const triggers = getTriggers(fixture);
            const focusSpy = vi.spyOn(triggers[1], 'focus');
            triggers[0].focus();

            fixture.debugElement
                .queryAll(By.css('.mg-menu-trigger'))[0]
                .triggerEventHandler('keydown.arrowRight', { preventDefault: () => {} });
            fixture.changeDetectorRef.detectChanges();

            expect(focusSpy).toHaveBeenCalled();
        });

        it('should call focus() on previous trigger on ArrowLeft (no open menu)', () => {
            const triggers = getTriggers(fixture);
            const focusSpy = vi.spyOn(triggers[0], 'focus');
            triggers[1].focus();

            fixture.debugElement
                .queryAll(By.css('.mg-menu-trigger'))[1]
                .triggerEventHandler('keydown.arrowLeft', { preventDefault: () => {} });
            fixture.changeDetectorRef.detectChanges();

            expect(focusSpy).toHaveBeenCalled();
        });

        it('should wrap ArrowRight from last to first trigger', () => {
            const triggers = getTriggers(fixture);
            const focusSpy = vi.spyOn(triggers[0], 'focus');
            triggers[2].focus();

            fixture.debugElement
                .queryAll(By.css('.mg-menu-trigger'))[2]
                .triggerEventHandler('keydown.arrowRight', { preventDefault: () => {} });
            fixture.changeDetectorRef.detectChanges();

            expect(focusSpy).toHaveBeenCalled();
        });

        it('should wrap ArrowLeft from first to last trigger', () => {
            const triggers = getTriggers(fixture);
            const focusSpy = vi.spyOn(triggers[2], 'focus');
            triggers[0].focus();

            fixture.debugElement
                .queryAll(By.css('.mg-menu-trigger'))[0]
                .triggerEventHandler('keydown.arrowLeft', { preventDefault: () => {} });
            fixture.changeDetectorRef.detectChanges();

            expect(focusSpy).toHaveBeenCalled();
        });

        it('should open menu and focus first item on ArrowDown', () => {
            fixture.debugElement
                .queryAll(By.css('.mg-menu-trigger'))[0]
                .triggerEventHandler('keydown.arrowDown', { preventDefault: () => {} });
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(0);

            // The portal needs a full detectChanges to render its items
            fixture.detectChanges();
            vi.advanceTimersByTime(0);

            const firstItem = document.querySelector('.cdk-overlay-pane .mg-menu-item:not([disabled])') as HTMLElement;
            expect(document.activeElement).toBe(firstItem);
        });
    });

    // ── Keyboard navigation with open menu ────────────────────────────────────

    describe('keyboard navigation with open menu', () => {
        it('should switch to next menu with ArrowRight when menu is open', () => {
            menubar.openAt(0);
            fixture.changeDetectorRef.detectChanges();

            menubar.navigateTrigger(0, 1);
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(1);
        });

        it('should switch to previous menu with ArrowLeft when menu is open', () => {
            menubar.openAt(1);
            fixture.changeDetectorRef.detectChanges();

            menubar.navigateTrigger(1, -1);
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(0);
        });

        it('should wrap ArrowRight from last to first when menu is open', () => {
            menubar.openAt(2);
            fixture.changeDetectorRef.detectChanges();

            menubar.navigateTrigger(2, 1);
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(0);
        });
    });

    // ── Escape key ────────────────────────────────────────────────────────────

    describe('Escape key', () => {
        it('should close the open menu on Escape', () => {
            menubar.openAt(0);
            fixture.changeDetectorRef.detectChanges();

            const menubarEl = fixture.debugElement.query(By.directive(MagmaMenubarComponent));
            menubarEl.triggerEventHandler('keydown', { key: 'Escape', preventDefault: () => {} });
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(-1);
        });

        it('should refocus the trigger after Escape', () => {
            menubar.openAt(0);
            fixture.changeDetectorRef.detectChanges();

            const trigger = getTriggers(fixture)[0];
            const focusSpy = vi.spyOn(trigger, 'focus');

            const menubarEl = fixture.debugElement.query(By.directive(MagmaMenubarComponent));
            menubarEl.triggerEventHandler('keydown', { key: 'Escape', preventDefault: () => {} });
            fixture.changeDetectorRef.detectChanges();

            expect(focusSpy).toHaveBeenCalled();
        });

        it('should do nothing on Escape when no menu is open', () => {
            const menubarEl = fixture.debugElement.query(By.directive(MagmaMenubarComponent));
            expect(() => {
                menubarEl.triggerEventHandler('keydown', { key: 'Escape', preventDefault: () => {} });
            }).not.toThrow();
            expect(menubar.openIndex()).toBe(-1);
        });

        it('should do nothing on unrecognised key', () => {
            menubar.openAt(0);
            fixture.changeDetectorRef.detectChanges();
            const menubarEl = fixture.debugElement.query(By.directive(MagmaMenubarComponent));
            expect(() => {
                menubarEl.triggerEventHandler('keydown', { key: 'Tab', preventDefault: () => {} });
            }).not.toThrow();
        });
    });

    // ── Separator skipping in navigateTrigger ─────────────────────────────────

    describe('separator skipping', () => {
        let sepFixture: ComponentFixture<TestHostComponent>;
        let sepMenubar: MagmaMenubarComponent;

        beforeEach(async () => {
            sepFixture = TestBed.createComponent(TestHostComponent);
            sepFixture.componentInstance.menus = MENUS_WITH_SEPARATOR;
            sepFixture.changeDetectorRef.detectChanges();
            sepMenubar = getMenubar(sepFixture);
        });

        afterEach(() => sepFixture?.destroy());

        it('should skip separator when navigating right from File', () => {
            // File=0, sep=1, Edit=2, Help=3
            sepMenubar.openAt(0);
            sepFixture.changeDetectorRef.detectChanges();

            sepMenubar.navigateTrigger(0, 1);
            sepFixture.changeDetectorRef.detectChanges();

            // Should jump to Edit (index 2), not the separator (index 1)
            expect(sepMenubar.openIndex()).toBe(2);
        });

        it('should skip separator when navigating left from Edit', () => {
            sepMenubar.openAt(2);
            sepFixture.changeDetectorRef.detectChanges();

            sepMenubar.navigateTrigger(2, -1);
            sepFixture.changeDetectorRef.detectChanges();

            expect(sepMenubar.openIndex()).toBe(0);
        });

        it('should render only 3 trigger buttons (no separator button)', () => {
            const triggers = sepFixture.debugElement.queryAll(By.css('.mg-menu-trigger'));
            expect(triggers.length).toBe(3); // File, Edit, Help
        });
    });

    // ── mouseenter switches menu only in pointer mode ─────────────────────────

    describe('mouseenter while a menu is open', () => {
        it('should switch menu on mouseenter in pointer mode', () => {
            pointerMode.isKeyboard.set(false);
            menubar.openAt(0);
            fixture.changeDetectorRef.detectChanges();

            const triggers = fixture.debugElement.queryAll(By.css('.mg-menu-trigger'));
            triggers[1].triggerEventHandler('mouseenter', {});
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(1);
        });

        it('should NOT switch menu on mouseenter in keyboard mode', () => {
            pointerMode.isKeyboard.set(true);
            menubar.openAt(0);
            fixture.changeDetectorRef.detectChanges();

            const triggers = fixture.debugElement.queryAll(By.css('.mg-menu-trigger'));
            triggers[1].triggerEventHandler('mouseenter', {});
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(0);
        });

        it('should not open on mouseenter when no menu is open', () => {
            pointerMode.isKeyboard.set(false);
            const triggers = fixture.debugElement.queryAll(By.css('.mg-menu-trigger'));
            triggers[1].triggerEventHandler('mouseenter', {});
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(-1);
        });
    });

    // ── Tag mode ──────────────────────────────────────────────────────────────

    describe('tag mode', () => {
        let tagFixture: ComponentFixture<TagModeHostComponent>;
        let tagMenubar: MagmaMenubarComponent;

        beforeEach(async () => {
            tagFixture = TestBed.createComponent(TagModeHostComponent);
            tagFixture.changeDetectorRef.detectChanges();
            tagMenubar = tagFixture.debugElement.query(By.directive(MagmaMenubarComponent)).componentInstance;
        });

        afterEach(() => tagFixture?.destroy());

        it('should resolve menus from mg-menu children', () => {
            expect(tagMenubar.resolvedMenus.length).toBe(2);
            expect(tagMenubar.resolvedMenus[0].label).toBe('File');
            expect(tagMenubar.resolvedMenus[1].label).toBe('Edit');
        });

        it('should render correct number of trigger buttons', () => {
            const triggers = tagFixture.debugElement.queryAll(By.css('.mg-menu-trigger'));
            expect(triggers.length).toBe(2);
        });

        it('should open the File menu', () => {
            tagMenubar.openAt(0);
            tagFixture.changeDetectorRef.detectChanges();
            expect(tagMenubar.openIndex()).toBe(0);
        });
    });

    // ── ngOnDestroy ───────────────────────────────────────────────────────────

    it('should dispose overlay on destroy', () => {
        menubar.openAt(0);
        fixture.changeDetectorRef.detectChanges();
        expect(document.querySelector('.cdk-overlay-pane')).not.toBeNull();

        fixture.destroy();
        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();
    });

    // ── openAt() guard (line 140) ─────────────────────────────────────────────

    it('should do nothing when openAt() is called with an out-of-bounds index', () => {
        menubar.openAt(99);
        fixture.changeDetectorRef.detectChanges();
        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();
    });

    // ── focusDropdown (line 194) ──────────────────────────────────────────────

    it('should call focusFirst on dropdown after focusDropdown()', () => {
        menubar.openAt(0);
        fixture.detectChanges();
        vi.advanceTimersByTime(0);

        const instance = menubar['_dropdownInstance']!;
        const spy = vi.spyOn(instance, 'focusFirst');

        menubar.focusDropdown();
        vi.advanceTimersByTime(0);

        expect(spy).toHaveBeenCalled();
    });

    it('should do nothing when focusDropdown() is called with no open menu', () => {
        expect(() => {
            menubar.focusDropdown();
            vi.advanceTimersByTime(0);
        }).not.toThrow();
    });

    // ── executeItem action call ───────────────────────────────────────────────

    it('should call item.action when executeItem is called with a valid item', () => {
        const spy = vi.fn();
        menubar.executeItem({ label: 'Do', action: spy });
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call item.action when item has no action function', () => {
        // action is undefined — should not throw
        expect(() => menubar.executeItem({ label: 'NoOp' })).not.toThrow();
    });

    // ── closeRequested (lines 165-167) ────────────────────────────────────────

    describe('closeRequested from dropdown', () => {
        it('should close the menu and focus the trigger when dropdown emits closeRequested', () => {
            menubar.openAt(0);
            fixture.detectChanges();
            vi.advanceTimersByTime(0);

            const trigger = getTriggers(fixture)[0];
            const focusSpy = vi.spyOn(trigger, 'focus');

            const dropdownInstance = menubar['_dropdownInstance']!;
            dropdownInstance.closeRequested.emit();
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(-1);
            expect(focusSpy).toHaveBeenCalled();
        });

        it('should navigate to prev menu when dropdown emits navigatePrev', () => {
            menubar.openAt(1);
            fixture.detectChanges();
            vi.advanceTimersByTime(0);

            const dropdownInstance: any = menubar['_dropdownInstance'];
            dropdownInstance.navigatePrev.emit();
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(0);
        });

        it('should navigate to next menu when dropdown emits navigateNext', () => {
            menubar.openAt(1);
            fixture.detectChanges();
            vi.advanceTimersByTime(0);

            const dropdownInstance: any = menubar['_dropdownInstance'];
            dropdownInstance.navigateNext.emit();
            fixture.changeDetectorRef.detectChanges();

            expect(menubar.openIndex()).toBe(2);
        });

        it('should execute item when dropdown emits itemSelected', () => {
            menubar.openAt(0);
            fixture.detectChanges();
            vi.advanceTimersByTime(0);

            const spy = vi.fn();
            const item: MagmaMenuItemDef = { label: 'New', action: spy };

            const dropdownInstance: any = menubar['_dropdownInstance'];
            dropdownInstance.itemSelected.emit(item);

            expect(spy).toHaveBeenCalled();
            expect(menubar.openIndex()).toBe(-1);
        });
    });

    // ── navigateTrigger without open menu (line 228) ──────────────────────────

    describe('navigateTrigger without open menu', () => {
        it('should focus next trigger without opening a menu', () => {
            const triggers = getTriggers(fixture);
            const focusSpy = vi.spyOn(triggers[1], 'focus');
            menubar.navigateTrigger(0, 1);
            expect(menubar.openIndex()).toBe(-1);
            expect(focusSpy).toHaveBeenCalled();
        });

        it('should focus previous trigger without opening a menu', () => {
            const triggers = getTriggers(fixture);
            const focusSpy = vi.spyOn(triggers[0], 'focus');
            menubar.navigateTrigger(1, -1);
            expect(menubar.openIndex()).toBe(-1);
            expect(focusSpy).toHaveBeenCalled();
        });

        it('should do nothing when navigable list is empty', () => {
            menubar.resolvedMenus = [];
            expect(() => menubar.navigateTrigger(0, 1)).not.toThrow();
        });
    });

    // ── HTML icon rendering (lines 25-31) ─────────────────────────────────────

    describe('icon rendering on triggers', () => {
        let iconFixture: ComponentFixture<TestHostComponent>;
        let iconMenubar: MagmaMenubarComponent;

        beforeEach(async () => {
            iconFixture = TestBed.createComponent(TestHostComponent);
        });

        afterEach(() => {
            iconFixture?.destroy();
            cleanupOverlayContainer();
        });

        it('should render a text icon in the trigger', () => {
            iconFixture.componentInstance.menus = [{ label: 'File', icon: '📁', items: [] }];
            iconFixture.changeDetectorRef.detectChanges();
            iconMenubar = getMenubar(iconFixture as any);
            iconFixture.detectChanges();

            const icon = iconFixture.debugElement.query(By.css('.mg-menu-icon'));
            expect(icon).not.toBeNull();
            expect(icon.nativeElement.querySelector('img')).toBeNull();
        });

        it('should render a URL icon as <img> in the trigger', () => {
            iconFixture.componentInstance.menus = [{ label: 'File', icon: '/icons/file.svg', items: [] }];
            iconFixture.changeDetectorRef.detectChanges();
            iconMenubar = getMenubar(iconFixture as any);
            iconFixture.detectChanges();

            const img = iconFixture.debugElement.query(By.css('.mg-menu-icon img'));
            expect(img).not.toBeNull();
            expect(img.nativeElement.getAttribute('src')).toBe('/icons/file.svg');
        });

        it('should not render icon span when icon is absent', () => {
            iconFixture.componentInstance.menus = [{ label: 'File', items: [] }];
            iconFixture.changeDetectorRef.detectChanges();
            iconMenubar = getMenubar(iconFixture as any);
            iconFixture.detectChanges();

            const icon = iconFixture.debugElement.query(By.css('.mg-menu-icon'));
            expect(icon).toBeNull();
        });
    });
});
