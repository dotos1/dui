/**
 * @fileoverview Module `src/common/dialogs/resizable-draggable-dialog/resizable-draggable-dialog.ts` providing resizable draggable dialog definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/resizable-draggable-dialog/resizable-draggable-dialog.ts`，提供是否可调尺寸是否可拖拽对话框相关的定义与实现。
 */

import { DragRef, Point } from '@angular/cdk/drag-drop';
import { Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, fromEvent } from 'rxjs';
import {  merge } from 'rxjs';
/**
 * Enumeration `corners` defining supported corners constants.
 * @zh 枚举 `corners`，定义支持的corners常量集合。
 */
enum corners {
  /**
   * Enum member `corners.topRight` = 'topRight' representing top right.
   * @zh 枚举项 `corners.topRight` = 'topRight'，表示顶部位置右侧位置。
   */
  topRight = 'topRight',
  /**
   * Enum member `corners.bottomRight` = 'bottomRight' representing bottom right.
   * @zh 枚举项 `corners.bottomRight` = 'bottomRight'，表示底部位置右侧位置。
   */
  bottomRight = 'bottomRight',
  /**
   * Enum member `corners.bottomLeft` = 'bottomLeft' representing bottom left.
   * @zh 枚举项 `corners.bottomLeft` = 'bottomLeft'，表示底部位置左侧位置。
   */
  bottomLeft = 'bottomLeft',
  /**
   * Enum member `corners.topLeft` = 'topLeft' representing top left.
   * @zh 枚举项 `corners.topLeft` = 'topLeft'，表示顶部位置左侧位置。
   */
  topLeft = 'topLeft',
}
/**
 * Enumeration `cursors` defining supported cursors constants.
 * @zh 枚举 `cursors`，定义支持的光标常量集合。
 */
enum cursors {
  /**
   * Enum member `cursors.nesw` = 'nesw-resize' representing nesw.
   * @zh 枚举项 `cursors.nesw` = 'nesw-resize'，表示nesw。
   */
  nesw = 'nesw-resize',
  /**
   * Enum member `cursors.nwse` = 'nwse-resize' representing nwse.
   * @zh 枚举项 `cursors.nwse` = 'nwse-resize'，表示nwse。
   */
  nwse = 'nwse-resize',
}
/**
 * Enumeration `verticalAlignment` defining supported vertical alignment constants.
 * @zh 枚举 `verticalAlignment`，定义支持的垂直Alignment常量集合。
 */
enum verticalAlignment {
  /**
   * Enum member `verticalAlignment.top` = 'top' representing top.
   * @zh 枚举项 `verticalAlignment.top` = 'top'，表示顶部位置。
   */
  top = 'top',
  /**
   * Enum member `verticalAlignment.bottom` = 'bottom' representing bottom.
   * @zh 枚举项 `verticalAlignment.bottom` = 'bottom'，表示底部位置。
   */
  bottom = 'bottom',
}
/**
 * Enumeration `horizontalAlignment` defining supported horizontal alignment constants.
 * @zh 枚举 `horizontalAlignment`，定义支持的水平Alignment常量集合。
 */
enum horizontalAlignment {
  /**
   * Enum member `horizontalAlignment.right` = 'right' representing right.
   * @zh 枚举项 `horizontalAlignment.right` = 'right'，表示右侧位置。
   */
  right = 'right',
  /**
   * Enum member `horizontalAlignment.left` = 'left' representing left.
   * @zh 枚举项 `horizontalAlignment.left` = 'left'，表示左侧位置。
   */
  left = 'left',
}

/**
 * Constant/variable `cornerWidth` defining corner width in `src/common/dialogs/resizable-draggable-dialog`.
 * @zh 常量/变量 `cornerWidth`，定义 `src/common/dialogs/resizable-draggable-dialog` 中的corner宽度。
 */
const cornerWidth = '16px';
/**
 * Constant/variable `offset` defining offset in `src/common/dialogs/resizable-draggable-dialog`.
 * @zh 常量/变量 `offset`，定义 `src/common/dialogs/resizable-draggable-dialog` 中的偏移量。
 */
const offset = '0px';
/**
 * Constant/variable `minWidth` defining min width in `src/common/dialogs/resizable-draggable-dialog`.
 * @zh 常量/变量 `minWidth`，定义 `src/common/dialogs/resizable-draggable-dialog` 中的最小值宽度。
 */
