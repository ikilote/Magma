import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaTableModule,
    MagmaTabsModule,
    MagmaTimeline,
    MagmaTimelineAnnotation,
    MagmaTimelineAnnotationClickEvent,
    MagmaTimelineClickEvent,
    MagmaTimelineDirection,
    MagmaTimelineItem,
    MagmaTimelineUnit,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { langues } from '../../common/const';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

interface DemoItem {
    label: string;
    start: number | string;
    end: number | string;
    color?: string;
    link?: string;
    disabled?: boolean;
}

interface DemoAnnotation {
    label: string;
    start: number | string;
    color?: string;
    link?: string;
}

@Component({
    selector: 'demo-timeline',
    templateUrl: './demo-timeline.component.html',
    styleUrl: './demo-timeline.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaTimeline,
        MagmaTimelineItem,
        MagmaTimelineAnnotation,
        MagmaInput,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputSelect,
        MagmaInputCheckbox,
        MagmaInputText,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoTimelineComponent {
    private readonly fbe = inject(FormBuilderExtended);

    langues = langues;

    directionData: Select2Data = [
        { label: 'horizontal', value: 'horizontal' },
        { label: 'vertical', value: 'vertical' },
    ];

    unitData: Select2Data = [
        { label: 'year', value: 'year' },
        { label: 'month', value: 'month' },
        { label: 'day', value: 'day' },
    ];

    // ── year: ISO dates for sub-tick precision, colors, link, disabled ────────
    readonly yearItems: DemoItem[] = [
        { label: 'Maker Hikōshiki Hatsune Mix', start: '2007-12-27', end: '2013-08-27', color: '#6a8fc8' },
        { label: 'hachune MIKU no nichijo ROIPARA!', start: '2008-05-27', end: '2013-03-27', color: '#6a8fc8' },
        { label: 'Chibi Miku-san', start: '2008-09-27', end: '2024-03-27', color: '#7b7bc8' },
        { label: 'Conpihan -Saya to Sayu no Daisakusen-', start: '2011-07-27', end: '2013-01-27' },
        { label: 'Mukashi Mukashi no Kyō no Boku', start: '2010-03-27', end: '2019-08-27', color: '#a87bc8' },
        { label: 'BLACK★ROCK SHOOTER ~B&W~', start: '2010-02-27', end: '2012-04-27', color: '#c86a6a' },
        { label: 'Kagerō Days', start: '2012-04-27', end: '2015-04-27', color: '#c8a86a' },
        { label: 'BLACK★ROCK SHOOTER -Innocent Soul-', start: '2012-10-27', end: '2013-10-27', color: '#c86a6a' },
        { label: 'Shūnjin to Kamihikoki', start: '2013-03-27', end: '2014-03-27' },
        { label: 'Bad∞End∞Night Insane Party', start: '2013-07-27', end: '2017-09-27', color: '#6ac8a8' },
        { label: 'Hatsune Miku -Project DIVA-', start: '2013-09-27', end: '2016-03-27', color: '#7bc86a' },
        {
            label: 'Senbonzakura',
            start: '2014-03-27',
            end: '2015-03-27',
            color: '#c87b6a',
            link: 'https://fr.wikipedia.org/wiki/Vocaloid',
        },
        { label: 'GUMI from Vocaloid', start: '2016-02-27', end: '2017-12-27', color: '#6ac87b' },
    ];

    // ── month: span over ~6 months, sub-month precision via day ──────────────
    readonly monthItems: DemoItem[] = [
        { label: 'Sprint Alpha', start: '2025-01-06', end: '2025-02-14', color: '#6a8fc8' },
        { label: 'Sprint Beta', start: '2025-01-20', end: '2025-03-07', color: '#7b7bc8' },
        { label: 'Design phase', start: '2025-02-01', end: '2025-04-15', color: '#a87bc8' },
        { label: 'User testing', start: '2025-03-10', end: '2025-04-04', color: '#c8a86a' },
        { label: 'Dev freeze', start: '2025-04-01', end: '2025-04-30', color: '#c86a6a' },
        { label: 'Release 1.0', start: '2025-04-28', end: '2025-05-02', color: '#7bc86a' },
        { label: 'Hotfix 1.0.1', start: '2025-05-05', end: '2025-05-12', color: '#c87b6a' },
        {
            label: 'Marketing campaign',
            start: '2025-05-01',
            end: '2025-06-30',
            color: '#6ac8a8',
            link: 'https://example.com',
        },
    ];

    // ── day: span over ~3 weeks, items at day precision ──────────────────────
    readonly dayItems: DemoItem[] = [
        { label: 'Kickoff', start: '2025-06-02', end: '2025-06-03', color: '#6a8fc8' },
        { label: 'API design', start: '2025-06-02', end: '2025-06-06', color: '#7b7bc8' },
        { label: 'UI mockups', start: '2025-06-04', end: '2025-06-10', color: '#a87bc8' },
        { label: 'Backend impl.', start: '2025-06-09', end: '2025-06-18', color: '#c8a86a' },
        { label: 'Frontend impl.', start: '2025-06-11', end: '2025-06-20', color: '#c86a6a' },
        { label: 'Integration', start: '2025-06-17', end: '2025-06-22', color: '#7bc86a' },
        { label: 'QA', start: '2025-06-19', end: '2025-06-24', color: '#6ac8a8', disabled: true },
        {
            label: 'Release',
            start: '2025-06-25',
            end: '2025-06-25',
            color: '#c87b6a',
            link: 'https://example.com',
        },
    ];

    // ── annotations per unit ─────────────────────────────────────────────────
    readonly yearAnnotations: DemoAnnotation[] = [
        { label: 'Vocaloid', start: 2007, color: '#c86a6a' },
        { label: 'Miku 10th', start: '2017-08-31', color: '#6ac8a8' },
    ];

    readonly monthAnnotations: DemoAnnotation[] = [
        { label: 'Review', start: '2025-02-14', color: '#c86a6a' },
        { label: 'Demo', start: '2025-04-15', color: '#7bc86a', link: 'https://example.com' },
    ];

    readonly dayAnnotations: DemoAnnotation[] = [
        { label: 'Standup', start: '2025-06-05', color: '#a87bc8' },
        { label: 'Retro', start: '2025-06-20', color: '#c8a86a' },
    ];

    // Defaults per unit: [start, end]
    private readonly unitDefaults: Record<MagmaTimelineUnit, { start: number | string; end: number | string }> = {
        year: { start: 2008, end: 2026 },
        month: { start: '2025-01-01', end: '2025-06-30' },
        day: { start: '2025-06-02', end: '2025-06-25' },
    };

    readonly currentUnit = signal<MagmaTimelineUnit>('year');

    readonly currentItems = computed(() => {
        switch (this.currentUnit()) {
            case 'month':
                return this.monthItems;
            case 'day':
                return this.dayItems;
            default:
                return this.yearItems;
        }
    });

    readonly currentAnnotations = computed(() => {
        switch (this.currentUnit()) {
            case 'month':
                return this.monthAnnotations;
            case 'day':
                return this.dayAnnotations;
            default:
                return this.yearAnnotations;
        }
    });

    lastClick: MagmaTimelineClickEvent | null = null;

    lastAnnotationClick: MagmaTimelineAnnotationClickEvent | null = null;

    ctrlForm: FormGroup<{
        direction: FormControl<MagmaTimelineDirection>;
        lang: FormControl<string>;
        start: FormControl<number | string>;
        end: FormControl<number | string>;
        unit: FormControl<MagmaTimelineUnit>;
        showGrid: FormControl<boolean>;
        tickSize: FormControl<number>;
        trackSize: FormControl<number>;
        minGap: FormControl<number>;
        dragScroll: FormControl<boolean>;
    }>;

    codeHtml = '';
    codeTs = `import { MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation, MagmaTimelineClickEvent, MagmaTimelineAnnotationClickEvent } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaTimeline, MagmaTimelineItem, MagmaTimelineAnnotation],
})
export class MyComponent {
    onItemClick(event: MagmaTimelineClickEvent) {
        console.log(event);
    }

    onAnnotationClick(event: MagmaTimelineAnnotationClickEvent) {
        console.log(event);
    }
}`;

    constructor() {
        this.ctrlForm = this.fbe.groupWithError({
            direction: { default: 'vertical' as MagmaTimelineDirection },
            lang: { default: '' },
            start: { default: 2006 as number | string },
            end: { default: 2026 as number | string },
            unit: { default: 'year' as MagmaTimelineUnit },
            showGrid: { default: true },
            tickSize: { default: 60 },
            trackSize: { default: 60 },
            minGap: { default: 10 },
            dragScroll: { default: false },
        });

        this.ctrlForm.get('unit')!.valueChanges.subscribe((unit: MagmaTimelineUnit) => {
            const defaults = this.unitDefaults[unit];
            this.currentUnit.set(unit);
            this.ctrlForm.patchValue({ start: defaults.start, end: defaults.end }, { emitEvent: false });
            this.codeGeneration();
        });

        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => this.codeGeneration());
    }

    onItemClick(event: MagmaTimelineClickEvent) {
        this.lastClick = event;
    }

    onAnnotationClick(event: MagmaTimelineAnnotationClickEvent) {
        this.lastAnnotationClick = event;
    }

    codeGeneration() {
        const v = this.ctrlForm.value;

        const json: Json2htmlRef = {
            tag: 'mg-timeline',
            attrs: {},
            body: [...this.buildCodeItems(v.unit ?? 'year'), ...this.buildCodeAnnotations(v.unit ?? 'year')],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        if (v.direction && v.direction !== 'horizontal') {
            attrs['direction'] = v.direction;
        }
        if (v.lang) {
            attrs['lang'] = v.lang;
        }
        if (v.start) {
            attrs['start'] = v.start;
        }
        if (v.end) {
            attrs['end'] = v.end;
        }
        if (v.unit && v.unit !== 'year') {
            attrs['unit'] = v.unit;
        }
        if (!v.showGrid) {
            attrs['[showGrid]'] = 'false';
        }
        if (v.tickSize && v.tickSize !== 60) {
            attrs['[tickSize]'] = v.tickSize;
        }
        if (v.minGap !== undefined && v.minGap !== 10) {
            attrs['[minGap]'] = v.minGap;
        }
        if (v.dragScroll) {
            attrs['dragScroll'] = null;
        }
        attrs['(itemClick)'] = 'onItemClick($event)';
        attrs['(annotationClick)'] = 'onAnnotationClick($event)';

        this.codeHtml = new Json2html(json).toString();
    }

    private buildCodeItems(unit: MagmaTimelineUnit): Json2htmlRef[] {
        switch (unit) {
            case 'month':
                return [
                    {
                        tag: 'mg-timeline-item',
                        attrs: { start: '2025-01-06', end: '2025-02-14', color: '#6a8fc8' },
                        body: ['Sprint Alpha'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: { start: '2025-02-01', end: '2025-04-15', color: '#a87bc8' },
                        body: ['Design phase'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: {
                            start: '2025-05-01',
                            end: '2025-06-30',
                            color: '#6ac8a8',
                            link: 'https://example.com',
                        },
                        body: ['Marketing campaign'],
                        inline: true,
                    },
                ];
            case 'day':
                return [
                    {
                        tag: 'mg-timeline-item',
                        attrs: { start: '2025-06-02', end: '2025-06-06', color: '#7b7bc8' },
                        body: ['API design'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: { start: '2025-06-09', end: '2025-06-18', color: '#c8a86a' },
                        body: ['Backend impl.'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: { start: '2025-06-19', end: '2025-06-24', color: '#6ac8a8', disabled: null },
                        body: ['QA'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: {
                            start: '2025-06-25',
                            end: '2025-06-25',
                            color: '#c87b6a',
                            link: 'https://example.com',
                        },
                        body: ['Release'],
                        inline: true,
                    },
                ];
            default: // year
                return [
                    {
                        tag: 'mg-timeline-item',
                        attrs: { start: '2008', end: '2024' },
                        body: ['Chibi Miku-san'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: { start: '2012-04-27', end: '2015-04-27', color: '#c8a86a' },
                        body: ['Kagerō Days'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: {
                            start: '2014-03-27',
                            end: '2015-03-27',
                            color: '#c87b6a',
                            link: 'https://fr.wikipedia.org/wiki/Vocaloid',
                            linkTarget: '_blank',
                        },
                        body: ['Senbonzakura'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: { '[start]': '2016', '[end]': '2017', color: '#6ac87b', disabled: null },
                        body: ['GUMI from Vocaloid'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-item',
                        attrs: { '[start]': '2013', '[end]': '2017', color: '#6ac8a8' },
                        body: ['<strong>Bad∞End∞Night</strong>'],
                        inline: true,
                    },
                ];
        }
    }

    private buildCodeAnnotations(unit: MagmaTimelineUnit): Json2htmlRef[] {
        switch (unit) {
            case 'month':
                return [
                    {
                        tag: 'mg-timeline-annotation',
                        attrs: { start: '2025-02-14', color: '#c86a6a' },
                        body: ['Review'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-annotation',
                        attrs: { start: '2025-04-15', color: '#7bc86a', link: 'https://example.com' },
                        body: ['Demo'],
                        inline: true,
                    },
                ];
            case 'day':
                return [
                    {
                        tag: 'mg-timeline-annotation',
                        attrs: { start: '2025-06-05', color: '#a87bc8' },
                        body: ['Standup'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-annotation',
                        attrs: { start: '2025-06-20', color: '#c8a86a' },
                        body: ['Retro'],
                        inline: true,
                    },
                ];
            default:
                // year
                return [
                    {
                        tag: 'mg-timeline-annotation',
                        attrs: { start: 2007, color: '#c86a6a' },
                        body: ['Vocaloid'],
                        inline: true,
                    },
                    {
                        tag: 'mg-timeline-annotation',
                        attrs: { start: '2017-08-31', color: '#6ac8a8' },
                        body: ['Miku 10th'],
                        inline: true,
                    },
                ];
        }
    }
}
