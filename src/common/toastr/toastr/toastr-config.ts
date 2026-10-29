/**
 * @fileoverview Module `src/common/toastr/toastr/toastr-config.ts` providing toastr config definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/toastr-config.ts`，提供轻提示配置相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { ComponentType } from '../portal/portal';
import { ToastRef } from './toast-ref';

/**
 * Type alias `ProgressAnimationType` representing progress animation type (`'increasing' | 'decreasing'`).
 * @zh 类型别名 `ProgressAnimationType`，表示进度条动画类型（`'increasing' | 'decreasing'`）。
 */
export type ProgressAnimationType = 'increasing' | 'decreasing';
/**
 * Type alias `DisableTimoutType` representing disable timout type (`boolean | 'timeOut' | 'extendedTimeOut'`).
 * @zh 类型别名 `DisableTimoutType`，表示禁用Timout类型（`boolean | 'timeOut' | 'extendedTimeOut'`）。
 */
export type DisableTimoutType = boolean | 'timeOut' | 'extendedTimeOut';


/**
 * Interface `IndividualConfig` defining the contract and properties for individual config.
 * @zh 接口 `IndividualConfig`，定义Individual配置的数据结构契约与属性规范。
 */
export interface IndividualConfig<ConfigPayload = unknown> {
  /**
   * disable both timeOut and extendedTimeOut
   * default: false

   * @zh 属性 `disableTimeOut`（类型：`DisableTimoutType`），用于存储或配置禁用时间输出。
   */
  disableTimeOut: DisableTimoutType;
  /**
   * toast time to live in milliseconds
   * default: 5000

   * @zh 属性 `timeOut`（类型：`number`），用于存储或配置时间输出。
   */
  timeOut: number;
  /**
   * toast show close button
   * default: false

   * @zh 属性 `closeButton`（类型：`boolean`），用于存储或配置关闭按钮。
   */
  closeButton: boolean;
  /**
   * time to close after a user hovers over toast
   * default: 1000

   * @zh 属性 `extendedTimeOut`（类型：`number`），用于存储或配置extended时间输出。
   */
  extendedTimeOut: number;
  /**
   * show toast progress bar
   * default: false

   * @zh 属性 `progressBar`（类型：`boolean`），用于存储或配置进度条条。
   */
  progressBar: boolean;

  /**
   * changes toast progress bar animation
   * default: decreasing

   * @zh 属性 `progressAnimation`（类型：`ProgressAnimationType`），用于存储或配置进度条动画。
   */
  progressAnimation: ProgressAnimationType;

  /**
   * render html in toast message (possibly unsafe)
   * default: false

   * @zh 属性 `enableHtml`（类型：`boolean`），用于存储或配置启用HTML内容。
   */
  enableHtml: boolean;
  /**
   * css class on toast component
   * default: ngx-toastr

   * @zh 属性 `toastClass`（类型：`string`），用于存储或配置toast类名。
   */
  toastClass: string;
  /**
   * css class on toast container
   * default: toast-top-right

   * @zh 属性 `positionClass`（类型：`string`），用于存储或配置位置类名。
   */
  positionClass: string;
  /**
   * css class on toast title
   * default: toast-title

   * @zh 属性 `titleClass`（类型：`string`），用于存储或配置标题类名。
   */
  titleClass: string;
  /**
   * css class on toast message
   * default: toast-message

   * @zh 属性 `messageClass`（类型：`string`），用于存储或配置消息类名。
   */
  messageClass: string;
  /**
   * animation easing on toast
   * default: ease-in

   * @zh 属性 `easing`（类型：`string`），用于存储或配置easing。
   */
  easing: string;
  /**
   * animation ease time on toast
   * default: 300

   * @zh 属性 `easeTime`（类型：`string | number`），用于存储或配置ease时间。
   */
  easeTime: string | number;
  /**
   * clicking on toast dismisses it
   * default: true

   * @zh 属性 `tapToDismiss`（类型：`boolean`），用于存储或配置tap转换为Dismiss。
   */
  tapToDismiss: boolean;
  /**
   * Angular toast component to be shown
   * default: Toast

   * @zh 属性 `toastComponent`（类型：`any`），用于存储或配置toast组件。
   */
  toastComponent?;
  /**
   * Helps show toast from a websocket or from event outside Angular
   * default: false

   * @zh 属性 `onActivateTick`（类型：`boolean`），用于存储或配置当激活刻度。
   */
  onActivateTick: boolean;
  /**
   * New toast placement
   * default: true

   * @zh 属性 `newestOnTop`（类型：`boolean`），用于存储或配置newest当顶部位置。
   */
  newestOnTop: boolean;

