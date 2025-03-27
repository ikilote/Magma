import Bowser from 'bowser';

export function jsonCopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
}

export class ExceptionJsonParse extends Error {
    override cause: string;
    constructor(message: string, cause: string) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = 'ExceptionJsonParse';
        this.cause = cause;
    }
}

/**
 * parse JSON
 * @param value parse string
 * @returns json
 * @throw SyntaxError with position formatted in cause
 */
export function jsonParse<T>(value: string): T | undefined {
    try {
        return JSON.parse(value);
    } catch (error) {
        const message = (error as any).message.match(/[^\n]+/)[0];
        let textPosition = '';
        if (error instanceof SyntaxError) {
            const browser = Bowser.parse(window.navigator.userAgent);
            if (browser.engine.name === 'Blink') {
                if (message.match(/at position/)) {
                    const position = parseInt(message.match(/at position (\d+)/)[1], 10);
                    const lines = value.split(/\n/);
                    let l = 1;
                    for (const line of lines) {
                        if (line) {
                            if (l + line.length >= position) {
                                textPosition = line + '\n' + ' '.repeat(position - l + 1) + '^';
                                break;
                            }
                            l += line.length + 1;
                        }
                    }
                }
            } else if (browser.engine.name === 'Gecko') {
                if (message.match(/at line/)) {
                    const [, line, column] = message.match(/at line (\d+) column (\d+)/);
                    const lines = value.split(/\n/);
                    if (lines[+line - 1]) {
                        textPosition = lines[+line - 1] + '\n' + ' '.repeat(+column - 1) + '^';
                    }
                }
            } else if (browser.engine.name === 'WebKit') {
                const [, pos] = message.match(/.*JSON Parse error: (.*)/);
                if (pos) {
                    textPosition = pos;
                }
            }
        }
        throw new ExceptionJsonParse(message, textPosition);
    }
}
