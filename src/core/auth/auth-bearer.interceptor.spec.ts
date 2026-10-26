/**
 * @fileoverview Module `src/core/auth/auth-bearer.interceptor.spec.ts` providing auth bearer interceptor spec definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth-bearer.interceptor.spec.ts`，提供认证bearer拦截器spec相关的定义与实现。
 */

import { HttpHandler, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthBearerInterceptor } from './auth-bearer.interceptor';

/**
 * Class `FakeStorage` encapsulating fake storage data structures and logic in `src/core/auth`.
 * @zh 类 `FakeStorage`，封装 `src/core/auth` 中的Fake存储数据结构与处理逻辑。
 */
class FakeStorage {
  /**
   * Creates an instance of `FakeStorage` and initializes its dependencies and internal state.
   * @zh 创建 `FakeStorage` 实例，并初始化其依赖项与内部状态。
   * @param token - Injected or initial token (`string | null`) / 注入或传入的令牌（`string | null`）
   */
  constructor(private token: string | null = 'tok123') {}
  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @param _key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  get(_key: string): string {
    return this.token;
  }
}

/**
 * 记录最终发出的请求，便于断言 Authorization 头。
 * @zh 记录最终发出的请求，便于断言 Authorization 头。
 */
function captureHandler(): { handler: HttpHandler; seen: () => HttpRequest<any> } {
  let captured: HttpRequest<any>;
  return {
    handler: { handle: (req: HttpRequest<any>) => { captured = req; return of(null as any); } },
    seen: () => captured
  };
}

/**
 * Executes `get` to handle get.
 * @zh 执行 `get`，用于获取。
 * @param url - url parameter (`string`) / 链接地址参数（`string`）
 * @returns Result of type `HttpRequest<any>` / 类型为 `HttpRequest<any>` 的返回值
 */
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

  // b8c5e5c 复核:只信任同源、同主机不同端口、以及配置里的认证 / IM 主机。
  describe('发往其他主机', () => {
    const here = location.hostname;   // karma 页面所在主机

    it('协议相对地址 //evil.example.com 不带 token', () => {
      expect(authHeaderFor('//evil.example.com/steal')).toBeNull();
    });
    it('无关主机不带 token', () => {
      expect(authHeaderFor('https://evil.example.com/steal')).toBeNull();
    });
    it('不再无条件信任 localhost / 127.0.0.1', () => {
      const other = here === '127.0.0.1' ? 'localhost' : '127.0.0.1';
      expect(authHeaderFor(`http://${other}:5000/x`)).toBeNull();
    });
    it('同主机不同端口(开发时 4200 → 8000)带 token', () => {
      expect(authHeaderFor(`http://${here}:8000/api/x`)).toBe('Bearer tok123');
    });
    it('配置里的 IM / 认证主机带 token(dotos-auth 的 /admin/** 要 Bearer)', () => {
      const config = { getSettings: (k: string) => k === 'system' ? { IMurl: 'auth.dotos.com' }
        : k === 'oauth2' ? { host: 'https://sso.dotos.com' } : undefined };
      const injector: any = { get: () => config };
      interceptor = new (AuthBearerInterceptor as any)(new FakeStorage(), injector);
      expect(authHeaderFor('https://auth.dotos.com:443/admin/user')).toBe('Bearer tok123');
      expect(authHeaderFor('https://sso.dotos.com/userinfo')).toBe('Bearer tok123');
      expect(authHeaderFor('https://evil.dotos.com/x')).toBeNull();
    });
  });
});
