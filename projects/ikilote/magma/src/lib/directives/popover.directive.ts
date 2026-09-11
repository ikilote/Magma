import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    Directive,
    ElementRef,
    HostListener,
    OnDestroy,
    TemplateRef,
    ViewContainerRef,
    booleanAttribute,
    computed,
    effect,
    inject,
    input,
    numberAttribute,
    output,
    signal,
} from '@angular/core';

import { redispatchAtPoint } from '../utils/dom';
import { MagmaConnectedPosition, toConnectedPositions } from '../utils/position';

let popoverIndex = 0;

/**
 * Directive to attach an interactive popover to any element.
 *
 * The popover content is defined via a `TemplateRef` and supports any
 * interactive content (buttons, forms, links…).
 *
 * Unlike `mgTooltip`, the popover:
 * - opens on **click** (or hover with `mgPopoverTrigger="hover"`)
 * - stays open until the user clicks outside (backdrop) or calls `close()`
 * - traps nothing — the template content is fully interactive
 *
 * @example
 * ```html
 * <button [mgPopover]="tpl">Open</button>
 *
 * <ng-template #tpl>
 *   <div class="popover-body">
 *     <p>Interactive content</p>
 *     <button (click)="doSomething()">Action</button>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
    selector: '[mgPopover]',
    host: {
        '[attr.aria-expanded]': 'isOpen()',
        '[attr.aria-controls]': 'popoverId()',
        '[class.popover-trigger]': 'true',
    },
})
export class MagmaPopoverDirective implements OnDestroy {
    private readonly overlay = inject(Overlay);
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly viewContainerRef = inject(ViewContainerRef);

    // ── Inputs ────────────────────────────────────────────────────────────────

    /** Template to render inside the popover. */
    mgPopover = input.required<TemplateRef<unknown>>();

    /** Screen-side where the popover opens relative to the trigger element. */
    mgPopoverPosition = input<MagmaConnectedPosition>('bottom-start');

    /** What triggers the popover: click (default) or hover. */
    mgPopoverTrigger = input<'click' | 'hover'>('click');

    /** Offset in px between the trigger element and the popover panel. */
    mgPopoverOffset = input(4, { transform: numberAttribute });

    /** When true, the trigger is inert and the popover will not open. */
    mgPopoverDisabled = input(false, { transform: booleanAttribute });

    // ── Outputs ───────────────────────────────────────────────────────────────

    /** Emitted when the popover opens. */
    readonly mgPopoverOpened = output<void>();

    /** Emitted when the popover closes. */
    readonly mgPopoverClosed = output<void>();

    // ── State ─────────────────────────────────────────────────────────────────

    readonly isOpen = signal(false);

    private _index = popoverIndex++;
    private _overlayRef?: OverlayRef;
    private _hoverTimer?: ReturnType<typeof setTimeout>;

    readonly popoverId = computed(() => `mg-popover-${this._index}`);

    constructor() {
        // Keep position strategy in sync when mgPopoverPosition changes while open.
        effect(() => {
            const pos = this.mgPopoverPosition();
            if (this._overlayRef) {
                this._overlayRef.updatePositionStrategy(
                    this.overlay
                        .position()
                        .flexibleConnectedTo(this.elementRef)
                        .withPositions(toConnectedPositions(pos))
                        .withDefaultOffsetY(this.mgPopoverOffset())
                        .withPush(true),
                );
                this._overlayRef.updatePosition();
            }
        });
    }

    ngOnDestroy(): void {
        clearTimeout(this._hoverTimer);
        this.close();
    }

    // ── Host listeners ────────────────────────────────────────────────────────

    @HostListener('click')
    onClick(): void {
        if (this.mgPopoverTrigger() !== 'click' || this.mgPopoverDisabled()) {
            return;
        }
        this.isOpen() ? this.close() : this.open();
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        if (this.mgPopoverTrigger() !== 'hover' || this.mgPopoverDisabled()) {
            return;
        }
        clearTimeout(this._hoverTimer);
        this.open();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        if (this.mgPopoverTrigger() !== 'hover') {
            return;
        }
        // Small delay so the user can move into the popover panel itself.
        this._hoverTimer = setTimeout(() => this.close(), 150);
    }

    @HostListener('keydown.escape')
    onEscape(): void {
        if (this.isOpen()) {
            this.close();
            this.elementRef.nativeElement.focus();
        }
    }

    // ── Public API ────────────────────────────────────────────────────────────

    open(): void {
        if (this.isOpen() || this.mgPopoverDisabled()) {
            return;
        }

        const isHover = this.mgPopoverTrigger() === 'hover';

        const overlayRef = this.overlay.create({
            hasBackdrop: !isHover,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            panelClass: 'mg-popover-panel',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(this.elementRef)
                .withPositions(toConnectedPositions(this.mgPopoverPosition()))
                .withDefaultOffsetY(this.mgPopoverOffset())
                .withPush(true),
        });

        const portal = new TemplatePortal(this.mgPopover(), this.viewContainerRef, {
            $implicit: { close: () => this.close() },
        });

        overlayRef.attach(portal);

        if (!isHover) {
            overlayRef.backdropClick().subscribe((e: MouseEvent) => {
                this.close();
                redispatchAtPoint(e.clientX, e.clientY, 'click', e.button);
            });
        }

        // Hover mode: keep popover open while mouse is on the trigger or the panel.
        if (isHover) {
            overlayRef.overlayElement.addEventListener('mouseleave', () => {
                this._hoverTimer = setTimeout(() => this.close(), 150);
            });
            overlayRef.overlayElement.addEventListener('mouseenter', () => {
                clearTimeout(this._hoverTimer);
            });
        }

        this._overlayRef = overlayRef;
        this.isOpen.set(true);
        this.mgPopoverOpened.emit();
    }

    close(): void {
        if (!this.isOpen()) {
            return;
        }
        this._overlayRef?.dispose();
        this._overlayRef = undefined;
        this.isOpen.set(false);
        this.mgPopoverClosed.emit();
    }
}
