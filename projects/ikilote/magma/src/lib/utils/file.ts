export function downloadFile(content: string, fileName: string, contentType?: string) {
    var a = document.createElement('a');
    if (content.startsWith('data:')) {
        a.href = content;
    } else {
        var file = new Blob([content], contentType ? { type: contentType } : undefined);
        a.href = URL.createObjectURL(file);
    }
    a.download = fileName;
    a.click();
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

export function ulrToBase64(url: string): Promise<string | ArrayBuffer | null> {
    return new Promise<string | ArrayBuffer | null>(async (resolve, reject) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'omit',
                mode: 'cors', // Chromium
                headers: {
                    'Sec-Fetch-Dest': 'image',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-site',
                },
            });
            if (response.status === 200) {
                const imageBlob = await response.blob();

                var reader = new FileReader();
                reader.readAsDataURL(imageBlob);
                reader.onloadend = function () {
                    const base64data = reader.result;
                    if (base64data instanceof ArrayBuffer) {
                        resolve(base64data);
                    } else if (base64data) {
                        // fix typemine
                        resolve(base64data.replace('data:application/octet-stream;base64,', 'data:image/webp;base64,'));
                    } else {
                        reject('Image error');
                    }
                    resolve(base64data);
                };
                reader.onerror = () => {
                    reject('Image error');
                };
            } else {
                reject('HTTP-Error: ' + response.status);
            }
        } catch (e) {
            reject('HTTP-Error: CORS');
        }
    });
}

/**
 * remove accents, case and characters and  `\:*?"<>` symbols
 * @param string text with accents, case and symbols
 * @param limit text with accents, case and symbols
 * @returns text without accents, case and symbols
 */
export function normalizeFileName(string: string, limit: number = 200) {
    return string
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\p{Diacritic}\/|\\:*?"<>]/gu, '')
        .substring(0, limit);
}
