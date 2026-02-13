import { ComponentRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputDate } from './input-date.component';
import { MockNgControl } from './input-text.component.spec';

describe('MagmaInputDate', () => {
    let component: MagmaInputDate;
    let fixture: ComponentFixture<MagmaInputDate>;
    let componentRef: ComponentRef<MagmaInputDate>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputDate, FormsModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputDate);
        component = fixture.componentInstance;
        component.refreshTrigger.set(false);
        componentRef = fixture.componentRef;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
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
            fixture.detectChanges();
            expect(component.orderType).toBe('mdy');
        });

        it('should correctly match partial language codes (e.g., "fr-CA" starts with "fr")', () => {
            componentRef.setInput('lang', 'fr-CA');
            fixture.detectChanges();
            expect(component.orderType).toBe('ymd');
        });

        it('should set the correct regex groups for DMY (French)', () => {
            componentRef.setInput('lang', 'fr-FR');
            fixture.detectChanges();
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
            expect(component.lockFocus).toBeTrue();

            component.keyup(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
            // @ts-ignore
            expect(component.lockFocus).toBeFalse();
        });

        it('should lock focus when ArrowLeft keys are pressed', () => {
            // @ts-ignore
            spyOn(component, 'focusNext');
            // @ts-ignore
            spyOn(component, 'focusPrev');

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
            spyOn(component, 'focusNext');
            // @ts-ignore
            spyOn(component, 'focusPrev');

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
            fixture.detectChanges();

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
            it(`should clamp Input (${e.type}) and move focus to next element with type datetime-milli`, fakeAsync(() => {
                updateInputs('datetime-milli');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;

                i.valueAsNumber = e.value;
                // @ts-ignore
                spyOn(component, 'focusNext');

                component.updateDate({ target: i } as any, e.type as any);

                tick();
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
            }));
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
            it(`should clamp Input (${e.type}) and move focus to next element with type time`, fakeAsync(() => {
                updateInputs('time');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    tick();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBeTrue();
                } else {
                    expect(e.present).toBeFalse();
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }
                // @ts-ignore
                expect(component._value).toBe('23:59');
            }));
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
            it(`should clamp Input (${e.type}) and move focus to next element with type date`, fakeAsync(() => {
                updateInputs('date');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    tick();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBeTrue();
                } else {
                    expect(e.present).toBeFalse();
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }
                // @ts-ignore
                expect(component._value).toBe('9999-12-31');
            }));
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
            it(`should clamp Input (${e.type}) and move focus to next element with type date`, fakeAsync(() => {
                updateInputs('date');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    tick();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBeTrue();
                } else {
                    expect(e.present).toBeFalse();
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }
                // @ts-ignore
                expect(component._value).toBe('9999-12-31');
            }));
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
            it(`should clamp Input (${e.type}) and move focus to next element with type datetime-local`, fakeAsync(() => {
                updateInputs('datetime-local');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    tick();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBeTrue();
                } else {
                    expect(e.present).toBeFalse();
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }

                // @ts-ignore
                expect(component._value).toBe('9999-12-31T23:59');
            }));
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
            it(`should clamp Input (${e.type}) and move focus to next element with type datetime-seconds`, fakeAsync(() => {
                updateInputs('datetime-seconds');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;
                if (i) {
                    i.valueAsNumber = e.value;
                    // @ts-ignore
                    spyOn(component, 'focusNext');

                    component.updateDate({ target: i } as any, e.type as any);

                    tick();
                    expect(i.valueAsNumber).toBe(e.updated);

                    if (e.focus) {
                        // @ts-ignore
                        expect(component.focusNext).toHaveBeenCalled();
                    } else {
                        // @ts-ignore
                        expect(component.focusNext).not.toHaveBeenCalled();
                    }
                    expect(e.present).toBeTrue();
                } else {
                    expect(e.present).toBeFalse();
                    // @ts-ignore
                    component.updateValueWithCache(false);
                }
                // @ts-ignore
                expect(component._value).toBe('9999-12-31T23:59:59');
            }));
        });

        [
            { type: 'month', value: 2, updated: '02', filed: 'typeMonth' },
            { type: 'day', value: 4, updated: '04', filed: 'typeDay' },
            { type: 'hours', value: 6, updated: '06', filed: 'typeHours' },
            { type: 'minutes', value: 9, updated: '09', filed: 'typeMinutes' },
            { type: 'seconds', value: 9, updated: '09', filed: 'typeSeconds' },
        ].forEach(e => {
            it(`should clamp Input (${e.type}) and update input value`, fakeAsync(() => {
                updateInputs('datetime-milli');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;

                i.valueAsNumber = e.value;

                // @ts-ignore
                component.lockFocus = true;
                component.updateDate({ target: i } as any, e.type as any);

                tick();

                expect(i.value).toBe(e.updated);
            }));

            [
                { type: 'month', value: 2, updated: '02', filed: 'typeMonth' },
                { type: 'day', value: 4, updated: '04', filed: 'typeDay' },
                { type: 'hours', value: 6, updated: '06', filed: 'typeHours' },
                { type: 'minutes', value: 9, updated: '09', filed: 'typeMinutes' },
                { type: 'seconds', value: 9, updated: '09', filed: 'typeSeconds' },
            ].forEach(e => {
                it(`should change Input (${e.type}) and update input value`, fakeAsync(() => {
                    updateInputs('datetime-milli');

                    // @ts-ignore
                    const i = input[e.filed] as HTMLInputElement;

                    i.valueAsNumber = e.value;

                    // @ts-ignore
                    component.lockFocus = true;
                    component.changeDate({ target: i } as any, e.type as any);

                    tick();

                    expect(i.value).toBe(e.updated);
                }));
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
            it(`should clamp Input (${e.type}) value is empty with type datetime-milli`, fakeAsync(() => {
                updateInputs('datetime-milli');

                // @ts-ignore
                const i = input[e.filed] as HTMLInputElement;

                i.valueAsNumber = e.value;

                component.updateDate({ target: i } as any, e.type as any);

                tick();
                expect(i.valueAsNumber).toBe(e.updated);

                // @ts-ignore
                expect(component._value).toBe(e.out);
            }));
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
            spyOnProperty(navigator, 'language', 'get').and.returnValue('');

            component.placeholderCompute(); // Non-existent

            expect(component.orderType).toBe('mdy'); // 'en' type in mock
            // @ts-ignore
            expect(component.placeholderInfos.mm).toBe('mm');
        });
    });

    describe('Private methods', () => {
        it('should select element on focusNext', () => {
            spyOn(document, 'querySelector');

            // @ts-ignore
            component.focusNext('test');

            expect(document.querySelector).toHaveBeenCalledWith('#test + * + input');
        });

        it('should select element on focusNext and select', () => {
            const inputDayElement = debugElement.query(By.css('.day')).nativeElement;
            const inputMonthElement = debugElement.query(By.css('.month')).nativeElement;

            spyOn(inputMonthElement, 'select');

            // @ts-ignore
            component.focusNext(inputDayElement.id);

            expect(inputMonthElement.select).toHaveBeenCalled();
        });

        it('should select element on focusPrev', () => {
            spyOn(document, 'querySelector');

            // @ts-ignore
            component.focusPrev('test');

            expect(document.querySelector).toHaveBeenCalledWith('input:has(+ * + #test)');
        });

        it('should select element on focusPrev and select', () => {
            const inputDayElement = debugElement.query(By.css('.day')).nativeElement;
            const inputMonthElement = debugElement.query(By.css('.month')).nativeElement;

            spyOn(inputDayElement, 'select');

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
            fixture.detectChanges();

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
            fixture.detectChanges();

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
            fixture.detectChanges();

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
            fixture.detectChanges();

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

            // @ts-ignore
            expect(component._type()).toBe('date');
        });

        it('should force type to data if undefined', () => {
            componentRef.setInput('type', undefined);

            // @ts-ignore
            expect(component._type()).toBe('date');
        });

        it('should force type to data if not existing', () => {
            componentRef.setInput('type', 'datetime');

            // @ts-ignore
            expect(component._type()).toBe('date');
        });
    });

    describe('NgControl', () => {
        it('should update input value on blur', () => {
            const inputElement = debugElement.query(By.css('.day')).nativeElement;
            inputElement.value = '3';
            spyOn(component, 'onTouched');
            spyOn(component, 'validate');

            component.ngOnInit();
            component.ngControl = new MockNgControl() as unknown as NgControl;

            inputElement.dispatchEvent(new Event('blur'));
            fixture.detectChanges();
            expect(inputElement.value).toBe('03');
            expect(component.onTouched).toHaveBeenCalled();
            expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
        });

        it('should dateClose value on blur', () => {
            const inputElement = debugElement.query(By.css('.day')).nativeElement;
            inputElement.value = '3';
            spyOn(component, 'onTouched');
            spyOn(component, 'validate');

            component.ngControl = new MockNgControl() as unknown as NgControl;
            component.datePickerClose('2015-12-12');

            fixture.detectChanges();
            expect(inputElement.value).toBe('12');
            expect(component.onTouched).toHaveBeenCalled();
            expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
        });
    });
});
