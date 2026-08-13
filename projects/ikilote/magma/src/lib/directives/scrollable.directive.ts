import {
    AfterViewInit,
    Directive,
    ElementRef,
    NgModule,
    OnDestroy,
    ViewContainerRef,
    booleanAttribute,
    effect,
    inject,
    input,
    numberAttribute,
    output,
} from '@angular/core';

import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type MagmaScrollPosition = 'top' | 'bottom';

export class MagmaScrollableView {
    constructor(private viewContainerRef: ViewContainerRef) {}

    getElement(): HTMLElement {
        return this.viewContainerRef.element.nativeElement;
    }
}

export interface MagmaScrollElementPosition {
    id: string;
    position: number;
    current: boolean;
    before: boolean;
    after: boolean;
    first: boolean;
    last: boolean;
}

@Directive({ selector: '[mgScrollable]' })
export class MagmaScrollableDirective implements AfterViewInit, OnDestroy {
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    readonly mgScrollableSpeedMax = input(50, { transform: numberAttribute });
    readonly mgScrollableReducer = input(2, { transform: numberAttribute });

    /**
     * CSS selector targeting the scroll container (must have overflow set).
     * If not provided, the host element itself is used.
     */
    readonly mgScrollable = input<string | undefined>(undefined);

    /**
     * CSS selector of a sticky element inside the scroll container.
     * Its height will be subtracted from scroll targets so content
     * is not hidden behind it.
     */
    readonly mgScrollableSticky = input<string | undefined>(undefined);

    readonly scrolled = output<number>();
    readonly scrolledTo = output<number>();
    readonly changedTo = output<string>();
    readonly clicked = output<{ position: string | number; action: 'goTo' | 'scrollTo' | 'jumpTo' }>();

    /** Targeted scroll container element. */
    targetedElement!: HTMLElement;

    private currentZone: HTMLElement | undefined;
    private scrollableViews = new Map<string, MagmaScrollableView>();
    private inScroll = false;
    private animationFrame: number | undefined;
    private wheelListener: (() => void) | undefined;
    private scrollSubscription?: { unsubscribe: () => void };

    ngAfterViewInit(): void {
        this.findTarget();
        this.scrollSubscription = fromEvent(this.targetedElement, 'scroll')
            .pipe(debounceTime(50))
            .subscribe(() => {
                this.scrolled.emit(this.position());
            });
    }

    ngOnDestroy(): void {
        this.clear();
        this.scrollSubscription?.unsubscribe();
    }

    /**
     * Add a scrollable target
     * @param id target id
     * @param target target view
     */
    add(id: string, target: MagmaScrollableView): void {
        this.scrollableViews.set(id, target);
    }

    /**
     * Returns positions of all registered scroll targets relative to the scroll container.
     */
    positionsTarget(): Map<string, MagmaScrollElementPosition> {
        const startPos = this.targetedElement.scrollTop + this.getStickyOffset();
        const positions = new Map<string, MagmaScrollElementPosition>();
        const total = this.scrollableViews.size;
        let count = 0;

        this.scrollableViews.forEach((element, key) => {
            const current = element.getElement();
            const positionTop = this.getOffsetTop(current, this.targetedElement);
            const positionBottom = positionTop + current.offsetHeight;

            const info: MagmaScrollElementPosition = {
                id: key,
                position: positionTop,
                current: !(startPos - positionTop < 0 || startPos - positionBottom > 0),
                after: startPos - positionTop < 0,
                before: startPos - positionBottom > 0,
                first: count === 0,
                last: count === total - 1,
            };

            if (info.first && info.after) {
                info.current = true;
                info.after = false;
            } else if (info.last && info.before) {
                info.current = true;
                info.before = false;
            }

            positions.set(key, info);
            count++;
        });

        return positions;
    }

    /**
     * Animated scroll to a registered target by id.
     * @param id Registered scroll target identifier
     * @param scrolling Whether to animate (default: true)
     */
    goTo(id: string, scrolling = true): void {
        this.clicked.emit({ position: id, action: 'goTo' });

        if (this.inScroll) {
            this.clear();
        }

        const target = this.scrollableViews.get(id);
        if (target) {
            this.changedTo.emit(id);
            const offset = this.getOffsetTop(target.getElement(), this.targetedElement) - this.getStickyOffset();

            if (scrolling) {
                this.scrollToElement(this.targetedElement, offset);
            } else {
                this.jumpTo(offset);
            }
        }
    }

    /**
     * Animated scroll to a pixel position or 'top'/'bottom'.
     */
    scrollTo(pos: number | MagmaScrollPosition): void {
        this.clicked.emit({ position: pos, action: 'scrollTo' });

        if (this.inScroll) {
            this.clear();
        }

        if (pos === 'top') {
            pos = 0;
        }
        if (pos === 'bottom') {
            pos = Math.max(0, this.targetedElement.scrollHeight - this.targetedElement.offsetHeight);
        }

        this.scrollToElement(this.targetedElement, pos as number);
        this.scrolledTo.emit(pos as number);
    }

