/**
 * @fileoverview Module `src/core/auth/auth-guard-base.ts` providing auth guard base definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth-guard-base.ts`，提供认证路由守卫基础相关的定义与实现。
 */


import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppConfigValues, ConfigService } from '@dotos/dui/core/config';

import { AuthService } from './auth.service';
import { OauthConfigModel } from './model';
import { LocalStorageService } from '@dotos/dui/core/storage';

/**
 * Class `AuthGuardBase` encapsulating auth guard base data structures and logic in `src/core/auth`.
 * @zh 类 `AuthGuardBase`，封装 `src/core/auth` 中的认证路由守卫基础数据结构与处理逻辑。
 */
export abstract class AuthGuardBase  {

  /**
   * Gets the current with credentials (`withCredentials: boolean`).
   * @zh 获取当前带有Credentials（`withCredentials: boolean`）。
   */
  protected get withCredentials(): boolean {
    return this.appConfigService.get<boolean>(
      'auth.withCredentials',
      false
    );
  }

  /**
   * Creates an instance of `AuthGuardBase` and initializes its dependencies and internal state.
   * @zh 创建 `AuthGuardBase` 实例，并初始化其依赖项与内部状态。
   * @param authenticationService - Injected or initial authentication service (`AuthService`) / 注入或传入的身份认证服务（`AuthService`）
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param appConfigService - Injected or initial app config service (`ConfigService`) / 注入或传入的app配置服务（`ConfigService`）
   * @param dialog - Injected or initial dialog (`MatDialog`) / 注入或传入的对话框（`MatDialog`）
   * @param storageService - Injected or initial storage service (`LocalStorageService`) / 注入或传入的存储服务（`LocalStorageService`）
   */
  constructor(
    protected authenticationService: AuthService,
    protected router: Router,
    protected appConfigService: ConfigService,
    protected dialog: MatDialog,
    private storageService: LocalStorageService
  ) {
  }

