/**
 * @fileoverview Module `src/container/layout/utils.ts` providing utils definitions and implementation.
 * @zh 模块文件 `src/container/layout/utils.ts`，提供工具集相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ElementRef } from '@angular/core';

import {
  IArea,
  IPoint,
  IAreaSnapshot,
  ISplitSideAbsorptionCapacity,
  IAreaAbsorptionCapacity,
} from './interface';

/**
 * Executes `getPointFromEvent` to handle get point from event.
 * @zh 执行 `getPointFromEvent`，用于获取坐标点从事件。
 * @param event - event parameter (`MouseEvent | TouchEvent`) / 事件参数（`MouseEvent | TouchEvent`）
 * @returns Result of type `IPoint` / 类型为 `IPoint` 的返回值
 */
export function getPointFromEvent(event: MouseEvent | TouchEvent): IPoint {
  // TouchEvent
  if (
    (<TouchEvent>event).changedTouches !== undefined &&
    (<TouchEvent>event).changedTouches.length > 0
  ) {
    return {
      x: (<TouchEvent>event).changedTouches[0].clientX,
      y: (<TouchEvent>event).changedTouches[0].clientY,
    };
  }
  // MouseEvent
  else if (
    (<MouseEvent>event).clientX !== undefined &&
    (<MouseEvent>event).clientY !== undefined
  ) {
    return {
      x: (<MouseEvent>event).clientX,
      y: (<MouseEvent>event).clientY,
    };
  } else if (event.currentTarget !== undefined) {
    const gutterEl = event.currentTarget as HTMLElement;
    return {
      x: gutterEl.offsetLeft,
      y: gutterEl.offsetTop,
    };
  }
  return null;
}

/**
 * Whether the pointer event came from a touch screen.
 * @zh 这个指针事件是不是来自触摸屏。
 *
 * <p>用 changedTouches 特征判断而不是 {@code instanceof TouchEvent} ——
 * 桌面 Firefox 上没有 TouchEvent 这个全局构造函数，instanceof 会直接抛错。
 * 与 {@link getPointFromEvent} 的判断口径保持一致。
 */
export function isTouchEvent(event: MouseEvent | TouchEvent): boolean {
  return (<TouchEvent>event).changedTouches !== undefined;
}

/**
 * Executes `pointDeltaEquals` to handle point delta equals.
 * @zh 执行 `pointDeltaEquals`，用于坐标点增量相等比较。
 * @param lhs - lhs parameter (`IPoint`) / lhs参数（`IPoint`）
 * @param rhs - rhs parameter (`IPoint`) / rhs参数（`IPoint`）
 * @param deltaPx - delta px parameter (`number`) / 增量像素参数（`number`）
 */
export function pointDeltaEquals(lhs: IPoint, rhs: IPoint, deltaPx: number) {
  return (
    Math.abs(lhs.x - rhs.x) <= deltaPx && Math.abs(lhs.y - rhs.y) <= deltaPx
  );
}

/**
 * Executes `getKeyboardEndpoint` to handle get keyboard endpoint.
 * @zh 执行 `getKeyboardEndpoint`，用于获取键盘Endpoint。
 * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
 * @param direction - direction parameter (`"horizontal" | "vertical"`) / 方向参数（`"horizontal" | "vertical"`）
 * @returns Result of type `IPoint` / 类型为 `IPoint` 的返回值
 */
export function getKeyboardEndpoint(
  event: KeyboardEvent,
  direction: 'horizontal' | 'vertical'
): IPoint | null {
  if (direction === 'horizontal') {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'PageUp':
      case 'PageDown':
        break;
      default:
        return null;
    }
  }
  if (direction === 'vertical') {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'PageUp':
      case 'PageDown':
        break;
      default:
        return null;
    }
  }

  const gutterEl = event.currentTarget as HTMLElement;
  const offset =
    event.key === 'PageUp' || event.key === 'PageDown' ? 50 * 10 : 50;
  let offsetX = gutterEl.offsetLeft,
    offsetY = gutterEl.offsetTop;
  switch (event.key) {
    case 'ArrowLeft':
      offsetX -= offset;
      break;
    case 'ArrowRight':
      offsetX += offset;
      break;
    case 'ArrowUp':
      offsetY -= offset;
      break;
    case 'ArrowDown':
      offsetY += offset;
      break;
    case 'PageUp':
      if (direction === 'vertical') {
        offsetY -= offset;
      } else {
        offsetX += offset;
      }
      break;
    case 'PageDown':
      if (direction === 'vertical') {
        offsetY += offset;
      } else {
        offsetX -= offset;
      }
      break;
    default:
      return null;
  }

  return {
    x: offsetX,
    y: offsetY,
  };
}

