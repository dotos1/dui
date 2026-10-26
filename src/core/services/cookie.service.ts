/**
 * @fileoverview Module `src/core/services/cookie.service.ts` providing cookie service definitions and implementation.
 * @zh 模块文件 `src/core/services/cookie.service.ts`，提供Cookie服务相关的定义与实现。
 */



import { Injectable } from '@angular/core';

/**
 * Injectable Angular service `CookieService` managing cookie service state and operations in `src/core/services`.
 * @zh 可注入的 Angular 服务 `CookieService`，管理 `src/core/services` 中的Cookie服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class CookieService {

    /**
     * Checks if cookies are enabled.
     * @returns True if enabled, false otherwise

     * @zh 执行 `isEnabled`，用于是否为已启用。
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

     * @zh 执行 `getItem`，用于获取条目。
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

     * @zh 执行 `setItem`，用于集合条目。
     */
    setItem(key: string, data: string, expiration: Date | null, path: string | null): void {
        document.cookie = `${key}=${data}` +
            (expiration ? ';expires=' + expiration.toUTCString() : '') +
            (path ? `;path=${path}` : ';path=/');
    }

    /**
     * Placeholder for testing purposes - do not use.
     * @zh 执行 `clear`，用于清空。
     */
    clear() {
        /* placeholder for testing purposes */
    }
}
