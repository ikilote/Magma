import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  booleanAttribute,
  computed,
  input,
  viewChildren,
} from '@angular/core';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { MagmaStopPropagationDirective } from '../../directives/stop-propagation.directive';
import { toISODate } from '../../utils/date';
import { MagmaDatetimeType } from '../datetime-picker/datetime-picker.component';
import { MagmaDatetimePicker } from '../datetime-picker/datetime-picker.directive';

type PlaceholderInfos = {
    dd: string;
    h1: string;
    h2: string;
    h3: string;
    hh: string;
    min: string;
    mm: string;
    mmm: string;
    s1: string;
    s2: string;
    s3: string;
    sec: string;
    yyyy: string;
};

type TypeData = 'day' | 'month' | 'year' | 'hours' | 'minutes' | 'seconds' | 'milli';

let counter = 0;

const languages: Record<string, string | { format: string; type: 'dmy' | 'ymd' | 'mdy' }> = {
    // --- language without country (more one country) ---
    fr: 'jj/mm/aaaa hh:mm:ss:sss', // French
    en: { format: 'mm/dd/yyyy hh:mm:ss:sss', type: 'mdy' }, // English
    es: 'dd/mm/aaaa hh:mm:ss:sss', // Spanish
    de: 'tt.mm.jjjj hh:mm:ss:sss', // German
    pt: 'dd/mm/aaaa hh:mm:ss:sss', // Portuguese
    zh: { format: 'yyyy/mm/dd hh:mm:ss:sss', type: 'ymd' }, // Chinese

    // --- EUROPE (Nordic & Western) ---
    'fr-FR': 'jj/mm/aaaa hh:mm:ss:sss', // France
    'fr-BE': 'jj/mm/aaaa hh:mm:ss:sss', // Belgium
    'fr-CH': 'jj.mm.aaaa hh:mm:ss:sss', // Switzerland
    'en-GB': 'dd/mm/yyyy hh:mm:ss:sss', // United Kingdom
    'en-IE': 'dd/mm/yyyy hh:mm:ss:sss', // Ireland
    'de-DE': 'tt.mm.jjjj hh:mm:ss:sss', // Germany
    'de-AT': 'tt.mm.jjjj hh:mm:ss:sss', // Austria
    'it-IT': 'gg/mm/aaaa oo:mm:ss:sss', // Italy
    'es-ES': 'dd/mm/aaaa hh:mm:ss:sss', // Spain
    'pt-PT': 'dd/mm/aaaa hh:mm:ss:sss', // Portugal
    'nl-NL': 'dd-mm-jjjj uu:mm:ss:sss', // Netherlands
    'da-DK': 'dd.mm.åååå tt:mm:ss:sss', // Denmark
    'nb-NO': 'dd.mm.åååå tt:mm:ss:sss', // Norway
    'sv-SE': 'åååå-mm-dd tt:mm:ss:sss', // Sweden
    'fi-FI': 'pp.kk.vvvv tt:mm:ss:sss', // Finland
    'is-IS': 'dd.mm.áááá kk:mm:ss:sss', // Iceland

    // --- EUROPE (Central & Eastern) ---
    'pl-PL': 'dd.mm.rrrr gg:mm:ss:sss', // Poland
    'cs-CZ': 'dd.mm.rrrr hh:mm:ss:sss', // Czech Republic
    'sk-SK': 'dd.mm.rrrr hh:mm:ss:sss', // Slovakia
    'hu-HU': { format: 'éééé.mm.dd. óó:pp:mm:mmm', type: 'ymd' }, // Hungary
    'ro-RO': 'zz.ll.aaaa oo:mm:ss:sss', // Romania
    'bg-BG': 'дд.мм.гггг чч:мм:сс:ссс', // Bulgaria
    'el-GR': 'ηη/μμ/εεεε ωω:λλ:δδ:χχχ', // Greece
    'ru-RU': 'дд.мм.гггг чч:мм:сс:ссс', // Russia
    'uk-UA': 'дд.мм.рррр гг:хх:сс:ммм', // Ukraine
    'be-BY': 'дд.мм.гггг гг:хх:сс:ммм', // Belarus
    'et-EE': 'pp.kk.aaaa tt:mm:ss:sss', // Estonia
    'lv-LV': 'dd.mm.gggg. pp:mm:ss:sss', // Latvia
    'lt-LT': { format: 'mmmm-mm-dd vv:mm:ss:sss', type: 'ymd' }, // Lithuania
    'sl-SI': 'dd.mm.llll uu:mm:ss:sss', // Slovenia
    'hr-HR': 'dd.mm.gggg. ss:mm:ss:sss', // Croatia
    'sr-RS': 'dd.mm.gggg. čč:mm:ss:sss', // Serbia
    'tr-TR': 'gg.aa.yyyy ss:dd:ss:mmm', // Turkey

    // --- AMERICAS ---
    'en-US': { format: 'mm/dd/yyyy hh:mm:ss:sss', type: 'mdy' }, // United States
    'en-CA': { format: 'yyyy-mm-dd hh:mm:ss:sss', type: 'ymd' }, // Canada (English)
    'fr-CA': { format: 'aaaa-mm-jj hh:mm:ss:sss', type: 'ymd' }, // Canada (French)
    'es-MX': 'dd/mm/aaaa hh:mm:ss:sss', // Mexico
    'es-AR': 'dd/mm/aaaa hh:mm:ss:sss', // Argentina
    'es-CO': 'dd/mm/aaaa hh:mm:ss:sss', // Colombia
    'es-CL': 'dd-mm-aaaa hh:mm:ss:sss', // Chile
    'pt-BR': 'dd/mm/aaaa hh:mm:ss:sss', // Brazil

    // --- ASIA & PACIFIC ---
    'zh-CN': { format: 'yyyy/mm/dd hh:mm:ss:sss', type: 'ymd' }, // China
    'zh-TW': { format: 'yyyy/mm/dd hh:mm:ss:sss', type: 'ymd' }, // Taiwan
    'ja-JP': { format: 'yyyy/mm/dd hh:mm:ss:sss', type: 'ymd' }, // Japan
    'ko-KR': { format: 'yyyy. mm. dd. hh:mm:ss:sss', type: 'ymd' }, // South Korea
    'vi-VN': 'dd/mm/aaaa hh:mm:ss:sss', // Vietnam
    'th-TH': 'วว/ดด/ปปปป ชช:นน:วว:พพพ', // Thailand
    'id-ID': 'hh/bb/tttt jj:mm:dd:mmm', // Indonesia
    'hi-IN': 'dd/mm/yyyy hh:mm:ss:sss', // India
    'en-AU': 'dd/mm/yyyy hh:mm:ss:sss', // Australia
    'en-NZ': 'dd/mm/yyyy hh:mm:ss:sss', // New Zealand

    // --- AFRICA & MIDDLE EAST ---
    'ar-SA': { format: 'yyyy/mm/dd hh:mm:ss:sss', type: 'ymd' }, // Saudi Arabia
    'he-IL': 'dd.mm.yyyy hh:mm:ss:sss', // Israel
    'af-ZA': { format: 'jjjj-mm-dd hh:mm:ss:sss', type: 'ymd' }, // South Africa
    'sw-KE': 'dd/mm/aaaa hh:mm:ss:sss', // Kenya
};

