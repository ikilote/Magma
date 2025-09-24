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
