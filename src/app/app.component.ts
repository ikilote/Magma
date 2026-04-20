import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { Json2html } from '@ikilote/json2html';

import { menu } from './app.menu';

import {
    LightDark,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
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

    title = '@ikilote/magma';
    version = environment.version;
    menu = false;
    isHome = false;

    contentMenu = menu;

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
}
