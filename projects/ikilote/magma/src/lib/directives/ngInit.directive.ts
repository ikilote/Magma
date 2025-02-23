import { Directive, OnInit, output } from '@angular/core';

@Directive({
    selector: '[ngInit]',
})
export class MagmaNgInitDirective implements OnInit {
    ngInit = output<void>();

    ngOnInit() {
        this.ngInit.emit();
    }
}
