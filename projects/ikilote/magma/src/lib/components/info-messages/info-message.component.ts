import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, output } from '@angular/core';

import { MagmaMessageInfo } from '../../services/messages';

export type ContextMessageInputs = { context?: InfoMessageComponent } & Record<string, any>;

@Component({
    selector: 'info-message',
    templateUrl: './info-message.component.html',
    styleUrls: ['./info-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgComponentOutlet],
    host: {
        '[class]': 'classes()',
        '[style.--current-pos.px]': 'this._pos ?? null',
        '[style.--current-height.px]': 'this._height ?? null',
        '[style.--info-message-progress-time]': 'this.message()?.time',
    },
})
export class InfoMessageComponent {
    // inject

    protected readonly element = inject(ElementRef);

    // input

    readonly message = input<MagmaMessageInfo>();

    // output

    readonly destruct = output<MagmaMessageInfo>();

    /// host

    protected _closeClass = false;
    protected _pos!: number;
    protected _height!: number;

    protected classes() {
        return [this.message()?.type, this._closeClass ? 'close' : null].filter(e => e);
    }

    @HostListener('click')
    click() {
        this._pos = this.element?.nativeElement.offsetTop;
        this._height = this.element?.nativeElement.height;
        this._closeClass = true;

        setTimeout(() => {
            this.close();
        }, 700);
    }

    animationend() {
        this.click();
    }

    close() {
        this.destruct.emit(this.message()!);
    }

    withContext(inputs?: ContextMessageInputs) {
        return { ...inputs, ...{ context: this as any } };
    }
}
