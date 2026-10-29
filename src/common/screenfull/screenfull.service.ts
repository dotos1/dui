/**
 * @fileoverview Module `src/common/screenfull/screenfull.service.ts` providing screenfull service definitions and implementation.
 * @zh 模块文件 `src/common/screenfull/screenfull.service.ts`，提供screenfull服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';

/**
 * Cross-browser wrapper around the Fullscreen API (with vendor-prefix fallbacks) to
 * request/exit fullscreen on a given element.
 * @zh 跨浏览器封装的全屏 API（含各厂商前缀兼容），用于对指定元素请求进入/退出全屏。
 */
@Injectable({
  providedIn: 'root'
})
export class ScreenfullService {

  /**
   * Whether this browser's fullscreen API accepts a keyboard-input-allowed flag (Safari 5.1 workaround).
   * @zh 当前浏览器的全屏 API 是否接受"允许键盘输入"标志（用于兼容 Safari 5.1）。
   */
  keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
  /**
   * Whether any element is currently displayed in fullscreen.
   * @zh 当前是否有元素正处于全屏状态。
   */
  get isFullscreen() {
    return document[this.fn.fullscreenElement] as boolean;
  }

  /**
   * Property `fn` (`any`) storing fn.
   * @zh 属性 `fn`（类型：`any`），用于存储或配置函数。
   */
  private fn;
  /**
   * Property `eventNameMap` (`{ change: () => {}; error: () => {} }`) storing event name map.
   * @zh 属性 `eventNameMap`（类型：`{ change: () => {}; error: () => {} }`），用于存储或配置事件名称映射表。
   */
  private eventNameMap: { change: () => {}; error: () => {} };

  /**
   * Creates an instance of `ScreenfullService` and initializes its dependencies and internal state.
   * @zh 创建 `ScreenfullService` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    this.fn = this.init();
    this.eventNameMap = {
      change: this.fn.fullscreenchange,
      error: this.fn.fullscreenerror
    };
  }

  /**
   * Exits fullscreen if currently active, otherwise requests fullscreen on the given element.
   * @zh 若当前处于全屏则退出全屏，否则对指定元素请求进入全屏。
   */
  toggle(elem: HTMLElement) {
    return this.isFullscreen ? this.exit() : this.request(elem);
  }

  /**
   * Requests fullscreen on the given element (or `document.documentElement` if omitted).
   * @zh 对指定元素请求进入全屏（未指定时默认为 `document.documentElement`）。
   */
  request(element: HTMLElement) {
    return new Promise((resolve) => {
      const request = this.fn.requestFullscreen;

      const onFullScreenEntered = () => {
        this.off('change', onFullScreenEntered);
        resolve(undefined);
      };

      element = element || document.documentElement;

      // Work around Safari 5.1 bug: reports support for
      // keyboard in fullscreen even though it doesn't.
      // Browser sniffing, since the alternative with
      // setTimeout is even worse.
      if (/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)) {
        element[request]();
      } else {
        element[request](this.keyboardAllowed ? (Element as unknown as { ALLOW_KEYBOARD_INPUT? }).ALLOW_KEYBOARD_INPUT : {});
      }

      this.on('change', onFullScreenEntered);
    });
  }

  /**
   * Executes `exit` to handle exit.
   * @zh 执行 `exit`，用于exit。
   */
  private exit() {
    return new Promise((resolve) => {
      if (!this.isFullscreen) {
        resolve(undefined);
        return;
      }
      const onFullScreenExit = () => {
        this.off('change', onFullScreenExit);
        resolve(undefined);
      };
      document[this.fn.exitFullscreen]();
      this.on('change', onFullScreenExit);
    });
  }

  /**
   * Executes `off` to handle off.
   * @zh 执行 `off`，用于off。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   * @param callback - callback parameter (`any`) / 回调函数参数（`any`）
   */
  private off(event, callback) {
    const eventName = this.eventNameMap[event];
    if (eventName) {
      document.removeEventListener(eventName, callback, false);
    }
  }

  /**
   * Executes `on` to handle on.
   * @zh 执行 `on`，用于当。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   * @param callback - callback parameter (`any`) / 回调函数参数（`any`）
   */
  private on(event, callback) {
    const eventName = this.eventNameMap[event];
    if (eventName) {
      document.addEventListener(eventName, callback, false);
    }
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  private init() {
    let val;
    const fnMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // New WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      // Old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ];

    let i = 0;
    const l = fnMap.length;
    const ret: Record<string, unknown> = {};
    for (; i < l; i++) {
      val = fnMap[i];
      if (val && val[1] in document) {
        for (i = 0; i < val.length; i++) {
          ret[fnMap[0][i]] = val[i];
        }
        return ret;
      }
    }
    return false;
  }
}
