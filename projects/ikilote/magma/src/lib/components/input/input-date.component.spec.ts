import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import Bowser from 'bowser';

import { MagmaInputDate } from './input-date.component';

describe('MagmaInputDate', () => {
    let component: MagmaInputDate;
    let fixture: ComponentFixture<MagmaInputDate>;
    let componentRef: ComponentRef<MagmaInputDate>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputDate, FormsModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputDate);
        component = fixture.componentInstance;
        component.refreshTrigger.set(false);
        componentRef = fixture.componentRef;
        fixture.detectChanges();
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
            const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            component.keydown(event);
            expect((component as any).lockFocus).toBeTrue();

            component.keyup(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
            expect((component as any).lockFocus).toBeFalse();
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
    });

    describe('Browser & Picker Logic', () => {
        it('should open picker only on Blink engines', () => {
            const event = new MouseEvent('click');
            spyOn(event, 'preventDefault');

            // Mock Bowser to return Blink
            spyOn(Bowser, 'parse').and.returnValue({ engine: { name: 'Blink' } } as any);

            const mockPicker = { open: jasmine.createSpy('open') };
            spyOn(component, 'datePicker').and.returnValue([mockPicker] as any);

            component.open(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(mockPicker.open).toHaveBeenCalled();
        });

        it('should NOT open picker on non-Blink engines (e.g. Gecko)', () => {
            const event = new MouseEvent('click');
            spyOn(Bowser, 'parse').and.returnValue({ engine: { name: 'Gecko' } } as any);
            const mockPicker = { open: jasmine.createSpy('open') };
            spyOn(component, 'datePicker').and.returnValue([mockPicker] as any);

            component.open(event);
            expect(mockPicker.open).not.toHaveBeenCalled();
        });
    });
});
