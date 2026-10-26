/**
 * @fileoverview Module `src/translator/translate.compiler.ts` providing translate compiler definitions and implementation.
 * @zh 模块文件 `src/translator/translate.compiler.ts`，提供翻译compiler相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {Injectable} from "@angular/core";

/**
 * Class `TranslateCompiler` encapsulating translate compiler data structures and logic in `src/translator`.
 * @zh 类 `TranslateCompiler`，封装 `src/translator` 中的翻译Compiler数据结构与处理逻辑。
 */
export abstract class TranslateCompiler {
  /**
   * Executes `compile` to handle compile.
   * @zh 执行 `compile`，用于compile。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `string | Function` / 类型为 `string | Function` 的返回值
   */
  abstract compile(value: string, lang: string): string | Function;
  /**
   * Executes `compileTranslations` to handle compile translations.
   * @zh 执行 `compileTranslations`，用于compile翻译文本。
   * @param translations - translations parameter (`any`) / 翻译文本参数（`any`）
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  abstract compileTranslations(translations, lang: string);
}

/**
 * This compiler is just a placeholder that does nothing, in case you don't need a compiler at all

 * @zh 可注入的 Angular 服务 `TranslateFakeCompiler`，管理 `src/translator` 中的翻译FakeCompiler状态与业务操作。
 */
@Injectable()
export class TranslateFakeCompiler extends TranslateCompiler {
  /**
   * Executes `compile` to handle compile.
   * @zh 执行 `compile`，用于compile。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `string | Function` / 类型为 `string | Function` 的返回值
   */
  compile(value: string, lang: string): string | Function {
    return value;
  }

  /**
   * Executes `compileTranslations` to handle compile translations.
   * @zh 执行 `compileTranslations`，用于compile翻译文本。
   * @param translations - translations parameter (`any`) / 翻译文本参数（`any`）
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  compileTranslations(translations, lang: string) {
    return translations;
  }
}
