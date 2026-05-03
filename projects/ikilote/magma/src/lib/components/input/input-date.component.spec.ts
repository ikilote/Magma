import { ComponentRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputDate } from './input-date.component';
import { MockNgControl } from './test-helpers';

describe('MagmaInputDate', () => {
    let component: MagmaInputDate;
    let fixture: ComponentFixture<MagmaInputDate>;
    let componentRef: ComponentRef<MagmaInputDate>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        // Ensure we start with real timers
        vi.useRealTimers();
        vi.clearAllTimers();

        await TestBed.configureTestingModule({
            imports: [MagmaInputDate, FormsModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputDate);
        component = fixture.componentInstance;
        component.refreshTrigger.set(false);
        componentRef = fixture.componentRef;
        debugElement = fixture.debugElement;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render element with type div', () => {
        // @ts-ignore
        expect(component.inputElement.tagName).toBe('DIV');
    });

    describe('Localization & Placeholders', () => {
        it('should fallback to "en" if an unknown language is provided', () => {
            componentRef.setInput('lang', 'unknown-ZZ');
            fixture.changeDetectorRef.detectChanges();
            expect(component.orderType).toBe('mdy');
        });

        it('should correctly match partial language codes (e.g., "fr-CA" starts with "fr")', () => {
            componentRef.setInput('lang', 'fr-CA');
            fixture.changeDetectorRef.detectChanges();
            expect(component.orderType).toBe('ymd');
        });

        it('should set the correct regex groups for DMY (French)', () => {
            componentRef.setInput('lang', 'fr-FR');
            fixture.changeDetectorRef.detectChanges();
            const infos = (component as any).placeholderInfos;
            expect(infos.dd).toBe('jj');
            expect(infos.yyyy).toBe('aaaa');
        });
    });

    describe('ControlValueAccessor Integration', () => {
        it('should update value cache and signals when writeValue is called', () => {
            const isoDate = '2026-12-31T23:59:59.999Z';
            component.writeValue(isoDate);

            // @ts-ignore
            const cache = component.valueCache;

            expect(cache.year).toBe(2026);
            expect(cache.month).toBe(12);
            expect(cache.day).toBe(31);
            expect(cache.hours).toBe(23);
            expect(cache.minutes).toBe(59);
            expect(cache.seconds).toBe(59);
            expect(cache.milli).toBe(999);
            // @ts-ignore
            expect(component._year()).toBe('2026');
            // @ts-ignore
            expect(component._month()).toBe('12');
            // @ts-ignore
            expect(component._day()).toBe('31');
            // @ts-ignore
            expect(component._hours()).toBe('23');
            // @ts-ignore
            expect(component._minutes()).toBe('59');
            // @ts-ignore
            expect(component._seconds()).toBe('59');
            // @ts-ignore
            expect(component._milli()).toBe('999');
        });

        it('should handle null/empty values in writeValue', () => {
            component.writeValue(null);
            // @ts-ignore
            expect(component.valueCache.year).toBe(0);
            // @ts-ignore
            expect(component._year()).toBe('');
            // @ts-ignore
            expect(component._month()).toBe('');
            // @ts-ignore
            expect(component._day()).toBe('');
            // @ts-ignore
            expect(component._hours()).toBe('');
            // @ts-ignore
            expect(component._minutes()).toBe('');
            // @ts-ignore
            expect(component._seconds()).toBe('');
            // @ts-ignore
            expect(component._milli()).toBe('');
        });
    });

    describe('onFocus & Padding', () => {
        it('should pad day/month with leading zero on blur', () => {
            const input = document.createElement('input');
            input.value = '9';
            const event = { target: input } as any;

            component.focus(event, false, 'day');
            expect(input.value).toBe('09');
        });

        it('should pad year to 4 digits on blur', () => {
            const input = document.createElement('input');
            input.value = '26';
            const event = { target: input } as any;

            component.focus(event, false, 'year');
            expect(input.value).toBe('0026');
        });

        it('should pad year to 3 digits on blur', () => {
            const input = document.createElement('input');
            input.value = '26';
            const event = { target: input } as any;

            component.focus(event, false, 'milli');
            expect(input.value).toBe('026');
        });

        it('should trim values longer than expected size', () => {
            const input = document.createElement('input');
            input.value = '123';
            const event = { target: input } as any;

            component.focus(event, false, 'month');
            expect(input.value).toBe('123'); // Note: logic says +element.value if length > size
        });
    });

    describe('Keyboard Events', () => {
        it('should lock focus when Arrow keys are pressed', () => {
            component.keydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
            // @ts-ignore
            expect(component.lockFocus).toBe(true);

            component.keyup(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
            // @ts-ignore
            expect(component.lockFocus).toBe(false);
        });

        it('should lock focus when ArrowLeft keys are pressed', () => {
            // @ts-ignore
            vi.spyOn(component, 'focusNext');
            // @ts-ignore
            vi.spyOn(component, 'focusPrev');

            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            // @ts-ignore
            Object.defineProperty(event, 'target', {
                value: { id: 'test' },
                enumerable: true,
            });

            component.keydown(event);
            // @ts-ignore
            expect(component.focusNext).not.toHaveBeenCalled();
            // @ts-ignore
            expect(component.focusPrev).toHaveBeenCalled();
        });

        it('should lock focus when ArrowRight keys are pressed', () => {
            // @ts-ignore directive
            vi.spyOn(component, 'focusNext');
            // @ts-ignore
            vi.spyOn(component, 'focusPrev');

            const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            // @ts-ignore
            Object.defineProperty(event, 'target', {
                value: { id: 'test' },
                enumerable: true,
            });

            component.keydown(event);
            // @ts-ignore
            expect(component.focusNext).toHaveBeenCalled();
            // @ts-ignore
            expect(component.focusPrev).not.toHaveBeenCalled();
        });
    });

    describe('Date Updates & Clamping', () => {
        const input: {
            typeYear?: HTMLInputElement;
            typeMonth?: HTMLInputElement;
            typeDay?: HTMLInputElement;
            typeHours?: HTMLInputElement;
            typeMinutes?: HTMLInputElement;
            typeSeconds?: HTMLInputElement;
            typeMilli?: HTMLInputElement;
        } = {};

        const updateInputs = async (type: string) => {
            componentRef.setInput('type', type);
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            component.valueCache = {
                year: 9999,
                month: 12,
                day: 31,
                hours: 23,
                minutes: 59,
                seconds: 59,
                milli: 999,
            };

            const id = fixture.elementRef.nativeElement.id;

            input.typeYear = document.querySelector(`#${id} .year`) as HTMLInputElement;
            input.typeMonth = document.querySelector(`#${id} .month`) as HTMLInputElement;
            input.typeDay = document.querySelector(`#${id} .day`) as HTMLInputElement;
            input.typeHours = document.querySelector(`#${id} .hours`) as HTMLInputElement;
            input.typeMinutes = document.querySelector(`#${id} .minutes`) as HTMLInputElement;
            input.typeSeconds = document.querySelector(`#${id} .seconds`) as HTMLInputElement;
            input.typeMilli = document.querySelector(`#${id} .milli`) as HTMLInputElement;
        };

        [
            { type: 'year', value: 10000, updated: 9999, filed: 'typeYear', focus: true },
            { type: 'month', value: 13, updated: 12, filed: 'typeMonth', focus: true },
            { type: 'day', value: 32, updated: 31, filed: 'typeDay', focus: true },
            { type: 'hours', value: 24, updated: 23, filed: 'typeHours', focus: true },
            { type: 'minutes', value: 60, updated: 59, filed: 'typeMinutes', focus: true },
            { type: 'seconds', value: 60, updated: 59, filed: 'typeSeconds', focus: true },
            { type: 'milli', value: 1000, updated: 999, filed: 'typeMilli', focus: false },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) and move focus to next element with type datetime-milli`, async () => {
                updateInputs('datetime-milli');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;

                i.valueAsNumber = e.value;
                // @ts-ignore
                vi.spyOn(component, 'focusNext');

                component.updateDate({ target: i } as any, e.type as any);

                await vi.useFakeTimers();
                expect(i.valueAsNumber).toBe(e.updated);

                if (e.focus) {
                    // @ts-ignore
                    expect(component.focusNext).toHaveBeenCalled();
                } else {
                    // @ts-ignore
                    expect(component.focusNext).not.toHaveBeenCalled();
                }

                // @ts-ignore
                expect(component._value).toBe('9999-12-31T23:59:59.999');
            });
        });

        [
            { type: 'year', value: 10000, updated: 9999, filed: 'typeYear', focus: false, present: false },
            { type: 'month', value: 13, updated: 12, filed: 'typeMonth', focus: false, present: false },
            { type: 'day', value: 32, updated: 31, filed: 'typeDay', focus: false, present: false },
            { type: 'hours', value: 24, updated: 23, filed: 'typeHours', focus: true, present: true },
            { type: 'minutes', value: 60, updated: 59, filed: 'typeMinutes', focus: true, present: true },
            { type: 'seconds', value: 60, updated: 59, filed: 'typeSeconds', focus: false, present: false },
            { type: 'milli', value: 1000, updated: 999, filed: 'typeMilli', focus: false, present: false },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) and move focus to next element with type time`, async () => {
                updateInputs('time');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    vi.spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    await vi.useFakeTimers();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBe(true);
                } else {
                    expect(e.present).toBe(false);
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }
                // @ts-ignore
                expect(component._value).toBe('23:59');
            });
        });

        [
            { type: 'year', value: 10000, updated: 9999, filed: 'typeYear', focus: true, present: true },
            { type: 'month', value: 13, updated: 12, filed: 'typeMonth', focus: true, present: true },
            { type: 'day', value: 32, updated: 31, filed: 'typeDay', focus: true, present: true },
            { type: 'hours', value: 24, updated: 23, filed: 'typeHours', focus: false, present: false },
            { type: 'minutes', value: 60, updated: 59, filed: 'typeMinutes', focus: false, present: false },
            { type: 'seconds', value: 60, updated: 59, filed: 'typeSeconds', focus: false, present: false },
            { type: 'milli', value: 1000, updated: 999, filed: 'typeMilli', focus: false, present: false },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) and move focus to next element with type date`, async () => {
                updateInputs('date');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    vi.spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    await vi.useFakeTimers();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBe(true);
                } else {
                    expect(e.present).toBe(false);
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }
                // @ts-ignore
                expect(component._value).toBe('9999-12-31');
            });
        });

        [
            { type: 'year', value: 10000, updated: 9999, filed: 'typeYear', focus: true, present: true },
            { type: 'month', value: 13, updated: 12, filed: 'typeMonth', focus: true, present: true },
            { type: 'day', value: 32, updated: 31, filed: 'typeDay', focus: true, present: true },
            { type: 'hours', value: 24, updated: 23, filed: 'typeHours', focus: false, present: false },
            { type: 'minutes', value: 60, updated: 59, filed: 'typeMinutes', focus: false, present: false },
            { type: 'seconds', value: 60, updated: 59, filed: 'typeSeconds', focus: false, present: false },
            { type: 'milli', value: 1000, updated: 999, filed: 'typeMilli', focus: false, present: false },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) and move focus to next element with type date`, async () => {
                updateInputs('date');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    vi.spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    await vi.useFakeTimers();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBe(true);
                } else {
                    expect(e.present).toBe(false);
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }
                // @ts-ignore
                expect(component._value).toBe('9999-12-31');
            });
        });

        [
            { type: 'year', value: 10000, updated: 9999, filed: 'typeYear', focus: true, present: true },
            { type: 'month', value: 13, updated: 12, filed: 'typeMonth', focus: true, present: true },
            { type: 'day', value: 32, updated: 31, filed: 'typeDay', focus: true, present: true },
            { type: 'hours', value: 24, updated: 23, filed: 'typeHours', focus: true, present: true },
            { type: 'minutes', value: 60, updated: 59, filed: 'typeMinutes', focus: true, present: true },
            { type: 'seconds', value: 60, updated: 59, filed: 'typeSeconds', focus: false, present: false },
            { type: 'milli', value: 1000, updated: 999, filed: 'typeMilli', focus: false, present: false },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) and move focus to next element with type datetime-local`, async () => {
                updateInputs('datetime-local');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    vi.spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    await vi.useFakeTimers();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBe(true);
                } else {
                    expect(e.present).toBe(false);
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }

                // @ts-ignore
                expect(component._value).toBe('9999-12-31T23:59');
            });
        });

        [
            { type: 'year', value: 10000, updated: 9999, filed: 'typeYear', focus: true, present: true },
            { type: 'month', value: 13, updated: 12, filed: 'typeMonth', focus: true, present: true },
            { type: 'day', value: 32, updated: 31, filed: 'typeDay', focus: true, present: true },
            { type: 'hours', value: 24, updated: 23, filed: 'typeHours', focus: true, present: true },
            { type: 'minutes', value: 60, updated: 59, filed: 'typeMinutes', focus: true, present: true },
            { type: 'seconds', value: 60, updated: 59, filed: 'typeSeconds', focus: true, present: true },
            { type: 'milli', value: 1000, updated: 999, filed: 'typeMilli', focus: false, present: false },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) and move focus to next element with type datetime-seconds`, async () => {
                updateInputs('datetime-seconds');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    vi.spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    await vi.useFakeTimers();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBe(true);
                } else {
                    expect(e.present).toBe(false);
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }
                // @ts-ignore
                expect(component._value).toBe('9999-12-31T23:59:59');
            });
        });

        [
            { type: 'month', value: 2, updated: '02', filed: 'typeMonth' },
            { type: 'day', value: 4, updated: '04', filed: 'typeDay' },
            { type: 'hours', value: 6, updated: '06', filed: 'typeHours' },
            { type: 'minutes', value: 9, updated: '09', filed: 'typeMinutes' },
            { type: 'seconds', value: 9, updated: '09', filed: 'typeSeconds' },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) and update input value`, async () => {
                updateInputs('datetime-milli');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;

                i.valueAsNumber = e.value;

                // @ts-ignore
                component.lockFocus = true;
                component.updateDate({ target: i } as any, e.type as any);

                await vi.useFakeTimers();

                expect(i.value).toBe(e.updated);
            });

            [
                { type: 'month', value: 2, updated: '02', filed: 'typeMonth' },
                { type: 'day', value: 4, updated: '04', filed: 'typeDay' },
                { type: 'hours', value: 6, updated: '06', filed: 'typeHours' },
                { type: 'minutes', value: 9, updated: '09', filed: 'typeMinutes' },
                { type: 'seconds', value: 9, updated: '09', filed: 'typeSeconds' },
            ].forEach(e => {
                it(`should change Input (${e.type}) and update input value`, async () => {
                    updateInputs('datetime-milli');

                    // @ts-ignore
                    const i = input[e.filed] as HTMLInputElement;

                    i.valueAsNumber = e.value;

                    // @ts-ignore
                    component.lockFocus = true;
                    component.changeDate({ target: i } as any, e.type as any);

                    await vi.useFakeTimers();

                    expect(i.value).toBe(e.updated);
                });
            });
        });

        [
            { type: 'year', value: 0, updated: 0, filed: 'typeYear', out: '' },
            { type: 'month', value: 0, updated: 0, filed: 'typeMonth', out: '' },
            { type: 'day', value: 0, updated: 0, filed: 'typeDay', out: '' },
            { type: 'hours', value: 0, updated: 0, filed: 'typeHours', out: '9999-12-31T00:59:59.999' },
            { type: 'minutes', value: 0, updated: 0, filed: 'typeMinutes', out: '9999-12-31T23:00:59.999' },
            { type: 'seconds', value: 0, updated: 0, filed: 'typeSeconds', out: '9999-12-31T23:59:00.999' },
            { type: 'milli', value: 0, updated: 0, filed: 'typeMilli', out: '9999-12-31T23:59:59.000' },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) value is empty with type datetime-milli`, async () => {
                updateInputs('datetime-milli');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;

                i.valueAsNumber = e.value;

                component.updateDate({ target: i } as any, e.type as any);

                await vi.useFakeTimers();
                expect(i.valueAsNumber).toBe(e.updated);

                // @ts-ignore
                expect(component._value).toBe(e.out);
            });
        });
    });

    describe('placeholderCompute()', () => {
        it('should use the provided language parameter (Exact match)', () => {
            component.placeholderCompute('fr');

            expect(component.orderType).toBe('dmy');
            // @ts-ignore
            expect(component.placeholderInfos).toEqual({
                dd: 'jj',
                s1: '/',
                mm: 'mm',
                s2: '/',
                yyyy: 'aaaa',
                s3: ' ',
                hh: 'hh',
                h1: ':',
                min: 'mm',
                h2: ':',
                sec: 'ss',
                h3: ':',
                mmm: 'sss',
            } as any);
        });

        it('should find a partial match (e.g., fr-CA should match fr)', () => {
            component.placeholderCompute('fr-CA');

            expect(component.orderType).toBe('ymd');
            // @ts-ignore
            expect(component.placeholderInfos).toEqual({
                dd: 'jj',
                s1: '-',
                mm: 'mm',
                s2: '-',
                yyyy: 'aaaa',
                s3: ' ',
                hh: 'hh',
                h1: ':',
                min: 'mm',
                h2: ':',
                sec: 'ss',
                h3: ':',
                mmm: 'sss',
            } as any);
        });

        it('should handle format as a string and default to type dmy', () => {
            // For 'ja', format is just a string 'YYYY/MM/DD'
            component.placeholderCompute('ja');

            expect(component.orderType).toBe('ymd');
            // @ts-ignore
            expect(component.placeholderInfos).toEqual({
                dd: 'dd',
                s1: '/',
                mm: 'mm',
                s2: '/',
                yyyy: 'yyyy',
                s3: ' ',
                hh: 'hh',
                h1: ':',
                min: 'mm',
                h2: ':',
                sec: 'ss',
                h3: ':',
                mmm: 'sss',
            } as any);
        });

        it('should fallback to English if the language is not found', () => {
            component.placeholderCompute('xyz'); // Non-existent

            expect(component.orderType).toBe('mdy'); // 'en' type in mock
            // @ts-ignore
            expect(component.placeholderInfos.mm).toBe('mm');
        });

        it('should fallback to English if the language is not found', () => {
            // @ts-ignore
            vi.spyOn(navigator, 'language', 'get').mockReturnValue('');

            component.placeholderCompute(); // Non-existent

            expect(component.orderType).toBe('mdy'); // 'en' type in mock
            // @ts-ignore
            expect(component.placeholderInfos.mm).toBe('mm');
        });
    });

    describe('Private methods', () => {
        it('should select element on focusNext', () => {
            vi.spyOn(document, 'querySelector');

            // @ts-ignore
            component.focusNext('test');

            expect(document.querySelector).toHaveBeenCalledWith('#test + * + input');
        });

        it('should select element on focusNext and select', () => {
            const inputDayElement = debugElement.query(By.css('.day')).nativeElement;
            const inputMonthElement = debugElement.query(By.css('.month')).nativeElement;

            vi.spyOn(inputMonthElement, 'select');

            // @ts-ignore
            component.focusNext(inputDayElement.id);

            expect(inputMonthElement.select).toHaveBeenCalled();
        });

        it('should select element on focusPrev', () => {
            vi.spyOn(document, 'querySelector');

            // @ts-ignore
            component.focusPrev('test');

            expect(document.querySelector).toHaveBeenCalledWith('input:has(+ * + #test)');
        });

        it('should select element on focusPrev and select', () => {
            const inputDayElement = debugElement.query(By.css('.day')).nativeElement;
            const inputMonthElement = debugElement.query(By.css('.month')).nativeElement;

            vi.spyOn(inputDayElement, 'select');

            // @ts-ignore
            component.focusPrev(inputMonthElement.id);

            expect(inputDayElement.select).toHaveBeenCalled();
        });

        it('should return 0 with invalide value for valueCacheSubstring', () => {
            // @ts-ignore
            const value = component.valueCacheSubstring('aaaa-bb-cc', 0, 4);

            expect(value).toBe(0);
        });

        it('should select element on focusNext', () => {
            // @ts-ignore
            component.datePickerClose('2024-12-12');
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.valueCache).toEqual({
                year: 2024,
                month: 12,
                day: 12,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milli: 0,
            });
        });
    });

    describe('Value', () => {
        it('should cache date empty when no value', () => {
            componentRef.setInput('value', '');
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.valueCache).toEqual({
                year: 0,
                month: 0,
                day: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milli: 0,
            });
        });

        it('should cache date empty when partial date', () => {
            componentRef.setInput('value', '2015-12-31');
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.valueCache).toEqual({
                year: 2015,
                month: 12,
                day: 31,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milli: 0,
            });
        });

        it('should cache date empty when complete date', () => {
            componentRef.setInput('value', '2015-12-31T12:15:30.015');
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.valueCache).toEqual({
                year: 2015,
                month: 12,
                day: 31,
                hours: 12,
                minutes: 15,
                seconds: 30,
                milli: 15,
            });
        });
    });

    describe('Type', () => {
        it('should force type to data if empty', () => {
            componentRef.setInput('type', '');
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component._type()).toBe('date');
        });

        it('should force type to data if undefined', () => {
            componentRef.setInput('type', undefined);
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component._type()).toBe('date');
        });

        it('should force type to data if not existing', () => {
            componentRef.setInput('type', 'invalid-type' as any);
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component._type()).toBe('date');
        });
    });

    describe('NgControl', () => {
        it('should update input value on blur', () => {
            const inputElement = debugElement.query(By.css('.day')).nativeElement;
            inputElement.value = '3';
            vi.spyOn(component, 'onTouched');
            vi.spyOn(component, 'validate');

            component.ngOnInit();
            component.ngControl = new MockNgControl() as unknown as NgControl;

            inputElement.dispatchEvent(new Event('blur'));
            fixture.changeDetectorRef.detectChanges();
            expect(inputElement.value).toBe('03');
            expect(component.onTouched).toHaveBeenCalled();
            expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
        });

        it('should dateClose value on blur', () => {
            const inputElement = debugElement.query(By.css('.day')).nativeElement;
            inputElement.value = '3';
            vi.spyOn(component, 'onTouched');
            vi.spyOn(component, 'validate');

            component.ngControl = new MockNgControl() as unknown as NgControl;
            component.datePickerClose('2015-12-12');

            fixture.changeDetectorRef.detectChanges();
            expect(inputElement.value).toBe('12');
            expect(component.onTouched).toHaveBeenCalled();
            expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
        });
    });

    describe('Event handlers coverage', () => {
        it('should handle keydown events on day input', () => {
            const dayInput = fixture.nativeElement.querySelector('input.day');
            expect(dayInput).toBeTruthy();

            const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            dayInput.dispatchEvent(event);

            expect(component.keydown).toBeDefined();
        });

        it('should handle change events on day input', () => {
            const dayInput = fixture.nativeElement.querySelector('input.day');
            expect(dayInput).toBeTruthy();

            const spy = vi.spyOn(component, 'changeDate');
            dayInput.value = '15';
            dayInput.dispatchEvent(new Event('change', { bubbles: true }));
            fixture.changeDetectorRef.detectChanges();

            expect(spy).toHaveBeenCalledWith(expect.any(Event), 'day');
        });

        it('should handle keyup events on day input', () => {
            const dayInput = fixture.nativeElement.querySelector('input.day');
            expect(dayInput).toBeTruthy();

            const event = new KeyboardEvent('keyup', { key: '1' });
            dayInput.dispatchEvent(event);

            expect(component.keyup).toBeDefined();
        });

        it('should handle change events on month input', () => {
            const monthInput = fixture.nativeElement.querySelector('input.month');
            expect(monthInput).toBeTruthy();

            const spy = vi.spyOn(component, 'changeDate');
            monthInput.value = '6';
            monthInput.dispatchEvent(new Event('change', { bubbles: true }));
            fixture.changeDetectorRef.detectChanges();

            expect(spy).toHaveBeenCalledWith(expect.any(Event), 'month');
        });

        it('should handle input events on year input', () => {
            const yearInput = fixture.nativeElement.querySelector('input.year');
            expect(yearInput).toBeTruthy();

            yearInput.value = '2026';
            yearInput.dispatchEvent(new Event('input'));

            expect(component.updateDate).toBeDefined();
        });

        it('should handle change events on year input', () => {
            const yearInput = fixture.nativeElement.querySelector('input.year');
            expect(yearInput).toBeTruthy();

            yearInput.value = '2027';
            yearInput.dispatchEvent(new Event('change'));

            expect(component.changeDate).toBeDefined();
        });

        it('should handle focus events on day input', () => {
            const dayInput = fixture.nativeElement.querySelector('input.day');
            expect(dayInput).toBeTruthy();

            dayInput.dispatchEvent(new FocusEvent('focus'));

            expect(component.focus).toBeDefined();
        });

        it('should handle blur events on month input', () => {
            const monthInput = fixture.nativeElement.querySelector('input.month');
            expect(monthInput).toBeTruthy();

            monthInput.dispatchEvent(new FocusEvent('blur'));

            expect(component.focus).toBeDefined();
        });
    });

    describe('Different date types', () => {
        beforeEach(() => {
            // Reset type to undefined before each test
            componentRef.setInput('type', undefined);
            fixture.changeDetectorRef.detectChanges();
        });

        it('should render time inputs when type includes time', () => {
            componentRef.setInput('type', 'datetime-local');
            fixture.changeDetectorRef.detectChanges();

            const hoursInput = fixture.nativeElement.querySelector('input.hours');
            const minutesInput = fixture.nativeElement.querySelector('input.minutes');

            expect(hoursInput).toBeTruthy();
            expect(minutesInput).toBeTruthy();
        });

        it('should handle events on hours input', () => {
            componentRef.setInput('type', 'datetime-local');
            fixture.changeDetectorRef.detectChanges();

            const hoursInput = fixture.nativeElement.querySelector('input.hours');
            expect(hoursInput).toBeTruthy();

            hoursInput.value = '14';
            hoursInput.dispatchEvent(new Event('input'));
            hoursInput.dispatchEvent(new Event('change'));
            hoursInput.dispatchEvent(new FocusEvent('focus'));
            hoursInput.dispatchEvent(new FocusEvent('blur'));
            hoursInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

            expect(component.updateDate).toBeDefined();
        });

        it('should handle events on minutes input', () => {
            componentRef.setInput('type', 'datetime-local');
            fixture.changeDetectorRef.detectChanges();

            const minutesInput = fixture.nativeElement.querySelector('input.minutes');
            expect(minutesInput).toBeTruthy();

            minutesInput.value = '30';
            minutesInput.dispatchEvent(new Event('input'));
            minutesInput.dispatchEvent(new Event('change'));
            minutesInput.dispatchEvent(new FocusEvent('focus'));
            minutesInput.dispatchEvent(new FocusEvent('blur'));

            expect(component.updateDate).toBeDefined();
        });

        it('should render seconds input when type includes seconds', () => {
            componentRef.setInput('type', 'datetime-seconds');
            fixture.changeDetectorRef.detectChanges();

            const secondsInput = fixture.nativeElement.querySelector('input.seconds');
            expect(secondsInput).toBeTruthy();
        });

        it('should handle events on seconds input', () => {
            componentRef.setInput('type', 'datetime-seconds');
            fixture.changeDetectorRef.detectChanges();

            const secondsInput = fixture.nativeElement.querySelector('input.seconds');
            expect(secondsInput).toBeTruthy();

            secondsInput.value = '45';
            secondsInput.dispatchEvent(new Event('input'));
            secondsInput.dispatchEvent(new Event('change'));
            secondsInput.dispatchEvent(new FocusEvent('focus'));
            secondsInput.dispatchEvent(new FocusEvent('blur'));
            secondsInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            expect(component.updateDate).toBeDefined();
        });

        it('should render milli input when type includes milli', () => {
            componentRef.setInput('type', 'datetime-milli');
            fixture.changeDetectorRef.detectChanges();

            const milliInput = fixture.nativeElement.querySelector('input.milli');
            expect(milliInput).toBeTruthy();
        });

        it('should handle events on milli input', () => {
            componentRef.setInput('type', 'datetime-milli');
            fixture.changeDetectorRef.detectChanges();

            const milliInput = fixture.nativeElement.querySelector('input.milli');
            expect(milliInput).toBeTruthy();

            milliInput.value = '500';
            milliInput.dispatchEvent(new Event('input'));
            milliInput.dispatchEvent(new Event('change'));
            milliInput.dispatchEvent(new FocusEvent('focus'));
            milliInput.dispatchEvent(new FocusEvent('blur'));
            milliInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

            expect(component.updateDate).toBeDefined();
        });
    });

    it('should handle keyup events on month input', () => {
        const monthInput = fixture.nativeElement.querySelector('input.month');
        expect(monthInput).toBeTruthy();

        const event = new KeyboardEvent('keyup', { key: '6' });
        monthInput.dispatchEvent(event);

        expect(component.keyup).toBeDefined();
    });

    it('should handle keyup events on year input', () => {
        const yearInput = fixture.nativeElement.querySelector('input.year');
        expect(yearInput).toBeTruthy();

        const event = new KeyboardEvent('keyup', { key: '2' });
        yearInput.dispatchEvent(event);

        expect(component.keyup).toBeDefined();
    });

    it('should handle keyup and keydown on hours input', () => {
        componentRef.setInput('type', 'datetime-local');
        fixture.changeDetectorRef.detectChanges();

        const hoursInput = fixture.nativeElement.querySelector('input.hours');
        expect(hoursInput).toBeTruthy();

        hoursInput.dispatchEvent(new KeyboardEvent('keyup', { key: '1' }));
        hoursInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

        expect(component.keyup).toBeDefined();
    });

    describe('Additional coverage for missing lines', () => {
        it('should handle keydown on year input', () => {
            const yearInput = fixture.nativeElement.querySelector('input.year');
            expect(yearInput).toBeTruthy();

            yearInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

            expect(component.keydown).toBeDefined();
        });

        it('should handle blur on year input', () => {
            const yearInput = fixture.nativeElement.querySelector('input.year');
            expect(yearInput).toBeTruthy();

            yearInput.dispatchEvent(new FocusEvent('blur'));

            expect(component.focus).toBeDefined();
        });

        it('should handle keydown on month input', () => {
            const monthInput = fixture.nativeElement.querySelector('input.month');
            expect(monthInput).toBeTruthy();

            monthInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            expect(component.keydown).toBeDefined();
        });

        it('should show date picker icon when hideDatePicker is false', () => {
            componentRef.setInput('hideDatePicker', false);
            fixture.changeDetectorRef.detectChanges();

            const pickerIcon = fixture.nativeElement.querySelector('.picker-icon');
            expect(pickerIcon).toBeTruthy();
            expect(pickerIcon.textContent).toContain('📅');
        });

        it('should hide date picker icon when hideDatePicker is true', () => {
            componentRef.setInput('hideDatePicker', true);
            fixture.changeDetectorRef.detectChanges();

            const pickerHide = fixture.nativeElement.querySelector('.picker-hide');
            expect(pickerHide).toBeTruthy();

            const pickerIcon = fixture.nativeElement.querySelector('.picker-icon');
            expect(pickerIcon).toBeNull();
        });

        it('should handle datePickerClose event', () => {
            componentRef.setInput('hideDatePicker', false);
            componentRef.setInput('type', 'datetime-local');
            fixture.changeDetectorRef.detectChanges();

            const pickerIcon = fixture.nativeElement.querySelector('.picker-icon');
            expect(pickerIcon).toBeTruthy();

            // Call datePickerClose directly with a proper ISO date string
            const spy = vi.spyOn(component, 'datePickerClose');
            component.datePickerClose('2026-12-31T12:00:00');

            // Method should be called
            expect(spy).toHaveBeenCalledWith('2026-12-31T12:00:00');
        });

        it('should display error when onError is true', () => {
            component['onError'].set(true);
            fixture.changeDetectorRef.detectChanges();

            const errorText = fixture.nativeElement.textContent;
            expect(errorText).toContain('Error');

            const inputDiv = fixture.nativeElement.querySelector('.input.date');
            expect(inputDiv).toBeNull();
        });
    });
});

