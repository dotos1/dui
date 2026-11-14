/**
 * @fileoverview Module `src/form/date/picker/datetimepicker-toggle.ts` providing datetimepicker toggle definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/datetimepicker-toggle.ts`，提供日期时间选择器开关相关的定义与实现。
 */

import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation
} from "@angular/core";
import {MatDatepickerIntl} from "@angular/material/datepicker";
import {merge, Observable, of as observableOf, Subscription} from "rxjs";
import {MatDatetimepicker} from "./datetimepicker";

/**
 * Angular component `MatDatetimepickerToggle` (selector: 'mat-datetimepicker-toggle') providing mat datetimepicker toggle presentation and interaction in `src/form/date/picker`.
 * @zh Angular 组件 `MatDatetimepickerToggle`（selector: 'mat-datetimepicker-toggle'），提供Material日期时间选择器开关的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  selector: "mat-datetimepicker-toggle",
  templateUrl: "datetimepicker-toggle.html",
  host: {
    "class": "mat-datetimepicker-toggle",
    hostID: "mat-datetimepicker-toggle" + Math.random().toString(36).substring(2, 15),
  },
  exportAs: "matDatetimepickerToggle",
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class MatDatetimepickerToggle<D> implements AfterContentInit, OnChanges, OnDestroy {
  /**
   * Datepicker instance that the button will toggle.
   * @zh 输入属性 `for`（类型：`MatDatetimepicker<D>`），用于配置日期时间选择器。
   */
    // tslint:disable-next-line:no-input-rename
  @Input("for") datetimepicker: MatDatetimepicker<D>;
  /**
   * Property `_stateChanges` (`Subscription`) storing state changes (default: `Subscription.EMPTY`).
   * @zh 属性 `_stateChanges`（类型：`Subscription`），用于存储或配置状态变更集合（默认值：`Subscription.EMPTY`）。
   */
  private _stateChanges = Subscription.EMPTY;

  /**
   * Creates an instance of `MatDatetimepickerToggle` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerToggle` 实例，并初始化其依赖项与内部状态。
   * @param _intl - Injected or initial intl (`MatDatepickerIntl`) / 注入或传入的intl（`MatDatepickerIntl`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(public _intl: MatDatepickerIntl, private _changeDetectorRef: ChangeDetectorRef) {
  }

  /**
   * Property `_disabled` (`boolean`) storing disabled.
   * @zh 属性 `_disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  private _disabled: boolean;

  /**
   * Whether the toggle button is disabled.
   * @zh 输入属性 `disabled`（类型：`boolean`）的读取器，返回当前已禁用。
   */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined ? this.datetimepicker.disabled : !!this._disabled;
  }

  /**
   * Sets the disabled (`disabled`).
   * @zh 设置已禁用（`disabled`）。
   * @param value - New disabled value (`boolean`) / 新的已禁用值（`boolean`）
   */
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes["datetimepicker"] || changes["datepicker"]) {
      this._watchStateChanges();
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._watchStateChanges();
  }

  /**
   * Executes `_open` to handle open.
   * @zh 执行 `_open`，用于打开。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  _open(event: Event): void {
    if (this.datetimepicker && !this.disabled) {
      this.datetimepicker.open();
      event.stopPropagation();
    }
  }

  /**
   * Executes `_watchStateChanges` to handle watch state changes.
   * @zh 执行 `_watchStateChanges`，用于监听状态变更集合。
   */
  private _watchStateChanges() {
    const datepickerDisabled = this.datetimepicker ? this.datetimepicker._disabledChange : observableOf();
    const inputDisabled = this.datetimepicker && this.datetimepicker._datepickerInput ?
      this.datetimepicker._datepickerInput._disabledChange : observableOf();

    this._stateChanges.unsubscribe();
    this._stateChanges = merge(this._intl.changes as Observable<unknown>, datepickerDisabled as Observable<unknown>, inputDisabled as Observable<unknown>)
      .subscribe(() => this._changeDetectorRef.markForCheck());
  }
}
