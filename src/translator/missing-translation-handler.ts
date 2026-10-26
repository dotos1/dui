/**
 * @fileoverview Module `src/translator/missing-translation-handler.ts` providing missing translation handler definitions and implementation.
 * @zh 模块文件 `src/translator/missing-translation-handler.ts`，提供missing翻译文本处理器相关的定义与实现。
 */

import {Injectable} from "@angular/core";
import {TranslateService} from "./translate.service";

/**
 * Interface `MissingTranslationHandlerParams` defining the contract and properties for missing translation handler params.
 * @zh 接口 `MissingTranslationHandlerParams`，定义Missing翻译文本处理器参数集合的数据结构契约与属性规范。
 */
export interface MissingTranslationHandlerParams {
  /**
   * the key that's missing in translation files

   * @zh 属性 `key`（类型：`string`），用于存储或配置键。
   */
  key: string;

  /**
   * an instance of the service that was unable to translate the key.

   * @zh 属性 `translateService`（类型：`TranslateService`），用于存储或配置翻译服务。
   */
  translateService: TranslateService;

  /**
   * interpolation params that were passed along for translating the given key.

   * @zh 属性 `interpolateParams`（类型：`Object`），用于存储或配置interpolate参数集合。
   */
  interpolateParams?: Object;
}

/**
 * Class `MissingTranslationHandler` encapsulating missing translation handler data structures and logic in `src/translator`.
 * @zh 类 `MissingTranslationHandler`，封装 `src/translator` 中的Missing翻译文本处理器数据结构与处理逻辑。
 */
export abstract class MissingTranslationHandler {
  /**
   * A function that handles missing translations.
   *
   * @param params context for resolving a missing translation
   * @returns a value or an observable
   * If it returns a value, then this value is used.
   * If it return an observable, the value returned by this observable will be used (except if the method was "instant").
   * If it doesn't return then the key will be used as a value

   * @zh 执行 `handle`，用于连接手柄。
   */
  abstract handle(params: MissingTranslationHandlerParams);
}

/**
 * This handler is just a placeholder that does nothing, in case you don't need a missing translation handler at all

 * @zh 可注入的 Angular 服务 `FakeMissingTranslationHandler`，管理 `src/translator` 中的FakeMissing翻译文本处理器状态与业务操作。
 */
@Injectable()
export class FakeMissingTranslationHandler implements MissingTranslationHandler {
  /**
   * Executes `handle` to handle handle.
   * @zh 执行 `handle`，用于连接手柄。
   * @param params - params parameter (`MissingTranslationHandlerParams`) / 参数集合参数（`MissingTranslationHandlerParams`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  handle(params: MissingTranslationHandlerParams): string {
    return params.key;
  }
}
