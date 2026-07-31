import { JwtHelperService } from './jwt-helper.service';

/** 用给定 payload 拼一个结构合法的 JWT（签名部分未使用，填占位符即可）。 */
function makeToken(payload: object): string {
  const base64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'none' })}.${base64url(payload)}.signature`;
}

class FakeStorage {
  private store: Record<string, string> = {};
  get(key: string): string {
    return this.store[key];
  }
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
