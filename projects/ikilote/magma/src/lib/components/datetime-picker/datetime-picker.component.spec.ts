import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DateInfo, MagmaDatetimePickerComponent } from './datetime-picker.component';

import { Logger } from '../../services/logger';

describe('MagmaDatetimePickerComponent', () => {
    let component: MagmaDatetimePickerComponent;
    let fixture: ComponentFixture<MagmaDatetimePickerComponent>;
    let loggerMock: any;
    let debugElement: DebugElement;

    beforeEach(async () => {
        loggerMock = jasmine.createSpyObj('Logger', ['info', 'error']);

        await TestBed.configureTestingModule({
            imports: [MagmaDatetimePickerComponent, FormsModule],
            providers: [{ provide: Logger, useValue: loggerMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaDatetimePickerComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show date picker but not time picker by default', () => {
        fixture.componentRef.setInput('type', 'date');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.month-year')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.time')).toBeFalsy();
    });

    it('should show only time picker when type is "time"', () => {
        fixture.componentRef.setInput('type', 'time');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.month-year')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('.time')).toBeTruthy();
    });

    it('should show milli input when type is "datetime-milli"', () => {
        fixture.componentRef.setInput('type', 'datetime-milli');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input[type="number"]')).toBeTruthy();
    });

    it('should compute the correct list of years', () => {
        const currentYear = new Date().getUTCFullYear();
        fixture.componentRef.setInput('value', `${currentYear}-01-01`);
        fixture.detectChanges();

        // @ts-ignore
        const years = component.yearsList();
        expect(years[0].value).toBe(currentYear - 10);
        expect(years[years.length - 1].value).toBe(currentYear + 10);
    });

    it('should restrict years based on min and max inputs', () => {
        const currentYear = new Date().getUTCFullYear();
        fixture.componentRef.setInput('min', `${currentYear - 2}-01-01`);
        fixture.componentRef.setInput('max', `${currentYear + 2}-01-01`);
        fixture.detectChanges();

        // @ts-ignore
        const years = component.yearsList();
        expect(years[0].value).toBe(currentYear - 2);
        expect(years[years.length - 1].value).toBe(currentYear + 2);
    });

    it('should disable prevMonth signal when current month is minDate month', () => {
        fixture.componentRef.setInput('value', '2025-05-01');
        fixture.componentRef.setInput('min', '2025-05-01');
        fixture.detectChanges();
        // @ts-ignore
        expect(component.prevMonthHide()).toBeTrue();
        // @ts-ignore
        expect(component.nextMonthHide()).toBeFalse();
    });

    it('should disable nextMonth signal when current month is maxDate month', () => {
        fixture.componentRef.setInput('value', '2025-05-01');
        fixture.componentRef.setInput('max', '2025-05-01');
        fixture.detectChanges();
        // @ts-ignore
        expect(component.prevMonthHide()).toBeFalse();
        // @ts-ignore
        expect(component.nextMonthHide()).toBeTrue();
    });

    it('should disable prevMonth & nextMonth signal when current month is minDate & maxDate month', () => {
        fixture.componentRef.setInput('value', '2025-05-01');
        fixture.componentRef.setInput('min', '2025-05-01');
        fixture.componentRef.setInput('max', '2025-05-31');
        fixture.detectChanges();
        // @ts-ignore
        expect(component.prevMonthHide()).toBeTrue();
        // @ts-ignore
        expect(component.nextMonthHide()).toBeTrue();
    });

    it('should not disable prevMonth & nextMonth signal when current month is minDate & maxDate month', () => {
        fixture.componentRef.setInput('value', '2025-05-01');
        fixture.componentRef.setInput('min', '2025-04-01');
        fixture.componentRef.setInput('max', '2025-06-30');
        fixture.detectChanges();
        // @ts-ignore
        expect(component.prevMonthHide()).toBeFalse();
        // @ts-ignore
        expect(component.nextMonthHide()).toBeFalse();
    });

    it('should emit ISO date on select()', fakeAsync(() => {
        const spy = spyOn(component.datetimeChange, 'emit');
        const testDate = new Date(Date.UTC(2025, 4, 15)); // 15 May 2025
        const info: DateInfo = {
            date: testDate,
            day: 15,
            month: 5,
            isCurrentMonth: true,
            isToday: false,
            disabled: false,
            weekend: false,
            weekNumber: 20,
        };

        component['dateValue'].set(testDate);
        component['select'](info);
        tick(20); // for setTimeout focus logic

        expect(spy).toHaveBeenCalledWith('2025-05-15');
    }));

    [
        { method: 'updateYear', value: 2026, toBe: '2026-01-01T10:00:00.000Z' },
        { method: 'updateMonth', value: 6, toBe: '2025-06-01T10:00:00.000Z' },
        { method: 'updateDay', value: 14, toBe: '2025-01-14T10:00:00.000Z' },
        { method: 'updateHours', value: 14, toBe: '2025-01-01T14:00:00.000Z' },
        { method: 'updateMinutes', value: 30, toBe: '2025-01-01T10:30:00.000Z' },
        { method: 'updateSeconds', value: 45, toBe: '2025-01-01T10:00:45.000Z' },
        { method: 'updateMilli', value: 555, toBe: '2025-01-01T10:00:00.555Z' },
    ].forEach(test => {
        it('should update time components and emit change: ' + test.method, () => {
            const spy = spyOn(component.datetimeChange, 'emit');
            fixture.componentRef.setInput('type', 'datetime-milli');
            fixture.componentRef.setInput('value', '2025-01-01T10:00:00Z');
            fixture.detectChanges();

            // @ts-ignore
            component[test.method](test.value);
            expect(spy).toHaveBeenCalled();
            const emittedValue = spy.calls.mostRecent().args[0];
            expect(emittedValue).toBe(test.toBe);
        });
    });

    [
        { type: 'datetime-local', toBe: '2025-01-01T10:00' },
        { type: 'datetime-seconds', toBe: '2025-01-01T10:00:00' },
        { type: 'datetime-milli', toBe: '2025-01-01T10:00:00.000Z' },
        { type: 'time', toBe: '10:00' },
        { type: 'date', toBe: '2025-01-01' },
        { type: '', toBe: '2025-01-01' },
    ].forEach(test => {
        it('should update date and emit change: ' + test.type, () => {
            const spy = spyOn(component.datetimeChange, 'emit');
            fixture.componentRef.setInput('type', test.type);
            fixture.componentRef.setInput('value', '2025-01-01T10:00:00Z');
            fixture.detectChanges();

            // @ts-ignore
            component.updateDate(component.date());
            expect(spy).toHaveBeenCalled();
            const emittedValue = spy.calls.mostRecent().args[0];
            expect(emittedValue).toBe(test.toBe);
        });
    });

    it('should navigate months with left() and right()', () => {
        fixture.componentRef.setInput('value', '2025-05-01');
        fixture.detectChanges();

        component['right']();
        // @ts-ignore
        expect(component.month()).toBe(6);

        component['left']();
        // @ts-ignore
        expect(component.month()).toBe(5);
    });

    [
        // series 1
        { arrow: 'ArrowRight', date: '2025-05-01', toBe: '2025-05-02' },
        { arrow: 'ArrowLeft', date: '2025-05-01', toBe: '2025-04-30' },
        { arrow: 'ArrowUp', date: '2025-05-01', toBe: '2025-04-24' },
        { arrow: 'ArrowDown', date: '2025-05-01', toBe: '2025-05-08' },
        // series 2
        { arrow: 'ArrowRight', date: '2025-08-31', toBe: '2025-09-01' },
        { arrow: 'ArrowLeft', date: '2025-08-31', toBe: '2025-08-30' },
        { arrow: 'ArrowUp', date: '2025-08-31', toBe: '2025-08-24' },
        { arrow: 'ArrowDown', date: '2025-08-31', toBe: '2025-09-07' },
    ].forEach(test => {
        it('should handle keyboard navigation:' + test.arrow, () => {
            fixture.componentRef.setInput('value', test.date);
            fixture.detectChanges();

            // @ts-ignore
            spyOn(component, 'updateDate');

            const inputElement = debugElement.query(By.css('#date-' + test.date)).nativeElement;
            expect(inputElement).toBeDefined();

            const target = debugElement.query(By.css('#date-' + test.toBe));
            if (target) {
                const targetElement = target.nativeElement;
                const clickSpy = spyOn(targetElement, 'click');
                expect(targetElement).toBeDefined();

                // test
                const event = new KeyboardEvent('keydown', { key: test.arrow });
                component['move'](event);

                // control click
                expect(clickSpy).toHaveBeenCalled();

                // @ts-ignore
                expect(component.updateDate).not.toHaveBeenCalled();
            } else {
                // test
                const event = new KeyboardEvent('keydown', { key: test.arrow });
                component['move'](event);

                // @ts-ignore
                expect(component.updateDate).toHaveBeenCalledWith(new Date(test.toBe));
            }
        });
    });

    [
        // series 1
        { arrow: 'ArrowRight', date: '2025-05-01', toBe: '2025-05-02' },
        { arrow: 'ArrowLeft', date: '2025-05-01', toBe: '2025-04-30' },
        { arrow: 'ArrowUp', date: '2025-05-01', toBe: '2025-04-24' },
        { arrow: 'ArrowDown', date: '2025-05-01', toBe: '2025-05-08' },
        // series 2
        { arrow: 'ArrowRight', date: '2025-08-31', toBe: '2025-09-01' },
        { arrow: 'ArrowLeft', date: '2025-08-31', toBe: '2025-08-30' },
        { arrow: 'ArrowUp', date: '2025-08-31', toBe: '2025-08-24' },
        { arrow: 'ArrowDown', date: '2025-08-31', toBe: '2025-09-07' },
    ].forEach(test => {
        it('should handle keyboard navigation (readonly):' + test.arrow, () => {
            fixture.componentRef.setInput('readonly', true);
            fixture.componentRef.setInput('value', test.date);
            fixture.detectChanges();

            // @ts-ignore
            spyOn(component, 'updateDate');

            const inputElement = debugElement.query(By.css('#date-' + test.date)).nativeElement;
            expect(inputElement).toBeDefined();

            const target = debugElement.query(By.css('#date-' + test.toBe));
            if (target) {
                const targetElement = target.nativeElement;
                const clickSpy = spyOn(targetElement, 'click');
                expect(targetElement).toBeDefined();

                // test
                const event = new KeyboardEvent('keydown', { key: test.arrow });
                component['move'](event);

                // control click
                expect(clickSpy).not.toHaveBeenCalled();

                // @ts-ignore
                expect(component.updateDate).not.toHaveBeenCalled();
            } else {
                // test
                const event = new KeyboardEvent('keydown', { key: test.arrow });
                component['move'](event);

                // @ts-ignore
                expect(component.updateDate).not.toHaveBeenCalled();
            }
        });
    });

    it('should load more years on scroll up', fakeAsync(() => {
        // @ts-ignore
        const initialPast = component.past();
        const event: any = { way: 'up' };

        component['scroll'](event);
        tick(100); // Wait for setTimeout in scroll()

        // @ts-ignore
        expect(component.past()).toBe(initialPast + 10);
    }));

    it('should load more years on scroll down', fakeAsync(() => {
        // @ts-ignore
        const initialFuture = component.future();
        const event: any = { way: 'down' };

        component['scroll'](event);
        tick(100); // Wait for setTimeout in scroll()

        // @ts-ignore
        expect(component.future()).toBe(initialFuture + 10);
    }));

    it('should not load more years on scroll up', fakeAsync(() => {
        // @ts-ignore
        const initialPast = component.past();
        const event: any = { way: 'up' };

        // @ts-ignore
        component.onscroll = true;
        component['scroll'](event);
        tick(100); // Wait for setTimeout in scroll()

        // @ts-ignore
        expect(component.past()).toBe(initialPast);
    }));

    it('should not load more years on scroll down', fakeAsync(() => {
        // @ts-ignore
        const initialFuture = component.future();
        const event: any = { way: 'down' };

        // @ts-ignore
        component.onscroll = true;
        component['scroll'](event);
        tick(100); // Wait for setTimeout in scroll()

        // @ts-ignore
        expect(component.future()).toBe(initialFuture);
    }));

    it('should show week numbers if hideWeekNumber is false', () => {
        fixture.componentRef.setInput('hideWeekNumber', false);
        fixture.detectChanges();
        const table = fixture.nativeElement.querySelector('.table');
        expect(table.classList).toContain('week-number');
    });

    describe('select() method', () => {
        it('should set the selected signal to true', () => {
            const dateInfo = { month: 1, day: 10 } as DateInfo;
            // @ts-ignore Accessing protected method via any
            component.select(dateInfo);
            // @ts-ignore
            expect(component.selected()).toBeTrue();
        });

        it('should only update the day if the month is the same as the current date', () => {
            // Setup component with a specific date (January)
            fixture.componentRef.setInput('value', '2026-01-01');
            fixture.detectChanges();

            const updateDaySpy = spyOn<any>(component, 'updateDay').and.callThrough();
            const updateMonthSpy = spyOn<any>(component, 'updateMonth').and.callThrough();
            const updateDateSpy = spyOn<any>(component, 'updateDate').and.callThrough();

            const dateInfo = { month: 1, day: 15 } as DateInfo;

            // @ts-ignore
            component.select(dateInfo);

            expect(updateDaySpy).toHaveBeenCalledWith(15);
            expect(updateMonthSpy).not.toHaveBeenCalled();
            expect(updateDateSpy).toHaveBeenCalled();
        });

        it('should update month, day, and date if the selected month is different', () => {
            // Setup component in January
            fixture.componentRef.setInput('value', '2026-01-01');
            fixture.detectChanges();

            const updateDaySpy = spyOn<any>(component, 'updateDay').and.callThrough();
            const updateMonthSpy = spyOn<any>(component, 'updateMonth').and.callThrough();
            const updateDateSpy = spyOn<any>(component, 'updateDate').and.callThrough();

            // Simulate selecting a day from February (e.g., end of the grid)
            const dateInfo = { month: 2, day: 1 } as DateInfo;

            // @ts-ignore
            component.select(dateInfo);

            expect(updateMonthSpy).toHaveBeenCalledWith(2, false);
            expect(updateDaySpy).toHaveBeenCalledWith(1, false);
            expect(updateDateSpy).toHaveBeenCalled();
        });

        it('should attempt to focus the element with ".selected" class after 10ms', fakeAsync(() => {
            const dateInfo = { month: 1, day: 10 } as DateInfo;

            // Create a dummy element in the template to be found by the querySelector
            const dummyElement = document.createElement('div');
            dummyElement.classList.add('selected');
            // We need to provide a tabIndex so it's focusable
            dummyElement.tabIndex = 0;

            spyOn(component.element.nativeElement, 'querySelector').and.returnValue(dummyElement);
            const focusSpy = spyOn(dummyElement, 'focus');

            // @ts-ignore
            component.select(dateInfo);

            // Before 10ms
            tick(5);
            expect(focusSpy).not.toHaveBeenCalled();

            // At/After 10ms
            tick(5);
            expect(focusSpy).toHaveBeenCalled();
        }));

        it('should not throw an error if the .selected element is not found in the DOM', fakeAsync(() => {
            const dateInfo = { month: 1, day: 10 } as DateInfo;

            // Return null to simulate element not being rendered yet or missing
            spyOn(component.element.nativeElement, 'querySelector').and.returnValue(null);

            expect(() => {
                // @ts-ignore
                component.select(dateInfo);
                tick(10);
            }).not.toThrow();
        }));
    });

    describe('getFirstGet() - Week start offset', () => {
        it('should return -1 when the day is Sunday', () => {
            // @ts-ignore - Accessing private method
            const result = component.getFirstGet('Sunday');
            expect(result).toBe(-1);
        });

        it('should return -2 when the day is Saturday', () => {
            // @ts-ignore - Accessing private method
            const result = component.getFirstGet('Saturday');
            expect(result).toBe(-2);
        });

        it('should return 0 when the day is Monday (default behavior)', () => {
            // @ts-ignore - Accessing private method
            const result = component.getFirstGet('Monday');
            expect(result).toBe(0);
        });

        it('should return 0 when the day is undefined', () => {
            // @ts-ignore - Accessing private method
            const result = component.getFirstGet(undefined);
            expect(result).toBe(0);
        });
    });

    describe('getDate()', () => {
        it('should return the computed date when it is within min/max boundaries', () => {
            const minLimit = new Date(2026, 0, 1);
            const maxLimit = new Date(2026, 0, 31);
            const midDate = '2026-01-15';

            // Set source inputs to update the computed 'date' signal
            fixture.componentRef.setInput('min', minLimit);
            fixture.componentRef.setInput('max', maxLimit);
            fixture.componentRef.setInput('value', midDate);
            fixture.detectChanges();

            // @ts-ignore - Accessing protected method
            const result = component.getDate();
            expect(result.getTime()).toBe(new Date(midDate).getTime());
        });

        it('should clamp to minDate if the current value is too early', () => {
            const minLimit = new Date(2026, 0, 10);
            const tooEarly = '2026-01-05';

            fixture.componentRef.setInput('min', minLimit);
            fixture.componentRef.setInput('value', tooEarly);
            fixture.detectChanges();

            // @ts-ignore
            const result = component.getDate();
            expect(result.getTime()).toBe(minLimit.getTime());
        });

        it('should clamp to maxDate if the current value is too late', () => {
            const maxLimit = new Date(2026, 0, 20);
            const tooLate = '2026-01-25';

            fixture.componentRef.setInput('max', maxLimit);
            fixture.componentRef.setInput('value', tooLate);
            fixture.detectChanges();

            // @ts-ignore
            const result = component.getDate();
            expect(result.getTime()).toBe(maxLimit.getTime());
        });

        it('should return the raw date signal if no min/max boundaries are provided', () => {
            const targetDate = '2026-05-20';

            fixture.componentRef.setInput('min', undefined);
            fixture.componentRef.setInput('max', undefined);
            fixture.componentRef.setInput('value', targetDate);
            fixture.detectChanges();

            // @ts-ignore
            const result = component.getDate();
            expect(result.getTime()).toBe(new Date(targetDate).getTime());
        });
    });

    describe('getDateValue parsing logic', () => {
        beforeEach(() => {
            // Mocking the system date to Jan 1st, 2026 for consistent fallback tests
            jasmine.clock().install();
            jasmine.clock().mockDate(new Date(Date.UTC(2026, 0, 1)));
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it('should return the current date (mocked) if value is undefined or null', () => {
            // @ts-ignore
            const result = component.getDateValue(undefined);
            expect(result.toISOString()).toBe('2026-01-01T00:00:00.000Z');

            // @ts-ignore
            const resultNull = component.getDateValue(null);
            expect(resultNull.toISOString()).toBe('2026-01-01T00:00:00.000Z');
        });

        it('should return the exact same Date object if an instance of Date is passed', () => {
            const inputDate = new Date(Date.UTC(2024, 5, 20));

            // @ts-ignore
            const result = component.getDateValue(inputDate);

            expect(result).toBe(inputDate); // Checks reference equality
            expect(result.getUTCDate()).toBe(20);
        });

        it('should handle the literal string "number" as per current logic', () => {
            // @ts-ignore - This tests the (value === 'number') branch in your code
            const result = component.getDateValue('number');
            // new Date('number') results in an Invalid Date
            expect(result.toString()).toBe('Invalid Date');
        });

        it('should parse a complete ISO string into a UTC Date object', () => {
            const isoString = '2025-10-31T12:45:30.500Z';
            // @ts-ignore
            const result: Date = component.getDateValue(isoString);

            expect(result.getUTCFullYear()).toBe(2025);
            expect(result.getUTCMonth()).toBe(9); // October is 9
            expect(result.getUTCDate()).toBe(31);
            expect(result.getUTCHours()).toBe(12);
            expect(result.getUTCMinutes()).toBe(45);
            expect(result.getUTCSeconds()).toBe(30);
            expect(result.getUTCMilliseconds()).toBe(500);
        });

        it('should handle partial date strings by filling missing components with 0', () => {
            const partial = '2025-05-15';
            // @ts-ignore
            const result: Date = component.getDateValue(partial);

            expect(result.getUTCFullYear()).toBe(2025);
            expect(result.getUTCMonth()).toBe(4); // May
            expect(result.getUTCDate()).toBe(15);
            // Time components should be 0 because substring results in empty/non-numeric
            expect(result.getUTCHours()).toBe(0);
            expect(result.getUTCMinutes()).toBe(0);
        });

        it('should prevent negative month values using Math.max', () => {
            // If string is '2025-00-01', (0 - 1) is -1, Math.max should return 0
            const invalidMonth = '2025-00-01';
            // @ts-ignore
            const result: Date = component.getDateValue(invalidMonth);
            expect(result.getUTCMonth()).toBe(0); // January
        });

        it('should return a Date object even for totally malformed strings', () => {
            const malformed = 'NotADate';
            // @ts-ignore
            const result = component.getDateValue(malformed);

            // getValueDateSubstring will try to '+' an empty substring or NaN string
            // The resulting Date might be 'Invalid Date' or year 0, but it must be a Date instance
            expect(result).toEqual(new Date());
        });

        it('should correctly parse milliseconds at the end of the string', () => {
            const withMilli = '2025-01-01T00:00:00.999Z';

            // @ts-ignore
            const result: Date = component.getDateValue(withMilli);
            expect(result.getUTCMilliseconds()).toBe(999);
        });
    });
});
