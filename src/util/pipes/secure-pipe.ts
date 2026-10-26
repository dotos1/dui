/**
 * @fileoverview Module `src/util/pipes/secure-pipe.ts` providing secure pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/secure-pipe.ts`，提供secure管道相关的定义与实现。
 */

import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

/**
 * Fetches a URL that requires authentication headers and exposes the response blob as a
 * trusted object URL, e.g. `<img [src]="url | secure | async">`.
 * @zh 拉取需要携带鉴权头的 URL，把响应 blob 转成受信任的 object URL 供模板使用，
 * 例如 `<img [src]="url | secure | async">`。
 *
 * 每个绑定点持有自己的管道实例，实例负责释放它创建的 object URL：
 * URL 变化时释放上一个，销毁时释放最后一个。不释放的话浏览器会一直持有对应 blob
 * 直到文档卸载（图片场景通常是 MB 级）。
 */
@Pipe({ name: 'secure' })
export class SecurePipe implements PipeTransform, OnDestroy {
    /**
     * Property `objectUrl` (`string`) storing object url.
     * @zh 属性 `objectUrl`（类型：`string`），用于存储或配置对象链接地址。
     */
    private objectUrl?: string;
    /**
     * Property `lastUrl` (`string`) storing last url.
     * @zh 属性 `lastUrl`（类型：`string`），用于存储或配置末尾链接地址。
     */
    private lastUrl?: string;
    /**
     * Property `lastResult` (`Observable<SafeUrl>`) storing last result.
     * @zh 属性 `lastResult`（类型：`Observable<SafeUrl>`），用于存储或配置末尾结果。
     */
    private lastResult?: Observable<SafeUrl>;
    /**
     * Property `destroy$` (`Subject`) storing destroy (default: `new Subject<void>()`).
     * @zh 属性 `destroy$`（类型：`Subject`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
     */
    private destroy$ = new Subject<void>();

    /**
     * Creates an instance of `SecurePipe` and initializes its dependencies and internal state.
     * @zh 创建 `SecurePipe` 实例，并初始化其依赖项与内部状态。
     * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
     * @param sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
     */
    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    /**
     * Executes `transform` to handle transform.
     * @zh 执行 `transform`，用于转换。
     * @param url - url parameter (`string`) / 链接地址参数（`string`）
     * @returns Result of type `Observable<SafeUrl>` / 类型为 `Observable<SafeUrl>` 的返回值
     */
    transform(url: string): Observable<SafeUrl> {
        // 同一个 url 返回同一个 Observable，避免与 async 管道组合时重复发起请求。
        if (url === this.lastUrl && this.lastResult) {
            return this.lastResult;
        }
        this.lastUrl = url;
        this.lastResult = this.http
            .get(url, { responseType: 'blob' })
            .pipe(
                takeUntil(this.destroy$),
                map(val => {
                    this.revoke();
                    this.objectUrl = URL.createObjectURL(val);
                    return this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
                }),
                shareReplay({ bufferSize: 1, refCount: true })
            );
        return this.lastResult;
    }

    /**
     * Executes `revoke` to handle revoke.
     * @zh 执行 `revoke`，用于revoke。
     */
    private revoke(): void {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = undefined;
        }
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.revoke();
    }
}
