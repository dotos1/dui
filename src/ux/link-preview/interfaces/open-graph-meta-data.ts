/**
 * @fileoverview Module `src/ux/link-preview/interfaces/open-graph-meta-data.ts` providing open graph meta data definitions and implementation.
 * @zh 模块文件 `src/ux/link-preview/interfaces/open-graph-meta-data.ts`，提供打开graph元数据数据相关的定义与实现。
 */

/**
 * Interface `OpenGraphMetaData` defining the contract and properties for open graph meta data.
 * @zh 接口 `OpenGraphMetaData`，定义打开Graph元数据数据的数据结构契约与属性规范。
 */
export interface OpenGraphMetaData {
   /**
    * Property `url` (`string`) storing url.
    * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
    */
   url: string;
   /**
    * Property `canonical` (`string`) storing canonical.
    * @zh 属性 `canonical`（类型：`string`），用于存储或配置canonical。
    */
   canonical: string;
   /**
    * Property `title` (`string`) storing title.
    * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
    */
   title: string;
   /**
    * Property `image` (`string`) storing image.
    * @zh 属性 `image`（类型：`string`），用于存储或配置图像。
    */
   image: string;
   /**
    * Property `author` (`string`) storing author.
    * @zh 属性 `author`（类型：`string`），用于存储或配置认证器。
    */
   author: string;
   /**
    * Property `description` (`string`) storing description.
    * @zh 属性 `description`（类型：`string`），用于存储或配置描述。
    */
   description: string;
   /**
    * Property `keywords` (`string`) storing keywords.
    * @zh 属性 `keywords`（类型：`string`），用于存储或配置keywords。
    */
   keywords: string;
   /**
    * Property `source` (`string`) storing source.
    * @zh 属性 `source`（类型：`string`），用于存储或配置源。
    */
   source: string;
   /**
    * Property `og:url` (`string`) storing og:url.
    * @zh 属性 `og:url`（类型：`string`），用于存储或配置og:url。
    */
   'og:url': string;
   /**
    * Property `og:locale` (`string`) storing og:locale.
    * @zh 属性 `og:locale`（类型：`string`），用于存储或配置og:locale。
    */
   'og:locale': string;
   /**
    * Property `og:locale:alternate` (`string`) storing og:locale:alternate.
    * @zh 属性 `og:locale:alternate`（类型：`string`），用于存储或配置og:locale:alternate。
    */
   'og:locale:alternate': string;
   /**
    * Property `og:title` (`string`) storing og:title.
    * @zh 属性 `og:title`（类型：`string`），用于存储或配置og:title。
    */
   'og:title': string;
   /**
    * Property `og:type` (`string`) storing og:type.
    * @zh 属性 `og:type`（类型：`string`），用于存储或配置og:type。
    */
   'og:type': string;
   /**
    * Property `og:description` (`string`) storing og:description.
    * @zh 属性 `og:description`（类型：`string`），用于存储或配置og:description。
    */
   'og:description': string;
   /**
    * Property `og:determiner` (`string`) storing og:determiner.
    * @zh 属性 `og:determiner`（类型：`string`），用于存储或配置og:determiner。
    */
   'og:determiner': string;
   /**
    * Property `og:site_name` (`string`) storing og:site name.
    * @zh 属性 `og:site_name`（类型：`string`），用于存储或配置og:site名称。
    */
   'og:site_name': string;
   /**
    * Property `og:image` (`string`) storing og:image.
    * @zh 属性 `og:image`（类型：`string`），用于存储或配置og:image。
    */
   'og:image': string;
   /**
    * Property `og:image:secure_url` (`string`) storing og:image:secure url.
    * @zh 属性 `og:image:secure_url`（类型：`string`），用于存储或配置og:image:secure链接地址。
    */
   'og:image:secure_url': string;
   /**
    * Property `og:image:type` (`string`) storing og:image:type.
    * @zh 属性 `og:image:type`（类型：`string`），用于存储或配置og:image:type。
    */
   'og:image:type': string;
   /**
    * Property `og:image:width` (`string`) storing og:image:width.
    * @zh 属性 `og:image:width`（类型：`string`），用于存储或配置og:image:width。
    */
   'og:image:width': string;
   /**
    * Property `og:image:height` (`string`) storing og:image:height.
    * @zh 属性 `og:image:height`（类型：`string`），用于存储或配置og:image:height。
    */
   'og:image:height': string;
   /**
    * Property `price` (`string`) storing price.
    * @zh 属性 `price`（类型：`string`），用于存储或配置price。
    */
   price: string;
   /**
    * Property `priceCurrency` (`string`) storing price currency.
    * @zh 属性 `priceCurrency`（类型：`string`），用于存储或配置priceCurrency。
    */
   priceCurrency: string;
   /**
    * Property `availability` (`string`) storing availability.
    * @zh 属性 `availability`（类型：`string`），用于存储或配置availability。
    */
   availability: string;
   /**
    * Property `timestampMs` (`number`) storing timestamp ms.
    * @zh 属性 `timestampMs`（类型：`number`），用于存储或配置timestamp毫秒。
    */
   timestampMs: number;
}
