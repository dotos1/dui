/**
 * @fileoverview Module `src/core/auth/CommonAuth.ts` providing common auth definitions and implementation.
 * @zh 模块文件 `src/core/auth/CommonAuth.ts`，提供通用认证相关的定义与实现。
 */


import { LogoutResult } from './logout-result';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from  '@dotos/dui/core/config';

import { AuthLoader } from './auth.loader';
import { Authentication } from './model/authentication';
import { LocalStorageService } from '@dotos/dui/core/storage';

/**
 * Class `CommonAuth` encapsulating common auth data structures and logic in `src/core/auth`.
 * @zh 类 `CommonAuth`，封装 `src/core/auth` 中的通用认证数据结构与处理逻辑。
 */
export class CommonAuth  {

    /**
     * Property `ticket` (`string`) storing ticket.
     * @zh 属性 `ticket`（类型：`string`），用于存储或配置ticket。
     */
    ticket: string;

    /**
     * Property `authentications` (`Authentication`) storing authentications (default: `{ 'basicAuth': { ticket: '' } }`).
     * @zh 属性 `authentications`（类型：`Authentication`），用于存储或配置身份认证（默认值：`{ 'basicAuth': { ticket: '' } }`）。
     */
    authentications: Authentication = {
        'basicAuth': { ticket: '' }
    };

    /**
     * Creates an instance of `CommonAuth` and initializes its dependencies and internal state.
     * @zh 创建 `CommonAuth` 实例，并初始化其依赖项与内部状态。
     * @param config - Injected or initial config (`ConfigService`) / 注入或传入的配置（`ConfigService`）
     * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
     * @param loader - Injected or initial loader (`AuthLoader`) / 注入或传入的加载器（`AuthLoader`）
     * @param storage - Injected or initial storage (`LocalStorageService`) / 注入或传入的存储（`LocalStorageService`）
     */
    constructor(
      private config: ConfigService,
      private http: HttpClient,
      private  readonly loader: AuthLoader,
      public storage: LocalStorageService
      ) {
        this.setConfig();
    }
    /**
     * Executes `setConfig` to handle set config.
     * @zh 执行 `setConfig`，用于集合配置。
     */
    setConfig() {
        this.ticket = undefined;
        if (this.config.getSettings('ticket')) {
            this.setTicket(this.config.getSettings('ticket'));
        } else if (this.storage.get('ticket')) {
            this.setTicket(this.storage.get('ticket'));
        }
    }

    /**
     * Executes `changeHost` to handle change host.
     * @zh 执行 `changeHost`，用于变更宿主。
     */
    changeHost() {
        this.ticket = undefined;
    }

    /**
     * Executes `changeCsrfConfig` to handle change csrf config.
     * @zh 执行 `changeCsrfConfig`，用于变更Csrf配置。
     * @param disableCsrf - disable csrf parameter (`boolean`) / 禁用Csrf参数（`boolean`）
     */
    changeCsrfConfig(disableCsrf: boolean) {
        this.config.setSetting('disableCsrf',disableCsrf);
    }

