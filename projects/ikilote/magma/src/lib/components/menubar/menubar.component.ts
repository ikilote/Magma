import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    AfterContentInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    contentChildren,
    inject,
    input,
    output,
    signal,
    viewChildren,
} from '@angular/core';

import { MagmaMenuDropdownComponent } from './menu-dropdown.component';
import { MagmaMenuDirective } from './menu.component';
import { MagmaMenuDef, MagmaMenuItemDef } from './menubar.types';

import { MagmaClickOutsideDirective } from '../../directives/click-outside.directive';
import { MagmaPointerModeService } from '../../services/pointer-mode.service';
import { redispatchAtPoint } from '../../utils/dom';
import { isIconUrl } from '../../utils/icon';

/**
 * Application-style menu bar that supports both a declarative JSON API and
 * a structural tag API.
 *
 * Dropdowns are rendered in CDK Overlay portals so they are never clipped
 * by parent overflow or z-index stacking contexts.
 *
 * ## JSON mode
 * ```html
 * <mg-menubar [menus]="menuDefs" (menuItemExecuted)="onAction($event)" />
 * ```
 *
 * ## Tag mode
 * ```html
 * <mg-menubar (menuItemExecuted)="onAction($event)">
 *   <mg-menu label="File">
 *     <mg-menu-item label="New"  (action)="newFile()" />
 *     <mg-menu-item separator />
 *     <mg-menu-item label="Quit" [disabled]="true" />
 *   </mg-menu>
 *   <mg-menu label="Edit">
 *     <mg-menu-item label="Copy" icon="copy" (action)="copy()" />
 *   </mg-menu>
 * </mg-menubar>
 * ```
 *
 * Keyboard navigation:
 * - `←` / `→` — move between top-level menus (opens the next/previous one if any is open)
 * - `↑` / `↓` — move through items in the open dropdown
 * - `Enter` / `Space` — activate focused item
 * - `Escape` — close the open menu
 */
@Component({
    selector: 'mg-menubar',
    templateUrl: './menubar.component.html',
    styleUrl: './menubar.component.scss',
    imports: [MagmaClickOutsideDirective],
    host: {
        role: 'menubar',
        '[attr.aria-label]': 'ariaLabel()',
    },
})
export class MagmaMenubarComponent implements AfterContentInit, OnDestroy {
    private readonly overlay = inject(Overlay);
    protected readonly pointerMode = inject(MagmaPointerModeService);
    protected readonly isIconUrl = (icon: string) => isIconUrl(icon);

    // ── Inputs ────────────────────────────────────────────────────────────────

    /** JSON mode: array of menu definitions. Ignored when tag-mode menus are present. */
    menus = input<MagmaMenuDef[]>([]);

    /** Accessible label for the menubar element. */
    ariaLabel = input<string>('Application menu');

    // ── Outputs ───────────────────────────────────────────────────────────────

    /** Emitted after any menu item action is executed. */
    readonly menuItemExecuted = output<MagmaMenuItemDef>();

    // ── Tag-mode content children ─────────────────────────────────────────────

    readonly tagMenus = contentChildren(MagmaMenuDirective);

    // ── State ─────────────────────────────────────────────────────────────────

    /** Index of the currently open top-level menu (-1 = none). */
    readonly openIndex = signal(-1);

    /** Resolved list of menus (tag or JSON). */
    resolvedMenus: MagmaMenuDef[] = [];

    // ── View children (trigger buttons) ──────────────────────────────────────

    readonly triggerRefs = viewChildren<ElementRef<HTMLButtonElement>>('trigger');

    // ── Overlay state ─────────────────────────────────────────────────────────

    private _overlayRef?: OverlayRef;
    private _dropdownInstance?: MagmaMenuDropdownComponent;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    ngAfterContentInit(): void {
        this.resolveMenus();
    }

    ngOnDestroy(): void {
        this.disposeOverlay();
    }

    private resolveMenus(): void {
        const tags = this.tagMenus();
        this.resolvedMenus = tags.length ? tags.map(m => m.def) : this.menus();
    }

