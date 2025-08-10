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
