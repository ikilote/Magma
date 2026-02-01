import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
        '[attr.dir]': 'dir',
    },
})
export class AppComponent {
    private readonly lightDark = inject(LightDark);

    title = '@ikilote/magma';
    version = environment.version;
    menu = false;

    contentMenu = menu;

    dir: 'rtl' | 'ltr' = 'ltr';

    constructor() {
        this.lightDark.init();

        Json2html.default.webComponentSelfClosing = true;
    }

    toggleMenu(state?: boolean) {
        this.menu = state ?? !this.menu;
    }
}
