import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHighlightOptions } from 'ngx-highlightjs';
import { MARKED_OPTIONS, MarkedRenderer, provideMarkdown } from 'ngx-markdown';

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
//** function that returns `MarkedOptions` with renderer override */
export function markedOptionsFactory() {
    const renderer = new MarkedRenderer();

    renderer.link = ({ href, text }) => {
        return `<a target="_blank" rel="nofollow" href="${href}">${text}</a>`;
    };

    return { renderer };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHighlightOptions({
            coreLibraryLoader: () => import('highlight.js/lib/core'),
            lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
            languages: {
                typescript: () => import('highlight.js/lib/languages/typescript'),
                javascript: () => import('highlight.js/lib/languages/javascript'),
                css: () => import('highlight.js/lib/languages/css'),
                xml: () => import('highlight.js/lib/languages/xml'),
            },
        }),
        provideMarkdown({
            loader: HttpClient,
            markedOptions: {
                provide: MARKED_OPTIONS,
                useFactory: markedOptionsFactory,
            },
        }),
    ],
};
