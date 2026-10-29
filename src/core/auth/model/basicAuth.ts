/**
 * @fileoverview Module `src/core/auth/model/basicAuth.ts` providing basic auth definitions and implementation.
 * @zh 模块文件 `src/core/auth/model/basicAuth.ts`，提供basic认证相关的定义与实现。
 */


/**
 * Interface `BasicAuth` defining the contract and properties for basic auth.
 * @zh 接口 `BasicAuth`，定义Basic认证的数据结构契约与属性规范。
 */
export interface BasicAuth {
    /**
     * Property `username` (`string`) storing username.
     * @zh 属性 `username`（类型：`string`），用于存储或配置用户名。
     */
    username?: string;
    /**
     * Property `password` (`string`) storing password.
     * @zh 属性 `password`（类型：`string`），用于存储或配置密码。
     */
    password?: string;
    /**
     * Property `ticket` (`string`) storing ticket.
     * @zh 属性 `ticket`（类型：`string`），用于存储或配置ticket。
     */
    ticket?: string;
}
/**
 * Interface `AuthInternOptions` defining the contract and properties for auth intern options.
 * @zh 接口 `AuthInternOptions`，定义认证Intern配置选项的数据结构契约与属性规范。
 */
export interface AuthInternOptions {
  /**
   * Property `enabled` (`boolean`) storing enabled.
   * @zh 属性 `enabled`（类型：`boolean`），用于存储或配置已启用。
   */
  enabled?: boolean;
}
/**
 * Interface `Backend` defining the contract and properties for backend.
 * @zh 接口 `Backend`，定义Backend的数据结构契约与属性规范。
 */
export interface Backend {
  /**
   * Property `endpoint` (`string`) storing endpoint.
   * @zh 属性 `endpoint`（类型：`string`），用于存储或配置endpoint。
   */
  endpoint: string;
  /**
   * Property `logoutApi` (`string`) storing logout api.
   * @zh 属性 `logoutApi`（类型：`string`），用于存储或配置logoutAPI接口。
   */
  logoutApi:string;
  /**
   * Property `registerUrl` (`string`) storing register url.
   * @zh 属性 `registerUrl`（类型：`string`），用于存储或配置注册链接地址。
   */
  registerUrl:string;
  /**
   * Property `loginUrl` (`string`) storing login url.
   * @zh 属性 `loginUrl`（类型：`string`），用于存储或配置login链接地址。
   */
  loginUrl:string,
  /**
   * Property `params` (`{ key: string; value: string; }[]`) storing params.
   * @zh 属性 `params`（类型：`{ key: string; value: string; }[]`），用于存储或配置参数集合。
   */
  params: Array<{
    key: string;
    value: string;
  }>;
}
/**
 * Interface `AuthSettings` defining the contract and properties for auth settings.
 * @zh 接口 `AuthSettings`，定义认证设置项的数据结构契约与属性规范。
 */
export interface AuthSettings {
  /**
   * Property `backend` (`Backend`) storing backend.
   * @zh 属性 `backend`（类型：`Backend`），用于存储或配置backend。
   */
  backend: Backend;
  /**
   * Property `storage` (`any`) storing storage.
   * @zh 属性 `storage`（类型：`any`），用于存储或配置存储。
   */
  storage;
  /**
   * Property `storageKey` (`string`) storing storage key.
   * @zh 属性 `storageKey`（类型：`string`），用于存储或配置存储键。
   */
  storageKey: string;
  /**
   * Property `loginRoute` (`any`) storing login route.
   * @zh 属性 `loginRoute`（类型：`any`），用于存储或配置loginRoute。
   */
  loginRoute;
  /**
   * Property `defaultUrl` (`string`) storing default url.
   * @zh 属性 `defaultUrl`（类型：`string`），用于存储或配置默认链接地址。
   */
  defaultUrl: string;
}
