/**
 * @fileoverview Module `src/core/auth/oauth2Auth.ts` providing oauth2 auth definitions and implementation.
 * @zh 模块文件 `src/core/auth/oauth2Auth.ts`，提供oauth2认证相关的定义与实现。
 */

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConfigService } from '@dotos1/dui/core/config';
import minimatch from 'minimatch-browser';
import { Subject } from 'rxjs';
import { Authentication } from './model/authentication';
import { JwtHelperService } from "./jwt-helper.service";
import { LocalStorageService } from "@dotos1/dui/core/storage";

/**
 * Constant/variable `Buffer` defining buffer in `src/core/auth`.
 * @zh 常量/变量 `Buffer`，定义 `src/core/auth` 中的缓冲区。
 */
declare const Buffer;


/**
 * Constant/variable `window` defining window in `src/core/auth`.
 * @zh 常量/变量 `window`，定义 `src/core/auth` 中的窗口。
 */
declare let window: Window;

/**
 * Class `Oauth2Auth` encapsulating oauth2 auth data structures and logic in `src/core/auth`.
 * @zh 类 `Oauth2Auth`，封装 `src/core/auth` 中的Oauth2认证数据结构与处理逻辑。
 */
export class Oauth2Auth  {

    /**
     * Property `refreshTokenIntervalPolling` (`any`) storing refresh token interval polling.
     * @zh 属性 `refreshTokenIntervalPolling`（类型：`any`），用于存储或配置刷新令牌间隔定时器Polling。
     */
    private refreshTokenIntervalPolling;
    /**
     * Property `refreshTokenTimeoutIframe` (`any`) storing refresh token timeout iframe.
     * @zh 属性 `refreshTokenTimeoutIframe`（类型：`any`），用于存储或配置刷新令牌延时器Iframe。
     */
    private refreshTokenTimeoutIframe;
    /**
     * Property `checkAccessToken` (`boolean`) storing check access token (default: `true`).
     * @zh 属性 `checkAccessToken`（类型：`boolean`），用于存储或配置检查Access令牌（默认值：`true`）。
     */
    private checkAccessToken: boolean = true;

    /**
     * Property `hashFragmentParams` (`any`) storing hash fragment params.
     * @zh 属性 `hashFragmentParams`（类型：`any`），用于存储或配置hashFragment参数集合。
     */
    hashFragmentParams;
    /**
     * Property `token` (`string`) storing token.
     * @zh 属性 `token`（类型：`string`），用于存储或配置令牌。
     */
    token: string;
    /**
     * Property `discovery` (`{ loginUrl?: any; logoutUrl?: any; tokenEndpoint?: any; }`) storing discovery (default: `{}`).
     * @zh 属性 `discovery`（类型：`{ loginUrl?: any; logoutUrl?: any; tokenEndpoint?: any; }`），用于存储或配置discovery（默认值：`{}`）。
     */
    discovery: { loginUrl?; logoutUrl?; tokenEndpoint? } = {};

    /**
     * Property `authentications` (`Authentication`) storing authentications.
     * @zh 属性 `authentications`（类型：`Authentication`），用于存储或配置身份认证。
     */
    authentications: Authentication = {
        'oauth2': { accessToken: '' }, type: 'oauth2', 'basicAuth': {}
    };

    /**
     * Property `iFrameHashListener` (`any`) storing i frame hash listener.
     * @zh 属性 `iFrameHashListener`（类型：`any`），用于存储或配置i框架Hash监听器。
     */
    iFrameHashListener;

    /**
     * Property `url` (`string`) storing url.
     * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
     */
    url: string;

    /**
     * Property `host` (`string`) storing host.
     * @zh 属性 `host`（类型：`string`），用于存储或配置宿主。
     */
    host: string;


    /**
     * Property `subject` (`Subject<unknown>`) storing subject (default: `new Subject<any>()`).
     * @zh 属性 `subject`（类型：`Subject<unknown>`），用于存储或配置主题流（默认值：`new Subject<any>()`）。
     */
    subject = new Subject();

