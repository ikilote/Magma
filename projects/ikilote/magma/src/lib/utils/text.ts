/**
 * remove accents and case
 * @param string text with accents
 * @returns text without accents
 */
export function normalizeString(string: string) {
    return string
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
}

/**
 * Interprets common escape sequences in a string and replaces them with
 * their actual characters.
 *
 * Supported sequences: `\n`, `\r`, `\t`, `\v`, `\f`, `\b`, `\\`, `\"`, `\'`,
 * `` \` ``, `\uXXXX` (Unicode code point), and `\xXX` (hex byte).
 *
 * @example
 * unescapedString('Hello\\nWorld') // → 'Hello\nWorld'
 *
 * @param str Source string containing escape sequences.
 * @returns String with all recognised escape sequences replaced by their characters.
 */
export function unescapedString(str: string) {
    return str.replace(/\\([nrtvfb\\"'`]|u[0-9a-f]{4}|x[0-9a-f]{2})/gi, (_match, code: string) => {
        const str = code.toLocaleLowerCase() as 'n' | 'r' | 't' | 'v' | 'f' | 'b';
        return String.fromCharCode(
            str.startsWith('u')
                ? parseInt(str.substring(1), 16)
                : str.startsWith('x')
                  ? parseInt(str.substring(1), 16)
                  : { n: 10, r: 13, t: 9, v: 11, f: 12, b: 8 }[str] || str.charCodeAt(0),
        );
    });
}
