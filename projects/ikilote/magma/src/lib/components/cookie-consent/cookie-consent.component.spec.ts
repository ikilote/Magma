import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { type Mocked, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MagmaCookieConsent } from './cookie-consent.component';

import { CookieConsent, CookieConsentOption, DEFAULT_COOKIE_CONSENT_TEXTS } from '../../services/cookie-consent';
import { MagmaDialog } from '../dialog/dialog.component';

// ── Mock service factory ──────────────────────────────────────────────────────

function buildMockCookieConsent(
    overrides: Partial<{
        options: CookieConsentOption[];
        bannerVisible: boolean;
    }> = {},
): Mocked<CookieConsent> {
    const opts = overrides.options ?? [];
    const banner = overrides.bannerVisible ?? false;

    return {
        options: signal(opts),
        texts: signal(DEFAULT_COOKIE_CONSENT_TEXTS),
        policy: signal(undefined),
        bannerVisible: signal(banner),
        durationCookie: signal(365),
        saved$: { subscribe: vi.fn() },
        setAll: vi.fn(),
        save: vi.fn(),
        hideBanner: vi.fn(),
        closeOverlay: vi.fn(),
        init: vi.fn(),
        remove: vi.fn(),
    } as unknown as Mocked<CookieConsent>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MagmaCookieConsent', () => {
    let component: MagmaCookieConsent;
    let fixture: ComponentFixture<MagmaCookieConsent>;
    let mockService: Mocked<CookieConsent>;

    beforeEach(async () => {
        mockService = buildMockCookieConsent();

        await TestBed.configureTestingModule({
            imports: [MagmaCookieConsent],
            providers: [{ provide: CookieConsent, useValue: mockService }],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaCookieConsent);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    // ── Creation ──────────────────────────────────────────────────────────────

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should expose the dialog via viewChild', () => {
        // dialog is inside <mg-dialog #dialog> — always present in the template
        expect(component.dialog()).toBeInstanceOf(MagmaDialog);
    });

    // ── Banner rendering ──────────────────────────────────────────────────────

    describe('banner rendering', () => {
        it('should not show the banner when bannerVisible is false', () => {
            mockService.bannerVisible.set(false);
            fixture.changeDetectorRef.detectChanges();

            const banner = fixture.debugElement.query(By.css('.banner'));
            expect(banner).toBeNull();
        });

        it('should show the banner when bannerVisible is true', () => {
            mockService.bannerVisible.set(true);
            fixture.changeDetectorRef.detectChanges();

            const banner = fixture.debugElement.query(By.css('.banner'));
            expect(banner).toBeTruthy();
        });

        it('should display the title from texts signal', () => {
            mockService.bannerVisible.set(true);
            fixture.changeDetectorRef.detectChanges();

            const title = fixture.debugElement.query(By.css('.banner-title'));
            expect(title.nativeElement.textContent).toContain(DEFAULT_COOKIE_CONSENT_TEXTS.title);
        });

        it('should display the presentation text from texts signal', () => {
            mockService.bannerVisible.set(true);
            fixture.changeDetectorRef.detectChanges();

            const text = fixture.debugElement.query(By.css('.banner-text'));
            expect(text.nativeElement.textContent).toContain('cookies');
        });
    });

    // ── acceptAll() ───────────────────────────────────────────────────────────

    describe('acceptAll()', () => {
        it('should call cookieConsent.setAll(true) when called with true', () => {
            component.acceptAll(true);

            expect(mockService.setAll).toHaveBeenCalledWith(true);
        });

        it('should call cookieConsent.setAll(false) when called with false', () => {
            component.acceptAll(false);

            expect(mockService.setAll).toHaveBeenCalledWith(false);
        });

        it('should trigger acceptAll(true) when "Accept all" banner button is clicked', () => {
            mockService.bannerVisible.set(true);
            fixture.changeDetectorRef.detectChanges();

            const buttons = fixture.debugElement.queryAll(By.css('.banner-actions button'));
            // Buttons order: Manage preferences | Refuse all | Accept all
            const acceptAllBtn = buttons[2];
            acceptAllBtn.triggerEventHandler('click', {});

            expect(mockService.setAll).toHaveBeenCalledWith(true);
        });

        it('should trigger acceptAll(false) when "Refuse all" banner button is clicked', () => {
            mockService.bannerVisible.set(true);
            fixture.changeDetectorRef.detectChanges();

            const buttons = fixture.debugElement.queryAll(By.css('.banner-actions button'));
            const refuseAllBtn = buttons[1];
            refuseAllBtn.triggerEventHandler('click', {});

            expect(mockService.setAll).toHaveBeenCalledWith(false);
        });

        it('should trigger acceptAll(false) when dialog "Refuse all" button is clicked', () => {
            // The dialog content is only rendered when the dialog is open
            component.dialog()!.open();
            fixture.changeDetectorRef.detectChanges();

            const dialogButtons = fixture.debugElement.queryAll(By.css('.dialog-actions button'));
            // Buttons: Refuse all | Save
            const refuseAllBtn = dialogButtons[0];
            refuseAllBtn.triggerEventHandler('click', {});

            expect(mockService.setAll).toHaveBeenCalledWith(false);
        });
    });

    // ── manage() ──────────────────────────────────────────────────────────────

    describe('manage()', () => {
        it('should call cookieConsent.hideBanner()', () => {
            component.manage();

            expect(mockService.hideBanner).toHaveBeenCalledTimes(1);
        });

        it('should open the dialog', () => {
            const dialogInstance = component.dialog();
            const openSpy = vi.spyOn(dialogInstance!, 'open');

            component.manage();

            expect(openSpy).toHaveBeenCalledTimes(1);
        });

        it('should trigger manage() when "Manage preferences" banner button is clicked', () => {
            mockService.bannerVisible.set(true);
            fixture.changeDetectorRef.detectChanges();

            const manageSpy = vi.spyOn(component, 'manage');
            const buttons = fixture.debugElement.queryAll(By.css('.banner-actions button'));
            const manageBtn = buttons[0];
            manageBtn.triggerEventHandler('click', {});

            expect(manageSpy).toHaveBeenCalledTimes(1);
        });
    });

    // ── save() ────────────────────────────────────────────────────────────────

    describe('save()', () => {
        it('should call cookieConsent.save()', () => {
            component.save();

            expect(mockService.save).toHaveBeenCalledTimes(1);
        });

        it('should close the dialog after saving', () => {
            const dialogInstance = component.dialog();
            dialogInstance!.open();
            fixture.changeDetectorRef.detectChanges();
            const closeSpy = vi.spyOn(dialogInstance!, 'close');

            component.save();

            expect(closeSpy).toHaveBeenCalledTimes(1);
        });

        it('should trigger save() when dialog "Save" button is clicked', () => {
            const saveSpy = vi.spyOn(component, 'save');
            // The dialog content is only rendered when the dialog is open
            component.dialog()!.open();
            fixture.changeDetectorRef.detectChanges();

            const dialogButtons = fixture.debugElement.queryAll(By.css('.dialog-actions button'));
            const saveBtn = dialogButtons[1];
            saveBtn.triggerEventHandler('click', {});

            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
    });

    // ── toggleOption() ────────────────────────────────────────────────────────

    describe('toggleOption()', () => {
        beforeEach(() => {
            mockService.options.set([
                { id: 'analytics', accept: false },
                { id: 'ads', accept: true, locked: true },
                { id: 'perf', accept: true },
            ]);
            fixture.changeDetectorRef.detectChanges();
        });

        it('should toggle accept from false to true for the given index', () => {
            component.toggleOption(0);

            expect(mockService.options()[0].accept).toBe(true);
        });

        it('should toggle accept from true to false for the given index', () => {
            component.toggleOption(2);

            expect(mockService.options()[2].accept).toBe(false);
        });

        it('should not toggle a locked option', () => {
            component.toggleOption(1);

            // locked option at index 1 stays unchanged
            expect(mockService.options()[1].accept).toBe(true);
        });

        it('should leave other options unchanged when toggling one', () => {
            component.toggleOption(0);

            expect(mockService.options()[1].accept).toBe(true); // locked, untouched
            expect(mockService.options()[2].accept).toBe(true); // not toggled
        });
    });

    // ── Dialog rendering ──────────────────────────────────────────────────────

    describe('dialog rendering', () => {
        beforeEach(() => {
            // Dialog content is only rendered when the dialog is open
            component.dialog()!.open();
            fixture.changeDetectorRef.detectChanges();
        });

        it('should display options list in the dialog', () => {
            mockService.options.set([
                { id: 'analytics', label: 'Analytics', description: 'Track usage' },
                { id: 'ads', label: 'Advertising', description: 'Personalized ads' },
            ]);
            fixture.changeDetectorRef.detectChanges();

            const sections = fixture.debugElement.queryAll(By.css('.option'));
            expect(sections).toHaveLength(2);
        });

        it('should render option data-id attributes correctly', () => {
            mockService.options.set([{ id: 'analytics', label: 'Analytics' }]);
            fixture.changeDetectorRef.detectChanges();

            const section = fixture.debugElement.query(By.css('.option'));
            expect(section.nativeElement.getAttribute('data-id')).toBe('analytics');
        });

        it('should display the option label', () => {
            mockService.options.set([{ id: 'analytics', label: 'Analytics' }]);
            fixture.changeDetectorRef.detectChanges();

            const label = fixture.debugElement.query(By.css('.option-label'));
            expect(label.nativeElement.textContent).toContain('Analytics');
        });

        it('should display the option description', () => {
            mockService.options.set([{ id: 'analytics', label: 'Analytics', description: 'Track usage' }]);
            fixture.changeDetectorRef.detectChanges();

            const desc = fixture.debugElement.query(By.css('.option-desc'));
            expect(desc.nativeElement.textContent).toContain('Track usage');
        });

        it('should show policy link when policy.show is true', () => {
            mockService.policy.set({ show: true, url: '/cookie-policy' });
            fixture.changeDetectorRef.detectChanges();

            const policyLink = fixture.debugElement.query(By.css('.policy-link a'));
            expect(policyLink).toBeTruthy();
            expect(policyLink.nativeElement.getAttribute('href')).toBe('/cookie-policy');
        });

        it('should not show policy link when policy is undefined', () => {
            mockService.policy.set(undefined);
            fixture.changeDetectorRef.detectChanges();

            const policyLink = fixture.debugElement.query(By.css('.policy-link'));
            expect(policyLink).toBeNull();
        });

        it('should not show policy link when policy.show is false', () => {
            mockService.policy.set({ show: false, url: '/cookie-policy' });
            fixture.changeDetectorRef.detectChanges();

            const policyLink = fixture.debugElement.query(By.css('.policy-link'));
            expect(policyLink).toBeNull();
        });

        it('should display the policy link text from texts signal', () => {
            mockService.policy.set({ show: true, url: '/cookie-policy' });
            fixture.changeDetectorRef.detectChanges();

            const policyLink = fixture.debugElement.query(By.css('.policy-link a'));
            expect(policyLink.nativeElement.textContent).toContain(DEFAULT_COOKIE_CONSENT_TEXTS.policyLink);
        });
    });
});
