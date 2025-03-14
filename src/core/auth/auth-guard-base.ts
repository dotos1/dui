
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppConfigValues, ConfigService } from '@dotos/dui/core/config';

import { AuthService } from './auth.service';
import { OauthConfigModel } from './model';
import { LocalStorageService } from '@dotos/dui/core/storage';

export abstract class AuthGuardBase  {

  protected get withCredentials(): boolean {
    return this.appConfigService.get<boolean>(
      'auth.withCredentials',
      false
    );
  }

  constructor(
    protected authenticationService: AuthService,
    protected router: Router,
    protected appConfigService: ConfigService,
    protected dialog: MatDialog,
    private storageService: LocalStorageService
  ) {
  }

  abstract checkLogin(
    activeRoute: ActivatedRouteSnapshot,
    redirectUrl: string
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticationService.isLoggedIn() && this.authenticationService.isOauth() && this.isLoginFragmentPresent()) {
      return this.redirectSSOSuccessURL();
    }
    return this.checkLogin(route, state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route, state);
  }

  protected async redirectSSOSuccessURL(): Promise<boolean | UrlTree> {
    const redirectFragment:string = this.storageService.get('loginFragment') ;
    if (redirectFragment && this.getLoginRoute() !== redirectFragment) {
      await this.navigate(redirectFragment);
      this.storageService.remove('loginFragment');
      return false;
    }
    return true;
  }

  protected isLoginFragmentPresent(): boolean {
    return !!this.storageService.get('loginFragment');
  }

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

  protected async navigate(url: string): Promise<boolean> {
    this.dialog.closeAll();
    await this.router.navigateByUrl(this.router.parseUrl(url));
    return false;
  }

  protected getOauthConfig(): OauthConfigModel {
    return (
      this.appConfigService &&
      this.appConfigService.get<OauthConfigModel>(
        AppConfigValues.OAUTHCONFIG,
        null
      )
    );
  }

  protected getLoginRoute(): string {
    return (
      this.appConfigService &&
      this.appConfigService.get<string>(
        AppConfigValues.LOGIN_ROUTE,
        'login'
      )
    );
  }

  protected getProvider(): string {
    return (
      this.appConfigService &&
      this.appConfigService.get<string>(
        AppConfigValues.PROVIDERS,
        'ALL'
      )
    );
  }

  protected isOAuthWithoutSilentLogin(): boolean {
    const oauth = this.appConfigService.get<OauthConfigModel>(
      AppConfigValues.OAUTHCONFIG,
      null
    );
    return (
      this.authenticationService.isOauth() && !!oauth && !oauth.silentLogin
    );
  }

  protected isSilentLogin(): boolean {
    const oauth = this.appConfigService.get<OauthConfigModel>(
      AppConfigValues.OAUTHCONFIG,
      null
    );
    return this.authenticationService.isOauth() && oauth && oauth.silentLogin;
  }
}
