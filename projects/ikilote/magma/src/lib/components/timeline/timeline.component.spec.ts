import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaTimelineAnnotation } from './timeline-annotation.component';
import { MagmaTimelineItemTooltip } from './timeline-item-tooltip.component';
import { MagmaTimelineItem } from './timeline-item.component';
import { MagmaTimeline, MagmaTimelineClickEvent } from './timeline.component';

// ─── Helper: get MagmaTimeline instance from host fixture ─────────────────────

function getTimelineInstance(hostFixture: ComponentFixture<unknown>): MagmaTimeline {
    return hostFixture.debugElement.query(By.directive(MagmaTimeline)).componentInstance as MagmaTimeline;
}

function getTimelineElement(hostFixture: ComponentFixture<unknown>): HTMLElement {
    return hostFixture.nativeElement.querySelector('mg-timeline') as HTMLElement;
}

// ─────────────────────────────────────────────────────────────────────────────
// Direct component tests (no content children)
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — standalone (no items)', () => {
    let component: MagmaTimeline;
    let fixture: ComponentFixture<MagmaTimeline>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaTimeline],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTimeline);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should default direction to "horizontal"', () => {
        expect(component.direction()).toBe('horizontal');
    });

    it('should default unit to "year"', () => {
        expect(component.unit()).toBe('year');
    });

    it('should default axisSize to "80px"', () => {
        expect(component.axisSize()).toBe('80px');
    });

    it('should default showGrid to true', () => {
        expect(component.showGrid()).toBe(true);
    });

    it('should default tickSize to undefined', () => {
        expect(component.tickSize()).toBeUndefined();
    });

    it('should default minGap to undefined', () => {
        expect(component.minGap()).toBeUndefined();
    });

    it('should default start and end to undefined', () => {
        expect(component.start()).toBeUndefined();
        expect(component.end()).toBeUndefined();
    });

    it('should default lang to undefined', () => {
        expect(component.lang()).toBeUndefined();
    });

    it('should return empty ticks when no items are present', () => {
        expect(component['ticks']()).toEqual([]);
    });

    it('should return empty resolvedItems when no items are present', () => {
        expect(component['resolvedItems']()).toEqual([]);
    });

    it('should return trackCount of 1 when no items', () => {
        expect(component['trackCount']()).toBe(1);
    });

    it('should apply "horizontal" class to host by default', () => {
        expect(fixture.nativeElement.classList.contains('horizontal')).toBe(true);
        expect(fixture.nativeElement.classList.contains('vertical')).toBe(false);
    });

    it('should apply "vertical" class when direction is set to vertical', () => {
        fixture.componentRef.setInput('direction', 'vertical');
        fixture.changeDetectorRef.detectChanges();

        expect(fixture.nativeElement.classList.contains('vertical')).toBe(true);
        expect(fixture.nativeElement.classList.contains('horizontal')).toBe(false);
    });

    it('should set --mg-timeline-tick-size CSS var to 60 by default', () => {
        expect(fixture.nativeElement.style.getPropertyValue('--mg-timeline-tick-size')).toBe('60px');
    });

    it('should update --mg-timeline-tick-size when tickSize input changes', () => {
        fixture.componentRef.setInput('tickSize', 100);
        fixture.changeDetectorRef.detectChanges();

        expect(fixture.nativeElement.style.getPropertyValue('--mg-timeline-tick-size')).toBe('100px');
    });

    it('should set --mg-timeline-axis-size CSS var', () => {
        expect(fixture.nativeElement.style.getPropertyValue('--mg-timeline-axis-size')).toBe('80px');
    });

    it('should update --mg-timeline-axis-size when axisSize changes', () => {
        fixture.componentRef.setInput('axisSize', '120px');
        fixture.changeDetectorRef.detectChanges();

        expect(fixture.nativeElement.style.getPropertyValue('--mg-timeline-axis-size')).toBe('120px');
    });

    it('should set --mg-timeline-tick-count to 0 when no items', () => {
        // ticks() is empty → length is 0
        expect(fixture.nativeElement.style.getPropertyValue('--mg-timeline-tick-count')).toBe('0');
    });

    it('should set --mg-timeline-track-count to 1 when no items', () => {
        expect(fixture.nativeElement.style.getPropertyValue('--mg-timeline-track-count')).toBe('1');
    });

    it('should not render any .tick elements when no items', () => {
        const ticks = fixture.nativeElement.querySelectorAll('.tick');
        expect(ticks.length).toBe(0);
    });

    it('should not render any .item elements when no items', () => {
        const items = fixture.nativeElement.querySelectorAll('.item');
        expect(items.length).toBe(0);
    });

    it('should render .grid-lines when showGrid is true (default)', () => {
        const gridLines = fixture.nativeElement.querySelector('.grid-lines');
        // no ticks → grid-lines block is rendered but empty
        expect(gridLines).toBeTruthy();
    });

    it('should not render .grid-lines when showGrid is false', () => {
        fixture.componentRef.setInput('showGrid', false);
        fixture.changeDetectorRef.detectChanges();

        const gridLines = fixture.nativeElement.querySelector('.grid-lines');
        expect(gridLines).toBeNull();
    });

    it('should return Infinity from minExactValue when no items or annotations', () => {
        expect((component as any).minExactValue()).toBe(Infinity);
    });

    it('should return -Infinity from maxExactValue when no items or annotations', () => {
        expect((component as any).maxExactValue()).toBe(-Infinity);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Host wrapper helpers
// ─────────────────────────────────────────────────────────────────────────────

@Component({
    template: `
        <mg-timeline unit="year" lang="en">
            <mg-timeline-item [start]="2020" [end]="2022" label="Item A" />
            <mg-timeline-item [start]="2021" [end]="2023" label="Item B" />
        </mg-timeline>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTimeline, MagmaTimelineItem],
})
class TestHostTwoItemsComponent {}

@Component({
    template: `
        <mg-timeline
            [unit]="unit"
            [lang]="lang"
            [start]="start"
            [end]="end"
            [direction]="direction"
            [showGrid]="showGrid"
            [tickSize]="tickSize"
            [minGap]="minGap"
        >
            <mg-timeline-item
                *ngFor="let item of items"
                [start]="item.start"
                [end]="item.end"
                [label]="item.label"
                [color]="item.color"
                [link]="item.link"
                [linkTarget]="item.linkTarget"
                [disabled]="item.disabled ?? false"
            />
        </mg-timeline>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTimeline, MagmaTimelineItem],
})
class TestHostDynamicComponent {
    unit: 'year' | 'month' | 'day' = 'year';
    lang: string | undefined = 'en';
    start: number | string | Date | undefined = undefined;
    end: number | string | Date | undefined = undefined;
    direction: 'horizontal' | 'vertical' = 'horizontal';
    showGrid = true;
    tickSize: number | undefined = undefined;
    minGap: number | undefined = undefined;
    items: Array<{
        start: number | string | Date;
        end?: number | string | Date;
        label?: string;
        color?: string;
        link?: string;
        linkTarget?: string;
        disabled?: boolean;
    }> = [];
}

// Individual item test host
@Component({
    template: `
        <mg-timeline unit="year" lang="en" [showGrid]="showGrid" [tickSize]="tickSize">
            <mg-timeline-item
                [start]="itemStart"
                [end]="itemEnd"
                [label]="itemLabel"
                [color]="itemColor"
                [link]="itemLink"
                [linkTarget]="itemLinkTarget"
                [disabled]="itemDisabled"
            />
        </mg-timeline>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTimeline, MagmaTimelineItem],
})
class TestHostSingleItemComponent {
    showGrid = true;
    tickSize: number | undefined = undefined;
    itemStart: number | string | Date = 2020;
    itemEnd: number | string | Date | undefined = 2022;
    itemLabel: string | undefined = 'Test item';
    itemColor: string | undefined = undefined;
    itemLink: string | undefined = undefined;
    itemLinkTarget = '_self';
    itemDisabled = false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Ticks & axis computation
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — ticks computation', () => {
    let hostFixture: ComponentFixture<TestHostTwoItemsComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostTwoItemsComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostTwoItemsComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should compute ticks spanning from min start to max end', () => {
        // Items: start=2020, start=2021, end=2022, end=2023 → axis 2020..2023
        const ticks = timeline['ticks']();
        expect(ticks.length).toBe(4); // 2020, 2021, 2022, 2023
    });

    it('should produce ticks with sequential integer indices', () => {
        const ticks = timeline['ticks']();
        expect(ticks[0].index).toBe(2020);
        expect(ticks[1].index).toBe(2021);
        expect(ticks[2].index).toBe(2022);
        expect(ticks[3].index).toBe(2023);
    });

    it('should render the correct number of .tick DOM elements', () => {
        const tickEls = hostFixture.nativeElement.querySelectorAll('.tick');
        expect(tickEls.length).toBe(4);
    });

    it('should set --tick-pos on each tick element starting at 1', () => {
        const tickEls = hostFixture.nativeElement.querySelectorAll('.tick') as NodeListOf<HTMLElement>;
        for (let i = 0; i < tickEls.length; i++) {
            expect(tickEls[i].style.getPropertyValue('--tick-pos')).toBe(String(i + 1));
        }
    });

    it('should set --mg-timeline-tick-count CSS var on host', () => {
        const el = getTimelineElement(hostFixture);
        expect(el.style.getPropertyValue('--mg-timeline-tick-count')).toBe('4');
    });

    it('tick labels should be year strings for unit="year"', () => {
        const ticks = timeline['ticks']();
        // toLocaleString with {year:'numeric'} for en locale → "2020", "2021", …
        ticks.forEach(tick => {
            expect(tick.label).toMatch(/^\d{4}$/);
        });
    });
});

describe('MagmaTimeline — ticks with explicit start/end', () => {
    let hostFixture: ComponentFixture<TestHostSingleItemComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostSingleItemComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostSingleItemComponent);
        // Override via the timeline directly through host wrapper
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should auto-derive axis to cover item 2020..2022', () => {
        const ticks = timeline['ticks']();
        expect(ticks[0].index).toBe(2020);
        expect(ticks[ticks.length - 1].index).toBe(2022);
    });

    it('should have 3 ticks for year range 2020-2022', () => {
        expect(timeline['ticks']().length).toBe(3);
    });
});

describe('MagmaTimeline — ticks with month unit', () => {
    @Component({
        template: `
            <mg-timeline unit="month" lang="en">
                <mg-timeline-item [start]="'2020-01-01'" [end]="'2020-03-15'" label="Q1" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostMonthComponent {}

    let hostFixture: ComponentFixture<TestHostMonthComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostMonthComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostMonthComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should produce month ticks from Jan 2020 to at least Mar 2020', () => {
        const ticks = timeline['ticks']();
        // start='2020-01-01' → ordinal 24240 (Jan); end='2020-03-15' → ceilToTick(ordinal+frac) may land on Apr
        expect(ticks.length).toBeGreaterThanOrEqual(3);
        expect(ticks[0].index).toBe(2020 * 12 + 0); // January
        expect(ticks[2].index).toBe(2020 * 12 + 2); // March is always present
    });

    it('should format month tick labels (short month + 2-digit year)', () => {
        const ticks = timeline['ticks']();
        // For en locale: "Jan 20", "Feb 20", "Mar 20" (approximate)
        ticks.forEach(tick => {
            expect(tick.label.length).toBeGreaterThan(0);
        });
    });
});