/**
 * Executes `getElementPixelSize` to handle get element pixel size.
 * @zh 执行 `getElementPixelSize`，用于获取元素像素尺寸。
 * @param elRef - el ref parameter (`ElementRef<any>`) / DOM元素引用参数（`ElementRef<any>`）
 * @param direction - direction parameter (`"horizontal" | "vertical"`) / 方向参数（`"horizontal" | "vertical"`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
export function getElementPixelSize(
  elRef: ElementRef,
  direction: 'horizontal' | 'vertical'
): number {
  const rect = (<HTMLElement>elRef.nativeElement).getBoundingClientRect();

  return direction === 'horizontal' ? rect.width : rect.height;
}

/**
 * Executes `getInputboolean` to handle get inputboolean.
 * @zh 执行 `getInputboolean`，用于获取Inputboolean。
 * @param v - v parameter (`any`) / v参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function getInputboolean(v): boolean {
  return typeof v === 'boolean' ? v : v === 'false' ? false : true;
}

/**
 * Executes `getInputPositiveNumber` to handle get input positive number.
 * @zh 执行 `getInputPositiveNumber`，用于获取输入属性Positive数字。
 * @param v - v parameter (`any`) / v参数（`any`）
 * @param defaultValue - default value parameter (`T`) / 默认值参数（`T`）
 * @returns Result of type `number | T` / 类型为 `number | T` 的返回值
 */
export function getInputPositiveNumber<T>(v, defaultValue: T): number | T {
  if (v === null || v === undefined) return defaultValue;

  v = Number(v);
  return !isNaN(v) && v >= 0 ? v : defaultValue;
}

/**
 * Executes `isUserSizesValid` to handle is user sizes valid.
 * @zh 执行 `isUserSizesValid`，用于是否为用户尺寸列表有效。
 * @param unit - unit parameter (`"percent" | "pixel"`) / unit参数（`"percent" | "pixel"`）
 * @param sizes - sizes parameter (`number[]`) / 尺寸列表参数（`number[]`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isUserSizesValid(
  unit: 'percent' | 'pixel',
  sizes: Array<number | null>
): boolean {
  if (unit === 'percent') {
    const total = sizes.reduce(
      (total, s) => (s !== null ? total + s : total),
      0
    );
    return sizes.every((s) => s !== null) && total > 99.9 && total < 100.1;
  }
  if (unit === 'pixel') {
    return sizes.filter((s) => s === null).length === 1;
  }
  return true;
}

/**
 * Executes `getAreaMinSize` to handle get area min size.
 * @zh 执行 `getAreaMinSize`，用于获取区域最小值尺寸。
 * @param a - a parameter (`IArea`) / a参数（`IArea`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
export function getAreaMinSize(a: IArea): null | number {
  if (a.size === null) {
    return null;
  }

  if (a.component.lockSize === true) {
    return a.size;
  }

  if (a.component.minSize === null) {
    return null;
  }

  if (a.component.minSize > a.size) {
    return a.size;
  }

  return a.component.minSize;
}

/**
 * Executes `getAreaMaxSize` to handle get area max size.
 * @zh 执行 `getAreaMaxSize`，用于获取区域最大值尺寸。
 * @param a - a parameter (`IArea`) / a参数（`IArea`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
export function getAreaMaxSize(a: IArea): null | number {
  if (a.size === null) {
    return null;
  }

  if (a.component.lockSize === true) {
    return a.size;
  }

  if (a.component.maxSize === null) {
    return null;
  }

  if (a.component.maxSize < a.size) {
    return a.size;
  }

  return a.component.maxSize;
}

/**
 * Executes `getGutterSideAbsorptionCapacity` to handle get gutter side absorption capacity.
 * @zh 执行 `getGutterSideAbsorptionCapacity`，用于获取分隔槽SideAbsorptionCapacity。
 * @param unit - unit parameter (`"percent" | "pixel"`) / unit参数（`"percent" | "pixel"`）
 * @param sideAreas - side areas parameter (`IAreaSnapshot[]`) / side区域集合参数（`IAreaSnapshot[]`）
 * @param pixels - pixels parameter (`number`) / 像素参数（`number`）
 * @param allAreasSizePixel - all areas size pixel parameter (`number`) / 全部区域集合尺寸像素参数（`number`）
 * @returns Result of type `ISplitSideAbsorptionCapacity` / 类型为 `ISplitSideAbsorptionCapacity` 的返回值
 */
