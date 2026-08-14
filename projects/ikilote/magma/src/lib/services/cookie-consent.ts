import { Overlay, OverlayRef, OverlaySizeConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Service, inject, signal } from '@angular/core';

import { Subject } from 'rxjs';

import { getCookie, removeCookie, setCookie } from '../utils/cookies';

// ── Types ────────────────────────────────────────────────────────────────────

/** Position informations for banner */
export interface CookieBannerPosition {
    bottom?: string;
    left?: string;
    top?: string;
    right?: string;
    centerHorizontally?: string;
    centerVertically?: string;
}

/** A single cookie preference option. */
export interface CookieConsentOption {
    /** Unique identifier for this option. */
    id: string;
    /** Display label. */
    label?: string;
    /** Description shown to the user. */
    description?: string;
    /** Whether the user accepted this option. */
    accept?: boolean;
    /** If true, the user cannot change this option (always accepted). */
    locked?: boolean;
    /** Action to execute when accepted. */
    onAccept?: () => void;
    /** Action to execute when refused. */
    onRefuse?: () => void;
}

/** Configuration for the cookie consent service. */
export interface CookieConsentConfig {
    /** List of cookie preference options. */
    options: CookieConsentOption[];
    /** Override default texts displayed in the banner/dialog. */
    texts?: Partial<CookieConsentTexts>;
    /** Force the banner to open even if consent was already given. */
    forceOpen?: boolean;
    /** Cookie policy link configuration. */
    policy?: CookieConsentPolicy;
    /** banner position (default: `button:10px, left:10px`) */
    position?: CookieBannerPosition;
    /** banner size (default: `{ minHeight: 150, maxWidth: 'min(95vw, 800px)' }`) */
    bannerSize?: OverlaySizeConfig;
    /** cookie retention period for the banner in days (default: 365 days) */
    cookieDuration?: number;
}

/** Cookie policy link config. */
export interface CookieConsentPolicy {
    /** Whether to show the policy link. */
    show: boolean;
    /** URL of the policy page. */
    url: string;
}

/** Customizable texts for the consent UI. */
export interface CookieConsentTexts {
    /** banner title */
    title: string;
    /** banner presentation */
    presentation: string;
    /** banner accept all button */
    acceptAll: string;
    /** banner/dialog refuse all all button */
    refuseAll: string;
    /** banner manage preferences button */
    managePreferences: string;
    /** dialog title */
    dialogTitle: string;
    /** dialog presentation */
    dialogPresentation: string;
    /** dialog accept label */
    acceptLabel: string;
    /** dialog save button */
    save: string;
    /** dialog policy link */
    policyLink: string;
}

/** Default texts for the consent UI. */
export const DEFAULT_COOKIE_CONSENT_TEXTS: CookieConsentTexts = {
    title: 'Cookie management',
    presentation: `This application uses cookies. Some are essential for proper operation.
Others are optional and help us analyze site usage.
Click “Accept all” to give your consent, or manage each option individually.`,
    acceptAll: 'Accept all',
    refuseAll: 'Refuse all',
    managePreferences: 'Manage preferences',
    dialogTitle: 'Cookie settings',
    dialogPresentation: `By allowing these services, you accept the storage and reading of cookies and the use of
tracking technologies required for their operation.`,
    acceptLabel: 'Accept',
    save: 'Save',
    policyLink: 'Cookie policy',
};

// ── Service ──────────────────────────────────────────────────────────────────

/**
 * Service to manage cookie consent preferences.
 *
 * Stores user choices in a cookie and triggers accept/refuse callbacks.
 * Dynamically injects the consent banner/dialog via CDK Overlay — no template tag needed.
 *
 * @example
 * ```ts
 * const cookieConsent = inject(CookieConsent);
 *
 * cookieConsent.init({
 *     options: [
 *         { id: 'analytics', label: 'Analytics', description: 'Usage tracking', onAccept: () => startAnalytics() },
 *         { id: 'ads', label: 'Advertising', description: 'Personalized ads' },
 *     ],
 *     policy: { show: true, url: '/cookie-policy' },
 * });
 * ```
 */
@Service()
export class CookieConsent {
    private static readonly COOKIE_NAME = 'magmaCookieConsent';

    private readonly overlay = inject(Overlay);

    private overlayRef: OverlayRef | undefined;

    /** Current options state. */
    readonly options = signal<CookieConsentOption[]>([]);