    /**
     * Executes `saveUsername` to handle save username.
     * @zh 执行 `saveUsername`，用于保存用户名。
     * @param username - username parameter (`string`) / 用户名参数（`string`）
     */
    saveUsername(username: string) {
       this.storage.set('USERNAME', username);
    }
    /**
     * Executes `validateTicket` to handle validate ticket.
     * @zh 执行 `validateTicket`，用于校验Ticket。
     * @returns Result of type `Promise<unknown>` / 类型为 `Promise<unknown>` 的返回值
     */
    validateTicket() {
      this.setTicket(this.config.getSettings('ticket'));
      let promise = new Promise((resolve, reject) => {
          this._validateTicket().then((data: { entry? }) => {
                  this.setTicket(data.entry.id);
                  resolve(data.entry.id);
              },
               (error) => {
                  reject(error);
              });
      });
      return promise;
  }
  /**
   * Executes `_validateTicket` to handle validate ticket.
   * @zh 执行 `_validateTicket`，用于校验Ticket。
   * @returns Result of type `Promise<Object>` / 类型为 `Promise<Object>` 的返回值
   */
  _validateTicket() {
      let headers:HttpHeaders=new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      });
        return this.http.get(
            '/tickets/-me-',{
              headers: headers
         } ).toPromise();
    }

    /**
     * Executes `login` to handle login.
     * @zh 执行 `login`，用于登录。
     * @param username - username parameter (`string`) / 用户名参数（`string`）
     * @param password - password parameter (`string`) / 密码参数（`string`）
     * @param ticket - ticket parameter (`string`) / ticket参数（`string`）
     * @returns Result of type `Promise<unknown>` / 类型为 `Promise<unknown>` 的返回值
     */
    login(username: string, password: string, ticket: string) {
        this.authentications.basicAuth.username = username;
        this.authentications.basicAuth.password = password;

        const body = new HttpParams()
        .set(`username`,  this.authentications.basicAuth.username)
        .set(`password`, this.authentications.basicAuth.password)
        .set(`remember_me`, "true")
        .set(`lt`, ticket);

        let headers:HttpHeaders=new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
          responseType: 'json'
        });
        this.loader.storage.removeItem(this.loader.storageKey);
        let promise = new Promise((resolve, reject) => {
           this.http.post(
                  this.loader.backend.loginUrl, body,{
                  headers:headers
                }
            ).toPromise().then(
                () => {
                    this.saveUsername(username);
                    let ticket = this.basicAuth(
                      this.authentications.basicAuth.username,  this.authentications.basicAuth.password);
                    this.setTicket(ticket);
                    resolve(ticket);
                },
                (error) => {
                    this.authentications.basicAuth.password = null;
                    this.saveUsername('');
                    reject(error);
                });
        });
        return promise;
    }

    /**
     * Executes `basicAuth` to handle basic auth.
     * @zh 执行 `basicAuth`，用于basic认证。
     * @param username - username parameter (`string`) / 用户名参数（`string`）
     * @param password - password parameter (`string`) / 密码参数（`string`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    basicAuth(username: string, password: string): string {
      const str = username + ':' + password;
      let base64;
      //@ts-ignore
      if (typeof Buffer === 'function') {
           //@ts-ignore
          base64 = Buffer.from(str.toString(), 'binary').toString('base64');
      } else {
          base64 = btoa(str);
      }
      return 'Basic ' + base64;
  }
  /**
   * Executes `logout` to handle logout.
   * @zh 执行 `logout`，用于logout。
   * @returns Result of type `Promise<LogoutResult>` / 类型为 `Promise<LogoutResult>` 的返回值
   */
  logout(): Promise<LogoutResult> {
        this.saveUsername('');
        let headers:HttpHeaders=new HttpHeaders({
          'Content-Type': 'application/json',
          responseType: 'json'
        });
        let promise = new Promise<LogoutResult>((resolve, reject) => {
          this.http.get<LogoutResult>(
                this.loader.backend.logoutApi,
                {
                  withCredentials: true,
                  headers:headers
                }
            ).toPromise().then(
                (response) => {
                    this.invalidateSession();
                    this.loader.storage.removeItem(this.loader.storageKey);
                    resolve(response);
                },
                (error) => {
                    this.invalidateSession();
                    this.loader.storage.removeItem(this.loader.storageKey);
                    reject(error);
                });
        });
        return promise;
    }

    /**
     * Executes `setTicket` to handle set ticket.
     * @zh 执行 `setTicket`，用于集合Ticket。
     * @param ticket - ticket parameter (`string`) / ticket参数（`string`）
     */
    setTicket(ticket: string) {
        this.authentications.basicAuth.ticket = ticket;
        this.authentications.basicAuth.password = null;
        this.config.setSetting('ticket',ticket);
        this.storage.set('ticket', ticket);
        this.ticket = ticket;
    }

    /**
     * Executes `invalidateSession` to handle invalidate session.
     * @zh 执行 `invalidateSession`，用于invalidate会话。
     */
    invalidateSession() {
        this.storage.remove('ticket');
        this.authentications.basicAuth.ticket = null;
        this.authentications.basicAuth.password = null;
        this.authentications.basicAuth.username = null;
        this.config.setSetting('ticket',null);
        this.ticket = null;
    }

    /**
     * Executes `getTicket` to handle get ticket.
     * @zh 执行 `getTicket`，用于获取Ticket。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    getTicket(): string {
        return this.ticket;
    }

    /**
     * Executes `isLoggedIn` to handle is logged in.
     * @zh 执行 `isLoggedIn`，用于是否为Logged在。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isLoggedIn(): boolean {
        return !!this.ticket;
    }

    /**
     * Executes `getAuthentication` to handle get authentication.
     * @zh 执行 `getAuthentication`，用于获取身份认证。
     * @returns Result of type `Authentication` / 类型为 `Authentication` 的返回值
     */
    getAuthentication() {
        return  this.authentications;
    }
}