  /**
   * Payload to pass to the toast component

   * @zh 属性 `payload`（类型：`ConfigPayload`），用于存储或配置payload。
   */
  payload?: ConfigPayload;
}

/**
 * Interface `ToastrIconClasses` defining the contract and properties for toastr icon classes.
 * @zh 接口 `ToastrIconClasses`，定义轻提示图标类名集合的数据结构契约与属性规范。
 */
export interface ToastrIconClasses {
  /**
   * Property `error` (`string`) storing error.
   * @zh 属性 `error`（类型：`string`），用于存储或配置错误。
   */
  error: string;
  /**
   * Property `info` (`string`) storing info.
   * @zh 属性 `info`（类型：`string`），用于存储或配置信息。
   */
  info: string;
  /**
   * Property `success` (`string`) storing success.
   * @zh 属性 `success`（类型：`string`），用于存储或配置成功。
   */
  success: string;
  /**
   * Property `warning` (`string`) storing warning.
   * @zh 属性 `warning`（类型：`string`），用于存储或配置警告。
   */
  warning: string;
  [key: string]: string;
}

/**
 * Global Toast configuration
 * Includes all IndividualConfig

 * @zh 接口 `GlobalConfig`，定义全局配置的数据结构契约与属性规范。
 */
export interface GlobalConfig extends IndividualConfig {
  /**
   * max toasts opened. Toasts will be queued
   * Zero is unlimited
   * default: 0

   * @zh 属性 `maxOpened`（类型：`number`），用于存储或配置最大值是否展开。
   */
  maxOpened: number;
  /**
   * dismiss current toast when max is reached
   * default: false

   * @zh 属性 `autoDismiss`（类型：`boolean`），用于存储或配置自动Dismiss。
   */
  autoDismiss: boolean;
  /**
   * Property `iconClasses` (`Partial<ToastrIconClasses>`) storing icon classes.
   * @zh 属性 `iconClasses`（类型：`Partial<ToastrIconClasses>`），用于存储或配置图标类名集合。
   */
  iconClasses: Partial<ToastrIconClasses>;
  /**
   * block duplicate messages
   * default: false

   * @zh 属性 `preventDuplicates`（类型：`boolean`），用于存储或配置阻止默认Duplicates。
   */
  preventDuplicates: boolean;
  /**
   * display the number of duplicate messages
   * default: false

   * @zh 属性 `countDuplicates`（类型：`boolean`），用于存储或配置计数Duplicates。
   */
  countDuplicates: boolean;
  /**
   * Reset toast timeout when there's a duplicate (preventDuplicates needs to be set to true)
   * default: false

   * @zh 属性 `resetTimeoutOnDuplicate`（类型：`boolean`），用于存储或配置重置延时器当Duplicate。
   */
  resetTimeoutOnDuplicate: boolean;
  /**
   * consider the title of a toast when checking if duplicate
   * default: false

   * @zh 属性 `includeTitleDuplicates`（类型：`boolean`），用于存储或配置include标题Duplicates。
   */
  includeTitleDuplicates: boolean;
}

/**
 * Everything a toast needs to launch

 * @zh 类 `ToastPackage`，封装 `src/common/toastr/toastr` 中的ToastPackage数据结构与处理逻辑。
 */
export class ToastPackage<ConfigPayload = unknown> {
  /**
   * Property `_onTap` (`Subject<void>`) storing on tap (default: `new Subject<void>()`).
   * @zh 属性 `_onTap`（类型：`Subject<void>`），用于存储或配置当Tap（默认值：`new Subject<void>()`）。
   */
  private _onTap = new Subject<void>();
  /**
   * Property `_onAction` (`Subject<void>`) storing on action (default: `new Subject<any>()`).
   * @zh 属性 `_onAction`（类型：`Subject<void>`），用于存储或配置当动作（默认值：`new Subject<any>()`）。
   */
  private _onAction = new Subject<void>();

