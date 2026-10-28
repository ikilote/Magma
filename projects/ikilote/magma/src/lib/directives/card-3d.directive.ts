import {
    Directive,
    ElementRef,
    HostListener,
    OnDestroy,
    booleanAttribute,
    effect,
    inject,
    input,
    numberAttribute,
    signal,
} from '@angular/core';

/** Coerce an attribute to a number, then clamp it to the [0, 1] range. */
function intensityAttribute(value: unknown): number {
    const n = numberAttribute(value, 0);
    return Math.max(0, Math.min(1, n));
}

/**
 * Directive that applies a 3D card tilt effect based on mouse position,
 * with an optional iridescent holographic effect inspired by trading-card foils.
 *
 * The holographic effect is built from two stacked layers controlled through
 * CSS custom properties updated every frame:
 *  - a **glare** layer: a radial light spot that follows the pointer (`color-dodge`),
 *  - a **foil** layer: a textured, repeating holographic pattern revealed by a
 *    pointer-following gradient mask (`color-dodge` + `color-burn`).
 *
 * A lerp (linear interpolation) loop smoothly transitions between states,
 * preventing jumps when the pointer enters/leaves near the edges.
 *
 * Usage:
 * ```html
 * <div mgCard3d>...</div>
 * <div mgCard3d mgCard3dMax="20" mgCard3dGlare>...</div>
 * ```
 */
@Directive({
    selector: '[mgCard3d]',
    host: {
        '[class.mg-card3d]': 'true',
        '[class.mg-card3d__active]': 'hovered()',
        '[style.transform-style]': '"preserve-3d"',
        '[style.will-change]': '"transform"',
    },
})
export class MagmaCard3dDirective implements OnDestroy {
    /** Maximum tilt angle in degrees (default: 15) */
    readonly mgCard3dMax = input(15, { transform: numberAttribute });

    /** Perspective distance in pixels (default: 1000) */
    readonly mgCard3dPerspective = input(1000, { transform: numberAttribute });

    /**
     * Lerp speed factor while hovering: how fast the card catches up to the
     * pointer per frame. Lower = smoother/slower (default: 0.12).
     * Range 0.05–0.3 is recommended.
     */
    readonly mgCard3dLerp = input(0.12, { transform: numberAttribute });

    /**
     * Lerp speed factor when the pointer leaves: controls how gently the card
     * eases back to its resting state. Lower = slower, softer return
     * (default: 0.05).
     */
    readonly mgCard3dReturnLerp = input(0.05, { transform: numberAttribute });

    /** Scale factor on hover (default: 1.05) */
    readonly mgCard3dScale = input(1.05, { transform: numberAttribute });

    /** Enable the holographic glare + foil effect (default: false) */
    readonly mgCard3dGlare = input(false, { transform: booleanAttribute });

    /** Maximum holographic intensity, clamped to 0–1 (default: 0.6) */
    readonly mgCard3dGlareMax = input(0.6, { transform: intensityAttribute });

    /**
     * Enable a directional sheen: a light band that reflects a FIXED light
     * source as the card tilts, like a specular highlight on a glossy surface.
     * Works independently of the glare/foil (default: false).
     */
    readonly mgCard3dSheen = input(false, { transform: booleanAttribute });

    /**
     * Direction the sheen light comes from, in degrees (default: 135 = top-left).
     * Only meaningful when mgCard3dSheen is enabled.
     */
    readonly mgCard3dLightAngle = input(135, { transform: numberAttribute });

    /** Maximum sheen intensity, clamped to 0–1 (default: 0.6). Only used when sheen is on. */
    readonly mgCard3dSheenMax = input(0.6, { transform: intensityAttribute });

    private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

    /** Glare layer: pointer-following radial light spot */
    private glareEl: HTMLElement | undefined;
    /** Foil layer: textured holographic pattern revealed by a pointer mask */
    private foilEl: HTMLElement | undefined;
    /** Sheen layer: directional light band driven by the tilt angle */
    private sheenEl: HTMLElement | undefined;
    /**
     * Wrapper hosting all effect layers. It carries the optional user mask
     * (--mg-card3d-mask) once, so every layer inside is clipped the same way —
     * no per-layer mask repetition, and no fragile mask-composite on the foil.
     */
    private fxEl: HTMLElement | undefined;

    /** Lerp loop RAF id */
    private rafId: number | undefined;

    /** Current interpolated position [-0.5, 0.5] */
    private curX = 0;
    private curY = 0;

    /** Target position [-0.5, 0.5] set by mousemove */
    private tgtX = 0;
    private tgtY = 0;

    /** Current interpolated scale (lerped between 1 and mgCard3dScale) */
    private curScale = 1;

    /**
     * Whether the pointer is currently over the element.
     * Exposed as a signal so consumers (and the host binding) can react to it.
     * Note: the per-frame animation state (curX/curY/curScale) is deliberately
     * NOT held in signals — it changes at 60fps and is written straight to the
     * DOM, so making it reactive would only cost needless change detection.
     */
    readonly hovered = signal(false);