    /**
     * Instant (non-animated) scroll to a pixel position.
     */
    jumpTo(pos: number): void {
        this.clicked.emit({ position: pos, action: 'jumpTo' });
        this.targetedElement.scrollTop = this.scrollTopMax(this.targetedElement, pos);
    }

    /**
     * Current scroll position of the targeted element.
     */
    position(): number {
        return this.targetedElement.scrollTop;
    }

    private findTarget(): void {
        this.targetedElement = this.elementRef.nativeElement;

        const selector = this.mgScrollable();
        if (selector) {
            const parent = document.querySelector(selector) as HTMLElement;
            if (parent) {
                this.targetedElement = parent;
            }
        }
    }

    private scrollToElement(zone: HTMLElement, target: HTMLElement | number): void {
        this.currentZone = zone;
        this.inScroll = true;

        let startPos = this.currentZone.scrollTop;

        // Stop scroll on user wheel interaction
        const wheelHandler = () => this.clear();
        this.wheelListener = wheelHandler;
        this.currentZone.addEventListener('wheel', wheelHandler, { passive: true });

        let pos: number = target instanceof HTMLElement ? this.getOffsetTop(target, this.currentZone) : target;

        const animate = () => {
            if (!this.inScroll || !this.currentZone) {
                return;
            }

            // Recalculate position for moving targets
            if (target instanceof HTMLElement) {
                pos = this.getOffsetTop(target, this.currentZone);
            }
            pos = this.scrollTopMax(this.currentZone, pos);

            const diff = pos - startPos;
            const direction = diff >= 0 ? 1 : -1;
            const reducer = Math.max(1, this.mgScrollableReducer());
            const movement = Math.max(1, Math.min(Math.abs(diff) / reducer, this.mgScrollableSpeedMax()));

            this.currentZone.scrollTop += movement * direction;
            startPos = this.currentZone.scrollTop;

            if (Math.abs(this.currentZone.scrollTop - pos) < 1) {
                this.clear();
                this.inScroll = false;
            } else {
                this.animationFrame = requestAnimationFrame(animate);
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    private clear(): void {
        if (this.animationFrame != null) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = undefined;
        }
        if (this.currentZone && this.wheelListener) {
            this.currentZone.removeEventListener('wheel', this.wheelListener);
        }
        this.inScroll = false;
        this.currentZone = undefined;
        this.wheelListener = undefined;
    }

    private scrollTopMax(zone: HTMLElement, pos: number): number {
        if (zone.scrollHeight - pos < zone.offsetHeight) {
            pos = Math.max(0, zone.scrollHeight - zone.offsetHeight);
        }
        return pos;
    }

    /**
     * Returns the height of the sticky element (if configured), used as scroll offset.
     */
    getStickyOffset(): number {
        const selector = this.mgScrollableSticky();
        if (!selector) {
            return 0;
        }
        const stickyEl = this.targetedElement.querySelector(selector) as HTMLElement;
        return stickyEl?.offsetHeight ?? 0;
    }

    private getOffsetTop(target: HTMLElement, zone: HTMLElement): number {
        let element = target;
        let offsetTop = 0;
        if (element.offsetParent) {
            offsetTop = element.offsetTop;
            while (element.offsetParent && this.isInsideZone(element.offsetParent as HTMLElement, zone)) {
                element = element.offsetParent as HTMLElement;
                offsetTop += element.offsetTop;
            }
        }
        return offsetTop;
    }

    private isInsideZone(target: HTMLElement, zone: HTMLElement): boolean {
        if (target === zone) {
            return false;
        }
        let element = target.parentElement;
        while (element) {
            if (element === zone) {
                return true;
            }
            element = element.parentElement;
        }
        return false;
    }
}

@Directive({
    selector: '[mgScrollGoto]',
    host: {
        '(click)': 'onClick()',
        '(keydown.enter)': 'onClick()',
        '(keydown.space)': 'onClick()',
    },
})
export class MagmaScrollGotoDirective {
    private readonly scrollable = inject(MagmaScrollableDirective, { host: true });

    readonly mgScrollGoto = input.required<string>();

    readonly mgScrollJump = input(false, { transform: booleanAttribute });

    onClick() {
        this.scrollable.goTo(this.mgScrollGoto(), !this.mgScrollJump());
    }
}

@Directive({ selector: '[mgScrollTarget]' })
export class MagmaScrollTargetDirective {
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly scrollable = inject(MagmaScrollableDirective, { host: true });

    readonly mgScrollTarget = input.required<string>();

    private readonly view = new MagmaScrollableView(this.viewContainer);

    constructor() {
        effect(() => {
            this.scrollable.add(this.mgScrollTarget(), this.view);
        });
    }
}

const MagmaScrollable = [MagmaScrollableDirective, MagmaScrollGotoDirective, MagmaScrollTargetDirective];

@NgModule({
    imports: [MagmaScrollable],
    exports: [MagmaScrollable],
})
export class MagmaScrollableModule {}