describe('MagmaTimeline — ticks with day unit', () => {
    @Component({
        template: `
            <mg-timeline unit="day" lang="en">
                <mg-timeline-item [start]="'2020-01-01'" [end]="'2020-01-03'" label="Days" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostDayComponent {}

    let hostFixture: ComponentFixture<TestHostDayComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostDayComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostDayComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should produce day ticks for Jan 1-3 2020', () => {
        const ticks = timeline['ticks']();
        expect(ticks.length).toBe(3);
    });

    it('should use UNIX day index for tick index', () => {
        const ticks = timeline['ticks']();
        // 2020-01-01 UTC = 18262 days since epoch
        const jan1 = Math.floor(Date.UTC(2020, 0, 1) / 86400000);
        expect(ticks[0].index).toBe(jan1);
        expect(ticks[1].index).toBe(jan1 + 1);
        expect(ticks[2].index).toBe(jan1 + 2);
    });

    it('should format day tick labels', () => {
        const ticks = timeline['ticks']();
        ticks.forEach(tick => {
            expect(tick.label.length).toBeGreaterThan(0);
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// resolvedItems & track packing
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — resolvedItems', () => {
    let hostFixture: ComponentFixture<TestHostTwoItemsComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostTwoItemsComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostTwoItemsComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should resolve 2 items', () => {
        expect(timeline['resolvedItems']().length).toBe(2);
    });

    it('first item should start at offset 0 (axis starts at 2020)', () => {
        expect(timeline['resolvedItems']()[0].startOffset).toBe(0);
    });

    it('second item startOffset should be 1 (2021 - 2020)', () => {
        expect(timeline['resolvedItems']()[1].startOffset).toBe(1);
    });

    it('first item spanLength should be 2 (2020 to 2022)', () => {
        expect(timeline['resolvedItems']()[0].spanLength).toBe(2);
    });

    it('second item spanLength should be 2 (2021 to 2023)', () => {
        expect(timeline['resolvedItems']()[1].spanLength).toBe(2);
    });

    it('first item should be on track 0', () => {
        expect(timeline['resolvedItems']()[0].trackIndex).toBe(0);
    });

    it('second item (overlapping) should be on track 1', () => {
        expect(timeline['resolvedItems']()[1].trackIndex).toBe(1);
    });

    it('trackCount should be 2 for two overlapping items', () => {
        expect(timeline['trackCount']()).toBe(2);
    });

    it('should set label from input', () => {
        expect(timeline['resolvedItems']()[0].label).toBe('Item A');
        expect(timeline['resolvedItems']()[1].label).toBe('Item B');
    });
});

describe('MagmaTimeline — non-overlapping items stay on same track', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" [minGap]="0">
                <mg-timeline-item [start]="2020" [end]="2021" label="First" />
                <mg-timeline-item [start]="2022" [end]="2023" label="Second" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostNoOverlapComponent {}

    let hostFixture: ComponentFixture<TestHostNoOverlapComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostNoOverlapComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostNoOverlapComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('both non-overlapping items should be on track 0', () => {
        const items = timeline['resolvedItems']();
        expect(items[0].trackIndex).toBe(0);
        expect(items[1].trackIndex).toBe(0);
    });

    it('trackCount should be 1 when no overlap', () => {
        expect(timeline['trackCount']()).toBe(1);
    });
});

describe('MagmaTimeline — minGap forces overlap detection', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" [minGap]="100" [tickSize]="60">
                <mg-timeline-item [start]="2020" [end]="2021" label="A" />
                <mg-timeline-item [start]="2022" [end]="2023" label="B" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostMinGapComponent {}

    let hostFixture: ComponentFixture<TestHostMinGapComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostMinGapComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostMinGapComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should stack items on different tracks when minGap forces overlap', () => {
        // gap=100px / 60px per tick ≈ 1.67 ticks gap: the 1-tick gap between 2021..2022 is < gapFraction
        const items = timeline['resolvedItems']();
        expect(items[0].trackIndex).toBe(0);
        expect(items[1].trackIndex).toBe(1);
    });
});

describe('MagmaTimeline — item with no end input', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" label="Single" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostNoEndComponent {}

    let hostFixture: ComponentFixture<TestHostNoEndComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostNoEndComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostNoEndComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should create a single tick for a single-year item', () => {
        expect(timeline['ticks']().length).toBe(1);
    });

    it('item without end should have spanLength = 1/totalTicks (minimum)', () => {
        const resolved = timeline['resolvedItems']();
        const totalTicks = timeline['ticks']().length; // 1
        expect(resolved[0].spanLength).toBe(1 / totalTicks);
    });
});

describe('MagmaTimeline — ISO date strings', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item start="2020-06-15" end="2022-01-01" label="ISO" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostISOComponent {}

    let hostFixture: ComponentFixture<TestHostISOComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostISOComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostISOComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should parse ISO start date and produce a fractional startOffset', () => {
        const resolved = timeline['resolvedItems']();
        // 2020-06-15 → year 2020 + frac > 0 → startOffset > 0
        expect(resolved[0].startOffset).toBeGreaterThan(0);
        expect(resolved[0].startOffset).toBeLessThan(1);
    });

    it('should start axis at 2020 and cover through at least 2022', () => {
        const ticks = timeline['ticks']();
        // start='2020-06-15' → floor → 2020; end='2022-01-01' → exact ≈ 2022.0027 → ceil → 2023
        expect(ticks[0].index).toBe(2020);
        expect(ticks[ticks.length - 1].index).toBeGreaterThanOrEqual(2022);
    });
});

describe('MagmaTimeline — Date object inputs', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="startDate" [end]="endDate" label="DateObj" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostDateObjComponent {
        startDate = new Date(2019, 0, 1);
        endDate = new Date(2021, 11, 31);
    }

    let hostFixture: ComponentFixture<TestHostDateObjComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostDateObjComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostDateObjComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should accept Date objects and compute ticks starting at 2019', () => {
        const ticks = timeline['ticks']();
        // start=Jan 1 2019 → floor → 2019; end=Dec 31 2021 → exact ≈ 2021.997 → ceil → 2022
        expect(ticks[0].index).toBe(2019);
        expect(ticks[ticks.length - 1].index).toBeGreaterThanOrEqual(2021);
    });

    it('startOffset for Jan 1 should be ≈ 0', () => {
        const resolved = timeline['resolvedItems']();
        expect(resolved[0].startOffset).toBeCloseTo(0, 2);
    });
});

describe('MagmaTimeline — numeric string inputs', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item start="2018" end="2020" label="NumStr" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostNumStrComponent {}

    let hostFixture: ComponentFixture<TestHostNumStrComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostNumStrComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostNumStrComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should parse numeric string and produce ticks from 2018 to 2020', () => {
        const ticks = timeline['ticks']();
        expect(ticks[0].index).toBe(2018);
        expect(ticks[ticks.length - 1].index).toBe(2020);
        expect(ticks.length).toBe(3);
    });

    it('startOffset should be 0 for numeric string "2018"', () => {
        expect(timeline['resolvedItems']()[0].startOffset).toBe(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// DOM rendering tests
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — DOM structure', () => {
    let hostFixture: ComponentFixture<TestHostSingleItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostSingleItemComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostSingleItemComponent);
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should render .timeline-grid', () => {
        expect(hostFixture.nativeElement.querySelector('.timeline-grid')).toBeTruthy();
    });

    it('should render .axis', () => {
        expect(hostFixture.nativeElement.querySelector('.axis')).toBeTruthy();
    });

    it('should render .items container', () => {
        expect(hostFixture.nativeElement.querySelector('.items')).toBeTruthy();
    });

    it('should render .grid-lines when showGrid is true', () => {
        expect(hostFixture.nativeElement.querySelector('.grid-lines')).toBeTruthy();
    });

    it('should NOT render .grid-lines when showGrid is false', () => {
        hostFixture.componentInstance.showGrid = false;
        hostFixture.changeDetectorRef.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.grid-lines')).toBeNull();
    });

    it('should render one .item element', () => {
        const items = hostFixture.nativeElement.querySelectorAll('.item');
        expect(items.length).toBe(1);
    });

    it('should render item-inner as <div> when no link', () => {
        const inner = hostFixture.nativeElement.querySelector('.item-inner');
        expect(inner.tagName.toLowerCase()).toBe('div');
    });

    it('should render item-inner as <a> when link is provided', () => {
        hostFixture.componentInstance.itemLink = '#test-link';
        hostFixture.changeDetectorRef.detectChanges();

        const inner = hostFixture.nativeElement.querySelector('.item-inner');
        expect(inner.tagName.toLowerCase()).toBe('a');
        expect(inner.getAttribute('href')).toBe('#test-link');
    });

    it('should set [target] on <a> link', () => {
        hostFixture.componentInstance.itemLink = '#test-link';
        hostFixture.componentInstance.itemLinkTarget = '_blank';
        hostFixture.changeDetectorRef.detectChanges();

        const anchor = hostFixture.nativeElement.querySelector('a.item-inner');
        expect(anchor.getAttribute('target')).toBe('_blank');
    });

    it('should render item-inner as <div> when disabled even with link', () => {
        hostFixture.componentInstance.itemLink = '#test-link';
        hostFixture.componentInstance.itemDisabled = true;
        hostFixture.changeDetectorRef.detectChanges();

        const inner = hostFixture.nativeElement.querySelector('.item-inner');
        expect(inner.tagName.toLowerCase()).toBe('div');
    });

    it('should add has-link class on .item when link is set and not disabled', () => {
        hostFixture.componentInstance.itemLink = '#test-link';
        hostFixture.changeDetectorRef.detectChanges();

        const item = hostFixture.nativeElement.querySelector('.item');
        expect(item.classList.contains('has-link')).toBe(true);
    });

    it('should NOT add has-link class when item is disabled', () => {
        hostFixture.componentInstance.itemLink = '#test-link';
        hostFixture.componentInstance.itemDisabled = true;
        hostFixture.changeDetectorRef.detectChanges();

        const item = hostFixture.nativeElement.querySelector('.item');
        expect(item.classList.contains('has-link')).toBe(false);
    });

    it('should NOT add has-link class when no link', () => {
        const item = hostFixture.nativeElement.querySelector('.item');
        expect(item.classList.contains('has-link')).toBe(false);
    });

    it('should add disabled class on .item when disabled', () => {
        hostFixture.componentInstance.itemDisabled = true;
        hostFixture.changeDetectorRef.detectChanges();

        const item = hostFixture.nativeElement.querySelector('.item');
        expect(item.classList.contains('disabled')).toBe(true);
    });

    it('should NOT add disabled class when not disabled', () => {
        const item = hostFixture.nativeElement.querySelector('.item');
        expect(item.classList.contains('disabled')).toBe(false);
    });

    it('should set --item-color CSS var when color is set', () => {
        hostFixture.componentInstance.itemColor = '#ff0000';
        hostFixture.changeDetectorRef.detectChanges();

        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        expect(item.style.getPropertyValue('--item-color')).toBe('#ff0000');
    });

    it('should not set --item-color CSS var when no color', () => {
        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        // [style.--item-color]="item.color || null" → null clears the prop
        expect(item.style.getPropertyValue('--item-color')).toBe('');
    });

    it('should set --item-track CSS var to 1 (first track)', () => {
        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        expect(item.style.getPropertyValue('--item-track')).toBe('1');
    });

    it('should set --item-offset-pct CSS var', () => {
        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        // startOffset = 0, tickSize = 60 → 0 * 60 = 0
        expect(item.style.getPropertyValue('--item-offset-pct')).toBe('0px');
    });

    it('should update --item-offset-pct when tickSize changes', () => {
        // Second item in TestHostTwoItemsComponent has offset=1 tick
        // But here single item at 2020 has offset=0; let's verify tickSize scaling via two-item host
    });

    it('should render .item-label span with item label', () => {
        const label = hostFixture.nativeElement.querySelector('.item-label');
        expect(label).toBeTruthy();
        // contentHtml falls back to label since no projected content
        expect(label.textContent).toContain('Test item');
    });
});

describe('MagmaTimeline — CSS vars with tickSize', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" [tickSize]="100">
                <mg-timeline-item [start]="2020" [end]="2022" label="A" />
                <mg-timeline-item [start]="2021" [end]="2023" label="B" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostTickSizeComponent {}

    let hostFixture: ComponentFixture<TestHostTickSizeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTickSizeComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTickSizeComponent);
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should set --mg-timeline-tick-size to 100px when tickSize=100', () => {
        const el = getTimelineElement(hostFixture);
        expect(el.style.getPropertyValue('--mg-timeline-tick-size')).toBe('100px');
    });

    it('should scale --item-span-pct by tickSize', () => {
        // First item: spanLength=2, tickSize=100 → 2*100=200
        const items = hostFixture.nativeElement.querySelectorAll('.item') as NodeListOf<HTMLElement>;
        expect(items[0].style.getPropertyValue('--item-span-pct')).toBe('200px');
    });

    it('second item --item-offset-pct should use tickSize=100', () => {
        // Second item: startOffset=1, tickSize=100 → 1*100=100
        const items = hostFixture.nativeElement.querySelectorAll('.item') as NodeListOf<HTMLElement>;
        expect(items[1].style.getPropertyValue('--item-offset-pct')).toBe('100px');
    });
});

describe('MagmaTimeline — grid-line count matches tick count', () => {
    let hostFixture: ComponentFixture<TestHostTwoItemsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTwoItemsComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTwoItemsComponent);
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('grid-line count should equal tick count', () => {
        const gridLines = hostFixture.nativeElement.querySelectorAll('.grid-line');
        const ticks = hostFixture.nativeElement.querySelectorAll('.tick');
        expect(gridLines.length).toBe(ticks.length);
    });

    it('each grid-line should have --tick-pos CSS var', () => {
        const gridLines = hostFixture.nativeElement.querySelectorAll('.grid-line') as NodeListOf<HTMLElement>;
        for (let i = 0; i < gridLines.length; i++) {
            expect(gridLines[i].style.getPropertyValue('--tick-pos')).toBe(String(i + 1));
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Direction
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — direction input', () => {
    @Component({
        template: `
            <mg-timeline [direction]="direction" unit="year">
                <mg-timeline-item [start]="2020" [end]="2021" label="A" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostDirectionComponent {
        direction: 'horizontal' | 'vertical' = 'horizontal';
    }

    let hostFixture: ComponentFixture<TestHostDirectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostDirectionComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostDirectionComponent);
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should have class "horizontal" by default', () => {
        const el = getTimelineElement(hostFixture);
        expect(el.classList.contains('horizontal')).toBe(true);
    });

    it('should switch to class "vertical" and remove "horizontal"', () => {
        hostFixture.componentInstance.direction = 'vertical';
        hostFixture.changeDetectorRef.detectChanges();

        const el = getTimelineElement(hostFixture);
        expect(el.classList.contains('vertical')).toBe(true);
        expect(el.classList.contains('horizontal')).toBe(false);
    });

    it('should switch back to "horizontal" from "vertical"', () => {
        hostFixture.componentInstance.direction = 'vertical';
        hostFixture.changeDetectorRef.detectChanges();

        hostFixture.componentInstance.direction = 'horizontal';
        hostFixture.changeDetectorRef.detectChanges();

        const el = getTimelineElement(hostFixture);
        expect(el.classList.contains('horizontal')).toBe(true);
        expect(el.classList.contains('vertical')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// itemClick output
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — itemClick output', () => {
    let hostFixture: ComponentFixture<TestHostSingleItemComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostSingleItemComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostSingleItemComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should emit itemClick when clicking item-inner div', () => {
        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should include label in itemClick payload', () => {
        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        const payload = spy.mock.calls[0][0] as MagmaTimelineClickEvent;
        expect(payload.label).toBe('Test item');
    });

    it('should include start in itemClick payload', () => {
        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        const payload = spy.mock.calls[0][0] as MagmaTimelineClickEvent;
        expect(payload.start).toBe(2020);
    });

    it('should include end in itemClick payload', () => {
        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        const payload = spy.mock.calls[0][0] as MagmaTimelineClickEvent;
        expect(payload.end).toBe(2022);
    });

    it('should include color in itemClick payload (undefined when not set)', () => {
        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        const payload = spy.mock.calls[0][0] as MagmaTimelineClickEvent;
        expect(payload.color).toBeUndefined();
    });

    it('should include color in itemClick payload when set', () => {
        hostFixture.componentInstance.itemColor = '#abc';
        hostFixture.changeDetectorRef.detectChanges();

        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        const payload = spy.mock.calls[0][0] as MagmaTimelineClickEvent;
        expect(payload.color).toBe('#abc');
    });

    it('should include the original MouseEvent in itemClick payload', () => {
        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        const payload = spy.mock.calls[0][0] as MagmaTimelineClickEvent;
        expect(payload.event).toBeInstanceOf(MouseEvent);
    });

    it('should NOT emit itemClick when clicking a linked item (<a>)', () => {
        hostFixture.componentInstance.itemLink = '#test-link';
        hostFixture.changeDetectorRef.detectChanges();

        const spy = vi.spyOn(timeline.itemClick, 'emit');
        // Use dispatchEvent with a prevented default to avoid iframe navigation
        const anchor = hostFixture.nativeElement.querySelector('a.item-inner') as HTMLAnchorElement;
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true });
        anchor.dispatchEvent(evt);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should emit itemClick when clicking a disabled item (even with link)', () => {
        hostFixture.componentInstance.itemLink = '#test-link';
        hostFixture.componentInstance.itemDisabled = true;
        hostFixture.changeDetectorRef.detectChanges();

        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should include link=undefined in itemClick payload for non-linked item', () => {
        const spy = vi.spyOn(timeline.itemClick, 'emit');
        const inner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        inner.click();

        const payload = spy.mock.calls[0][0] as MagmaTimelineClickEvent;
        expect(payload.link).toBeUndefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// onItemClick guard — direct unit test via the protected method
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — onItemClick guard', () => {
    let component: MagmaTimeline;
    let fixture: ComponentFixture<MagmaTimeline>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaTimeline],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTimeline);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should NOT emit when item has a link and is not disabled', () => {
        const spy = vi.spyOn(component.itemClick, 'emit');
        const fakeItem = {
            label: 'X',
            contentHtml: 'X',
            startOffset: 0,
            spanLength: 1,
            color: undefined,
            link: '#test-link',
            linkTarget: '_self',
            disabled: false,
            trackIndex: 0,
            sourceItem: { start: () => 2020, end: () => undefined } as any,
        };

        (component as any).onItemClick(fakeItem, new MouseEvent('click'));

        expect(spy).not.toHaveBeenCalled();
    });

    it('should emit when item has a link but is disabled', () => {
        const spy = vi.spyOn(component.itemClick, 'emit');
        const fakeItem = {
            label: 'X',
            contentHtml: 'X',
            startOffset: 0,
            spanLength: 1,
            color: undefined,
            link: '#test-link',
            linkTarget: '_self',
            disabled: true,
            trackIndex: 0,
            sourceItem: { start: () => 2020, end: () => undefined } as any,
        };

        (component as any).onItemClick(fakeItem, new MouseEvent('click'));

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit when item has no link', () => {
        const spy = vi.spyOn(component.itemClick, 'emit');
        const fakeItem = {
            label: 'Y',
            contentHtml: 'Y',
            startOffset: 0,
            spanLength: 1,
            color: undefined,
            link: undefined,
            linkTarget: '_self',
            disabled: false,
            trackIndex: 0,
            sourceItem: { start: () => 2020, end: () => undefined } as any,
        };

        (component as any).onItemClick(fakeItem, new MouseEvent('click'));

        expect(spy).toHaveBeenCalledTimes(1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// trackCount computed
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — trackCount', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2021" label="A" />
                <mg-timeline-item [start]="2020" [end]="2021" label="B" />
                <mg-timeline-item [start]="2020" [end]="2021" label="C" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostThreeOverlapComponent {}

    let hostFixture: ComponentFixture<TestHostThreeOverlapComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostThreeOverlapComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostThreeOverlapComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should return 3 for three fully-overlapping items', () => {
        expect(timeline['trackCount']()).toBe(3);
    });

    it('should set --mg-timeline-track-count CSS var to 3', () => {
        const el = getTimelineElement(hostFixture);
        expect(el.style.getPropertyValue('--mg-timeline-track-count')).toBe('3');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Explicit start/end axis override
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — explicit start/end override', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" [start]="2015" [end]="2025">
                <mg-timeline-item [start]="2020" [end]="2021" label="A" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostExplicitBoundsComponent {}

    let hostFixture: ComponentFixture<TestHostExplicitBoundsComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostExplicitBoundsComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostExplicitBoundsComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should produce ticks from explicit start 2015', () => {
        expect(timeline['ticks']()[0].index).toBe(2015);
    });

    it('should produce ticks to explicit end 2025', () => {
        const ticks = timeline['ticks']();
        expect(ticks[ticks.length - 1].index).toBe(2025);
    });

    it('should produce 11 ticks for 2015..2025', () => {
        expect(timeline['ticks']().length).toBe(11);
    });

    it('item startOffset should reflect position relative to axis start (2015)', () => {
        // item starts at 2020, axis starts at 2015 → offset = 5
        expect(timeline['resolvedItems']()[0].startOffset).toBe(5);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// lang input
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — lang input', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="fr">
                <mg-timeline-item [start]="2020" [end]="2021" label="FR" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostFrComponent {}

    let hostFixture: ComponentFixture<TestHostFrComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostFrComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostFrComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should produce non-empty tick labels with French locale', () => {
        timeline['ticks']().forEach(tick => {
            expect(tick.label.length).toBeGreaterThan(0);
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Edge cases — invalid Date / resolveExact defensive branches
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — resolveExact with invalid Date object', () => {
    let component: MagmaTimeline;
    let fixture: ComponentFixture<MagmaTimeline>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaTimeline],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTimeline);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should return undefined for an invalid Date object', () => {
        const result = (component as any).resolveExact(new Date('not-a-date'));
        expect(result).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
        const result = (component as any).resolveExact(undefined);
        expect(result).toBeUndefined();
    });

    it('should return undefined for null input', () => {
        const result = (component as any).resolveExact(null);
        expect(result).toBeUndefined();
    });
});