export function getGutterSideAbsorptionCapacity(
  unit: 'percent' | 'pixel',
  sideAreas: Array<IAreaSnapshot>,
  pixels: number,
  allAreasSizePixel: number
): ISplitSideAbsorptionCapacity {
  return sideAreas.reduce(
    (acc, area) => {
      const res = getAreaAbsorptionCapacity(
        unit,
        area,
        acc.remain,
        allAreasSizePixel
      );
      acc.list.push(res);
      acc.remain = res.pixelRemain;
      return acc;
    },
    { remain: pixels, list: [] }
  );
}

/**
 * Executes `getAreaAbsorptionCapacity` to handle get area absorption capacity.
 * @zh 执行 `getAreaAbsorptionCapacity`，用于获取区域AbsorptionCapacity。
 * @param unit - unit parameter (`"percent" | "pixel"`) / unit参数（`"percent" | "pixel"`）
 * @param areaSnapshot - area snapshot parameter (`IAreaSnapshot`) / 区域Snapshot参数（`IAreaSnapshot`）
 * @param pixels - pixels parameter (`number`) / 像素参数（`number`）
 * @param allAreasSizePixel - all areas size pixel parameter (`number`) / 全部区域集合尺寸像素参数（`number`）
 * @returns Result of type `IAreaAbsorptionCapacity` / 类型为 `IAreaAbsorptionCapacity` 的返回值
 */
function getAreaAbsorptionCapacity(
  unit: 'percent' | 'pixel',
  areaSnapshot: IAreaSnapshot,
  pixels: number,
  allAreasSizePixel: number
): IAreaAbsorptionCapacity {
  // No pain no gain
  if (pixels === 0) {
    return {
      areaSnapshot,
      pixelAbsorb: 0,
      percentAfterAbsorption: areaSnapshot.sizePercentAtStart,
      pixelRemain: 0,
    };
  }

  // Area start at zero and need to be reduced, not possible
  if (areaSnapshot.sizePixelAtStart === 0 && pixels < 0) {
    return {
      areaSnapshot,
      pixelAbsorb: 0,
      percentAfterAbsorption: 0,
      pixelRemain: pixels,
    };
  }

  if (unit === 'percent') {
    return getAreaAbsorptionCapacityPercent(
      areaSnapshot,
      pixels,
      allAreasSizePixel
    );
  }

  if (unit === 'pixel') {
    return getAreaAbsorptionCapacityPixel(
      areaSnapshot,
      pixels,
      allAreasSizePixel
    );
  }
  return null;
}

/**
 * Executes `getAreaAbsorptionCapacityPercent` to handle get area absorption capacity percent.
 * @zh 执行 `getAreaAbsorptionCapacityPercent`，用于获取区域AbsorptionCapacity百分比。
 * @param areaSnapshot - area snapshot parameter (`IAreaSnapshot`) / 区域Snapshot参数（`IAreaSnapshot`）
 * @param pixels - pixels parameter (`number`) / 像素参数（`number`）
 * @param allAreasSizePixel - all areas size pixel parameter (`number`) / 全部区域集合尺寸像素参数（`number`）
 * @returns Result of type `IAreaAbsorptionCapacity` / 类型为 `IAreaAbsorptionCapacity` 的返回值
 */
function getAreaAbsorptionCapacityPercent(
  areaSnapshot: IAreaSnapshot,
  pixels: number,
  allAreasSizePixel: number
): IAreaAbsorptionCapacity {
  const tempPixelSize = areaSnapshot.sizePixelAtStart + pixels;
  const tempPercentSize = (tempPixelSize / allAreasSizePixel) * 100;

  // ENLARGE AREA

  if (pixels > 0) {
    // If maxSize & newSize bigger than it > absorb to max and return remaining pixels
    if (
      areaSnapshot.area.maxSize !== null &&
      tempPercentSize > areaSnapshot.area.maxSize
    ) {
      // Use area.area.maxSize as newPercentSize and return calculate pixels remaining
      const maxSizePixel =
        (areaSnapshot.area.maxSize / 100) * allAreasSizePixel;
      return {
        areaSnapshot,
        pixelAbsorb: maxSizePixel,
        percentAfterAbsorption: areaSnapshot.area.maxSize,
        pixelRemain: areaSnapshot.sizePixelAtStart + pixels - maxSizePixel,
      };
    }
    return {
      areaSnapshot,
      pixelAbsorb: pixels,
      percentAfterAbsorption: tempPercentSize > 100 ? 100 : tempPercentSize,
      pixelRemain: 0,
    };
  }
  // REDUCE AREA
  else if (pixels < 0) {
    // If minSize & newSize smaller than it > absorb to min and return remaining pixels
    if (
      areaSnapshot.area.minSize !== null &&
      tempPercentSize < areaSnapshot.area.minSize
    ) {
      // Use area.area.minSize as newPercentSize and return calculate pixels remaining
      const minSizePixel =
        (areaSnapshot.area.minSize / 100) * allAreasSizePixel;
      return {
        areaSnapshot,
        pixelAbsorb: minSizePixel,
        percentAfterAbsorption: areaSnapshot.area.minSize,
        pixelRemain: areaSnapshot.sizePixelAtStart + pixels - minSizePixel,
      };
    }
    // If reduced under zero > return remaining pixels
    else if (tempPercentSize < 0) {
      // Use 0 as newPercentSize and return calculate pixels remaining
      return {
        areaSnapshot,
        pixelAbsorb: -areaSnapshot.sizePixelAtStart,
        percentAfterAbsorption: 0,
        pixelRemain: pixels + areaSnapshot.sizePixelAtStart,
      };
    }
    return {
      areaSnapshot,
      pixelAbsorb: pixels,
      percentAfterAbsorption: tempPercentSize,
      pixelRemain: 0,
    };
  }
  return null;
}

