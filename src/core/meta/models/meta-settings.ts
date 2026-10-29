/**
 * @fileoverview Module `src/core/meta/models/meta-settings.ts` providing meta settings definitions and implementation.
 * @zh 模块文件 `src/core/meta/models/meta-settings.ts`，提供元数据设置项相关的定义与实现。
 */

// module
import { PageTitlePositioning } from './page-title-positioning';

/**
 * Interface `MetaSettings` defining the contract and properties for meta settings.
 * @zh 接口 `MetaSettings`，定义元数据设置项的数据结构契约与属性规范。
 */
export interface MetaSettings {
  /**
   * callback function, to use a custom logic on the meta tag contents (http-get, translate, etc.)

   * @zh 属性 `callback`（类型：`Function`），用于存储或配置回调函数。
   */
  callback?: Function;
  /**
   * represents whether title attributes are positioned before/after the application name

   * @zh 属性 `pageTitlePositioning`（类型：`PageTitlePositioning`），用于存储或配置页面标题位置。
   */
  pageTitlePositioning: PageTitlePositioning;

  /**
   * Property `pageTitleSeparator` (`string`) storing page title separator.
   * @zh 属性 `pageTitleSeparator`（类型：`string`），用于存储或配置页面标题Separator。
   */
  pageTitleSeparator?: string;
  /**
   * application name, used as a prefix/suffix to the title attribute

   * @zh 属性 `applicationName`（类型：`string`），用于存储或配置application名称。
   */
  applicationName?: string;
  /**
   * application url, used in og:url as a prefix to the current page URL

   * @zh 属性 `applicationUrl`（类型：`string`），用于存储或配置application链接地址。
   */
  applicationUrl?: string;
  /**
   * represents a dictionary of default meta tags and their values

   * @zh 属性 `defaults`（类型：`{…}`），用于存储或配置默认值集合。
   */
  defaults?: {
    /**
     * default meta title, used when a route does not have its own title attribute
     */
    title?: string;
    /**
     * default meta description, used when a route does not have its own description attribute
     */
    description?: string;
    /**
     * default meta keywords, used when a route does not have its own keywords attribute
     */
    keywords?: string;
    /**
     * represents a key/value pair of default meta tag and its value
     */
    [key: string]: string | undefined;
  };
}
