/**
 * @fileoverview Module `src/form/range/range.field.ts` providing range field definitions and implementation.
 * @zh 模块文件 `src/form/range/range.field.ts`，提供范围字段相关的定义与实现。
 */

import { Directive, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, merge, takeUntil } from 'rxjs';

import { MatField } from '@dotos/dui/form';

/**
 * 区间条件（between）的值。两端都是可选的：只填一端时由调用方决定退化成
 * `>=` 还是 `<=`，字段本身不做这种判断。

 * @zh 区间条件（between）的值。两端都是可选的：只填一端时由调用方决定退化成
 */
export interface RangeValue {
  /**
   * Property `from` (`any`) storing from.
   * @zh 属性 `from`（类型：`any`），用于存储或配置从。
   */
  from;
  /**
   * Property `to` (`any`) storing to.
   * @zh 属性 `to`（类型：`any`），用于存储或配置转换为。
   */
  to;
}

/**
 * Executes `isRangeValue` to handle is range value.
 * @zh 执行 `isRangeValue`，用于是否为范围值。
 * @param value - value parameter (`any`) / 值参数（`any`）
 * @returns Result of type `value is RangeValue` / 类型为 `value is RangeValue` 的返回值
 */
export function isRangeValue(value): value is RangeValue {
  return value != null && typeof value === 'object' && ('from' in value || 'to' in value);
}

/**
 * 区间输入字段的公共实现：对外只暴露一个 formControl，值为 `{from,to}`；
 * 对内维护 fromControl / toControl 两个子控件。
 *
 * 这样一个列上的 between 条件只占一个表单控件名，不必像以前那样拆成
 * “起始X >=” 和 “终止X <=” 两条件——它们的 name 都是列 id，会共用同一个
 * FormControl，改一个另一个跟着变（见 dotos-7.0 #710）。

 * @zh 区间输入字段的公共实现：对外只暴露一个 formControl，值为 `{from,to}`；
 */
@Directive()
export abstract class RangeField extends MatField implements OnInit, OnDestroy {

  /**
   * Property `fromControl` (`FormControl`) storing from control (default: `new FormControl()`).
   * @zh 属性 `fromControl`（类型：`FormControl`），用于存储或配置从表单控件（默认值：`new FormControl()`）。
   */
  fromControl = new FormControl();

  /**
   * Property `toControl` (`FormControl`) storing to control (default: `new FormControl()`).
   * @zh 属性 `toControl`（类型：`FormControl`），用于存储或配置转换为表单控件（默认值：`new FormControl()`）。
   */
  toControl = new FormControl();

  /**
   * Property `destroy$` (`Subject`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `destroy$`（类型：`Subject`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  protected destroy$ = new Subject<void>();

  /**
   * 防止 publish() 写回 formControl 时又被自己的 valueChanges 拆回子控件。
   * @zh 防止 publish() 写回 formControl 时又被自己的 valueChanges 拆回子控件。
   */
  private publishing = false;

  /**
   * 子控件里的原始值（日期是 moment）转成回传后台的标量文本。
   * @zh 子控件里的原始值（日期是 moment）转成回传后台的标量文本。
   */
  protected abstract formatPart(value): string;

  /**
   * 界面上显示的文本，默认与回传值相同；日期子类按 field.format 另行渲染。
   * @zh 界面上显示的文本，默认与回传值相同；日期子类按 field.format 另行渲染。
   */
  protected displayPart(value): string {
    return this.formatPart(value);
  }

  /**
   * 外部传入的标量文本转成子控件能用的值，日期子类需要把它解析成 moment。
   * @zh 外部传入的标量文本转成子控件能用的值，日期子类需要把它解析成 moment。
   */
  protected parsePart(value) {
    return this.isBlank(value) ? null : value;
  }

  /**
   * Gets the current from placeholder (`fromPlaceholder: string`).
   * @zh 获取当前从占位提示（`fromPlaceholder: string`）。
   */
  get fromPlaceholder(): string {
    return this.field.fromPlaceholder || 'FORM.RANGEFROM';
  }

  /**
   * Gets the current to placeholder (`toPlaceholder: string`).
   * @zh 获取当前转换为占位提示（`toPlaceholder: string`）。
   */
  get toPlaceholder(): string {
    return this.field.toPlaceholder || 'FORM.RANGETO';
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    super.ngOnInit();

    this.writeParts(this.formControl.value);

    this.formControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!this.publishing) {
          this.writeParts(value);
        }
      });

    merge(this.fromControl.valueChanges, this.toControl.valueChanges)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.publish());
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy();
  }

  /**
   * 两端都为空时整个条件视为未设置，`empty` 决定 label 是否上浮。
   * @zh 两端都为空时整个条件视为未设置，`empty` 决定 label 是否上浮。
   */
  override get empty() {
    return this.isBlank(this.fromControl.value) && this.isBlank(this.toControl.value);
  }

  /**
   * Gets the current display text (`displayText: string`).
   * 展示文本，例如 “2024/01 ~ 2024/12”。
   * @zh 展示文本，例如 “2024/01 ~ 2024/12”。
   */
  get displayText(): string {
    const from = this.displayPart(this.fromControl.value);
    const to = this.displayPart(this.toControl.value);
    if (from === '' && to === '') {
      return '';
    }
    return from + ' ~ ' + to;
  }

  /**
   * Executes `isBlank` to handle is blank.
   * @zh 执行 `isBlank`，用于是否为Blank。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected isBlank(value): boolean {
    return value === undefined || value === null || value === '';
  }

  /**
   * 外部（setValues / defaultValue / reset）写入时拆分到两个子控件。
   * @zh 外部（setValues / defaultValue / reset）写入时拆分到两个子控件。
   */
  protected writeParts(value) {
    const range = this.toRange(value);
    this.fromControl.setValue(this.parsePart(range.from), { emitEvent: false });
    this.toControl.setValue(this.parsePart(range.to), { emitEvent: false });
    this.field.inputValue = this.displayText;
    this.stateChanges.next();
  }

  /**
   * 接受 `{from,to}`、`[from,to]` 和 "from,to" 字符串三种写法，
   * ctrl_condition.default_value 里存的就是逗号分隔的那一种。

   * @zh 接受 `{from,to}`、`[from,to]` 和 "from,to" 字符串三种写法，
   */
  protected toRange(value): RangeValue {
    if (isRangeValue(value)) {
      return { from: value.from ?? null, to: value.to ?? null };
    }
    if (Array.isArray(value)) {
      return { from: value[0] ?? null, to: value[1] ?? null };
    }
    if (typeof value === 'string' && value.indexOf(',') !== -1) {
      const parts = value.split(',');
      return { from: parts[0], to: parts[1] };
    }
    return { from: null, to: null };
  }

  /**
   * 子控件变化时合成 `{from,to}` 写回 formControl，并通知 field.change。
   * @zh 子控件变化时合成 `{from,to}` 写回 formControl，并通知 field.change。
   */
  protected publish() {
    const from = this.fromControl.value;
    const to = this.toControl.value;
    const blank = this.isBlank(from) && this.isBlank(to);
    const value: RangeValue = blank ? null : {
      from: this.formatPart(from),
      to: this.formatPart(to)
    };

    this.field.inputValue = this.displayText;

    this.publishing = true;
    try {
      this.formControl.patchValue(value);
    } finally {
      this.publishing = false;
    }
    this.stateChanges.next();

    if (this.field.change) {
      this.field.change(this.field, value);
    }
  }
}
