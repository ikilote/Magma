import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./doc/demo-doc.component').then(m => m.DemoDocComponent),
    },
    {
        path: 'component',
        children: [
            {
                path: 'color-picker',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/color-picker/demo-color-picker.component').then(
                        m => m.DemoColorPickerComponent,
                    ),
            },
            {
                path: 'light-dark',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/light-dark/demo-light-dark.component').then(m => m.DemoLightDarkComponent),
            },
            {
                path: 'context-menu',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/context-menu/demo-context-menu.component').then(
                        m => m.DemoContextMenuComponent,
                    ),
            },
            {
                path: 'dialog',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/dialog/demo-dialog.component').then(m => m.DemoDialogComponent),
            },
            {
                path: 'input',
                children: [
                    {
                        path: 'generator',
                        pathMatch: 'full',
                        loadComponent: () =>
                            import('./components/input/demo-input-generator.component').then(
                                m => m.DemoInputGeneratorComponent,
                            ),
                    },
                    {
                        path: 'validators',
                        pathMatch: 'full',
                        loadComponent: () =>
                            import('./components/input/demo-input-error.component').then(
                                m => m.DemoInputErrorComponent,
                            ),
                    },
                    {
                        path: 'test',
                        pathMatch: 'full',
                        loadComponent: () =>
                            import('./components/input/demo-input.component').then(m => m.DemoInputComponent),
                    },
                    {
                        path: '**',
                        redirectTo: 'generator',
                    },
                ],
            },
            {
                path: 'info-messages',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/info-messages/demo-info-messages.component').then(
                        m => m.DemoInfoMessageComponent,
                    ),
            },
            {
                path: 'table',
                pathMatch: 'full',
                loadComponent: () => import('./components/table/demo-table.component').then(m => m.DemoTableComponent),
            },
            {
                path: 'tabs',
                pathMatch: 'full',
                loadComponent: () => import('./components/tabs/demo-tabs.component').then(m => m.DemoTabsComponent),
            },
        ],
    },
    {
        path: 'directive',
        children: [
            {
                path: 'click-outside',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/click-outside/demo-click-outside.component').then(
                        m => m.DemoClickOutsideComponent,
                    ),
            },
            {
                path: 'ng-init',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/ng-init/demo-ng-init.component').then(m => m.DemoNgInitComponent),
            },
            {
                path: 'ng-model-change-debounced',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/ng-model-change-debounced/demo-ng-model-change-debounced.component').then(
                        m => m.DemoNgModelChangeDebouncedComponent,
                    ),
            },
            {
                path: 'tooltip',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/tooltip/demo-tooltip.component').then(m => m.DemoTooltipComponent),
            },
            {
                path: 'textarea-autosize',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/textarea-autosize/demo-textarea-autosize.component').then(
                        m => m.DemoTextareaAutosizeComponent,
                    ),
            },
        ],
    },
    {
        path: 'utils',
        children: [
            {
                path: 'clipboard',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./utils/clipboard/demo-clipboard.component').then(m => m.DemoClipboardComponent),
            },
            {
                path: 'coercion',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./utils/coercion/demo-coercion.component').then(m => m.DemoCoercionComponent),
            },
            {
                path: 'cookies',
                pathMatch: 'full',
                loadComponent: () => import('./utils/cookies/demo-cookies.component').then(m => m.DemoCookiesComponent),
            },
            {
                path: 'date',
                pathMatch: 'full',
                loadComponent: () => import('./utils/date/demo-date.component').then(m => m.DemoDateComponent),
            },
            {
                path: 'dom',
                pathMatch: 'full',
                loadComponent: () => import('./utils/dom/demo-dom.component').then(m => m.DemoDomComponent),
            },
        ],
    },
    {
        path: 'style',
        children: [
            {
                path: 'buttons',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./styles/buttons/demo-buttons.component').then(m => m.DemoButtonsComponent),
            },
            {
                path: 'inputs',
                pathMatch: 'full',
                loadComponent: () => import('./styles/inputs/demo-inputs.component').then(m => m.DemoInputsComponent),
            },
            {
                path: 'icons',
                pathMatch: 'full',
                loadComponent: () => import('./styles/icons/demo-icons.component').then(m => m.DemoIconsComponent),
            },
            {
                path: 'grid',
                pathMatch: 'full',
                loadComponent: () => import('./styles/grid/demo-grid.component').then(m => m.DemoGridComponent),
            },
            {
                path: 'palette',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./styles/palette/demo-palette.component').then(m => m.DemoPaletteComponent),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/home',
    },
];
