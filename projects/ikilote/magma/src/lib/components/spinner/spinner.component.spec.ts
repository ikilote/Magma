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

    // ─── helpers ─────────────────────────────────────────────────────────────

    const host = () => fixture.nativeElement as HTMLElement;
    const cssVar = (name: string) => host().style.getPropertyValue(name);
    const setInputs = (inputs: Record<string, unknown>) => {
        for (const [key, value] of Object.entries(inputs)) {
            fixture.componentRef.setInput(key, value);
        }
        fixture.changeDetectorRef.detectChanges();
    };

    // ─── creation ────────────────────────────────────────────────────────────

    it('should create', () => expect(component).toBeTruthy());

    // ─── ticks (default) ─────────────────────────────────────────────────────

    describe('type: ticks (default)', () => {
        it('should set data-type to "ticks"', () => {
            expect(host().getAttribute('data-type')).toBe('ticks');
        });

        it('should render 12 div elements', () => {
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(12);
        });

        it('should apply no CSS vars when no inputs are provided', () => {
            expect(cssVar('--height')).toBe('');
            expect(cssVar('--width')).toBe('');
            expect(cssVar('--radius')).toBe('');
        });

        it('should set --height via size', () => {
            setInputs({ size: 100 });
            expect(cssVar('--height')).toBe('100px');
        });

        it('should set --width via tickWidth', () => {
            setInputs({ tickWidth: 8 });
            expect(cssVar('--width')).toBe('8px');
        });

        it('should set --radius via radius', () => {
            setInputs({ radius: 4 });
            expect(cssVar('--radius')).toBe('4px');
        });
    });

    // ─── ring ─────────────────────────────────────────────────────────────────

    describe('type: ring', () => {
        beforeEach(() => setInputs({ type: 'ring' }));

        it('should set data-type to "ring"', () => expect(host().getAttribute('data-type')).toBe('ring'));
        it('should render a single .ring element', () => {
            expect(fixture.debugElement.queryAll(By.css('.ring')).length).toBe(1);
        });
        it('should set --width via strokeWidth', () => {
            setInputs({ strokeWidth: 5 });
            expect(cssVar('--width')).toBe('5px');
        });
        it('should ignore tickWidth for --width', () => {
            setInputs({ tickWidth: 99 });
            expect(cssVar('--width')).toBe('');
        });
    });

    // ─── arc ─────────────────────────────────────────────────────────────────

    describe('type: arc', () => {
        beforeEach(() => setInputs({ type: 'arc' }));

        it('should set data-type to "arc"', () => expect(host().getAttribute('data-type')).toBe('arc'));
        it('should render a single .arc element', () => {
            expect(fixture.debugElement.queryAll(By.css('.arc')).length).toBe(1);
        });
        it('should set --width via strokeWidth', () => {
            setInputs({ strokeWidth: 3 });
            expect(cssVar('--width')).toBe('3px');
        });
    });

    // ─── dots ─────────────────────────────────────────────────────────────────

    describe('type: dots', () => {
        beforeEach(() => setInputs({ type: 'dots' }));

        it('should set data-type to "dots"', () => expect(host().getAttribute('data-type')).toBe('dots'));
        it('should render 8 div elements by default', () => {
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(8);
        });
        it('should render count div elements when count is set', () => {
            setInputs({ count: 6 });
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(6);
        });
        it('should set --width via dotSize', () => {
            setInputs({ dotSize: 10 });
            expect(cssVar('--width')).toBe('10px');
        });
        it('should set --min-scale via minScale', () => {
            setInputs({ minScale: 0.3 });
            expect(cssVar('--min-scale')).toBe('0.3');
        });
    });

    // ─── chase ────────────────────────────────────────────────────────────────

    describe('type: chase', () => {
        beforeEach(() => setInputs({ type: 'chase' }));

        it('should set data-type to "chase"', () => expect(host().getAttribute('data-type')).toBe('chase'));
        it('should render 8 div elements by default', () => {
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(8);
        });
        it('should render count div elements when count is set', () => {
            setInputs({ count: 5 });
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(5);
        });
        it('should set --width via dotSize', () => {
            setInputs({ dotSize: 12 });
            expect(cssVar('--width')).toBe('12px');
        });
        it('should set --min-scale via minScale', () => {
            setInputs({ minScale: 0.2 });
            expect(cssVar('--min-scale')).toBe('0.2');
        });
    });

    // ─── bounce ───────────────────────────────────────────────────────────────

    describe('type: bounce', () => {
        beforeEach(() => setInputs({ type: 'bounce' }));

        it('should set data-type to "bounce"', () => expect(host().getAttribute('data-type')).toBe('bounce'));
        it('should render 3 div elements by default', () => {
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(3);
        });
        it('should render count div elements when count is set', () => {
            setInputs({ count: 5 });
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(5);
        });
    });

    // ─── wave ─────────────────────────────────────────────────────────────────

    describe('type: wave', () => {
        beforeEach(() => setInputs({ type: 'wave' }));

        it('should set data-type to "wave"', () => expect(host().getAttribute('data-type')).toBe('wave'));
        it('should render 5 div elements by default', () => {
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(5);
        });
        it('should render count div elements when count is set', () => {
            setInputs({ count: 7 });
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(7);
        });
        it('should set --width via barItemWidth', () => {
            setInputs({ barItemWidth: 8 });
            expect(cssVar('--width')).toBe('8px');
        });
    });

    // ─── bar ─────────────────────────────────────────────────────────────────

    describe('type: bar', () => {
        beforeEach(() => setInputs({ type: 'bar' }));

        it('should set data-type to "bar"', () => expect(host().getAttribute('data-type')).toBe('bar'));
        it('should render a single .bar element', () => {
            expect(fixture.debugElement.queryAll(By.css('.bar')).length).toBe(1);
        });
        it('should set --height via barWidth', () => {
            setInputs({ barWidth: 200 });
            expect(cssVar('--height')).toBe('200px');
        });
        it('should set --width via barHeight', () => {
            setInputs({ barHeight: 8 });
            expect(cssVar('--width')).toBe('8px');
        });
        it('should set --radius via radius', () => {
            setInputs({ radius: 6 });
            expect(cssVar('--radius')).toBe('6px');
        });
        it('should prefer barWidth over size for --height', () => {
            setInputs({ size: 80, barWidth: 300 });
            expect(cssVar('--height')).toBe('300px');
        });
        it('should fall back to size for --height when barWidth is not set', () => {
            setInputs({ size: 80 });
            expect(cssVar('--height')).toBe('80px');
        });
    });

    // ─── pulse ────────────────────────────────────────────────────────────────

    describe('type: pulse', () => {
        beforeEach(() => setInputs({ type: 'pulse' }));

        it('should set data-type to "pulse"', () => expect(host().getAttribute('data-type')).toBe('pulse'));
        it('should render a single .pulse element', () => {
            expect(fixture.debugElement.queryAll(By.css('.pulse')).length).toBe(1);
        });
        it('should set --height via size', () => {
            setInputs({ size: 40 });
            expect(cssVar('--height')).toBe('40px');
        });
        it('should set --min-scale via minScale', () => {
            setInputs({ minScale: 0.1 });
            expect(cssVar('--min-scale')).toBe('0.1');
        });
    });

    // ─── ripple ───────────────────────────────────────────────────────────────

    describe('type: ripple', () => {
        beforeEach(() => setInputs({ type: 'ripple' }));

        it('should set data-type to "ripple"', () => expect(host().getAttribute('data-type')).toBe('ripple'));
        it('should render 2 div elements', () => {
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(2);
        });
        it('should set --width via strokeWidth', () => {
            setInputs({ strokeWidth: 3 });
            expect(cssVar('--width')).toBe('3px');
        });
    });

    // ─── flip ─────────────────────────────────────────────────────────────────

    describe('type: flip', () => {
        beforeEach(() => setInputs({ type: 'flip' }));

        it('should set data-type to "flip"', () => expect(host().getAttribute('data-type')).toBe('flip'));
        it('should render a single .flip element', () => {
            expect(fixture.debugElement.queryAll(By.css('.flip')).length).toBe(1);
        });
        it('should set --radius via radius', () => {
            setInputs({ radius: 50 });
            expect(cssVar('--radius')).toBe('50px');
        });
    });

    // ─── orbit ────────────────────────────────────────────────────────────────

    describe('type: orbit', () => {
        beforeEach(() => setInputs({ type: 'orbit' }));

        it('should set data-type to "orbit"', () => expect(host().getAttribute('data-type')).toBe('orbit'));
        it('should render .orbit-center and .orbit-ball', () => {
            expect(fixture.debugElement.queryAll(By.css('.orbit-center')).length).toBe(1);
            expect(fixture.debugElement.queryAll(By.css('.orbit-ball')).length).toBe(1);
        });
        it('should set --orbit-r via orbitRadius', () => {
            setInputs({ orbitRadius: 30 });
            expect(cssVar('--orbit-r')).toBe('30px');
        });
        it('should set --width via orbitBallSize', () => {
            setInputs({ orbitBallSize: 16 });
            expect(cssVar('--width')).toBe('16px');
        });
    });

    // ─── grid ─────────────────────────────────────────────────────────────────

    describe('type: grid', () => {
        beforeEach(() => setInputs({ type: 'grid' }));

        it('should set data-type to "grid"', () => expect(host().getAttribute('data-type')).toBe('grid'));
        it('should render 9 div elements by default', () => {
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(9);
        });
        it('should render count div elements when count is set', () => {
            setInputs({ count: 4 });
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(4);
        });
        it('should set --radius via radius', () => {
            setInputs({ radius: 8 });
            expect(cssVar('--radius')).toBe('8px');
        });
    });

    // ─── blink ────────────────────────────────────────────────────────────────

    describe('type: blink', () => {
        beforeEach(() => setInputs({ type: 'blink' }));

        it('should set data-type to "blink"', () => expect(host().getAttribute('data-type')).toBe('blink'));
        it('should render 3 div elements by default', () => {
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(3);
        });
        it('should render count div elements when count is set', () => {
            setInputs({ count: 5 });
            expect(fixture.debugElement.queryAll(By.css('div')).length).toBe(5);
        });
        it('should set --width via dotSize', () => {
            setInputs({ dotSize: 14 });
            expect(cssVar('--width')).toBe('14px');
        });
    });

    // ─── morph ────────────────────────────────────────────────────────────────

    describe('type: morph', () => {
        beforeEach(() => setInputs({ type: 'morph' }));

        it('should set data-type to "morph"', () => expect(host().getAttribute('data-type')).toBe('morph'));
        it('should render a single .morph element', () => {
            expect(fixture.debugElement.queryAll(By.css('.morph')).length).toBe(1);
        });
        it('should set --height via size', () => {
            setInputs({ size: 60 });
            expect(cssVar('--height')).toBe('60px');
        });
        it('should set --radius via radius', () => {
            setInputs({ radius: 50 });
            expect(cssVar('--radius')).toBe('50px');
        });
    });

    // ─── comet ────────────────────────────────────────────────────────────────

    describe('type: comet', () => {
        beforeEach(() => setInputs({ type: 'comet' }));

        it('should set data-type to "comet"', () => expect(host().getAttribute('data-type')).toBe('comet'));
        it('should render a single .comet element', () => {
            expect(fixture.debugElement.queryAll(By.css('.comet')).length).toBe(1);
        });
        it('should set --height via size', () => {
            setInputs({ size: 70 });
            expect(cssVar('--height')).toBe('70px');
        });
        it('should set --width via strokeWidth', () => {
            setInputs({ strokeWidth: 5 });
            expect(cssVar('--width')).toBe('5px');
        });
    });

    // ─── infinity ─────────────────────────────────────────────────────────────

    describe('type: infinity', () => {
        beforeEach(() => setInputs({ type: 'infinity' }));

        it('should set data-type to "infinity"', () => expect(host().getAttribute('data-type')).toBe('infinity'));
        it('should render a single .infinity-ball element', () => {
            expect(fixture.debugElement.queryAll(By.css('.infinity-ball')).length).toBe(1);
        });
        it('should set --height via size', () => {
            setInputs({ size: 90 });
            expect(cssVar('--height')).toBe('90px');
        });
        it('should set --width via dotSize', () => {
            setInputs({ dotSize: 12 });
            expect(cssVar('--width')).toBe('12px');
        });
    });

    // ─── heartbeat ────────────────────────────────────────────────────────────

    describe('type: heartbeat', () => {
        beforeEach(() => setInputs({ type: 'heartbeat' }));

        it('should set data-type to "heartbeat"', () => expect(host().getAttribute('data-type')).toBe('heartbeat'));
        it('should render a single .heartbeat element', () => {
            expect(fixture.debugElement.queryAll(By.css('.heartbeat')).length).toBe(1);
            expect(fixture.debugElement.queryAll(By.css('.heartbeat-line')).length).toBe(1);
        });
        it('should set --height via size', () => {
            setInputs({ size: 60 });
            expect(cssVar('--height')).toBe('60px');
        });
        it('should set --width via strokeWidth', () => {
            setInputs({ strokeWidth: 4 });
            expect(cssVar('--width')).toBe('4px');
        });
    });

    // ─── _resolvedWidth routing ───────────────────────────────────────────────

    describe('_resolvedWidth routing', () => {
        const cases: Array<{ type: string; inputName: string; value: number }> = [
            { type: 'ticks', inputName: 'tickWidth', value: 7 },
            { type: 'ring', inputName: 'strokeWidth', value: 3 },
            { type: 'arc', inputName: 'strokeWidth', value: 4 },
            { type: 'ripple', inputName: 'strokeWidth', value: 2 },
            { type: 'comet', inputName: 'strokeWidth', value: 5 },
            { type: 'heartbeat', inputName: 'strokeWidth', value: 3 },
            { type: 'dots', inputName: 'dotSize', value: 10 },
            { type: 'chase', inputName: 'dotSize', value: 9 },
            { type: 'blink', inputName: 'dotSize', value: 12 },
            { type: 'infinity', inputName: 'dotSize', value: 11 },
            { type: 'wave', inputName: 'barItemWidth', value: 8 },
            { type: 'bar', inputName: 'barHeight', value: 4 },
            { type: 'orbit', inputName: 'orbitBallSize', value: 14 },
        ];

        for (const { type, inputName, value } of cases) {
            it(`should use ${inputName} for --width when type is "${type}"`, () => {
                setInputs({ type, [inputName]: value });
                expect(cssVar('--width')).toBe(`${value}px`);
            });
        }

        it('should produce no --width for pulse (no width input)', () => {
            setInputs({ type: 'pulse' });
            expect(cssVar('--width')).toBe('');
        });

        it('should produce no --width for bounce (no width input)', () => {
            setInputs({ type: 'bounce' });
            expect(cssVar('--width')).toBe('');
        });
    });
});
