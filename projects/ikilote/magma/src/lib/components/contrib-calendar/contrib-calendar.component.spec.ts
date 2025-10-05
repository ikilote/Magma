import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContribCalendar, MagmaContribCalendar } from './contrib-calendar.component';

describe('MagmaContribCalendar', () => {
    let component: MagmaContribCalendar;
    let fixture: ComponentFixture<MagmaContribCalendar>;

    const mockCalendar: ContribCalendar = [
        { date: '2024-04-02', value: 16 },
        { date: '2024-01-02', value: 3 },
        { date: '2024-01-08', value: 6 },
        { date: '2024-01-01', value: 1 },
        { date: '2024-01-22', value: 16 },
        { date: '2024-01-15', value: 11 },
        { date: '2024-02-01', value: 6 },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaContribCalendar],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaContribCalendar);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('calendar', mockCalendar);
        fixture.detectChanges();
    });

    describe('private methods', () => {
        it('should compute days of the week', () => {
            const days = component['computedDays']();
            expect(days.length).toBe(7);
            expect(days[0]).toBe('M');
        });

        it('should sort calendar by date', () => {
            const sorted = component['sortedCalendar']();
            expect(sorted.length).toBe(7);
            expect(sorted[0].date).toEqual(new Date('2024-01-01'));
            expect(sorted[4].date).toEqual(new Date('2024-01-22'));
            expect(sorted[6].date).toEqual(new Date('2024-04-02'));
        });

        it('should generate a list of dates with values', () => {
            const computed = component['computedCalendar']();
            expect(computed.length).toBe(93);
            expect(computed[0].date).toEqual(new Date('2024-01-01'));
            expect(computed[0].value).toBe(1);
        });

        it('should compute months with positions', () => {
            const months = component['mouths']();
            expect(months.length).toBe(4);
            expect(months[0].name).toBe('Jan');
            expect(months[0].pos).toBe(0);
            expect(months[1].name).toBe('Feb');
            expect(months[1].pos).toBe(4);
            expect(months[2].name).toBe('Mar');
            expect(months[2].pos).toBe(8);
            expect(months[3].name).toBe('Apr');
            expect(months[3].pos).toBe(13);
        });

        it('should compute first position', () => {
            const pos = component['firstPos']();
            expect(pos).toBe(1);
        });

        it('should compute number of weeks', () => {
            const size = component['size']();
            expect(size).toBeGreaterThan(0);
        });

        it('should return correct color based on value', () => {
            const color1 = component['getColor'](-1);
            expect(color1).toBe(undefined);

            const color2 = component['getColor'](0);
            expect(color2).toBe(undefined);

            const color3 = component['getColor'](1);
            expect(color3).toBe('var(--contrib-calendar-tile-color-lvl1)');

            const color4 = component['getColor'](6);
            expect(color4).toBe('var(--contrib-calendar-tile-color-lvl2)');

            const color5 = component['getColor'](11);
            expect(color5).toBe('var(--contrib-calendar-tile-color-lvl3)');

            const color6 = component['getColor'](16);
            expect(color6).toBe('var(--contrib-calendar-tile-color-lvl4)');
        });

        it('should create a list of dates with values', () => {
            const sorted = component['sortedCalendar']();
            const list = component['createListDates'](sorted);
            expect(list.length).toBe(93);
            expect(list[0].date).toEqual(new Date('2024-01-01'));
            expect(list[92].date).toEqual(new Date('2024-04-02'));
        });
    });

    describe('renderer', () => {
        it('should render days of the week', () => {
            const days = fixture.debugElement.queryAll(By.css('.day div'));
            expect(days.length).toBe(7);
        });

        it('should render months', () => {
            const months = fixture.debugElement.queryAll(By.css('.month div'));
            expect(months.length).toBe(4);
        });

        it('should render tiles with correct color and title', () => {
            const tiles = fixture.debugElement.queryAll(By.css('.tile div'));
            expect(tiles.length).toBe(93);

            tiles.forEach(tile => {
                expect(tile.nativeElement.getAttribute('title')).toMatch(/\d{2}\/\d{2}\/\d{4} : \d+/);
            });
        });

        it('should apply odd class to tiles', () => {
            const oddTiles = fixture.debugElement.queryAll(By.css('.tile div.odd'));
            expect(oddTiles.length).toBe(62);
        });

        it('should use lang input for localization', () => {
            fixture.componentRef.setInput('lang', 'fr');
            fixture.detectChanges();
            const days = component['computedDays']();
            expect(days[0]).toBe('L');
        });

        it('should adjust first day of week', () => {
            fixture.componentRef.setInput('lang', 'fr');
            fixture.componentRef.setInput('firstDayOfWeek', 'Sunday');
            fixture.detectChanges();
            const daysSun = component['computedDays']();
            expect(daysSun[0]).toBe('D');

            fixture.componentRef.setInput('firstDayOfWeek', 'Saturday');
            fixture.detectChanges();
            const daysSat = component['computedDays']();
            expect(daysSat[0]).toBe('S');
        });
    });
});
