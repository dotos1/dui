/**
 * @fileoverview Module `src/ux/editor/validators.ts` providing validators definitions and implementation.
 * @zh 模块文件 `src/ux/editor/validators.ts`，提供校验器列表相关的定义与实现。
 */

import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Schema, Node as ProseMirrorNode } from 'prosemirror-model';
import { parseContent } from './parsers';
import { schema as defaultSchema} from './schema';

/**
 * Type alias `ValidationErrors` representing validation errors (`Record<string, any>`).
 * @zh 类型别名 `ValidationErrors`，表示校验错误列表（`Record<string, any>`）。
 */
type ValidationErrors = Record<string, unknown>;

/**
 * Constant/variable `isEmptyInputValue` defining is empty input value in `src/ux/editor`.
 * @zh 常量/变量 `isEmptyInputValue`，定义 `src/ux/editor` 中的是否为空输入属性值。
 */
const isEmptyInputValue = (value): boolean => {
  // we don't check for string here so it also works with arrays
  return value === null || value.length === 0;
};

/**
 * Constant/variable `hasValidLength` defining has valid length in `src/ux/editor`.
 * @zh 常量/变量 `hasValidLength`，定义 `src/ux/editor` 中的是否包含有效长度。
 */
const hasValidLength = (value): boolean => {
  // non-strict comparison is intentional, to check for both `null` and `undefined` values
  return value !== null && typeof value.length === 'number';
};

/**
 * Constant/variable `isDocEmpty` defining is doc empty in `src/ux/editor`.
 * @zh 常量/变量 `isDocEmpty`，定义 `src/ux/editor` 中的是否为文档空。
 */
const isDocEmpty = (doc: ProseMirrorNode | null): boolean => {
  if (!doc) {
    return true;
  }

  const { childCount, firstChild } = doc;
  return Boolean(childCount === 1 && firstChild?.isTextblock && firstChild.content.size === 0);
};

// @dynamic
/**
 * Class `Validators` encapsulating validators data structures and logic in `src/ux/editor`.
 * @zh 类 `Validators`，封装 `src/ux/editor` 中的校验器列表数据结构与处理逻辑。
 */
export class Validators {
  /**
   * Executes `required` to handle required.
   * @zh 执行 `required`，用于必填。
   * @param userSchema - user schema parameter (`Schema`) / 用户结构定义参数（`Schema`）
   * @returns Result of type `ValidatorFn` / 类型为 `ValidatorFn` 的返回值
   */
  static required(userSchema?: Schema): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const schema = userSchema || defaultSchema;
      const doc = parseContent(control.value, schema);

      const isEmpty = isDocEmpty(doc);

      if (!isEmpty) {
        return null;
      }

      return {
        required: true,
      };
    };
  }

  /**
   * Executes `maxLength` to handle max length.
   * @zh 执行 `maxLength`，用于最大值长度。
   * @param maxLength - max length parameter (`number`) / 最大值长度参数（`number`）
   * @param userSchema - user schema parameter (`Schema`) / 用户结构定义参数（`Schema`）
   * @returns Result of type `ValidatorFn` / 类型为 `ValidatorFn` 的返回值
   */
  static maxLength(maxLength: number, userSchema?: Schema): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const schema = userSchema || defaultSchema;
      const doc = parseContent(control.value, schema);

      const value = doc.textContent;

      if (hasValidLength(value) && value.length > maxLength) {
        return {
          maxlength: {
            requiredLength: maxLength,
            actualLength: value.length,
          },
        };
      }

      return null;
    };
  }

  /**
   * Executes `minLength` to handle min length.
   * @zh 执行 `minLength`，用于最小值长度。
   * @param minLength - min length parameter (`number`) / 最小值长度参数（`number`）
   * @param userSchema - user schema parameter (`Schema`) / 用户结构定义参数（`Schema`）
   * @returns Result of type `ValidatorFn` / 类型为 `ValidatorFn` 的返回值
   */
  static minLength(minLength: number, userSchema?: Schema): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const schema = userSchema || defaultSchema;
      const doc = parseContent(control.value, schema);

      const value = doc.textContent;

      if (isEmptyInputValue(value) || !hasValidLength(value)) {
        // don't validate empty values to allow optional controls
        // don't validate values without `length` property
        return null;
      }

      if (value.length < minLength) {
        return {
          minlength: {
            requiredLength: minLength, actualLength: value.length,
          },
        };
      }

      return null;
    };
  }
}
