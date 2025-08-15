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
                path: 'block',
                pathMatch: 'full',
                loadComponent: () => import('./components/block/demo-block.component').then(m => m.DemoBlockComponent),
            },
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
            {
                path: 'message',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/message/demo-message.component').then(m => m.DemoMessageComponent),
            },
            {
                path: 'paginate',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/paginate/demo-paginate.component').then(m => m.DemoPaginateComponent),
            },
            {
                path: 'progress',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/progress/demo-progress.component').then(m => m.DemoProgressComponent),
            },
            {
                path: 'spinner',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/spinner/demo-spinner.component').then(m => m.DemoSpinnerComponent),
            },
            {
                path: 'loader',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/loader/demo-loader.component').then(m => m.DemoLoaderComponent),
            },
            {
                path: 'loader-block',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/loader-block/demo-loader-block.component').then(
                        m => m.DemoLoaderBlockComponent,
                    ),
            },
            {
                path: 'walkthrough',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/walkthrough/demo-walkthrough.component').then(m => m.DemoWalkthroughComponent),
            },
        ],
    },
    {
        path: 'directive',
        children: [
            {
                path: 'click-enter',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/click-enter/demo-click-enter.component').then(m => m.DemoClickEnterComponent),
            },
            {
                path: 'click-outside',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/click-outside/demo-click-outside.component').then(
                        m => m.DemoClickOutsideComponent,
                    ),
            },
            {
                path: 'limit-focus',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/limit-focus/demo-limit-focus.component').then(m => m.DemoLimitFocusComponent),
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
                path: 'sortable',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/sortable/demo-sortable.component').then(m => m.DemoSortableComponent),
            },
            {
                path: 'stop-propagation',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./directives/stop-propagation/demo-stop-propagation.component').then(
                        m => m.DemoStopPropagationComponent,
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
        path: 'pipe',
        children: [
            {
                path: 'class-list',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./pipes/class-list/demo-class-list.component').then(m => m.DemoClassListComponent),
            },
            {
                path: 'math',
                pathMatch: 'full',
                loadComponent: () => import('./pipes/math/demo-math.component').then(m => m.DemoMathComponent),
            },
            {
                path: 'num-format',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./pipes/num-format/demo-num-format.component').then(m => m.DemoNumFormatComponent),
            },
            {
                path: 'repeat-for',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./pipes/repeat-for/demo-repeat-for.component').then(m => m.DemoeRepeatForComponent),
            },
            {
                path: 'file-size',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./pipes/file-size/demo-file-size.component').then(m => m.DemoFileSizeComponent),
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
            {
                path: 'email',
                pathMatch: 'full',
                loadComponent: () => import('./utils/email/demo-email.component').then(m => m.DemoEmailComponent),
            },
            {
                path: 'enum',
                pathMatch: 'full',
                loadComponent: () => import('./utils/enum/demo-enum.component').then(m => m.DemoEnumComponent),
            },
            {
                path: 'file',
                pathMatch: 'full',
                loadComponent: () => import('./utils/file/demo-file.component').then(m => m.DemoFileComponent),
            },
            {
                path: 'json',
                pathMatch: 'full',
                loadComponent: () => import('./utils/json/demo-json.component').then(m => m.DemoJsonComponent),
            },
            {
                path: 'number',
                pathMatch: 'full',
                loadComponent: () => import('./utils/number/demo-number.component').then(m => m.DemoNumberComponent),
            },
            {
                path: 'object',
                pathMatch: 'full',
                loadComponent: () => import('./utils/object/demo-object.component').then(m => m.DemoObjectComponent),
            },
            {
                path: 'text',
                pathMatch: 'full',
                loadComponent: () => import('./utils/text/demo-text.component').then(m => m.DemoTextComponent),
            },
            {
                path: 'subscriptions',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./utils/subscriptions/demo-subscriptions.component').then(
                        m => m.DemoSubscriptionsComponent,
                    ),
            },
        ],
    },
    {
        path: 'style',
        children: [
            {
                path: 'buttons-links',
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
