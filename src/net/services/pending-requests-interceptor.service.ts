/**
 * @fileoverview Module `src/net/services/pending-requests-interceptor.service.ts` providing pending requests interceptor service definitions and implementation.
 * @zh 模块文件 `src/net/services/pending-requests-interceptor.service.ts`，提供等待中请求拦截器服务相关的定义与实现。
 */



import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { ExistingProvider, Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

/**
 * Injectable Angular service `PendingRequestsInterceptor` managing pending requests interceptor state and operations in `src/net/services`.
 * @zh 可注入的 Angular 服务 `PendingRequestsInterceptor`，管理 `src/net/services` 中的等待中请求拦截器状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class PendingRequestsInterceptor implements HttpInterceptor {
    /**
     * Property `_pendingRequests` (`number`) storing pending requests (default: `0`).
     * @zh 属性 `_pendingRequests`（类型：`number`），用于存储或配置等待中请求（默认值：`0`）。
     */
    private _pendingRequests = 0;
    /**
     * Property `_pendingRequestsStatus$` (`ReplaySubject<boolean>`) storing pending requests status (default: `new ReplaySubject<boolean>(1)`).
     * @zh 属性 `_pendingRequestsStatus$`（类型：`ReplaySubject<boolean>`），用于存储或配置等待中请求状态（默认值：`new ReplaySubject<boolean>(1)`）。
     */
    private _pendingRequestsStatus$ = new ReplaySubject<boolean>(1);
    /**
     * Property `_filteredUrlPatterns` (`RegExp[]`) storing filtered url patterns (default: `[]`).
     * @zh 属性 `_filteredUrlPatterns`（类型：`RegExp[]`），用于存储或配置已过滤链接地址模式/图案（默认值：`[]`）。
     */
    private _filteredUrlPatterns: RegExp[] = [];
    /**
     * Property `_filteredMethods` (`string[]`) storing filtered methods (default: `[]`).
     * @zh 属性 `_filteredMethods`（类型：`string[]`），用于存储或配置已过滤方法（默认值：`[]`）。
     */
    private _filteredMethods: string[] = [];
    /**
     * Property `_filteredHeaders` (`string[]`) storing filtered headers (default: `[]`).
     * @zh 属性 `_filteredHeaders`（类型：`string[]`），用于存储或配置已过滤请求头（默认值：`[]`）。
     */
    private _filteredHeaders: string[] = [];
    /**
     * Property `_forceByPass` (`boolean`) storing force by pass.
     * @zh 属性 `_forceByPass`（类型：`boolean`），用于存储或配置force按传递。
     */
    private _forceByPass: boolean;

    /**
     * Gets the current pending requests status (`pendingRequestsStatus$: Observable<boolean>`).
     * @zh 获取当前等待中请求状态（`pendingRequestsStatus$: Observable<boolean>`）。
     */
    get pendingRequestsStatus$(): Observable<boolean> {
        return this._pendingRequestsStatus$.asObservable();
    }

    /**
     * Gets the current pending requests (`pendingRequests: number`).
     * @zh 获取当前等待中请求（`pendingRequests: number`）。
     */
    get pendingRequests(): number {
        return this._pendingRequests;
    }

    /**
     * Gets the current filtered url patterns (`filteredUrlPatterns: RegExp[]`).
     * @zh 获取当前已过滤链接地址模式/图案（`filteredUrlPatterns: RegExp[]`）。
     */
    get filteredUrlPatterns(): RegExp[] {
        return this._filteredUrlPatterns;
    }

    /**
     * Sets the filtered methods (`filteredMethods`).
     * @zh 设置已过滤方法（`filteredMethods`）。
     * @param httpMethods - New filtered methods value (`string[]`) / 新的已过滤方法值（`string[]`）
     */
    set filteredMethods(httpMethods: string[]) {
        this._filteredMethods = httpMethods;
    }

    /**
     * Sets the filtered headers (`filteredHeaders`).
     * @zh 设置已过滤请求头（`filteredHeaders`）。
     * @param value - New filtered headers value (`string[]`) / 新的已过滤请求头值（`string[]`）
     */
    set filteredHeaders(value: string[]) {
        this._filteredHeaders = value;
    }

    /**
     * Sets the force by pass (`forceByPass`).
     * @zh 设置force按传递（`forceByPass`）。
     * @param value - New force by pass value (`boolean`) / 新的force按传递值（`boolean`）
     */
    set forceByPass(value: boolean) {
        this._forceByPass = value;
    }

    /**
     * Executes `shouldBypassUrl` to handle should bypass url.
     * @zh 执行 `shouldBypassUrl`，用于是否应当Bypass链接地址。
     * @param url - url parameter (`string`) / 链接地址参数（`string`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private shouldBypassUrl(url: string): boolean {
        return this._filteredUrlPatterns.some(e => {
            return e.test(url);
        });
    }

    /**
     * Executes `shouldBypassMethod` to handle should bypass method.
     * @zh 执行 `shouldBypassMethod`，用于是否应当Bypass方法。
     * @param req - req parameter (`HttpRequest<unknown>`) / 请求参数（`HttpRequest<unknown>`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private shouldBypassMethod(req: HttpRequest<unknown>): boolean {
        return this._filteredMethods.some(e => {
            return e.toUpperCase() === req.method.toUpperCase();
        });
    }

    /**
     * Executes `shouldBypassHeader` to handle should bypass header.
     * @zh 执行 `shouldBypassHeader`，用于是否应当Bypass表头。
     * @param req - req parameter (`HttpRequest<unknown>`) / 请求参数（`HttpRequest<unknown>`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private shouldBypassHeader(req: HttpRequest<unknown>): boolean {
        return this._filteredHeaders.some(e => {
            return req.headers.has(e);
        });
    }

    /**
     * Executes `shouldBypass` to handle should bypass.
     * @zh 执行 `shouldBypass`，用于是否应当Bypass。
     * @param req - req parameter (`HttpRequest<unknown>`) / 请求参数（`HttpRequest<unknown>`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private shouldBypass(req: HttpRequest<unknown>): boolean {
        return this._forceByPass
            || this.shouldBypassUrl(req.urlWithParams)
            || this.shouldBypassMethod(req)
            || this.shouldBypassHeader(req);
    }

    /**
     * Executes `intercept` to handle intercept.
     * @zh 执行 `intercept`，用于拦截。
     * @param req - req parameter (`HttpRequest<unknown>`) / 请求参数（`HttpRequest<unknown>`）
     * @param next - next parameter (`HttpHandler`) / 下一个参数（`HttpHandler`）
     * @returns Result of type `Observable<HttpEvent<unknown>>` / 类型为 `Observable<HttpEvent<unknown>>` 的返回值
     */
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const shouldBypass = this.shouldBypass(req);

        if (!shouldBypass) {
            this._pendingRequests++;

            if (1 === this._pendingRequests) {
                this._pendingRequestsStatus$.next(true);
            }
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => throwError(error)),
            finalize(() => {
                if (!shouldBypass) {
                    this._pendingRequests--;

                    if (0 === this._pendingRequests) {
                        this._pendingRequestsStatus$.next(false);
                    }
                }
            })
        );
    }
}

/**
 * Constant/variable `PendingRequestsInterceptorProvider` defining pending requests interceptor provider in `src/net/services`.
 * @zh 常量/变量 `PendingRequestsInterceptorProvider`，定义 `src/net/services` 中的等待中请求拦截器提供者。
 */
export const PendingRequestsInterceptorProvider: ExistingProvider[] = [
{
    provide: HTTP_INTERCEPTORS,
    useExisting: PendingRequestsInterceptor,
    multi: true
}
];