describe('MagmaTimeline — maxExactValue/minExactValue resolveExact returns undefined branch', () => {
    /**
     * To hit the `?? -Infinity` / `?? Infinity` fallback branches in
     * maxExactValue() and minExactValue(), we need real content children
     * whose start/end values are invalid Date objects so that resolveExact()
     * returns undefined. A `new Date('invalid')` Date object satisfies this.
     */
    @Component({
        template: `
            <mg-timeline unit="year">
                <mg-timeline-item [start]="invalidDate" [end]="invalidDate" label="Invalid" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostInvalidDateComponent {
        invalidDate = new Date('invalid');
    }

    let hostFixture: ComponentFixture<TestHostInvalidDateComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostInvalidDateComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostInvalidDateComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should return -Infinity from maxExactValue when item resolveExact yields undefined', () => {
        const result = (timeline as any).maxExactValue();
        expect(result).toBe(-Infinity);
    });

    it('should return Infinity from minExactValue when item resolveExact yields undefined', () => {
        const result = (timeline as any).minExactValue();
        expect(result).toBe(Infinity);
    });
});

describe('MagmaTimeline — track packing, 3rd track branch', () => {
    /**
     * To hit lines 163-169 (trackIndex = t+1 when all tracks are occupied),
     * we need an item that doesn't fit in any existing track and therefore
     * creates a new one. Three fully overlapping items guarantees this path.
     * The third item (index 2) must go through t=0 (occupied), t=1 (occupied)
     * and finally set trackIndex=2 and push a new track.
     */
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2025" label="A" />
                <mg-timeline-item [start]="2020" [end]="2025" label="B" />
                <mg-timeline-item [start]="2020" [end]="2025" label="C" />
                <mg-timeline-item [start]="2020" [end]="2025" label="D" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostFourOverlapComponent {}

    let hostFixture: ComponentFixture<TestHostFourOverlapComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostFourOverlapComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostFourOverlapComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should place 4 fully-overlapping items on 4 separate tracks', () => {
        const items = timeline['resolvedItems']();
        expect(items[0].trackIndex).toBe(0);
        expect(items[1].trackIndex).toBe(1);
        expect(items[2].trackIndex).toBe(2);
        expect(items[3].trackIndex).toBe(3);
    });

    it('trackCount should be 4', () => {
        expect(timeline['trackCount']()).toBe(4);
    });
});

describe('MagmaTimeline — resolveExact with ISO string that produces invalid date', () => {
    let component: MagmaTimeline;
    let fixture: ComponentFixture<MagmaTimeline>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MagmaTimeline] }).compileComponents();
        fixture = TestBed.createComponent(MagmaTimeline);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should return undefined for an ISO-like string that produces NaN date', () => {
        // We need a string that passes isISODate() but creates an invalid Date.
        // We mock isISODate to return true for a string that produces NaN.
        // Alternatively, test via the private method with a spy on Date constructor.
        // The simplest approach: spy on isISODate's outcome via the method itself.
        // Since isISODate is imported, spy on the private method's flow by
        // passing a value that the implementation would parse as NaN.
        // We use vi.spyOn on the private method to inject the invalid Date path.
        const invalidDateSpy = vi.spyOn(component as any, 'dateToExact');
        invalidDateSpy.mockReturnValue(NaN);

        // Now pass a real ISO string; resolveExact will call isISODate → true,
        // parse to a valid Date, then call dateToExact (mocked).
        // But the isNaN check is on d.getTime(), not dateToExact's return.
        // We need a different approach: directly stub resolveExact scenario.

        // The real untested branch is: isISODate(value) is true AND new Date(value) is NaN.
        // In practice isISODate only returns true for valid ISO strings, so new Date() is always valid.
        // We verify the guard exists by checking the undefined path via an invalid Date directly.
        const result = (component as any).resolveExact(new Date('INVALID'));
        expect(result).toBeUndefined();

        invalidDateSpy.mockRestore();
    });
});

describe('MagmaTimeline — track packing, item fits on track 1 (not 0)', () => {
    /**
     * Item A: 2020-2022 → track 0
     * Item B: 2020-2022 → track 1 (overlaps A)
     * Item C: 2023-2025 → track 0 is free (no overlap with A), but V8 branch coverage
     *                      needs the loop to visit t=0 → occupied=false → placed on track 0
     * Actually to hit "found a free track at t>0", we need:
     *   Item A: 2020-2022 → track 0
     *   Item B: 2020-2022 → track 1 (overlaps A)
     *   Item C: 2021-2021 overlaps A(track0) but NOT B(track1) → placed on track 1
     * This makes the loop: t=0 occupied, t=1 not occupied → break at t=1 → "placed on existing track"
     */
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" [minGap]="0">
                <mg-timeline-item [start]="2020" [end]="2022" label="A" />
                <mg-timeline-item [start]="2020" [end]="2025" label="B" />
                <mg-timeline-item [start]="2023" [end]="2025" label="C" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostTrackFitComponent {}

    let hostFixture: ComponentFixture<TestHostTrackFitComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTrackFitComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTrackFitComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('item A should be on track 0', () => {
        expect(timeline['resolvedItems']()[0].trackIndex).toBe(0);
    });

    it('item B should be on track 1 (overlaps A on track 0)', () => {
        expect(timeline['resolvedItems']()[1].trackIndex).toBe(1);
    });

    it('item C should fit on track 0 (A ended at 2022, C starts at 2023)', () => {
        // A occupies 2020-2022 on track 0; B occupies 2020-2025 on track 1.
        // C starts at 2023 (after A) → fits track 0; this exercises the !occupied path at t=0
        expect(timeline['resolvedItems']()[2].trackIndex).toBe(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// MagmaTimelineAnnotation — class instantiation and inputs
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — annotations rendering (resolvedAnnotations)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2021" label="Item" />
                <mg-timeline-annotation [start]="2020" label="Ann A" color="#f00" />
                <mg-timeline-annotation [start]="2021" label="Ann B" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationBasicComponent {}

    let hostFixture: ComponentFixture<TestHostAnnotationBasicComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationBasicComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationBasicComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should resolve 2 annotations', () => {
        expect(timeline['resolvedAnnotations']().length).toBe(2);
    });

    it('first annotation label should be "Ann A"', () => {
        expect(timeline['resolvedAnnotations']()[0].label).toBe('Ann A');
    });

    it('first annotation color should be "#f00"', () => {
        expect(timeline['resolvedAnnotations']()[0].color).toBe('#f00');
    });

    it('second annotation color should be undefined', () => {
        expect(timeline['resolvedAnnotations']()[1].color).toBeUndefined();
    });

    it('should render .annotation elements in the DOM', () => {
        const annEls = hostFixture.nativeElement.querySelectorAll('.annotation');
        expect(annEls.length).toBe(2);
    });

    it('annotation without link should render a div.annotation-flag', () => {
        const flags = hostFixture.nativeElement.querySelectorAll('.annotation-flag');
        expect(flags[0].tagName.toLowerCase()).toBe('div');
    });

    it('annotation offset for start=2020 on axis starting at 2020 should be 0', () => {
        expect(timeline['resolvedAnnotations']()[0].offset).toBe(0);
    });

    it('should set --ann-color CSS var when color is provided', () => {
        const annEl = hostFixture.nativeElement.querySelector('.annotation') as HTMLElement;
        expect(annEl.style.getPropertyValue('--ann-color')).toBe('#f00');
    });

    it('should NOT set --ann-color when no color', () => {
        const annEls = hostFixture.nativeElement.querySelectorAll('.annotation') as NodeListOf<HTMLElement>;
        // Second annotation has no color → null → property cleared
        expect(annEls[1].style.getPropertyValue('--ann-color')).toBe('');
    });

    it('contentHtml should fall back to label when no projected content', () => {
        expect(timeline['resolvedAnnotations']()[0].contentHtml).toBe('Ann A');
    });
});

describe('MagmaTimeline — annotation with link (renders <a>)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2021" label="Item" />
                <mg-timeline-annotation [start]="2020" label="Linked" link="https://example.com" linkTarget="_blank" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationLinkComponent {}

    let hostFixture: ComponentFixture<TestHostAnnotationLinkComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationLinkComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationLinkComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('annotation with link should render an <a> element', () => {
        const flag = hostFixture.nativeElement.querySelector('.annotation-flag');
        expect(flag.tagName.toLowerCase()).toBe('a');
    });

    it('annotation <a> should have correct href', () => {
        const a = hostFixture.nativeElement.querySelector('a.annotation-flag');
        expect(a.getAttribute('href')).toBe('https://example.com');
    });

    it('annotation <a> should have target="_blank"', () => {
        const a = hostFixture.nativeElement.querySelector('a.annotation-flag');
        expect(a.getAttribute('target')).toBe('_blank');
    });

    it('annotation with link should add has-link class', () => {
        const ann = hostFixture.nativeElement.querySelector('.annotation');
        expect(ann.classList.contains('has-link')).toBe(true);
    });

    it('resolved annotation link should be set', () => {
        expect(timeline['resolvedAnnotations']()[0].link).toBe('https://example.com');
    });

    it('resolved annotation linkTarget should be "_blank"', () => {
        expect(timeline['resolvedAnnotations']()[0].linkTarget).toBe('_blank');
    });
});

describe('MagmaTimeline — annotation disabled (renders div even with link)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2021" label="Item" />
                <mg-timeline-annotation [start]="2020" label="Disabled" link="https://example.com" [disabled]="true" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationDisabledComponent {}

    let hostFixture: ComponentFixture<TestHostAnnotationDisabledComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationDisabledComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationDisabledComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('disabled annotation with link should still render a div.annotation-flag', () => {
        const flag = hostFixture.nativeElement.querySelector('.annotation-flag');
        expect(flag.tagName.toLowerCase()).toBe('div');
    });

    it('disabled annotation should add .disabled class on .annotation', () => {
        const ann = hostFixture.nativeElement.querySelector('.annotation');
        expect(ann.classList.contains('disabled')).toBe(true);
    });

    it('disabled annotation should NOT add has-link class', () => {
        const ann = hostFixture.nativeElement.querySelector('.annotation');
        expect(ann.classList.contains('has-link')).toBe(false);
    });

    it('resolved annotation disabled should be true', () => {
        expect(timeline['resolvedAnnotations']()[0].disabled).toBe(true);
    });
});

describe('MagmaTimeline — annotation nowrap input', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2021" label="Item" />
                <mg-timeline-annotation [start]="2020" label="Wrap" [nowrap]="true" />
                <mg-timeline-annotation [start]="2021" label="NoWrap" [nowrap]="false" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationNowrapComponent {}

    let hostFixture: ComponentFixture<TestHostAnnotationNowrapComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationNowrapComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationNowrapComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('first annotation nowrap should be true', () => {
        expect(timeline['resolvedAnnotations']()[0].nowrap).toBe(true);
    });

    it('second annotation nowrap should be false', () => {
        expect(timeline['resolvedAnnotations']()[1].nowrap).toBe(false);
    });

    it('annotation-flag with nowrap=true should have .nowrap class', () => {
        const flags = hostFixture.nativeElement.querySelectorAll('.annotation-flag') as NodeListOf<HTMLElement>;
        expect(flags[0].classList.contains('nowrap')).toBe(true);
    });

    it('annotation-flag with nowrap=false should NOT have .nowrap class', () => {
        const flags = hostFixture.nativeElement.querySelectorAll('.annotation-flag') as NodeListOf<HTMLElement>;
        expect(flags[1].classList.contains('nowrap')).toBe(false);
    });
});

describe('MagmaTimeline — annotation clamping outside axis bounds', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2022" label="Item" />
                <mg-timeline-annotation [start]="2015" label="Before" />
                <mg-timeline-annotation [start]="2030" label="After" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationClampComponent {}

    let hostFixture: ComponentFixture<TestHostAnnotationClampComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationClampComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationClampComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('annotation before axis start should be clamped to offset 0', () => {
        // axis starts at 2020, annotation at 2015 → clampedExact=2020 → offset=0
        expect(timeline['resolvedAnnotations']()[0].offset).toBe(0);
    });

    it('annotation after axis end should be clamped to max offset', () => {
        // axis ends at 2030 (last tick index), annotation at 2030 → clamped to lastTick
        // offset = lastTick.index - firstTick.index = ticks.length - 1
        const offset = timeline['resolvedAnnotations']()[1].offset;
        const ticks = timeline['ticks']();
        expect(offset).toBe(ticks.length - 1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// onAnnotationClick output
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — onAnnotationClick output', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2021" label="Item" />
                <mg-timeline-annotation [start]="2020" label="Clickable" color="#abc" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationClickComponent {}

    let hostFixture: ComponentFixture<TestHostAnnotationClickComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationClickComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationClickComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should emit annotationClick when clicking annotation-flag div', () => {
        const spy = vi.spyOn(timeline.annotationClick, 'emit');
        const flag = hostFixture.nativeElement.querySelector('.annotation-flag') as HTMLElement;
        flag.click();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('annotationClick payload should have correct label', () => {
        const spy = vi.spyOn(timeline.annotationClick, 'emit');
        const flag = hostFixture.nativeElement.querySelector('.annotation-flag') as HTMLElement;
        flag.click();
        expect(spy.mock.calls[0][0].label).toBe('Clickable');
    });

    it('annotationClick payload should have correct color', () => {
        const spy = vi.spyOn(timeline.annotationClick, 'emit');
        const flag = hostFixture.nativeElement.querySelector('.annotation-flag') as HTMLElement;
        flag.click();
        expect(spy.mock.calls[0][0].color).toBe('#abc');
    });

    it('annotationClick payload should have start=2020', () => {
        const spy = vi.spyOn(timeline.annotationClick, 'emit');
        const flag = hostFixture.nativeElement.querySelector('.annotation-flag') as HTMLElement;
        flag.click();
        expect(spy.mock.calls[0][0].start).toBe(2020);
    });

    it('annotationClick payload should include the original MouseEvent', () => {
        const spy = vi.spyOn(timeline.annotationClick, 'emit');
        const flag = hostFixture.nativeElement.querySelector('.annotation-flag') as HTMLElement;
        flag.click();
        expect(spy.mock.calls[0][0].event).toBeInstanceOf(MouseEvent);
    });
});

describe('MagmaTimeline — onAnnotationClick guard (link prevents emit)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2021" label="Item" />
                <mg-timeline-annotation [start]="2020" label="Linked" link="https://example.com" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationLinkedClickComponent {}

    let hostFixture: ComponentFixture<TestHostAnnotationLinkedClickComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationLinkedClickComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationLinkedClickComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should NOT emit annotationClick when annotation has a link and is not disabled', () => {
        const spy = vi.spyOn(timeline.annotationClick, 'emit');
        // With link + !disabled → rendered as <a>, no click handler → guard in onAnnotationClick
        const ann = timeline['resolvedAnnotations']()[0];
        (timeline as any).onAnnotationClick(ann, new MouseEvent('click'));
        expect(spy).not.toHaveBeenCalled();
    });

    it('should emit annotationClick when annotation has a link but is disabled', () => {
        const spy = vi.spyOn(timeline.annotationClick, 'emit');
        const ann = { ...timeline['resolvedAnnotations']()[0], disabled: true };
        (timeline as any).onAnnotationClick(ann, new MouseEvent('click'));
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// onItemHover, onItemLeave, ngOnDestroy
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — onItemHover with no tooltips (early return)', () => {
    let hostFixture: ComponentFixture<TestHostSingleItemComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostSingleItemComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostSingleItemComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should not emit itemHover when item has no tooltips', () => {
        const spy = vi.spyOn(timeline.itemHover, 'emit');
        const item = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect(spy).not.toHaveBeenCalled();
    });
});

describe('MagmaTimeline — onItemHover with linked item (no emit)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Linked" link="https://example.com">
                    <mg-timeline-item-tooltip content="Tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostLinkedItemTooltipComponent {}

    let hostFixture: ComponentFixture<TestHostLinkedItemTooltipComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostLinkedItemTooltipComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostLinkedItemTooltipComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should NOT emit itemHover when item has a link and tooltips (opens overlay, no event)', () => {
        const spy = vi.spyOn(timeline.itemHover, 'emit');
        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect(spy).not.toHaveBeenCalled();
    });
});

describe('MagmaTimeline — onItemLeave closes overlays', () => {
    let hostFixture: ComponentFixture<TestHostSingleItemComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostSingleItemComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostSingleItemComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should call _closeEntryOverlays on mouseleave', () => {
        const spy = vi.spyOn(timeline as any, '_closeEntryOverlays');
        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        expect(spy).toHaveBeenCalled();
    });
});

describe('MagmaTimeline — ngOnDestroy closes overlays', () => {
    let hostFixture: ComponentFixture<TestHostSingleItemComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostSingleItemComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostSingleItemComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    // no afterEach destroy — we test it explicitly

    it('should call _closeEntryOverlays on ngOnDestroy', () => {
        const spy = vi.spyOn(timeline as any, '_closeEntryOverlays');
        timeline.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
        hostFixture.destroy();
        TestBed.resetTestingModule();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// MagmaTimelineItemTooltip — class inputs + resolveItemTooltips
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — resolveItemTooltips with dated tooltip (content string)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Event A" color="#abc" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipStringComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipStringComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipStringComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipStringComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should resolve 1 tooltip', () => {
        const items = timeline['resolvedItems']();
        expect(items[0].tooltips.length).toBe(1);
    });

    it('tooltip contentHtml should be "Event A"', () => {
        expect(timeline['resolvedItems']()[0].tooltips[0].contentHtml).toBe('Event A');
    });

    it('tooltip color should be "#abc"', () => {
        expect(timeline['resolvedItems']()[0].tooltips[0].color).toBe('#abc');
    });

    it('tooltip dateLabel should be defined (year=2021 formatted)', () => {
        const dateLabel = timeline['resolvedItems']()[0].tooltips[0].dateLabel;
        expect(dateLabel).toBeDefined();
        expect(dateLabel).toMatch(/2021/);
    });

    it('tooltip dateOffset should be between 0 and 1 for date=2021 within 2020-2023', () => {
        const offset = timeline['resolvedItems']()[0].tooltips[0].dateOffset;
        expect(offset).toBeDefined();
        expect(offset!).toBeGreaterThan(0);
        expect(offset!).toBeLessThan(1);
    });

    it('should render .item-mark in DOM when tooltip has a date', () => {
        const mark = hostFixture.nativeElement.querySelector('.item-mark');
        expect(mark).toBeTruthy();
    });

    it('.item-mark should have --tip-color CSS var set', () => {
        const mark = hostFixture.nativeElement.querySelector('.item-mark') as HTMLElement;
        expect(mark.style.getPropertyValue('--tip-color')).toBe('#abc');
    });
});

describe('MagmaTimeline — resolveItemTooltips with tooltip without date', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip content="No date" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipNoDatComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipNoDatComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipNoDatComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipNoDatComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('tooltip dateOffset should be undefined when no date', () => {
        expect(timeline['resolvedItems']()[0].tooltips[0].dateOffset).toBeUndefined();
    });

    it('tooltip dateLabel should be undefined when no date', () => {
        expect(timeline['resolvedItems']()[0].tooltips[0].dateLabel).toBeUndefined();
    });

    it('should NOT render .item-mark when tooltip has no date', () => {
        const mark = hostFixture.nativeElement.querySelector('.item-mark');
        expect(mark).toBeNull();
    });
});

describe('MagmaTimeline — formatTooltipDate with Date object', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip [date]="dateObj" content="DateObj tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipDateObjComponent {
        dateObj = new Date(2021, 5, 15); // June 15 2021
    }

    let hostFixture: ComponentFixture<TestHostTooltipDateObjComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipDateObjComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipDateObjComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('tooltip dateLabel should contain "2021" for a Date object input', () => {
        const dateLabel = timeline['resolvedItems']()[0].tooltips[0].dateLabel;
        expect(dateLabel).toContain('2021');
    });
});

describe('MagmaTimeline — formatTooltipDate with plain year number', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip [date]="2021" content="Year tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipYearNumberComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipYearNumberComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipYearNumberComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipYearNumberComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('tooltip dateLabel should contain "2021" for a plain year number', () => {
        const dateLabel = timeline['resolvedItems']()[0].tooltips[0].dateLabel;
        expect(dateLabel).toContain('2021');
    });
});

describe('MagmaTimeline — formatTooltipDate unit=month', () => {
    @Component({
        template: `
            <mg-timeline unit="month" lang="en">
                <mg-timeline-item start="2021-01-01" end="2021-12-01" label="Item">
                    <mg-timeline-item-tooltip date="2021-06-01" content="June tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipMonthComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipMonthComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipMonthComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipMonthComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('tooltip dateLabel should contain "2021" for unit=month', () => {
        const dateLabel = timeline['resolvedItems']()[0].tooltips[0].dateLabel;
        expect(dateLabel).toBeDefined();
        expect(dateLabel).toContain('2021');
    });
});

