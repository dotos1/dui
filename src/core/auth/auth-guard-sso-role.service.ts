/**
 * @fileoverview Module `src/core/auth/auth-guard-sso-role.service.ts` providing auth guard sso role service definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth-guard-sso-role.service.ts`，提供认证路由守卫sso角色服务相关的定义与实现。
 */



import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from './jwt-helper.service';

/**
 * Injectable Angular service `AuthGuardSsoRoleService` managing auth guard sso role service state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `AuthGuardSsoRoleService`，管理 `src/core/auth` 中的认证路由守卫Sso角色服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuardSsoRoleService  {
    /**
     * Creates an instance of `AuthGuardSsoRoleService` and initializes its dependencies and internal state.
     * @zh 创建 `AuthGuardSsoRoleService` 实例，并初始化其依赖项与内部状态。
     * @param jwtHelperService - Injected or initial jwt helper service (`JwtHelperService`) / 注入或传入的jwt辅助工具服务（`JwtHelperService`）
     * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
     * @param dialog - Injected or initial dialog (`MatDialog`) / 注入或传入的对话框（`MatDialog`）
     */
    constructor(private jwtHelperService: JwtHelperService, private router: Router, private dialog: MatDialog) {
    }
    /**
     * Executes `canActivate` to handle can activate.
     * @zh 执行 `canActivate`，用于是否可以激活。
     * @param route - route parameter (`ActivatedRouteSnapshot`) / route参数（`ActivatedRouteSnapshot`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    canActivate(route: ActivatedRouteSnapshot): boolean {
        let hasRole;
        let hasRealmRole = false;
        let hasClientRole = true;
        if (route.data) {
            if (route.data['roles']) {
                const rolesToCheck = route.data['roles'];
                hasRealmRole = this.jwtHelperService.hasRealmRoles(rolesToCheck);
            }
            if (route.data['clientRoles']) {
                const clientRoleName = route.params[route.data['clientRoles']];
                const rolesToCheck = route.data['roles'];
                hasClientRole = this.jwtHelperService.hasRealmRolesForClientRole(clientRoleName, rolesToCheck);
            }
        }
        hasRole = hasRealmRole && hasClientRole;
        if (!hasRole && route.data && route.data['redirectUrl']) {
            this.router.navigate(['/' + route.data['redirectUrl']]);
        }
        if (!hasRole) {
            this.dialog.closeAll();
        }
        return hasRole;
    }
}
