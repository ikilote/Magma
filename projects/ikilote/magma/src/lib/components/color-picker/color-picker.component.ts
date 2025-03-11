import { CdkDrag, CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnChanges,
    SimpleChanges,
    booleanAttribute,
    computed,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import Color from 'colorjs.io';

import { Logger } from '../../services/logger';
import { MagmaTabContent } from '../tabs/tab-content.component';
import { MagmaTabTitle } from '../tabs/tab-title.component';
import { MagmaTabs } from '../tabs/tabs.component';

export type MagmaColorPickerTexts = { hsl?: string; palette?: string };

export const magmaColorPickerPalette = [
    // line 1
    '#99c1f1',
    '#8ff0a4',
    '#f9f06b',
    '#ffbe6f',
    '#f66151',
    '#dc8add',
    '#cdab8f',
    '#fff',
    '#777',
    // line 2
    '#62a0ea',
    '#57e389',
    '#f8e45c',
    '#ffa348',
    '#ed333b',
    '#c061cb',
    '#b5835a',
    '#f6f6f6',
    '#5e5e5e',
    // line 3
    '#3584e4',
    '#33d17a',
    '#f6d32d',
    '#ff7800',
    '#e01b24',
    '#9141ac',
    '#986a44',
    '#ddd',
    '#3d3d3d',
    // line 4
    '#1c71d8',
    '#2ec27e',
    '#f5c211',
    '#e66100',
    '#c01c28',
    '#813d9c',
    '#865e3c',
    '#c0c0c0',
    '#313131',
    // line 5
    '#1a5fb4',
    '#26a269',
    '#e5a50a',
    '#c64600',
    '#a51d2d',
    '#613583',
    '#63452c',
    '#9a9a9a',
    '#000',
];

@Component({
    selector: 'color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
    imports: [FormsModule, CdkDrag, MagmaTabs, MagmaTabTitle, MagmaTabContent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.--hue]': 'rangeHue',
        '[style.--alpha.%]': 'rangeAlpha * 100',
        '[class.embedded]': 'embedded()',
        '[class.on-drag]': 'startDrag',
        '[class.readonly]': 'readonly()',
    },
})
export class MagmaColorPickerComponent implements OnChanges, AfterViewInit {
    readonly logger = inject(Logger);
    readonly cd = inject(ChangeDetectorRef);

    readonly zone = viewChild.required<ElementRef<HTMLDivElement>>('cursorZone');
    readonly drag = viewChild.required(CdkDrag);

    readonly color = input<string | undefined>('');
    readonly embedded = input(false, { transform: booleanAttribute });
    readonly alpha = input(false, { transform: booleanAttribute });
    readonly readonly = input(false, { transform: booleanAttribute });
    readonly clearButton = input(false, { transform: booleanAttribute });
    readonly texts = input<MagmaColorPickerTexts | undefined>({});
    readonly palette = input<string[] | undefined>();
    readonly datalist = input<string[]>();

    readonly colorChange = output<string>();

    protected rangeHue = 0;
    protected rangeAlpha = 1;
    protected rangeLight = 0;
    protected rangeSature = 0;

    protected hsla = '';
    protected rgba = '';
    protected hexa = '';

    protected pos: Point = { x: 0, y: 0 };
    protected _palette = computed(() => (this.palette()?.length ? this.palette() : magmaColorPickerPalette));

    protected startDrag = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['color'] && changes['color'].currentValue) {
            try {
                const colorObject = new Color(changes['color'].currentValue);
                if (!this.alpha()) {
                    colorObject.alpha = 1;
                }
                this.updateWithHLS(colorObject);
            } catch (e) {
                this.logger.log('[MagmaColorPickerComponent] Invalid color');
            }
        } else if (changes['alpha'] && !changes['alpha'].currentValue && this.rangeAlpha !== 1) {
            const color = this.hexa || this.color();
            if (color) {
                const colorObject = new Color(color);
                if (!this.alpha()) {
                    colorObject.alpha = 1;
                }
                this.updateWithHLS(colorObject);
            }
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const color = this.color();
            if (color) {
                const colorObject = new Color(color);
                if (!this.alpha()) {
                    colorObject.alpha = 1;
                }
                this.updateWithHLS(colorObject);
                this.cd.detectChanges();
            }
        }, 0);
    }

    clear() {
        this.rangeHue = 0;
        this.rangeAlpha = 1;
        this.rangeLight = 0;
        this.rangeSature = 0;

        this.hsla = '';
        this.rgba = '';
        this.hexa = '';

        this.pos = { x: 0, y: 0 };

        this.colorChange.emit(this.hexa);
    }

    protected dragStart() {
        this.startDrag = true;
    }

    protected dragEnd(event: CdkDragEnd<any>) {
        const { x, y } = event.source._dragRef['_activeTransform'];
        const { clientWidth, clientHeight } = this.zone().nativeElement;
        this.rangeLight = Math.round((x / (clientWidth - 10)) * 100);
        this.rangeSature = Math.round((y / (clientHeight - 10)) * 100);
        this.updateColor();
        setTimeout(() => {
            this.startDrag = false;
        }, 10);
    }

    tabChange(id: string) {
        if (id === 'hsl') {
            setTimeout(() => {
                this.updateHex(this.hexa);
                this.cd.detectChanges();
            }, 10);
        }
    }

    protected updateHex(value: string) {
        try {
            const colorObject = new Color(value);
            if (!this.alpha()) {
                colorObject.alpha = 1;
            }
            this.updateWithHLS(colorObject);
        } catch (e) {
            this.logger.log('[MagmaColorPickerComponent] Invalid color');
        }
    }

    protected click(event: MouseEvent) {
        if (!this.startDrag && !this.readonly()) {
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
        this.rangeHue = 360 - (hls.h || 0);
        this.rangeAlpha = hls.alpha;
        this.rangeSature = 100 - hls.s;
        this.rangeLight = 100 - (100 * hls.l) / (100 - hls.s / 2);

        // position calculation
        const { clientWidth, clientHeight } = this.zone().nativeElement;
        this.pos = {
            x: ((clientWidth - 10) * (this.rangeLight > 0 ? this.rangeLight : 0)) / 100,
            y:
                ((clientHeight - 10) * (this.rangeLight > 0 ? this.rangeSature : this.rangeSature - this.rangeLight)) /
                100,
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
            this.alpha() ? this.rangeAlpha : 1,
        );

        this.hexa = color.toGamut({ space: 'srgb' }).to('srgb').toString({ format: 'hex' });
        this.rgba = color.to('srgb').toString({ precision: 1 });
        this.hsla = color.to('hsl').toString();

        this.colorChange.emit(this.hexa);
    }
}
