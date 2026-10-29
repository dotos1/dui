/**
 * @fileoverview Module `src/core/form/error-state-matcher.ts` providing error state matcher definitions and implementation.
 * @zh 模块文件 `src/core/form/error-state-matcher.ts`，提供错误状态匹配器相关的定义与实现。
 */

import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Class `ExtErrorStateMatcher` encapsulating ext error state matcher data structures and logic in `src/core/form`.
 * @zh 类 `ExtErrorStateMatcher`，封装 `src/core/form` 中的Ext错误状态匹配器数据结构与处理逻辑。
 */
export class ExtErrorStateMatcher implements ErrorStateMatcher {
  /**
   * Creates an instance of `ExtErrorStateMatcher` and initializes its dependencies and internal state.
   * @zh 创建 `ExtErrorStateMatcher` 实例，并初始化其依赖项与内部状态。
   * @param field - Injected or initial field (`any`) / 注入或传入的字段（`any`）
   */
  constructor(private field) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `isErrorState` to handle is error state.
   * @zh 执行 `isErrorState`，用于是否为错误状态。
   * @param control - control parameter (`FormControl<any>`) / 表单控件参数（`FormControl<any>`）
   * @param form - form parameter (`FormGroupDirective | NgForm`) / 表单参数（`FormGroupDirective | NgForm`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.field && this.field.showError;
  }
}
