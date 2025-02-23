import { Directive, ElementRef, HostListener, OnDestroy, inject, input, numberAttribute } from '@angular/core';

@Directive({
    selector: '[mgTooltip]',
})
export class MagmaTooltipDirective implements OnDestroy {
    private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

    mgTooltip = input('');
    mgTooltipEntryDelay = input(200, { transform: numberAttribute });
    mgTooltipDisplayDelay = input(0, { transform: numberAttribute }); // 0 to infini

    private tooltipElement?: HTMLDivElement;
    private timer?: NodeJS.Timeout;

    ngOnDestroy(): void {
        if (this.tooltipElement) {
            this.tooltipElement.remove();
        }
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.timer = setTimeout(() => {
            const { x, y } = this.position();
            this.createTooltip(x, y);
        }, this.mgTooltipEntryDelay());
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.ngOnDestroy();
    }

    private position(): { x: number; y: number } {
        const element = this.element.nativeElement;
        const rect = element.getBoundingClientRect();
        const x = rect.left + element.offsetWidth / 2;
        const y = rect.top + element.offsetHeight + 6;
        return { x, y };
    }

    private createTooltip(x: number, y: number) {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        const tooltipElement = document.createElement('div');
        tooltipElement.innerHTML = this.mgTooltip();
        document.body.appendChild(tooltipElement);
        tooltipElement.setAttribute('class', 'tooltip-container');
        tooltipElement.style.top = y.toString() + 'px';

        const rect = tooltipElement.getBoundingClientRect();
        tooltipElement.style.left = Math.max(Math.abs(rect.left) + 5, x).toString() + 'px';

        this.tooltipElement = tooltipElement;

        if (this.mgTooltipDisplayDelay()) {
            setTimeout(() => {
                this.ngOnDestroy();
            }, this.mgTooltipDisplayDelay());
        }
    }
}
