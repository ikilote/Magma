// card-3d.directive.spec.ts
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaCard3dDirective } from './card-3d.directive';

@Component({
    template: `
        <div class="parent">
            <div
                mgCard3d
                [mgCard3dMax]="max"
                [mgCard3dPerspective]="perspective"
                [mgCard3dLerp]="lerp"
                [mgCard3dReturnLerp]="returnLerp"
                [mgCard3dScale]="scale"
                [mgCard3dGlare]="glare"
                [mgCard3dGlareMax]="glareMax"
                [mgCard3dSheen]="sheen"
                [mgCard3dLightAngle]="lightAngle"
                [mgCard3dSheenMax]="sheenMax"
            >
                card content
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaCard3dDirective],
})
class TestComponent {
    max = 15;
    perspective = 1000;
    lerp = 0.12;
    returnLerp = 0.05;
    scale = 1.05;
    glare = false;
    glareMax = 0.6;
    sheen = false;
    lightAngle = 135;
    sheenMax = 0.6;
}

describe('MagmaCard3dDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let host: DebugElement;
    let el: HTMLElement;
    let directive: MagmaCard3dDirective;

    /** Queue of rAF callbacks so tests can step the lerp loop deterministically. */
    let rafCallbacks: FrameRequestCallback[];

    beforeEach(async () => {
        rafCallbacks = [];
        vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
            rafCallbacks.push(cb);
            return rafCallbacks.length;
        });
        vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});

        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();

        host = fixture.debugElement.query(By.directive(MagmaCard3dDirective));
        el = host.nativeElement as HTMLElement;
        directive = host.injector.get(MagmaCard3dDirective);

        // getBoundingClientRect is 0 in jsdom; return a predictable rect.
        vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 200,
            height: 300,
            right: 200,
            bottom: 300,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        } as DOMRect);
    });

    afterEach(() => {
        fixture?.destroy();
        vi.restoreAllMocks();
        TestBed.resetTestingModule();
    });

    function updateInputs(changes: Partial<TestComponent>) {
        Object.assign(component, changes);
        fixture.changeDetectorRef.detectChanges();
    }

    /** Run the currently queued rAF callbacks once (one animation frame). */
    function stepFrame() {
        const callbacks = rafCallbacks;
        rafCallbacks = [];
        callbacks.forEach(cb => cb(performance.now()));
    }

    /** Run frames until the loop stops scheduling new ones (reaches rest). */
    function runToRest(maxFrames = 500) {
        let frames = 0;
        while (rafCallbacks.length && frames < maxFrames) {
            stepFrame();
            frames++;
        }
        return frames;
    }

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should expose the mg-card3d host class', () => {
        expect(el.classList.contains('mg-card3d')).toBe(true);
    });

    it('should set transform-style and will-change on the host', () => {
        expect(el.style.transformStyle).toBe('preserve-3d');
        expect(el.style.willChange).toBe('transform');
    });

    describe('hover lifecycle', () => {
        it('should set hovered signal on mouseenter and clear it on mouseleave', () => {
            directive.onMouseEnter();
            expect(directive.hovered()).toBe(true);
            expect(el.classList.contains('mg-card3d__active')).toBe(false); // class updated on CD

            fixture.changeDetectorRef.detectChanges();
            expect(el.classList.contains('mg-card3d__active')).toBe(true);

            directive.onMouseLeave();
            expect(directive.hovered()).toBe(false);
            fixture.changeDetectorRef.detectChanges();
            expect(el.classList.contains('mg-card3d__active')).toBe(false);
        });

        it('should set perspective on the parent on mouseenter', () => {
            updateInputs({ perspective: 800 });
            directive.onMouseEnter();
            const parent = el.parentElement!;
            expect(parent.style.perspective).toBe('800px');
        });

        it('should start the rAF loop on mouseenter', () => {
            const before = (globalThis.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>).mock.calls.length;
            directive.onMouseEnter();
            expect(
                (globalThis.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>).mock.calls.length,
            ).toBeGreaterThan(before);
        });

        it('should not schedule an extra frame when mouseenter fires twice back-to-back', () => {
            directive.onMouseEnter();
            const after1 = rafCallbacks.length;
            // A second enter without stepping a frame must not queue another loop.
            directive.onMouseEnter();
            expect(rafCallbacks.length).toBe(after1);
        });
    });

    describe('pointer tracking', () => {
        it('should map the pointer position to a normalized target and tilt the card', () => {
            directive.onMouseEnter();
            // Pointer at the right edge, vertically centered → x≈0.5, y≈0
            directive.onMouseMove(new MouseEvent('mousemove', { clientX: 200, clientY: 150 }));
            stepFrame();

            // rotateY should be positive (tilt right); rotateX near 0.
            expect(el.style.transform).toContain('rotateY(');
            expect(el.style.transform).not.toBe('');
        });

        it('should keep applying the transform while hovering (not left stale)', () => {
            directive.onMouseEnter();
            directive.onMouseMove(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
            stepFrame();
            const first = el.style.transform;
            stepFrame();
            const second = el.style.transform;
            // The lerp keeps moving toward the target, so successive frames differ.
            expect(first).not.toBe(second);
        });
    });

    describe('return to rest', () => {
        it('should return to the identity transform after mouseleave', () => {
            directive.onMouseEnter();
            directive.onMouseMove(new MouseEvent('mousemove', { clientX: 200, clientY: 300 }));
            runToRest();

            directive.onMouseLeave();
            runToRest();

            expect(el.style.transform).toBe('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
        });

        it('should stop scheduling frames once at rest', () => {
            directive.onMouseEnter();
            directive.onMouseLeave();
            const frames = runToRest();
            expect(rafCallbacks.length).toBe(0);
            expect(frames).toBeGreaterThan(0);
        });
    });

    describe('glare layers', () => {
        it('should not create effect layers when glare is off', () => {
            expect(el.querySelector('.mg-card3d__fx')).toBeNull();
        });

        it('should create the wrapper, foil and glare layers when glare is enabled', () => {
            updateInputs({ glare: true });

            const fx = el.querySelector('.mg-card3d__fx');
            expect(fx).not.toBeNull();
            expect(fx!.querySelector('.mg-card3d__foil')).not.toBeNull();
            expect(fx!.querySelector('.mg-card3d__glare')).not.toBeNull();
        });

        it('should remove the glare layers (and wrapper) when glare is disabled again', () => {
            updateInputs({ glare: true });
            expect(el.querySelector('.mg-card3d__fx')).not.toBeNull();

            updateInputs({ glare: false });
            expect(el.querySelector('.mg-card3d__fx')).toBeNull();
            expect(el.querySelector('.mg-card3d__glare')).toBeNull();
        });

        it('should set position:relative and overflow:hidden on the host when effects are on', () => {
            updateInputs({ glare: true });
            expect(el.style.overflow).toBe('hidden');
            expect(el.style.position).toBe('relative');
        });
    });

    describe('sheen layer', () => {
        it('should create the sheen layer when sheen is enabled', () => {
            updateInputs({ sheen: true });
            const fx = el.querySelector('.mg-card3d__fx');
            expect(fx).not.toBeNull();
            expect(fx!.querySelector('.mg-card3d__sheen')).not.toBeNull();
        });

        it('should keep the wrapper while another layer remains', () => {
            updateInputs({ glare: true, sheen: true });
            updateInputs({ sheen: false });
            // Glare is still on → wrapper stays.
            expect(el.querySelector('.mg-card3d__fx')).not.toBeNull();
            expect(el.querySelector('.mg-card3d__sheen')).toBeNull();
        });

        it('should remove the wrapper only when all layers are gone', () => {
            updateInputs({ glare: true, sheen: true });
            updateInputs({ glare: false, sheen: false });
            expect(el.querySelector('.mg-card3d__fx')).toBeNull();
        });
    });

    describe('holographic CSS variables', () => {
        it('should drive the intensity and pointer variables while hovering with glare', () => {
            updateInputs({ glare: true });
            directive.onMouseEnter();
            directive.onMouseMove(new MouseEvent('mousemove', { clientX: 200, clientY: 300 }));
            runToRest(50); // let it approach the corner target

            expect(el.style.getPropertyValue('--mg-card3d-pointer-x')).not.toBe('');
            expect(el.style.getPropertyValue('--mg-card3d-intensity')).not.toBe('');
        });

        it('should drive sheen variables when sheen is enabled', () => {
            updateInputs({ sheen: true });
            directive.onMouseEnter();
            directive.onMouseMove(new MouseEvent('mousemove', { clientX: 200, clientY: 0 }));
            stepFrame();

            expect(el.style.getPropertyValue('--mg-card3d-sheen-angle')).toContain('deg');
            expect(el.style.getPropertyValue('--mg-card3d-sheen-pos')).toContain('%');
            expect(el.style.getPropertyValue('--mg-card3d-sheen-width')).toContain('%');
        });

        it('should respect a custom light angle for the sheen', () => {
            updateInputs({ sheen: true, lightAngle: 45 });
            directive.onMouseEnter();
            directive.onMouseMove(new MouseEvent('mousemove', { clientX: 100, clientY: 150 }));
            stepFrame();

            expect(el.style.getPropertyValue('--mg-card3d-sheen-angle')).toBe('45deg');
        });
    });

    describe('intensity clamping', () => {
        it('should clamp glare max above 1 down to 1', () => {
            updateInputs({ glare: true, glareMax: 5 });
            expect(directive.mgCard3dGlareMax()).toBe(1);
        });

        it('should clamp glare max below 0 up to 0', () => {
            updateInputs({ glare: true, glareMax: -2 });
            expect(directive.mgCard3dGlareMax()).toBe(0);
        });

        it('should clamp sheen max to the 0–1 range', () => {
            updateInputs({ sheen: true, sheenMax: 3 });
            expect(directive.mgCard3dSheenMax()).toBe(1);
        });
    });

    describe('negative tilt', () => {
        it('should accept a negative max angle (inverted tilt)', () => {
            updateInputs({ max: -20 });
            directive.onMouseEnter();
            directive.onMouseMove(new MouseEvent('mousemove', { clientX: 200, clientY: 150 }));
            stepFrame();
            // With a negative max, rotateY is negative for a right-side pointer.
            expect(el.style.transform).toContain('rotateY(-');
        });
    });

    describe('ngOnDestroy', () => {
        it('should stop the loop and remove all layers', () => {
            updateInputs({ glare: true, sheen: true });
            directive.onMouseEnter();
            expect(el.querySelector('.mg-card3d__fx')).not.toBeNull();

            directive.ngOnDestroy();

            expect(el.querySelector('.mg-card3d__fx')).toBeNull();
            expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
        });
    });
});
