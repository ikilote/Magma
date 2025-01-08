import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { MagmaLightDark } from '../../projects/ikilote/magma/src/public-api';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, MagmaLightDark],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = '@ikilote/magma';
    version = environment.version;
}
