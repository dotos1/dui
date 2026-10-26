/**
 * @fileoverview Module `src/common/dragselect/keyboard-events.service.ts` providing keyboard events service definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/keyboard-events.service.ts`，提供键盘事件集合服务相关的定义与实现。
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { distinctKeyEvents } from './operators';

/**
 * Injectable Angular service `KeyboardEventsService` managing keyboard events service state and operations in `src/common/dragselect`.
 * @zh 可注入的 Angular 服务 `KeyboardEventsService`，管理 `src/common/dragselect` 中的键盘事件集合服务状态与业务操作。
 */
@Injectable()
export class KeyboardEventsService {
  /**
   * Property `keydown$` (`Observable<KeyboardEvent>`) storing keydown.
   * @zh 属性 `keydown$`（类型：`Observable<KeyboardEvent>`），用于存储或配置按键按下。
   */
  keydown$: Observable<KeyboardEvent>;
  /**
   * Property `keyup$` (`Observable<KeyboardEvent>`) storing keyup.
   * @zh 属性 `keyup$`（类型：`Observable<KeyboardEvent>`），用于存储或配置按键抬起。
   */
  keyup$: Observable<KeyboardEvent>;
  /**
   * Property `distinctKeydown$` (`Observable<KeyboardEvent>`) storing distinct keydown.
   * @zh 属性 `distinctKeydown$`（类型：`Observable<KeyboardEvent>`），用于存储或配置distinct按键按下。
   */
  distinctKeydown$: Observable<KeyboardEvent>;
  /**
   * Property `distinctKeyup$` (`Observable<KeyboardEvent>`) storing distinct keyup.
   * @zh 属性 `distinctKeyup$`（类型：`Observable<KeyboardEvent>`），用于存储或配置distinct按键抬起。
   */
  distinctKeyup$: Observable<KeyboardEvent>;
  /**
   * Property `mouseup$` (`Observable<MouseEvent>`) storing mouseup.
   * @zh 属性 `mouseup$`（类型：`Observable<MouseEvent>`），用于存储或配置鼠标抬起。
   */
  mouseup$: Observable<MouseEvent>;
  /**
   * Property `mousemove$` (`Observable<MouseEvent>`) storing mousemove.
   * @zh 属性 `mousemove$`（类型：`Observable<MouseEvent>`），用于存储或配置鼠标移动。
   */
  mousemove$: Observable<MouseEvent>;

  /**
   * Creates an instance of `KeyboardEventsService` and initializes its dependencies and internal state.
   * @zh 创建 `KeyboardEventsService` 实例，并初始化其依赖项与内部状态。
   * @param platformId - Injected or initial platform id (`Object`) / 注入或传入的platform唯一标识（`Object`）
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this._initializeKeyboardStreams();
    }
  }

  /**
   * Executes `_initializeKeyboardStreams` to handle initialize keyboard streams.
   * @zh 执行 `_initializeKeyboardStreams`，用于初始化键盘流。
   */
  private _initializeKeyboardStreams() {
    this.keydown$ = fromEvent<KeyboardEvent>(window, 'keydown').pipe(share());
    this.keyup$ = fromEvent<KeyboardEvent>(window, 'keyup').pipe(share());

    this.distinctKeydown$ = this.keydown$.pipe(
      distinctKeyEvents(),
      share()
    );

    this.distinctKeyup$ = this.keyup$.pipe(
      distinctKeyEvents(),
      share()
    );

    this.mouseup$ = fromEvent<MouseEvent>(window, 'mouseup').pipe(share());
    this.mousemove$ = fromEvent<MouseEvent>(window, 'mousemove').pipe(share());
  }
}
