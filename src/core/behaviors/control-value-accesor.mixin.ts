/**
 * @fileoverview Module `src/core/behaviors/control-value-accesor.mixin.ts` providing control value accesor mixin definitions and implementation.
 * @zh 模块文件 `src/core/behaviors/control-value-accesor.mixin.ts`，提供表单控件值accesormixin相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { Observable, Subject } from 'rxjs';

/**
 * Type alias `Constructor` representing constructor (`new (...args: any[]) => T`).
 * @zh 类型别名 `Constructor`，表示Constructor（`new (...args: any[]) => T`）。
 */
type Constructor<T> = new (...args) => T;

/**
 * Constant/variable `noop` defining noop in `src/core/behaviors`.
 * @zh 常量/变量 `noop`，定义 `src/core/behaviors` 中的noop。
 */
const noop = () => {
  // empty method
};

/**
 * Interface `IControlValueAccessor` defining the contract and properties for i control value accessor.
 * @zh 接口 `IControlValueAccessor`，定义I表单控件值访问器的数据结构契约与属性规范。
 */
export interface IControlValueAccessor extends ControlValueAccessor {
  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value;
  /**
   * Property `valueChanges` (`any`) storing value changes.
   * @zh 属性 `valueChanges`（类型：`any`），用于存储或配置值变更集合。
   */
  valueChanges;
  /**
   * Property `onChange` (`(_: any) => any`) storing on change.
   * @zh 属性 `onChange`（类型：`(_: any) => any`），用于存储或配置当变更。
   */
  onChange: { (_) };
  /**
   * Property `onTouched` (`() => any`) storing on touched.
   * @zh 属性 `onTouched`（类型：`() => any`），用于存储或配置当是否已触碰。
   */
  onTouched: { () };
}

/**
 * Interface `IHasChangeDetectorRef` defining the contract and properties for i has change detector ref.
 * @zh 接口 `IHasChangeDetectorRef`，定义I是否包含变更检测器引用的数据结构契约与属性规范。
 */
export interface IHasChangeDetectorRef {
  /**
   * Property `_changeDetectorRef` (`ChangeDetectorRef`) storing change detector ref.
   * @zh 属性 `_changeDetectorRef`（类型：`ChangeDetectorRef`），用于存储或配置变更检测器引用。
   */
  _changeDetectorRef: ChangeDetectorRef;
}

/**
 * Mixin to augment a component with ngModel support.
 * @zh 执行 `mixinControlValueAccessor`，用于混入表单控件值访问器。
 */
export function mixinControlValueAccessor<
  T extends Constructor<IHasChangeDetectorRef>
>(base: T, initialValue?): Constructor<IControlValueAccessor> & T {
  return class extends base {
    private _value =
      initialValue instanceof Array
        ? Object.assign([], initialValue)
        : initialValue;
    private _subjectValueChanges;
    valueChanges;

    constructor(...args) {
      super(...args);
      this._subjectValueChanges = new Subject();
      this.valueChanges = this._subjectValueChanges.asObservable();
    }

    set value(v) {
      if (v !== this._value) {
        this._value = v;
        this.onChange(v);
        this._changeDetectorRef.markForCheck();
        this._subjectValueChanges.next(v);
      }
    }
    get value() {
      return this._value;
    }

    writeValue(value): void {
      if (value !== this._value) {
        this._value = value;
        this._subjectValueChanges.next(value);
      }
      this._changeDetectorRef.markForCheck();
    }

    registerOnChange(fn): void {
      this.onChange = fn;
    }

    registerOnTouched(fn): void {
      this.onTouched = fn;
    }

    onChange = (_) => noop;
    onTouched = () => noop;
  };
}