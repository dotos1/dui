import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NotifyInterceptor } from './notify.interptor';
import { HttpsInterceptor } from './https.interceptor';
import { ProfilerInterceptor } from './profiler.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { HeaderInterceptor } from './header.interceptor';

export { NotifyInterceptor } from './notify.interptor';
export { HttpsInterceptor } from './https.interceptor';
export { ProfilerInterceptor } from './profiler.interceptor';
export { CacheInterceptor } from './cache.interceptor';
export { ErrorInterceptor } from './error.interceptor';
export { HeaderInterceptor } from './header.interceptor';


export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpsInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ProfilerInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: NotifyInterceptor, multi: true }
];

export const simpleInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: NotifyInterceptor, multi: true }
];
