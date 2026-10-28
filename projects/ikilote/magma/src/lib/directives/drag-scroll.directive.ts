import {
    Directive,
    ElementRef,
    HostListener,
    OnDestroy,
    booleanAttribute,
    inject,
    input,
    numberAttribute,
    output,
    signal,
} from '@angular/core';

/** Axis along which drag-scrolling is allowed. */
export type MagmaDragScrollAxis = 'both' | 'x' | 'y';

const tags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL', 'OPTION'];

/**
 * Directive that lets the user scroll an overflowing element by grabbing its
 * **background** and dragging — like panning a map or a kanban board.
 *
 * The host element must be scrollable (e.g. `overflow: auto`). A drag starts
 * only when the pointer goes down on the element's own background, not on an
 * interactive child (links, buttons, inputs, `[draggable]`, or anything the
 * consumer opts out with `[data-no-drag-scroll]`). This keeps clicks on real
 * content working while empty space becomes a scroll handle.
 *
 * Pointer position is translated 1:1 into `scrollLeft` / `scrollTop`, so the
 * content follows the cursor. A small movement threshold avoids hijacking
 * simple clicks, and pointer capture keeps the drag alive even if the cursor
 * leaves the element.
 *
 * Usage — apply it on any scrollable container (`overflow: auto`):
 * ```html
 * <div class="scroller" mgDragScroll>…</div>
 * <div class="strip" mgDragScroll mgDragScrollAxis="x">…</div>
 * ```
 */
@Directive({
    selector: '[mgDragScroll]',
    host: {
        '[class.mg-drag-scroll]': 'enabled()',
        '[class.mg-drag-scroll__pan-x]': 'enabled() && mgDragScrollAxis() === "x"',
        '[class.mg-drag-scroll__pan-y]': 'enabled() && mgDragScrollAxis() === "y"',
        '[class.mg-drag-scroll__cursor]': 'enabled() && mgDragScrollCursor()',
        '[class.mg-drag-scroll__grabbing]': 'dragging()',
    },
})
export class MagmaDragScrollDirective implements OnDestroy {
    /**
     * Disable the behavior without removing the directive (default: false).
     * Useful to toggle drag-scrolling on/off through a binding.
     */
    readonly mgDragScrollDisabled = input(false, { transform: booleanAttribute });

    /** Which axis can be panned: 'both' (default), 'x', or 'y'. */
    readonly mgDragScrollAxis = input<MagmaDragScrollAxis>('both');

    /**
     * Pixels the pointer must travel before a press becomes a drag. Below this,
     * the gesture is left alone so clicks on the background still fire
     * (default: 5).
     */
    readonly mgDragScrollThreshold = input(5, { transform: numberAttribute });

    /**
     * Show the grab / grabbing cursor on the host (default: false). Enable it to
     * let the directive manage the cursor, or leave it off to style it yourself
     * from CSS.
     */
    readonly mgDragScrollCursor = input(false, { transform: booleanAttribute });

    /**
     * CSS selector marking zones that must NOT start a drag. A press landing on
     * an element matching this selector (or inside one) is left to the content,
     * on top of the built-in interactive-element and `data-no-drag-scroll`
     * checks. Example: `'.slider, .no-pan'`.
     */
    readonly mgDragScrollIgnore = input<string | undefined>(undefined);

    /** Emitted when a drag actually starts (after the threshold is crossed). */
    readonly dragStart = output<void>();

    /** Emitted when a drag ends. */
    readonly dragEnd = output<void>();

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    /** True once the pointer moved past the threshold and we are panning. */
    readonly dragging = signal(false);

    /** Pointer id currently captured, if any. */
    private pointerId: number | undefined;

    /** Pointer position when the press started (client coords). */
    private startX = 0;
    private startY = 0;

    /** Scroll position when the press started. */
    private startScrollLeft = 0;
    private startScrollTop = 0;

    /** A press is pending but has not yet crossed the threshold. */
    private pending = false;

    private get host() {
        return this.el.nativeElement;
    }

    /** Whether drag-scrolling is currently active. */
    protected enabled(): boolean {
        return !this.mgDragScrollDisabled();
    }

    private suppressNextClick = false;

    // ── pointer handling ─────────────────────────────────────────────────────

