import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConfigService } from '@dotos/dui/core/config';
import { StorageService } from '@dotos/dui/core/services';
import minimatch from 'minimatch-browser';
import { Subject } from 'rxjs';
import { Authentication } from './model/authentication';
import { JwtHelperService } from "./jwt-helper.service";

declare const Buffer: any;


declare let window: Window;

export class Oauth2Auth  {

    private refreshTokenIntervalPolling: any;
    private refreshTokenTimeoutIframe: any;
    private checkAccessToken: boolean = true;

    hashFragmentParams: any;
    token: string;
    discovery: any = {};

    authentications: Authentication = {
        'oauth2': { accessToken: '' }, type: 'oauth2', 'basicAuth': {}
    };

    iFrameHashListener: any;

    url: string;

    host: string;


    subject: Subject<any> = new Subject<any>();

    constructor(private config: ConfigService, private http: HttpClient, public storage: StorageService, public jwtHelperService: JwtHelperService) {
        if (config) {
            this.setConfig();
        }
    }

    setConfig() {
         let oauth2 =this.config.getSettings('oauth2');

        if (oauth2) {
            if (oauth2.host === undefined || oauth2.host === null) {
                throw 'Missing the required oauth2 host parameter';
            }

            if (oauth2.clientId === undefined || oauth2.clientId === null) {
                throw 'Missing the required oauth2 clientId parameter';
            }

            if (oauth2.scope === undefined || oauth2.scope === null) {
                throw 'Missing the required oauth2 scope parameter';
            }

            if (oauth2.secret === undefined || oauth2.secret === null) {
                oauth2.secret = '';
            }

            if ((oauth2.redirectUri === undefined || oauth2.redirectUri === null) && oauth2.implicitFlow) {
                throw 'Missing redirectUri required parameter';
            }

            if (!oauth2.refreshTokenTimeout) {
                oauth2.refreshTokenTimeout = 300000;
            }

            if (!oauth2.redirectSilentIframeUri) {
                let context = '';
                if (typeof window !== 'undefined') {
                    context = window.location.origin;
                }
                oauth2.redirectSilentIframeUri = context + '/assets/silent-refresh.html';
            }

            this.host = oauth2.host;
            this.discoveryUrls();
            // this.exchangeTicketListener(this.http);
            this.initOauth(oauth2);
        }
    }

    initOauth(oauth2) {
        if (!oauth2.implicitFlow && this.isValidAccessToken()) {
            const accessToken = this.storage.getItem('access_token');
            this.setToken(accessToken, null);
        }
        if (oauth2.implicitFlow) {
            this.checkFragment(oauth2,'nonce');
        }
    }

    discoveryUrls() {
        this.discovery.loginUrl = `${this.host}/oauth2/token`;
        this.discovery.logoutUrl = `${this.host}/oauth2/token`;
        this.discovery.tokenEndpoint = `${this.host}/oauth2/token`;
    }

    checkFragment(oauth2,nonceKey?: string, externalHash?: any): any {
        this.hashFragmentParams = this.getHashFragmentParams(externalHash);
        if (this.hashFragmentParams && this.hashFragmentParams.error === undefined) {
            this.useFragmentTimeLogin(nonceKey);
        } else {
            this.refreshBrowserLogin(oauth2);
        }
    }

    private refreshBrowserLogin(oauth2) {
        if (oauth2.silentLogin && !this.isPublicUrl(oauth2)) {
            this.implicitLogin();
        }
        if (this.isValidToken() && this.isValidAccessToken()) {
            let accessToken = this.storage.getItem('access_token');
            this.setToken(accessToken, null);
            this.silentRefresh();
        }
    }

    private useFragmentTimeLogin(nonceKey: string) {
        let accessToken = this.hashFragmentParams.access_token;
        let idToken = this.hashFragmentParams.id_token;
        let sessionState = this.hashFragmentParams.session_state;
        let expiresIn = this.hashFragmentParams.expires_in;
        if (!sessionState) {
            throw('session state not present');
        }
        try {
            const jwt = this.processJWTToken(idToken, nonceKey);
            if (jwt) {
                this.storeIdToken(idToken, jwt.payload.exp);
                this.storeAccessToken(accessToken, expiresIn);
                this.authentications.basicAuth.username = jwt.payload.preferred_username;
                this.saveUsername(jwt.payload.preferred_username);
                this.silentRefresh();
                return accessToken;
            }
        } catch (error) {
            throw('Validation JWT error' + error);
        }
    }