const types: (MagmaDatetimeType | 'datetime-seconds' | 'datetime-milli' | 'month' | 'week')[] = [
    'date',
    'datetime-local',
    'time',
    'datetime-seconds',
    'datetime-milli',
    'month',
    'week',
];

const dateRegex = {
    dmy: /(?<dd>\S{2})(?<s1>[\/\-. ]+)(?<mm>\S{2})(?<s2>[\/\-. ]+)(?<yyyy>\S{4})(?<s3>[\/\-. ]+)(?<hh>\S{2})(?<h1>:)(?<min>\S{2})(?<h2>:)(?<sec>\S{2})(?<h3>.)(?<mmm>\S{3})/,
    ymd: /(?<yyyy>\S{4})(?<s2>[\/\-. ]+)(?<mm>\S{2})(?<s1>[\/\-. ]+)(?<dd>\S{2})(?<s3>[\/\-. ]+)(?<hh>\S{2})(?<h1>:)(?<min>\S{2})(?<h2>:)(?<sec>\S{2})(?<h3>.)(?<mmm>\S{3})/,
    mdy: /(?<mm>\S{2})(?<s1>[\/\-. ]+)(?<dd>\S{2})(?<s2>[\/\-. ]+)(?<yyyy>\S{4})(?<s3>[\/\-. ]+)(?<hh>\S{2})(?<h1>:)(?<min>\S{2})(?<h2>:)(?<sec>\S{2})(?<h3>.)(?<mmm>\S{3})/,
};

