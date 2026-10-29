/**
 * @fileoverview Module `src/core/behaviors/disabled.mixin.ts` providing disabled mixin definitions and implementation.
 * @zh 模块文件 `src/core/behaviors/disabled.mixin.ts`，提供已禁用mixin相关的定义与实现。
 */

import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * Type alias `Constructor` representing constructor (`new (...args: any[]) => T`).
 * @zh 类型别名 `Constructor`，表示Constructor（`new (...args: any[]) => T`）。
 */
type Constructor<T> = new (...args) => T;

/**
 * Interface to implement when applying the disabled mixin
 * @zh 接口 `ICanDisable`，定义I是否可以禁用的数据结构契约与属性规范。
 */
export interface ICanDisable {
  /**
   * Property `disabled` (`boolean`) storing disabled.
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  disabled: boolean;
  /**
   * Executes `onDisabledChange` to handle on disabled change.
   * @zh 执行 `onDisabledChange`，用于当已禁用变更。
   * @param v - v parameter (`boolean`) / v参数（`boolean`）
   */
  onDisabledChange(v: boolean): void;
}

/**
 * Mixin to augment a component or directive with a `disabled` property.
 * @zh 执行 `mixinDisabled`，用于混入已禁用。
 */
export function mixinDisabled<T extends Constructor<object>>(
  base: T
): Constructor<ICanDisable> & T {
  return class extends base {
    private _disabled = false;

    constructor(...args) {
      super(...args);
    }

    get disabled(): boolean {
      return this._disabled;
    }
    set disabled(value: boolean) {
      const newValue: boolean = coerceBooleanProperty(value);
      if (this._disabled !== newValue) {
        this._disabled = newValue;
        this.onDisabledChange(this._disabled);
      }
    }

    onDisabledChange(v: boolean): void {
      /** NOT IMPLEMENTED, this needs to be overriden by subclasses if needed */
    }
  };
}