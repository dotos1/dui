/**
 * @fileoverview Module `src/core/auth/auth.module.ts` providing auth module definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth.module.ts`，提供认证模块相关的定义与实现。
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { Inject, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,  HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { TranslateModule } from '@dotos1/dui/translator';
import { ConfigService } from '@dotos1/dui/core/config';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { JwtHelperService } from './jwt-helper.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { RegisterGuard } from './register.guard';
import { AuthLoader } from './auth.loader';
import { AuthStaticLoader } from './auth.loader';
 import { AuthBearerInterceptor } from './auth-bearer.interceptor';


/**
 * Executes `authFactory` to handle auth factory.
 * @zh 执行 `authFactory`，用于认证工厂。
 * @returns Result of type `AuthLoader` / 类型为 `AuthLoader` 的返回值
 */
export function authFactory(): AuthLoader {
  return new AuthStaticLoader();
}

/**
 * Angular dependency-injection token `AUTH_FORROOT_GUARD` for providing auth forroot guard.
 * @zh Angular 依赖注入令牌 `AUTH_FORROOT_GUARD`，用于提供与注入认证FORROOT路由守卫。
 */
export const AUTH_FORROOT_GUARD = new InjectionToken('AUTH_FORROOT_GUARD');

// 只在 forRoot() 的注入器里运行：若父注入器已有 AuthService，说明 forRoot() 被调用了多次。
// 放在「工厂 + 依赖父级 AuthService」里（而非模块构造函数），是 Angular RouterModule 的标准做法：
// 构造函数守卫会对**每次** AuthModule 实例化触发——包括懒加载模块里合法的 forChild()，从而误报。
/**
 * Executes `provideAuthForRootGuard` to handle provide auth for root guard.
 * @zh 执行 `provideAuthForRootGuard`，用于提供认证用于根节点路由守卫。
 * @param auth - auth parameter (`AuthService`) / 认证参数（`AuthService`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function provideAuthForRootGuard(auth: AuthService) {
  if (auth) {
    throw new Error(
      'AuthModule.forRoot() 只能在根模块调用一次，子模块请改用 AuthModule.forChild()。'
    );
  }
  return true;
}
/**
 * Constant/variable `AuthInterceptorProviders` defining auth interceptor providers in `src/core/auth`.
 * @zh 常量/变量 `AuthInterceptorProviders`，定义 `src/core/auth` 中的认证拦截器提供者列表。
 */
export const AuthInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthBearerInterceptor,
    multi: true
  }
];

/**
 * Angular module `AuthModule` declaring and exporting auth module components, directives, pipes, and providers.
 * @zh Angular 模块 `AuthModule`，声明并导出认证模块相关的组件、指令、管道与服务提供者。
 */
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
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param configuredProvider - configured provider parameter (`{ provide: typeof AuthLoader; useFactory: () => AuthLoader; }`) / configured提供者参数（`{ provide: typeof AuthLoader; useFactory: () => AuthLoader; }`）
   * @returns Result of type `ModuleWithProviders<AuthModule>` / 类型为 `ModuleWithProviders<AuthModule>` 的返回值
   */
  static forRoot(configuredProvider = {
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
  /**
   * Executes `forChild` to handle for child.
   * @zh 执行 `forChild`，用于用于子级。
   * @returns Result of type `ModuleWithProviders<AuthModule>` / 类型为 `ModuleWithProviders<AuthModule>` 的返回值
   */
  static forChild(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule
    };
  }
  // 仅注入以触发 AUTH_FORROOT_GUARD 工厂运行（进而执行"是否重复 forRoot"的检查）。
  // 不再在构造函数里抛错——否则懒加载模块合法的 forChild() 也会触发。
  /**
   * Creates an instance of `AuthModule` and initializes its dependencies and internal state.
   * @zh 创建 `AuthModule` 实例，并初始化其依赖项与内部状态。
   * @param _guard - Injected or initial guard (`any`) / 注入或传入的路由守卫（`any`）
   */
  constructor(@Optional() @Inject(AUTH_FORROOT_GUARD) _guard) {}
}