const minWidth = 200;
/**
 * Constant/variable `minHeight` defining min height in `src/common/dialogs/resizable-draggable-dialog`.
 * @zh 常量/变量 `minHeight`，定义 `src/common/dialogs/resizable-draggable-dialog` 中的最小值高度。
 */
const minHeight = 200;

/**
 * Executes `getPixels` to handle get pixels.
 * @zh 执行 `getPixels`，用于获取像素。
 * @param sizeString - size string parameter (`string`) / 尺寸字符串参数（`string`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function getPixels(sizeString: string): number {
  return parseFloat((sizeString || '').replace('px', ''));
}

/**
 * Executes `clamp` to handle clamp.
 * @zh 执行 `clamp`，用于限制范围。
 * @param min - min parameter (`number`) / 最小值参数（`number`）
 * @param num - num parameter (`number`) / 数值参数（`number`）
 * @param max - max parameter (`number`) / 最大值参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function clamp(min: number, num: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Attaches resize-corner handles to a `MatDialogRef`'s wrapper element and coordinates
 * resizing with its CDK `DragRef` free-drag position; used internally by
 * {@link DialogService.openDraggable} consumers that also need resizing.
 * @zh 为 `MatDialogRef` 的包裹元素附加四角缩放手柄，并与其 CDK `DragRef` 的自由拖拽位置协调工作；
 * 供需要同时支持拖拽和缩放的场景内部使用。
 */
export class ResizableDraggableDialog {
  /**
   * Property `cornerElements` (`HTMLElement[]`) storing corner elements (default: `[]`).
   * @zh 属性 `cornerElements`（类型：`HTMLElement[]`），用于存储或配置corner元素列表（默认值：`[]`）。
   */
  cornerElements: HTMLElement[] = [];
  /**
   * Property `pointerDownSubs` (`Subscription[]`) storing pointer down subs (default: `[]`).
   * @zh 属性 `pointerDownSubs`（类型：`Subscription[]`），用于存储或配置指针向下子（默认值：`[]`）。
   */
  pointerDownSubs: Subscription[] = [];

  /**
   * Creates an instance of `ResizableDraggableDialog` and initializes its dependencies and internal state.
   * @zh 创建 `ResizableDraggableDialog` 实例，并初始化其依赖项与内部状态。
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   * @param _renderer2 - Injected or initial renderer2 (`Renderer2`) / 注入或传入的renderer2（`Renderer2`）
   * @param _dialogRef - Injected or initial dialog ref (`MatDialogRef<any>`) / 注入或传入的对话框引用（`MatDialogRef<any>`）
   * @param _dragRef - Injected or initial drag ref (`DragRef`) / 注入或传入的拖拽引用（`DragRef`）
   */
  constructor(
    private _document,
    private _renderer2: Renderer2,
    private _dialogRef: MatDialogRef<unknown>,
    private _dragRef: DragRef
  ) {
    this._initialPositionReset();
    this._attachCorners();
  }

  /**
   * Executes `attach` to handle attach.
   * @zh 执行 `attach`，用于挂载。
   */
  public attach(): void {
    this.detach();
    this._attachCorners();
  }

  /**
   * Executes `detach` to handle detach.
   * @zh 执行 `detach`，用于卸载。
   */
  public detach(): void {
    this.pointerDownSubs.forEach((sub: Subscription) => sub.unsubscribe());
    this.pointerDownSubs = [];
    this.cornerElements.forEach((elem: HTMLElement) =>
      this._renderer2.removeChild(this._getDialogWrapper(), elem)
    );
    this.cornerElements = [];
  }

  /**
   * Executes `_getDialogWrapper` to handle get dialog wrapper.
   * @zh 执行 `_getDialogWrapper`，用于获取对话框包装器。
   * @returns Result of type `HTMLElement | null` / 类型为 `HTMLElement | null` 的返回值
   */
  private _getDialogWrapper(): HTMLElement | null {
    return (
      <HTMLElement>this._document.getElementById(this._dialogRef.id) || {}
    ).parentElement;
  }

  /**
   * Executes `_getViewportDimensions` to handle get viewport dimensions.
   * @zh 执行 `_getViewportDimensions`，用于获取视口维度列表。
   * @returns Result of type `ClientRect | undefined` / 类型为 `ClientRect | undefined` 的返回值
   */
  private _getViewportDimensions(): ClientRect | undefined {
    return this._getDialogWrapper()?.parentElement?.getBoundingClientRect();
  }

