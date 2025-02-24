export function randomNumber(size: number = 9) {
    return `${Math.round(Math.random() * Math.pow(10, size))}`.padStart(size, '0');
}