    /**
     * Creates an instance of `Oauth2Auth` and initializes its dependencies and internal state.
     * @zh 创建 `Oauth2Auth` 实例，并初始化其依赖项与内部状态。
     * @param config - Injected or initial config (`ConfigService`) / 注入或传入的配置（`ConfigService`）
     * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
     * @param storage - Injected or initial storage (`LocalStorageService`) / 注入或传入的存储（`LocalStorageService`）
     * @param jwtHelperService - Injected or initial jwt helper service (`JwtHelperService`) / 注入或传入的jwt辅助工具服务（`JwtHelperService`）
     */
    constructor(private config: ConfigService,
         private http: HttpClient, 
        public storage: LocalStorageService, public jwtHelperService: JwtHelperService) {
        if (config) {
            this.setConfig();
        }
    }

    /**
     * Executes `setConfig` to handle set config.
     * @zh 执行 `setConfig`，用于集合配置。
     */
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

    /**
     * Executes `initOauth` to handle init oauth.
     * @zh 执行 `initOauth`，用于初始化Oauth。
     * @param oauth2 - oauth2 parameter (`any`) / oauth2参数（`any`）
     */
    initOauth(oauth2) {
        if (!oauth2.implicitFlow) {
            const refreshToken = this.storage.get('refresh_token') as string;
            if (this.isValidAccessToken()) {
                const accessToken = this.storage.get('access_token') as string;
                this.setToken(accessToken, refreshToken); // 传给 setToken，而不是传 null
                // A restored (not freshly logged-in) access token needs its refresh polling
                // re-armed too -- otherwise it silently expires on the first page reload after
                // login, since the interval that would have renewed it doesn't survive a reload.
                this.pollingRefreshToken();
            } else if (refreshToken) {
                // Access token is missing/expired (e.g. tab was closed for longer than the
                // access token's lifetime) but a still-valid refresh token survived in
                // storage -- use it to mint a fresh access token instead of forcing the user
                // back to the login page. refreshToken() itself calls logOut() if the
                // server rejects it (expired/revoked refresh token).
                this.authentications.oauth2.refreshToken = refreshToken;
                this.refreshToken()
                    .then(() => this.pollingRefreshToken())
                    .catch(() => { });
            }
        }
        if (oauth2.implicitFlow) {
            this.checkFragment(oauth2, 'nonce');
        }
    }

    /**
     * Executes `discoveryUrls` to handle discovery urls.
     * @zh 执行 `discoveryUrls`，用于discovery链接列表。
     */
    discoveryUrls() {
        this.discovery.loginUrl = `${this.host}/oauth2/token`;
        this.discovery.logoutUrl = `${this.host}/oauth2/token`;
        this.discovery.tokenEndpoint = `${this.host}/oauth2/token`;
    }

    /**
     * Executes `checkFragment` to handle check fragment.
     * @zh 执行 `checkFragment`，用于检查Fragment。
     * @param oauth2 - oauth2 parameter (`any`) / oauth2参数（`any`）
     * @param nonceKey - nonce key parameter (`string`) / nonce键参数（`string`）
     * @param externalHash - external hash parameter (`any`) / 外部Hash参数（`any`）
     * @returns Result of type `void` / 类型为 `void` 的返回值
     */
    checkFragment(oauth2,nonceKey?: string, externalHash?) {
        this.hashFragmentParams = this.getHashFragmentParams(externalHash);
        if (this.hashFragmentParams && this.hashFragmentParams.error === undefined) {
            this.useFragmentTimeLogin(nonceKey);
        } else {
            this.refreshBrowserLogin(oauth2);
        }
    }

    /**
     * Executes `refreshBrowserLogin` to handle refresh browser login.
     * @zh 执行 `refreshBrowserLogin`，用于刷新浏览器Login。
     * @param oauth2 - oauth2 parameter (`any`) / oauth2参数（`any`）
     */
    private refreshBrowserLogin(oauth2) {
        if (oauth2.silentLogin && !this.isPublicUrl(oauth2)) {
            this.implicitLogin();
        }
        if (this.isValidToken() && this.isValidAccessToken()) {
            let accessToken :string= this.storage.get('access_token');
            this.setToken(accessToken, null);
            this.silentRefresh();
        }
    }

