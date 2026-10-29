/**
 * @fileoverview Module `src/common/toastr/toastr/toast-ref.ts` providing toast ref definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/toast-ref.ts`，提供toast引用相关的定义与实现。
 */

import { Observable, Subject } from 'rxjs';
import { OverlayRef } from '../overlay/overlay-ref';

/**
 * Reference to a toast opened via the Toastr service.

 * @zh 类 `ToastRef`，封装 `src/common/toastr/toastr` 中的Toast引用数据结构与处理逻辑。
 */
export class ToastRef<T> {
  /**
   * The instance of component opened into the toast.
   * @zh 属性 `componentInstance`（类型：`T`），用于存储或配置组件实例。
   */
  componentInstance!: T;

  /**
   * Count of duplicates of this toast
   * @zh 属性 `duplicatesCount`（类型：`number`），用于存储或配置duplicates计数（默认值：`0`）。
   */
  private duplicatesCount = 0;

  /**
   * Property `_afterClosed` (`Subject<void>`) storing after closed (default: `new Subject<void>()`).
   * @zh 属性 `_afterClosed`（类型：`Subject<void>`），用于存储或配置之后是否关闭（默认值：`new Subject<void>()`）。
   */
  private _afterClosed = new Subject<void>();
  /**
   * Property `_activate` (`Subject<void>`) storing activate (default: `new Subject<void>()`).
   * @zh 属性 `_activate`（类型：`Subject<void>`），用于存储或配置激活（默认值：`new Subject<void>()`）。
   */
  private _activate = new Subject<void>();
  /**
   * Property `_manualClose` (`Subject<void>`) storing manual close (default: `new Subject<void>()`).
   * @zh 属性 `_manualClose`（类型：`Subject<void>`），用于存储或配置手动关闭（默认值：`new Subject<void>()`）。
   */
  private _manualClose = new Subject<void>();
  /**
   * Property `_resetTimeout` (`Subject<void>`) storing reset timeout (default: `new Subject<void>()`).
   * @zh 属性 `_resetTimeout`（类型：`Subject<void>`），用于存储或配置重置延时器（默认值：`new Subject<void>()`）。
   */
  private _resetTimeout = new Subject<void>();
  /**
   * Property `_countDuplicate` (`Subject<number>`) storing count duplicate (default: `new Subject<number>()`).
   * @zh 属性 `_countDuplicate`（类型：`Subject<number>`），用于存储或配置计数Duplicate（默认值：`new Subject<number>()`）。
   */
  private _countDuplicate = new Subject<number>();

  /**
   * Creates an instance of `ToastRef` and initializes its dependencies and internal state.
   * @zh 创建 `ToastRef` 实例，并初始化其依赖项与内部状态。
   * @param _overlayRef - Injected or initial overlay ref (`OverlayRef`) / 注入或传入的浮层引用（`OverlayRef`）
   */
  constructor(private _overlayRef: OverlayRef) {}

  /**
   * Executes `manualClose` to handle manual close.
   * @zh 执行 `manualClose`，用于手动关闭。
   */
  manualClose() {
    this._manualClose.next();
    this._manualClose.complete();
  }

  /**
   * Executes `manualClosed` to handle manual closed.
   * @zh 执行 `manualClosed`，用于手动是否关闭。
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  manualClosed() {
    return this._manualClose.asObservable();
  }

  /**
   * Executes `timeoutReset` to handle timeout reset.
   * @zh 执行 `timeoutReset`，用于延时器重置。
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  timeoutReset() {
    return this._resetTimeout.asObservable();
  }

  /**
   * Executes `countDuplicate` to handle count duplicate.
   * @zh 执行 `countDuplicate`，用于计数Duplicate。
   * @returns Result of type `Observable<number>` / 类型为 `Observable<number>` 的返回值
   */
  countDuplicate(): Observable<number> {
    return this._countDuplicate.asObservable();
  }

  /**
   * Executes `close` to handle close.
   * @zh 执行 `close`，用于关闭。
   */
  close(): void {
    this._overlayRef.detach();
    this._afterClosed.next();
    this._manualClose.next();
    this._afterClosed.complete();
    this._manualClose.complete();
    this._activate.complete();
    this._resetTimeout.complete();
    this._countDuplicate.complete();
  }

  /**
   * Executes `afterClosed` to handle after closed.
   * @zh 执行 `afterClosed`，用于之后是否关闭。
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  afterClosed() {
    return this._afterClosed.asObservable();
  }

  /**
   * Executes `isInactive` to handle is inactive.
   * @zh 执行 `isInactive`，用于是否为未激活。
   */
  isInactive() {
    return this._activate.isStopped;
  }

  /**
   * Executes `activate` to handle activate.
   * @zh 执行 `activate`，用于激活。
   */
  activate() {
    this._activate.next();
    this._activate.complete();
  }

  /**
   * Gets an observable that is notified when the toast has started opening.
   * @zh 执行 `afterActivate`，用于之后激活。
   */
  afterActivate() {
    return this._activate.asObservable();
  }

  /**
   * Reset the toast timouts and count duplicates
   * @zh 执行 `onDuplicate`，用于当Duplicate。
   */
  onDuplicate(resetTimeout: boolean, countDuplicate: boolean) {
    if (resetTimeout) {
      this._resetTimeout.next();
    }
    if (countDuplicate) {
      this._countDuplicate.next(++this.duplicatesCount);
    }
  }
}
