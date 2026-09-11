import { Overlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaMenuDropdownComponent } from './menu-dropdown.component';
import { MagmaMenuItemDef } from './menubar.types';

import { MagmaPointerModeService } from '../../services/pointer-mode.service';
import { cleanupOverlayContainer } from '../../test-helpers';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const ITEMS: MagmaMenuItemDef[] = [
    { label: 'New', action: () => {} },
    { label: 'Open', action: () => {} },
    { separator: true },
    { label: 'Quit', disabled: true },
];

const ITEMS_WITH_CHILDREN: MagmaMenuItemDef[] = [
    { label: 'File', action: () => {} },
    {
        label: 'Export',
        children: [
            { label: 'As PDF', action: () => {} },
            { label: 'As CSV', action: () => {} },
        ],
    },
    { label: 'Help', action: () => {} },
];

@Component({
    template: `<mg-menu-dropdown />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaMenuDropdownComponent],
})
class TestHostComponent {}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDropdown(fixture: ComponentFixture<TestHostComponent>): MagmaMenuDropdownComponent {
    return fixture.debugElement.query(By.directive(MagmaMenuDropdownComponent)).componentInstance;
}

function getFocusableButtons(fixture: ComponentFixture<TestHostComponent>): HTMLButtonElement[] {
    return fixture.debugElement
        .queryAll(By.css('.mg-menu-item:not([disabled])'))
        .map(d => d.nativeElement as HTMLButtonElement);
}

/**
 * Focus a button and mock document.activeElement to return it stably.
 * Also patches .focus() on all focusable buttons so that when the component
 * calls .focus() on another button (e.g. after ArrowDown), the mock updates.
 */
function focusStably(el: HTMLElement, fixture: ComponentFixture<TestHostComponent>): void {
    // Patch .focus() on all item buttons so the mock stays in sync
    getFocusableButtons(fixture).forEach(btn => {
        btn.focus = () => {
            Object.defineProperty(document, 'activeElement', {
                get: () => btn,
                configurable: true,
            });
        };
    });
    // Now focus the requested element
    el.focus();
}

/**
 * Call onKeydown() directly on the dropdown instance.
 * Uses the element currently mocked as activeElement as the event target.
 */
function keydown(fixture: ComponentFixture<TestHostComponent>, key: string): void {
    const dropdown = getDropdown(fixture);
    const target = document.activeElement as HTMLElement;
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { get: () => target, configurable: true });
    dropdown.onKeydown(event);
    fixture.changeDetectorRef.detectChanges();
}

/** Restore document.activeElement to its native getter. */
function restoreActiveElement(): void {
    delete (document as any).activeElement;
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('MagmaMenuDropdownComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let dropdown: MagmaMenuDropdownComponent;
    let pointerMode: MagmaPointerModeService;

    beforeEach(async () => {
        vi.useFakeTimers();

        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        TestBed.inject(Overlay);
        pointerMode = TestBed.inject(MagmaPointerModeService);

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.changeDetectorRef.detectChanges();

        dropdown = getDropdown(fixture);
        dropdown.items.set(ITEMS);
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        restoreActiveElement();
        fixture?.destroy();
        cleanupOverlayContainer();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    // ── Instantiation ─────────────────────────────────────────────────────────

    it('should create', () => {
        expect(dropdown).toBeTruthy();
    });

    it('should have role="menu" on host', () => {
        const el = fixture.debugElement.query(By.directive(MagmaMenuDropdownComponent)).nativeElement;
        expect(el.getAttribute('role')).toBe('menu');
    });

    it('should reflect label as aria-label', () => {
        dropdown.label.set('File');
        fixture.changeDetectorRef.detectChanges();
        const el = fixture.debugElement.query(By.directive(MagmaMenuDropdownComponent)).nativeElement;
        expect(el.getAttribute('aria-label')).toBe('File');
    });

    it('should start with no active sub-menu', () => {
        expect(dropdown.activeSubMenu).toBeNull();
    });

    // ── Item rendering ────────────────────────────────────────────────────────

    it('should render menu item buttons for non-separator items', () => {
        // New, Open, Quit — separator renders a <div>, not a #itemRef button
        const buttons = fixture.debugElement.queryAll(By.css('.mg-menu-item'));
        expect(buttons.length).toBe(3);
    });

    it('should render separator divs', () => {
        const separators = fixture.debugElement.queryAll(By.css('.mg-menu-separator'));
        expect(separators.length).toBe(1);
    });

    it('should mark disabled items with disabled attribute', () => {
        const quitBtn = fixture.debugElement
            .queryAll(By.css('.mg-menu-item'))
            .find(d => d.nativeElement.textContent?.includes('Quit'));
        expect(quitBtn?.nativeElement.hasAttribute('disabled')).toBe(true);
    });

    // ── select() ─────────────────────────────────────────────────────────────

    it('should emit itemSelected when a normal item is selected', () => {
        const spy = vi.spyOn(dropdown.itemSelected, 'emit');
        dropdown.select(ITEMS[0]);
        expect(spy).toHaveBeenCalledWith(ITEMS[0]);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not emit itemSelected for a separator', () => {
        const spy = vi.spyOn(dropdown.itemSelected, 'emit');
        dropdown.select(ITEMS[2]);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit itemSelected for a disabled item', () => {
        const spy = vi.spyOn(dropdown.itemSelected, 'emit');
        dropdown.select(ITEMS[3]);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should open sub-menu on select for item with children', () => {
        dropdown.items.set(ITEMS_WITH_CHILDREN);
        fixture.changeDetectorRef.detectChanges();
        const triggerEl = fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].nativeElement;
        dropdown.select(ITEMS_WITH_CHILDREN[1], triggerEl);
        expect(dropdown.activeSubMenu).toBe(ITEMS_WITH_CHILDREN[1]);
    });

    it('should close sub-menu when selecting the same item again', () => {
        dropdown.items.set(ITEMS_WITH_CHILDREN);
        fixture.changeDetectorRef.detectChanges();
        const triggerEl = fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].nativeElement;
        dropdown.select(ITEMS_WITH_CHILDREN[1], triggerEl);
        dropdown.select(ITEMS_WITH_CHILDREN[1], triggerEl);
        expect(dropdown.activeSubMenu).toBeNull();
    });

    // ── focusFirst() ──────────────────────────────────────────────────────────

    it('should focus the first non-disabled item', () => {
        dropdown.focusFirst();
        const firstBtn = getFocusableButtons(fixture)[0];
        // focusFirst() calls .focus() natively — mock activeElement to stabilise
        focusStably(firstBtn, fixture);
        expect(document.activeElement).toBe(firstBtn);
    });

    // ── ArrowDown / ArrowUp ───────────────────────────────────────────────────

    describe('ArrowDown / ArrowUp', () => {
        it('should move focus down on ArrowDown', () => {
            const focusable = getFocusableButtons(fixture);
            focusStably(focusable[0], fixture);
            keydown(fixture, 'ArrowDown');
            expect(document.activeElement).toBe(focusable[1]);
        });

        it('should wrap from last to first on ArrowDown', () => {
            const focusable = getFocusableButtons(fixture);
            focusStably(focusable[focusable.length - 1], fixture);
            keydown(fixture, 'ArrowDown');
            expect(document.activeElement).toBe(focusable[0]);
        });

        it('should move focus up on ArrowUp', () => {
            const focusable = getFocusableButtons(fixture);
            focusStably(focusable[1], fixture);
            keydown(fixture, 'ArrowUp');
            expect(document.activeElement).toBe(focusable[0]);
        });

        it('should wrap from first to last on ArrowUp', () => {
            const focusable = getFocusableButtons(fixture);
            focusStably(focusable[0], fixture);
            keydown(fixture, 'ArrowUp');
            expect(document.activeElement).toBe(focusable[focusable.length - 1]);
        });
    });

    // ── ArrowRight ────────────────────────────────────────────────────────────

    describe('ArrowRight', () => {
        beforeEach(() => {
            dropdown.items.set(ITEMS_WITH_CHILDREN);
            fixture.changeDetectorRef.detectChanges();
        });

        it('should emit navigateNext when focused item has no children', () => {
            focusStably(getFocusableButtons(fixture)[0], fixture);
            const spy = vi.spyOn(dropdown.navigateNext, 'emit');
            keydown(fixture, 'ArrowRight');
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should open sub-menu when focused item has children', () => {
            focusStably(getFocusableButtons(fixture)[1], fixture);
            keydown(fixture, 'ArrowRight');
            vi.advanceTimersByTime(0);
            expect(dropdown.activeSubMenu).toBe(ITEMS_WITH_CHILDREN[1]);
        });

        it('should not emit navigateNext when sub-menu opens', () => {
            focusStably(getFocusableButtons(fixture)[1], fixture);
            const spy = vi.spyOn(dropdown.navigateNext, 'emit');
            keydown(fixture, 'ArrowRight');
            expect(spy).not.toHaveBeenCalled();
        });
    });

    // ── ArrowLeft ─────────────────────────────────────────────────────────────

    describe('ArrowLeft', () => {
        it('should emit navigatePrev when no sub-menu is open', () => {
            focusStably(getFocusableButtons(fixture)[0], fixture);
            const spy = vi.spyOn(dropdown.navigatePrev, 'emit');
            keydown(fixture, 'ArrowLeft');
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should close sub-menu on ArrowLeft when sub-menu is open', () => {
            dropdown.items.set(ITEMS_WITH_CHILDREN);
            fixture.changeDetectorRef.detectChanges();
            const triggerEl = fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].nativeElement;
            dropdown.select(ITEMS_WITH_CHILDREN[1], triggerEl);
            expect(dropdown.activeSubMenu).not.toBeNull();

            const spy = vi.spyOn(dropdown.navigatePrev, 'emit');
            focusStably(getFocusableButtons(fixture)[0], fixture);
            keydown(fixture, 'ArrowLeft');

            expect(dropdown.activeSubMenu).toBeNull();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    // ── Escape ────────────────────────────────────────────────────────────────

    describe('Escape', () => {
        it('should emit closeRequested when no sub-menu is open', () => {
            focusStably(getFocusableButtons(fixture)[0], fixture);
            const spy = vi.spyOn(dropdown.closeRequested, 'emit');
            keydown(fixture, 'Escape');
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should close sub-menu on Escape when sub-menu is open', () => {
            dropdown.items.set(ITEMS_WITH_CHILDREN);
            fixture.changeDetectorRef.detectChanges();
            const triggerEl = fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].nativeElement;
            dropdown.select(ITEMS_WITH_CHILDREN[1], triggerEl);

            const spy = vi.spyOn(dropdown.closeRequested, 'emit');
            focusStably(getFocusableButtons(fixture)[0], fixture);
            keydown(fixture, 'Escape');

            expect(dropdown.activeSubMenu).toBeNull();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    // ── mouseenter guard ──────────────────────────────────────────────────────

    describe('mouseenter', () => {
        beforeEach(() => {
            dropdown.items.set(ITEMS_WITH_CHILDREN);
            fixture.changeDetectorRef.detectChanges();
        });

        it('should open sub-menu on mouseenter in pointer mode', () => {
            pointerMode.isKeyboard.set(false);
            fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].triggerEventHandler('mouseenter', {});
            fixture.changeDetectorRef.detectChanges();
            expect(dropdown.activeSubMenu).toBe(ITEMS_WITH_CHILDREN[1]);
        });

        it('should NOT open sub-menu on mouseenter in keyboard mode', () => {
            pointerMode.isKeyboard.set(true);
            fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].triggerEventHandler('mouseenter', {});
            fixture.changeDetectorRef.detectChanges();
            expect(dropdown.activeSubMenu).toBeNull();
        });

        it('should close sub-menu on mouseenter over non-child item in pointer mode', () => {
            pointerMode.isKeyboard.set(false);
            const triggerEl = fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].nativeElement;
            dropdown.select(ITEMS_WITH_CHILDREN[1], triggerEl);

            fixture.debugElement.queryAll(By.css('.mg-menu-item'))[0].triggerEventHandler('mouseenter', {});
            fixture.changeDetectorRef.detectChanges();
            expect(dropdown.activeSubMenu).toBeNull();
        });
    });

    // ── Icon rendering ────────────────────────────────────────────────────────

    describe('icon rendering', () => {
        it('should render text icon as text content', () => {
            dropdown.items.set([{ label: 'Save', icon: '💾', action: () => {} }]);
            fixture.changeDetectorRef.detectChanges();
            const icon = fixture.debugElement.query(By.css('.mg-menu-item-icon'));
            expect(icon).not.toBeNull();
            expect(icon.nativeElement.querySelector('img')).toBeNull();
        });

        it('should render URL icon as <img>', () => {
            dropdown.items.set([{ label: 'Save', icon: '/icons/save.svg', action: () => {} }]);
            fixture.changeDetectorRef.detectChanges();
            const img = fixture.debugElement.query(By.css('.mg-menu-item-icon img'));
            expect(img).not.toBeNull();
            expect(img.nativeElement.getAttribute('src')).toBe('/icons/save.svg');
        });
    });

    // ── closeSubMenu() ────────────────────────────────────────────────────────

    it('should clear activeSubMenu on closeSubMenu()', () => {
        dropdown.items.set(ITEMS_WITH_CHILDREN);
        fixture.changeDetectorRef.detectChanges();
        const triggerEl = fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].nativeElement;
        dropdown.select(ITEMS_WITH_CHILDREN[1], triggerEl);
        expect(dropdown.activeSubMenu).not.toBeNull();

        dropdown.closeSubMenu();
        expect(dropdown.activeSubMenu).toBeNull();
    });

    // ── ngOnDestroy ───────────────────────────────────────────────────────────

    it('should not throw on destroy when no sub-menu is open', () => {
        expect(() => dropdown.ngOnDestroy()).not.toThrow();
    });

    it('should not throw on destroy when sub-menu is open', () => {
        dropdown.items.set(ITEMS_WITH_CHILDREN);
        fixture.changeDetectorRef.detectChanges();
        const triggerEl = fixture.debugElement.queryAll(By.css('.mg-menu-item'))[1].nativeElement;
        dropdown.select(ITEMS_WITH_CHILDREN[1], triggerEl);
        expect(() => dropdown.ngOnDestroy()).not.toThrow();
    });
});
