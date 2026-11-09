import { CookieSerializer } from './cookie-serializer';
import { Cookie } from './cookie';

describe('CookieSerializer (WP#1126)', () => {
  it('strips surrounding RFC 2109 double-quotes when deserializing empty quoted cookie user_name=""', () => {
    const cookie: Cookie = CookieSerializer.deserializeCookie('user_name=""');
    expect(cookie.key).toBe('user_name');
    expect(cookie.value).toBe('');
  });

  it('strips surrounding double-quotes when deserializing quoted username cookie', () => {
    const cookie: Cookie = CookieSerializer.deserializeCookie(' user_name="kzh2002";');
    expect(cookie.key).toBe('user_name');
    expect(cookie.value).toBe('kzh2002');
  });

  it('preserves normal unquoted cookie values and values containing =', () => {
    const cookie: Cookie = CookieSerializer.deserializeCookie('user_name=kzh2002');
    expect(cookie.key).toBe('user_name');
    expect(cookie.value).toBe('kzh2002');

    const base64Cookie: Cookie = CookieSerializer.deserializeCookie('token=abc=def==');
    expect(base64Cookie.key).toBe('token');
    expect(base64Cookie.value).toBe('abc=def==');
  });
});
