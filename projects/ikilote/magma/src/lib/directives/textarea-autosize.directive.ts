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

    ngOnInit() {
        if (!this.autosizeDisabled()) {
            setTimeout(() => {
                if (this.elementRef.nativeElement.nodeName === 'TEXTAREA') {
                    console.log(this.elementRef.nativeElement);
                    autosize(this.elementRef.nativeElement);
                }
            });
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
        autosize.destroy(this.elementRef.nativeElement);
    }
}
