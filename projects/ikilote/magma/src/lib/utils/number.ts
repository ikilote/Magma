/**
 * return a value number string with a fix size
 * @param size value between 1 and 16 (default: 9)
 * @returns a string number
 */
export function randomNumber(size: number = 9) {
    const limit = Math.max(Math.min(size, 16), 1);
    return `${Math.trunc(Math.random() * Math.pow(10, limit))}`.padStart(limit, '0');
}
