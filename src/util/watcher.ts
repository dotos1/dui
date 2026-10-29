/**
 * @fileoverview Module `src/util/watcher.ts` providing watcher definitions and implementation.
 * @zh 模块文件 `src/util/watcher.ts`，提供watcher相关的定义与实现。
 */

import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Enumeration `SubjectStatus` defining supported subject status constants.
 * @zh 枚举 `SubjectStatus`，定义支持的主题流状态常量集合。
 */
export enum SubjectStatus {
  /**
   * Enum member `SubjectStatus.Error` = 0 representing error.
   * @zh 枚举项 `SubjectStatus.Error` = 0，表示错误。
   */
  Error = 0,
  /**
   * Enum member `SubjectStatus.Done` = 1 representing done.
   * @zh 枚举项 `SubjectStatus.Done` = 1，表示完成。
   */
  Done = 1,
  /**
   * Enum member `SubjectStatus.Working` = 2 representing working.
   * @zh 枚举项 `SubjectStatus.Working` = 2，表示Working。
   */
  Working = 2,
  /**
   * Enum member `SubjectStatus.Waiting` = 3 representing waiting.
   * @zh 枚举项 `SubjectStatus.Waiting` = 3，表示Waiting。
   */
  Waiting = 3
}

/**
 * Class `Watcher` encapsulating watcher data structures and logic in `src/util`.
 * @zh 类 `Watcher`，封装 `src/util` 中的Watcher数据结构与处理逻辑。
 */
export abstract class Watcher {
  /**
   * Property `status$` (`Subject<SubjectStatus>`) storing status (default: `new Subject<SubjectStatus>()`).
   * @zh 属性 `status$`（类型：`Subject<SubjectStatus>`），用于存储或配置状态（默认值：`new Subject<SubjectStatus>()`）。
   */
  public status$ = new Subject<SubjectStatus>();
  /**
   * Property `status$$` (`Subscription`) storing status.
   * @zh 属性 `status$$`（类型：`Subscription`），用于存储或配置状态。
   */
  protected status$$: Subscription;

  /**
   * Gets the current status (`status: SubjectStatus`).
   * @zh 获取当前状态（`status: SubjectStatus`）。
   */
  get status(): SubjectStatus {
    return this._status;
  }
  /**
   * Sets the status (`status`).
   * @zh 设置状态（`status`）。
   * @param value - New status value (`SubjectStatus`) / 新的状态值（`SubjectStatus`）
   */
  set status(value: SubjectStatus) {
    this._status = value;
    this.status$.next(value);
  }
  /**
   * Property `_status` (`SubjectStatus`) storing status.
   * @zh 属性 `_status`（类型：`SubjectStatus`），用于存储或配置状态。
   */
  private _status: SubjectStatus;

  /**
   * Executes `watch` to handle watch.
   * @zh 执行 `watch`，用于监听。
   */
  protected abstract watch();

  /**
   * Executes `unwatch` to handle unwatch.
   * @zh 执行 `unwatch`，用于unwatch。
   */
  protected abstract unwatch();

  // tslint:disable-next-line:ban-types
  /**
   * Executes `subscribe` to handle subscribe.
   * @zh 执行 `subscribe`，用于订阅。
   * @param callback - callback parameter (`Function`) / 回调函数参数（`Function`）
   * @param scope - scope parameter (`unknown`) / scope参数（`unknown`）
   */
  subscribe(callback: Function, scope?: unknown) {
    this.watch();

    this.status$$ = this.status$
      .pipe(distinctUntilChanged())
      .subscribe((status: SubjectStatus) => {
        this.handleStatusChange(status);
        callback.call(scope, this);
      });
  }

  /**
   * Executes `unsubscribe` to handle unsubscribe.
   * @zh 执行 `unsubscribe`，用于取消订阅。
   */
  unsubscribe() {
    this.unwatch();
    if (this.status$$ !== undefined) {
      this.status$$.unsubscribe();
      this.status$$ = undefined;
    }
    this.status = SubjectStatus.Waiting;
  }

  /**
   * Executes `handleStatusChange` to handle handle status change.
   * @zh 执行 `handleStatusChange`，用于连接手柄状态变更。
   * @param status - status parameter (`SubjectStatus`) / 状态参数（`SubjectStatus`）
   */
  protected handleStatusChange(status: SubjectStatus) {}
}
