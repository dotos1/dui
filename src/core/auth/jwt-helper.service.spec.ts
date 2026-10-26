/**
 * @fileoverview Module `src/core/auth/jwt-helper.service.spec.ts` providing jwt helper service spec definitions and implementation.
 * @zh 模块文件 `src/core/auth/jwt-helper.service.spec.ts`，提供jwt辅助工具服务spec相关的定义与实现。
 */

import { JwtHelperService } from './jwt-helper.service';

/**
 * 用给定 payload 拼一个结构合法的 JWT（签名部分未使用，填占位符即可）。
 * @zh 用给定 payload 拼一个结构合法的 JWT（签名部分未使用，填占位符即可）。
 */
function makeToken(payload: object): string {
  const base64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'none' })}.${base64url(payload)}.signature`;
}

/**
 * Class `FakeStorage` encapsulating fake storage data structures and logic in `src/core/auth`.
 * @zh 类 `FakeStorage`，封装 `src/core/auth` 中的Fake存储数据结构与处理逻辑。
 */
class FakeStorage {
  /**
   * Property `store` (`Record<string, string>`) storing store (default: `{}`).
   * @zh 属性 `store`（类型：`Record<string, string>`），用于存储或配置状态仓库（默认值：`{}`）。
   */
  private store: Record<string, string> = {};
  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  get(key: string): string {
    return this.store[key];
  }
  /**
   * Executes `set` to handle set.
   * @zh 执行 `set`，用于集合。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  set(key: string, value: string): void {
    this.store[key] = value;
  }
}

describe('JwtHelperService', () => {
  let storage: FakeStorage;
  let service: JwtHelperService;

  beforeEach(() => {
    storage = new FakeStorage();
    service = new JwtHelperService(storage as any);
  });

  describe('decodeToken', () => {
    it('解析出 payload', () => {
      expect(service.decodeToken(makeToken({ sub: 'u1' }))).toEqual({ sub: 'u1' });
    });

    it('段数不为 3 时抛错', () => {
      expect(() => service.decodeToken('not.ajwt')).toThrowError('JWT must have 3 parts');
    });
  });

  describe('getRealmRoles', () => {
    it('返回 realm_access.roles', () => {
      storage.set('access_token', makeToken({ realm_access: { roles: ['admin'] } }));
      expect(service.getRealmRoles()).toEqual(['admin']);
    });

    it('缺少 realm_access 时返回空数组而非抛错', () => {
      storage.set('access_token', makeToken({ sub: 'u1' }));
      expect(service.getRealmRoles()).toEqual([]);
    });
  });

  describe('getClientRoles', () => {
    it('返回指定 client 的 roles', () => {
      storage.set('access_token', makeToken({ resource_access: { app: { roles: ['editor'] } } }));
      expect(service.getClientRoles('app')).toEqual(['editor']);
    });

    // 回归：此前 resource_access 缺失时会 `undefined[clientName]` 抛 TypeError，
    // 异常从路由守卫冒泡出去会让整个导航失败。
    it('缺少 resource_access 时返回空数组而非抛 TypeError', () => {
      storage.set('access_token', makeToken({ sub: 'u1' }));
      expect(() => service.getClientRoles('app')).not.toThrow();
      expect(service.getClientRoles('app')).toEqual([]);
    });

    it('client 不在 resource_access 中时返回空数组', () => {
      storage.set('access_token', makeToken({ resource_access: { other: { roles: ['x'] } } }));
      expect(service.getClientRoles('app')).toEqual([]);
    });
  });

  describe('hasRealmRole / hasClientRole', () => {
    it('无 token 时一律返回 false', () => {
      expect(service.hasRealmRole('admin')).toBe(false);
      expect(service.hasClientRole('app', 'editor')).toBe(false);
    });

    it('命中与未命中', () => {
      storage.set('access_token', makeToken({ realm_access: { roles: ['admin'] } }));
      expect(service.hasRealmRole('admin')).toBe(true);
      expect(service.hasRealmRole('nobody')).toBe(false);
    });
  });

  describe('hasRealmRoles / hasRealmRolesForClientRole', () => {
    beforeEach(() => {
      storage.set('access_token', makeToken({ realm_access: { roles: ['admin'] } }));
    });

    // 回归：路由只配了 clientRoles 没配 roles 时，rolesToCheck 为 undefined，
    // 此前会在 `rolesToCheck.some(...)` 抛 TypeError。
    it('rolesToCheck 为 undefined 时返回 false 而非抛错', () => {
      expect(() => service.hasRealmRoles(undefined)).not.toThrow();
      expect(service.hasRealmRoles(undefined)).toBe(false);
      expect(() => service.hasRealmRolesForClientRole('app', undefined)).not.toThrow();
      expect(service.hasRealmRolesForClientRole('app', undefined)).toBe(false);
    });

    it('任一角色命中即为 true', () => {
      expect(service.hasRealmRoles(['nobody', 'admin'])).toBe(true);
      expect(service.hasRealmRoles(['nobody'])).toBe(false);
    });
  });

  // 回归：存储中的 token 可能被用户篡改，解析失败不应让调用方崩溃。
  describe('token 损坏', () => {
    it('非法 token 时按“无此声明”处理', () => {
      storage.set('access_token', 'garbage-not-a-jwt');
      expect(() => service.getRealmRoles()).not.toThrow();
      expect(service.getRealmRoles()).toEqual([]);
      expect(service.hasRealmRole('admin')).toBe(false);
    });
  });
});
