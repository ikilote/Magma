export function downloadFile(content: string | Blob, fileName: string, contentType?: string) {
    const a = document.createElement('a');
    if (content instanceof Blob) {
        a.href = URL.createObjectURL(content);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    } else if (content.startsWith('data:')) {
        a.href = content;
        a.download = fileName;
        a.click();
    } else {
        const file = new Blob([content], contentType ? { type: contentType } : undefined);
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }
    return a;
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read blob as base64'));
        reader.readAsDataURL(blob);
    });
}

export async function ulrToBase64(url: string): Promise<string | ArrayBuffer> {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'omit',
        mode: 'cors', // Chromium
        headers: {
            'Sec-Fetch-Dest': 'image',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
        },
    }).catch(() => {
        throw new Error('HTTP-Error: CORS');
    });

    if (response.status !== 200) {
        throw new Error('HTTP-Error: ' + response.status);
    }

    const imageBlob = await response.blob();

    return new Promise<string | ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            const base64data = reader.result;
            if (base64data instanceof ArrayBuffer) {
                resolve(base64data);
            } else if (base64data) {
                resolve(base64data.replace('data:application/octet-stream;base64,', 'data:image/webp;base64,'));
            } else {
                reject(new Error('Image error: FileReader returned null'));
            }
        };
        reader.onerror = () => {
            reject(new Error('Image error: FileReader failed'));
        };
    });
}

/**
 * remove accents, case and all non-ASCII characters and `\:*?"<>` symbols
 *
 * @example 'Café_Été_日本語_Привет_😊' => 'cafe_ete___'
 * @param string source text
 * @param limit max size
 * @returns text formatted
 */
export function normalizeFileName(string: string, limit = 200) {
    return (
        string
            .toLocaleLowerCase()
            .normalize('NFD') // Decompose accented characters
            .replace(/\p{Diacritic}/gu, '') // Remove diacritics
            .replace(/[/|\\:*?"<>]/g, '') // Remove forbidden filename characters
            // The point of this pass is to strip non-ASCII, control characters included.
            // eslint-disable-next-line no-control-regex
            .replace(/[^\x00-\x7F]/g, '_') // Replace remaining non-ASCII characters with underscore
            .replace(/_+/g, '_') // Collapse consecutive underscores
            .substring(0, limit)
    );
}
