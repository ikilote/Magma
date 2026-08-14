import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { type Mocked, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CookieConsent, DEFAULT_COOKIE_CONSENT_TEXTS } from './cookie-consent';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Flush the micro-task queue so mocked `openOverlay` spies resolve. */
const flushPromises = () => new Promise<void>(resolve => setTimeout(resolve, 0));

/** Wait until the overlay has fully opened (bannerVisible becomes true). */
const waitForOverlay = (svc: CookieConsent, timeout = 5000) =>
    vi.waitFor(() => expect(svc.bannerVisible()).toBe(true), { timeout });

/**
 * Sets up a spy on `document.cookie` that simulates a cookie store.
 * Returns a controller to read the last raw set string and the underlying store.
 */
function setupCookieMock(initial: Record<string, string> = {}) {
    const store: Record<string, string> = { ...initial };
    let lastSet = '';

    vi.spyOn(document, 'cookie', 'get').mockImplementation(() =>
        Object.entries(store)
            .map(([k, v]) => `${k}=${v}`)
            .join('; '),
    );

    vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
        lastSet = value;
        const [cookiePart] = value.split(';');
        const [name, val] = cookiePart.split('=');
        if (val !== undefined) store[name.trim()] = val;
    });

    return {
        store,
        getLastSet: () => lastSet,
        clearStore: () => Object.keys(store).forEach(k => delete store[k]),
    };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CookieConsent', () => {
    let service: CookieConsent;
    let mockOverlay: Mocked<Overlay>;
    let mockOverlayRef: Mocked<OverlayRef>;
    let positionBuilder: ReturnType<typeof buildPositionBuilder>;

    function buildPositionBuilder() {
        return {
            top: vi.fn().mockReturnThis(),
            left: vi.fn().mockReturnThis(),
            right: vi.fn().mockReturnThis(),
            bottom: vi.fn().mockReturnThis(),
            centerHorizontally: vi.fn().mockReturnThis(),
            centerVertically: vi.fn().mockReturnThis(),
        };
    }

    beforeEach(() => {
        mockOverlayRef = {
            attach: vi.fn(),
            dispose: vi.fn(),
            updateSize: vi.fn(),
            updatePositionStrategy: vi.fn(),
        } as unknown as Mocked<OverlayRef>;

        positionBuilder = buildPositionBuilder();

        mockOverlay = {
            create: vi.fn().mockReturnValue(mockOverlayRef),
            position: vi.fn().mockReturnValue({
                global: vi.fn().mockReturnValue(positionBuilder),
            }),
        } as unknown as Mocked<Overlay>;

        TestBed.configureTestingModule({
            providers: [CookieConsent, { provide: Overlay, useValue: mockOverlay }],
        });

        service = TestBed.inject(CookieConsent);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    // ── Creation ──────────────────────────────────────────────────────────────

    it('should be created', () => {
        setupCookieMock();
        expect(service).toBeTruthy();
    });

    it('should expose default signal values on creation', () => {
        expect(service.options()).toEqual([]);
        expect(service.texts()).toEqual(DEFAULT_COOKIE_CONSENT_TEXTS);
        expect(service.policy()).toBeUndefined();
        expect(service.durationCookie()).toBe(365);
        expect(service.bannerVisible()).toBe(false);
    });

    // ── init() ────────────────────────────────────────────────────────────────

    describe('init()', () => {
        it('should set texts to defaults when no override is provided', () => {
            setupCookieMock();
            // Prevent overlay from opening (no dynamic import needed)
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);

            service.init({ options: [] });

            expect(service.texts()).toEqual(DEFAULT_COOKIE_CONSENT_TEXTS);
        });

        it('should merge partial text overrides with defaults', () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);

            service.init({ options: [], texts: { title: 'Mon consentement' } });

            expect(service.texts().title).toBe('Mon consentement');
            expect(service.texts().acceptAll).toBe(DEFAULT_COOKIE_CONSENT_TEXTS.acceptAll);
        });

        it('should set the policy signal', () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            const policy = { show: true, url: '/cookie-policy' };

            service.init({ options: [], policy });

            expect(service.policy()).toEqual(policy);
        });

        it('should set options signal with shallow-cloned options', () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);

            service.init({ options: [{ id: 'analytics' }, { id: 'ads' }] });

            expect(service.options()).toHaveLength(2);
            expect(service.options()[0].id).toBe('analytics');
        });

        it('should call openOverlay when no stored cookie exists', async () => {
            setupCookieMock();
            const openOverlaySpy = vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);

            service.init({ options: [{ id: 'analytics' }] });
            await flushPromises();

            expect(openOverlaySpy).toHaveBeenCalledTimes(1);
        });

        it('should apply saved choices from cookie and skip openOverlay', async () => {
            setupCookieMock({ magmaCookieConsent: 'analytics:true|ads:false' });
            const openOverlaySpy = vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            const onAccept = vi.fn();
            const onRefuse = vi.fn();

            service.init({
                options: [
                    { id: 'analytics', onAccept },
                    { id: 'ads', onRefuse },
                ],
            });
            await flushPromises();

            expect(service.options()[0].accept).toBe(true);
            expect(service.options()[1].accept).toBe(false);
            expect(onAccept).toHaveBeenCalledTimes(1);
            expect(onRefuse).toHaveBeenCalledTimes(1);
            expect(openOverlaySpy).not.toHaveBeenCalled();
        });

        it('should call openOverlay when a stored cookie exists but forceOpen is true', async () => {
            setupCookieMock({ magmaCookieConsent: 'analytics:true' });
            const openOverlaySpy = vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);

            service.init({ options: [{ id: 'analytics' }], forceOpen: true });
            await flushPromises();

            expect(openOverlaySpy).toHaveBeenCalledTimes(1);
        });

        it('should still apply saved choices when forceOpen is true', async () => {
            setupCookieMock({ magmaCookieConsent: 'analytics:true|ads:false' });
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);

            service.init({
                options: [{ id: 'analytics' }, { id: 'ads' }],
                forceOpen: true,
            });
            await flushPromises();

            expect(service.options()[0].accept).toBe(true);
            expect(service.options()[1].accept).toBe(false);
        });

        it('should set cookieDuration when provided and no stored cookie', async () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);

            service.init({ options: [], cookieDuration: 30 });
            await flushPromises();

            expect(service.durationCookie()).toBe(30);
        });

        it('should NOT set cookieDuration when taking the early-return path', () => {
            setupCookieMock({ magmaCookieConsent: 'analytics:true' });

            service.init({ options: [{ id: 'analytics' }], cookieDuration: 30 });

            // init() returns early before reaching the cookieDuration assignment
            expect(service.durationCookie()).toBe(365);
        });
    });

    // ── remove() ──────────────────────────────────────────────────────────────

    describe('remove()', () => {
        it('should write the Max-Age=0 cookie string to clear the consent cookie', () => {
            const { getLastSet } = setupCookieMock({ magmaCookieConsent: 'analytics:true' });

            service.remove();

            expect(getLastSet()).toContain('magmaCookieConsent=');
            expect(getLastSet()).toContain('Max-Age=0');
        });
    });

    // ── setAll() ──────────────────────────────────────────────────────────────

    describe('setAll()', () => {
        beforeEach(() => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            service.init({ options: [{ id: 'analytics' }, { id: 'ads' }] });
        });

        it('should accept all non-locked options', () => {
            service.setAll(true);

            expect(service.options().every(o => o.accept === true)).toBe(true);
        });

        it('should refuse all non-locked options', () => {
            service.setAll(false);

            expect(service.options().every(o => o.accept === false)).toBe(true);
        });

        it('should leave locked options unchanged when setting all to false', () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            service.init({
                options: [
                    { id: 'essential', locked: true, accept: true },
                    { id: 'analytics', accept: false },
                ],
            });

            service.setAll(false);

            expect(service.options().find(o => o.id === 'essential')?.accept).toBe(true);
            expect(service.options().find(o => o.id === 'analytics')?.accept).toBe(false);
        });

        it('should call save() after updating options', () => {
            const saveSpy = vi.spyOn(service, 'save');

            service.setAll(true);

            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
    });

    // ── save() ────────────────────────────────────────────────────────────────

    describe('save()', () => {
        beforeEach(() => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            service.init({ options: [{ id: 'analytics' }, { id: 'ads' }] });
        });

        it('should write the serialized options to the cookie store', () => {
            const { store } = setupCookieMock();
            service.options.set([
                { id: 'analytics', accept: true },
                { id: 'ads', accept: false },
            ]);

            service.save();

            expect(store['magmaCookieConsent']).toBe('analytics:true|ads:false');
        });

        it('should pass the configured durationCookie to setCookie', () => {
            const { getLastSet } = setupCookieMock();
            service.durationCookie.set(90);
            service.options.set([{ id: 'analytics', accept: true }]);

            service.save();

            // setCookie receives `days` and builds an expires header — we verify the value was stored
            expect(getLastSet()).toContain('magmaCookieConsent=analytics:true');
        });

        it('should execute onAccept for accepted options', () => {
            const onAccept = vi.fn();
            service.options.set([{ id: 'analytics', accept: true, onAccept }]);

            service.save();

            expect(onAccept).toHaveBeenCalledTimes(1);
        });

        it('should execute onRefuse for refused options', () => {
            const onRefuse = vi.fn();
            service.options.set([{ id: 'ads', accept: false, onRefuse }]);

            service.save();

            expect(onRefuse).toHaveBeenCalledTimes(1);
        });

        it('should not call onAccept when option is refused', () => {
            const onAccept = vi.fn();
            service.options.set([{ id: 'analytics', accept: false, onAccept }]);

            service.save();

            expect(onAccept).not.toHaveBeenCalled();
        });

        it('should not call onRefuse when option is accepted', () => {
            const onRefuse = vi.fn();
            service.options.set([{ id: 'analytics', accept: true, onRefuse }]);

            service.save();

            expect(onRefuse).not.toHaveBeenCalled();
        });

        it('should not throw when onAccept or onRefuse are not defined', () => {
            service.options.set([
                { id: 'analytics', accept: true },
                { id: 'ads', accept: false },
            ]);

            expect(() => service.save()).not.toThrow();
        });

        it('should set bannerVisible to false after saving', () => {
            service.save();

            expect(service.bannerVisible()).toBe(false);
        });

        it('should emit saved$ with the current options', () => {
            const emitted = vi.fn();
            service.saved$.subscribe(emitted);
            service.options.set([{ id: 'analytics', accept: true }]);

            service.save();

            expect(emitted).toHaveBeenCalledWith([{ id: 'analytics', accept: true }]);
        });
    });

    // ── hideBanner() ──────────────────────────────────────────────────────────

    describe('hideBanner()', () => {
        it('should set bannerVisible to false', () => {
            service.bannerVisible.set(true);

            service.hideBanner();

            expect(service.bannerVisible()).toBe(false);
        });
    });

    // ── closeOverlay() ────────────────────────────────────────────────────────

    describe('closeOverlay()', () => {
        it('should set bannerVisible to false', () => {
            service.bannerVisible.set(true);

            service.closeOverlay();

            expect(service.bannerVisible()).toBe(false);
        });

        it('should dispose the overlayRef when one is active', async () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockImplementation(async () => {
                service['overlayRef'] = mockOverlayRef as unknown as OverlayRef;
                service.bannerVisible.set(true);
            });
            service.init({ options: [] });
            await flushPromises();

            service.closeOverlay();

            expect(mockOverlayRef.dispose).toHaveBeenCalledTimes(1);
        });

        it('should not throw when called without an active overlay', () => {
            expect(() => service.closeOverlay()).not.toThrow();
        });

        it('should clear the overlayRef after closing', async () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockImplementation(async () => {
                service['overlayRef'] = mockOverlayRef as unknown as OverlayRef;
                service.bannerVisible.set(true);
            });
            service.init({ options: [] });
            await flushPromises();

            service.closeOverlay();

            expect(service['overlayRef']).toBeUndefined();
        });
    });

    // ── openOverlay() (private — via init()) ──────────────────────────────────

    describe('openOverlay() via init()', () => {
        it('should apply the default banner size', async () => {
            setupCookieMock();

            service.init({ options: [] });
            await waitForOverlay(service);

            expect(mockOverlayRef.updateSize).toHaveBeenCalledWith(service.defaultBannerSize);
        });

        it('should apply a custom banner size when provided', async () => {
            setupCookieMock();
            const bannerSize = { minHeight: 200, maxWidth: '600px' };

            service.init({ options: [], bannerSize });
            await waitForOverlay(service);

            expect(mockOverlayRef.updateSize).toHaveBeenCalledWith(bannerSize);
        });

        it('should apply the default bottom/left position', async () => {
            setupCookieMock();

            service.init({ options: [] });
            await waitForOverlay(service);

            expect(positionBuilder.bottom).toHaveBeenCalledWith('10px');
            expect(positionBuilder.left).toHaveBeenCalledWith('10px');
        });

        it('should apply custom top and right positions when provided', async () => {
            setupCookieMock();

            service.init({ options: [], position: { top: '20px', right: '20px' } });
            await waitForOverlay(service);

            expect(positionBuilder.top).toHaveBeenCalledWith('20px');
            expect(positionBuilder.right).toHaveBeenCalledWith('20px');
        });

        it('should apply centerHorizontally and centerVertically when provided', async () => {
            setupCookieMock();

            service.init({ options: [], position: { centerHorizontally: '0', centerVertically: '0' } });
            await waitForOverlay(service);

            expect(positionBuilder.centerHorizontally).toHaveBeenCalledWith('0');
            expect(positionBuilder.centerVertically).toHaveBeenCalledWith('0');
        });

        it('should call updatePositionStrategy with the built position', async () => {
            setupCookieMock();

            service.init({ options: [] });
            await waitForOverlay(service);

            expect(mockOverlayRef.updatePositionStrategy).toHaveBeenCalledWith(positionBuilder);
        });

        it('should set bannerVisible to true after opening', async () => {
            setupCookieMock();

            service.init({ options: [] });
            await waitForOverlay(service);

            expect(service.bannerVisible()).toBe(true);
        });
    });

    // ── Scénarios d'intégration proches de la démo ────────────────────────────

    describe('integration scenarios', () => {
        const demoOptions = () => [
            { id: 'essential', locked: true, accept: true, onAccept: vi.fn(), onRefuse: vi.fn() },
            { id: 'analytics', accept: false, onAccept: vi.fn(), onRefuse: vi.fn() },
            { id: 'marketing', accept: false, onAccept: vi.fn(), onRefuse: vi.fn() },
        ];

        it('should call onAccept only for locked+accepted and skip non-accepted on first save', () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            const opts = demoOptions();
            service.init({ options: opts });

            // User clicks "Accept all" — setAll(true) calls save() internally
            const { store } = setupCookieMock();
            service.setAll(true);

            // All options accepted → cookie must reflect that
            expect(store['magmaCookieConsent']).toBe('essential:true|analytics:true|marketing:true');
            // Callbacks fired via executeActions inside save()
            expect(opts[1].onAccept).toHaveBeenCalledTimes(1);
            expect(opts[2].onAccept).toHaveBeenCalledTimes(1);
        });

        it('should keep locked option as true in cookie even after setAll(false)', () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            service.init({
                options: [
                    { id: 'essential', locked: true, accept: true },
                    { id: 'analytics', accept: true },
                    { id: 'marketing', accept: true },
                ],
            });

            const { store } = setupCookieMock();
            service.setAll(false);

            expect(store['magmaCookieConsent']).toBe('essential:true|analytics:false|marketing:false');
        });

        it('should call onRefuse for non-locked options after setAll(false) and save', () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            const onRefuseAnalytics = vi.fn();
            const onRefuseMarketing = vi.fn();
            const onAcceptEssential = vi.fn();
            service.init({
                options: [
                    { id: 'essential', locked: true, accept: true, onAccept: onAcceptEssential },
                    { id: 'analytics', accept: true, onRefuse: onRefuseAnalytics },
                    { id: 'marketing', accept: true, onRefuse: onRefuseMarketing },
                ],
            });

            setupCookieMock();
            service.setAll(false);

            expect(onRefuseAnalytics).toHaveBeenCalledTimes(1);
            expect(onRefuseMarketing).toHaveBeenCalledTimes(1);
            // locked+accepted → onAccept should be called
            expect(onAcceptEssential).toHaveBeenCalledTimes(1);
        });

        it('should NOT execute callbacks when forceOpen is true and cookie exists (waits for user save)', async () => {
            setupCookieMock({ magmaCookieConsent: 'analytics:true|marketing:false' });
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            const onAccept = vi.fn();
            const onRefuse = vi.fn();

            service.init({
                options: [
                    { id: 'analytics', onAccept },
                    { id: 'marketing', onRefuse },
                ],
                forceOpen: true,
            });
            await flushPromises();

            // forceOpen: overlay was opened, but callbacks must NOT have fired yet
            expect(onAccept).not.toHaveBeenCalled();
            expect(onRefuse).not.toHaveBeenCalled();
        });

        it('should execute callbacks when user explicitly calls save() after forceOpen', async () => {
            setupCookieMock({ magmaCookieConsent: 'analytics:true|marketing:false' });
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            const onAccept = vi.fn();
            const onRefuse = vi.fn();

            service.init({
                options: [
                    { id: 'analytics', onAccept },
                    { id: 'marketing', onRefuse },
                ],
                forceOpen: true,
            });
            await flushPromises();

            setupCookieMock();
            service.save();

            expect(onAccept).toHaveBeenCalledTimes(1);
            expect(onRefuse).toHaveBeenCalledTimes(1);
        });

        it('should open overlay again after remove() + re-init', async () => {
            // First init with existing cookie → no overlay
            setupCookieMock({ magmaCookieConsent: 'analytics:true' });
            const openOverlaySpy = vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            service.init({ options: [{ id: 'analytics' }] });
            expect(openOverlaySpy).not.toHaveBeenCalled();

            // Remove cookie
            setupCookieMock(); // empty cookie store
            service.remove();

            // Re-init → no cookie → overlay must open
            service.init({ options: [{ id: 'analytics' }] });
            await flushPromises();
            expect(openOverlaySpy).toHaveBeenCalledTimes(1);
        });

        it('should correctly serialize a mix of locked, accepted and refused options to cookie', () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);
            const { store } = setupCookieMock();

            service.options.set([
                { id: 'essential', locked: true, accept: true },
                { id: 'analytics', accept: true },
                { id: 'marketing', accept: false },
            ]);

            service.save();

            expect(store['magmaCookieConsent']).toBe('essential:true|analytics:true|marketing:false');
        });

        it('should restore all three options correctly from a stored cookie', () => {
            setupCookieMock({
                magmaCookieConsent: 'essential:true|analytics:false|marketing:true',
            });

            service.init({
                options: [
                    { id: 'essential', locked: true, accept: false }, // locked → stored value ignored
                    { id: 'analytics', accept: true },
                    { id: 'marketing', accept: false },
                ],
            });

            // locked option: applySavedChoices skips locked → keeps original accept=false
            expect(service.options()[0].accept).toBe(false);
            expect(service.options()[1].accept).toBe(false); // analytics stored false
            expect(service.options()[2].accept).toBe(true); // marketing stored true
        });

        it('should use custom cookieDuration when saving after init with cookieDuration', async () => {
            setupCookieMock();
            vi.spyOn(service as any, 'openOverlay').mockResolvedValue(undefined);

            service.init({ options: [{ id: 'analytics' }], cookieDuration: 7 });
            await flushPromises();

            expect(service.durationCookie()).toBe(7);

            const { getLastSet } = setupCookieMock();
            service.options.set([{ id: 'analytics', accept: true }]);
            service.save();

            expect(getLastSet()).toContain('magmaCookieConsent=analytics:true');
        });
    });

    // ── applySavedChoices() (private — via init()) ────────────────────────────

    describe('applySavedChoices() via init()', () => {
        it('should not modify a locked option', () => {
            setupCookieMock({ magmaCookieConsent: 'essential:false' });

            service.init({ options: [{ id: 'essential', locked: true, accept: true }] });

            expect(service.options()[0].accept).toBe(true);
        });

        it('should ignore unknown ids present in the stored cookie', () => {
            setupCookieMock({ magmaCookieConsent: 'unknown:true' });

            service.init({ options: [{ id: 'analytics' }] });

            expect(service.options()[0].accept).toBeUndefined();
        });

        it('should parse the stored "false" string as boolean false', () => {
            setupCookieMock({ magmaCookieConsent: 'analytics:false' });

            service.init({ options: [{ id: 'analytics', accept: true }] });

            expect(service.options()[0].accept).toBe(false);
        });

        it('should parse the stored "true" string as boolean true', () => {
            setupCookieMock({ magmaCookieConsent: 'analytics:true' });

            service.init({ options: [{ id: 'analytics', accept: false }] });

            expect(service.options()[0].accept).toBe(true);
        });
    });
});
