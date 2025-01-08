import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./doc/demo-doc.component').then(m => m.DemoDocComponent),
    },
    {
        path: 'color-picker',
        loadComponent: () =>
            import('./components/color-picker/demo-color-picker.component').then(m => m.DemoColorPickerComponent),
    },
    {
        path: 'light-dark',
        loadComponent: () =>
            import('./components/light-dark/demo-light-dark.component').then(m => m.DemoLightDarkComponent),
    },
    {
        path: 'context-menu',
        loadComponent: () =>
            import('./components/context-menu/demo-context-menu.component').then(m => m.DemoContextMenuComponent),
    },
    {
        path: 'dialog',
        loadComponent: () => import('./components/dialog/demo-dialog.component').then(m => m.DemoDialogComponent),
    },
    {
        path: 'tabs',
        loadComponent: () => import('./components/tabs/demo-tabs.component').then(m => m.DemoTabsComponent),
    },
    {
        path: 'style-buttons',
        loadComponent: () => import('./styles/buttons/demo-buttons.component').then(m => m.DemoButtonsComponent),
    },
    {
        path: 'style-inputs',
        loadComponent: () => import('./styles/inputs/demo-inputs.component').then(m => m.DemoInputsComponent),
    },
    {
        path: 'style-icons',
        loadComponent: () => import('./styles/icons/demo-icons.component').then(m => m.DemoIconsComponent),
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
