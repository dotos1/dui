/**
 * @fileoverview Module `src/core/auth/register.guard.ts` providing register guard definitions and implementation.
 * @zh 模块文件 `src/core/auth/register.guard.ts`，提供注册路由守卫相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Injectable Angular service `RegisterGuard` managing register guard state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `RegisterGuard`，管理 `src/core/auth` 中的注册路由守卫状态与业务操作。
 */
@Injectable()
export class RegisterGuard  {
  /**
   * Creates an instance of `RegisterGuard` and initializes its dependencies and internal state.
   * @zh 创建 `RegisterGuard` 实例，并初始化其依赖项与内部状态。
   * @param _router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param authService - Injected or initial auth service (`AuthService`) / 注入或传入的认证服务（`AuthService`）
   */
  constructor(private _router: Router, private authService: AuthService) { }
  /**
   * Executes `canActivate` to handle can activate.
   * @zh 执行 `canActivate`，用于是否可以激活。
   * @returns Result of type `boolean | Observable<boolean>` / 类型为 `boolean | Observable<boolean>` 的返回值
   */
  canActivate(): Observable<boolean> | boolean {
    return this.authService.getRegistered().pipe(
      map(
        (result: { registered?: boolean }) => {
          if (result.registered) {
            this._router.navigate(['/login']);
            return false;
          } else{
            return true;
          }
        }
      )
    )
  }
}
