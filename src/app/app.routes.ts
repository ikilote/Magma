import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./doc/demo-doc.component').then(m => m.DemoDocComponent),
    },
    {
        path: 'color-picker',
        pathMatch: 'full',
        loadComponent: () =>
            import('./components/color-picker/demo-color-picker.component').then(m => m.DemoColorPickerComponent),
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
            import('./components/context-menu/demo-context-menu.component').then(m => m.DemoContextMenuComponent),
    },
    {
        path: 'dialog',
        pathMatch: 'full',
        loadComponent: () => import('./components/dialog/demo-dialog.component').then(m => m.DemoDialogComponent),
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
                    import('./components/input/demo-input-error.component').then(m => m.DemoInputErrorComponent),
            },
            {
                path: 'test',
                pathMatch: 'full',
                loadComponent: () => import('./components/input/demo-input.component').then(m => m.DemoInputComponent),
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
            import('./components/info-messages/demo-info-messages.component').then(m => m.DemoInfoMessageComponent),
    },
    {
        path: 'tabs',
        pathMatch: 'full',
        loadComponent: () => import('./components/tabs/demo-tabs.component').then(m => m.DemoTabsComponent),
    },
    {
        path: 'style-buttons',
        pathMatch: 'full',
        loadComponent: () => import('./styles/buttons/demo-buttons.component').then(m => m.DemoButtonsComponent),
    },
    {
        path: 'style-inputs',
        pathMatch: 'full',
        loadComponent: () => import('./styles/inputs/demo-inputs.component').then(m => m.DemoInputsComponent),
    },
    {
        path: 'style-icons',
        pathMatch: 'full',
        loadComponent: () => import('./styles/icons/demo-icons.component').then(m => m.DemoIconsComponent),
    },
    {
        path: 'style-grid',
        pathMatch: 'full',
        loadComponent: () => import('./styles/grid/demo-grid.component').then(m => m.DemoGridComponent),
    },
    {
        path: '**',
        redirectTo: '/home',
    },
];
