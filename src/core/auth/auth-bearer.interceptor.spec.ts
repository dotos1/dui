import { HttpHandler, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthBearerInterceptor } from './auth-bearer.interceptor';

class FakeStorage {
  constructor(private token: string | null = 'tok123') {}
  get(_key: string): string {
    return this.token;
  }
}

/** 记录最终发出的请求，便于断言 Authorization 头。 */
function captureHandler(): { handler: HttpHandler; seen: () => HttpRequest<any> } {
  let captured: HttpRequest<any>;
  return {
    handler: { handle: (req: HttpRequest<any>) => { captured = req; return of(null as any); } },
    seen: () => captured
  };
}

function get(url: string): HttpRequest<any> {
  return new HttpRequest('GET', url);
}

describe('AuthBearerInterceptor', () => {
  let interceptor: AuthBearerInterceptor;

  beforeEach(() => {
    interceptor = new AuthBearerInterceptor(new FakeStorage() as any);
  });

  function authHeaderFor(url: string): string | null {
    const { handler, seen } = captureHandler();
    interceptor.intercept(get(url), handler).subscribe();
    return seen().headers.get('Authorization');
  }

  it('给普通业务请求加上 Bearer 头', () => {
    expect(authHeaderFor('/api/users')).toBe('Bearer tok123');
  });

  it('无 token 时不加 Authorization 头（而非发出 "Bearer null"）', () => {
    interceptor = new AuthBearerInterceptor(new FakeStorage(null) as any);
    expect(authHeaderFor('/api/users')).toBeNull();
  });

  describe('排除列表', () => {
    ['/auth/realms/x', '/oauth2/token', '/login/config', '/register',
     '/checklogin', '/assets/i18n/zh.json', '/wallpapers'].forEach(url => {
      it(`${url} 不带 token`, () => {
        expect(authHeaderFor(url)).toBeNull();
      });
    });

    // 回归：模式串此前被当正则用，`.json` 中的 `.` 是通配符，
    // 会把 /api/vjson 这类正常业务地址误判为无需鉴权。
    it('".json" 按字面量匹配，不再误伤 /api/vjson', () => {
      expect(authHeaderFor('/api/vjson')).toBe('Bearer tok123');
      expect(authHeaderFor('/api/data.json')).toBeNull();
    });

    // 回归：此前用 `g` 标志的正则被复用时，lastIndex 残留会让 .test() 交替返回 true/false。
    it('同一个 URL 连续判定结果稳定', () => {
      for (let i = 0; i < 4; i++) {
        expect(authHeaderFor('/assets/i18n/zh.json')).toBeNull();
        expect(authHeaderFor('/api/users')).toBe('Bearer tok123');
      }
    });
  });
});