  /**
   * Executes `_getDialogWrapperDimensions` to handle get dialog wrapper dimensions.
   * @zh 执行 `_getDialogWrapperDimensions`，用于获取对话框包装器维度列表。
   * @returns Result of type `{ width: number; height: number }` / 类型为 `{ width: number; height: number }` 的返回值
   */
  private _getDialogWrapperDimensions(): { width: number; height: number } {
    const wrapper = this._getDialogWrapper();
    if (!wrapper) {
      return { width: 0, height: 0 };
    }
    const dimensions: CSSStyleDeclaration = getComputedStyle(wrapper);
    return {
      width: getPixels(dimensions.width),
      height: getPixels(dimensions.height),
    };
  }

  /**
   * Executes `_initialPositionReset` to handle initial position reset.
   * @zh 执行 `_initialPositionReset`，用于初始位置重置。
   */
  private _initialPositionReset(): void {
    const viewportWidth = this._getViewportDimensions()?.right ?? 0;
    const viewportHeight = this._getViewportDimensions()?.bottom ?? 0;
    const { width, height } = this._getDialogWrapperDimensions();
    const wrapperStyle = this._getDialogWrapper()?.style;
    const originalDialogRight = wrapperStyle?.marginRight;
    const originalDialogLeft = wrapperStyle?.marginLeft;
    const originalDialogBottom = wrapperStyle?.marginBottom;
    const originalDialogTop = wrapperStyle?.marginTop;
    let x: number;
    if (originalDialogLeft) {
      x = getPixels(originalDialogLeft);
    } else if (originalDialogRight) {
      x = viewportWidth - getPixels(originalDialogRight) - width;
    } else {
      x = (viewportWidth - width) / 2;
    }
    let y: number;
    if (originalDialogTop) {
      y = getPixels(originalDialogTop);
    } else if (originalDialogBottom) {
      y = viewportHeight - getPixels(originalDialogBottom) - height;
    } else {
      y = (viewportHeight - height) / 2;
    }
    // use drag ref's mechanisms for positioning instead of the dialog's
    this._dialogRef.updatePosition({
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    });
    this._dragRef.setFreeDragPosition({ x, y });
  }

  /**
   * Executes `_attachCorners` to handle attach corners.
   * @zh 执行 `_attachCorners`，用于挂载Corners。
   */
  private _attachCorners(): void {
    Object.values(corners).forEach((corner: corners) => {
      const element: HTMLElement = this._renderer2.createElement('div');
      this.cornerElements = [...this.cornerElements, element];
      this._renderer2.setStyle(element, 'position', 'absolute');
      this._renderer2.setStyle(element, 'width', cornerWidth);
      this._renderer2.setStyle(element, 'height', cornerWidth);
      this._renderer2.setStyle(element, 'z-index', 1);
      this._renderer2.appendChild(this._getDialogWrapper(), element);

      let cursor: cursors;
      let topBottom: verticalAlignment;
      let rightLeft: horizontalAlignment;

      if (corner === corners.topRight) {
        cursor = cursors.nesw;
        topBottom = verticalAlignment.top;
        rightLeft = horizontalAlignment.right;
      } else if (corner === corners.bottomRight) {
        cursor = cursors.nwse;
        topBottom = verticalAlignment.bottom;
        rightLeft = horizontalAlignment.right;

        const icon: HTMLElement = this._renderer2.createElement('i');
        this._renderer2.addClass(icon, 'material-icons');
        this._renderer2.addClass(icon, 'resize-icons');
        this._renderer2.appendChild(
          icon,
          this._renderer2.createText('filter_list')
        );
        this._renderer2.appendChild(element, icon);
        this._renderer2.setStyle(
          icon,
          'transform',
          `rotate(${315}deg) translate(0px, ${offset})`
        );
        this._renderer2.setStyle(icon, 'font-size', cornerWidth);
        this._renderer2.setStyle(icon, 'z-index', 1);
      } else if (corner === corners.bottomLeft) {
        cursor = cursors.nesw;
        topBottom = verticalAlignment.bottom;
        rightLeft = horizontalAlignment.left;
      } else {
        cursor = cursors.nwse;
        topBottom = verticalAlignment.top;
        rightLeft = horizontalAlignment.left;
      }
      this._renderer2.setStyle(element, topBottom, offset);
      this._renderer2.setStyle(element, rightLeft, offset);
      this._renderer2.setStyle(element, 'cursor', cursor);

      const pointerDownSub: Subscription = fromEvent<PointerEvent>(
        element,
        'pointerdown'
      ).subscribe((event: PointerEvent) => {
        this._handleMouseDown(event, corner);
      });
      this.pointerDownSubs = [...this.pointerDownSubs, pointerDownSub];
    });
  }

