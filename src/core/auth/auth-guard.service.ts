/**
 * @fileoverview Module `src/core/auth/auth-guard.service.ts` providing auth guard service definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth-guard.service.ts`，提供认证路由守卫服务相关的定义与实现。
 */


import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@dotos1/dui/core/config';

import { AuthGuardBase } from './auth-guard-base';
import { JwtHelperService } from './jwt-helper.service';
import { AuthService } from './auth.service';
import { LocalStorageService } from '@dotos1/dui/core/storage';

/**
 * Injectable Angular service `AuthGuard` managing auth guard state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `AuthGuard`，管理 `src/core/auth` 中的认证路由守卫状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuard extends AuthGuardBase implements OnDestroy {
    /**
     * Property `ticketChangeBind` (`any`) storing ticket change bind.
     * @zh 属性 `ticketChangeBind`（类型：`any`），用于存储或配置ticket变更绑定。
     */
    ticketChangeBind;
    /**
     * Creates an instance of `AuthGuard` and initializes its dependencies and internal state.
     * @zh 创建 `AuthGuard` 实例，并初始化其依赖项与内部状态。
     * @param jwtHelperService - Injected or initial jwt helper service (`JwtHelperService`) / 注入或传入的jwt辅助工具服务（`JwtHelperService`）
     * @param authenticationService - Injected or initial authentication service (`AuthService`) / 注入或传入的身份认证服务（`AuthService`）
     * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
     * @param appConfigService - Injected or initial app config service (`ConfigService`) / 注入或传入的app配置服务（`ConfigService`）
     * @param dialog - Injected or initial dialog (`MatDialog`) / 注入或传入的对话框（`MatDialog`）
     * @param storageService - Injected or initial storage service (`LocalStorageService`) / 注入或传入的存储服务（`LocalStorageService`）
     */
    constructor(private jwtHelperService: JwtHelperService,
                authenticationService: AuthService,
                router: Router,
                appConfigService: ConfigService,
                dialog: MatDialog,
                storageService: LocalStorageService) {
        super(authenticationService, router, appConfigService, dialog, storageService);
        this.ticketChangeBind = this.ticketChange.bind(this);
        window.addEventListener('storage', this.ticketChangeBind);
    }
    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    ngOnDestroy(): void {
        window.removeEventListener('storage', this.ticketChangeBind);
    }
    /**
     * Executes `ticketChange` to handle ticket change.
     * @zh 执行 `ticketChange`，用于ticket变更。
     * @param event - event parameter (`StorageEvent`) / 事件参数（`StorageEvent`）
     */
    ticketChange(event: StorageEvent) {
        if (event.key && event.key.endsWith('ticket') && event.newValue !== event.oldValue) {
            this.ticketChangeRedirect(event);
        }
        // Per the StorageEvent spec, `localStorage.clear()` (a common logout pattern)
        // fires with event.key === null; without this guard that crashed here on
        // every same-origin tab whenever any tab cleared storage.
        if (event.key && event.key.endsWith(JwtHelperService.USER_ACCESS_TOKEN) &&
            this.jwtHelperService.getValueFromToken(event.newValue, JwtHelperService.USER_PREFERRED_USERNAME) !==
            this.jwtHelperService.getValueFromToken(event.oldValue, JwtHelperService.USER_PREFERRED_USERNAME)) {
            this.ticketChangeRedirect(event);
        }
    }
    /**
     * Executes `ticketChangeRedirect` to handle ticket change redirect.
     * @zh 执行 `ticketChangeRedirect`，用于ticket变更重定向。
     * @param event - event parameter (`StorageEvent`) / 事件参数（`StorageEvent`）
     */
    private ticketChangeRedirect(event: StorageEvent) {
        if (!event.newValue) {
            this.navigate(this.router.url);
        } else {
            window.location.reload();
        }
    }
    /**
     * Executes `checkLogin` to handle check login.
     * @zh 执行 `checkLogin`，用于检查Login。
     * @param _ - _ parameter (`ActivatedRouteSnapshot`) / _参数（`ActivatedRouteSnapshot`）
     * @param redirectUrl - redirect url parameter (`string`) / 重定向链接地址参数（`string`）
     * @returns Result of type `Promise<boolean | UrlTree>` / 类型为 `Promise<boolean | UrlTree>` 的返回值
     */
    async checkLogin(_: ActivatedRouteSnapshot, redirectUrl: string): Promise<boolean | UrlTree> {
        if (this.authenticationService.isLoggedIn() || this.withCredentials) {
            return true;
        }
        return this.redirectToUrl(redirectUrl);
    }
}
