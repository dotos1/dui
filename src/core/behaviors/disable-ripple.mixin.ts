/**
 * @fileoverview Module `src/core/behaviors/disable-ripple.mixin.ts` providing disable ripple mixin definitions and implementation.
 * @zh 模块文件 `src/core/behaviors/disable-ripple.mixin.ts`，提供禁用ripplemixin相关的定义与实现。
 */

import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * Type alias `Constructor` representing constructor (`new (...args: any[]) => T`).
 * @zh 类型别名 `Constructor`，表示Constructor（`new (...args: any[]) => T`）。
 */
type Constructor<T> = new (...args) => T;

/**
 * Interface to implement when applying the disabled mixin
 * @zh 接口 `ICanDisableRipple`，定义I是否可以禁用Ripple的数据结构契约与属性规范。
 */
export interface ICanDisableRipple {
  /**
   * Property `disableRipple` (`boolean`) storing disable ripple.
   * @zh 属性 `disableRipple`（类型：`boolean`），用于存储或配置禁用Ripple。
   */
  disableRipple: boolean;
  /**
   * Executes `onDisableRippleChange` to handle on disable ripple change.
   * @zh 执行 `onDisableRippleChange`，用于当禁用Ripple变更。
   * @param v - v parameter (`boolean`) / v参数（`boolean`）
   */
  onDisableRippleChange(v: boolean): void;
}

/**
 * Mixin to augment a component or directive with a `disabled` property.
 * @zh 执行 `mixinDisableRipple`，用于mixin禁用Ripple。
 */
export function mixinDisableRipple<
  T extends Constructor<Record<string, unknown>>
>(base: T): Constructor<ICanDisableRipple> & T {
  return class extends base {
    private _disableRipple = false;

    constructor(...args) {
      super(...args);
    }

    get disableRipple(): boolean {
      return this._disableRipple;
    }
    set disableRipple(value: boolean) {
      const newValue: boolean = coerceBooleanProperty(value);
      if (this._disableRipple !== newValue) {
        this._disableRipple = newValue;
        this.onDisableRippleChange(this._disableRipple);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDisableRippleChange(v: boolean): void {
      /** NOT IMPLEMENTED, this needs to be overriden by subclasses if needed */
    }
  };
}