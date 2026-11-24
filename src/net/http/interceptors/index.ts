/**
 * @fileoverview Module `src/net/http/interceptors/index.ts` providing index definitions and implementation.
 * @zh 模块文件 `src/net/http/interceptors/index.ts`，提供索引相关的定义与实现。
 */

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NotifyInterceptor } from './notify.interptor';
import { HttpsInterceptor } from './https.interceptor';
import { ProfilerInterceptor } from './profiler.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { HeaderInterceptor } from './header.interceptor';
import { RequestRingBufferInterceptor } from '../error/request-ring-buffer';
import { AuthBearerInterceptor } from '@dotos1/dui/core/auth';

export { NotifyInterceptor } from './notify.interptor';
export { HttpsInterceptor } from './https.interceptor';
export { ProfilerInterceptor } from './profiler.interceptor';
export { CacheInterceptor } from './cache.interceptor';
export { ErrorInterceptor, ERROR_INTERCEPTOR_OPTIONS } from './error.interceptor';
export type { ErrorInterceptorOptions } from './error.interceptor';
export { HeaderInterceptor } from './header.interceptor';


/**
 * Constant/variable `httpInterceptorProviders` defining http interceptor providers in `src/net/http/interceptors`.
 * @zh 常量/变量 `httpInterceptorProviders`，定义 `src/net/http/interceptors` 中的HTTP拦截器提供者列表。
 */
export const httpInterceptorProviders = [
  // 环形缓冲放最外层（第一个注册），记录的是最终状态与总耗时
  { provide: HTTP_INTERCEPTORS, useClass: RequestRingBufferInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpsInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ProfilerInterceptor, multi: true },

];

/**
 * Constant/variable `simpleInterceptorProviders` defining simple interceptor providers in `src/net/http/interceptors`.
 * @zh 常量/变量 `simpleInterceptorProviders`，定义 `src/net/http/interceptors` 中的simple拦截器提供者列表。
 */
export const simpleInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: RequestRingBufferInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: NotifyInterceptor, multi: true },
 { provide: HTTP_INTERCEPTORS, useClass: AuthBearerInterceptor, multi: true }
];
