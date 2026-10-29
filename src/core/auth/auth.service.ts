/**
 * @fileoverview Module `src/core/auth/auth.service.ts` providing auth service definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth.service.ts`，提供认证服务相关的定义与实现。
 */

import { LogoutResult } from './logout-result';
import { Injectable } from '@angular/core';
import { HttpClient,  HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { ConfigService } from '@dotos/dui/core/config';
import { CookieService, LogService } from '@dotos/dui/core/services';
import { CommonAuth } from './CommonAuth';
import { Oauth2Auth } from './oauth2Auth';
import { RedirectionModel } from './model/redirection.model';
import { JwtHelperService } from './jwt-helper.service';

import { AuthLoader } from './auth.loader';
import { LocalStorageService } from '@dotos/dui/core/storage';

/**
 * Constant/variable `REMEMBER_ME_COOKIE_KEY` defining remember me cookie key in `src/core/auth`.
 * @zh 常量/变量 `REMEMBER_ME_COOKIE_KEY`，定义 `src/core/auth` 中的REMEMBERMECookie键。
 */
const REMEMBER_ME_COOKIE_KEY = 'DOTOS_REMEMBER_ME';
/**
 * Constant/variable `REMEMBER_ME_UNTIL` defining remember me until in `src/core/auth`.
 * @zh 常量/变量 `REMEMBER_ME_UNTIL`，定义 `src/core/auth` 中的REMEMBERME直到。
 */
const REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30;
/**
 * Injectable Angular service `AuthService` managing auth service state and operations in `src/core/auth`.
 * @zh 可注入的 Angular 服务 `AuthService`，管理 `src/core/auth` 中的认证服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Property `oauth2Auth` (`Oauth2Auth`) storing oauth2 auth.
   * @zh 属性 `oauth2Auth`（类型：`Oauth2Auth`），用于存储或配置oauth2认证。
   */
  oauth2Auth: Oauth2Auth;
  /**
   * Property `commonAuth` (`CommonAuth`) storing common auth.
   * @zh 属性 `commonAuth`（类型：`CommonAuth`），用于存储或配置通用认证。
   */
  commonAuth: CommonAuth;

  /**
   * Property `username` (`string`) storing username.
   * @zh 属性 `username`（类型：`string`），用于存储或配置用户名。
   */
  username: string;

  /**
   * Property `redirectUrl` (`RedirectionModel`) storing redirect url (default: `null`).
   * @zh 属性 `redirectUrl`（类型：`RedirectionModel`），用于存储或配置重定向链接地址（默认值：`null`）。
   */
  private redirectUrl: RedirectionModel = null;

  /**
   * Property `onLogin` (`Subject<any>`) storing on login (default: `new Subject<any>()`).
   * @zh 属性 `onLogin`（类型：`Subject<any>`），用于存储或配置当Login（默认值：`new Subject<any>()`）。
   */
  onLogin = new Subject();
  /**
   * Property `onLogout` (`Subject<LogoutResult>`) storing on logout (default: `new Subject<any>()`).
   * @zh 属性 `onLogout`（类型：`Subject<LogoutResult>`），用于存储或配置当Logout（默认值：`new Subject<any>()`）。
   */
  onLogout = new Subject<LogoutResult>();

  /**
   * Property `_redirectUrl` (`string`) storing redirect url.
   * @zh 属性 `_redirectUrl`（类型：`string`），用于存储或配置重定向链接地址。
   */
  public _redirectUrl: string;
  /**
   * Property `userId` (`string`) storing user id.
   * @zh 属性 `userId`（类型：`string`），用于存储或配置用户唯一标识。
   */
  public userId: string;

  /**
   * Creates an instance of `AuthService` and initializes its dependencies and internal state.
   * @zh 创建 `AuthService` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`ConfigService`) / 注入或传入的配置（`ConfigService`）
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param loader - Injected or initial loader (`AuthLoader`) / 注入或传入的加载器（`AuthLoader`）
   * @param storageService - Injected or initial storage service (`LocalStorageService`) / 注入或传入的存储服务（`LocalStorageService`）
   * @param cookie - Injected or initial cookie (`CookieService`) / 注入或传入的Cookie（`CookieService`）
   * @param logService - Injected or initial log service (`LogService`) / 注入或传入的日志服务（`LogService`）
   * @param jwtHelperService - Injected or initial jwt helper service (`JwtHelperService`) / 注入或传入的jwt辅助工具服务（`JwtHelperService`）
   */
  constructor(
    private config: ConfigService,
    private http: HttpClient,
    readonly loader: AuthLoader,
    private storageService: LocalStorageService,
    private cookie: CookieService,
    private logService: LogService,
    public jwtHelperService: JwtHelperService) {
  
    if (this.config.getSettings('authType') == undefined) {
      this.config.onLoad.subscribe(() => {
        this.setConfig();
      });
    } else {
      this.setConfig();
    }
  }

  /**
   * Executes `setConfig` to handle set config.
   * @zh 执行 `setConfig`，用于集合配置。
   */
  setConfig() {

    if (!this.oauth2Auth) {
      this.oauth2Auth = new Oauth2Auth(this.config, this.http, this.storageService,this.jwtHelperService);
    } else {
      this.oauth2Auth.setConfig();
    }
    if (!this.commonAuth) {
      this.commonAuth = new CommonAuth(this.config, this.http, this.loader, this.storageService);
    } else {
      this.commonAuth.setConfig();
    }
  }
  /**
   * Executes `getUserId` to handle get user id.
   * @zh 执行 `getUserId`，用于获取用户唯一标识。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getUserId(): string {
    return this.userId;
  }

  /**
   * Executes `setUserFromJwtToken` to handle set user from jwt token.
   * @zh 执行 `setUserFromJwtToken`，用于集合用户从Jwt令牌。
   * @param jwtToken - jwt token parameter (`any`) / jwt令牌参数（`any`）
   * @param refreshToken - refresh token parameter (`any`) / 刷新令牌参数（`any`）
   * @param notify - notify parameter (`any`) / 通知参数（`any`）
   * @returns Result of type `Observable<boolean>` / 类型为 `Observable<boolean>` 的返回值
   */
  public setUserFromJwtToken(jwtToken, refreshToken, notify): Observable<boolean> {
    const authenticatedSubject = new ReplaySubject<boolean>();
    // if (!jwtToken) {
    //   AuthService.clearTokenData();
    //   if (notify) {
    //     this.notifyUnauthenticated();
    //   }
    //   authenticatedSubject.next(false);
    //   authenticatedSubject.complete();
    // } else {
    //   this.updateAndValidateTokens(jwtToken, refreshToken, true);
    //   if (notify) {
    //     this.notifyUserLoaded(false);
    //     this.loadUser(false).subscribe(
    //       (authPayload) => {
    //         this.notifyAuthenticated(authPayload);
    //         this.notifyUserLoaded(true);
    //         authenticatedSubject.next(true);
    //         authenticatedSubject.complete();
    //       },
    //       () => {
    //         this.notifyUnauthenticated();
    //         this.notifyUserLoaded(true);
    //         authenticatedSubject.next(false);
    //         authenticatedSubject.complete();
    //       }
    //     );
    //   } else {
    //     this.loadUser(false).subscribe(
    //       () => {
    //         authenticatedSubject.next(true);
    //         authenticatedSubject.complete();
    //       },
    //       () => {
    //         authenticatedSubject.next(false);
    //         authenticatedSubject.complete();
    //       }
    //     );
    //   }
    // }
    return authenticatedSubject;
  }

  /**
   * Executes `getAuthenticated` to handle get authenticated.
   * @zh 执行 `getAuthenticated`，用于获取Authenticated。
   * @returns Result of type `Observable<any>` / 类型为 `Observable<any>` 的返回值
   */
  getAuthenticated() {
    return this.http.get(this.loader.backend.endpoint, { withCredentials: true });
  }

  /**
   * Executes `getRegistered` to handle get registered.
   * @zh 执行 `getRegistered`，用于获取已注册。
   * @returns Result of type `Observable<any>` / 类型为 `Observable<any>` 的返回值
   */
  getRegistered() {
    return this.http.get(this.loader.backend.registerUrl, { withCredentials: true });
  }

  /**
   * Executes `changeWithCredentialsConfig` to handle change with credentials config.
   * @zh 执行 `changeWithCredentialsConfig`，用于变更带有Credentials配置。
   * @param withCredentials - with credentials parameter (`boolean`) / 带有Credentials参数（`boolean`）
   */
  changeWithCredentialsConfig(withCredentials: boolean) {
    this.config.setSetting('withCredentials', withCredentials);
  }

  /**
   * Executes `changeCsrfConfig` to handle change csrf config.
   * @zh 执行 `changeCsrfConfig`，用于变更Csrf配置。
   * @param disableCsrf - disable csrf parameter (`boolean`) / 禁用Csrf参数（`boolean`）
   */
  changeCsrfConfig(disableCsrf: boolean) {
    this.config.setSetting('disableCsrf', disableCsrf);
    this.commonAuth.changeCsrfConfig(disableCsrf);
  }

  /**
   * Executes `changeHost` to handle change host.
   * @zh 执行 `changeHost`，用于变更宿主。
   * @param host - host parameter (`string`) / 宿主参数（`string`）
   */
  changeHost(host: string) {
    this.config.setSetting('host', host);
    this.commonAuth.changeHost();
  }

  /**
   * Executes `login` to handle login.
   * @zh 执行 `login`，用于login。
   * @param username - username parameter (`string`) / 用户名参数（`string`）
   * @param password - password parameter (`string`) / 密码参数（`string`）
   * @param ticket - ticket parameter (`string`) / ticket参数（`string`）
   * @param rememberMe - remember me parameter (`boolean`) / rememberMe参数（`boolean`）
   */
  login(username: string, password: string, ticket: string, rememberMe: boolean = false) {
    this._login(username, password, ticket).then((response) => {
      if (this.isOauth()) {
        let p = new HttpParams().set(`lt`, ticket);
        this.http.get(this.loader.backend.loginUrl, { 
          params: p,
          withCredentials: true,
         }).subscribe({
          next: (data: { success?; message? }) => {
            if(data.success){
              this.saveRememberMeCookie(rememberMe);
              this.onLogin.next(response);
            }else{
              this.logout();
              this.onLogin.next({
                type:"unauthorized",
                reason: data.message,
                message: data.message
              });
            }
          },
          error: (err: { error?; message? }) => {
            this.logout();
            const msg = err?.error?.message || err?.message || 'Server error';
            this.onLogin.next({
              success: false,
              type: 'unauthorized',
              reason: msg,
              message: msg
            });
          }
         });
      } else {
        this.saveRememberMeCookie(rememberMe);
        this.onLogin.next(response);
      }
    }, (err) => {
      // 登录失败只在这里发一次 onLogin(b8c5e5c 复核)。b8c5e5c 加了这个分支,
      // 但 _login() 的 OAuth 分支里本来也发了一次,OAuth 密码错一次 onLogin 就
      // 收到两条。并且对象要原样透传:oauth2Auth 拒绝时给的是
      // {type:'unauthorized', reason},主应用 login.component 按 type/reason
      // 判断(例如 2FA),包进 message 里它就认不出来了。
      this.onLogin.next(err && typeof err === 'object'
        ? { success: false, ...err }
        : { success: false, message: err });
    });
  }
  /**
   * Executes `_login` to handle login.
   * @zh 执行 `_login`，用于login。
   * @param username - username parameter (`string`) / 用户名参数（`string`）
   * @param password - password parameter (`string`) / 密码参数（`string`）
   * @param ticket - ticket parameter (`string`) / ticket参数（`string`）
   * @returns Result of type `Promise<any>` / 类型为 `Promise<any>` 的返回值
   */
  private _login(username: string, password: string, ticket: string) {
    if (!this.isCredentialValid(username) || !this.isCredentialValid(password)) {
      return Promise.reject('missing username or password');
    }
    if (username) {
      username = username.trim();
    }
    this.username = username;
    if (this.isOauth()) {
      let oauth2AuthPromise = this.oauth2Auth.login(username, password);
        oauth2AuthPromise.then((accessToken) => {
            this.oauth2Auth.pollingRefreshToken();
            this.config.setSetting('accessToken', accessToken);
        },
        () => {
          // 失败由 login() 的 reject 分支统一发 onLogin,这里不再发。
          // 留一个空的 reject 回调,免得这条派生 promise 报 unhandled rejection。
        });
        return oauth2AuthPromise;
    } else {
      const processPromise = this.commonAuth.login(username, password, ticket);
      processPromise.then((ticket) => {
        this.config.setSetting('ticket', ticket);
      },
        () => {
          console.log('login BPM error');
        });
      return processPromise;
    }
  }

  /**
   * Executes `isCredentialValid` to handle is credential valid.
   * @zh 执行 `isCredentialValid`，用于是否为Credential有效。
   * @param credential - credential parameter (`string`) / credential参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isCredentialValid(credential: string): boolean {
    return credential !== undefined && credential !== null && credential !== '';
  }
  /**
   * Executes `implicitLogin` to handle implicit login.
   * @zh 执行 `implicitLogin`，用于implicitLogin。
   * @returns Result of type `Promise<any>` / 类型为 `Promise<any>` 的返回值
   */
  implicitLogin() {
    if (!this.isOauth()) {
      return Promise.reject('Missing the required oauth2 configuration');
    }
    return new Promise(() => {
      this.oauth2Auth.implicitLogin();
    });
  }
  /**
   * Executes `loginTicket` to handle login ticket.
   * @zh 执行 `loginTicket`，用于loginTicket。
   * @param ticket - ticket parameter (`string`) / ticket参数（`string`）
   * @returns Result of type `Promise<any>` / 类型为 `Promise<any>` 的返回值
   */
  loginTicket(ticket: string) {
    this.config.setSetting('ticket', ticket);
    return this.commonAuth.validateTicket();
  }
  /**
   * Executes `logout` to handle logout.
   * @zh 执行 `logout`，用于logout。
   */
  logout(): Promise<void> {
    return this._logout().then((response) => {
      this.onLogout.next(response);
    });
  }
  /**
   * Executes `_logout` to handle logout.
   * @zh 执行 `_logout`，用于logout。
   * @returns Result of type `Promise<any>` / 类型为 `Promise<any>` 的返回值
   */
  _logout(): Promise<LogoutResult> {
    this.username = null;

    if (this.isOauth()) {
        this.oauth2Auth.logOut();
    }
    return this.commonAuth.logout();
  }
  /**
   * Executes `isLoggedIn` to handle is logged in.
   * @zh 执行 `isLoggedIn`，用于是否为Logged在。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isLoggedIn(): boolean {
    if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
      return false;
    }
    if (this.isOauth()) {
      return this.oauth2Auth.isLoggedIn();
    } else {
      return this.commonAuth.isLoggedIn();
    }
  }

  /**
   * Executes `getUsername` to handle get username.
   * @zh 执行 `getUsername`，用于获取用户名。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getUsername(): string {
    if (this.isOauth()) {
      return this.username || this.oauth2Auth.storage.get('USERNAME');
    } else {
      return this.username || this.commonAuth.storage.get('USERNAME');
    }
  }

  /**
   * Executes `refreshToken` to handle refresh token.
   * @zh 执行 `refreshToken`，用于刷新令牌。
   * @returns Result of type `Promise<string>` / 类型为 `Promise<string>` 的返回值
   */
  refreshToken(): Promise<string> {
    // let oauth2 = this.config.getSettings('oauth2');
    // // if (!this.isOauth()) {
    // //   return Promise.reject('Missing the required oauth2 configuration');
    // // }
    // if (oauth2.implicitFlow) {
    //   return Promise.reject('Manual refresh token not possible in implicit flow');
    // }
    return this.oauth2Auth.refreshToken();
  }

  /**
   * Executes `getTicketAuth` to handle get ticket auth.
   * @zh 执行 `getTicketAuth`，用于获取Ticket认证。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getTicketAuth(): string {
    return this.oauth2Auth && this.oauth2Auth.getToken();
  }

  /**
   * Executes `setTicket` to handle set ticket.
   * @zh 执行 `setTicket`，用于集合Ticket。
   * @param Ticket - ticket parameter (`string`) / Ticket参数（`string`）
   */
  setTicket(Ticket: string) {
    if (this.commonAuth) {
      this.commonAuth.setTicket(Ticket);
    }
  }

  /**
   * Executes `invalidateSession` to handle invalidate session.
   * @zh 执行 `invalidateSession`，用于invalidate会话。
   */
  invalidateSession() {
    if (this.oauth2Auth) {
      this.oauth2Auth.invalidateSession();
    } else {
      this.commonAuth.invalidateSession();
    }
  }

  /**
   * Executes `getTicket` to handle get ticket.
   * @zh 执行 `getTicket`，用于获取Ticket。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getTicket(): string {
    return this.commonAuth && this.commonAuth.getTicket();
  }

  /**
   * Executes `getTickets` to handle get tickets.
   * @zh 执行 `getTickets`，用于获取Tickets。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getTickets(): string[] {
    return [this.commonAuth.getTicket()];
  }

  /**
   * Executes `isOauth` to handle is oauth.
   * @zh 执行 `isOauth`，用于是否为Oauth。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isOauth(): boolean {
    return this.config.getSettings('authType') === 'OAUTH';
  }

  /**
   * Executes `isPublicUrl` to handle is public url.
   * @zh 执行 `isPublicUrl`，用于是否为Public链接地址。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isPublicUrl(): boolean {
    let oauth2 = this.config.getSettings('oauth2');
    if (this.isOauth()) {
      return this.oauth2Auth.isPublicUrl(oauth2);
    }
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `isLoggedInWith` to handle is logged in with.
   * @zh 执行 `isLoggedInWith`，用于是否为Logged在带有。
   * @param provider - provider parameter (`string`) / 提供者参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isLoggedInWith(provider: string): boolean {
    return this.isLoggedIn();
  }

  /**
   * Executes `saveRememberMeCookie` to handle save remember me cookie.
   * @zh 执行 `saveRememberMeCookie`，用于保存RememberMeCookie。
   * @param rememberMe - remember me parameter (`boolean`) / rememberMe参数（`boolean`）
   */
  private saveRememberMeCookie(rememberMe: boolean): void {
    let expiration = null;
    if (rememberMe) {
      expiration = new Date();
      const time = expiration.getTime();
      const expireTime = time + REMEMBER_ME_UNTIL;
      expiration.setTime(expireTime);
    }
    this.cookie.setItem(REMEMBER_ME_COOKIE_KEY, '1', expiration, null);
  }

  /**
   * Executes `isRememberMeSet` to handle is remember me set.
   * @zh 执行 `isRememberMeSet`，用于是否为RememberMe集合。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isRememberMeSet(): boolean {
    return (this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) !== null);
  }

  /**
   * Executes `setRedirect` to handle set redirect.
   * @zh 执行 `setRedirect`，用于集合重定向。
   * @param url - url parameter (`RedirectionModel`) / 链接地址参数（`RedirectionModel`）
   */
  setRedirect(url: RedirectionModel) {
    this.redirectUrl = url;
  }

  /**
   * Executes `handleError` to handle handle error.
   * @zh 执行 `handleError`，用于连接手柄错误。
   * @param error - error parameter (`any`) / 错误参数（`any`）
   * @returns Result of type `Observable<any>` / 类型为 `Observable<any>` 的返回值
   */
  handleError(error) {
    this.logService.error('Error when logging in', error);
    return throwError(error || 'Server error');
  }

  /**
   * Executes `getToken` to handle get token.
   * @zh 执行 `getToken`，用于获取令牌。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getToken(): string {
    return this.storageService.get(JwtHelperService.USER_ACCESS_TOKEN);
  }
}