  /**
   * Executes `_handleMouseDown` to handle handle mouse down.
   * @zh 执行 `_handleMouseDown`，用于连接手柄鼠标向下。
   * @param event - event parameter (`PointerEvent`) / 事件参数（`PointerEvent`）
   * @param corner - corner parameter (`corners`) / corner参数（`corners`）
   */
  private _handleMouseDown(event: PointerEvent, corner: corners): void {
    this._renderer2.setStyle(
      <HTMLElement>this._document.body,
      'user-select',
      'none'
    );
    const { width: originalWidth, height: originalHeight } =
      this._getDialogWrapperDimensions();
    const originalMouseX: number = event.pageX;
    const originalMouseY: number = event.pageY;
    const { x: currentTransformX, y: currentTransformY }: Point =
      this._dragRef.getFreeDragPosition();
    const wrapper = this._getDialogWrapper()?.getBoundingClientRect();
    const distanceFromBottom = wrapper?.bottom ?? 0;
    const distanceFromRight = wrapper?.right ?? 0;
    const viewportWidth = this._getViewportDimensions()?.right ?? 0;
    const viewportHeight = this._getViewportDimensions()?.bottom ?? 0;

    const mouseMoveSub: Subscription = fromEvent<PointerEvent>(
      window,
      'pointermove'
    ).subscribe((e: PointerEvent) => {
      e.preventDefault(); // prevent highlighting of text when dragging

      const yDelta: number = clamp(0, e.pageY, viewportHeight) - originalMouseY;
      const xDelta: number = clamp(0, e.pageX, viewportWidth) - originalMouseX;
      let newHeight: number;
      let newWidth: number;
      let newTransformY = 0;
      let newTransformX = 0;

      // top right
      if (corner === corners.topRight) {
        newHeight = clamp(minHeight, originalHeight - yDelta, viewportHeight);
        newWidth = clamp(minWidth, originalWidth + xDelta, viewportWidth);
        newTransformY = clamp(
          0,
          currentTransformY + yDelta,
          distanceFromBottom - newHeight
        );
        newTransformX = currentTransformX;
      }
      // bottom right
      else if (corner === corners.bottomRight) {
        newHeight = clamp(minHeight, originalHeight + yDelta, viewportHeight);
        newWidth = clamp(minWidth, originalWidth + xDelta, viewportWidth);
        newTransformY = currentTransformY;
        newTransformX = currentTransformX;
      }
      // bottom left
      else if (corner === corners.bottomLeft) {
        newHeight = clamp(minHeight, originalHeight + yDelta, viewportHeight);
        newWidth = clamp(minWidth, originalWidth - xDelta, viewportWidth);
        newTransformY = currentTransformY;
        newTransformX = clamp(
          0,
          currentTransformX + xDelta,
          distanceFromRight - newWidth
        );
      }
      // top left
      else {
        newHeight = clamp(minHeight, originalHeight - yDelta, viewportHeight);
        newWidth = clamp(minWidth, originalWidth - xDelta, viewportWidth);

        newTransformX = clamp(
          0,
          currentTransformX + xDelta,
          distanceFromRight - newWidth
        );
        newTransformY = clamp(
          0,
          currentTransformY + yDelta,
          distanceFromBottom - newHeight
        );
      }
      this._dialogRef.updateSize(`${newWidth}px`, `${newHeight}px`);
      this._dragRef.setFreeDragPosition({
        x: newTransformX,
        y: newTransformY,
      });
    });

    const mouseUpSub: Subscription = merge(
      fromEvent(window, 'pointerup'),
      fromEvent(window, 'pointercancel')
    ).subscribe(() => {
      this._renderer2.removeStyle(
        <HTMLElement>this._document.body,
        'user-select'
      );
      mouseMoveSub.unsubscribe();
      mouseUpSub.unsubscribe();
    });
  }
}