    /** Resolved texts (defaults merged with overrides). */
    readonly texts = signal<CookieConsentTexts>(DEFAULT_COOKIE_CONSENT_TEXTS);

    /** Policy link configuration. */
    readonly policy = signal<CookieConsentPolicy | undefined>(undefined);

    /** Policy link configuration. */
    readonly durationCookie = signal<number>(365);

    /** Whether the banner is currently visible. */
    readonly bannerVisible = signal(false);

    /** Emits after user saves their preferences. */
    readonly saved$ = new Subject<CookieConsentOption[]>();

    readonly defaultBannerSize: OverlaySizeConfig = { minHeight: 150, maxWidth: 'min(95vw, 800px)' };
    readonly defaultBannerPosition: CookieBannerPosition = { bottom: '10px', left: '10px' };

    /**
     * Initialize cookie consent.
     * Reads existing consent from cookie; if absent or `forceOpen`, injects the banner overlay.
     */
    init(config: CookieConsentConfig) {
        const mergedTexts = { ...DEFAULT_COOKIE_CONSENT_TEXTS, ...(config.texts ?? {}) };
        this.texts.set(mergedTexts);
        this.policy.set(config.policy);

        const options = config.options.map(o => ({ ...o }));
        const stored = getCookie(CookieConsent.COOKIE_NAME);

        if (stored) {
            this.applySavedChoices(options, stored);

            if (!config.forceOpen) {
                this.executeActions(options);
                this.options.set(options);
                return;
            }
        }

        this.options.set(options);
        this.openOverlay(config);

        if (config.cookieDuration) {
            this.durationCookie.set(config.cookieDuration);
        }
    }

    /** Remove the consent cookie. */
    remove() {
        removeCookie(CookieConsent.COOKIE_NAME);
    }

    /** Accept or refuse all options and save. */
    setAll(accept: boolean) {
        this.options.update(opts => opts.map(o => (o.locked ? o : { ...o, accept })));
        this.save();
    }

    /** Persist current options to cookie and execute actions. */
    save() {
        const opts = this.options();
        const value = opts.map(o => `${o.id}:${!!o.accept}`).join('|');
        setCookie(CookieConsent.COOKIE_NAME, value, this.durationCookie());
        this.executeActions(opts);
        this.closeOverlay();
        this.saved$.next(opts);
    }

    /** Hide the banner without saving. */
    hideBanner() {
        this.bannerVisible.set(false);
    }

    /** Close and dispose the overlay. */
    closeOverlay() {
        this.bannerVisible.set(false);
        this.overlayRef?.dispose();
        this.overlayRef = undefined;
    }

    // ── Private ──────────────────────────────────────────────────────────────

    private async openOverlay(config: CookieConsentConfig) {
        // Lazy-load the component to avoid circular deps
        const { MagmaCookieConsent } = await import('../components/cookie-consent/cookie-consent.component');

        const overlayRef = this.overlay.create({});

        // size banner
        overlayRef.updateSize(config.bannerSize ?? this.defaultBannerSize);

        // position banner
        let position = this.overlay.position().global();
        const posConfig = config.position ?? this.defaultBannerPosition;
        if (posConfig.top) position = position.top(posConfig.top);
        if (posConfig.left) position = position.left(posConfig.left);
        if (posConfig.right) position = position.right(posConfig.right);
        if (posConfig.bottom) position = position.bottom(posConfig.bottom);
        if (posConfig.centerHorizontally) position = position.centerHorizontally(posConfig.centerHorizontally);
        if (posConfig.centerVertically) position = position.centerVertically(posConfig.centerVertically);
        overlayRef.updatePositionStrategy(position);

        const portal = new ComponentPortal(MagmaCookieConsent);
        overlayRef.attach(portal);
        this.overlayRef = overlayRef;
        this.bannerVisible.set(true);
    }

    private applySavedChoices(options: CookieConsentOption[], stored: string) {
        stored.split('|').forEach(entry => {
            const [key, value] = entry.split(':');
            const option = options.find(o => o.id === key);
            if (option && !option.locked) {
                option.accept = value === 'true';
            }
        });
    }

    private executeActions(options: CookieConsentOption[]) {
        options.forEach(o => {
            if (o.accept && typeof o.onAccept === 'function') {
                o.onAccept();
            } else if (!o.accept && typeof o.onRefuse === 'function') {
                o.onRefuse();
            }
        });
    }
}
