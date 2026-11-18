/**
 * @fileoverview Module `src/common/dnd/dnd-state.ts` providing dnd state definitions and implementation.
 * @zh 模块文件 `src/common/dnd/dnd-state.ts`，提供拖放状态相关的定义与实现。
 */

import {
  CUSTOM_MIME_TYPE,
  DROP_EFFECTS,
  filterEffects,
  getWellKnownMimeType,
  JSON_MIME_TYPE,
  MSIE_MIME_TYPE
} from "./dnd-utils";
import { DropEffect, EffectAllowed } from "./dnd-types";

/**
 * Interface `DndState` defining the contract and properties for dnd state.
 * @zh 接口 `DndState`，定义拖放状态的数据结构契约与属性规范。
 */
export interface DndState {
  /**
   * Property `isDragging` (`boolean`) storing is dragging.
   * @zh 属性 `isDragging`（类型：`boolean`），用于存储或配置是否为拖拽中。
   */
  isDragging:boolean;
  /**
   * Property `dropEffect` (`DropEffect`) storing drop effect.
   * @zh 属性 `dropEffect`（类型：`DropEffect`），用于存储或配置放置副作用。
   */
  dropEffect?:DropEffect;
  /**
   * Property `effectAllowed` (`EffectAllowed`) storing effect allowed.
   * @zh 属性 `effectAllowed`（类型：`EffectAllowed`），用于存储或配置副作用允许的。
   */
  effectAllowed?:EffectAllowed;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type?:string;
}

/**
 * Constant/variable `_dndState` defining dnd state in `src/common/dnd`.
 * @zh 常量/变量 `_dndState`，定义 `src/common/dnd` 中的拖放状态。
 */
const _dndState:DndState = {
  isDragging: false,
  dropEffect: "none",
  effectAllowed: "all",
  type: undefined
};

/**
 * Executes `startDrag` to handle start drag.
 * @zh 执行 `startDrag`，用于开始拖拽。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @param effectAllowed - effect allowed parameter (`EffectAllowed`) / 副作用允许的参数（`EffectAllowed`）
 * @param type - type parameter (`string`) / 类型参数（`string`）
 */
export function startDrag( event:DragEvent, effectAllowed:EffectAllowed, type:string | undefined ) {

  _dndState.isDragging = true;
  _dndState.dropEffect = "none";
  _dndState.effectAllowed = effectAllowed;
  _dndState.type = type;

  if(event.dataTransfer) {
    event.dataTransfer.effectAllowed = effectAllowed;
  }
}

/**
 * Executes `endDrag` to handle end drag.
 * @zh 执行 `endDrag`，用于结束拖拽。
 */
export function endDrag() {

  _dndState.isDragging = false;
  _dndState.dropEffect = undefined;
  _dndState.effectAllowed = undefined;
  _dndState.type = undefined;
}

/**
 * Executes `setDropEffect` to handle set drop effect.
 * @zh 执行 `setDropEffect`，用于集合放置副作用。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @param dropEffect - drop effect parameter (`DropEffect`) / 放置副作用参数（`DropEffect`）
 */
export function setDropEffect( event:DragEvent, dropEffect:DropEffect ) {

  if( _dndState.isDragging === true ) {

    _dndState.dropEffect = dropEffect;
  }

  if(event.dataTransfer) {

    event.dataTransfer.dropEffect = dropEffect;
  }
}

/**
 * Executes `getDropEffect` to handle get drop effect.
 * @zh 执行 `getDropEffect`，用于获取放置副作用。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @param effectAllowed - effect allowed parameter (`"link" | "none" | "copy" | "move" | "copyMove" | "copyLink" | "linkMove" | "all" | "uninitialized"`) / 副作用允许的参数（`"link" | "none" | "copy" | "move" | "copyMove" | "copyLink" | "linkMove" | "all" | "uninitialized"`）
 * @returns Result of type `DropEffect` / 类型为 `DropEffect` 的返回值
 */
export function getDropEffect( event:DragEvent, effectAllowed?:EffectAllowed | DropEffect ):DropEffect {

  const dataTransferEffectAllowed:EffectAllowed = (event.dataTransfer) ? event.dataTransfer.effectAllowed as EffectAllowed : "uninitialized";

  let effects = filterEffects( DROP_EFFECTS, dataTransferEffectAllowed );

  if( _dndState.isDragging === true ) {

    effects = filterEffects( effects, _dndState.effectAllowed );
  }

  if( effectAllowed ) {

    effects = filterEffects( effects, effectAllowed );
  }

  if( effects.length === 0 ) {
    return "none";
  }

  if( event.ctrlKey && effects.indexOf( "copy" ) !== -1 ) {

    return "copy";
  }

  if( event.altKey && effects.indexOf( "link" ) !== -1 ) {

    return "link";
  }

  return effects[ 0 ] as DropEffect;
}

/**
 * Executes `getDndType` to handle get dnd type.
 * @zh 执行 `getDndType`，用于获取拖放类型。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function getDndType( event:DragEvent ):string | undefined {

  if( _dndState.isDragging === true ) {

    return _dndState.type;
  }

  const mimeType = getWellKnownMimeType( event );

  if( mimeType === null ) {

    return undefined;
  }

  if( mimeType === MSIE_MIME_TYPE
    || mimeType === JSON_MIME_TYPE ) {

    return undefined;
  }

  return mimeType.substr( CUSTOM_MIME_TYPE.length + 1 ) || undefined;
}

/**
 * Executes `isExternalDrag` to handle is external drag.
 * @zh 执行 `isExternalDrag`，用于是否为外部拖拽。
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isExternalDrag():boolean {

  return _dndState.isDragging === false;
}

/**
 * Constant/variable `dndState` defining dnd state in `src/common/dnd`.
 * @zh 常量/变量 `dndState`，定义 `src/common/dnd` 中的拖放状态。
 */
export const dndState:Readonly<DndState> = _dndState as Readonly<DndState>;