    /**
     * Executes `useFragmentTimeLogin` to handle use fragment time login.
     * @zh 执行 `useFragmentTimeLogin`，用于使用Fragment时间Login。
     * @param nonceKey - nonce key parameter (`string`) / nonce键参数（`string`）
     */
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

    /**
     * Executes `isPublicUrl` to handle is public url.
     * @zh 执行 `isPublicUrl`，用于是否为Public链接地址。
     * @param oauth2 - oauth2 parameter (`any`) / oauth2参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isPublicUrl(oauth2): boolean {
        const publicUrls = oauth2.publicUrls || [];
        if (Array.isArray(publicUrls)) {
            return publicUrls.length > 0 &&
                publicUrls.some((urlPattern: string) => minimatch(window.location.href, urlPattern));
        }
        return false;
    }

    /**
     * Executes `padBase64` to handle pad base64.
     * @zh 执行 `padBase64`，用于padBase64。
     * @param base64data - base64data parameter (`any`) / base64data参数（`any`）
     */
    padBase64(base64data) {
        while (base64data.length % 4 !== 0) {
            base64data += '=';
        }
        return base64data;
    }

    /**
     * Executes `processJWTToken` to handle process jwt token.
     * @zh 执行 `processJWTToken`，用于处理JWT令牌。
     * @param jwt - jwt parameter (`any`) / jwt参数（`any`）
     * @param nonceKey - nonce key parameter (`string`) / nonce键参数（`string`）
     * @returns Result of type `{ idToken: any; payload: any; header: any; }` / 类型为 `{ idToken: any; payload: any; header: any; }` 的返回值
     */
    processJWTToken(jwt, nonceKey: string) {
        if (jwt) {
            const jwtArray = jwt.split('.');
            const headerBase64 = this.padBase64(jwtArray[0]);
            const headerJson = this.b64DecodeUnicode(headerBase64);
            const header = JSON.parse(headerJson);

            const payloadBase64 = this.padBase64(jwtArray[1]);
            const payloadJson = this.b64DecodeUnicode(payloadBase64);
            const payload = JSON.parse(payloadJson);

            const savedNonce = this.storage.get(nonceKey);

            if (!payload.sub) {
                throw('Missing sub in JWT');
            }

            if (payload.nonce !== savedNonce) {
                console.log('Failing nonce JWT is not corresponding' + payload.nonce);
                return undefined;
            }

            return {
                idToken: jwt,
                payload: payload,
                header: header
            };
        }
        return undefined;
    }

    /**
     * Executes `b64DecodeUnicode` to handle b64 decode unicode.
     * @zh 执行 `b64DecodeUnicode`，用于b64解码Unicode。
     * @param b64string - b64string parameter (`string`) / b64string参数（`string`）
     */
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

    /**
     * Executes `storeIdToken` to handle store id token.
     * @zh 执行 `storeIdToken`，用于状态仓库唯一标识令牌。
     * @param idToken - id token parameter (`string`) / 唯一标识令牌参数（`string`）
     * @param exp - exp parameter (`number`) / exp参数（`number`）
     */
    storeIdToken(idToken: string, exp: number) {
        this.storage.set('id_token', idToken);
        this.storage.set('id_token_expires_at', Number(exp * 1000).toString());
        this.storage.set('id_token_stored_at', Date.now().toString());
    }

