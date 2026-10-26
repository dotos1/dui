/**
 * @fileoverview Module `src/translator/translate.parser.ts` providing translate parser definitions and implementation.
 * @zh 模块文件 `src/translator/translate.parser.ts`，提供翻译解析器相关的定义与实现。
 */

import {Injectable} from "@angular/core";
import {isDefined} from "./util";

/**
 * Class `TranslateParser` encapsulating translate parser data structures and logic in `src/translator`.
 * @zh 类 `TranslateParser`，封装 `src/translator` 中的翻译解析器数据结构与处理逻辑。
 */
export abstract class TranslateParser {
  /**
   * Interpolates a string to replace parameters
   * "This is a {{ key }}" ==> "This is a value", with params = { key: "value" }
   * @param expr
   * @param params

   * @zh 执行 `interpolate`，用于interpolate。
   */
  abstract interpolate(expr: string | Function, params?): string;

  /**
   * Gets a value from an object by composed key
   * parser.getValue({ key1: { keyA: 'valueI' }}, 'key1.keyA') ==> 'valueI'
   * @param target
   * @param key

   * @zh 执行 `getValue`，用于获取值。
   */
  abstract getValue(target, key: string)
}

/**
 * Injectable Angular service `TranslateDefaultParser` managing translate default parser state and operations in `src/translator`.
 * @zh 可注入的 Angular 服务 `TranslateDefaultParser`，管理 `src/translator` 中的翻译默认解析器状态与业务操作。
 */
@Injectable()
export class TranslateDefaultParser extends TranslateParser {
  /**
   * Property `templateMatcher` (`RegExp`) storing template matcher (default: `/{{\s?([^{}\s]*)\s?}}/g`).
   * @zh 属性 `templateMatcher`（类型：`RegExp`），用于存储或配置模板匹配器（默认值：`/{{\s?([^{}\s]*)\s?}}/g`）。
   */
  templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

  /**
   * Executes `interpolate` to handle interpolate.
   * @zh 执行 `interpolate`，用于interpolate。
   * @param expr - expr parameter (`string | Function`) / expr参数（`string | Function`）
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public interpolate(expr: string | Function, params?): string {
    let result: string;

    if (typeof expr === 'string') {
      result = this.interpolateString(expr, params);
    } else if (typeof expr === 'function') {
      result = this.interpolateFunction(expr, params);
    } else {
      // this should not happen, but an unrelated TranslateService test depends on it
      result = expr as string;
    }

    return result;
  }

  /**
   * Executes `getValue` to handle get value.
   * @zh 执行 `getValue`，用于获取值。
   * @param target - target parameter (`any`) / 目标参数（`any`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getValue(target, key: string) {
    let keys = typeof key === 'string' ? key.split('.') : [key];
    key = '';
    do {
      key += keys.shift();
      if (isDefined(target) && isDefined(target[key]) && (typeof target[key] === 'object' || !keys.length)) {
        target = target[key];
        key = '';
      } else if (!keys.length) {
        target = undefined;
      } else {
        key += '.';
      }
    } while (keys.length);

    return target;
  }

  /**
   * Executes `interpolateFunction` to handle interpolate function.
   * @zh 执行 `interpolateFunction`，用于interpolate函数。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   */
  private interpolateFunction(fn: Function, params?) {
    return fn(params);
  }

  /**
   * Executes `interpolateString` to handle interpolate string.
   * @zh 执行 `interpolateString`，用于interpolate字符串。
   * @param expr - expr parameter (`string`) / expr参数（`string`）
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   */
  private interpolateString(expr: string, params?) {
    if (!params) {
      return expr;
    }

    return expr.replace(this.templateMatcher, (substring: string, b: string) => {
      let r = this.getValue(params, b);
      return isDefined(r) ? r : substring;
    });
  }
}