    @HostListener('pointerdown', ['$event'])
    onPointerDown(event: PointerEvent): void {
        if (
            // Only left button / primary pointer, and only when enabled.
            !this.enabled() ||
            event.button !== 0 ||
            !event.isPrimary ||
            // Ignore presses that land on real, interactive content — those keep
            // their normal behavior. Only the element's own background drags.
            this.isInteractiveTarget(event.target as Element | null)
        ) {
            return;
        }

        const host = this.host;
        this.pointerId = event.pointerId;
        this.pending = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.startScrollLeft = host.scrollLeft;
        this.startScrollTop = host.scrollTop;
    }

    @HostListener('pointermove', ['$event'])
    onPointerMove(event: PointerEvent): void {
        if ((!this.pending && !this.dragging()) || this.pointerId !== event.pointerId) {
            return;
        }

        const axis = this.mgDragScrollAxis();
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;

        // Promote the press to a real drag once it moves past the threshold.
        if (this.pending && !this.dragging()) {
            const travelled = axis === 'x' ? Math.abs(dx) : axis === 'y' ? Math.abs(dy) : Math.hypot(dx, dy);
            if (travelled < this.mgDragScrollThreshold()) {
                return;
            }
            this.pending = false;
            this.dragging.set(true);
            this.host.setPointerCapture(event.pointerId);
            this.dragStart.emit();
        }

        // Reaching here means a drag is active: either promoted just above, or
        // already ongoing from a previous move (the guard at the top of this
        // handler lets through only pending-or-dragging pointers).

        // Content follows the cursor: dragging right reveals content on the left,
        // so scroll decreases as the pointer moves right.
        const host = this.host;
        if (axis !== 'y') {
            host.scrollLeft = this.startScrollLeft - dx;
        }
        if (axis !== 'x') {
            host.scrollTop = this.startScrollTop - dy;
        }

        event.preventDefault();
    }

    @HostListener('pointerup', ['$event'])
    onPointerUp(event: PointerEvent): void {
        this.endDrag(event);
    }

    @HostListener('pointercancel', ['$event'])
    onPointerCancel(event: PointerEvent): void {
        this.endDrag(event);
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent): void {
        // Swallow the click that terminates a real drag so a grab over, say, a
        // linked item does not also trigger that link.
        if (this.suppressNextClick) {
            this.suppressNextClick = false;
            event.preventDefault();
            event.stopPropagation();
        }
    }

    ngOnDestroy(): void {
        if (this.pointerId != null) {
            try {
                this.host.releasePointerCapture(this.pointerId);
            } catch {
                // capture may already be gone — nothing to do
            }
        }
    }

    private endDrag(event: PointerEvent): void {
        if (this.pointerId !== event.pointerId) {
            return;
        }

        const wasDragging = this.dragging();
        if (wasDragging) {
            this.suppressNextClick = true;
            try {
                this.host.releasePointerCapture(event.pointerId);
            } catch {
                // ignore: capture might not be held
            }
            this.dragEnd.emit();
        }

        this.dragging.set(false);
        this.pending = false;
        this.pointerId = undefined;
    }

    /**
     * Whether the press should be left to the content instead of starting a
     * drag. Walks up from the event target to the host, flagging common
     * interactive elements and anything opting out via `data-no-drag-scroll`.
     */
    private isInteractiveTarget(target: Element | null): boolean {
        let node = target;

        while (node && node !== this.host) {
            if (
                node.hasAttribute('data-no-drag-scroll') ||
                this.matchesIgnoreSelector(node) ||
                tags.includes(node.tagName) ||
                node.getAttribute('draggable') === 'true' ||
                node.getAttribute('contenteditable') === 'true'
            ) {
                return true;
            }
            node = node.parentElement;
        }

        return false;
    }

    /**
     * Whether a node matches the user-provided ignore selector. Guarded against
     * an invalid selector so a bad input never throws during a pointer event.
     */
    private matchesIgnoreSelector(node: Element): boolean {
        const selector = this.mgDragScrollIgnore();
        if (!selector) {
            return false;
        }
        try {
            return node.matches(selector);
        } catch {
            // Invalid selector — ignore it rather than breaking the gesture.
            return false;
        }
    }
}