  /**
   * Executes `checkLogin` to handle check login.
   * @zh 执行 `checkLogin`，用于检查Login。
   * @param activeRoute - active route parameter (`ActivatedRouteSnapshot`) / 激活Route参数（`ActivatedRouteSnapshot`）
   * @param redirectUrl - redirect url parameter (`string`) / 重定向链接地址参数（`string`）
   * @returns Result of type `Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |...` / 类型为 `Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |...` 的返回值
   */
  abstract checkLogin(
    activeRoute: ActivatedRouteSnapshot,
    redirectUrl: string
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

  /**
   * Executes `canActivate` to handle can activate.
   * @zh 执行 `canActivate`，用于是否可以激活。
   * @param route - route parameter (`ActivatedRouteSnapshot`) / route参数（`ActivatedRouteSnapshot`）
   * @param state - state parameter (`RouterStateSnapshot`) / 状态参数（`RouterStateSnapshot`）
   * @returns Result of type `Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |...` / 类型为 `Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |...` 的返回值
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticationService.isLoggedIn() && this.authenticationService.isOauth() && this.isLoginFragmentPresent()) {
      return this.redirectSSOSuccessURL();
    }
    return this.checkLogin(route, state.url);
  }

  /**
   * Executes `canActivateChild` to handle can activate child.
   * @zh 执行 `canActivateChild`，用于是否可以激活子级。
   * @param route - route parameter (`ActivatedRouteSnapshot`) / route参数（`ActivatedRouteSnapshot`）
   * @param state - state parameter (`RouterStateSnapshot`) / 状态参数（`RouterStateSnapshot`）
   * @returns Result of type `Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |...` / 类型为 `Observable<boolean | UrlTree> | Promise<boolean | UrlTree> |...` 的返回值
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route, state);
  }

  /**
   * Executes `redirectSSOSuccessURL` to handle redirect sso success url.
   * @zh 执行 `redirectSSOSuccessURL`，用于重定向SSO成功链接地址。
   * @returns Result of type `Promise<boolean | UrlTree>` / 类型为 `Promise<boolean | UrlTree>` 的返回值
   */
  protected async redirectSSOSuccessURL(): Promise<boolean | UrlTree> {
    const redirectFragment:string = this.storageService.get('loginFragment') ;
    if (redirectFragment && this.getLoginRoute() !== redirectFragment) {
      await this.navigate(redirectFragment);
      this.storageService.remove('loginFragment');
      return false;
    }
    return true;
  }

  /**
   * Executes `isLoginFragmentPresent` to handle is login fragment present.
   * @zh 执行 `isLoginFragmentPresent`，用于是否为LoginFragmentPresent。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected isLoginFragmentPresent(): boolean {
    return !!this.storageService.get('loginFragment');
  }

  /**
   * Executes `redirectToUrl` to handle redirect to url.
   * @zh 执行 `redirectToUrl`，用于重定向转换为链接地址。
   * @param url - url parameter (`string`) / 链接地址参数（`string`）
   * @returns Result of type `Promise<boolean | UrlTree>` / 类型为 `Promise<boolean | UrlTree>` 的返回值
   */
  protected async redirectToUrl(url: string): Promise<boolean | UrlTree> {
    let urlToRedirect = `/${this.getLoginRoute()}`;
    if (!this.authenticationService.isOauth()) {
      this.authenticationService.setRedirect({
        provider: this.getProvider(),
        url
      });
      urlToRedirect = `${urlToRedirect}?redirectUrl=${url}`;
      return this.navigate(urlToRedirect);
    } else if (this.getOauthConfig().silentLogin && !this.authenticationService.isPublicUrl()) {
        this.authenticationService.implicitLogin();
    } else {
      return this.navigate(urlToRedirect);
    }
    return false;
  }

  /**
   * Executes `navigate` to handle navigate.
   * @zh 执行 `navigate`，用于导航。
   * @param url - url parameter (`string`) / 链接地址参数（`string`）
   * @returns Result of type `Promise<boolean>` / 类型为 `Promise<boolean>` 的返回值
   */
  protected async navigate(url: string): Promise<boolean> {
    this.dialog.closeAll();
    await this.router.navigateByUrl(this.router.parseUrl(url));
    return false;
  }

  /**
   * Executes `getOauthConfig` to handle get oauth config.
   * @zh 执行 `getOauthConfig`，用于获取Oauth配置。
   * @returns Result of type `OauthConfigModel` / 类型为 `OauthConfigModel` 的返回值
   */
  protected getOauthConfig(): OauthConfigModel {
    return (
      this.appConfigService &&
      this.appConfigService.get<OauthConfigModel>(
        AppConfigValues.OAUTHCONFIG,
        null
      )
    );
  }

  /**
   * Executes `getLoginRoute` to handle get login route.
   * @zh 执行 `getLoginRoute`，用于获取LoginRoute。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  protected getLoginRoute(): string {
    return (
      this.appConfigService &&
      this.appConfigService.get<string>(
        AppConfigValues.LOGIN_ROUTE,
        'login'
      )
    );
  }

  /**
   * Executes `getProvider` to handle get provider.
   * @zh 执行 `getProvider`，用于获取提供者。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  protected getProvider(): string {
    return (
      this.appConfigService &&
      this.appConfigService.get<string>(
        AppConfigValues.PROVIDERS,
        'ALL'
      )
    );
  }

  /**
   * Executes `isOAuthWithoutSilentLogin` to handle is o auth without silent login.
   * @zh 执行 `isOAuthWithoutSilentLogin`，用于是否为O认证不含SilentLogin。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected isOAuthWithoutSilentLogin(): boolean {
    const oauth = this.appConfigService.get<OauthConfigModel>(
      AppConfigValues.OAUTHCONFIG,
      null
    );
    return (
      this.authenticationService.isOauth() && !!oauth && !oauth.silentLogin
    );
  }

  /**
   * Executes `isSilentLogin` to handle is silent login.
   * @zh 执行 `isSilentLogin`，用于是否为SilentLogin。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected isSilentLogin(): boolean {
    const oauth = this.appConfigService.get<OauthConfigModel>(
      AppConfigValues.OAUTHCONFIG,
      null
    );
    return this.authenticationService.isOauth() && oauth && oauth.silentLogin;
  }
}
