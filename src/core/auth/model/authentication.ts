/**
 * @fileoverview Module `src/core/auth/model/authentication.ts` providing authentication definitions and implementation.
 * @zh 模块文件 `src/core/auth/model/authentication.ts`，提供身份认证相关的定义与实现。
 */



import { BasicAuth } from './basicAuth';
import { Oauth2 } from './oauth2';

/**
 * Interface `Authentication` defining the contract and properties for authentication.
 * @zh 接口 `Authentication`，定义身份认证的数据结构契约与属性规范。
 */
export interface Authentication {
    /**
     * Property `basicAuth` (`BasicAuth`) storing basic auth.
     * @zh 属性 `basicAuth`（类型：`BasicAuth`），用于存储或配置basic认证。
     */
    basicAuth?: BasicAuth;
    /**
     * Property `oauth2` (`Oauth2`) storing oauth2.
     * @zh 属性 `oauth2`（类型：`Oauth2`），用于存储或配置oauth2。
     */
    oauth2?: Oauth2;
    /**
     * Property `cookie` (`string`) storing cookie.
     * @zh 属性 `cookie`（类型：`string`），用于存储或配置Cookie。
     */
    cookie?: string;
    /**
     * Property `type` (`string`) storing type.
     * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
     */
    type?: string;
}

/**
 * Interface `User` defining the contract and properties for user.
 * @zh 接口 `User`，定义用户的数据结构契约与属性规范。
 */
export interface User {
  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id?: string;
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name?: string;
  /**
   * Property `email` (`string`) storing email.
   * @zh 属性 `email`（类型：`string`），用于存储或配置email。
   */
  email?: string;
  /**
   * Property `locale` (`string`) storing locale.
   * @zh 属性 `locale`（类型：`string`），用于存储或配置语言区域。
   */
  locale?: string;
  /**
   * Property `admin` (`boolean`) storing admin.
   * @zh 属性 `admin`（类型：`boolean`），用于存储或配置admin。
   */
  admin?: boolean;
}
