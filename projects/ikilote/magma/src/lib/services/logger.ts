import { Injectable } from '@angular/core';

export enum LoggerLevel {
    log,
    info,
    debug,
    warn,
    error,
}

/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class Logger {
    static minLogLevel = 'info';
    static suffix = '';

    log(value: string, level: LoggerLevel = LoggerLevel.log, ...values: any[]) {
        if (level < (LoggerLevel as any)[Logger.minLogLevel || 'info'] || 0) {
            return;
        }

        switch (level) {
            case LoggerLevel.log:
                console.log(Logger.suffix + value, ...values);
                break;
            case LoggerLevel.info:
                console.info(Logger.suffix + value, ...values);
                break;
            case LoggerLevel.debug:
                console.debug(Logger.suffix + value, ...values);
                break;
            case LoggerLevel.warn:
                console.warn(Logger.suffix + value, ...values);
                break;
            case LoggerLevel.error:
                console.error(Logger.suffix + value, ...values);
                break;
        }
    }

    error(value: string, ...values: any[]) {
        this.log(value, LoggerLevel.error, ...values);
    }

    info(value: string, ...values: any[]) {
        this.log(value, LoggerLevel.info, ...values);
    }

    debug(value: string, ...values: any[]) {
        this.log(value, LoggerLevel.debug, ...values);
    }

    warn(value: string, ...values: any[]) {
        this.log(value, LoggerLevel.warn, ...values);
    }
}