    constructor() {
        // React to the glare input toggling at runtime: create or tear down the
        // holographic layers accordingly (e.g. when a demo checkbox flips it).
        effect(() => {
            if (this.mgCard3dGlare()) {
                this.ensureGlare();
            } else {
                this.removeGlare();
            }
            if (this.mgCard3dSheen()) {
                this.ensureSheen();
            } else {
                this.removeSheen();
            }
        });
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        const rect = this.el.nativeElement.getBoundingClientRect();
        this.tgtX = (event.clientX - rect.left) / rect.width - 0.5;
        this.tgtY = (event.clientY - rect.top) / rect.height - 0.5;
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        const parent = this.el.nativeElement.parentElement;
        if (parent) {
            parent.style.perspective = `${this.mgCard3dPerspective()}px`;
        }
        this.hovered.set(true);
        this.startLoop();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.hovered.set(false);
        // Reset target to center — the lerp loop smoothly brings the card back
        this.tgtX = 0;
        this.tgtY = 0;
    }

    ngOnDestroy(): void {
        this.stopLoop();
        this.removeGlare();
        this.removeSheen();
    }

    // ── loop ────────────────────────────────────────────────────────────────

    private startLoop(): void {
        if (this.rafId != null) {
            return; // already running
        }
        const tick = () => {
            const hovered = this.hovered();
            // Use a gentler lerp factor on the way out for a softer return.
            const lerp = hovered ? this.mgCard3dLerp() : this.mgCard3dReturnLerp();
            const targetScale = hovered ? this.mgCard3dScale() : 1;

            this.curX += (this.tgtX - this.curX) * lerp;
            this.curY += (this.tgtY - this.curY) * lerp;
            this.curScale += (targetScale - this.curScale) * lerp;

            const max = this.mgCard3dMax();
            const rotateX = -this.curY * max * 2;
            const rotateY = this.curX * max * 2;

            // Apply the transform directly on the element. We can't use an Angular
            // style binding here: this runs inside requestAnimationFrame, outside
            // Angular's change detection, so a binding would never be flushed to
            // the DOM once pointer events stop (e.g. after mouseleave).
            this.el.nativeElement.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ` +
                `scale3d(${this.curScale}, ${this.curScale}, ${this.curScale})`;

            if (this.glareEl || this.sheenEl) {
                this.updateHolo(this.curX, this.curY);
            }

            const atRest =
                !hovered &&
                Math.abs(this.curX) < 0.0005 &&
                Math.abs(this.curY) < 0.0005 &&
                Math.abs(this.curScale - 1) < 0.0005;

            if (atRest) {
                this.curX = 0;
                this.curY = 0;
                this.curScale = 1;
                this.el.nativeElement.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                this.setHoloVars(50, 50, 0, 90, 50, MagmaCard3dDirective.SHEEN_WIDTH_MAX, 0);
                this.rafId = undefined;
                return;
            }

            this.rafId = requestAnimationFrame(tick);
        };
        this.rafId = requestAnimationFrame(tick);
    }

    private stopLoop(): void {
        if (this.rafId != null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = undefined;
        }
    }

    // ── holographic effect ────────────────────────────────────────────────────

    /** Create (once) the wrapper that hosts every effect layer and the user mask. */
    private ensureFx(): HTMLElement {
        if (this.fxEl) {
            return this.fxEl;
        }
        const el = this.el.nativeElement;
        if (getComputedStyle(el).position === 'static') {
            el.style.position = 'relative';
        }
        el.style.overflow = 'hidden';

        this.fxEl = document.createElement('div');
        this.fxEl.className = 'mg-card3d__fx';
        el.appendChild(this.fxEl);
        return this.fxEl;
    }

    private ensureGlare(): void {
        if (this.glareEl) {
            return;
        }
        const fx = this.ensureFx();

        // Foil layer: textured holographic pattern. All visuals live in CSS so
        // they can be themed; the directive only drives the CSS variables.
        // Added first so glare sits on top.
        this.foilEl = document.createElement('div');
        this.foilEl.className = 'mg-card3d__foil';
        fx.insertBefore(this.foilEl, fx.firstChild);

        // Glare layer: radial light spot following the pointer.
        this.glareEl = document.createElement('div');
        this.glareEl.className = 'mg-card3d__glare';
        fx.appendChild(this.glareEl);
    }

    /**
     * Update the CSS custom properties that drive both holographic layers.
     * @param x normalized pointer x [-0.5, 0.5]
     * @param y normalized pointer y [-0.5, 0.5]
     */
    /** Base intensity kept while hovering so the effect is visible even at the centre. */
    private static readonly HOVER_BASE_INTENSITY = 0.55;

    private updateHolo(x: number, y: number): void {
        const posX = (x + 0.5) * 100; // 0–100%
        const posY = (y + 0.5) * 100; // 0–100%

        // Distance from center, normalized 0–1 — the glow is stronger toward the edges.
        const hyp = Math.min(Math.sqrt(x * x + y * y) * Math.SQRT2, 1);

        // While hovering, blend a base level with the edge-driven glow so the
        // holographic effect reads clearly even near the centre. On the way out
        // (not hovered) intensity follows hyp and fades to 0 with the lerp.
        const base = this.hovered() ? MagmaCard3dDirective.HOVER_BASE_INTENSITY : 0;
        const intensity = (base + (1 - base) * hyp) * this.mgCard3dGlareMax();

        // Directional sheen: simulate a FIXED light source reflecting off the
        // surface. The gradient angle is constant (the light always comes from
        // the same direction); only the bright band's position moves as the card
        // tilts — like a specular highlight sliding across a glossy surface.
        //
        // The light direction is fixed (mgCard3dLightAngle). We project the tilt
        // onto that light axis and amplify it so a small pointer move produces a
        // large sweep — that is what reads as a reflection rather than a cursor-
        // following highlight.
        const lightAngle = this.mgCard3dLightAngle();
        const lightAngleRad = (lightAngle * Math.PI) / 180;
        const lightDirX = Math.cos(lightAngleRad);
        const lightDirY = Math.sin(lightAngleRad);

        // Projection of the tilt vector onto the light axis, amplified (×2.2).
        const projection = (x * lightDirX + y * lightDirY) * 2.2;
        const rawPos = 50 - projection * 100; // moves opposite to the tilt
        const sheenPos = Math.max(0, Math.min(100, rawPos));

        // The band stays at the fixed light angle.
        const sheenAngle = lightAngle;

        // Band width is largest when the highlight is centred (a specular
        // reflection spreads when it hits head-on) and narrows as it slides
        // toward the edges. Map distance-from-centre (0 at 50%, 1 at 0/100%)
        // to a width between MIN and MAX.
        const distFromCenter = Math.min(Math.abs(sheenPos - 50) / 50, 1);
        const sheenWidth =
            MagmaCard3dDirective.SHEEN_WIDTH_MAX -
            (MagmaCard3dDirective.SHEEN_WIDTH_MAX - MagmaCard3dDirective.SHEEN_WIDTH_MIN) * distFromCenter;

        this.setHoloVars(posX, posY, intensity, sheenAngle, sheenPos, sheenWidth, hyp);
    }

    /** Sheen band half-width (in %) at the centre and at the edges. */
    private static readonly SHEEN_WIDTH_MAX = 45;
    private static readonly SHEEN_WIDTH_MIN = 12;

    private setHoloVars(
        posX: number,
        posY: number,
        intensity: number,
        sheenAngle: number,
        sheenPos: number,
        sheenWidth: number,
        hyp: number,
    ): void {
        const el = this.el.nativeElement;
        el.style.setProperty('--mg-card3d-pointer-x', `${posX}%`);
        el.style.setProperty('--mg-card3d-pointer-y', `${posY}%`);
        el.style.setProperty('--mg-card3d-bg-x', `${posX}%`);
        el.style.setProperty('--mg-card3d-bg-y', `${posY}%`);
        el.style.setProperty('--mg-card3d-intensity', `${intensity}`);
        // Sheen variables
        el.style.setProperty('--mg-card3d-sheen-angle', `${sheenAngle}deg`);
        el.style.setProperty('--mg-card3d-sheen-pos', `${sheenPos}%`);
        el.style.setProperty('--mg-card3d-sheen-width', `${sheenWidth}%`);
        // The sheen stays visible while hovering (base) and strengthens with tilt,
        // scaled by its own max intensity.
        const sheenBase = this.hovered() ? MagmaCard3dDirective.HOVER_BASE_INTENSITY : 0;
        const sheenIntensity = (sheenBase + (1 - sheenBase) * hyp) * this.mgCard3dSheenMax();
        el.style.setProperty('--mg-card3d-sheen-intensity', `${sheenIntensity}`);
    }

    private ensureSheen(): void {
        if (this.sheenEl) {
            return;
        }
        const fx = this.ensureFx();

        // Sheen sits above foil but below the pointer glare.
        this.sheenEl = document.createElement('div');
        this.sheenEl.className = 'mg-card3d__sheen';
        const ref = this.glareEl ?? null;
        fx.insertBefore(this.sheenEl, ref);
    }

    private removeGlare(): void {
        this.glareEl?.remove();
        this.glareEl = undefined;
        this.foilEl?.remove();
        this.foilEl = undefined;
        this.cleanupFx();
    }

    private removeSheen(): void {
        this.sheenEl?.remove();
        this.sheenEl = undefined;
        this.cleanupFx();
    }

    /** Remove the wrapper once no effect layer remains inside it. */
    private cleanupFx(): void {
        if (this.fxEl && !this.fxEl.hasChildNodes()) {
            this.fxEl.remove();
            this.fxEl = undefined;
        }
    }
}
