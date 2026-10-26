/**
 * @fileoverview Module `src/core/auth/auth-interceptor.ts` providing auth interceptor definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth-interceptor.ts`，提供认证拦截器相关的定义与实现。
 */

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable, Injector, Optional } from '@angular/core';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { Observable } from 'rxjs';
import { configuredTokenHosts, isTrustedTokenTarget } from './token-target';

/**
 * Injectable Angular service `AuthInterceptor` managing auth interceptor state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `AuthInterceptor`，管理 `src/core/auth` 中的认证拦截器状态与业务操作。
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    /**
     * Creates an instance of `AuthInterceptor` and initializes its dependencies and internal state.
     * @zh 创建 `AuthInterceptor` 实例，并初始化其依赖项与内部状态。
     * @param storageService - Injected or initial storage service (`LocalStorageService`) / 注入或传入的存储服务（`LocalStorageService`）
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    public constructor(
        public storageService: LocalStorageService,
        @Optional() private injector?: Injector){
    }

    /**
     * Executes `intercept` to handle intercept.
     * @zh 执行 `intercept`，用于intercept。
     * @param request - request parameter (`HttpRequest<any>`) / 请求参数（`HttpRequest<any>`）
     * @param next - next parameter (`HttpHandler`) / 下一个参数（`HttpHandler`）
     * @returns Result of type `Observable<HttpEvent<any>>` / 类型为 `Observable<HttpEvent<any>>` 的返回值
     */
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token: string =  this.storageService.get('access_token'); 
        if (token && token !== 'null' && token !== 'undefined' && isTrustedTokenTarget(request.url, undefined, configuredTokenHosts(this.injector))) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }

        return next.handle(request);
    }
}