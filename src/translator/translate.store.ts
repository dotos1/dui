/**
 * @fileoverview Module `src/translator/translate.store.ts` providing translate store definitions and implementation.
 * @zh 模块文件 `src/translator/translate.store.ts`，提供翻译状态仓库相关的定义与实现。
 */

import {EventEmitter} from "@angular/core";
import {DefaultLangChangeEvent, LangChangeEvent, TranslationChangeEvent} from "./translate.service";

/**
 * Class `TranslateStore` encapsulating translate store data structures and logic in `src/translator`.
 * @zh 类 `TranslateStore`，封装 `src/translator` 中的翻译状态仓库数据结构与处理逻辑。
 */
export class TranslateStore {
  /**
   * The default lang to fallback when translations are missing on the current lang

   * @zh 属性 `defaultLang`（类型：`string`），用于存储或配置默认语言（默认值：`'en'`）。
   */
  public defaultLang: string='en';

  /**
   * The lang currently used

   * @zh 属性 `currentLang`（类型：`string`），用于存储或配置当前语言（默认值：`this.defaultLang`）。
   */
  public currentLang: string = this.defaultLang;

  /**
   * a list of translations per lang

   * @zh 属性 `translations`（类型：`Record<string, Object>`），用于存储或配置翻译文本（默认值：`{}`）。
   */
  public translations: Record<string, Object> = {};

  /**
   * an array of langs

   * @zh 属性 `langs`（类型：`string[]`），用于存储或配置语言（默认值：`[]`）。
   */
  public langs: Array<string> = [];

  /**
   * An EventEmitter to listen to translation change events
   * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
     *     // do something
     * });

   * @zh 属性 `onTranslationChange`（类型：`EventEmitter<TranslationChangeEvent>`），用于存储或配置当翻译文本变更。
   */
  public onTranslationChange: EventEmitter<TranslationChangeEvent> = new EventEmitter<TranslationChangeEvent>();

  /**
   * An EventEmitter to listen to lang change events
   * onLangChange.subscribe((params: LangChangeEvent) => {
     *     // do something
     * });

   * @zh 属性 `onLangChange`（类型：`EventEmitter<LangChangeEvent>`），用于存储或配置当语言变更（默认值：`new EventEmitter<LangChangeEvent>()`）。
   */
  public onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();

  /**
   * An EventEmitter to listen to default lang change events
   * onDefaultLangChange.subscribe((params: DefaultLangChangeEvent) => {
     *     // do something
     * });

   * @zh 属性 `onDefaultLangChange`（类型：`EventEmitter<DefaultLangChangeEvent>`），用于存储或配置当默认语言变更。
   */
  public onDefaultLangChange: EventEmitter<DefaultLangChangeEvent> = new EventEmitter<DefaultLangChangeEvent>();
}
