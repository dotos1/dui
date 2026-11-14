/**
 * @fileoverview Module `src/util/pipes/secure-image.pipe.ts` providing secure image pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/secure-image.pipe.ts`，提供secure图像管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Angular pipe `SecureImagePipe` (name: 'secureImage') transforming values for secure image pipe display in templates.
 * @zh Angular 管道 `SecureImagePipe`（name: 'secureImage'），在模板中转换数据以用于Secure图像管道展示。
 */
@Pipe({
  name: 'secureImage',
  standalone: false
})
export class SecureImagePipe implements PipeTransform {
  /**
   * Creates an instance of `SecureImagePipe` and initializes its dependencies and internal state.
   * @zh 创建 `SecureImagePipe` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   */
  constructor(private http: HttpClient) {}

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param url - url parameter (`string`) / 链接地址参数（`string`）
   */
  transform(url: string) {
    return this.http
      .get(url, {
        headers: {
          activityInterceptor: 'false'
        },
        responseType: 'blob'
      })
      .pipe(
        switchMap(blob => {
          return new Observable(observer => {
            const reader = new FileReader();
            reader.onloadend = () => {
              observer.next(reader.result);
              observer.complete();
            };
            reader.onerror = err => {
              observer.error(err);
            };
            reader.readAsDataURL(blob);
            return () => {
              if (reader.readyState === FileReader.LOADING) {
                reader.abort();
              }
            };
          });
        })
      );
  }
}
