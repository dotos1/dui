/**
 * @fileoverview Module `src/container/gridster/gridsterScroll.service.ts` providing gridster scroll service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterScroll.service.ts`，提供网格拖拽布局滚动服务相关的定义与实现。
 */

import {GridsterResizeEventType} from './gridsterResizeEventType.interface';
import {GridsterComponentInterface} from './gridster.interface';

/**
 * Constant/variable `scrollSensitivity` defining scroll sensitivity in `src/container/gridster`.
 * @zh 常量/变量 `scrollSensitivity`，定义 `src/container/gridster` 中的滚动Sensitivity。
 */
let scrollSensitivity: number;
/**
 * Constant/variable `scrollSpeed` defining scroll speed in `src/container/gridster`.
 * @zh 常量/变量 `scrollSpeed`，定义 `src/container/gridster` 中的滚动速度。
 */
let scrollSpeed: number;
/**
 * Constant/variable `intervalDuration` defining interval duration in `src/container/gridster`.
 * @zh 常量/变量 `intervalDuration`，定义 `src/container/gridster` 中的间隔定时器持续时间。
 */
const intervalDuration = 50;
/**
 * Constant/variable `gridsterElement` defining gridster element in `src/container/gridster`.
 * @zh 常量/变量 `gridsterElement`，定义 `src/container/gridster` 中的网格拖拽布局元素。
 */
let gridsterElement;
/**
 * Constant/variable `resizeEvent` defining resize event in `src/container/gridster`.
 * @zh 常量/变量 `resizeEvent`，定义 `src/container/gridster` 中的调整尺寸事件。
 */
let resizeEvent: boolean | undefined;
/**
 * Constant/variable `resizeEventType` defining resize event type in `src/container/gridster`.
 * @zh 常量/变量 `resizeEventType`，定义 `src/container/gridster` 中的调整尺寸事件类型。
 */
let resizeEventType: GridsterResizeEventType | undefined;
/**
 * Constant/variable `intervalE` defining interval e in `src/container/gridster`.
 * @zh 常量/变量 `intervalE`，定义 `src/container/gridster` 中的间隔定时器E。
 */
let intervalE;
/**
 * Constant/variable `intervalW` defining interval w in `src/container/gridster`.
 * @zh 常量/变量 `intervalW`，定义 `src/container/gridster` 中的间隔定时器W。
 */
let intervalW;
/**
 * Constant/variable `intervalN` defining interval n in `src/container/gridster`.
 * @zh 常量/变量 `intervalN`，定义 `src/container/gridster` 中的间隔定时器N。
 */
let intervalN;
/**
 * Constant/variable `intervalS` defining interval s in `src/container/gridster`.
 * @zh 常量/变量 `intervalS`，定义 `src/container/gridster` 中的间隔定时器S。
 */
let intervalS;

/**
 * Executes `scroll` to handle scroll.
 * @zh 执行 `scroll`，用于滚动。
 * @param gridster - gridster parameter (`GridsterComponentInterface`) / 网格拖拽布局参数（`GridsterComponentInterface`）
 * @param left - left parameter (`number`) / 左侧位置参数（`number`）
 * @param top - top parameter (`number`) / 顶部位置参数（`number`）
 * @param width - width parameter (`number`) / 宽度参数（`number`）
 * @param height - height parameter (`number`) / 高度参数（`number`）
 * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
 * @param lastMouse - last mouse parameter (`any`) / 末尾鼠标参数（`any`）
 * @param calculateItemPosition - calculate item position parameter (`Function`) / 计算条目位置参数（`Function`）
 * @param resize - resize parameter (`boolean`) / 调整尺寸参数（`boolean`）
 * @param resizeEventScrollType - resize event scroll type parameter (`GridsterResizeEventType`) / 调整尺寸事件滚动类型参数（`GridsterResizeEventType`）
 */
