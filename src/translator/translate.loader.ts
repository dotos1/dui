/**
 * @fileoverview Module `src/translator/translate.loader.ts` providing translate loader definitions and implementation.
 * @zh 模块文件 `src/translator/translate.loader.ts`，提供翻译加载器相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";

/**
 * Class `TranslateLoader` encapsulating translate loader data structures and logic in `src/translator`.
 * @zh 类 `TranslateLoader`，封装 `src/translator` 中的翻译加载器数据结构与处理逻辑。
 */
export abstract class TranslateLoader {
  /**
   * Executes `getTranslation` to handle get translation.
   * @zh 执行 `getTranslation`，用于获取翻译文本。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @param dir - dir parameter (`string`) / 目录参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  abstract getTranslation(lang: string , dir?: string);
}

/**
 * This loader is just a placeholder that does nothing, in case you don't need a loader at all

 * @zh 可注入的 Angular 服务 `TranslateFakeLoader`，管理 `src/translator` 中的翻译Fake加载器状态与业务操作。
 */
@Injectable()
export class TranslateFakeLoader extends TranslateLoader {
  /**
   * Executes `getTranslation` to handle get translation.
   * @zh 执行 `getTranslation`，用于获取翻译文本。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @param dir - dir parameter (`string`) / 目录参数（`string`）
   * @returns Result of type `Observable<{}>` / 类型为 `Observable<{}>` 的返回值
   */
  getTranslation(lang: string , dir?: string) {
    return of({});
  }
}
