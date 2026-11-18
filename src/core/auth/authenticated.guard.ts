/**
 * @fileoverview Module `src/core/auth/authenticated.guard.ts` providing authenticated guard definitions and implementation.
 * @zh 模块文件 `src/core/auth/authenticated.guard.ts`，提供authenticated路由守卫相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CookieStorage } from '@dotos1/dui/core/cookie';

import { AuthService } from './auth.service';
import { LocalStorageService } from '@dotos1/dui/core/storage';
/**
 * Injectable Angular service `AuthenticatedGuard` managing authenticated guard state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `AuthenticatedGuard`，管理 `src/core/auth` 中的Authenticated路由守卫状态与业务操作。
 */
@Injectable()
export class AuthenticatedGuard  {
  /**
   * Creates an instance of `AuthenticatedGuard` and initializes its dependencies and internal state.
   * @zh 创建 `AuthenticatedGuard` 实例，并初始化其依赖项与内部状态。
   * @param _router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param storage - Injected or initial storage (`LocalStorageService`) / 注入或传入的存储（`LocalStorageService`）
   * @param authService - Injected or initial auth service (`AuthService`) / 注入或传入的认证服务（`AuthService`）
   */
  constructor(private _router: Router,
    public storage: LocalStorageService,
    private authService: AuthService) { }
  /**
   * Executes `canActivate` to handle can activate.
   * @zh 执行 `canActivate`，用于是否可以激活。
   * @returns Result of type `boolean | Observable<boolean>` / 类型为 `boolean | Observable<boolean>` 的返回值
   */
  canActivate(): Observable<boolean> | boolean {
    return this.authService.getAuthenticated().pipe(
      map(
        (result: { authenticated?: boolean }) => {
          if (result.authenticated) {
            return true;
          } else {
            if (CookieStorage.hasCookie('user_id')) {
              this.storage.remove('access_token');
              this.storage.remove('access_token_expires_in');
              this.storage.remove('access_token_stored_at');
              if (this.authService.oauth2Auth) {
                this.authService.oauth2Auth.setToken(null, null);
              }
              this._router.navigate(['/lock', this._router.url]);
            } else {
              this._router.navigate(['/login']);
            }
            return false;
          }
        },
      ),
      catchError((e: { status? }) => {
        if(e.status==401||e.status==400){
          this.storage.remove('access_token');
          this.storage.remove('access_token_expires_in');
          this.storage.remove('access_token_stored_at');
          if (this.authService.oauth2Auth) {
            this.authService.oauth2Auth.setToken(null, null);
          }
          this._router.navigate(['/lock', this._router.url]);
        }else{
          this._router.navigate(['/maintenance', document.URL]);
        }
        return of(false);
      })
    );
  }
}