    isPublicUrl(oauth2): boolean {
        const publicUrls = oauth2.publicUrls || [];
        if (Array.isArray(publicUrls)) {
            return publicUrls.length > 0 &&
                publicUrls.some((urlPattern: string) => minimatch(window.location.href, urlPattern));
        }
        return false;
    }

    padBase64(base64data: any) {
        while (base64data.length % 4 !== 0) {
            base64data += '=';
        }
        return base64data;
    }

    processJWTToken(jwt: any, nonceKey: string): any {
        if (jwt) {
            const jwtArray = jwt.split('.');
            const headerBase64 = this.padBase64(jwtArray[0]);
            const headerJson = this.b64DecodeUnicode(headerBase64);
            const header = JSON.parse(headerJson);

            const payloadBase64 = this.padBase64(jwtArray[1]);
            const payloadJson = this.b64DecodeUnicode(payloadBase64);
            const payload = JSON.parse(payloadJson);

            const savedNonce = this.storage.getItem(nonceKey);

            if (!payload.sub) {
                throw('Missing sub in JWT');
            }

            if (payload.nonce !== savedNonce) {
                console.log('Failing nonce JWT is not corresponding' + payload.nonce);
                return;
            }

            return {
                idToken: jwt,
                payload: payload,
                header: header
            };
        }
    }

    b64DecodeUnicode(b64string: string) {
        const base64 = b64string.replace(/\-/g, '+').replace(/\_/g, '/');
        return decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
    }

    storeIdToken(idToken: string, exp: number) {
        this.storage.setItem('id_token', idToken);
        this.storage.setItem('id_token_expires_at', Number(exp * 1000).toString());
        this.storage.setItem('id_token_stored_at', Date.now().toString());
    }

    storeAccessToken(accessToken: string, expiresIn: number, refreshToken?: string) {
        this.storage.setItem('access_token', accessToken);
        const expiresInMilliSeconds = expiresIn * 1000;
        const now = new Date();
        const expiresAt = now.getTime() + expiresInMilliSeconds;
        this.storage.setItem('access_token_expires_in', expiresAt+"");
        this.storage.setItem('access_token_stored_at', Date.now().toString());
        this.setToken(accessToken, refreshToken);
    }

    saveUsername(username: string) {
         this.storage.setItem('USERNAME', username);
    }

    implicitLogin() {
        if (!this.isValidToken() || !this.isValidAccessToken()) {
            this.redirectLogin();
        }
    }

    isValidToken(): boolean {
        let validToken = false;
        if (this.getIdToken()) {
            let expiresAt = this.storage.getItem('id_token_expires_at'),
                now = new Date();
            if (expiresAt && parseInt(expiresAt, 10) >= now.getTime()) {
                validToken = true;
            }
        }
        return validToken;
    }

    isValidAccessToken(): boolean {
        let validAccessToken = false;
        if (this.getAccessToken()) {
            const expiresAt = this.storage.getItem('access_token_expires_in');
            const now = new Date();
            if (expiresAt && parseInt(expiresAt, 10) >= now.getTime()) {
                validAccessToken = true;
            }
        }
        return validAccessToken;
    }

    getIdToken(): string {
        return this.storage.getItem('id_token');
    }

    getAccessToken(): string {
        return this.storage.getItem('access_token');
    }

    redirectLogin(): void {
      let oauth2 =this.config.getSettings('oauth2');
        if (oauth2.implicitFlow && typeof window !== 'undefined') {
            let href = this.composeImplicitLoginUrl();
            window.location.href = href;
            this.subject.next({type:'implicit_redirect',value:href});
        }
    }

    isRedirectionUrl() {
        return window.location.hash && window.location.hash.split('&')[0].indexOf('session_state') === -1;
    }

