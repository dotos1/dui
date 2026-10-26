/**
 * @fileoverview Module `src/common/dragselect/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */


export { CONFIG_FACTORY, DragToSelectModule } from './drag-to-select.module';
export { SelectContainerComponent } from './select-container.component';
export { SelectItemDirective } from './select-item.directive';
export { ShortcutService } from './shortcut.service';
export { CONFIG, USER_CONFIG } from './tokens';
export {
  Action,
  SelectBox,
  MousePosition,
  SelectContainerHost,
  UpdateAction,
  UpdateActions,
  PredicateFn
} from './models';
export {
  inBoundingBox,
  cursorWithinElement,
  clearSelection,
  boxIntersects,
  calculateBoundingClientRect,
  getRelativeMousePosition,
  getMousePosition,
  hasMinimumSize
} from './utils';
export { DEFAULT_CONFIG } from './config';
