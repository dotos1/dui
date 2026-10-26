/**
 * @fileoverview Module `src/core/auth/login.guard.ts` providing login guard definitions and implementation.
 * @zh 模块文件 `src/core/auth/login.guard.ts`，提供login路由守卫相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Injectable Angular service `LoginGuard` managing login guard state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `LoginGuard`，管理 `src/core/auth` 中的Login路由守卫状态与业务操作。
 */
@Injectable()
export class LoginGuard  {
  /**
   * Creates an instance of `LoginGuard` and initializes its dependencies and internal state.
   * @zh 创建 `LoginGuard` 实例，并初始化其依赖项与内部状态。
   * @param _router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param authService - Injected or initial auth service (`AuthService`) / 注入或传入的认证服务（`AuthService`）
   */
  constructor(private _router: Router, private authService: AuthService) { }
  /**
   * Executes `canActivate` to handle can activate.
   * @zh 执行 `canActivate`，用于是否可以激活。
   * @returns Result of type `Observable<boolean> | boolean` / 类型为 `Observable<boolean> | boolean` 的返回值
   */
  canActivate(): Observable<boolean> | boolean {
    return this.authService.getRegistered().pipe(
      map(
        (result: { registered?: boolean }) => {
          if (result.registered) {
            return true;
          } else{
            this._router.navigate(['/register']);
            return false;
          }
        }
      )
    )
  }
}
