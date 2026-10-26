/**
 * @fileoverview Module `src/core/meta/meta.guard.ts` providing meta guard definitions and implementation.
 * @zh 模块文件 `src/core/meta/meta.guard.ts`，提供元数据路由守卫相关的定义与实现。
 */

// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MetaService } from './meta.service';

/**
 * Injectable Angular service `MetaGuard` managing meta guard state and operations in `src/core/meta`.
 * @zh 可注入的 Angular 服务 `MetaGuard`，管理 `src/core/meta` 中的元数据路由守卫状态与业务操作。
 */
@Injectable()
export class MetaGuard  {
  /**
   * Creates an instance of `MetaGuard` and initializes its dependencies and internal state.
   * @zh 创建 `MetaGuard` 实例，并初始化其依赖项与内部状态。
   * @param meta - Injected or initial meta (`MetaService`) / 注入或传入的元数据（`MetaService`）
   */
  constructor(private readonly meta: MetaService) {
  }

  /**
   * Executes `canActivate` to handle can activate.
   * @zh 执行 `canActivate`，用于是否可以激活。
   * @param route - route parameter (`ActivatedRouteSnapshot`) / route参数（`ActivatedRouteSnapshot`）
   * @param state - state parameter (`RouterStateSnapshot`) / 状态参数（`RouterStateSnapshot`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;

    const metaSettings = (route && route.data && route.data['meta'])
      ? route.data['meta']
      : undefined;

    this.meta.update(url, metaSettings);

    return true;
  }

  /**
   * Executes `canActivateChild` to handle can activate child.
   * @zh 执行 `canActivateChild`，用于是否可以激活子级。
   * @param route - route parameter (`ActivatedRouteSnapshot`) / route参数（`ActivatedRouteSnapshot`）
   * @param state - state parameter (`RouterStateSnapshot`) / 状态参数（`RouterStateSnapshot`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
