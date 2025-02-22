export function randomNumber() {
    return `${Math.round(Math.random() * 999_999_999)}`.padStart(9, '0');
}