/**
 * Executes `getAreaAbsorptionCapacityPixel` to handle get area absorption capacity pixel.
 * @zh 执行 `getAreaAbsorptionCapacityPixel`，用于获取区域AbsorptionCapacity像素。
 * @param areaSnapshot - area snapshot parameter (`IAreaSnapshot`) / 区域Snapshot参数（`IAreaSnapshot`）
 * @param pixels - pixels parameter (`number`) / 像素参数（`number`）
 * @param containerSizePixel - container size pixel parameter (`number`) / 容器尺寸像素参数（`number`）
 * @returns Result of type `IAreaAbsorptionCapacity` / 类型为 `IAreaAbsorptionCapacity` 的返回值
 */
function getAreaAbsorptionCapacityPixel(
  areaSnapshot: IAreaSnapshot,
  pixels: number,
  containerSizePixel: number
): IAreaAbsorptionCapacity {
  const tempPixelSize = areaSnapshot.sizePixelAtStart + pixels;

  // ENLARGE AREA

  if (pixels > 0) {
    // If maxSize & newSize bigger than it > absorb to max and return remaining pixels
    if (
      areaSnapshot.area.maxSize !== null &&
      tempPixelSize > areaSnapshot.area.maxSize
    ) {
      return {
        areaSnapshot,
        pixelAbsorb: areaSnapshot.area.maxSize - areaSnapshot.sizePixelAtStart,
        percentAfterAbsorption: -1,
        pixelRemain: tempPixelSize - areaSnapshot.area.maxSize,
      };
    }
    return {
      areaSnapshot,
      pixelAbsorb: pixels,
      percentAfterAbsorption: -1,
      pixelRemain: 0,
    };
  }
  // REDUCE AREA
  else if (pixels < 0) {
    // If minSize & newSize smaller than it > absorb to min and return remaining pixels
    if (
      areaSnapshot.area.minSize !== null &&
      tempPixelSize < areaSnapshot.area.minSize
    ) {
      return {
        areaSnapshot,
        pixelAbsorb: areaSnapshot.area.minSize + pixels - tempPixelSize,
        percentAfterAbsorption: -1,
        pixelRemain: tempPixelSize - areaSnapshot.area.minSize,
      };
    }
    // If reduced under zero > return remaining pixels
    else if (tempPixelSize < 0) {
      return {
        areaSnapshot,
        pixelAbsorb: -areaSnapshot.sizePixelAtStart,
        percentAfterAbsorption: -1,
        pixelRemain: pixels + areaSnapshot.sizePixelAtStart,
      };
    }
    return {
      areaSnapshot,
      pixelAbsorb: pixels,
      percentAfterAbsorption: -1,
      pixelRemain: 0,
    };
  }
  return null;
}

/**
 * Executes `updateAreaSize` to handle update area size.
 * @zh 执行 `updateAreaSize`，用于更新区域尺寸。
 * @param unit - unit parameter (`"percent" | "pixel"`) / unit参数（`"percent" | "pixel"`）
 * @param item - item parameter (`IAreaAbsorptionCapacity`) / 条目参数（`IAreaAbsorptionCapacity`）
 */
export function updateAreaSize(
  unit: 'percent' | 'pixel',
  item: IAreaAbsorptionCapacity
) {
  if (unit === 'percent') {
    item.areaSnapshot.area.size = item.percentAfterAbsorption;
  } else if (unit === 'pixel') {
    // Update size except for the wildcard size area
    if (item.areaSnapshot.area.size !== null) {
      item.areaSnapshot.area.size =
        item.areaSnapshot.sizePixelAtStart + item.pixelAbsorb;
    }
  }
}
