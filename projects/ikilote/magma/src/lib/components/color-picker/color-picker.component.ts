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
    readonly zone = viewChild.required<ElementRef<HTMLDivElement>>('cursorZone');
    readonly drag = viewChild.required(CdkDrag);

    readonly color = input('#d94040');

    readonly update = output<string>();

    protected rangeHue = 0;
    protected rangeAlpha = 1;
    protected rangeLight = 0;
    protected rangeSature = 0;

    protected hsla = '';
    protected rgba = '';
    protected hexa = '';

    protected pos: Point = { x: 0, y: 0 };

    private startDrag = false;

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
            this.updateWithHLS(new Color(this.color()));
        }, 100);
    }

    dragStart() {
        this.startDrag = true;
    }

    dragEnd(event: CdkDragEnd<any>) {
        const { x, y } = event.source._dragRef['_activeTransform'];
        const { clientWidth, clientHeight } = this.zone().nativeElement;
        this.rangeLight = Math.round((x / (clientWidth - 10)) * 100);
        this.rangeSature = Math.round((y / (clientHeight - 10)) * 100);
        this.updateColor();
        setTimeout(() => {
            this.startDrag = false;
        }, 10);
    }

    updateHex(value: string) {
        try {
            this.updateWithHLS(new Color(value));
        } catch (e) {
            console.log('Invalid color');
        }
    }

    protected click(event: MouseEvent) {
        if (!this.startDrag) {
            const { layerX, layerY } = event;
            const { clientWidth, clientHeight } = this.zone().nativeElement;
            this.rangeLight = Math.round((layerX / (clientWidth - 10)) * 100);
            this.rangeSature = Math.round((layerY / (clientHeight - 10)) * 100);
            this.drag().setFreeDragPosition({ x: layerX - 5, y: layerY - 5 });
            this.updateColor();
        }
    }

    private updateWithHLS(color: Color) {
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
    }

    protected updateColor() {
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
