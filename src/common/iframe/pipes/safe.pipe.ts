import {Pipe, PipeTransform, SecurityContext} from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

/**
 * Sanitizes a URL and marks it as trusted resource URL, so it can be bound to `<iframe src>`
 * without Angular's built-in sanitizer stripping it.
 * @zh 对 URL 进行清理并标记为受信任的资源 URL，使其可以绑定到 `<iframe src>` 上
 * 而不会被 Angular 内置的安全清理器剥离。
 */
@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    /**
     * Sanitizes the given URL and returns it wrapped as a trusted resource URL.
     * @zh 清理给定的 URL 并将其包装为受信任的资源 URL 返回。
     */
    transform(url: string): any {
     
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          this.sanitizer.sanitize(SecurityContext.URL, url)
        );
    }
}
