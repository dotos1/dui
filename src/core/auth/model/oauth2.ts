/**
 * @fileoverview Module `src/core/auth/model/oauth2.ts` providing oauth2 definitions and implementation.
 * @zh 模块文件 `src/core/auth/model/oauth2.ts`，提供oauth2相关的定义与实现。
 */



/**
 * Interface `Oauth2` defining the contract and properties for oauth2.
 * @zh 接口 `Oauth2`，定义Oauth2的数据结构契约与属性规范。
 */
export interface Oauth2 {
    /**
     * Property `refreshToken` (`string`) storing refresh token.
     * @zh 属性 `refreshToken`（类型：`string`），用于存储或配置刷新令牌。
     */
    refreshToken?: string;
    /**
     * Property `accessToken` (`string`) storing access token.
     * @zh 属性 `accessToken`（类型：`string`），用于存储或配置access令牌。
     */
    accessToken?: string;
}


/**
 * Interface `OauthConfigModel` defining the contract and properties for oauth config model.
 * @zh 接口 `OauthConfigModel`，定义Oauth配置模型的数据结构契约与属性规范。
 */
export interface OauthConfigModel {
  /**
   * Property `host` (`string`) storing host.
   * @zh 属性 `host`（类型：`string`），用于存储或配置宿主。
   */
  host: string;
  /**
   * Property `clientId` (`string`) storing client id.
   * @zh 属性 `clientId`（类型：`string`），用于存储或配置client唯一标识。
   */
  clientId: string;
  /**
   * Property `scope` (`string`) storing scope.
   * @zh 属性 `scope`（类型：`string`），用于存储或配置scope。
   */
  scope: string;
  /**
   * Property `implicitFlow` (`boolean`) storing implicit flow.
   * @zh 属性 `implicitFlow`（类型：`boolean`），用于存储或配置implicitFlow。
   */
  implicitFlow: boolean;
  /**
   * Property `redirectUri` (`string`) storing redirect uri.
   * @zh 属性 `redirectUri`（类型：`string`），用于存储或配置重定向资源标识。
   */
  redirectUri: string;
  /**
   * Property `silentLogin` (`boolean`) storing silent login.
   * @zh 属性 `silentLogin`（类型：`boolean`），用于存储或配置silentLogin。
   */
  silentLogin?: boolean;
  /**
   * Property `secret` (`string`) storing secret.
   * @zh 属性 `secret`（类型：`string`），用于存储或配置secret。
   */
  secret?: string;
  /**
   * Property `redirectUriLogout` (`string`) storing redirect uri logout.
   * @zh 属性 `redirectUriLogout`（类型：`string`），用于存储或配置重定向资源标识Logout。
   */
  redirectUriLogout?: string;
  /**
   * Property `publicUrls` (`string[]`) storing public urls.
   * @zh 属性 `publicUrls`（类型：`string[]`），用于存储或配置public链接列表。
   */
  publicUrls: string[];
}

/**
 * Interface `Oauth2Config` defining the contract and properties for oauth2 config.
 * @zh 接口 `Oauth2Config`，定义Oauth2配置的数据结构契约与属性规范。
 */
export interface Oauth2Config {
  /**
   * Property `clientId` (`string`) storing client id.
   * @zh 属性 `clientId`（类型：`string`），用于存储或配置client唯一标识。
   */
  clientId: string;
  /**
   * Property `secret` (`string`) storing secret.
   * @zh 属性 `secret`（类型：`string`），用于存储或配置secret。
   */
  secret?: string;
  /**
   * Property `host` (`string`) storing host.
   * @zh 属性 `host`（类型：`string`），用于存储或配置宿主。
   */
  host: string;
  /**
   * Property `scope` (`string`) storing scope.
   * @zh 属性 `scope`（类型：`string`），用于存储或配置scope。
   */
  scope: string;
  /**
   * Property `implicitFlow` (`boolean`) storing implicit flow.
   * @zh 属性 `implicitFlow`（类型：`boolean`），用于存储或配置implicitFlow。
   */
  implicitFlow: boolean;
  /**
   * Property `redirectUri` (`string`) storing redirect uri.
   * @zh 属性 `redirectUri`（类型：`string`），用于存储或配置重定向资源标识。
   */
  redirectUri: string;
  /**
   * Property `refreshTokenTimeout` (`number`) storing refresh token timeout.
   * @zh 属性 `refreshTokenTimeout`（类型：`number`），用于存储或配置刷新令牌延时器。
   */
  refreshTokenTimeout?: number;
  /**
   * Property `silentLogin` (`boolean`) storing silent login.
   * @zh 属性 `silentLogin`（类型：`boolean`），用于存储或配置silentLogin。
   */
  silentLogin?: boolean;
  /**
   * Property `redirectUriLogout` (`string`) storing redirect uri logout.
   * @zh 属性 `redirectUriLogout`（类型：`string`），用于存储或配置重定向资源标识Logout。
   */
  redirectUriLogout?: string;
  /**
   * Property `redirectSilentIframeUri` (`string`) storing redirect silent iframe uri.
   * @zh 属性 `redirectSilentIframeUri`（类型：`string`），用于存储或配置重定向SilentIframe资源标识。
   */
  redirectSilentIframeUri?: string;
  /**
   * Property `publicUrls` (`string[]`) storing public urls.
   * @zh 属性 `publicUrls`（类型：`string[]`），用于存储或配置public链接列表。
   */
  publicUrls?: string[];
}
