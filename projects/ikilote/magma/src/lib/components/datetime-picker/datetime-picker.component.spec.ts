import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DateInfo, MagmaDatetimePickerComponent } from './datetime-picker.component';

import { Logger } from '../../services/logger';

describe('MagmaDatetimePickerComponent', () => {
    let component: MagmaDatetimePickerComponent;
    let fixture: ComponentFixture<MagmaDatetimePickerComponent>;
    let loggerMock: any;

    beforeEach(async () => {
        loggerMock = jasmine.createSpyObj('Logger', ['info', 'error']);

        await TestBed.configureTestingModule({
            imports: [MagmaDatetimePickerComponent, FormsModule],
            providers: [{ provide: Logger, useValue: loggerMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaDatetimePickerComponent);
        component = fixture.componentInstance;
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

    it('should update time components and emit change', () => {
        const spy = spyOn(component.datetimeChange, 'emit');
        fixture.componentRef.setInput('type', 'datetime-seconds');
        fixture.componentRef.setInput('value', '2025-01-01T10:00:00Z');
        fixture.detectChanges();

        component['updateHours'](14);
        expect(spy).toHaveBeenCalled();
        const emittedValue = spy.calls.mostRecent().args[0];
        expect(emittedValue).toContain('14:00:00');
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

    it('should handle keyboard navigation (ArrowRight)', () => {
        fixture.componentRef.setInput('value', '2025-05-01');
        fixture.detectChanges();

        // Mocking the element selection for the keyboard move logic
        const dummyDay = document.createElement('div');
        dummyDay.classList.add('day', 'selected');
        const nextDay = document.createElement('div');
        nextDay.classList.add('day');

        spyOn(fixture.nativeElement, 'querySelectorAll').and.returnValue([dummyDay, nextDay]);
        const clickSpy = spyOn(nextDay, 'click');

        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        component['move'](event);

        expect(clickSpy).toHaveBeenCalled();
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
