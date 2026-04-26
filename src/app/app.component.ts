import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Json2html } from '@ikilote/json2html';

import { filter, map } from 'rxjs';

import { Menu, menu } from './app.menu';

import {
    LightDark,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
    MagmaLightDark,
} from '../../projects/ikilote/magma/src/public-api';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        FormsModule,
        NgTemplateOutlet,
        MagmaLightDark,
        MagmaInput,
        MagmaInputElement,
        MagmaInputCheckbox,
        MagmaInputText,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    host: {
        '[class.mobile-menu-open]': 'menu',
        '[class.hide-aside]': 'isHome',
        '[attr.dir]': 'dir',
    },
})
export class AppComponent {
    private readonly lightDark = inject(LightDark);
    private readonly router = inject(Router);

    title = 'Magma';
    version = environment.version;
    menu = false;
    isHome = false;

    contentMenu: Menu = menu;

    dir: 'rtl' | 'ltr' = 'ltr';

    constructor() {
        this.lightDark.init();
        Json2html.default.webComponentSelfClosing = true;

        this.router.events
            .pipe(
                filter(e => e instanceof NavigationEnd),
                map(e => (e as NavigationEnd).urlAfterRedirects),
            )
            .subscribe(url => {
                this.isHome = url === '/';
            });
    }

    toggleMenu(state?: boolean) {
        this.menu = state ?? !this.menu;
    }

    updateMenu(event: string) {
        const searchTerm = event.trim().toLowerCase();
        this.contentMenu = menu.filter(
            item =>
                item.groupName?.toLowerCase().includes(searchTerm) ||
                item.items?.some(child => child.label.toLowerCase().includes(searchTerm)),
        );
    }
}
