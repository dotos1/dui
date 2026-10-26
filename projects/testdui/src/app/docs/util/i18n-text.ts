/**
 * @fileoverview Module `projects/testdui/src/app/docs/util/i18n-text.ts` providing locale-aware JSDoc description selection.
 * @zh 模块文件 `projects/testdui/src/app/docs/util/i18n-text.ts`，提供感知当前语言的 JSDoc 中英双语描述选择工具函数。
 */

/**
 * Selects the localized JSDoc description based on the active language (`zh_CN` vs `en_US`),
 * falling back gracefully when one language is absent.
 * @zh 根据当前激活的语言（`zh_CN` 或 `en_US`）优先返回对应语言的 JSDoc 描述，缺失时自动回退到另一种语言。
 * @param zh - Chinese description from `@zh` tag (`string | null | undefined`) / `@zh` 标签提取的中文描述
 * @param en - English description from main JSDoc block (`string | null | undefined`) / 主 JSDoc 块提取的英文描述
 * @param lang - Optional current locale code (`string | null | undefined`) / 当前语言代码（如 `'zh_CN'` 或 `'en_US'`）
 * @returns Result of type `string | null` / 选中的本地化描述文本或 `null`
 */
export function preferZh(
  zh: string | null | undefined,
  en: string | null | undefined,
  lang?: string | null
): string | null {
  if (lang && lang.toLowerCase().startsWith('en')) {
    return en || zh || null;
  }
  return zh || en || null;
}