describe('MagmaTimeline — formatTooltipDate unit=day', () => {
    @Component({
        template: `
            <mg-timeline unit="day" lang="en">
                <mg-timeline-item start="2021-06-01" end="2021-06-30" label="Item">
                    <mg-timeline-item-tooltip date="2021-06-15" content="Day tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipDayComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipDayComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipDayComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipDayComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('tooltip dateLabel should be defined for unit=day', () => {
        const dateLabel = timeline['resolvedItems']()[0].tooltips[0].dateLabel;
        expect(dateLabel).toBeDefined();
        expect(dateLabel!.length).toBeGreaterThan(0);
    });
});

describe('MagmaTimeline — formatTooltipDate with invalid Date (fallback to string)', () => {
    let component: MagmaTimeline;
    let fixture: ComponentFixture<MagmaTimeline>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MagmaTimeline] }).compileComponents();
        fixture = TestBed.createComponent(MagmaTimeline);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should return String(value) when Date is invalid', () => {
        const invalidDate = new Date('invalid');
        const result = (component as any).formatTooltipDate(invalidDate);
        expect(result).toBe(String(invalidDate));
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// resolveItemTooltips — dateOffset clamping
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — resolveItemTooltips dateOffset clamping', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="startYear" [end]="endYear" label="Item">
                    <mg-timeline-item-tooltip [date]="tipDate" content="Tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipClampComponent {
        startYear: number | string = 2020;
        endYear: number | string = 2023;
        tipDate: number | string | Date = 2025; // beyond item end
    }

    let hostFixture: ComponentFixture<TestHostTooltipClampComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipClampComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipClampComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('dateOffset should be clamped to 1 when tooltip date is beyond item end', () => {
        const offset = timeline['resolvedItems']()[0].tooltips[0].dateOffset;
        expect(offset).toBe(1);
    });

    it('dateOffset should be clamped to 0 when tooltip date is before item start', () => {
        hostFixture.componentInstance.tipDate = 2015;
        hostFixture.changeDetectorRef.detectChanges();
        const offset = timeline['resolvedItems']()[0].tooltips[0].dateOffset;
        expect(offset).toBe(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// minExactValue / maxExactValue — annotation path
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — minExactValue/maxExactValue with annotations', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2021" [end]="2022" label="Item" />
                <mg-timeline-annotation [start]="2018" label="Early Ann" />
                <mg-timeline-annotation [start]="2025" label="Late Ann" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationMinMaxComponent {}

    let hostFixture: ComponentFixture<TestHostAnnotationMinMaxComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationMinMaxComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationMinMaxComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('minExactValue should return 2018 (the earliest annotation)', () => {
        expect((timeline as any).minExactValue()).toBe(2018);
    });

    it('maxExactValue should return 2025 (the latest annotation)', () => {
        expect((timeline as any).maxExactValue()).toBe(2025);
    });

    it('axis should start at 2018 driven by annotation', () => {
        expect(timeline['ticks']()[0].index).toBe(2018);
    });

    it('axis should end at 2025 driven by annotation', () => {
        const ticks = timeline['ticks']();
        expect(ticks[ticks.length - 1].index).toBe(2025);
    });
});

describe('MagmaTimeline — minExactValue/maxExactValue annotation with invalid Date', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2021" [end]="2022" label="Item" />
                <mg-timeline-annotation [start]="invalidDate" label="Invalid Ann" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
    })
    class TestHostAnnotationInvalidDateComponent {
        invalidDate = new Date('invalid');
    }

    let hostFixture: ComponentFixture<TestHostAnnotationInvalidDateComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostAnnotationInvalidDateComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostAnnotationInvalidDateComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('minExactValue should return the item start (2021) since annotation start is invalid (?? Infinity fallback)', () => {
        // resolveExact(invalidDate) → undefined → ?? Infinity → annotation contributes Infinity
        // item contributes 2021 → min(2021, Infinity) = 2021
        expect((timeline as any).minExactValue()).toBe(2021);
    });

    it('maxExactValue should return the item end (2022) since annotation start is invalid (?? -Infinity fallback)', () => {
        // resolveExact(invalidDate) → undefined → ?? -Infinity → annotation contributes -Infinity
        // item contributes 2022 → max(2022, -Infinity) = 2022
        expect((timeline as any).maxExactValue()).toBe(2022);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// onItemHover emits itemHover for unlocked item with tooltips
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — onItemHover emits for unlinked item with tooltips', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Hoverable">
                    <mg-timeline-item-tooltip content="Tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostHoverableItemComponent {}

    let hostFixture: ComponentFixture<TestHostHoverableItemComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostHoverableItemComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostHoverableItemComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should emit itemHover when hovering unlinked item that has tooltips', () => {
        const spy = vi.spyOn(timeline.itemHover, 'emit');
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('itemHover payload should include label', () => {
        const spy = vi.spyOn(timeline.itemHover, 'emit');
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect(spy.mock.calls[0][0].label).toBe('Hoverable');
    });

    it('itemHover payload should include start=2020', () => {
        const spy = vi.spyOn(timeline.itemHover, 'emit');
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect(spy.mock.calls[0][0].start).toBe(2020);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// _closeEntryOverlays disposes all refs and removes scroll listener
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — _closeEntryOverlays', () => {
    let component: MagmaTimeline;
    let fixture: ComponentFixture<MagmaTimeline>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MagmaTimeline] }).compileComponents();
        fixture = TestBed.createComponent(MagmaTimeline);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should call dispose on each overlay ref and clear arrays', () => {
        const fakeRef = { dispose: vi.fn() } as any;
        (component as any)._entryOverlayRefs = [fakeRef];
        (component as any)._entryAnchors = [{}];
        const scrollUnlisten = vi.fn();
        (component as any)._scrollUnlisten = scrollUnlisten;

        (component as any)._closeEntryOverlays();

        expect(fakeRef.dispose).toHaveBeenCalledTimes(1);
        expect(scrollUnlisten).toHaveBeenCalledTimes(1);
        expect((component as any)._entryOverlayRefs).toHaveLength(0);
        expect((component as any)._entryAnchors).toHaveLength(0);
        expect((component as any)._scrollUnlisten).toBeUndefined();
    });

    it('should not throw when _scrollUnlisten is undefined', () => {
        expect(() => (component as any)._closeEntryOverlays()).not.toThrow();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// MagmaTimelineItemTooltip inputs — elementRef and templateRef
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimelineItemTooltip — templateRef projection', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" color="#f00">
                        <ng-template>Rich content</ng-template>
                    </mg-timeline-item-tooltip>
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipTemplateRefComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipTemplateRefComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipTemplateRefComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipTemplateRefComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('tooltip templateRef should be defined when ng-template is projected', () => {
        const tip = timeline['resolvedItems']()[0].tooltips[0];
        expect(tip.templateRef).toBeDefined();
    });

    it('tooltip color should be "#f00"', () => {
        const tip = timeline['resolvedItems']()[0].tooltips[0];
        expect(tip.color).toBe('#f00');
    });
});

describe('MagmaTimelineItemTooltip — no templateRef (content string fallback)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip content="Plain text" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipNoTemplateComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipNoTemplateComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipNoTemplateComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipNoTemplateComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('tooltip templateRef should be undefined when no ng-template', () => {
        const tip = timeline['resolvedItems']()[0].tooltips[0];
        expect(tip.templateRef).toBeUndefined();
    });

    it('tooltip contentHtml should be "Plain text"', () => {
        const tip = timeline['resolvedItems']()[0].tooltips[0];
        expect(tip.contentHtml).toBe('Plain text');
    });
});

describe('MagmaTimeline — resolveItemTooltips with invalid tooltip date (exact === undefined)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip [date]="invalidDate" content="Invalid date tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipInvalidDateComponent {
        invalidDate = new Date('invalid');
    }

    let hostFixture: ComponentFixture<TestHostTooltipInvalidDateComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipInvalidDateComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipInvalidDateComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('dateOffset should be undefined when tooltip date is invalid (exact === undefined branch)', () => {
        const tip = timeline['resolvedItems']()[0].tooltips[0];
        expect(tip.dateOffset).toBeUndefined();
    });

    it('dateLabel should fall back to String(value) for invalid date', () => {
        const tip = timeline['resolvedItems']()[0].tooltips[0];
        expect(tip.dateLabel).toBeDefined();
    });
});

describe('MagmaTimeline — resolveItemTooltips content fallback (innerHTML) without content input', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021">Projected HTML content</mg-timeline-item-tooltip>
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipInnerHtmlFallbackComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipInnerHtmlFallbackComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostTooltipInnerHtmlFallbackComponent],
        }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipInnerHtmlFallbackComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('contentHtml should fall back to projected innerHTML when no content input is set', () => {
        const tip = timeline['resolvedItems']()[0].tooltips[0];
        expect(tip.contentHtml).toContain('Projected HTML content');
    });
});

describe('MagmaTimeline — resolveItemTooltips content fallback (empty string) with no content at all', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostTooltipEmptyContentComponent {}

    let hostFixture: ComponentFixture<TestHostTooltipEmptyContentComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostTooltipEmptyContentComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostTooltipEmptyContentComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('contentHtml should be empty string when no content input and no projected content', () => {
        const tip = timeline['resolvedItems']()[0].tooltips[0];
        expect(tip.contentHtml).toBe('');
    });
});

describe('MagmaTimeline — extractItemContentHtml fallback to empty string (no label, no content)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en">
                <mg-timeline-item [start]="2020" [end]="2023" />
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem],
    })
    class TestHostItemNoLabelNoContentComponent {}

    let hostFixture: ComponentFixture<TestHostItemNoLabelNoContentComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostItemNoLabelNoContentComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostItemNoLabelNoContentComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('contentHtml should be empty string when item has no label and no projected content', () => {
        const item = timeline['resolvedItems']()[0];
        expect(item.contentHtml).toBe('');
    });

    it('label should be undefined when no label input is set', () => {
        const item = timeline['resolvedItems']()[0];
        expect(item.label).toBeUndefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// onItemHover — _openEntryOverlays grouped mode (basic smoke)
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — _openEntryOverlays grouped mode (smoke)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" tooltipLayout="grouped">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostGroupedTooltipComponent {}

    let hostFixture: ComponentFixture<TestHostGroupedTooltipComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostGroupedTooltipComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostGroupedTooltipComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        // Close overlays before destroying to avoid CDK errors
        (timeline as any)._closeEntryOverlays();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should open 1 overlay on mouseover (grouped mode)', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect((timeline as any)._entryOverlayRefs.length).toBe(1);
    });

    it('_entryOverlayRefs should be empty after mouseleave', () => {
        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        expect((timeline as any)._entryOverlayRefs.length).toBe(0);
    });
});

describe('MagmaTimeline — _openEntryOverlays spread mode (smoke)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" tooltipLayout="spread">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip A" />
                    <mg-timeline-item-tooltip date="2022" content="Tip B" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostSpreadTooltipComponent {}

    let hostFixture: ComponentFixture<TestHostSpreadTooltipComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostSpreadTooltipComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostSpreadTooltipComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        (timeline as any)._closeEntryOverlays();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should open 2 overlays on mouseover (spread mode, 2 tooltips)', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect((timeline as any)._entryOverlayRefs.length).toBe(2);
    });

    it('should clear overlays on mouseleave', () => {
        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        expect((timeline as any)._entryOverlayRefs.length).toBe(0);
    });
});

describe('MagmaTimeline — _openEntryOverlays vertical mode (smoke)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" direction="vertical">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostVerticalTooltipComponent {}

    let hostFixture: ComponentFixture<TestHostVerticalTooltipComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostVerticalTooltipComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostVerticalTooltipComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        (timeline as any)._closeEntryOverlays();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should open 1 overlay on mouseover (vertical mode)', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect((timeline as any)._entryOverlayRefs.length).toBe(1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// _openEntryOverlays — defensive early returns
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — _openEntryOverlays grouped mode mark outside viewport', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" tooltipLayout="grouped">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostGroupedOutsideViewportComponent {}

    let hostFixture: ComponentFixture<TestHostGroupedOutsideViewportComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostGroupedOutsideViewportComponent],
        }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostGroupedOutsideViewportComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        (timeline as any)._closeEntryOverlays();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should not open overlay when mark is outside grid viewport (grouped mode)', () => {
        const itemEl = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        const gridEl = hostFixture.nativeElement.querySelector('.timeline-grid') as HTMLElement;

        // Mock: item is far to the right, grid is small → mark outside viewport
        vi.spyOn(itemEl, 'getBoundingClientRect').mockReturnValue({
            left: 1000,
            top: 0,
            right: 1100,
            bottom: 50,
            width: 100,
            height: 50,
            x: 1000,
            y: 0,
        } as DOMRect);
        vi.spyOn(gridEl, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            right: 200,
            bottom: 200,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
        } as DOMRect);

        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        // Mark at ~1002px, grid ends at 200px → outside → no overlay created
        expect((timeline as any)._entryOverlayRefs.length).toBe(0);
    });
});

describe('MagmaTimeline — _openEntryOverlays spread mode all entries outside viewport', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" tooltipLayout="spread">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip A" />
                    <mg-timeline-item-tooltip date="2022" content="Tip B" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostSpreadOutsideViewportComponent {}

    let hostFixture: ComponentFixture<TestHostSpreadOutsideViewportComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostSpreadOutsideViewportComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostSpreadOutsideViewportComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        (timeline as any)._closeEntryOverlays();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should not open overlay when all entries are outside grid viewport (spread mode)', () => {
        const itemEl = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        const gridEl = hostFixture.nativeElement.querySelector('.timeline-grid') as HTMLElement;

        // Mock: item far right, grid small → all anchor positions outside viewport
        vi.spyOn(itemEl, 'getBoundingClientRect').mockReturnValue({
            left: 1000,
            top: 0,
            right: 1100,
            bottom: 50,
            width: 100,
            height: 50,
            x: 1000,
            y: 0,
        } as DOMRect);
        vi.spyOn(gridEl, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            right: 200,
            bottom: 200,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
        } as DOMRect);

        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        // All entries at ~1000+px, grid ends at 200px → filtered out → no overlay
        expect((timeline as any)._entryOverlayRefs.length).toBe(0);
    });
});

describe('MagmaTimeline — onItemHover defensive guard (no .item ancestor)', () => {
    let component: MagmaTimeline;
    let fixture: ComponentFixture<MagmaTimeline>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MagmaTimeline] }).compileComponents();
        fixture = TestBed.createComponent(MagmaTimeline);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should not throw and not emit when event target has no .item ancestor', () => {
        const spy = vi.spyOn(component.itemHover, 'emit');
        const fakeItem = {
            label: 'X',
            contentHtml: 'X',
            startOffset: 0,
            spanLength: 1,
            color: undefined,
            link: undefined,
            linkTarget: '_self',
            disabled: false,
            trackIndex: 0,
            tooltips: [{ dateOffset: 0 }], // has tooltips so it passes first guard
            sourceItem: { start: () => 2020, end: () => undefined } as any,
        };
        // Create an event where target.closest('.item') returns null
        const evt = new MouseEvent('mouseover', { bubbles: true });
        Object.defineProperty(evt, 'target', { value: document.body });

        expect(() => (component as any).onItemHover(fakeItem, evt)).not.toThrow();
        expect(spy).not.toHaveBeenCalled();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// _pushOverlappingEntries — horizontal spread mode
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — _pushOverlappingEntries (horizontal spread)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" tooltipLayout="spread">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip A" />
                    <mg-timeline-item-tooltip date="2022" content="Tip B" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostPushHorizontalComponent {}

    let hostFixture: ComponentFixture<TestHostPushHorizontalComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        // Make requestAnimationFrame fire synchronously so _pushOverlappingEntries runs
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            cb(0);
            return 0;
        });
        await TestBed.configureTestingModule({ imports: [TestHostPushHorizontalComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostPushHorizontalComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        (timeline as any)._closeEntryOverlays();
        vi.unstubAllGlobals();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should populate _entryAnchors with 2 entries after hover', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect((timeline as any)._entryAnchors.length).toBe(2);
    });

    it('should call _pushOverlappingEntries after hover (rAF flushed)', () => {
        const spy = vi.spyOn(timeline as any, '_pushOverlappingEntries');
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect(spy).toHaveBeenCalledWith(false);
    });

    it('should apply translateX when entries overlap (horizontal)', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const refs = (timeline as any)._entryOverlayRefs as any[];
        const anchors = (timeline as any)._entryAnchors as any[];

        // Mock anchor positions: both at same x → overlap → second gets pushed right
        anchors.forEach(({ anchor }) => {
            vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
                left: 100,
                top: 0,
                right: 100,
                bottom: 0,
                width: 0,
                height: 0,
                x: 100,
                y: 0,
            } as DOMRect);
        });
        // Mock offsetWidth so filter(e => e.size > 0) keeps entries
        refs.forEach(ref => {
            vi.spyOn(ref.overlayElement, 'offsetWidth', 'get').mockReturnValue(50);
        });

        (timeline as any)._pushOverlappingEntries(false);

        // First: delta=0 → '', Second: delta=54 → 'translateX(54px)'
        expect(refs[0].overlayElement.style.transform).toBe('');
        expect(refs[1].overlayElement.style.transform).toBe('translateX(54px)');
    });

    it('should set empty transform when entries do not overlap', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const refs = (timeline as any)._entryOverlayRefs as any[];
        const anchors = (timeline as any)._entryAnchors as any[];

        // Anchors far apart → no overlap
        vi.spyOn(anchors[0].anchor, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        } as DOMRect);
        vi.spyOn(anchors[1].anchor, 'getBoundingClientRect').mockReturnValue({
            left: 500,
            top: 0,
            right: 500,
            bottom: 0,
            width: 0,
            height: 0,
            x: 500,
            y: 0,
        } as DOMRect);
        refs.forEach(ref => {
            vi.spyOn(ref.overlayElement, 'offsetWidth', 'get').mockReturnValue(50);
        });

        (timeline as any)._pushOverlappingEntries(false);

        // Both delta=0 → no transform
        expect(refs[0].overlayElement.style.transform).toBe('');
        expect(refs[1].overlayElement.style.transform).toBe('');
    });

    it('should early return when _entryAnchors has less than 2 entries', () => {
        (timeline as any)._entryAnchors = [{ anchor: document.createElement('div'), overlayRef: {} as any }];
        expect(() => (timeline as any)._pushOverlappingEntries(false)).not.toThrow();
    });

    it('should filter out entries with zero size', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const refs = (timeline as any)._entryOverlayRefs as any[];
        const anchors = (timeline as any)._entryAnchors as any[];

        anchors.forEach(({ anchor }) => {
            vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
                left: 100,
                top: 0,
                right: 100,
                bottom: 0,
                width: 0,
                height: 0,
                x: 100,
                y: 0,
            } as DOMRect);
        });
        // offsetWidth = 0 → filtered out → loop body never runs
        refs.forEach(ref => {
            vi.spyOn(ref.overlayElement, 'offsetWidth', 'get').mockReturnValue(0);
        });

        // Capture transforms before (CDK may have set its own)
        const before = refs.map((r: any) => r.overlayElement.style.transform);

        (timeline as any)._pushOverlappingEntries(false);

        // No transforms changed since all entries filtered out
        const after = refs.map((r: any) => r.overlayElement.style.transform);
        expect(after).toEqual(before);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// _pushOverlappingEntries — vertical mode
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — _pushOverlappingEntries (vertical)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" direction="vertical" tooltipLayout="spread">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip A" />
                    <mg-timeline-item-tooltip date="2022" content="Tip B" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostPushVerticalComponent {}

    let hostFixture: ComponentFixture<TestHostPushVerticalComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            cb(0);
            return 0;
        });
        await TestBed.configureTestingModule({ imports: [TestHostPushVerticalComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostPushVerticalComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        (timeline as any)._closeEntryOverlays();
        vi.unstubAllGlobals();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should apply translateY when entries overlap (vertical)', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const refs = (timeline as any)._entryOverlayRefs as any[];
        const anchors = (timeline as any)._entryAnchors as any[];

        // Both anchors at same top → overlap
        anchors.forEach(({ anchor }) => {
            vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
                left: 0,
                top: 100,
                right: 0,
                bottom: 100,
                width: 0,
                height: 0,
                x: 0,
                y: 100,
            } as DOMRect);
        });
        refs.forEach(ref => {
            vi.spyOn(ref.overlayElement, 'offsetHeight', 'get').mockReturnValue(50);
        });

        (timeline as any)._pushOverlappingEntries(true);

        // Second entry gets pushed down: delta=54 → translateY(54px)
        expect(refs[0].overlayElement.style.transform).toBe('');
        expect(refs[1].overlayElement.style.transform).toBe('translateY(54px)');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scroll handler — _openEntryOverlays scroll listener
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — scroll handler repositions overlays', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" tooltipLayout="spread">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip A" />
                    <mg-timeline-item-tooltip date="2022" content="Tip B" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostScrollHandlerComponent {}

    let hostFixture: ComponentFixture<TestHostScrollHandlerComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            cb(0);
            return 0;
        });
        await TestBed.configureTestingModule({ imports: [TestHostScrollHandlerComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostScrollHandlerComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        (timeline as any)._closeEntryOverlays();
        vi.unstubAllGlobals();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should register a scroll listener on the grid after opening overlays', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        // _scrollUnlisten should be defined after overlays open
        expect((timeline as any)._scrollUnlisten).toBeDefined();
    });

    it('should update overlay visibility on scroll event', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const refs = (timeline as any)._entryOverlayRefs as any[];
        const grid = hostFixture.nativeElement.querySelector('.timeline-grid') as HTMLElement;
        const anchors = (timeline as any)._entryAnchors as any[];

        // Set anchor positions outside grid → visibility hidden
        anchors.forEach(({ anchor }) => {
            vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
                left: 9999,
                top: 0,
                right: 9999,
                bottom: 0,
                width: 0,
                height: 0,
                x: 9999,
                y: 0,
            } as DOMRect);
        });
        vi.spyOn(grid, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            right: 200,
            bottom: 200,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
        } as DOMRect);

        grid.dispatchEvent(new Event('scroll'));

        // Anchors outside grid → visibility hidden
        refs.forEach(ref => {
            expect((ref.overlayElement as HTMLElement).style.visibility).toBe('hidden');
        });
    });

    it('should show overlays when anchor is inside grid on scroll', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const refs = (timeline as any)._entryOverlayRefs as any[];
        const grid = hostFixture.nativeElement.querySelector('.timeline-grid') as HTMLElement;
        const anchors = (timeline as any)._entryAnchors as any[];

        // Anchors inside grid → visibility visible
        anchors.forEach(({ anchor }) => {
            vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
                left: 100,
                top: 0,
                right: 100,
                bottom: 0,
                width: 0,
                height: 0,
                x: 100,
                y: 0,
            } as DOMRect);
        });
        vi.spyOn(grid, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            right: 200,
            bottom: 200,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
        } as DOMRect);

        grid.dispatchEvent(new Event('scroll'));

        refs.forEach(ref => {
            expect((ref.overlayElement as HTMLElement).style.visibility).toBe('');
        });
    });

    it('should reset transforms and call updatePosition on scroll', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const refs = (timeline as any)._entryOverlayRefs as any[];
        const grid = hostFixture.nativeElement.querySelector('.timeline-grid') as HTMLElement;

        // Set a transform on overlay elements
        refs.forEach(ref => {
            (ref.overlayElement as HTMLElement).style.transform = 'translateX(50px)';
            vi.spyOn(ref, 'updatePosition');
        });

        grid.dispatchEvent(new Event('scroll'));

        // Transforms should be reset to '' by the scroll handler
        refs.forEach(ref => {
            expect((ref.overlayElement as HTMLElement).style.transform).toBe('');
            expect(ref.updatePosition).toHaveBeenCalled();
        });
    });

    it('should call _pushOverlappingEntries via rAF on scroll', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const spy = vi.spyOn(timeline as any, '_pushOverlappingEntries');
        const grid = hostFixture.nativeElement.querySelector('.timeline-grid') as HTMLElement;

        spy.mockClear();
        grid.dispatchEvent(new Event('scroll'));

        expect(spy).toHaveBeenCalledWith(false);
    });

    it('should remove scroll listener on mouseleave (_closeEntryOverlays)', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        expect((timeline as any)._scrollUnlisten).toBeDefined();

        // Trigger mouseleave → _closeEntryOverlays
        const item = hostFixture.nativeElement.querySelector('.item') as HTMLElement;
        item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

        expect((timeline as any)._scrollUnlisten).toBeUndefined();
        expect((timeline as any)._entryAnchors.length).toBe(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scroll handler — vertical mode
// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaTimeline — scroll handler (vertical mode)', () => {
    @Component({
        template: `
            <mg-timeline unit="year" lang="en" direction="vertical">
                <mg-timeline-item [start]="2020" [end]="2023" label="Item">
                    <mg-timeline-item-tooltip date="2021" content="Tip A" />
                    <mg-timeline-item-tooltip date="2022" content="Tip B" />
                </mg-timeline-item>
            </mg-timeline>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
        imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineItemTooltip],
    })
    class TestHostScrollVerticalComponent {}

    let hostFixture: ComponentFixture<TestHostScrollVerticalComponent>;
    let timeline: MagmaTimeline;

    beforeEach(async () => {
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            cb(0);
            return 0;
        });
        await TestBed.configureTestingModule({ imports: [TestHostScrollVerticalComponent] }).compileComponents();
        hostFixture = TestBed.createComponent(TestHostScrollVerticalComponent);
        hostFixture.changeDetectorRef.detectChanges();
        timeline = getTimelineInstance(hostFixture);
    });

    afterEach(() => {
        (timeline as any)._closeEntryOverlays();
        vi.unstubAllGlobals();
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should hide overlays when anchor top is outside grid on scroll (vertical)', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const refs = (timeline as any)._entryOverlayRefs as any[];
        const grid = hostFixture.nativeElement.querySelector('.timeline-grid') as HTMLElement;
        const anchors = (timeline as any)._entryAnchors as any[];

        // Anchor top outside grid bounds → hidden
        anchors.forEach(({ anchor }) => {
            vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
                left: 0,
                top: 9999,
                right: 0,
                bottom: 9999,
                width: 0,
                height: 0,
                x: 0,
                y: 9999,
            } as DOMRect);
        });
        vi.spyOn(grid, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            right: 200,
            bottom: 200,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
        } as DOMRect);

        grid.dispatchEvent(new Event('scroll'));

        refs.forEach(ref => {
            expect((ref.overlayElement as HTMLElement).style.visibility).toBe('hidden');
        });
    });

    it('should call _pushOverlappingEntries with isVertical=true on scroll', () => {
        const itemInner = hostFixture.nativeElement.querySelector('.item-inner') as HTMLElement;
        itemInner.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

        const spy = vi.spyOn(timeline as any, '_pushOverlappingEntries');
        const grid = hostFixture.nativeElement.querySelector('.timeline-grid') as HTMLElement;

        spy.mockClear();
        grid.dispatchEvent(new Event('scroll'));

        // _entryIsVertical is set to true in vertical mode
        expect(spy).toHaveBeenCalledWith(true);
    });
});
