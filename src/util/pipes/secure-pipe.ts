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
    private objectUrl?: string;
    private lastUrl?: string;
    private lastResult?: Observable<SafeUrl>;
    private destroy$ = new Subject<void>();

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

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

    private revoke(): void {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = undefined;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.revoke();
    }
}
