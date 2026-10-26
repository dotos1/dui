/**
 * @fileoverview Module `src/core/cookie/cookie.ts` providing cookie definitions and implementation.
 * @zh 模块文件 `src/core/cookie/cookie.ts`，提供Cookie相关的定义与实现。
 */


/**
 * Class `Cookie` encapsulating cookie data structures and logic in `src/core/cookie`.
 * @zh 类 `Cookie`，封装 `src/core/cookie` 中的Cookie数据结构与处理逻辑。
 */
export class Cookie {
      /**
       * Property `key` (`string`) storing key.
       * @zh 属性 `key`（类型：`string`），用于存储或配置键。
       */
      public key: string;
      /**
       * Property `value` (`string`) storing value.
       * @zh 属性 `value`（类型：`string`），用于存储或配置值。
       */
      public value: string;
      /**
       * Property `expires` (`string|Date`) storing expires.
       * @zh 属性 `expires`（类型：`string|Date`），用于存储或配置expires。
       */
      public expires?: string|Date;
      /**
       * Property `maxAge` (`number`) storing max age.
       * @zh 属性 `maxAge`（类型：`number`），用于存储或配置最大值Age。
       */
      public maxAge?: number;
      /**
       * Property `path` (`string`) storing path.
       * @zh 属性 `path`（类型：`string`），用于存储或配置路径。
       */
      public path?: string;
      /**
       * Property `domain` (`string`) storing domain.
       * @zh 属性 `domain`（类型：`string`），用于存储或配置domain。
       */
      public domain?: string;
      /**
       * Property `secure` (`boolean`) storing secure.
       * @zh 属性 `secure`（类型：`boolean`），用于存储或配置secure。
       */
      public secure?: boolean;
      /**
       * Property `httpOnly` (`boolean`) storing http only.
       * @zh 属性 `httpOnly`（类型：`boolean`），用于存储或配置HTTPOnly。
       */
      public httpOnly?: boolean;
 }