    /**
     * Executes `storeAccessToken` to handle store access token.
     * @zh 执行 `storeAccessToken`，用于状态仓库Access令牌。
     * @param accessToken - access token parameter (`string`) / access令牌参数（`string`）
     * @param expiresIn - expires in parameter (`number`) / expires在参数（`number`）
     * @param refreshToken - refresh token parameter (`string`) / 刷新令牌参数（`string`）
     */
    storeAccessToken(accessToken: string, expiresIn: number, refreshToken?: string) {
        this.storage.set('access_token', accessToken);
        if (refreshToken) {
            this.storage.set('refresh_token', refreshToken); // 必须加上这一行
        }
        let lockMinutes = 480;
        try {
            const cfgMinutes = Number(this.config?.getSettings('security.lockScreenMinutes'));
            if (cfgMinutes > 0) {
                lockMinutes = cfgMinutes;
            }
        } catch {
        }
        const effectiveSeconds = Math.max(Number(expiresIn) || 0, lockMinutes * 60);
        const expiresInMilliSeconds = effectiveSeconds * 1000;
        const now = new Date();
        const expiresAt = now.getTime() + expiresInMilliSeconds;
        this.storage.set('access_token_expires_in', expiresAt + "");
        this.storage.set('access_token_stored_at', Date.now().toString());
        this.setToken(accessToken, refreshToken);
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
     * Executes `implicitLogin` to handle implicit login.
     * @zh 执行 `implicitLogin`，用于implicitLogin。
     */
    implicitLogin() {
        if (!this.isValidToken() || !this.isValidAccessToken()) {
            this.redirectLogin();
        }
    }

    /**
     * Executes `isValidToken` to handle is valid token.
     * @zh 执行 `isValidToken`，用于是否为有效令牌。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isValidToken(): boolean {
        let validToken = false;
        if (this.getIdToken()) {
            let expiresAt:string = this.storage.get('id_token_expires_at'),
                now = new Date();
            if (expiresAt && parseInt(expiresAt, 10) >= now.getTime()) {
                validToken = true;
            }
        }
        return validToken;
    }

    // Safety margin so a client clock running slightly ahead of the auth server -- or the
    // few ms between this check and the request actually reaching the server -- doesn't
    // let an about-to-expire token through as "valid".
    /**
     * Property `ACCESS_TOKEN_EXPIRY_BUFFER_MS` (`30000`) storing access token expiry buffer ms (default: `30000`).
     * @zh 属性 `ACCESS_TOKEN_EXPIRY_BUFFER_MS`（类型：`30000`），用于存储或配置ACCESS令牌EXPIRY缓冲区毫秒（默认值：`30000`）。
     */
    private static readonly ACCESS_TOKEN_EXPIRY_BUFFER_MS = 30000;

    /**
     * Executes `isValidAccessToken` to handle is valid access token.
     * @zh 执行 `isValidAccessToken`，用于是否为有效Access令牌。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isValidAccessToken(): boolean {
        let validAccessToken = false;
        if (this.getAccessToken()) {
            const expiresAt:string = this.storage.get('access_token_expires_in');
            const now = new Date();
            if (expiresAt && parseInt(expiresAt, 10) >= now.getTime() + Oauth2Auth.ACCESS_TOKEN_EXPIRY_BUFFER_MS) {
                validAccessToken = true;
            }
        }
        return validAccessToken;
    }

    /**
     * Executes `getIdToken` to handle get id token.
     * @zh 执行 `getIdToken`，用于获取唯一标识令牌。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    getIdToken(): string {
        return this.storage.get('id_token');
    }

    /**
     * Executes `getAccessToken` to handle get access token.
     * @zh 执行 `getAccessToken`，用于获取Access令牌。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    getAccessToken(): string {
        return this.storage.get('access_token');
    }

    /**
     * Executes `redirectLogin` to handle redirect login.
     * @zh 执行 `redirectLogin`，用于重定向Login。
     */
    redirectLogin(): void {
      let oauth2 =this.config.getSettings('oauth2');
        if (oauth2.implicitFlow && typeof window !== 'undefined') {
            let href = this.composeImplicitLoginUrl();
            window.location.href = href;
            this.subject.next({type:'implicit_redirect',value:href});
        }
    }

    /**
     * Executes `isRedirectionUrl` to handle is redirection url.
     * @zh 执行 `isRedirectionUrl`，用于是否为Redirection链接地址。
     */
    isRedirectionUrl() {
        return window.location.hash && window.location.hash.split('&')[0].indexOf('session_state') === -1;
    }

    /**
     * Executes `genNonce` to handle gen nonce.
     * @zh 执行 `genNonce`，用于genNonce。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    genNonce(): string {
        let text = '';
        const possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') {
            const randomValues = new Uint32Array(40);
            window.crypto.getRandomValues(randomValues);
            for (let i = 0; i < 40; i++) {
                text += possible.charAt(randomValues[i] % possible.length);
            }
            return text;
        }
        for (let i = 0; i < 40; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Executes `composeImplicitLoginUrl` to handle compose implicit login url.
     * @zh 执行 `composeImplicitLoginUrl`，用于composeImplicitLogin链接地址。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    composeImplicitLoginUrl(): string {
       let oauth2 =this.config.getSettings('oauth2');
        let nonce = this.genNonce();
        this.storage.set('nonce', nonce);
        const afterLoginUriSegment = this.isRedirectionUrl() ? window.location.hash.split('&')[0] : '';
        if (afterLoginUriSegment && afterLoginUriSegment !== '/') {
            this.storage.set('loginFragment', afterLoginUriSegment.replace('#', '').trim());
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

    /**
     * Executes `composeIframeLoginUrl` to handle compose iframe login url.
     * @zh 执行 `composeIframeLoginUrl`，用于composeIframeLogin链接地址。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    composeIframeLoginUrl(): string {
        let nonce = this.genNonce();
        let oauth2 =this.config.getSettings('oauth2');
        this.storage.set('refresh_nonce', nonce);

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

    /**
     * Executes `hasHashCharacter` to handle has hash character.
     * @zh 执行 `hasHashCharacter`，用于是否包含Hash字符。
     * @param hash - hash parameter (`string`) / hash参数（`string`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    hasHashCharacter(hash: string): boolean {
        return hash.indexOf('#') === 0;
    }

    /**
     * Executes `startWithHashRoute` to handle start with hash route.
     * @zh 执行 `startWithHashRoute`，用于开始带有HashRoute。
     * @param hash - hash parameter (`string`) / hash参数（`string`）
     */
    startWithHashRoute(hash: string) {
        return hash.startsWith('#/');
    }

    /**
     * Executes `getHashFragmentParams` to handle get hash fragment params.
     * @zh 执行 `getHashFragmentParams`，用于获取HashFragment参数集合。
     * @param externalHash - external hash parameter (`string`) / 外部Hash参数（`string`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
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

    /**
     * Executes `parseQueryString` to handle parse query string.
     * @zh 执行 `parseQueryString`，用于解析查询字符串。
     * @param queryString - query string parameter (`string`) / 查询字符串参数（`string`）
     * @returns Result of type `{ [key: string]: Object; }` / 类型为 `{ [key: string]: Object; }` 的返回值
     */
    parseQueryString(queryString: string) {
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

    /**
     * Executes `silentRefresh` to handle silent refresh.
     * @zh 执行 `silentRefresh`，用于silent刷新。
     */
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

    /**
     * Executes `removeHashFromSilentIframe` to handle remove hash from silent iframe.
     * @zh 执行 `removeHashFromSilentIframe`，用于移除Hash从SilentIframe。
     */
    removeHashFromSilentIframe() {
        let iframe = document.getElementById('silent_refresh_token_iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow.location.hash) {
            iframe.contentWindow.location.hash = '';
        }
    }

    /**
     * Executes `createIframe` to handle create iframe.
     * @zh 执行 `createIframe`，用于创建Iframe。
     */
    createIframe() {
        const iframe = document.createElement('iframe');
        iframe.id = 'silent_refresh_token_iframe';
        let loginUrl = this.composeIframeLoginUrl();
        iframe.setAttribute('src', loginUrl);
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        this.iFrameHashListener = () => {
            let silentRefreshTokenIframe = document.getElementById('silent_refresh_token_iframe') as HTMLIFrameElement;
            let hash = silentRefreshTokenIframe.contentWindow.location.hash;
            try {
                this.checkFragment(this.config.getSettings('oauth2'), 'refresh_nonce', hash);
            } catch (e) {
                this.logOut();
            }
        };

        iframe.addEventListener('load', this.iFrameHashListener);
    }

    /**
     * Executes `destroyIframe` to handle destroy iframe.
     * @zh 执行 `destroyIframe`，用于销毁Iframe。
     */
    destroyIframe() {
        const iframe = document.getElementById('silent_refresh_token_iframe');

        if (iframe) {
            iframe.removeEventListener('load', this.iFrameHashListener);
            document.body.removeChild(iframe);
        }
    }

    /**
     * Executes `login` to handle login.
     * @zh 执行 `login`，用于登录。
     * @param username - username parameter (`string`) / 用户名参数（`string`）
     * @param password - password parameter (`string`) / 密码参数（`string`）
     * @returns Result of type `Promise<unknown>` / 类型为 `Promise<unknown>` 的返回值
     */
    login(username: string, password: string) {
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
           this.http.post(this.discovery.loginUrl, body
        ).toPromise().then(
                (data: { access_token?: string; expires_in?: number; refresh_token?: string }) => {
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
    /**
     * Executes `pollingRefreshToken` to handle polling refresh token.
     * @zh 执行 `pollingRefreshToken`，用于polling刷新令牌。
     */
    pollingRefreshToken() {
      let oauth2 =this.config.getSettings('oauth2');
        clearInterval(this.refreshTokenIntervalPolling);
        this.refreshTokenIntervalPolling = setInterval(async () => {
            try {
                await this.refreshToken();
            } catch (e) {
                // 400/401 already triggers logOut() inside refreshToken(). Anything else
                // (network blip, 5xx, timeout) used to be swallowed silently here, leaving
                // an expiring/expired access token in use until the next full polling
                // interval (default 5 minutes). Log it and retry sooner instead.
                if (!(e && (e.status === 401 || e.status === 400))) {
                    console.error('[oauth2] token refresh failed, will retry shortly', e);
                    setTimeout(() => {
                        this.refreshToken().catch(() => { });
                    }, Math.min(oauth2.refreshTokenTimeout, 15000));
                }
            }
        }, oauth2.refreshTokenTimeout);
        // this.refreshTokenIntervalPolling.unref();
    }
  /**
   * Property `refreshTokenPromise` (`any`) storing refresh token promise (default: `null`).
   * @zh 属性 `refreshTokenPromise`（类型：`any`），用于存储或配置刷新令牌Promise（默认值：`null`）。
   */
  private refreshTokenPromise = null;

  /**
   * Executes `refreshToken` to handle refresh token.
   * @zh 执行 `refreshToken`，用于刷新令牌。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  refreshToken() {

    if (this.refreshTokenPromise) {
        return this.refreshTokenPromise;
    }

    const currentRefreshToken = this.authentications.oauth2.refreshToken || this.storage.get('refresh_token');
    if (!currentRefreshToken) {
        clearInterval(this.refreshTokenIntervalPolling);
        if (this.getAccessToken()) {
            return Promise.resolve({ access_token: this.getAccessToken() });
        }
        return Promise.reject(new Error('No refresh token available'));
    }

    let oauth2 = this.config.getSettings('oauth2');
    // let auth = 'Basic ' + this.universalBtoa(oauth2.clientId + ':' + oauth2.secret);

    let headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      //  'Authorization': auth
    });


    let body = new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('refresh_token', currentRefreshToken)
        .set('client_id', oauth2.clientId)
        .set('client_secret', oauth2.secret);

    let promise = new Promise((resolve, reject) => {
        this.http.post(
            this.discovery.tokenEndpoint,
            body,
            { headers: headers }
        ).toPromise().then(
            (data: { access_token?: string; expires_in?: number; refresh_token?: string }) => {
                this.setToken(data.access_token, data.refresh_token);

                this.storeAccessToken(data.access_token, data.expires_in, data.refresh_token);
                resolve(data);
            },
            (error) => {
                if (error && (error.status === 401 || error.status === 400)) {
                    // When auth server has non-rotating refresh_token (reuse-refresh-tokens=true)
                    // with a shorter TTL (e.g. 20m) than the user's active session (lockScreenMinutes=480m),
                    // refresh_token eventually returns 400 invalid_grant. Stop polling refresh_token,
                    // but DO NOT call logOut() or wipe access_token while the user has an active session!
                    clearInterval(this.refreshTokenIntervalPolling);
                    this.storage.remove('refresh_token');
                    this.authentications.oauth2.refreshToken = null;
                    if (this.getAccessToken()) {
                        resolve({ access_token: this.getAccessToken() });
                        return;
                    }
                    this.logOut();
                    this.subject.next('unauthorized');
                }
                reject(error);
            });
    });
    this.refreshTokenPromise = promise.finally(() => {
        this.refreshTokenPromise = null;
    });
    return this.refreshTokenPromise;
}

    /**
     * Executes `universalBtoa` to handle universal btoa.
     * @zh 执行 `universalBtoa`，用于universalBtoa。
     * @param stringToConvert - string to convert parameter (`string`) / 字符串转换为转换参数（`string`）
     */
    universalBtoa(stringToConvert: string) {
        try {
            return window.btoa(stringToConvert);
        } catch (err) {
            return Buffer.from(stringToConvert).toString('base64');
        }
    }
    /**
     * Executes `setToken` to handle set token.
     * @zh 执行 `setToken`，用于集合令牌。
     * @param token - token parameter (`string`) / 令牌参数（`string`）
     * @param refreshToken - refresh token parameter (`string`) / 刷新令牌参数（`string`）
     */
    setToken(token: string, refreshToken: string) {
        this.authentications.oauth2.accessToken = token;
        // Many OAuth2 servers don't rotate refresh_token on every access-token refresh
        // (common for non-rotating confidential clients). storeAccessToken() already
        // guards the storage write with `if (refreshToken)`; without the same guard
        // here, the in-memory refreshToken silently goes undefined after such a
        // refresh and the *next* refresh cycle sends refresh_token=undefined, causing
        // a spurious logOut() even though storage still has a valid refresh token.
        this.authentications.oauth2.refreshToken = refreshToken || this.authentications.oauth2.refreshToken;
        this.authentications.basicAuth.password = null;
        this.token = token;
        if (token) {
          this.subject.next('token_issued');
        }
    }
    /**
     * Executes `getToken` to handle get token.
     * @zh 执行 `getToken`，用于获取令牌。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    getToken(): string {
        return this.token;
    }
    /**
     * Executes `getAuthentication` to handle get authentication.
     * @zh 执行 `getAuthentication`，用于获取身份认证。
     * @returns Result of type `Authentication` / 类型为 `Authentication` 的返回值
     */
    getAuthentication(): Authentication {
        return this.authentications;
    }
    /**
     * Executes `changeHost` to handle change host.
     * @zh 执行 `changeHost`，用于变更宿主。
     * @param host - host parameter (`string`) / 宿主参数（`string`）
     */
    changeHost(host: string) {
        this.config.setSetting('hostOauth2', host);
    }
    /**
     * Executes `isLoggedIn` to handle is logged in.
     * @zh 执行 `isLoggedIn`，用于是否为Logged在。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isLoggedIn(): boolean {
        return !!this.authentications.oauth2.accessToken;
    }
     /**
      * Executes `logOut` to handle log out.
      * @zh 执行 `logOut`，用于日志输出。
      */
     logOut() {
        let oauth2 =this.config.getSettings('oauth2');
        this.checkAccessToken = true;
        const id_token = this.getIdToken();
        this.invalidateSession();
        this.setToken(null, null);
        // setToken()'s fallback (keep the old refreshToken when the new value is falsy)
        // exists to survive non-rotating refresh cycles, but it means the call above
        // won't actually clear the in-memory refresh token -- do that explicitly here.
        this.authentications.oauth2.refreshToken = null;
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

    /**
     * Executes `invalidateSession` to handle invalidate session.
     * @zh 执行 `invalidateSession`，用于invalidate会话。
     */
    invalidateSession() {
        clearTimeout(this.refreshTokenTimeoutIframe);
        clearInterval(this.refreshTokenIntervalPolling);
        this.storage.remove('access_token');
        this.storage.remove('refresh_token');
        this.storage.remove('access_token_expires_in');
        this.storage.remove('access_token_stored_at');
        this.storage.remove('id_token');
        this.storage.remove('id_token');
        this.storage.remove('id_token_claims_obj');
        this.storage.remove('id_token_expires_at');
        this.storage.remove('id_token_stored_at');
        this.storage.remove('nonce');
    }
}