export function scroll(gridster: GridsterComponentInterface, left: number, top: number, width: number, height: number,
                       e: MouseEvent, lastMouse,
                       calculateItemPosition: Function, resize?: boolean, resizeEventScrollType?: GridsterResizeEventType) {
  scrollSensitivity = gridster.$options.scrollSensitivity;
  scrollSpeed = gridster.$options.scrollSpeed;
  gridsterElement = gridster.el;
  resizeEvent = resize;
  resizeEventType = resizeEventScrollType;

  const offsetWidth = gridsterElement.offsetWidth;
  const offsetHeight = gridsterElement.offsetHeight;
  const offsetLeft = gridsterElement.scrollLeft;
  const offsetTop = gridsterElement.scrollTop;
  const elemTopOffset = top - offsetTop;
  const elemBottomOffset = offsetHeight + offsetTop - top - height;

  if (!gridster.$options.disableScrollVertical) {
    if (lastMouse.clientY < e.clientY && elemBottomOffset < scrollSensitivity) {
      cancelN();
      if ((resizeEvent && resizeEventType && !resizeEventType.s) || intervalS) {
        return;
      }
      intervalS = startVertical(1, calculateItemPosition, lastMouse);
    } else if (lastMouse.clientY > e.clientY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
      cancelS();
      if ((resizeEvent && resizeEventType && !resizeEventType.n) || intervalN) {
        return;
      }
      intervalN = startVertical(-1, calculateItemPosition, lastMouse);
    } else if (lastMouse.clientY !== e.clientY) {
      cancelVertical();
    }
  }

  const elemRightOffset = offsetLeft + offsetWidth - left - width;
  const elemLeftOffset = left - offsetLeft;

  if (!gridster.$options.disableScrollHorizontal) {
    if (lastMouse.clientX < e.clientX && elemRightOffset <= scrollSensitivity) {
      cancelW();
      if ((resizeEvent && resizeEventType && !resizeEventType.e) || intervalE) {
        return;
      }
      intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
    } else if (lastMouse.clientX > e.clientX && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
      cancelE();
      if ((resizeEvent && resizeEventType && !resizeEventType.w) || intervalW) {
        return;
      }
      intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
    } else if (lastMouse.clientX !== e.clientX) {
      cancelHorizontal();
    }
  }
}

/**
 * Executes `startVertical` to handle start vertical.
 * @zh 执行 `startVertical`，用于开始垂直。
 * @param sign - sign parameter (`number`) / sign参数（`number`）
 * @param calculateItemPosition - calculate item position parameter (`Function`) / 计算条目位置参数（`Function`）
 * @param lastMouse - last mouse parameter (`any`) / 末尾鼠标参数（`any`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function startVertical(sign: number, calculateItemPosition: Function, lastMouse) {
  let clientY = lastMouse.clientY;
  return setInterval(() => {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
      cancelVertical();
    }
    gridsterElement.scrollTop += sign * scrollSpeed;
    clientY += sign * scrollSpeed;
    calculateItemPosition({clientX: lastMouse.clientX, clientY: clientY});
  }, intervalDuration);
}

/**
 * Executes `startHorizontal` to handle start horizontal.
 * @zh 执行 `startHorizontal`，用于开始水平。
 * @param sign - sign parameter (`number`) / sign参数（`number`）
 * @param calculateItemPosition - calculate item position parameter (`Function`) / 计算条目位置参数（`Function`）
 * @param lastMouse - last mouse parameter (`any`) / 末尾鼠标参数（`any`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function startHorizontal(sign: number, calculateItemPosition: Function, lastMouse) {
  let clientX = lastMouse.clientX;
  return setInterval(() => {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
      cancelHorizontal();
    }
    gridsterElement.scrollLeft += sign * scrollSpeed;
    clientX += sign * scrollSpeed;
    calculateItemPosition({clientX: clientX, clientY: lastMouse.clientY});
  }, intervalDuration);
}

/**
 * Executes `cancelScroll` to handle cancel scroll.
 * @zh 执行 `cancelScroll`，用于取消滚动。
 */
export function cancelScroll() {
  cancelHorizontal();
  cancelVertical();
  gridsterElement = undefined;
}

/**
 * Executes `cancelHorizontal` to handle cancel horizontal.
 * @zh 执行 `cancelHorizontal`，用于取消水平。
 */
function cancelHorizontal() {
  cancelE();
  cancelW();
}

/**
 * Executes `cancelVertical` to handle cancel vertical.
 * @zh 执行 `cancelVertical`，用于取消垂直。
 */
function cancelVertical() {
  cancelN();
  cancelS();
}

/**
 * Executes `cancelE` to handle cancel e.
 * @zh 执行 `cancelE`，用于取消E。
 */
function cancelE() {
  if (intervalE) {
    clearInterval(intervalE);
    intervalE = 0;
  }
}

/**
 * Executes `cancelW` to handle cancel w.
 * @zh 执行 `cancelW`，用于取消W。
 */
function cancelW() {
  if (intervalW) {
    clearInterval(intervalW);
    intervalW = 0;
  }
}

/**
 * Executes `cancelS` to handle cancel s.
 * @zh 执行 `cancelS`，用于取消S。
 */
function cancelS() {
  if (intervalS) {
    clearInterval(intervalS);
    intervalS = 0;
  }
}

/**
 * Executes `cancelN` to handle cancel n.
 * @zh 执行 `cancelN`，用于取消N。
 */
function cancelN() {
  if (intervalN) {
    clearInterval(intervalN);
    intervalN = 0;
  }
}
