import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';

import { MagmaInput } from './input.component';

@Component({
    selector: 'mg-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class MagmaInputText implements OnInit {
    readonly host = inject(MagmaInput, { optional: false, host: true });

    readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    readonly value = input();

    readonly update = output<string>();

    protected onError = false;

    get inputElement(): HTMLInputElement {
        return this.input()?.nativeElement;
    }

    ngOnInit(): void {
        console.log(this.host);
        if (!this.host) {
            this.onError = true;
        }

        setTimeout(() => {
            this.inputElement.value = `${this.value()}`;
        });
    }

    changeValue(value: Event) {
        console.log('change', value);
        // this.update.emit(value);
    }
    inputValue(value: Event) {
        console.log('input', value);
        // this.update.emit(value);
    }

    focus(value: boolean) {
        console.log('focus', value);
    }
}
