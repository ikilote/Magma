import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { LightDark } from '../../projects/ikilote/magma/src/lib/services/light-dark';
import { MagmaLightDark } from '../../projects/ikilote/magma/src/public-api';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, MagmaLightDark],
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
