import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    Component,
    ComponentRef,
    Directive,
    ElementRef,
    HostListener,
    OnDestroy,
    computed,
    effect,
    inject,
    input,
    numberAttribute,
} from '@angular/core';

const connectedPosition: ConnectedPosition[] = [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
];

let index = 0;

@Component({
    template: '<span [id]="describedBy()">{{ text() }}</span>',
    styles: [
        `
            :host {
                display: block;
                position: relative;
            }

            span {
                display: block;
                position: relative;
                top: -15px;
                opacity: 0;
                animation: tooltip-slide 0.18s ease-out 0.5s;
                animation-fill-mode: forwards;
                box-shadow: 2px 2px 5px var(--tooltip-shadow-color);
                border: 1px solid var(--tooltip-border-color);
                background: var(--tooltip-background);
                padding: 6px;
                color: var(--tooltip-text-color);
                white-space: pre-wrap;
            }

            @keyframes tooltip-slide {
                0% {
                    top: -15px;
                    opacity: 0;
                    pointer-events: none;
                }

                100% {
                    top: 0;
                    opacity: 1;
                    pointer-events: none;
                }
            }
        `,
    ],
})
export class MagmaTooltipComponent {
    text = input<string>();
    describedBy = input<string>();
}

@Directive({
    selector: '[mgTooltip]',
    host: {
        '[aria-describedby]': 'describedBy()',
        '[class.tooltip]': 'true',
    },
})
export class MagmaTooltipDirective implements OnDestroy {
    private readonly overlay = inject(Overlay);
    private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

    mgTooltip = input('');
    mgTooltipEntryDelay = input(200, { transform: numberAttribute });
    mgTooltipDisplayDelay = input(0, { transform: numberAttribute }); // 0 to infini
    mgTooltipDescribedBy = input<string>();

    static _overlayRef?: OverlayRef;
    static _component?: ComponentRef<MagmaTooltipComponent>;

    private timer?: NodeJS.Timeout;

    index = index++;

    ngOnDestroy(): void {
        MagmaTooltipDirective._overlayRef?.dispose();
        MagmaTooltipDirective._overlayRef = undefined;
        MagmaTooltipDirective._component = undefined;
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.timer = setTimeout(() => {
            this.createTooltip();
        }, this.mgTooltipEntryDelay());
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.ngOnDestroy();
    }

    constructor() {
        effect(() => {
            MagmaTooltipDirective._component?.setInput('text', this.mgTooltip());
            MagmaTooltipDirective._component?.setInput('describedBy', this.describedBy());
        });
    }

    protected describedBy = computed(() => this.mgTooltipDescribedBy() || 'tooltip-' + this.index);

    private createTooltip() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        const overlayRef = this.overlay.create({
            panelClass: 'tooltip-panel',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(this.element)
                .withPositions(connectedPosition)
                .withPush(true),
        });
        const userProfilePortal = new ComponentPortal(MagmaTooltipComponent);

        const component = overlayRef.attach(userProfilePortal);
        component.setInput('text', this.mgTooltip());
        component.setInput('describedBy', this.describedBy());

        MagmaTooltipDirective._overlayRef = overlayRef;
        MagmaTooltipDirective._component = component;

        if (this.mgTooltipDisplayDelay()) {
            setTimeout(() => {
                this.ngOnDestroy();
            }, this.mgTooltipDisplayDelay());
        }
    }
}
