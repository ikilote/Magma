import { DurationTime, addDuration } from './date';

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
export function setCookie(name: string, value: string, days = 7, path = '/') {
    const expires = addDuration(days, DurationTime.DAY);
    document.cookie = `${name}=${value}; path=${path}; expires=${expires.toUTCString()}`;
}

/**
 * Remove cookie by name
 * @param name cookie name
 * @param path path for cookie (default: `/`)
 */
export function removeCookie(name: string, path = '/') {
    document.cookie = `${name}=; path=${path}; Max-Age=0`;
}
