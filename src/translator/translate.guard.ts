/**
 * @fileoverview Module `src/translator/translate.guard.ts` providing translate guard definitions and implementation.
 * @zh 模块文件 `src/translator/translate.guard.ts`，提供翻译路由守卫相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from './translate.service';

/**
 * Injectable Angular service `TranslateGuard` managing translate guard state and operations in `src/translator`.
 * @zh 可注入的 Angular 服务 `TranslateGuard`，管理 `src/translator` 中的翻译路由守卫状态与业务操作。
 */
@Injectable()
export class TranslateGuard  {
  /**
   * Creates an instance of `TranslateGuard` and initializes its dependencies and internal state.
   * @zh 创建 `TranslateGuard` 实例，并初始化其依赖项与内部状态。
   * @param _router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param translateService - Injected or initial translate service (`TranslateService`) / 注入或传入的翻译服务（`TranslateService`）
   */
  constructor(private _router: Router, private translateService: TranslateService) { }
  /**
   * Executes `canActivate` to handle can activate.
   * @zh 执行 `canActivate`，用于是否可以激活。
   * @returns Result of type `boolean | Observable<boolean>` / 类型为 `boolean | Observable<boolean>` 的返回值
   */
  canActivate(): Observable<boolean> | boolean {
    return this.translateService.loadingTranslations.pipe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(result => {
          return true;
        }
      )
    )
  }
}
