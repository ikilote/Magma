import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    Logger,
    LoggerLevel,
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-logger',
    templateUrl: './demo-logger.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        CodeTabsComponent,
        MagmaTabsModule,
        MagmaTableModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputSelect,
    ],
})
export class DemoLoggerComponent {
    readonly logger = inject(Logger);

    message = 'Hello from Logger';

    level: LoggerLevel = LoggerLevel.log;

    readonly levelData: Select2Data = [
        { value: LoggerLevel.log, label: 'log' },
        { value: LoggerLevel.info, label: 'info' },
        { value: LoggerLevel.debug, label: 'debug' },
        { value: LoggerLevel.warn, label: 'warn' },
        { value: LoggerLevel.error, label: 'error' },
    ];

    readonly minLevelData: Select2Data = [
        { value: 'log', label: 'log' },
        { value: 'info', label: 'info' },
        { value: 'debug', label: 'debug' },
        { value: 'warn', label: 'warn' },
        { value: 'error', label: 'error' },
    ];

    get currentMinLevel(): keyof typeof LoggerLevel {
        return Logger.minLogLevel;
    }

    set currentMinLevel(value: keyof typeof LoggerLevel) {
        Logger.minLogLevel = value;
    }

    get currentSuffix(): string {
        return Logger.suffix;
    }

    set currentSuffix(value: string) {
        Logger.suffix = value;
    }

    send() {
        this.logger.log(this.message, this.level);
    }

    readonly codeTs = `import { Logger, LoggerLevel } from '@ikilote/magma';

@Component({ ... })
export class MyComponent {
    readonly logger = inject(Logger);

    ngOnInit() {
        // Static config (set once, e.g. in AppComponent)
        Logger.minLogLevel = 'info';  // suppress messages below this level
        Logger.suffix = '[MyApp] ';   // prepend to every message

        // Shorthand methods
        this.logger.info('Server ok');
        this.logger.debug('Detail');
        this.logger.warn('Something unexpected');
        this.logger.error('Something failed');

        // Or pass the level explicitly
        this.logger.log('With level', LoggerLevel.warn, optionalExtraData);
    }
}`;
}