    genNonce(): string {
        let text = '';
        const possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 40; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    composeImplicitLoginUrl(): string {
       let oauth2 =this.config.getSettings('oauth2');
        let nonce = this.genNonce();
        this.storage.setItem('nonce', nonce);
        const afterLoginUriSegment = this.isRedirectionUrl() ? window.location.hash.split('&')[0] : '';
        if (afterLoginUriSegment && afterLoginUriSegment !== '/') {
            this.storage.setItem('loginFragment', afterLoginUriSegment.replace('#', '').trim());
        }
        let separation = this.discovery.loginUrl.indexOf('?') > -1 ? '&' : '?';
        return this.discovery.loginUrl +
            separation +
            'client_id=' +
            encodeURIComponent(oauth2.clientId) +
            '&scope=' +
            encodeURIComponent(oauth2.scope) +
            '&response_type=' +
            encodeURIComponent('id_token token') +
            '&nonce=' +
            encodeURIComponent(nonce);
    }

    composeIframeLoginUrl(): string {
        let nonce = this.genNonce();
        let oauth2 =this.config.getSettings('oauth2');
        this.storage.setItem('refresh_nonce', nonce);

        let separation = this.discovery.loginUrl.indexOf('?') > -1 ? '&' : '?';

        return this.discovery.loginUrl +
            separation +
            'client_id=' +
            encodeURIComponent(oauth2.clientId) +
            '&scope=' +
            encodeURIComponent(oauth2.scope) +
            '&response_type=' +
            encodeURIComponent('id_token token') +
            '&nonce=' +
            encodeURIComponent(nonce) +
            '&prompt=none';
    }

    hasHashCharacter(hash: string): boolean {
        return hash.indexOf('#') === 0;
    }

    startWithHashRoute(hash: string) {
        return hash.startsWith('#/');
    }

    getHashFragmentParams(externalHash: string): string {
        let hashFragmentParams = null;
        if (typeof window !== 'undefined') {
            let hash;
            if (!externalHash) {
                hash = decodeURIComponent(window.location.hash);
                if (!this.startWithHashRoute(hash)) {
                    window.location.hash = '';
                }
            } else {
                hash = decodeURIComponent(externalHash);
                this.removeHashFromSilentIframe();
                this.destroyIframe();
            }

            if (this.hasHashCharacter(hash) && !this.startWithHashRoute(hash)) {
                const questionMarkPosition = hash.indexOf('?');
                if (questionMarkPosition > -1) {
                    hash = hash.substr(questionMarkPosition + 1);
                } else {
                    hash = hash.substr(1);
                }
                hashFragmentParams = this.parseQueryString(hash);
            }
        }
        return hashFragmentParams;
    }

    parseQueryString(queryString: string): any {
        const data: { [key: string]: Object } = {};
        let pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

        if (queryString !== null) {
            pairs = queryString.split('&');

            for (let i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                separatorIndex = pair.indexOf('=');

                if (separatorIndex === -1) {
                    escapedKey = pair;
                    escapedValue = null;
                } else {
                    escapedKey = pair.substr(0, separatorIndex);
                    escapedValue = pair.substr(separatorIndex + 1);
                }

                key = decodeURIComponent(escapedKey);
                value = decodeURIComponent(escapedValue);

                if (key.substr(0, 1) === '/') {
                    key = key.substr(1);
                }

                data[key] = value;
            }
        }

        return data;
    }

    silentRefresh(): void {
      let oauth2 =this.config.getSettings('oauth2');
        if (typeof document === 'undefined') {
            this.pollingRefreshToken();
            return;
        }
        if (this.checkAccessToken) {
            this.destroyIframe();
            this.createIframe();
            this.checkAccessToken = false;
            return;
        }
        this.refreshTokenTimeoutIframe = setTimeout(() => {
            this.destroyIframe();
            this.createIframe();
        }, oauth2.refreshTokenTimeout);
    }

    removeHashFromSilentIframe() {
        let iframe: any = document.getElementById('silent_refresh_token_iframe');
        if (iframe && iframe.contentWindow.location.hash) {
            iframe.contentWindow.location.hash = '';
        }
    }

    createIframe() {
        const iframe = document.createElement('iframe');
        iframe.id = 'silent_refresh_token_iframe';
        let loginUrl = this.composeIframeLoginUrl();
        iframe.setAttribute('src', loginUrl);
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        this.iFrameHashListener = () => {
            let silentRefreshTokenIframe: any = document.getElementById('silent_refresh_token_iframe');
            let hash = silentRefreshTokenIframe.contentWindow.location.hash;
            try {
                this.checkFragment('refresh_nonce', hash);
            } catch (e) {
                this.logOut();
            }
        };

        iframe.addEventListener('load', this.iFrameHashListener);
    }

    destroyIframe() {
        const iframe = document.getElementById('silent_refresh_token_iframe');

        if (iframe) {
            iframe.removeEventListener('load', this.iFrameHashListener);
            document.body.removeChild(iframe);
        }
    }

    login(username: string, password: string): Promise<any> {
      let oauth2 =this.config.getSettings('oauth2');
      this.invalidateSession();

      const body = new HttpParams()
        .set("grant_type", "password")
        .set('username', username)
        .set('password', password)
        .set("client_id", oauth2.clientId)
        .set('client_secret', oauth2.secret)
       ;


        let promise = new Promise((resolve, reject) => {
           this.http.post<any>(this.discovery.loginUrl, body
        ).toPromise().then(
                (data: any) => {
                    this.saveUsername(username);
                     this.storeAccessToken(data.access_token, data.expires_in, data.refresh_token);
                     let userId=this.jwtHelperService.getValueFromToken(data.access_token,'userId');
                     let fullName=this.jwtHelperService.getValueFromToken(data.access_token,'fullName');
                     let userName=this.jwtHelperService.getValueFromToken(data.access_token,'userName');
                    data['userId']=userId;
                    data['fullName']=fullName;
                    data['userName']=userName;
                    resolve(data);
                },
                (error) => {
                    if (error.error && (error.status === 400 || error.status === 401)) {
                        this.subject.next({type:'unauthorized',reason:error.error.error_description});
                    }
                     reject({type:'unauthorized',reason:error.error.error_description});
                });
        });
        return promise;
    }
    pollingRefreshToken() {
      let oauth2 =this.config.getSettings('oauth2');
        this.refreshTokenIntervalPolling = setInterval(async () => {
            try {
                await this.refreshToken();
            } catch (e) {
            }
        }, oauth2.refreshTokenTimeout);
        this.refreshTokenIntervalPolling.unref();
    }
    refreshToken(): Promise<any> {
      let oauth2 =this.config.getSettings('oauth2');
        let auth = 'Basic ' + this.universalBtoa(oauth2.clientId + ':' + oauth2.secret);
        let headers:HttpHeaders=new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': auth,
          responseType: 'json'
        });
       let formParams = {
            grant_type: 'refresh_token',
            refresh_token: this.authentications.oauth2.refreshToken
        };
        let promise = new Promise((resolve, reject) => {
          this.http.post(
                this.discovery.tokenEndpoint,
                 {fromObject:formParams},
                 {headers:headers}
            ).toPromise().then(
                (data: any) => {
                    this.setToken(data.access_token, data.refresh_token);
                    resolve(data);
                },
                (error) => {
                    if (error.error && (error.status === 401||error.status === 400)) {
                        this.subject.next('unauthorized');
                    }
                    // this.subject.next('error');
                    // reject(error.error);
                });
        });
        return promise;
    }

    universalBtoa(stringToConvert: string) {
        try {
            return window.btoa(stringToConvert);
        } catch (err) {
            return Buffer.from(stringToConvert).toString('base64');
        }
    }
    setToken(token: string, refreshToken: string) {
        this.authentications.oauth2.accessToken = token;
        this.authentications.oauth2.refreshToken = refreshToken;
        this.authentications.basicAuth.password = null;
        this.token = token;
        if (token) {
          this.subject.next('token_issued');
        }
    }
    getToken(): string {
        return this.token;
    }
    getAuthentication(): Authentication {
        return this.authentications;
    }
    changeHost(host: string) {
        this.config.setSetting('hostOauth2', host);
    }
    isLoggedIn(): boolean {
        return !!this.authentications.oauth2.accessToken;
    }
     logOut() {
        let oauth2 =this.config.getSettings('oauth2');
        this.checkAccessToken = true;
        const id_token = this.getIdToken();
        this.invalidateSession();
        this.setToken(null, null);
        if (id_token != null && oauth2.implicitFlow && typeof window !== 'undefined') {
          let separation = this.discovery.logoutUrl.indexOf('?') > -1 ? '&' : '?';
          let redirectLogout = oauth2.redirectUriLogout || oauth2.redirectUri;
          let logoutUrl = this.discovery.logoutUrl +
              separation +
              'post_logout_redirect_uri=' +
              encodeURIComponent(redirectLogout) +
              '&id_token_hint=' +
              encodeURIComponent(id_token);
            window.location.href = logoutUrl;
        }
    }

    invalidateSession() {
        clearTimeout(this.refreshTokenTimeoutIframe);
        clearInterval(this.refreshTokenIntervalPolling);
        this.storage.removeItem('access_token');
        this.storage.removeItem('access_token_expires_in');
        this.storage.removeItem('access_token_stored_at');
        this.storage.removeItem('id_token');
        this.storage.removeItem('id_token');
        this.storage.removeItem('id_token_claims_obj');
        this.storage.removeItem('id_token_expires_at');
        this.storage.removeItem('id_token_stored_at');
        this.storage.removeItem('nonce');
    }
}
