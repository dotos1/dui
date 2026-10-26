/**
 * @fileoverview Module `src/core/cookie/cookie-serializer.ts` providing cookie serializer definitions and implementation.
 * @zh 模块文件 `src/core/cookie/cookie-serializer.ts`，提供Cookieserializer相关的定义与实现。
 */

import { Cookie } from './cookie';

/**
 * Class `CookieSerializer` encapsulating cookie serializer data structures and logic in `src/core/cookie`.
 * @dynamic

 * @zh 类 `CookieSerializer`，封装 `src/core/cookie` 中的CookieSerializer数据结构与处理逻辑。
 */
export class CookieSerializer {

	/**
	 * Executes `serializeCookie` to handle serialize cookie.
	 * @zh 执行 `serializeCookie`，用于序列化Cookie。
	 * @param cookie - cookie parameter (`Cookie`) / Cookie参数（`Cookie`）
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	public static serializeCookie(cookie: Cookie): string {
		return cookie.key + '=' + cookie.value + ';';
	}

	/**
	 * Executes `serializeCookieArray` to handle serialize cookie array.
	 * @zh 执行 `serializeCookieArray`，用于序列化Cookie数组。
	 * @param cookies - cookies parameter (`Cookie[]`) / Cookie参数（`Cookie[]`）
	 * @returns Result of type `string` / 类型为 `string` 的返回值
	 */
	public static serializeCookieArray(cookies: Cookie[]): string {
		let cookiesString: string = '';
		for (const cookie of cookies) {
			const i: number = cookies.indexOf(cookie);
			if (i === 0) {
				cookiesString += CookieSerializer.serializeCookie(cookie);
			} else {
				cookiesString += ' ' + CookieSerializer.serializeCookie(cookie);
			}
		}
		return cookiesString;
	}


	/**
	 * Executes `deserializeCookie` to handle deserialize cookie.
	 * @zh 执行 `deserializeCookie`，用于反序列化Cookie。
	 * @param cookie - cookie parameter (`string`) / Cookie参数（`string`）
	 * @returns Result of type `Cookie` / 类型为 `Cookie` 的返回值
	 */
	public static deserializeCookie(cookie: string): Cookie {
		let cookieString: string = cookie.toString();
		if (cookieString.charAt(0) === ' ') {
			cookieString = cookieString.substring(1, cookieString.length);
		}
		if (cookieString.charAt(cookieString.length - 1) === ';') {
			cookieString = cookieString.substring(0, cookieString.length - 1);
		}
		const cookieKeyValue: string[] = cookieString.split('=');
		const resultCookie: Cookie = new Cookie();
		resultCookie.key = cookieKeyValue[0];
		resultCookie.value = cookieKeyValue[1];
		return resultCookie;
	}

	/**
	 * Executes `deserializeCookieArray` to handle deserialize cookie array.
	 * @zh 执行 `deserializeCookieArray`，用于反序列化Cookie数组。
	 * @param cookies - cookies parameter (`string`) / Cookie参数（`string`）
	 * @returns Result of type `Cookie[]` / 类型为 `Cookie[]` 的返回值
	 */
	public static deserializeCookieArray(cookies: string): Cookie[] {
		const cookiesSpliced: string[] = cookies.split(';');
		const cookiesArray: Cookie[] = [];

		for (const cookieString of cookiesSpliced) {
			cookiesArray.push(CookieSerializer.deserializeCookie(cookieString));
		}
		return cookiesArray;
	}
}
