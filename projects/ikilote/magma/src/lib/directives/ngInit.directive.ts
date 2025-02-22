import { Directive, OnInit, output } from '@angular/core';

@Directive({
    selector: '[ngInit]',
    standalone: true,
})
export class MagmaNgInitDirective implements OnInit {
    ngInit = output<void>();

    ngOnInit() {
        this.ngInit.emit();
    }
}
