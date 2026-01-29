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

        const years = (component as any).yearsList();
        expect(years[0].value).toBe(currentYear - 10);
        expect(years[years.length - 1].value).toBe(currentYear + 10);
    });

    it('should restrict years based on min and max inputs', () => {
        const currentYear = new Date().getUTCFullYear();
        fixture.componentRef.setInput('min', `${currentYear - 2}-01-01`);
        fixture.componentRef.setInput('max', `${currentYear + 2}-01-01`);
        fixture.detectChanges();

        const years = (component as any).yearsList();
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
});
