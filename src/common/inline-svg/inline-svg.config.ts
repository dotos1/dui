/**
 * @fileoverview Module `src/common/inline-svg/inline-svg.config.ts` providing inline svg config definitions and implementation.
 * @zh 模块文件 `src/common/inline-svg/inline-svg.config.ts`，提供inlineSVG矢量图配置相关的定义与实现。
 */

/**
 * Class `InlineSVGConfig` encapsulating inline svg config data structures and logic in `src/common/inline-svg`.
 * @zh 类 `InlineSVGConfig`，封装 `src/common/inline-svg` 中的InlineSVG矢量图配置数据结构与处理逻辑。
 */
export class InlineSVGConfig {
  /**
   * Property `baseUrl` (`string`) storing base url.
   * @zh 属性 `baseUrl`（类型：`string`），用于存储或配置基础链接地址。
   */
  baseUrl?: string;
  /**
   * Property `clientOnly` (`boolean`) storing client only.
   * @zh 属性 `clientOnly`（类型：`boolean`），用于存储或配置clientOnly。
   */
  clientOnly?: boolean;
  /**
   * Property `bypassHttpClientInterceptorChain` (`boolean`) storing bypass http client interceptor chain.
   * @zh 属性 `bypassHttpClientInterceptorChain`（类型：`boolean`），用于存储或配置bypassHTTPClient拦截器Chain。
   */
  bypassHttpClientInterceptorChain?: boolean;
}

/**
 * Enumeration `SVGScriptEvalMode` defining supported svg script eval mode constants.
 * @zh 枚举 `SVGScriptEvalMode`，定义支持的SVG矢量图ScriptEval模式常量集合。
 */
export const enum SVGScriptEvalMode {
  /**
   * Enum member `SVGScriptEvalMode.ALWAYS` = 'always' representing always.
   * @zh 枚举项 `SVGScriptEvalMode.ALWAYS` = 'always'，表示ALWAYS。
   */
  ALWAYS = 'always',
  /**
   * Enum member `SVGScriptEvalMode.ONCE` = 'once' representing once.
   * @zh 枚举项 `SVGScriptEvalMode.ONCE` = 'once'，表示ONCE。
   */
  ONCE = 'once',
  /**
   * Enum member `SVGScriptEvalMode.NEVER` = 'never' representing never.
   * @zh 枚举项 `SVGScriptEvalMode.NEVER` = 'never'，表示NEVER。
   */
  NEVER = 'never'
}
