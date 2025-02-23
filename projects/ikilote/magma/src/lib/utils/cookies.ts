/**
 * get cookie by name
 * @param name cookie name
 * @returns value
 */
export function getCookie<T extends string>(name: string): T | undefined {
    const cookies = document.cookie;
    const parts = cookies.match(`(?!; )?${name}=([^;]*);?`);
    return parts ? (parts[1] as T) : undefined;
}

/**
 * set a cookie by name
 * @param name cookie name
 * @param value value
 * @param days expire in day (default: 7)
 * @param path path for cookie (default: `/`)
 */
export function setCookie(name: string, value: string, days: number = 7, path: string = '/') {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; path=${path}; expires=${date.toUTCString()}`;
}

/**
 * Remove cookie by name
 * @param name cookie name
 * @param path path for cookie (default: `/`)
 */
export function removeCookie(name: string, path: string = '/') {
    document.cookie = `${name}=; path=${path}; Max-Age=0`;
}
