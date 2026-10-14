

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CookieService {

    /**
     * Checks if cookies are enabled.
     * @returns True if enabled, false otherwise
     */
    isEnabled(): boolean {
        // for certain scenarios Chrome may say 'true' but have cookies still disabled
        if (navigator.cookieEnabled === false) {
            return false;
        }

        document.cookie = 'test-cookie';
        return document.cookie.indexOf('test-cookie') >= 0;
    }

    /**
     * Retrieves a cookie by its key.
     * @param key Key to identify the cookie
     * @returns The cookie data or null if it is not found
     */
    getItem(key: string): string | null {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexp = new RegExp('(?:^|;\\s*)' + escapedKey + '=(.*?)(?:;|$)');
        const result = regexp.exec(document.cookie);
        return (result === null) ? null : result[1];
    }

    /**
     * Sets a cookie.
     * @param key Key to identify the cookie
     * @param data Data value to set for the cookie
     * @param expiration Expiration date of the data
     * @param path "Pathname" to store the cookie
     */
    setItem(key: string, data: string, expiration: Date | null, path: string | null): void {
        document.cookie = `${key}=${data}` +
            (expiration ? ';expires=' + expiration.toUTCString() : '') +
            (path ? `;path=${path}` : ';path=/');
    }

    /** Placeholder for testing purposes - do not use. */
    clear() {
        /* placeholder for testing purposes */
    }
}
