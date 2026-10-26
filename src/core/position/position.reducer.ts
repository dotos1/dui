/**
 * @fileoverview Module `src/core/position/position.reducer.ts` providing position reducer definitions and implementation.
 * @zh 模块文件 `src/core/position/position.reducer.ts`，提供位置归约器相关的定义与实现。
 */

import {
  IPoint,
  IPosionOptions,
  ISize,
  IPositionState
} from './position.common';

import { RESIZE_INIT, RESIZE, RESIZE_STOP, MOUSE_DOWN, PICKUP, PUTBACK, MOVETO } from './position.actions';
import { manageRatio, resizeTop, resizeLeft, resizeBottom, resizeRight } from './position.utils';


/**
 * Constant/variable `resizeReducer` defining resize reducer in `src/core/position`.
 * @zh 常量/变量 `resizeReducer`，定义 `src/core/position` 中的调整尺寸归约器。
 */
export const resizeReducer = (
  currentState: IPositionState,
  action: string,
  mousePosition: IPoint,
  startPosition: IPoint,
  options?: IPosionOptions,
  initialSize?: ISize,
  initialResizeDir?: string): IPositionState => {
  const startPos = currentState.startPosition;
  const startSize = currentState.startSize;
  const currentSize = currentState.currentSize;
  const currentPos = currentState.currentPosition;
  switch (action) {
    case RESIZE_INIT:
      currentPos.x = startPosition.x;
      currentPos.y = startPosition.y;
      currentSize.width = initialSize.width;
      currentSize.height = initialSize.height;
      break;
    case MOUSE_DOWN:
      if (!options.resizable) {
        return currentState;
      }
      if (!initialResizeDir) {
        throw new Error('Direction not provided');
      }
      currentState.direction = initialResizeDir;
      currentState.isResizing = true;
      startPos.x = mousePosition.x;
      startPos.y = mousePosition.y;
      currentPos.x = startPosition.x;
      currentPos.y = startPosition.y;
      currentSize.width = initialSize.width;
      currentSize.height = initialSize.height;
      startSize.width = initialSize.width;
      startSize.height = initialSize.height;
      break;
    case RESIZE:
      if (!options.resizable) {
        return currentState;
      }
      if (!currentState.isResizing) {
        return currentState;
      }
      let nextWidth = currentSize.width;
      let nextHeight = currentSize.height;
      let nextLeft = currentPos.x;
      let nextTop = currentPos.y;

      if (/right/.test(currentState.direction)) {
        nextWidth = resizeRight(mousePosition.x - startPos.x + startSize.width, options, currentState.currentPosition).nextWidth;
      }
      if (/bottom/.test(currentState.direction)) {
        nextHeight = resizeBottom(mousePosition.y - startPos.y + startSize.height, options, currentState.currentPosition).nextHeight;
      }
      if (/top/.test(currentState.direction)) {
        const data = resizeTop(startPos.y - mousePosition.y + startSize.height, currentPos, currentSize, options);
        nextTop = data.nextTop;
        nextHeight = data.nextHeight;

      }
      if (/left/.test(currentState.direction)) {
        const data = resizeLeft(startPos.x - mousePosition.x + startSize.width, currentPos, currentSize, options);
        nextLeft = data.nextLeft;
        nextWidth = data.nextWidth;

      }
      if (options.ratio) {
        const fixedSize = manageRatio({ nextTop, nextWidth, nextHeight, nextLeft },
          options, currentPos, currentSize, currentState.direction, currentState.currentPosition);
        nextLeft = fixedSize.nextLeft;
        nextTop = fixedSize.nextTop;
        nextWidth = fixedSize.nextWidth;
        nextHeight = fixedSize.nextHeight;
      }
      currentPos.x = Math.round(nextLeft / options.grid.width) * options.grid.width;
      currentPos.y = Math.round(nextTop / options.grid.height) * options.grid.height;
      currentSize.width = Math.round(nextWidth / options.grid.width) * options.grid.width;
      currentSize.height = Math.round(nextHeight / options.grid.height) * options.grid.height;
      break;
    case RESIZE_STOP:
      if (!options.resizable) {
        return currentState;
      }
      currentState.isResizing = false;
      startSize.width = currentSize.width;
      startSize.height = currentSize.height;
      break;
    case PICKUP:
      currentState.isMoving = true;
      startPos.x = mousePosition.x;
      startPos.y = mousePosition.y;
      currentPos.x = startPosition.x;
      currentPos.y = startPosition.y;
      currentSize.width = initialSize.width;
      currentSize.height = initialSize.height;
      startSize.width = initialSize.width;
      startSize.height = initialSize.height;
      break;
    case MOVETO:
      if (!currentState.isMoving) {
        return currentState;
      }
      const detaX = mousePosition.x - startPos.x;
      const detaY = mousePosition.y - startPos.y;
      startPos.x = mousePosition.x;
      startPos.y = mousePosition.y;
      currentPos.x = currentPos.x + detaX;
      currentPos.y = currentPos.y + detaY;
      break;
    case PUTBACK:
      if (!currentState.isMoving) {
        return currentState;
      }
      startSize.width = currentSize.width;
      startSize.height = currentSize.height;
      currentState.isMoving = false;
      break;
  }
  return currentState;
};
