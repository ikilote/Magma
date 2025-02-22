export function normalizeString(string: string) {
    return string
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
}
