import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2Js } from '@ikilote/json2html';
import {
    CookieBannerPosition,
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
        centerHorizontally: FormControl<string>;
        centerVertically: FormControl<string>;
        customTexts: FormControl<boolean>;
        textTitle: FormControl<string>;
        textPresentation: FormControl<string>;
        textAcceptAll: FormControl<string>;
        textRefuseAll: FormControl<string>;
        textManage: FormControl<string>;
        textDialogTitle: FormControl<string>;
        textDialogPresentation: FormControl<string>;
        textAcceptLabel: FormControl<string>;
        textSave: FormControl<string>;
        textPolicyLink: FormControl<string>;
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
            centerHorizontally: { default: '' },
            centerVertically: { default: '' },
            customTexts: { default: false },
            textTitle: { default: 'Cookie management' },
            textPresentation: {
                default:
                    'This application uses cookies. Some are essential for proper operation.\
Others are optional and help us analyze site usage.\
Click “Accept all” to give your consent, or manage each option individually.',
            },
            textAcceptAll: { default: 'Accept all' },
            textRefuseAll: { default: 'Refuse all' },
            textManage: { default: 'Manage preferences' },
            textDialogTitle: { default: 'Cookie settings' },
            textDialogPresentation: {
                default:
                    'By allowing these services, you accept the storage and reading of \
cookies and the use of tracking technologies required for their operation.',
            },
            textAcceptLabel: { default: 'Accept' },
            textSave: { default: 'Save' },
            textPolicyLink: { default: 'Cookie policy' },
        });

        this.ctrlForm.valueChanges.subscribe(() => {
            this.updateCode();
        });
        this.updateCode();
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
            centerHorizontally,
            centerVertically,
            customTexts,
            textTitle,
            textPresentation,
            textAcceptAll,
            textRefuseAll,
            textManage,
            textDialogTitle,
            textDialogPresentation,
            textAcceptLabel,
            textSave,
            textPolicyLink,
        } = this.ctrlForm.value;

        const position = {
            ...(posBottom ? ({ bottom: posBottom } as CookieBannerPosition) : {}),
            ...(posLeft ? ({ left: posLeft } as CookieBannerPosition) : {}),
            ...(posTop ? ({ top: posTop } as CookieBannerPosition) : {}),
            ...(posRight ? ({ right: posRight } as CookieBannerPosition) : {}),
            ...(centerHorizontally ? ({ centerHorizontally: centerHorizontally } as CookieBannerPosition) : {}),
            ...(centerVertically ? ({ centerVertically: centerVertically } as CookieBannerPosition) : {}),
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
                      presentation: textPresentation ?? undefined,
                      acceptAll: textAcceptAll ?? undefined,
                      refuseAll: textRefuseAll ?? undefined,
                      managePreferences: textManage ?? undefined,
                      dialogTitle: textDialogTitle ?? undefined,
                      dialogPresentation: textDialogPresentation ?? undefined,
                      acceptLabel: textAcceptLabel ?? undefined,
                      save: textSave ?? undefined,
                      policyLink: textPolicyLink ?? undefined,
                  }
                : undefined,
        });
    }

    reset() {
        this.cookieConsent.remove();
        this.cookieConsent.bannerVisible.set(false);
    }

    // ── Code examples ────────────────────────────────────────────────────────

    updateCode() {
        const {
            forceOpen,
            showPolicy,
            policyUrl,
            cookieDuration,
            posBottom,
            posLeft,
            posTop,
            posRight,
            centerHorizontally,
            centerVertically,
            customTexts,
            textTitle,
            textPresentation,
            textAcceptAll,
            textRefuseAll,
            textManage,
            textDialogTitle,
            textDialogPresentation,
            textAcceptLabel,
            textSave,
            textPolicyLink,
        } = this.ctrlForm.value;

        const position = {
            ...(posBottom ? ({ bottom: posBottom } as CookieBannerPosition) : {}),
            ...(posLeft ? ({ left: posLeft } as CookieBannerPosition) : {}),
            ...(posTop ? ({ top: posTop } as CookieBannerPosition) : {}),
            ...(posRight ? ({ right: posRight } as CookieBannerPosition) : {}),
            ...(centerHorizontally ? ({ centerHorizontally: centerHorizontally } as CookieBannerPosition) : {}),
            ...(centerVertically ? ({ centerVertically: centerVertically } as CookieBannerPosition) : {}),
        };

        const texts = customTexts
            ? {
                  title: textTitle ?? undefined,
                  presentation: textPresentation ?? undefined,
                  acceptAll: textAcceptAll ?? undefined,
                  refuseAll: textRefuseAll ?? undefined,
                  managePreferences: textManage ?? undefined,
                  dialogTitle: textDialogTitle ?? undefined,
                  dialogPresentation: textDialogPresentation ?? undefined,
                  acceptLabel: textAcceptLabel ?? undefined,
                  save: textSave ?? undefined,
                  policyLink: textPolicyLink ?? undefined,
              }
            : undefined;

        this.codeTs = `import { CookieConsent } from '@ikilote/magma';

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
                    onAccept: () => this.startAnalytics(),
                    onRefuse: () => this.stopAnalytics(),
                },
            ],${
                forceOpen
                    ? `
            forceOpen: true,`
                    : ''
            }${
                showPolicy
                    ? `
            policy: {
                show: true,
                url: '${policyUrl}'
            },`
                    : ''
            }${
                cookieDuration
                    ? `
            cookieDuration: ${cookieDuration},`
                    : ''
            }${
                Object.keys(position).length
                    ? `
            position: ${new Json2Js(position, { tabAdded: 3, tabAddedExceptFirst: true }).toString()},`
                    : ''
            }${
                texts && Object.keys(texts).length
                    ? `
            texts: ${new Json2Js(texts, { tabAdded: 3, tabAddedExceptFirst: true }).toString()},`
                    : ''
            }
        });
    }

    startAnalytics() {
        // ...
    }

    stopAnalytics() {
        // ...
    }
}`;
    }

    codeTs = '';

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
