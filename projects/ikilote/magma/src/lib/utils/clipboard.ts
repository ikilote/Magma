/**
 * Write a string to the system clipboard using the Clipboard API.
 *
 * @param text Text to copy to the clipboard.
 * @returns A promise that resolves when the text has been written, or rejects if the operation fails.
 */
export function clipboardWrite(text: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        navigator.clipboard.writeText(text).then(
            () => {
                resolve();
            },
            () => {
                reject();
            },
        );
    });
}
