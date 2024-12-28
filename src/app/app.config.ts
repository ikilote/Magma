import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { routes } from './app.routes';

declare var require: any;

/**
 * Import every language you wish to highlight here
 * NOTE: The name of each language must match the file name its imported from
 */
export function hljsLanguages() {
    return [
        { name: 'typescript', func: require('highlight.js/lib/languages/typescript') },
        { name: 'javascript', func: require('highlight.js/lib/languages/javascript') },
        { name: 'scss', func: require('highlight.js/lib/languages/scss') },
        { name: 'xml', func: require('highlight.js/lib/languages/xml') },
    ];
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
                languages: {
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    javascript: () => import('highlight.js/lib/languages/javascript'),
                    css: () => import('highlight.js/lib/languages/css'),
                    xml: () => import('highlight.js/lib/languages/xml'),
                },
            },
        },
    ],
};
