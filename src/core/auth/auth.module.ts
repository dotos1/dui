import { ModuleWithProviders, NgModule } from '@angular/core';
import { Inject, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,  HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { TranslateModule } from '@dotos/dui/translator';
import { ConfigService } from '@dotos/dui/core/config';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { JwtHelperService } from './jwt-helper.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { RegisterGuard } from './register.guard';
import { AuthLoader } from './auth.loader';
import { AuthStaticLoader } from './auth.loader';
 import { AuthBearerInterceptor } from './auth-bearer.interceptor';


export function authFactory(): AuthLoader {
  return new AuthStaticLoader();
}

export const AUTH_FORROOT_GUARD = new InjectionToken('AUTH_FORROOT_GUARD');

// 只在 forRoot() 的注入器里运行：若父注入器已有 AuthService，说明 forRoot() 被调用了多次。
// 放在「工厂 + 依赖父级 AuthService」里（而非模块构造函数），是 Angular RouterModule 的标准做法：
// 构造函数守卫会对**每次** AuthModule 实例化触发——包括懒加载模块里合法的 forChild()，从而误报。
export function provideAuthForRootGuard(auth: AuthService): any {
  if (auth) {
    throw new Error(
      'AuthModule.forRoot() 只能在根模块调用一次，子模块请改用 AuthModule.forChild()。'
    );
  }
  return true;
}
export const AuthInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthBearerInterceptor,
    multi: true
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [

    {
      provide: AuthLoader,
      useFactory: (authFactory)
    },
  ]
})
export class AuthModule {
  static forRoot(configuredProvider: any = {
    provide: AuthLoader,
    useFactory: (authFactory)
  }): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthGuard,
        HttpClient,
        AuthService,
        ConfigService,
        JwtHelperService,
        RegisterGuard,
        AuthenticatedGuard,
        configuredProvider,
        provideHttpClient(
          withInterceptorsFromDi(),
        ),
        AuthInterceptorProviders,
        {
          provide: AUTH_FORROOT_GUARD,
          useFactory: provideAuthForRootGuard,
          deps: [[new Optional(), new SkipSelf(), AuthService]],
        },
      ]
    };
  }
  static forChild(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule
    };
  }
  // 仅注入以触发 AUTH_FORROOT_GUARD 工厂运行（进而执行"是否重复 forRoot"的检查）。
  // 不再在构造函数里抛错——否则懒加载模块合法的 forChild() 也会触发。
  constructor(@Optional() @Inject(AUTH_FORROOT_GUARD) _guard: any) {}
}
