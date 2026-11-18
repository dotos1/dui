/**
 * @fileoverview Module `src/common/dnd/dnd-utils.ts` providing dnd utils definitions and implementation.
 * @zh 模块文件 `src/common/dnd/dnd-utils.ts`，提供拖放工具集相关的定义与实现。
 */

import { DropEffect, EffectAllowed } from "./dnd-types";

/**
 * Interface `DragDropData` defining the contract and properties for drag drop data.
 * @zh 接口 `DragDropData`，定义拖拽放置数据的数据结构契约与属性规范。
 */
export interface DragDropData {
  /**
   * Property `data` (`any`) storing data.
   * @zh 属性 `data`（类型：`any`），用于存储或配置数据。
   */
  data?;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type?:string;
}

/**
 * Interface `DndEvent` defining the contract and properties for dnd event.
 * @zh 接口 `DndEvent`，定义拖放事件的数据结构契约与属性规范。
 */
export interface DndEvent extends DragEvent {
  /**
   * Property `_dndUsingHandle` (`boolean`) storing dnd using handle.
   * @zh 属性 `_dndUsingHandle`（类型：`boolean`），用于存储或配置拖放使用连接手柄。
   */
  _dndUsingHandle?:boolean;
  /**
   * Property `_dndDropzoneActive` (`true`) storing dnd dropzone active.
   * @zh 属性 `_dndDropzoneActive`（类型：`true`），用于存储或配置拖放Dropzone激活。
   */
  _dndDropzoneActive?:true;
}

/**
 * Type alias `DndDragImageOffsetFunction` representing dnd drag image offset function (`( event:DragEvent, dragImage:Element ) => { x:number, y:number }`).
 * @zh 类型别名 `DndDragImageOffsetFunction`，表示拖放拖拽图像偏移量函数（`( event:DragEvent, dragImage:Element ) => { x:number, y:number }`）。
 */
export type DndDragImageOffsetFunction = ( event:DragEvent, dragImage:Element ) => { x:number, y:number };

/**
 * Constant/variable `DROP_EFFECTS` defining drop effects in `src/common/dnd`.
 * @zh 常量/变量 `DROP_EFFECTS`，定义 `src/common/dnd` 中的放置副作用。
 */
export const DROP_EFFECTS = [ "move", "copy", "link" ] as DropEffect[];

/**
 * Constant/variable `CUSTOM_MIME_TYPE` defining custom mime type in `src/common/dnd`.
 * @zh 常量/变量 `CUSTOM_MIME_TYPE`，定义 `src/common/dnd` 中的自定义MIME类型类型。
 */
export const CUSTOM_MIME_TYPE = "application/x-dnd";
/**
 * Constant/variable `JSON_MIME_TYPE` defining json mime type in `src/common/dnd`.
 * @zh 常量/变量 `JSON_MIME_TYPE`，定义 `src/common/dnd` 中的JSONMIME类型类型。
 */
export const JSON_MIME_TYPE = "application/json";
/**
 * Constant/variable `MSIE_MIME_TYPE` defining msie mime type in `src/common/dnd`.
 * @zh 常量/变量 `MSIE_MIME_TYPE`，定义 `src/common/dnd` 中的MSIEMIME类型类型。
 */
export const MSIE_MIME_TYPE = "Text";

/**
 * Executes `mimeTypeIsCustom` to handle mime type is custom.
 * @zh 执行 `mimeTypeIsCustom`，用于MIME类型类型是否为自定义。
 * @param mimeType - mime type parameter (`string`) / MIME类型类型参数（`string`）
 */
function mimeTypeIsCustom( mimeType:string ) {

  return mimeType.substr( 0, CUSTOM_MIME_TYPE.length ) === CUSTOM_MIME_TYPE;
}

/**
 * Executes `getWellKnownMimeType` to handle get well known mime type.
 * @zh 执行 `getWellKnownMimeType`，用于获取WellKnownMIME类型类型。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function getWellKnownMimeType( event:DragEvent ):string | null {

  if( event.dataTransfer ) {

    const types = event.dataTransfer.types;

    // IE 9 workaround.
    if( !types ) {

      return MSIE_MIME_TYPE;
    }

    for( let i = 0; i < types.length; i++ ) {

      if( types[ i ] === MSIE_MIME_TYPE
        || types[ i ] === JSON_MIME_TYPE
        || mimeTypeIsCustom( types[ i ] ) ) {

        return types[ i ];
      }
    }
  }

  return null;
}

/**
 * Executes `setDragData` to handle set drag data.
 * @zh 执行 `setDragData`，用于集合拖拽数据。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @param data - data parameter (`DragDropData`) / 数据参数（`DragDropData`）
 * @param effectAllowed - effect allowed parameter (`EffectAllowed`) / 副作用允许的参数（`EffectAllowed`）
 */
export function setDragData( event:DragEvent, data:DragDropData, effectAllowed:EffectAllowed ):void {

  const mimeType = CUSTOM_MIME_TYPE + (data.type ? ("-" + data.type) : "");

  const dataString = JSON.stringify( data );

  try {

    event.dataTransfer?.setData( mimeType, dataString );

  }
  catch( e ) {

    //   Setting a custom MIME type did not work, we are probably in IE or Edge.
    try {

      event.dataTransfer?.setData( JSON_MIME_TYPE, dataString );

    }
    catch( e ) {

      const effectsAllowed = filterEffects( DROP_EFFECTS, effectAllowed );
      if(event.dataTransfer) {
        event.dataTransfer.effectAllowed = effectsAllowed[ 0 ];
      }

      event.dataTransfer?.setData( MSIE_MIME_TYPE, dataString );
    }
  }
}

