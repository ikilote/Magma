import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    CookieConsent,
    CookieConsentOption,
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputText,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-cookie-consent',
    templateUrl: './demo-cookie-consent.component.html',
    styleUrl: './demo-cookie-consent.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputCheckbox,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputText,
        MagmaTableModule,
        MagmaTabsModule,
    ],
})
export class DemoCookieConsentComponent {
    protected readonly cookieConsent = inject(CookieConsent);
    private readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        forceOpen: FormControl<boolean>;
        showPolicy: FormControl<boolean>;
        policyUrl: FormControl<string>;
        cookieDuration: FormControl<number>;
        posBottom: FormControl<string>;
        posLeft: FormControl<string>;
        posTop: FormControl<string>;
        posRight: FormControl<string>;
        customTexts: FormControl<boolean>;
        textTitle: FormControl<string>;
        textAcceptAll: FormControl<string>;
        textRefuseAll: FormControl<string>;
        textManage: FormControl<string>;
    }>;

    readonly demoOptions: CookieConsentOption[] = [
        {
            id: 'essential',
            label: 'Essential cookies',
            description: 'Required for the application to work. Cannot be disabled.',
            accept: true,
            locked: true,
        },
        {
            id: 'analytics',
            label: 'Analytics',
            description: 'Help us understand how visitors interact with the application.',
            accept: false,
            onAccept: () => console.log('[demo] Analytics accepted'),
            onRefuse: () => console.log('[demo] Analytics refused'),
        },
        {
            id: 'marketing',
            label: 'Marketing',
            description: 'Used to deliver personalized advertisements.',
            accept: false,
            onAccept: () => console.log('[demo] Marketing accepted'),
            onRefuse: () => console.log('[demo] Marketing refused'),
        },
    ];

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            forceOpen: { default: false },
            showPolicy: { default: true },
            policyUrl: { default: '/cookie-policy' },
            cookieDuration: { default: 365 },
            posBottom: { default: '10px' },
            posLeft: { default: '10px' },
            posTop: { default: '' },
            posRight: { default: '' },
            customTexts: { default: false },
            textTitle: { default: 'Cookie management' },
            textAcceptAll: { default: 'Accept all' },
            textRefuseAll: { default: 'Refuse all' },
            textManage: { default: 'Manage preferences' },
        });
    }

    launch() {
        const {
            forceOpen,
            showPolicy,
            policyUrl,
            cookieDuration,
            posBottom,
            posLeft,
            posTop,
            posRight,
            customTexts,
            textTitle,
            textAcceptAll,
            textRefuseAll,
            textManage,
        } = this.ctrlForm.value;

        const position = {
            ...(posBottom ? { bottom: posBottom } : {}),
            ...(posLeft ? { left: posLeft } : {}),
            ...(posTop ? { top: posTop } : {}),
            ...(posRight ? { right: posRight } : {}),
        };

        this.cookieConsent.init({
            options: this.demoOptions.map(o => ({ ...o })),
            forceOpen: forceOpen ?? false,
            policy: showPolicy ? { show: true, url: policyUrl ?? '/cookie-policy' } : undefined,
            cookieDuration: cookieDuration ?? 365,
            position: Object.keys(position).length ? position : undefined,
            texts: customTexts
                ? {
                      title: textTitle ?? undefined,
                      acceptAll: textAcceptAll ?? undefined,
                      refuseAll: textRefuseAll ?? undefined,
                      managePreferences: textManage ?? undefined,
                  }
                : undefined,
        });
    }

    reset() {
        this.cookieConsent.remove();
        this.cookieConsent.bannerVisible.set(false);
    }

    // ── Code examples ────────────────────────────────────────────────────────

    codeTs = `import { CookieConsent } from '@ikilote/magma';

@Component({
    selector: 'my-app',
    template: \`<router-outlet />\`,
})
export class AppComponent {
    private readonly cookieConsent = inject(CookieConsent);

    ngOnInit() {
        // No template tag needed — the banner is injected via CDK Overlay
        this.cookieConsent.init({
            options: [
                {
                    id: 'essential',
                    label: 'Essential cookies',
                    description: 'Required for the app to work.',
                    accept: true,
                    locked: true,
                },
                {
                    id: 'analytics',
                    label: 'Analytics',
                    description: 'Usage tracking.',
                    onAccept: () => startAnalytics(),
                    onRefuse: () => stopAnalytics(),
                },
            ],
            policy: { show: true, url: '/cookie-policy' },
        });
    }
}`;

    codeInterface = `interface CookieConsentOption {
    id: string;
    label?: string;
    description?: string;
    accept?: boolean;
    locked?: boolean;       // cannot be toggled by user
    onAccept?: () => void;  // callback when accepted
    onRefuse?: () => void;  // callback when refused
}

interface CookieConsentConfig {
    options: CookieConsentOption[];
    texts?: Partial<CookieConsentTexts>;
    forceOpen?: boolean;
    policy?: { show: boolean; url: string };
    position?: CookieBannerPosition;
    bannerSize?: OverlaySizeConfig;
    cookieDuration?: number;
}`;
}