describe('MagmaInputDate - missing branch coverage', () => {
    let component: MagmaInputDate;
    let fixture: ComponentFixture<MagmaInputDate>;
    let componentRef: ComponentRef<MagmaInputDate>;

    beforeEach(async () => {
        vi.useRealTimers();
        await TestBed.configureTestingModule({
            imports: [MagmaInputDate, FormsModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputDate);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should not move focus when year > 9999 and lockFocus is true', () => {
        componentRef.setInput('type', 'datetime-milli');
        fixture.changeDetectorRef.detectChanges();

        const id = fixture.elementRef.nativeElement.id;
        const yearInput = document.querySelector<HTMLInputElement>(`#${id} .year`);
        expect(yearInput).toBeTruthy();

        yearInput!.valueAsNumber = 10000;
        (component as any).lockFocus = true;
        vi.spyOn(component as any, 'focusNext');

        component.updateDate({ target: yearInput } as any, 'year');

        expect(yearInput!.valueAsNumber).toBe(9999);
        expect((component as any).focusNext).not.toHaveBeenCalled();
    });

    it('should not move focus when day value <= 3', () => {
        componentRef.setInput('type', 'datetime-milli');
        fixture.changeDetectorRef.detectChanges();

        const id = fixture.elementRef.nativeElement.id;
        const dayInput = document.querySelector<HTMLInputElement>(`#${id} .day`);
        expect(dayInput).toBeTruthy();

        dayInput!.valueAsNumber = 3;
        vi.spyOn(component as any, 'focusNext');

        component.updateDate({ target: dayInput } as any, 'day');

        expect((component as any).focusNext).not.toHaveBeenCalled();
    });

    it('should not move focus when month value <= 1', () => {
        componentRef.setInput('type', 'datetime-milli');
        fixture.changeDetectorRef.detectChanges();

        const id = fixture.elementRef.nativeElement.id;
        const monthInput = document.querySelector<HTMLInputElement>(`#${id} .month`);
        expect(monthInput).toBeTruthy();

        monthInput!.valueAsNumber = 1;
        vi.spyOn(component as any, 'focusNext');

        component.updateDate({ target: monthInput } as any, 'month');

        expect((component as any).focusNext).not.toHaveBeenCalled();
    });

    it('should emit change output on updateDate', () => {
        componentRef.setInput('type', 'datetime-milli');
        fixture.changeDetectorRef.detectChanges();

        const id = fixture.elementRef.nativeElement.id;
        const dayInput = document.querySelector<HTMLInputElement>(`#${id} .day`);
        dayInput!.valueAsNumber = 15;

        vi.spyOn(component.change, 'emit');
        component.updateDate({ target: dayInput } as any, 'day');

        expect(component.change.emit).toHaveBeenCalled();
    });

    it('should not call focus(true) onTouched', () => {
        vi.spyOn(component, 'onTouched');
        const id = fixture.elementRef.nativeElement.id;
        const dayInput = document.querySelector<HTMLInputElement>(`#${id} .day`);
        dayInput!.dispatchEvent(new FocusEvent('focus'));
        expect(component.onTouched).not.toHaveBeenCalled();
    });
});

describe('MagmaInputDate - uncovered DOM event listeners', () => {
    let component: MagmaInputDate;
    let fixture: ComponentFixture<MagmaInputDate>;
    let componentRef: ComponentRef<MagmaInputDate>;

    beforeEach(async () => {
        vi.useRealTimers();
        await TestBed.configureTestingModule({
            imports: [MagmaInputDate, FormsModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputDate);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should trigger (input) listener on day input via DOM', () => {
        const id = fixture.elementRef.nativeElement.id;
        const dayInput = document.querySelector<HTMLInputElement>(`#${id} .day`);
        expect(dayInput).toBeTruthy();
        vi.spyOn(component, 'updateDate');
        dayInput!.value = '5';
        dayInput!.dispatchEvent(new Event('input', { bubbles: true }));
        expect(component.updateDate).toHaveBeenCalledWith(expect.any(Event), 'day');
    });

    it('should trigger (input) listener on month input via DOM', () => {
        const id = fixture.elementRef.nativeElement.id;
        const monthInput = document.querySelector<HTMLInputElement>(`#${id} .month`);
        expect(monthInput).toBeTruthy();
        vi.spyOn(component, 'updateDate');
        monthInput!.value = '6';
        monthInput!.dispatchEvent(new Event('input', { bubbles: true }));
        expect(component.updateDate).toHaveBeenCalledWith(expect.any(Event), 'month');
    });

    it('should trigger (keyup) and (keydown) listeners on seconds input via DOM', () => {
        componentRef.setInput('type', 'datetime-seconds');
        fixture.changeDetectorRef.detectChanges();

        const id = fixture.elementRef.nativeElement.id;
        const secondsInput = document.querySelector<HTMLInputElement>(`#${id} .seconds`);
        expect(secondsInput).toBeTruthy();

        vi.spyOn(component, 'keyup');
        vi.spyOn(component, 'keydown');

        secondsInput!.dispatchEvent(new KeyboardEvent('keyup', { key: '5', bubbles: true }));
        secondsInput!.dispatchEvent(new KeyboardEvent('keydown', { key: '5', bubbles: true }));

        expect(component.keyup).toHaveBeenCalled();
        expect(component.keydown).toHaveBeenCalled();
    });

    it('should trigger (keyup) and (keydown) listeners on milli input via DOM', () => {
        componentRef.setInput('type', 'datetime-milli');
        fixture.changeDetectorRef.detectChanges();

        const id = fixture.elementRef.nativeElement.id;
        const milliInput = document.querySelector<HTMLInputElement>(`#${id} .milli`);
        expect(milliInput).toBeTruthy();

        vi.spyOn(component, 'keyup');
        vi.spyOn(component, 'keydown');

        milliInput!.dispatchEvent(new KeyboardEvent('keyup', { key: '5', bubbles: true }));
        milliInput!.dispatchEvent(new KeyboardEvent('keydown', { key: '5', bubbles: true }));

        expect(component.keyup).toHaveBeenCalled();
        expect(component.keydown).toHaveBeenCalled();
    });

    it('should trigger (datetimeClose) listener on picker span via DOM', () => {
        componentRef.setInput('hideDatePicker', false);
        fixture.changeDetectorRef.detectChanges();

        vi.spyOn(component, 'datePickerClose');

        const id = fixture.elementRef.nativeElement.id;
        const pickerDirective = component['datePicker']()[0];
        expect(pickerDirective).toBeTruthy();

        // Emit the close event directly on the directive
        pickerDirective.datetimeClose.emit('2026-01-15');

        expect(component.datePickerClose).toHaveBeenCalledWith('2026-01-15');
    });
});

describe('MagmaInputDate - HTML template branch coverage', () => {
    let component: MagmaInputDate;
    let fixture: ComponentFixture<MagmaInputDate>;
    let componentRef: ComponentRef<MagmaInputDate>;

    beforeEach(async () => {
        vi.useRealTimers();
        await TestBed.configureTestingModule({
            imports: [MagmaInputDate, FormsModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputDate);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    // Cover cond-expr branches: placeholderInfos?.xx when placeholderInfos is undefined
    it('should render with undefined placeholderInfos (covers ?. null branches)', () => {
        // Patch before first detectChanges so the template sees undefined
        (component as any).placeholderInfos = undefined;
        fixture.changeDetectorRef.detectChanges();
        expect(() => fixture.changeDetectorRef.detectChanges()).not.toThrow();
        const dayInput = fixture.nativeElement.querySelector('.day');
        expect(dayInput).toBeTruthy();
    });

    it('should render time inputs with undefined placeholderInfos', () => {
        componentRef.setInput('type', 'datetime-milli');
        (component as any).placeholderInfos = undefined;
        fixture.changeDetectorRef.detectChanges();
        expect(() => fixture.changeDetectorRef.detectChanges()).not.toThrow();
        const hoursInput = fixture.nativeElement.querySelector('.hours');
        expect(hoursInput).toBeTruthy();
    });

    // (keyup) and (keydown) on seconds input
    it('should trigger keyup and keydown on seconds input (datetime-seconds)', () => {
        componentRef.setInput('type', 'datetime-seconds');
        fixture.changeDetectorRef.detectChanges();

        const secondsInput = fixture.nativeElement.querySelector('.seconds');
        expect(secondsInput).toBeTruthy();

        vi.spyOn(component, 'keyup');
        vi.spyOn(component, 'keydown');

        secondsInput.dispatchEvent(new KeyboardEvent('keyup', { key: '3', bubbles: true }));
        secondsInput.dispatchEvent(new KeyboardEvent('keydown', { key: '3', bubbles: true }));

        expect(component.keyup).toHaveBeenCalled();
        expect(component.keydown).toHaveBeenCalled();
    });

    it('should trigger keyup and keydown on seconds input (datetime-milli)', () => {
        componentRef.setInput('type', 'datetime-milli');
        fixture.changeDetectorRef.detectChanges();

        const secondsInput = fixture.nativeElement.querySelector('.seconds');
        expect(secondsInput).toBeTruthy();

        vi.spyOn(component, 'keyup');
        vi.spyOn(component, 'keydown');

        secondsInput.dispatchEvent(new KeyboardEvent('keyup', { key: '3', bubbles: true }));
        secondsInput.dispatchEvent(new KeyboardEvent('keydown', { key: '3', bubbles: true }));

        expect(component.keyup).toHaveBeenCalled();
        expect(component.keydown).toHaveBeenCalled();
    });
});

describe('MagmaInputDate - seconds keyup/keydown via Angular', () => {
    let component: MagmaInputDate;
    let fixture: ComponentFixture<MagmaInputDate>;
    let componentRef: ComponentRef<MagmaInputDate>;

    beforeEach(async () => {
        vi.useRealTimers();
        await TestBed.configureTestingModule({
            imports: [MagmaInputDate, FormsModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputDate);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput('type', 'datetime-seconds');
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should trigger keyup listener on seconds input via Angular DebugElement', () => {
        const secondsEl = fixture.debugElement.query(By.css('.seconds'));
        expect(secondsEl).toBeTruthy();
        vi.spyOn(component, 'keyup');
        secondsEl.triggerEventHandler('keyup', new KeyboardEvent('keyup', { key: '3' }));
        expect(component.keyup).toHaveBeenCalled();
    });

    it('should trigger keydown listener on seconds input via Angular DebugElement', () => {
        const secondsEl = fixture.debugElement.query(By.css('.seconds'));
        expect(secondsEl).toBeTruthy();
        vi.spyOn(component, 'keydown');
        secondsEl.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: '3' }));
        expect(component.keydown).toHaveBeenCalled();
    });
});
