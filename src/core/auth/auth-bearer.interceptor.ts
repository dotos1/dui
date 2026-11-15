/**
 * @fileoverview Module `src/core/auth/auth-bearer.interceptor.ts` providing auth bearer interceptor definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth-bearer.interceptor.ts`，提供认证bearer拦截器相关的定义与实现。
 */


import {
  HttpHandler,
  HttpHeaderResponse,
  HttpHeaders,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import { Injectable, Injector, Optional } from '@angular/core';
import { LocalStorageService } from '@dotos1/dui/core/storage';
import { Observable, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { configuredTokenHosts, isTrustedTokenTarget } from './token-target';


/**
 * Executes `escapeForSubstringMatch` to handle escape for substring match.
 * 把 `urlPattern` 中的正则元字符转义，使其按字面量子串匹配。
 * 例如 `.json` 只匹配真正的 `.json`，而不再把 `.` 当成通配符去匹配 `/api/vjson`。

 * @zh 把 `urlPattern` 中的正则元字符转义，使其按字面量子串匹配。
 */
function escapeForSubstringMatch(urlPattern: string): RegExp {
  // 不使用 `g` 标志：带 `g` 的正则复用时 `lastIndex` 会残留，导致 `.test()` 交替返回 true/false。
  return new RegExp(urlPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

/**
 * Injectable Angular service `AuthBearerInterceptor` managing auth bearer interceptor state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `AuthBearerInterceptor`，管理 `src/core/auth` 中的认证Bearer拦截器状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class AuthBearerInterceptor implements HttpInterceptor {

  /**
   * Property `bearerExcludedUrls` (`string[]`) storing bearer excluded urls.
   * @zh 属性 `bearerExcludedUrls`（类型：`string[]`），用于存储或配置bearerExcluded链接列表。
   */
  private bearerExcludedUrls: string[] = ['auth/realms','oauth2/token', 'resources/',
        "/login/config",
        "/login/modulefederation",
        "/wallpapers",
        "/register",
        "/oauth",
        "/utils/file/download",
        "/checklogin",
        'assets/',
        '.json'
      ];

  /**
   * Property `excludedUrlsRegex` (`RegExp[]`) storing excluded urls regex.
   * `getBearerExcludedUrls()` 的预编译结果，避免每个请求重复构造正则。
   * @zh `getBearerExcludedUrls()` 的预编译结果，避免每个请求重复构造正则。
   */
  private excludedUrlsRegex: RegExp[];

  /**
   * Creates an instance of `AuthBearerInterceptor` and initializes its dependencies and internal state.
   * @zh 创建 `AuthBearerInterceptor` 实例，并初始化其依赖项与内部状态。
   * @param storageService - Injected or initial storage service (`LocalStorageService`) / 注入或传入的存储服务（`LocalStorageService`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    private storageService: LocalStorageService,
    @Optional() private injector?: Injector) {

  }

  /**
   * Executes `getExcludedUrlsRegex` to handle get excluded urls regex.
   * 惰性编译排除规则。走 `getBearerExcludedUrls()` 而非直接读字段，
   * 以保留子类覆写该方法自定义排除列表的能力。

   * @zh 惰性编译排除规则。走 `getBearerExcludedUrls()` 而非直接读字段，
   */
  private getExcludedUrlsRegex(): RegExp[] {
    if (!this.excludedUrlsRegex) {
      this.excludedUrlsRegex = (this.getBearerExcludedUrls() || []).map(escapeForSubstringMatch);
    }
    return this.excludedUrlsRegex;
  }

  /**
   * 同源 / 同主机不同端口 / 配置里的认证主机才带 token,见 token-target.ts。
   * @zh 同源 / 同主机不同端口 / 配置里的认证主机才带 token,见 token-target.ts。
   */
  private isTrustedUrl(url: string): boolean {
    return isTrustedTokenTarget(url, undefined, configuredTokenHosts(this.injector));
  }

  /**
   * Executes `intercept` to handle intercept.
   * @zh 执行 `intercept`，用于拦截。
   * @param req - req parameter (`HttpRequest<unknown>`) / 请求参数（`HttpRequest<unknown>`）
   * @param next - next parameter (`HttpHandler`) / 下一个参数（`HttpHandler`）
   * @returns Result of type `Observable<HttpEvent<any>>` / 类型为 `Observable<HttpEvent<any>>` 的返回值
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {

    const urlRequest = req.url;
    const shallPass: boolean = !this.isTrustedUrl(urlRequest) || this.getExcludedUrlsRegex().some(regex => regex.test(urlRequest));
    if (shallPass) {
      return next.handle(req);
    }

    return this.addTokenToHeader(req.headers)
      .pipe(
        mergeMap((headersWithBearer) => {
          const headerWithContentType = this.appendJsonContentType(headersWithBearer);

          const kcReq = req.clone({ headers: headerWithContentType});
          return next.handle(kcReq);
      })
      );
  }
  /**
   * Executes `getBearerExcludedUrls` to handle get bearer excluded urls.
   * @zh 执行 `getBearerExcludedUrls`，用于获取BearerExcluded链接列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getBearerExcludedUrls(): string[] {
    return this.bearerExcludedUrls;
}
  /**
   * Executes `appendJsonContentType` to handle append json content type.
   * @zh 执行 `appendJsonContentType`，用于追加JSON内容类型。
   * @param headers - headers parameter (`HttpHeaders`) / 请求头参数（`HttpHeaders`）
   * @returns Result of type `HttpHeaders` / 类型为 `HttpHeaders` 的返回值
   */
  private appendJsonContentType(headers: HttpHeaders): HttpHeaders {
    return headers;
 //   return headers.set('Content-Type', 'application/json;charset=UTF-8');
  }
  /**
   * Executes `addTokenToHeader` to handle add token to header.
   * @zh 执行 `addTokenToHeader`，用于添加令牌转换为表头。
   * @param headersArg - headers arg parameter (`HttpHeaders`) / 请求头参数参数（`HttpHeaders`）
   * @returns Result of type `Observable<HttpHeaders>` / 类型为 `Observable<HttpHeaders>` 的返回值
   */
  addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
    return new Observable((observer) => {
        let headers = headersArg;
        if (!headers) {
            headers = new HttpHeaders();
        }
        try {
            const token: string =  this.storageService.get('access_token'); 
            if(token!=null){
              headers = headers.set('Authorization', 'Bearer ' + token);
            }
      
            observer.next(headers);
            observer.complete();
        } catch (error) {
            observer.error(error);
        }
    });
}
}
