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

const REMEMBER_ME_COOKIE_KEY = 'DOTOS_REMEMBER_ME';
const REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauth2Auth: Oauth2Auth;
  commonAuth: CommonAuth;

  username: string;

  private redirectUrl: RedirectionModel = null;

  onLogin: Subject<any> = new Subject<any>();
  onLogout: Subject<any> = new Subject<any>();

  public _redirectUrl: string;
  public userId: string;

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
  getUserId(): string {
    return this.userId;
  }

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

  getAuthenticated(): Observable<any> {
    return this.http.get(this.loader.backend.endpoint, { withCredentials: true });
  }

  getRegistered(): Observable<any> {
    return this.http.get(this.loader.backend.registerUrl, { withCredentials: true });
  }

  changeWithCredentialsConfig(withCredentials: boolean) {
    this.config.setSetting('withCredentials', withCredentials);
  }

  changeCsrfConfig(disableCsrf: boolean) {
    this.config.setSetting('disableCsrf', disableCsrf);
    this.commonAuth.changeCsrfConfig(disableCsrf);
  }

  changeHost(host: string) {
    this.config.setSetting('host', host);
    this.commonAuth.changeHost();
  }

  login(username: string, password: string, ticket: string, rememberMe: boolean = false) {
    this._login(username, password, ticket).then((response: any) => {
      if (this.isOauth()) {
        let p = new HttpParams().set(`lt`, ticket);
        this.http.get(this.loader.backend.loginUrl, { 
          params: p,
          withCredentials: true,
         }).subscribe({
          next: (data: any) => {
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
          error: (err: any) => {
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
  private _login(username: string, password: string, ticket: string): Promise<any> {
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

  isCredentialValid(credential: string): boolean {
    return credential !== undefined && credential !== null && credential !== '';
  }
  implicitLogin(): Promise<any> {
    if (!this.isOauth()) {
      return Promise.reject('Missing the required oauth2 configuration');
    }
    return new Promise(() => {
      this.oauth2Auth.implicitLogin();
    });
  }
  loginTicket(ticket: string): Promise<any> {
    this.config.setSetting('ticket', ticket);
    return this.commonAuth.validateTicket();
  }
  logout() {
    return this._logout().then((response) => {
      this.onLogout.next(response);
    });
  }
  _logout(): Promise<any> {
    this.username = null;

    if (this.isOauth()) {
        this.oauth2Auth.logOut();
    }
    return this.commonAuth.logout();
  }
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

  getUsername(): string {
    if (this.isOauth()) {
      return this.username || this.oauth2Auth.storage.get('USERNAME');
    } else {
      return this.username || this.commonAuth.storage.get('USERNAME');
    }
  }

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

  getTicketAuth(): string {
    return this.oauth2Auth && this.oauth2Auth.getToken();
  }

  setTicket(Ticket: string) {
    if (this.commonAuth) {
      this.commonAuth.setTicket(Ticket);
    }
  }

  invalidateSession() {
    if (this.oauth2Auth) {
      this.oauth2Auth.invalidateSession();
    } else {
      this.commonAuth.invalidateSession();
    }
  }

  getTicket(): string {
    return this.commonAuth && this.commonAuth.getTicket();
  }

  getTickets(): string[] {
    return [this.commonAuth.getTicket()];
  }

  isOauth(): boolean {
    return this.config.getSettings('authType') === 'OAUTH';
  }

  isPublicUrl(): boolean {
    let oauth2 = this.config.getSettings('oauth2');
    if (this.isOauth()) {
      return this.oauth2Auth.isPublicUrl(oauth2);
    }
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoggedInWith(provider: string): boolean {
    return this.isLoggedIn();
  }

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

  isRememberMeSet(): boolean {
    return (this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) !== null);
  }

  setRedirect(url: RedirectionModel) {
    this.redirectUrl = url;
  }

  handleError(error: any): Observable<any> {
    this.logService.error('Error when logging in', error);
    return throwError(error || 'Server error');
  }

  getToken(): string {
    return this.storageService.get(JwtHelperService.USER_ACCESS_TOKEN);
  }
}