  /**
   * Creates an instance of `ToastPackage` and initializes its dependencies and internal state.
   * @zh 创建 `ToastPackage` 实例，并初始化其依赖项与内部状态。
   * @param toastId - Injected or initial toast id (`number`) / 注入或传入的toast唯一标识（`number`）
   * @param config - Injected or initial config (`IndividualConfig<ConfigPayload>`) / 注入或传入的配置（`IndividualConfig<ConfigPayload>`）
   * @param message - Injected or initial message (`string`) / 注入或传入的消息（`string`）
   * @param title - Injected or initial title (`string`) / 注入或传入的标题（`string`）
   * @param toastType - Injected or initial toast type (`string`) / 注入或传入的toast类型（`string`）
   * @param toastRef - Injected or initial toast ref (`any`) / 注入或传入的toast引用（`any`）
   */
  constructor(
    public toastId: number,
    public config: IndividualConfig<ConfigPayload>,
    public message: string | null | undefined,
    public title: string | undefined,
    public toastType: string,
    public toastRef,
  ) {
    this.toastRef.afterClosed().subscribe(() => {
      this._onAction.complete();
      this._onTap.complete();
    });
  }

  /**
   * Fired on click
   * @zh 执行 `triggerTap`，用于触发Tap。
   */
  triggerTap(): void {
    this._onTap.next();
    if (this.config.tapToDismiss) {
      this._onTap.complete();
    }
  }

  /**
   * Executes `onTap` to handle on tap.
   * @zh 执行 `onTap`，用于当Tap。
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  onTap(): Observable<void> {
    return this._onTap.asObservable();
  }

  /**
   * available for use in custom toast
   * @zh 执行 `triggerAction`，用于触发动作。
   */
  triggerAction(action?): void {
    this._onAction.next(action);
  }

  /**
   * Executes `onAction` to handle on action.
   * @zh 执行 `onAction`，用于当动作。
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  onAction(): Observable<void> {
    return this._onAction.asObservable();
  }
}

/**
 * @deprecated use GlobalConfig
 * @zh 接口 `GlobalToastrConfig`，定义全局轻提示配置的数据结构契约与属性规范。
 */
export interface GlobalToastrConfig extends GlobalConfig {}
/**
 * @deprecated use IndividualConfig
 * @zh 接口 `IndividualToastrConfig`，定义Individual轻提示配置的数据结构契约与属性规范。
 */
export interface IndividualToastrConfig extends IndividualConfig {}
/**
 * @deprecated use IndividualConfig
 * @zh 接口 `ToastrConfig`，定义轻提示配置的数据结构契约与属性规范。
 */
export interface ToastrConfig extends IndividualConfig {}

/**
 * Constant/variable `DefaultNoComponentGlobalConfig` defining default no component global config in `src/common/toastr/toastr`.
 * @zh 常量/变量 `DefaultNoComponentGlobalConfig`，定义 `src/common/toastr/toastr` 中的默认No组件全局配置。
 */
export const DefaultNoComponentGlobalConfig: GlobalConfig = {
  maxOpened: 0,
  autoDismiss: false,
  newestOnTop: true,
  preventDuplicates: false,
  countDuplicates: false,
  resetTimeoutOnDuplicate: false,
  includeTitleDuplicates: false,

  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  },

  // Individual
  closeButton: false,
  disableTimeOut: false,
  timeOut: 5000,
  extendedTimeOut: 1000,
  enableHtml: false,
  progressBar: false,
  toastClass: 'ngx-toastr',
  positionClass: 'toast-top-right',
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  easing: 'ease-in',
  easeTime: 300,
  tapToDismiss: true,
  onActivateTick: false,
  progressAnimation: 'decreasing',
};

/**
 * Interface `ToastToken` defining the contract and properties for toast token.
 * @zh 接口 `ToastToken`，定义Toast令牌的数据结构契约与属性规范。
 */
export interface ToastToken {
  /**
   * Property `default` (`GlobalConfig`) storing default.
   * @zh 属性 `default`（类型：`GlobalConfig`），用于存储或配置默认。
   */
  default: GlobalConfig;
  /**
   * Property `config` (`Partial<GlobalConfig>`) storing config.
   * @zh 属性 `config`（类型：`Partial<GlobalConfig>`），用于存储或配置配置。
   */
  config: Partial<GlobalConfig>;
}

/**
 * Angular dependency-injection token `TOAST_CONFIG` for providing toast config.
 * @zh Angular 依赖注入令牌 `TOAST_CONFIG`，用于提供与注入TOAST配置。
 */
export const TOAST_CONFIG = new InjectionToken<ToastToken>('ToastConfig');
