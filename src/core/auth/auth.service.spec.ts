/**
 * @fileoverview Module `src/core/auth/auth.service.spec.ts` providing auth service spec definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth.service.spec.ts`，提供认证服务spec相关的定义与实现。
 */

import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * b8c5e5c 复核:OAuth 登录失败 onLogin 只发一次,且原样透传 {type, reason}
 * (主应用 login.component 按 type/reason 判断 2FA 等)。
 */
describe('AuthService.login OAuth 失败(b8c5e5c 复核)', () => {
  it('onLogin 只发一次并透传 type/reason', async () => {
    const self: any = Object.create(AuthService.prototype);
    self.onLogin = new Subject<any>();
    self.isCredentialValid = () => true;
    self.isOauth = () => true;
    self.oauth2Auth = { login: () => Promise.reject({ type: 'unauthorized', reason: 'TWO_FA_REQUIRED' }) };
    self.config = { setSetting: () => {} };
    const got: any[] = [];
    self.onLogin.subscribe((v: any) => got.push(v));
    self.login('u', 'p', 't');
    await new Promise((r) => setTimeout(r, 10));
    expect(got.length).toBe(1);
    expect(got[0].type).toBe('unauthorized');
    expect(got[0].reason).toBe('TWO_FA_REQUIRED');
  });
});
