/**
 * @fileoverview Module `src/common/dragselect/utils.ts` providing utils definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/utils.ts`，提供工具集相关的定义与实现。
 */

import { MIN_HEIGHT, MIN_WIDTH } from './constants';
import { BoundingBox, MousePosition, SelectBox, SelectContainerHost } from './models';

/**
 * Constant/variable `isObject` defining is object in `src/common/dragselect`.
 * @zh 常量/变量 `isObject`，定义 `src/common/dragselect` 中的是否为对象。
 */
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item) && item !== null;
};

/**
 * Executes `mergeDeep` to handle merge deep.
 * @zh 执行 `mergeDeep`，用于合并Deep。
 * @param target - target parameter (`Object`) / 目标参数（`Object`）
 * @param source - source parameter (`Object`) / 源参数（`Object`）
 */
export function mergeDeep(target: Object, source: Object) {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return target;
}

/**
 * Constant/variable `hasMinimumSize` defining has minimum size in `src/common/dragselect`.
 * @zh 常量/变量 `hasMinimumSize`，定义 `src/common/dragselect` 中的是否包含Minimum尺寸。
 */
export const hasMinimumSize = (selectBox: SelectBox<number>, minWidth = MIN_WIDTH, minHeight = MIN_HEIGHT) => {
  return selectBox.width > minWidth || selectBox.height > minHeight;
};

/**
 * Constant/variable `clearSelection` defining clear selection in `src/common/dragselect`.
 * @zh 常量/变量 `clearSelection`，定义 `src/common/dragselect` 中的清空Selection。
 */
export const clearSelection = (window: Window) => {
  const selection = window.getSelection();

  if (!selection) {
    return;
  }

  if (selection.removeAllRanges) {
    selection.removeAllRanges();
  } else if (selection.empty) {
    selection.empty();
  }
};

/**
 * Constant/variable `inBoundingBox` defining in bounding box in `src/common/dragselect`.
 * @zh 常量/变量 `inBoundingBox`，定义 `src/common/dragselect` 中的在包围边界盒子容器。
 */
export const inBoundingBox = (point: MousePosition, box: BoundingBox) => {
  return (
    box.left <= point.x && point.x <= box.left + box.width && box.top <= point.y && point.y <= box.top + box.height
  );
};

/**
 * Constant/variable `boxIntersects` defining box intersects in `src/common/dragselect`.
 * @zh 常量/变量 `boxIntersects`，定义 `src/common/dragselect` 中的盒子容器Intersects。
 */
export const boxIntersects = (boxA: BoundingBox, boxB: BoundingBox) => {
  return (
    boxA.left <= boxB.left + boxB.width &&
    boxA.left + boxA.width >= boxB.left &&
    boxA.top <= boxB.top + boxB.height &&
    boxA.top + boxA.height >= boxB.top
  );
};

/**
 * Constant/variable `calculateBoundingClientRect` defining calculate bounding client rect in `src/common/dragselect`.
 * @zh 常量/变量 `calculateBoundingClientRect`，定义 `src/common/dragselect` 中的计算包围边界Client矩形。
 */
export const calculateBoundingClientRect = (element: HTMLElement): BoundingBox => {
  return element.getBoundingClientRect();
};

/**
 * Constant/variable `getMousePosition` defining get mouse position in `src/common/dragselect`.
 * @zh 常量/变量 `getMousePosition`，定义 `src/common/dragselect` 中的获取鼠标位置。
 */
export const getMousePosition = (event: MouseEvent) => {
  return {
    x: event.clientX,
    y: event.clientY
  };
};

/**
 * Constant/variable `getScroll` defining get scroll in `src/common/dragselect`.
 * @zh 常量/变量 `getScroll`，定义 `src/common/dragselect` 中的获取滚动。
 */
export const getScroll = () => {
  if (!document || !document.documentElement) {
    return {
      x: 0,
      y: 0
    };
  }

  return {
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  };
};

/**
 * Constant/variable `getRelativeMousePosition` defining get relative mouse position in `src/common/dragselect`.
 * @zh 常量/变量 `getRelativeMousePosition`，定义 `src/common/dragselect` 中的获取Relative鼠标位置。
 */
export const getRelativeMousePosition = (event: MouseEvent, container: SelectContainerHost): MousePosition => {
  const { x: clientX, y: clientY } = getMousePosition(event);
  const scroll = getScroll();

  const borderSize = (container.boundingClientRect.width - container.clientWidth) / 2;
  const offsetLeft = container.boundingClientRect.left + scroll.x;
  const offsetTop = container.boundingClientRect.top + scroll.y;

  return {
    x: clientX - borderSize - (offsetLeft - window.pageXOffset) + container.scrollLeft,
    y: clientY - borderSize - (offsetTop - window.pageYOffset) + container.scrollTop
  };
};

/**
 * Constant/variable `cursorWithinElement` defining cursor within element in `src/common/dragselect`.
 * @zh 常量/变量 `cursorWithinElement`，定义 `src/common/dragselect` 中的光标Within元素。
 */
export const cursorWithinElement = (event: MouseEvent, element: HTMLElement) => {
  const mousePoint = getMousePosition(event);
  return inBoundingBox(mousePoint, calculateBoundingClientRect(element));
};
