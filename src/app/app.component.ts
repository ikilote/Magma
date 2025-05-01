import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { menu } from './app.menu';

import { LightDark, MagmaLightDark } from '../../projects/ikilote/magma/src/public-api';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, MagmaLightDark, NgTemplateOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    host: {
        '[class.mobile-menu-open]': 'menu',
    },
})
export class AppComponent {
    private readonly lightDark = inject(LightDark);

    title = '@ikilote/magma';
    version = environment.version;
    menu = false;

    contentMenu = menu;

    constructor() {
        this.lightDark.init();
    }

    toggleMenu() {
        this.menu = !this.menu;
    }

    closeMenu() {
        this.menu = false;
    }
}
