/**
 * @fileoverview Module `src/common/dragselect/operators.ts` providing operators definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/operators.ts`，提供操作符相关的定义与实现。
 */

import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';
import { MousePosition, SelectBox, SelectBoxInput, SelectContainerHost } from './models';
import { getRelativeMousePosition, hasMinimumSize } from './utils';

/**
 * Constant/variable `createSelectBox` defining create select box in `src/common/dragselect`.
 * @zh 常量/变量 `createSelectBox`，定义 `src/common/dragselect` 中的创建下拉选择盒子容器。
 */
export const createSelectBox = (container: SelectContainerHost) => (
  source: Observable<SelectBoxInput>
): Observable<SelectBox<number>> =>
  source.pipe(
    map(([event, opacity, { x, y }]) => {
      const mousePosition: MousePosition = getRelativeMousePosition(event, container);

      const width = opacity > 0 ? mousePosition.x - x : 0;
      const height = opacity > 0 ? mousePosition.y - y : 0;

      return {
        top: height < 0 ? mousePosition.y : y,
        left: width < 0 ? mousePosition.x : x,
        width: Math.abs(width),
        height: Math.abs(height),
        opacity
      };
    })
  );

/**
 * Constant/variable `whenSelectBoxVisible` defining when select box visible in `src/common/dragselect`.
 * @zh 常量/变量 `whenSelectBoxVisible`，定义 `src/common/dragselect` 中的when下拉选择盒子容器可见。
 */
export const whenSelectBoxVisible = (selectBox$: Observable<SelectBox<number>>) => (source: Observable<Event>) =>
  source.pipe(
    withLatestFrom(selectBox$),
    filter(([, selectBox]) => hasMinimumSize(selectBox, 0, 0)),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([event, _]) => event)
  );

/**
 * Constant/variable `distinctKeyEvents` defining distinct key events in `src/common/dragselect`.
 * @zh 常量/变量 `distinctKeyEvents`，定义 `src/common/dragselect` 中的distinct键事件集合。
 */
export const distinctKeyEvents = () => (source: Observable<KeyboardEvent>) =>
  source.pipe(
    distinctUntilChanged((prev, curr) => {
      return prev && curr && prev.code === curr.code;
    })
  );
