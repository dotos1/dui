
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
import { LocalStorageService } from '@dotos/dui/core/storage';
import { Observable, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { configuredTokenHosts, isTrustedTokenTarget } from './token-target';


/**
 * 把 `urlPattern` 中的正则元字符转义，使其按字面量子串匹配。
 * 例如 `.json` 只匹配真正的 `.json`，而不再把 `.` 当成通配符去匹配 `/api/vjson`。
 */
function escapeForSubstringMatch(urlPattern: string): RegExp {
  // 不使用 `g` 标志：带 `g` 的正则复用时 `lastIndex` 会残留，导致 `.test()` 交替返回 true/false。
  return new RegExp(urlPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

@Injectable({ providedIn: 'root' })
export class AuthBearerInterceptor implements HttpInterceptor {

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

  /** `getBearerExcludedUrls()` 的预编译结果，避免每个请求重复构造正则。 */
  private excludedUrlsRegex: RegExp[];

  constructor(
    private storageService: LocalStorageService,
    @Optional() private injector?: Injector) {

  }

  /**
   * 惰性编译排除规则。走 `getBearerExcludedUrls()` 而非直接读字段，
   * 以保留子类覆写该方法自定义排除列表的能力。
   */
  private getExcludedUrlsRegex(): RegExp[] {
    if (!this.excludedUrlsRegex) {
      this.excludedUrlsRegex = (this.getBearerExcludedUrls() || []).map(escapeForSubstringMatch);
    }
    return this.excludedUrlsRegex;
  }

  /** 同源 / 同主机不同端口 / 配置里的认证主机才带 token,见 token-target.ts。 */
  private isTrustedUrl(url: string): boolean {
    return isTrustedTokenTarget(url, undefined, configuredTokenHosts(this.injector));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

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
  getBearerExcludedUrls(): string[] {
    return this.bearerExcludedUrls;
}
  private appendJsonContentType(headers: HttpHeaders): HttpHeaders {
    return headers;
 //   return headers.set('Content-Type', 'application/json;charset=UTF-8');
  }
  addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
    return new Observable((observer: Observer<any>) => {
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
