import { Cookie } from './cookie';

/**
 * @dynamic
 */
export class CookieSerializer {

	public static serializeCookie(cookie: Cookie): string {
		return cookie.key + '=' + cookie.value + ';';
	}

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

	public static deserializeCookieArray(cookies: string): Cookie[] {
		const cookiesSpliced: string[] = cookies.split(';');
		const cookiesArray: Cookie[] = [];

		for (const cookieString of cookiesSpliced) {
			cookiesArray.push(CookieSerializer.deserializeCookie(cookieString));
		}
		return cookiesArray;
	}
}