    // ── Template helpers ──────────────────────────────────────────────────────

    toggle(index: number): void {
        if (this.openIndex() === index) {
            this.close();
        } else {
            this.openAt(index);
        }
    }

    openAt(index: number, focusFirstItem = false): void {
        this.disposeOverlay();
        this.openIndex.set(index);

        const triggerIndex = this.triggerIndexFor(index);
        const triggerEl = this.triggerRefs()[triggerIndex]?.nativeElement;
        const menu = this.resolvedMenus[index];
        if (!triggerEl || !menu || menu.separator) {
            return;
        }

        const overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(triggerEl)
                .withPositions([
                    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
                    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
                ])
                .withPush(true),
        });

        const portal = new ComponentPortal(MagmaMenuDropdownComponent);
        const instance = overlayRef.attach(portal).instance;
        instance.label.set(menu.label ?? '');
        instance.items.set(menu.items ?? []);
        instance.itemSelected.subscribe((item: MagmaMenuItemDef) => this.executeItem(item));
        instance.navigatePrev.subscribe(() => this.navigateTrigger(index, -1));
        instance.navigateNext.subscribe(() => this.navigateTrigger(index, 1));
        instance.closeRequested.subscribe(() => {
            const triggerEl = this.triggerRefs()[this.triggerIndexFor(index)]?.nativeElement;
            this.close();
            triggerEl?.focus();
        });

        overlayRef.backdropClick().subscribe((e: MouseEvent) => {
            this.close();
            redispatchAtPoint(e.clientX, e.clientY, 'click', e.button);
        });

        this._overlayRef = overlayRef;
        this._dropdownInstance = instance;

        setTimeout(() => {
            if (focusFirstItem) {
                instance.focusFirst();
            } else {
                triggerEl.focus();
            }
        });
    }

    close(): void {
        this.disposeOverlay();
        this.openIndex.set(-1);
    }

    /** Focus the first item of the currently open dropdown (called from template on ArrowDown). */
    focusDropdown(): void {
        setTimeout(() => this._dropdownInstance?.focusFirst());
    }

    executeItem(item: MagmaMenuItemDef): void {
        if (!item.disabled && !item.separator && typeof item.action === 'function') {
            item.action();
            this.menuItemExecuted.emit(item);
        }
        this.close();
    }

    private disposeOverlay(): void {
        this._overlayRef?.dispose();
        this._overlayRef = undefined;
        this._dropdownInstance = undefined;
    }

    /**
     * Returns the index into `triggerRefs()` (buttons only, no separators)
     * that corresponds to the given `resolvedMenus` index.
     */
    private triggerIndexFor(menuIndex: number): number {
        return this.resolvedMenus.slice(0, menuIndex + 1).filter(m => !m.separator).length - 1;
    }

    /** Navigate between top-level triggers by offset (+1 or -1), wrapping around separators. */
    navigateTrigger(fromIndex: number, offset: 1 | -1): void {
        // Build the list of navigable (non-separator) indices in resolvedMenus
        const navigable = this.resolvedMenus
            .map((m, i) => ({ m, i }))
            .filter(({ m }) => !m.separator)
            .map(({ i }) => i);

        if (navigable.length === 0) {
            return;
        }

        const pos = navigable.indexOf(fromIndex);
        const nextPos = (pos + offset + navigable.length) % navigable.length;
        const nextIndex = navigable[nextPos];

        if (this.openIndex() > -1) {
            this.openAt(nextIndex, true);
        } else {
            // nextPos is already the correct triggerRefs index (same order, no separators)
            this.triggerRefs()[nextPos]?.nativeElement.focus();
        }
    }

    // ── Keyboard navigation ───────────────────────────────────────────────────

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const current = this.openIndex();

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                if (current > -1) {
                    const trigger = this.triggerRefs()[this.triggerIndexFor(current)]?.nativeElement;
                    this.close();
                    trigger?.focus();
                }
                break;

            default:
                break;
        }
    }
}
