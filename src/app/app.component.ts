import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

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
    title = '@ikilote/magma';
    version = environment.version;
    menu = false;

    toggleMenu() {
        this.menu = !this.menu;
    }
}
