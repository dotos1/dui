/**
 * @fileoverview Module `src/core/auth/jwt-helper.service.ts` providing jwt helper service definitions and implementation.
 * @zh 模块文件 `src/core/auth/jwt-helper.service.ts`，提供jwt辅助工具服务相关的定义与实现。
 */


import { Injectable } from '@angular/core';

import { LocalStorageService } from '@dotos/dui/core/storage';

/**
 * Injectable Angular service `JwtHelperService` managing jwt helper service state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `JwtHelperService`，管理 `src/core/auth` 中的Jwt辅助工具服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class JwtHelperService {

    /**
     * Property `USER_NAME` (`string`) storing user name (default: `'name'`).
     * @zh 属性 `USER_NAME`（类型：`string`），用于存储或配置用户名称（默认值：`'name'`）。
     */
    static USER_NAME = 'name';
    /**
     * Property `FAMILY_NAME` (`string`) storing family name (default: `'family_name'`).
     * @zh 属性 `FAMILY_NAME`（类型：`string`），用于存储或配置FAMILY名称（默认值：`'family_name'`）。
     */
    static FAMILY_NAME = 'family_name';
    /**
     * Property `GIVEN_NAME` (`string`) storing given name (default: `'given_name'`).
     * @zh 属性 `GIVEN_NAME`（类型：`string`），用于存储或配置GIVEN名称（默认值：`'given_name'`）。
     */
    static GIVEN_NAME = 'given_name';
    /**
     * Property `USER_EMAIL` (`string`) storing user email (default: `'email'`).
     * @zh 属性 `USER_EMAIL`（类型：`string`），用于存储或配置用户EMAIL（默认值：`'email'`）。
     */
    static USER_EMAIL = 'email';
    /**
     * Property `USER_ACCESS_TOKEN` (`string`) storing user access token (default: `'access_token'`).
     * @zh 属性 `USER_ACCESS_TOKEN`（类型：`string`），用于存储或配置用户ACCESS令牌（默认值：`'access_token'`）。
     */
    static USER_ACCESS_TOKEN = 'access_token';
    /**
     * Property `REALM_ACCESS` (`string`) storing realm access (default: `'realm_access'`).
     * @zh 属性 `REALM_ACCESS`（类型：`string`），用于存储或配置REALMACCESS（默认值：`'realm_access'`）。
     */
    static REALM_ACCESS = 'realm_access';
    /**
     * Property `RESOURCE_ACCESS` (`string`) storing resource access (default: `'resource_access'`).
     * @zh 属性 `RESOURCE_ACCESS`（类型：`string`），用于存储或配置资源ACCESS（默认值：`'resource_access'`）。
     */
    static RESOURCE_ACCESS = 'resource_access';
    /**
     * Property `USER_PREFERRED_USERNAME` (`string`) storing user preferred username (default: `'preferred_username'`).
     * @zh 属性 `USER_PREFERRED_USERNAME`（类型：`string`），用于存储或配置用户PREFERRED用户名（默认值：`'preferred_username'`）。
     */
    static USER_PREFERRED_USERNAME = 'preferred_username';

    /**
     * Creates an instance of `JwtHelperService` and initializes its dependencies and internal state.
     * @zh 创建 `JwtHelperService` 实例，并初始化其依赖项与内部状态。
     * @param storageService - Injected or initial storage service (`LocalStorageService`) / 注入或传入的存储服务（`LocalStorageService`）
     */
    constructor(private storageService: LocalStorageService) {
    }


    /**
     * Executes `decodeToken` to handle decode token.
     * @zh 执行 `decodeToken`，用于解码令牌。
     * @param token - token parameter (`any`) / 令牌参数（`any`）
     * @returns Result of type `Object` / 类型为 `Object` 的返回值
     */
    decodeToken(token): Object {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);
    }

    /**
     * Executes `urlBase64Decode` to handle url base64 decode.
     * @zh 执行 `urlBase64Decode`，用于链接地址Base64解码。
     * @param token - token parameter (`any`) / 令牌参数（`any`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    private urlBase64Decode(token): string {
        let output = token.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return decodeURIComponent(escape(window.atob(output)));
    }


    /**
     * Executes `getValueFromLocalAccessToken` to handle get value from local access token.
     * @zh 执行 `getValueFromLocalAccessToken`，用于获取值从本地Access令牌。
     * @param key - key parameter (`string`) / 键参数（`string`）
     * @returns Result of type `T` / 类型为 `T` 的返回值
     */
    getValueFromLocalAccessToken<T>(key: string): T {
        return this.getValueFromToken(this.getAccessToken(), key);
    }


    /**
     * Executes `getAccessToken` to handle get access token.
     * @zh 执行 `getAccessToken`，用于获取Access令牌。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    getAccessToken(): string {
        return this.storageService.get(JwtHelperService.USER_ACCESS_TOKEN);
    }


    /**
     * Executes `getValueFromToken` to handle get value from token.
     * @zh 执行 `getValueFromToken`，用于获取值从令牌。
     * @param accessToken - access token parameter (`string`) / access令牌参数（`string`）
     * @param key - key parameter (`string`) / 键参数（`string`）
     * @returns Result of type `T` / 类型为 `T` 的返回值
     */
    getValueFromToken<T>(accessToken: string, key: string): T {
        let value;
        if (accessToken) {
            // 存储中的 token 可能被篡改或不是 JWT，解析失败时按“无此声明”处理，
            // 避免异常从路由守卫冒泡导致整个导航失败。
            try {
                const tokenPayload = this.decodeToken(accessToken);
                value = tokenPayload[key];
            } catch (e) {
                console.warn('[JwtHelperService] 无法解析 access_token，已忽略该声明。', e);
            }
        }
        return <T> value;
    }

    /**
     * Executes `getRealmRoles` to handle get realm roles.
     * @zh 执行 `getRealmRoles`，用于获取Realm角色。
     * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
     */
    getRealmRoles(): string[] {
        const access = this.getValueFromLocalAccessToken(JwtHelperService.REALM_ACCESS);
        return access ? access['roles'] : [];
    }


    /**
     * Executes `getClientRoles` to handle get client roles.
     * @zh 执行 `getClientRoles`，用于获取Client角色。
     * @param clientName - client name parameter (`string`) / client名称参数（`string`）
     * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
     */
    getClientRoles(clientName: string): string[] {
        const resourceAccess = this.getValueFromLocalAccessToken(JwtHelperService.RESOURCE_ACCESS);
        const clientRole = resourceAccess ? resourceAccess[clientName] : undefined;
        return clientRole ? clientRole['roles'] : [];
    }

    /**
     * Executes `hasRealmRole` to handle has realm role.
     * @zh 执行 `hasRealmRole`，用于是否包含Realm角色。
     * @param role - role parameter (`string`) / 角色参数（`string`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    hasRealmRole(role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const realmRoles = this.getRealmRoles();
            hasRole = realmRoles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }

    /**
     * Executes `hasRealmRoles` to handle has realm roles.
     * @zh 执行 `hasRealmRoles`，用于是否包含Realm角色。
     * @param rolesToCheck - roles to check parameter (`string []`) / 角色转换为检查参数（`string []`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    hasRealmRoles(rolesToCheck: string []): boolean {
        return (rolesToCheck || []).some((currentRole) => {
            return this.hasRealmRole(currentRole);
        });
    }

    /**
     * Executes `hasRealmRolesForClientRole` to handle has realm roles for client role.
     * @zh 执行 `hasRealmRolesForClientRole`，用于是否包含Realm角色用于Client角色。
     * @param clientName - client name parameter (`string`) / client名称参数（`string`）
     * @param rolesToCheck - roles to check parameter (`string []`) / 角色转换为检查参数（`string []`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    hasRealmRolesForClientRole(clientName: string, rolesToCheck: string []): boolean {
        return (rolesToCheck || []).some((currentRole) => {
            return this.hasClientRole(clientName, currentRole);
        });
    }

    /**
     * Executes `hasClientRole` to handle has client role.
     * @zh 执行 `hasClientRole`，用于是否包含Client角色。
     * @param clientName - client name parameter (`string`) / client名称参数（`string`）
     * @param role - role parameter (`string`) / 角色参数（`string`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    hasClientRole(clientName: string, role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const clientRoles = this.getClientRoles(clientName);
            hasRole = clientRoles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }
}