/**
 * Executes `getDropData` to handle get drop data.
 * @zh 执行 `getDropData`，用于获取放置数据。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @param dragIsExternal - drag is external parameter (`boolean`) / 拖拽是否为外部参数（`boolean`）
 * @returns Result of type `DragDropData` / 类型为 `DragDropData` 的返回值
 */
export function getDropData( event:DragEvent, dragIsExternal:boolean ):DragDropData {

  // check if the mime type is well known
  const mimeType = getWellKnownMimeType( event );

  // drag did not originate from [dndDraggable]
  if( dragIsExternal === true ) {

    if( mimeType !== null
      && mimeTypeIsCustom( mimeType ) ) {

      // the type of content is well known and safe to handle
      return JSON.parse( event.dataTransfer?.getData( mimeType ) ?? "{}" );
    }

    // the contained data is unknown, let user handle it
    return {};
  }

  if(mimeType !== null) {
    // the type of content is well known and safe to handle
    return JSON.parse( event.dataTransfer?.getData( mimeType ) ?? "{}" );
  }

  // the contained data is unknown, let user handle it
  return {};
}

/**
 * Executes `filterEffects` to handle filter effects.
 * @zh 执行 `filterEffects`，用于过滤副作用。
 * @param effects - effects parameter (`DropEffect[]`) / 副作用参数（`DropEffect[]`）
 * @param allowed - allowed parameter (`"link" | "none" | "copy" | "move" | "copyMove" | "copyLink" | "linkMove" | "all" | "uninitialized"`) / 允许的参数（`"link" | "none" | "copy" | "move" | "copyMove" | "copyLink" | "linkMove" | "all" | "uninitialized"`）
 * @returns Result of type `DropEffect[]` / 类型为 `DropEffect[]` 的返回值
 */
export function filterEffects( effects:DropEffect[], allowed:EffectAllowed | DropEffect ):DropEffect[] {

  if( allowed === "all"
    || allowed === "uninitialized" ) {

    return effects;
  }

  return effects.filter( function( effect ) {

    return allowed.toLowerCase().indexOf( effect ) !== -1;
  } );
}

/**
 * Executes `getDirectChildElement` to handle get direct child element.
 * @zh 执行 `getDirectChildElement`，用于获取Direct子级元素。
 * @param parentElement - parent element parameter (`Element`) / 父级元素参数（`Element`）
 * @param childElement - child element parameter (`Element`) / 子级元素参数（`Element`）
 * @returns Result of type `Element` / 类型为 `Element` 的返回值
 */
export function getDirectChildElement( parentElement:Element, childElement:Element ):Element | null {

  let directChild:Node = childElement;

  while( directChild.parentNode !== parentElement ) {

    // reached root node without finding given parent
    if( !directChild.parentNode ) {

      return null;
    }

    directChild = directChild.parentNode;
  }

  return directChild as Element;
}

/**
 * Executes `shouldPositionPlaceholderBeforeElement` to handle should position placeholder before element.
 * @zh 执行 `shouldPositionPlaceholderBeforeElement`，用于是否应当位置占位提示之前元素。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @param element - element parameter (`Element`) / 元素参数（`Element`）
 * @param horizontal - horizontal parameter (`boolean`) / 水平参数（`boolean`）
 */
export function shouldPositionPlaceholderBeforeElement( event:DragEvent, element:Element, horizontal:boolean ) {

  const bounds = element.getBoundingClientRect();

  // If the pointer is in the upper half of the list item element,
  // we position the placeholder before the list item, otherwise after it.
  if( horizontal ) {

    return (event.clientX < bounds.left + bounds.width / 2);
  }

  return (event.clientY < bounds.top + bounds.height / 2);
}

/**
 * Executes `calculateDragImageOffset` to handle calculate drag image offset.
 * @zh 执行 `calculateDragImageOffset`，用于计算拖拽图像偏移量。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @param dragImage - drag image parameter (`Element`) / 拖拽图像参数（`Element`）
 * @returns Result of type `{ x: number; y: number; }` / 类型为 `{ x: number; y: number; }` 的返回值
 */
export function calculateDragImageOffset( event:DragEvent, dragImage:Element ):{ x:number, y:number } {

  const dragImageComputedStyle = window.getComputedStyle( dragImage );
  const paddingTop = parseFloat( dragImageComputedStyle.paddingTop ) || 0;
  const paddingLeft = parseFloat( dragImageComputedStyle.paddingLeft ) || 0;
  const borderTop = parseFloat( dragImageComputedStyle.borderTopWidth ) || 0;
  const borderLeft = parseFloat( dragImageComputedStyle.borderLeftWidth ) || 0;

  return {
    x: event.offsetX + paddingLeft + borderLeft,
    y: event.offsetY + paddingTop + borderTop
  };
}

/**
 * Executes `setDragImage` to handle set drag image.
 * @zh 执行 `setDragImage`，用于集合拖拽图像。
 * @param event - event parameter (`DragEvent`) / 事件参数（`DragEvent`）
 * @param dragImage - drag image parameter (`Element`) / 拖拽图像参数（`Element`）
 * @param offsetFunction - offset function parameter (`DndDragImageOffsetFunction`) / 偏移量函数参数（`DndDragImageOffsetFunction`）
 */
export function setDragImage( event:DragEvent, dragImage:Element, offsetFunction:DndDragImageOffsetFunction ):void {

  const offset = offsetFunction( event, dragImage ) || {x: 0, y: 0};

  (event.dataTransfer as unknown as { setDragImage? }).setDragImage( dragImage, offset.x, offset.y );
}
