import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'color-picker',
        loadComponent: () =>
            import('./components/color-picker/demo-color-picker.component').then(m => m.DemoColorPickerComponent),
    },
    {
        path: 'context-menu',
        loadComponent: () =>
            import('./components/context-menu/demo-context-menu.component').then(m => m.DemoContextMenuComponent),
    },
    {
        path: 'dialog',
        loadComponent: () =>
            import('./components/dialog/demo-dialog.component').then(m => m.DemoDialogComponent),
    },
    {
        path: 'tabs',
        loadComponent: () =>
            import('./components/tabs/demo-tabs.component').then(m => m.DemoTabsComponent),
    },
    {
        path: '**',
        redirectTo: 'context-menu',
    },
];
