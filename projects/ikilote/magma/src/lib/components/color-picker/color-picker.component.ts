import { CdkDrag, CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    input,
    output,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import Color from 'colorjs.io';

@Component({
    selector: 'color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
    imports: [FormsModule, CdkDrag],
    host: {
        '[style.--hue]': 'rangeHue',
        '[style.--alpha.%]': 'rangeAlpha',
    },
})
export class ColorPickerComponent implements OnInit, OnChanges, AfterViewInit {
    zone = viewChild.required<ElementRef<HTMLDivElement>>('cursorZone');
    drag = viewChild.required(CdkDrag);

    color = input('#d94040');

    update = output<string>();

    rangeHue = 0;
    rangeAlpha = 1;
    rangeLight = 0;
    rangeSature = 0;

    hslac = '';
    hsla = '';
    rgba = '';
    hexa = '';

    pos: Point = { x: 0, y: 0 };

    ngOnInit(): void {
        console.log('ngOnInit');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['color']) {
            console.log('ngOnChanges');
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const color = new Color(this.color());
            const hls = color.toGamut({ space: 'hsl' }).to('hsl');

            // value calculation
            this.rangeHue = hls.h;
            this.rangeAlpha = hls.alpha;
            this.rangeSature = 100 - hls.s;
            this.rangeLight = 100 - (100 * hls.l) / (100 - hls.s / 2);

            // position calculation
            const { clientWidth, clientHeight } = this.zone().nativeElement;
            this.pos = {
                x: ((clientWidth - 10) * this.rangeLight) / 100,
                y: ((clientHeight - 10) * this.rangeSature) / 100,
            };
            this.updateColor();
        }, 100);
    }

    dragEnd(event: CdkDragEnd<any>) {
        const { x, y } = event.source._dragRef['_activeTransform'];
        const { clientWidth, clientHeight } = this.zone().nativeElement;
        this.rangeLight = Math.round((x / (clientWidth - 10)) * 100);
        this.rangeSature = Math.round((y / (clientHeight - 10)) * 100);
        this.updateColor();
    }

    updateColor() {
        const color = new Color(
            'hsl',
            [
                360 - this.rangeHue,
                100 - this.rangeSature,
                (50 + this.rangeSature / 2) * ((100 - this.rangeLight) / 100),
            ],
            this.rangeAlpha,
        );

        this.hexa = color.toGamut({ space: 'srgb' }).to('srgb').toString({ format: 'hex' });
        this.rgba = color.to('srgb').toString({ precision: 1 });
        this.hsla = color.to('hsl').toString();

        this.update.emit(this.hexa);
    }
}
