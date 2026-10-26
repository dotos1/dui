/**
 * @fileoverview Module `src/core/cookie/cookie-storage.ts` providing cookie storage definitions and implementation.
 * @zh 模块文件 `src/core/cookie/cookie-storage.ts`，提供Cookie存储相关的定义与实现。
 */


import { Cookie } from './cookie';
import { CookieSerializer } from './cookie-serializer';

/**
 * Class `CookieStorage` encapsulating cookie storage data structures and logic in `src/core/cookie`.
 * @dynamic

 * @zh 类 `CookieStorage`，封装 `src/core/cookie` 中的Cookie存储数据结构与处理逻辑。
 */
export class CookieStorage {

    /**
     * Executes `isEnabled` to handle is enabled.
     * @zh 执行 `isEnabled`，用于是否为已启用。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public static isEnabled(): boolean {
        if (navigator.cookieEnabled === false) {
            return false;
        }
        document.cookie = 'test-cookie';
        return document.cookie.indexOf('test-cookie') >= 0;
    }

	/**
	 * Executes `getCookie` to handle get cookie.
	 * @zh 执行 `getCookie`，用于获取Cookie。
	 * @param cookieKey - cookie key parameter (`string`) / Cookie键参数（`string`）
	 * @returns Result of type `Cookie | undefined` / 类型为 `Cookie | undefined` 的返回值
	 */
	public static getCookie(cookieKey: string): Cookie | undefined {
          const cookies: Cookie[] = CookieStorage.getCookies();
          for (const cookie of cookies) {
              if (cookie.key === cookieKey) {
                  return cookie;
              }
          }
		        return undefined;
  }
  /**
   * Executes `getCookies` to handle get cookies.
   * @zh 执行 `getCookies`，用于获取Cookie。
   * @returns Result of type `Cookie[]` / 类型为 `Cookie[]` 的返回值
   */
  public static getCookies(): Cookie[] {
		return CookieSerializer.deserializeCookieArray(document.cookie);
   }
  /**
   * Executes `addCookie` to handle add cookie.
   * @zh 执行 `addCookie`，用于添加Cookie。
   * @param cookie - cookie parameter (`Cookie`) / Cookie参数（`Cookie`）
   */
  public static addCookie(cookie: Cookie): void {
		document.cookie = CookieSerializer.serializeCookie(cookie);
  }
   /**
    * Executes `addCookies` to handle add cookies.
    * @zh 执行 `addCookies`，用于添加Cookie。
    * @param cookies - cookies parameter (`Cookie[]`) / Cookie参数（`Cookie[]`）
    */
   public static addCookies(cookies: Cookie[]): void {
          for (const cookie of cookies) {
              CookieStorage.addCookie(cookie);
          }
   }
	/**
	 * Executes `removeCookie` to handle remove cookie.
	 * @zh 执行 `removeCookie`，用于移除Cookie。
	 * @param cookieKey - cookie key parameter (`string | Cookie`) / Cookie键参数（`string | Cookie`）
	 */
	public static removeCookie(cookieKey: string | Cookie): void {
		if (cookieKey.constructor === Cookie) {
			return CookieStorage.removeCookie((cookieKey as Cookie).key);
		}
		document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

   /**
    * Executes `hasCookie` to handle has cookie.
    * @zh 执行 `hasCookie`，用于是否包含Cookie。
    * @param cookieKey - cookie key parameter (`string | Cookie`) / Cookie键参数（`string | Cookie`）
    * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
    */
   public static hasCookie(cookieKey: string | Cookie): boolean {
      if (cookieKey.constructor === Cookie) {
                return CookieStorage.hasCookie((cookieKey as Cookie).key);
      }
	     for (const cookie of CookieStorage.getCookies()) {
				if (cookie.key === cookieKey) {
					return true;
				}
	}
	     return false;
   }
}
