import {
    Directive,
    ElementRef,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    inject,
    input,
} from '@angular/core';

import autosize from 'autosize';

@Directive({
    selector: 'textarea[autosize]',
})
export class MagmaTextareaAutosizeDirective implements OnInit, OnChanges, OnDestroy {
    private readonly elementRef = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);

    readonly autosizeDisabled = input(false, { transform: booleanAttribute });

    private destroyed = false;
    private initTimer?: ReturnType<typeof setTimeout>;

    /** Lazily resolved on first use so tests can mock `CSS.supports` before `ngOnInit`. */
    private get fieldSizingSupported(): boolean {
        return CSS.supports('field-sizing', 'content');
    }

    ngOnInit() {
        if (!this.autosizeDisabled()) {
            if (this.fieldSizingSupported) {
                this.elementRef.nativeElement.classList.add('auto-field');
            } else {
                this.initTimer = setTimeout(() => {
                    if (!this.destroyed && this.elementRef.nativeElement.nodeName === 'TEXTAREA') {
                        autosize(this.elementRef.nativeElement);
                    }
                });
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['autosizeDisabled']) {
            if (
                changes['autosizeDisabled'].previousValue === true &&
                changes['autosizeDisabled'].currentValue === false
            ) {
                this.ngOnInit();
            } else if (
                changes['autosizeDisabled'].previousValue === false &&
                changes['autosizeDisabled'].currentValue === true
            ) {
                this.ngOnDestroy();
            }
        }
    }

    ngOnDestroy(): void {
        this.destroyed = true;
        if (this.initTimer) {
            clearTimeout(this.initTimer);
            this.initTimer = undefined;
        }
        if (this.fieldSizingSupported) {
            this.elementRef.nativeElement.classList.remove('auto-field');
        } else {
            autosize.destroy(this.elementRef.nativeElement);
        }
    }
}
