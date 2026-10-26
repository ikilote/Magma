import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaSpinner } from './spinner.component';

describe('MagmaSpinner', () => {
    let component: MagmaSpinner;
    let fixture: ComponentFixture<MagmaSpinner>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaSpinner],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaSpinner);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    // ─── creation ────────────────────────────────────────────────────────────

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ─── default (ticks) ─────────────────────────────────────────────────────

    describe('type: ticks (default)', () => {
        it('should have 12 div elements', () => {
            const divs = fixture.debugElement.queryAll(By.css('div'));
            expect(divs.length).toBe(12);
        });

        it('should set data-type attribute to "ticks"', () => {
            expect(fixture.nativeElement.getAttribute('data-type')).toBe('ticks');
        });

        it('should apply no CSS vars when no inputs are provided', () => {
            const host = fixture.nativeElement as HTMLElement;
            expect(host.style.getPropertyValue('--height')).toBe('');
            expect(host.style.getPropertyValue('--width')).toBe('');
            expect(host.style.getPropertyValue('--radius')).toBe('');
        });

        it('should set --height via size', () => {
            fixture.componentRef.setInput('size', 100);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--height')).toBe('100px');
        });

        it('should set --width via tickWidth', () => {
            fixture.componentRef.setInput('tickWidth', 8);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('8px');
        });

        it('should set --radius via radius', () => {
            fixture.componentRef.setInput('radius', 4);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--radius')).toBe('4px');
        });
    });

    // ─── ring ─────────────────────────────────────────────────────────────────

    describe('type: ring', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('type', 'ring');
            fixture.changeDetectorRef.detectChanges();
        });

        it('should set data-type attribute to "ring"', () => {
            expect(fixture.nativeElement.getAttribute('data-type')).toBe('ring');
        });

        it('should render a single .ring element', () => {
            const rings = fixture.debugElement.queryAll(By.css('.ring'));
            expect(rings.length).toBe(1);
        });

        it('should set --height via size', () => {
            fixture.componentRef.setInput('size', 60);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--height')).toBe('60px');
        });

        it('should set --width via strokeWidth', () => {
            fixture.componentRef.setInput('strokeWidth', 5);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('5px');
        });

        it('should not set --width when tickWidth is provided (tickWidth not used by ring)', () => {
            fixture.componentRef.setInput('tickWidth', 99);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('');
        });
    });

    // ─── dots ─────────────────────────────────────────────────────────────────

    describe('type: dots', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('type', 'dots');
            fixture.changeDetectorRef.detectChanges();
        });

        it('should set data-type attribute to "dots"', () => {
            expect(fixture.nativeElement.getAttribute('data-type')).toBe('dots');
        });

        it('should render 8 div elements', () => {
            const divs = fixture.debugElement.queryAll(By.css('div'));
            expect(divs.length).toBe(8);
        });

        it('should set --height via size', () => {
            fixture.componentRef.setInput('size', 50);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--height')).toBe('50px');
        });

        it('should set --width via dotSize', () => {
            fixture.componentRef.setInput('dotSize', 10);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('10px');
        });
    });

    // ─── bar ─────────────────────────────────────────────────────────────────

    describe('type: bar', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('type', 'bar');
            fixture.changeDetectorRef.detectChanges();
        });

        it('should set data-type attribute to "bar"', () => {
            expect(fixture.nativeElement.getAttribute('data-type')).toBe('bar');
        });

        it('should render a single .bar element', () => {
            const bars = fixture.debugElement.queryAll(By.css('.bar'));
            expect(bars.length).toBe(1);
        });

        it('should set --height via barWidth', () => {
            fixture.componentRef.setInput('barWidth', 200);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--height')).toBe('200px');
        });

        it('should set --width via barHeight', () => {
            fixture.componentRef.setInput('barHeight', 8);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('8px');
        });

        it('should set --radius via radius', () => {
            fixture.componentRef.setInput('radius', 6);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--radius')).toBe('6px');
        });

        it('should prefer barWidth over size for --height', () => {
            fixture.componentRef.setInput('size', 80);
            fixture.componentRef.setInput('barWidth', 300);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--height')).toBe('300px');
        });

        it('should fall back to size for --height when barWidth is not set', () => {
            fixture.componentRef.setInput('size', 80);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--height')).toBe('80px');
        });
    });

    // ─── pulse ────────────────────────────────────────────────────────────────

    describe('type: pulse', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('type', 'pulse');
            fixture.changeDetectorRef.detectChanges();
        });

        it('should set data-type attribute to "pulse"', () => {
            expect(fixture.nativeElement.getAttribute('data-type')).toBe('pulse');
        });

        it('should render a single .pulse element', () => {
            const pulses = fixture.debugElement.queryAll(By.css('.pulse'));
            expect(pulses.length).toBe(1);
        });

        it('should set --height via size', () => {
            fixture.componentRef.setInput('size', 40);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--height')).toBe('40px');
        });
    });

    // ─── _resolvedWidth isolation ─────────────────────────────────────────────

    describe('_resolvedWidth routing', () => {
        it('should use tickWidth for ticks', () => {
            fixture.componentRef.setInput('type', 'ticks');
            fixture.componentRef.setInput('tickWidth', 7);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('7px');
        });

        it('should use strokeWidth for ring', () => {
            fixture.componentRef.setInput('type', 'ring');
            fixture.componentRef.setInput('strokeWidth', 3);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('3px');
        });

        it('should use dotSize for dots', () => {
            fixture.componentRef.setInput('type', 'dots');
            fixture.componentRef.setInput('dotSize', 12);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('12px');
        });

        it('should use barHeight for bar', () => {
            fixture.componentRef.setInput('type', 'bar');
            fixture.componentRef.setInput('barHeight', 4);
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('4px');
        });

        it('should produce no --width for pulse', () => {
            fixture.componentRef.setInput('type', 'pulse');
            fixture.componentRef.setInput('tickWidth', 99);
            fixture.changeDetectorRef.detectChanges();
            // pulse falls through to default branch → tickWidth, but tickWidth is for ticks only;
            // in practice pulse ignores it; --width should stay empty (no tickWidth set via API)
            expect(fixture.nativeElement.style.getPropertyValue('--width')).toBe('');
        });
    });
});
