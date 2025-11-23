import { Logger, LoggerLevel } from './logger';

describe('Logger', () => {
    let logger: Logger;
    let consoleSpy: jasmine.SpyObj<Console>;

    beforeEach(() => {
        logger = new Logger();
        consoleSpy = jasmine.createSpyObj('console', ['log', 'info', 'debug', 'warn', 'error']);
        spyOn(console, 'log').and.callFake(consoleSpy.log);
        spyOn(console, 'info').and.callFake(consoleSpy.info);
        spyOn(console, 'debug').and.callFake(consoleSpy.debug);
        spyOn(console, 'warn').and.callFake(consoleSpy.warn);
        spyOn(console, 'error').and.callFake(consoleSpy.error);
    });

    afterEach(() => {
        Logger.minLogLevel = 'info';
        Logger.suffix = '';
    });

    // Log level filtering
    describe('log level filtering', () => {
        it('should log with the default level', () => {
            Logger.minLogLevel = 'log';
            logger.log('test');
            expect(console.log).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('test');
        });

        it('should log if level is above or equal to minLogLevel', () => {
            Logger.minLogLevel = 'log';
            logger.log('test', LoggerLevel.log);

            expect(console.log).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('test');
        });

        it('should log if level is above or equal to minLogLevel', () => {
            Logger.minLogLevel = 'warn';
            logger.log('test', LoggerLevel.warn);
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledWith('test');
            expect(console.info).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should log error regardless of minLogLevel if minLogLevel is not set', () => {
            Logger.minLogLevel = undefined as any;
            logger.log('test', LoggerLevel.error);
            expect(console.error).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('test');
        });
    });

    // Log methods
    describe('log methods', () => {
        it('should call console.info for LoggerLevel.info', () => {
            logger.info('test');
            expect(console.info).toHaveBeenCalledWith('test');
        });

        it('should call console.debug for LoggerLevel.debug', () => {
            Logger.minLogLevel = 'debug';
            logger.debug('test');
            expect(console.debug).toHaveBeenCalledWith('test');
        });

        it('should call console.warn for LoggerLevel.warn', () => {
            logger.warn('test');
            expect(console.warn).toHaveBeenCalledWith('test');
        });

        it('should call console.error for LoggerLevel.error', () => {
            logger.error('test');
            expect(console.error).toHaveBeenCalledWith('test');
        });
    });

    // Suffix handling
    describe('suffix handling', () => {
        it('should prepend the suffix to the log message', () => {
            Logger.suffix = '[TEST] ';
            logger.log('test', LoggerLevel.warn);
            expect(console.warn).toHaveBeenCalledWith('[TEST] test');
        });

        it('should prepend the suffix to the log message with additional values', () => {
            Logger.suffix = '[TEST] ';
            logger.log('test', LoggerLevel.warn, 1, 2, 3);
            expect(console.warn).toHaveBeenCalledWith('[TEST] test', 1, 2, 3);
        });
    });

    // Convenience methods
    describe('convenience methods', () => {
        it('should call log with LoggerLevel.error for error()', () => {
            logger.error('test');
            expect(console.error).toHaveBeenCalledWith('test');
        });

        it('should call log with LoggerLevel.info for info()', () => {
            logger.info('test');
            expect(console.info).toHaveBeenCalledWith('test');
        });

        it('should call log with LoggerLevel.debug for debug()', () => {
            Logger.minLogLevel = 'debug';
            logger.debug('test');
            expect(console.debug).toHaveBeenCalledWith('test');
        });

        it('should not call log with LoggerLevel.error for debug()', () => {
            Logger.minLogLevel = 'error';
            logger.debug('test');
            expect(console.debug).not.toHaveBeenCalled();
        });

        it('should call log with LoggerLevel.warn for warn()', () => {
            logger.warn('test');
            expect(console.warn).toHaveBeenCalledWith('test');
        });
    });
});
