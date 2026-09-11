import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ElementRef, HostListener, OnDestroy, inject, output, signal, viewChildren } from '@angular/core';

import { MagmaMenuItemDef } from './menubar.types';

import { MagmaPointerModeService } from '../../services/pointer-mode.service';
import { isIconUrl } from '../../utils/icon';

/**
 * Renders the dropdown panel for a single menu level.
 * Handles ↑/↓ keyboard navigation and item activation.
 * Sub-menus are rendered in CDK Overlay portals attached to the parent item.
 */
@Component({
    selector: 'mg-menu-dropdown',
    templateUrl: './menu-dropdown.component.html',
    styleUrl: './menu-dropdown.component.scss',
    host: {
        role: 'menu',
        '[attr.aria-label]': 'label()',
    },
})
export class MagmaMenuDropdownComponent implements OnDestroy {
    private readonly overlay = inject(Overlay);
    protected readonly pointerMode = inject(MagmaPointerModeService);
    protected readonly isIconUrl = (icon: string) => isIconUrl(icon);

    // ── Writable signals (set by parent via ComponentRef) ─────────────────────

    readonly label = signal('');
    readonly items = signal<MagmaMenuItemDef[]>([]);

    // ── Outputs ───────────────────────────────────────────────────────────────

    readonly itemSelected = output<MagmaMenuItemDef>();

    /** Emitted when ← is pressed with no sub-menu open — caller should navigate to previous menu. */
    readonly navigatePrev = output<void>();

    /** Emitted when → is pressed on an item without children — caller should navigate to next menu. */
    readonly navigateNext = output<void>();

    /** Emitted when Escape is pressed — caller should close this level and restore focus. */
    readonly closeRequested = output<void>();

    // ── State ─────────────────────────────────────────────────────────────────

    activeSubMenu: MagmaMenuItemDef | null = null;

    readonly itemRefs = viewChildren<ElementRef<HTMLElement>>('itemRef');

    private _subOverlayRef?: OverlayRef;
    /** @internal Exposed for testing — the instance of the currently open sub-menu. */
    _subMenuRef?: MagmaMenuDropdownComponent;

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    ngOnDestroy(): void {
        this.disposeSubOverlay();
    }

    // ── Keyboard navigation ───────────────────────────────────────────────────

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const focusable = this.focusableItems();
        const focused = (event.target as HTMLElement) ?? (document.activeElement as HTMLElement);
        const idx = focusable.findIndex(el => el === focused);

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                event.stopPropagation();
                focusable[(idx + 1) % focusable.length]?.focus();
                break;

            case 'ArrowUp':
                event.preventDefault();
                event.stopPropagation();
                focusable[(idx - 1 + focusable.length) % focusable.length]?.focus();
                break;

            case 'ArrowRight':
                event.preventDefault();
                event.stopPropagation();
                if (idx > -1) {
                    const item = this.actionableItems()[idx];
                    if (item?.children?.length) {
                        this.openSubMenu(item, focusable[idx]);
                    } else {
                        this.navigateNext.emit();
                    }
                }
                break;

            case 'ArrowLeft':
                event.preventDefault();
                event.stopPropagation();
                if (this.activeSubMenu) {
                    this.closeSubMenu();
                } else {
                    this.navigatePrev.emit();
                }
                break;

            case 'Escape':
                event.preventDefault();
                event.stopPropagation();
                if (this.activeSubMenu) {
                    this.closeSubMenu();
                } else {
                    this.closeRequested.emit();
                }
                break;

            default:
                break;
        }
    }

    // ── Template helpers ──────────────────────────────────────────────────────

    select(item: MagmaMenuItemDef, triggerEl?: HTMLElement): void {
        if (item.separator || item.disabled) {
            return;
        }
        if (item.children?.length) {
            if (this.activeSubMenu === item) {
                this.closeSubMenu();
            } else {
                this.openSubMenu(item, triggerEl);
            }
            return;
        }
        this.itemSelected.emit(item);
    }

    // ── Sub-menu overlay ──────────────────────────────────────────────────────

    private openSubMenu(item: MagmaMenuItemDef, triggerEl?: HTMLElement): void {
        this.disposeSubOverlay();
        this.activeSubMenu = item;

        if (!triggerEl || !item.children?.length) {
            return;
        }

        const overlayRef = this.overlay.create({
            hasBackdrop: false,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(triggerEl)
                .withPositions([
                    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
                    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
                ])
                .withPush(true),
        });

        const portal = new ComponentPortal(MagmaMenuDropdownComponent);
        const ref = overlayRef.attach(portal);
        this._subMenuRef = ref.instance;
        ref.instance.label.set(item.label ?? '');
        ref.instance.items.set(item.children!);
        ref.instance.itemSelected.subscribe((child: MagmaMenuItemDef) => {
            this.closeSubMenu();
            this.itemSelected.emit(child);
        });
        // ← dans le sous-menu : ferme le sous-menu et remet le focus sur l'item parent
        ref.instance.navigatePrev.subscribe(() => {
            this.closeSubMenu();
            triggerEl.focus();
        });
        // → dans le sous-menu sans enfant : propage vers le menubar (menu suivant)
        ref.instance.navigateNext.subscribe(() => {
            this.closeSubMenu();
            this.navigateNext.emit();
        });
        // Escape dans le sous-menu : ferme le sous-menu et remet le focus sur l'item parent
        ref.instance.closeRequested.subscribe(() => {
            this.closeSubMenu();
            triggerEl.focus();
        });

        this._subOverlayRef = overlayRef;

        // Focus the first item of the sub-menu after it renders.
        setTimeout(() => ref.instance.focusFirst());
    }

    closeSubMenu(): void {
        this.disposeSubOverlay();
        this.activeSubMenu = null;
        this._subMenuRef = undefined;
    }

    /** Focus the first focusable item in this dropdown. */
    focusFirst(): void {
        const items = this.focusableItems();
        items[0]?.focus();
    }

    private disposeSubOverlay(): void {
        this._subOverlayRef?.dispose();
        this._subOverlayRef = undefined;
    }

    private focusableItems(): HTMLElement[] {
        return (this.itemRefs() ?? [])
            .map(r => r.nativeElement)
            .filter(el => !el.hasAttribute('disabled') && !el.classList.contains('separator'));
    }

    private actionableItems(): MagmaMenuItemDef[] {
        return this.items().filter(i => !i.separator);
    }
}