type fieldName = 'day' | 'month' | 'year' | 'hours' | 'minutes' | 'seconds' | 'milli';

@Component({
    selector: 'mg-input-date',
    templateUrl: './input-date.component.html',
    styleUrl: './input-date.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, FormsModule, MagmaDatetimePicker, MagmaStopPropagationDirective],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputDate },
        { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputDate, multi: true },
        { provide: NG_VALIDATORS, useExisting: MagmaInputDate, multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputDate
    extends MagmaInputCommon<(string | { label?: string; value: string })[]>
    implements OnChanges
{
    override readonly componentName: string = 'input-date';
    protected override counter = counter++;

    readonly type = input<MagmaDatetimeType | 'datetime-seconds' | 'datetime-milli'>();
    protected readonly _type = computed(() => (types.includes(this.type()) ? this.type() : 'date')!);
    readonly hideDatePicker = input(false, { transform: booleanAttribute });
    readonly lang = input<string>();

    readonly input = viewChildren<ElementRef<HTMLInputElement>>('input');

    readonly datePicker = viewChildren(MagmaDatetimePicker);

    override get inputElement(): HTMLElement | undefined {
        return this.input()?.[0]?.nativeElement;
    }

    protected readonly _year = computed(
        () => this.refreshTrigger() || (this._value ? this._value.substring(0, 4) : ''),
    );
    protected readonly _month = computed(
        () => this.refreshTrigger() || (this._value ? this._value.substring(5, 7) : ''),
    );
    protected readonly _day = computed(
        () => this.refreshTrigger() || (this._value ? this._value.substring(8, 10) : ''),
    );
    protected readonly _hours = computed(
        () => this.refreshTrigger() || (this._value ? this._value.substring(11, 13) : ''),
    );
    protected readonly _minutes = computed(
        () => this.refreshTrigger() || (this._value ? this._value.substring(14, 16) : ''),
    );
    protected readonly _seconds = computed(
        () => this.refreshTrigger() || (this._value ? this._value.substring(17, 19) : ''),
    );
    protected readonly _milli = computed(
        () => this.refreshTrigger() || (this._value ? this._value.substring(20, 23) : ''),
    );

    orderType: 'dmy' | 'ymd' | 'mdy' = 'dmy';

    protected placeholderInfos: PlaceholderInfos | undefined = undefined;

    protected valueCache: Record<TypeData, number> = {
        year: 0,
        month: 0,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milli: 0,
    };

    protected lockFocus = false;

    constructor() {
        super();
        this.placeholderCompute(this.lang());
    }

    override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);

        if (changes['lang']) {
            this.placeholderCompute(changes['lang'].currentValue);
        }
        if (changes['value']) {
            this.updateValueCache(changes['value'].currentValue);
        }
    }

    private updateValueCache(value: string) {
        this.valueCache = {
            year: this.valueCacheSubstring(value, 0, 4),
            month: this.valueCacheSubstring(value, 5, 7),
            day: this.valueCacheSubstring(value, 8, 10),
            hours: this.valueCacheSubstring(value, 11, 13),
            minutes: this.valueCacheSubstring(value, 14, 16),
            seconds: this.valueCacheSubstring(value, 17, 19),
            milli: this.valueCacheSubstring(value, 20, 23),
        };

        this.updateValueWithCache(false);
    }

    private valueCacheSubstring(value: string, a: number, b: number): number {
        return value ? +value?.substring(a, b) || 0 : 0;
    }

    override writeValue(value: any): void {
        this.updateValueCache(value);
        super.writeValue(value);
        // force refresh input
        this.refreshTrigger.set(null);
        this.refreshTrigger.set(false);
    }

    placeholderCompute(lang?: string) {
        const lg = lang || this.lang() || navigator.language || 'en';

        let format = languages[lg];
        if (!format) {
            const key = Object.keys(languages).find(e => e.startsWith(lg));
            if (key) {
                format = languages[key];
            }
        }

        if (typeof format === 'string') {
            format = { format, type: 'dmy' };
        } else if (!format) {
            format = languages['en'] as { format: string; type: 'dmy' | 'ymd' | 'mdy' };
        }

        this.orderType = format.type;

        // format placeholder texts: default d/m/y
        let match = dateRegex.dmy;
        switch (this.orderType) {
            case 'ymd':
                match = dateRegex.ymd;
                break;
            case 'mdy':
                match = dateRegex.mdy; // USA only ?
                break;
        }
        this.placeholderInfos = format.format.match(match)!.groups as PlaceholderInfos;
    }

    focus(event: FocusEvent, focus: boolean, type: fieldName) {
        if (!focus) {
            this.onTouched();
            if (this.ngControl?.control) {
                this.validate(this.ngControl.control);
            }
            const element = event.target as HTMLInputElement;
            let size = 2;
            if (type === 'milli') {
                size = 3;
            } else if (type === 'year') {
                size = 4;
            }

            if (element?.value.length < size) {
                element.value = `${+element.value}`.padStart(size, '0');
            } else if (element?.value.length > size) {
                element.value = `${+element.value}`;
            }
        }
    }

    datePickerClose(date: string) {
        this.onChange(date);
        this.writeValue(date);
        this.onTouched();
        if (this.ngControl?.control) {
            this.validate(this.ngControl.control);
        }
    }

    keydown(event: KeyboardEvent) {
        if (event.key.includes('Arrow')) {
            this.lockFocus = true;
        }
    }

    keyup(event: KeyboardEvent) {
        if (event.key.includes('Arrow')) {
            this.lockFocus = false;
        }
    }

    changeDate(event: Event, type: fieldName) {
        this.updateDate(event, type);
        this.update.emit(this._value);
    }

    updateDate(event: Event, type: fieldName) {
        const input = event.target as HTMLInputElement;
        const value = input?.valueAsNumber;
        let padStart = 2;
        if (value) {
            let next = false;
            switch (type) {
                case 'day':
                    if (value > 3) {
                        if (value > 31) {
                            input.valueAsNumber = 31;
                        }
                        if (!this.lockFocus) {
                            next = true;
                        }
                    }
                    padStart = 2;
                    break;
                case 'month':
                    if (value > 1) {
                        if (value > 12) {
                            input.valueAsNumber = 12;
                        }
                        if (!this.lockFocus) {
                            next = true;
                        }
                    }

                    break;
                case 'year':
                    if (value > 9999) {
                        input.valueAsNumber = 9999;
                        if (!this.lockFocus) {
                            next = true;
                        }
                    }
                    padStart = 4;

                    break;
                case 'hours':
                    if (value > 3) {
                        if (value > 23) {
                            input.valueAsNumber = 23;
                        }
                        if (!this.lockFocus) {
                            next = true;
                        }
                    }

                    break;
                case 'minutes':
                case 'seconds':
                    if (value > 5) {
                        if (value > 59) {
                            input.valueAsNumber = 59;
                        }
                        if (!this.lockFocus) {
                            next = true;
                        }
                    }

                    break;
                case 'milli':
                    if (value > 999) {
                        input.valueAsNumber = 999;
                    }
                    padStart = 3;
                    break;
            }
            if (this.lockFocus) {
                input.value = input.value.padStart(padStart, '0');
            }
            if (next) {
                this.focusNext(input.id);
            }

            this.valueCache[type] = input.valueAsNumber;

            this.updateValueWithCache();
        }
    }

    private updateValueWithCache(change = true) {
        let valueDate = toISODate(
            new Date(
                Date.UTC(
                    this.valueCache.year,
                    this.valueCache.month - 1,
                    this.valueCache.day,
                    this.valueCache.hours,
                    this.valueCache.minutes,
                    this.valueCache.seconds,
                    this.valueCache.milli,
                ),
            ),
        );

        switch (this.type()) {
            case 'datetime-local':
                valueDate = valueDate?.substring(0, 16);
                break;
            case 'time':
                valueDate = valueDate?.substring(11, 16);
                break;
            case 'datetime-seconds':
                valueDate = valueDate?.substring(0, 19);
                break;
            case 'datetime-milli':
                valueDate = valueDate?.substring(0, 23);
                break;
            case 'date':
            default:
                valueDate =
                    this.valueCache.year && this.valueCache.month && this.valueCache.year
                        ? valueDate?.substring(0, 10)
                        : undefined;
                break;
        }

        super.writeValue(valueDate);
        if (change) {
            this.onChange(valueDate);
            this.update.emit(valueDate);
        }
    }

    private focusNext(id: string) {
        document.querySelector<HTMLInputElement>(`#${id} ~ input`)?.focus();
    }
}
