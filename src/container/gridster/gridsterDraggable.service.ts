/**
 * @fileoverview Module `src/container/gridster/gridsterDraggable.service.ts` providing gridster draggable service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterDraggable.service.ts`，提供网格拖拽布局是否可拖拽服务相关的定义与实现。
 */

import {Injectable, NgZone} from '@angular/core';
import {GridsterComponentInterface} from './gridster.interface';
import {DirTypes} from './gridsterConfig.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterPush} from './gridsterPush.service';
import {cancelScroll, scroll} from './gridsterScroll.service';
import {GridsterSwap} from './gridsterSwap.service';
import {GridsterUtils} from './gridsterUtils.service';

/**
 * Injectable Angular service `GridsterDraggable` managing gridster draggable state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterDraggable`，管理 `src/container/gridster` 中的网格拖拽布局是否可拖拽状态与业务操作。
 */
@Injectable()
export class GridsterDraggable {
  /**
   * Property `gridsterItem` (`GridsterItemComponentInterface`) storing gridster item.
   * @zh 属性 `gridsterItem`（类型：`GridsterItemComponentInterface`），用于存储或配置网格拖拽布局条目。
   */
  gridsterItem: GridsterItemComponentInterface;
  /**
   * Property `gridster` (`GridsterComponentInterface`) storing gridster.
   * @zh 属性 `gridster`（类型：`GridsterComponentInterface`），用于存储或配置网格拖拽布局。
   */
  gridster: GridsterComponentInterface;
  /**
   * Property `lastMouse` (`{ clientX: number; clientY: number; }`) storing last mouse.
   * @zh 属性 `lastMouse`（类型：`{ clientX: number; clientY: number; }`），用于存储或配置末尾鼠标。
   */
  lastMouse: {
    clientX: number,
    clientY: number
  };
  /**
   * Property `offsetLeft` (`number`) storing offset left.
   * @zh 属性 `offsetLeft`（类型：`number`），用于存储或配置偏移量左侧位置。
   */
  offsetLeft: number;
  /**
   * Property `offsetTop` (`number`) storing offset top.
   * @zh 属性 `offsetTop`（类型：`number`），用于存储或配置偏移量顶部位置。
   */
  offsetTop: number;
  /**
   * Property `margin` (`number`) storing margin.
   * @zh 属性 `margin`（类型：`number`），用于存储或配置外边距。
   */
  margin: number;
  /**
   * Property `diffTop` (`number`) storing diff top.
   * @zh 属性 `diffTop`（类型：`number`），用于存储或配置diff顶部位置。
   */
  diffTop: number;
  /**
   * Property `diffLeft` (`number`) storing diff left.
   * @zh 属性 `diffLeft`（类型：`number`），用于存储或配置diff左侧位置。
   */
  diffLeft: number;
  /**
   * Property `top` (`number`) storing top.
   * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
   */
  top: number;
  /**
   * Property `left` (`number`) storing left.
   * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
   */
  left: number;
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  height: number;
  /**
   * Property `width` (`number`) storing width.
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  width: number;
  /**
   * Property `positionX` (`number`) storing position x.
   * @zh 属性 `positionX`（类型：`number`），用于存储或配置位置X坐标。
   */
  positionX: number;
  /**
   * Property `positionY` (`number`) storing position y.
   * @zh 属性 `positionY`（类型：`number`），用于存储或配置位置Y坐标。
   */
  positionY: number;
  /**
   * Property `positionXBackup` (`number`) storing position x backup.
   * @zh 属性 `positionXBackup`（类型：`number`），用于存储或配置位置X坐标Backup。
   */
  positionXBackup: number;
  /**
   * Property `positionYBackup` (`number`) storing position y backup.
   * @zh 属性 `positionYBackup`（类型：`number`），用于存储或配置位置Y坐标Backup。
   */
  positionYBackup: number;
  /**
   * Property `enabled` (`boolean`) storing enabled.
   * @zh 属性 `enabled`（类型：`boolean`），用于存储或配置已启用。
   */
  enabled: boolean;
  /**
   * Property `dragStartFunction` (`(event: any) => void`) storing drag start function.
   * @zh 属性 `dragStartFunction`（类型：`(event: any) => void`），用于存储或配置拖拽开始函数。
   */
  dragStartFunction: (event) => void;
  /**
   * Property `dragFunction` (`(event: any) => void`) storing drag function.
   * @zh 属性 `dragFunction`（类型：`(event: any) => void`），用于存储或配置拖拽函数。
   */
  dragFunction: (event) => void;
  /**
   * Property `dragStopFunction` (`(event: any) => void`) storing drag stop function.
   * @zh 属性 `dragStopFunction`（类型：`(event: any) => void`），用于存储或配置拖拽停止函数。
   */
  dragStopFunction: (event) => void;
  /**
   * Property `updateGridFrame` (`number`) storing update grid frame.
   * @zh 属性 `updateGridFrame`（类型：`number`），用于存储或配置更新网格表格框架。
   */
  private updateGridFrame: number;
  /**
   * Property `mousemove` (`() => void`) storing mousemove.
   * @zh 属性 `mousemove`（类型：`() => void`），用于存储或配置鼠标移动。
   */
  mousemove: () => void;
  /**
   * Property `mouseup` (`() => void`) storing mouseup.
   * @zh 属性 `mouseup`（类型：`() => void`），用于存储或配置鼠标抬起。
   */
  mouseup: () => void;
  /**
   * Property `mouseleave` (`() => void`) storing mouseleave.
   * @zh 属性 `mouseleave`（类型：`() => void`），用于存储或配置鼠标离开。
   */
  mouseleave: () => void;
  /**
   * Property `cancelOnBlur` (`() => void`) storing cancel on blur.
   * @zh 属性 `cancelOnBlur`（类型：`() => void`），用于存储或配置取消当失焦。
   */
  cancelOnBlur: () => void;
  /**
   * Property `touchmove` (`() => void`) storing touchmove.
   * @zh 属性 `touchmove`（类型：`() => void`），用于存储或配置touchmove。
   */
  touchmove: () => void;
  /**
   * Property `touchend` (`() => void`) storing touchend.
   * @zh 属性 `touchend`（类型：`() => void`），用于存储或配置touchend。
   */
  touchend: () => void;
  /**
   * Property `touchcancel` (`() => void`) storing touchcancel.
   * @zh 属性 `touchcancel`（类型：`() => void`），用于存储或配置touchcancel。
   */
  touchcancel: () => void;
  /**
   * Property `mousedown` (`() => void`) storing mousedown.
   * @zh 属性 `mousedown`（类型：`() => void`），用于存储或配置鼠标按下。
   */
  mousedown: () => void;
  /**
   * Property `touchstart` (`() => void`) storing touchstart.
   * @zh 属性 `touchstart`（类型：`() => void`），用于存储或配置touchstart。
   */
  touchstart: () => void;
  /**
   * Property `push` (`GridsterPush`) storing push.
   * @zh 属性 `push`（类型：`GridsterPush`），用于存储或配置推入。
   */
  push: GridsterPush;
  /**
   * Property `swap` (`GridsterSwap`) storing swap.
   * @zh 属性 `swap`（类型：`GridsterSwap`），用于存储或配置swap。
   */
  swap: GridsterSwap;
  /**
   * Property `path` (`{ x: number; y: number; }[]`) storing path.
   * @zh 属性 `path`（类型：`{ x: number; y: number; }[]`），用于存储或配置路径。
   */
  path: Array<{ x: number, y: number }>;
  /**
   * Property `collision` (`boolean | GridsterItemComponentInterface`) storing collision (default: `false`).
   * @zh 属性 `collision`（类型：`boolean | GridsterItemComponentInterface`），用于存储或配置collision（默认值：`false`）。
   */
  collision: GridsterItemComponentInterface | boolean = false;

  /**
   * Creates an instance of `GridsterDraggable` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterDraggable` 实例，并初始化其依赖项与内部状态。
   * @param gridsterItem - Injected or initial gridster item (`GridsterItemComponentInterface`) / 注入或传入的网格拖拽布局条目（`GridsterItemComponentInterface`）
   * @param gridster - Injected or initial gridster (`GridsterComponentInterface`) / 注入或传入的网格拖拽布局（`GridsterComponentInterface`）
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   */
  constructor(gridsterItem: GridsterItemComponentInterface, gridster: GridsterComponentInterface, private zone: NgZone) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
    this.lastMouse = {
      clientX: 0,
      clientY: 0
    };
    this.path = [];
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    if (this.gridster.previewStyle) {
      this.gridster.previewStyle(true);
    }
    delete this.gridsterItem;
    delete this.gridster;
    delete this.collision;
    if (this.mousedown) {
      this.mousedown();
      this.touchstart();
    }
  }

  /**
   * Executes `dragStart` to handle drag start.
   * @zh 执行 `dragStart`，用于拖拽开始。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  dragStart(e): void {
    if (e.which && e.which !== 1) {
      return;
    }

    if (this.gridster.options.draggable && this.gridster.options.draggable.start) {
      this.gridster.options.draggable.start(this.gridsterItem.item, this.gridsterItem, e);
    }

    e.stopPropagation();
    e.preventDefault();
    this.dragFunction = this.dragMove.bind(this);
    this.dragStopFunction = this.dragStop.bind(this);

    this.zone.runOutsideAngular(() => {
      this.mousemove = this.gridsterItem.renderer.listen('document', 'mousemove', this.dragFunction);
      this.touchmove = this.gridster.renderer.listen(this.gridster.el, 'touchmove', this.dragFunction);
    });
    this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
    this.mouseleave = this.gridsterItem.renderer.listen('document', 'mouseleave', this.dragStopFunction);
    this.cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', this.dragStopFunction);
    this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
    this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
    this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-moving');
    this.margin = this.gridster.$options.margin;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.left = this.gridsterItem.left - this.margin;
    this.top = this.gridsterItem.top - this.margin;
    this.width = this.gridsterItem.width;
    this.height = this.gridsterItem.height;
    if (this.gridster.$options.dirType === DirTypes.RTL) {
      this.diffLeft = (e.clientX - this.gridster.el.scrollWidth + this.gridsterItem.left);
    } else {
      this.diffLeft = e.clientX + this.offsetLeft - this.margin - this.left;
    }
    this.diffTop = e.clientY + this.offsetTop - this.margin - this.top;
    this.gridster.movingItem = this.gridsterItem.$item;
    this.gridster.previewStyle(true);
    this.push = new GridsterPush(this.gridsterItem);
    this.swap = new GridsterSwap(this.gridsterItem);
    this.gridster.dragInProgress = true;
    this.gridster.updateGrid();
    this.path.push({x: this.gridsterItem.item.x || 0, y: this.gridsterItem.item.y || 0});
  }

  /**
   * Executes `dragMove` to handle drag move.
   * @zh 执行 `dragMove`，用于拖拽移动。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  dragMove(e): void {
    e.stopPropagation();
    e.preventDefault();
    GridsterUtils.checkTouchEvent(e);
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    scroll(this.gridster, this.left, this.top, this.width, this.height, e, this.lastMouse,
      this.calculateItemPositionFromMousePosition.bind(this));

    this.calculateItemPositionFromMousePosition(e);
  }

  /**
   * Executes `calculateItemPositionFromMousePosition` to handle calculate item position from mouse position.
   * @zh 执行 `calculateItemPositionFromMousePosition`，用于计算条目位置从鼠标位置。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  calculateItemPositionFromMousePosition(e): void {
    if (this.gridster.$options.dirType === DirTypes.RTL) {
      this.left = this.gridster.el.scrollWidth - e.clientX + this.diffLeft;
    } else {
      this.left = e.clientX + this.offsetLeft - this.diffLeft;
    }

    this.top = e.clientY + this.offsetTop - this.diffTop;
    this.calculateItemPosition();
    this.lastMouse.clientX = e.clientX;
    this.lastMouse.clientY = e.clientY;
    // calculateItemPosition() 已经在 zone 外完成了碰撞检测/推挤/交换并直接
    // 用 renderer 设置了被拖拽项的位置，跟手视觉反馈不受影响；这里只把
    // "强制回到 Angular zone 触发一次 CD" 的部分按帧合并，原来每个原始
    // mousemove 都会同步执行一次
    if (this.updateGridFrame !== undefined) {
      return;
    }
    this.updateGridFrame = requestAnimationFrame(() => {
      this.updateGridFrame = undefined;
      this.zone.run(() => {
        this.gridster.updateGrid();
      });
    });
  }

  /**
   * Executes `dragStop` to handle drag stop.
   * @zh 执行 `dragStop`，用于拖拽停止。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  dragStop(e): void {
    e.stopPropagation();
    e.preventDefault();

    if (this.updateGridFrame !== undefined) {
      cancelAnimationFrame(this.updateGridFrame);
      this.updateGridFrame = undefined;
    }
    cancelScroll();
    this.cancelOnBlur();
    this.mousemove();
    this.mouseup();
    this.mouseleave();
    this.touchmove();
    this.touchend();
    this.touchcancel();
    this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-moving');
    this.gridster.dragInProgress = false;
    this.gridster.updateGrid();
    this.path = [];
    if (this.gridster.options.draggable && this.gridster.options.draggable.stop) {
      Promise.resolve(this.gridster.options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e))
        .then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
    } else {
      this.makeDrag();
    }
    setTimeout(() => {
      if (this.gridster) {
        this.gridster.movingItem = null;
        this.gridster.previewStyle(true);
      }
    });
  }

  /**
   * Executes `cancelDrag` to handle cancel drag.
   * @zh 执行 `cancelDrag`，用于取消拖拽。
   */
  cancelDrag() {
    this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
    this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
    this.gridsterItem.setSize();
    if (this.push) {
      this.push.restoreItems();
    }
    if (this.swap) {
      this.swap.restoreSwapItem();
    }
    if (this.push) {
      this.push.destroy();
      delete this.push;
    }
    if (this.swap) {
      this.swap.destroy();
      delete this.swap;
    }
  }

  /**
   * Executes `makeDrag` to handle make drag.
   * @zh 执行 `makeDrag`，用于生成拖拽。
   */
  makeDrag() {
    if (this.gridster.$options.draggable.dropOverItems && this.gridster.options.draggable
      && this.gridster.options.draggable.dropOverItemsCallback
      && this.collision && this.collision !== true && this.collision.$item) {
      this.gridster.options.draggable.dropOverItemsCallback(this.gridsterItem.item, this.collision.item, this.gridster);
    }
    this.collision = false;
    this.gridsterItem.setSize();
    this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
    if (this.push) {
      this.push.setPushedItems();
    }
    if (this.swap) {
      this.swap.setSwapItem();
    }
    if (this.push) {
      this.push.destroy();
      delete this.push;
    }
    if (this.swap) {
      this.swap.destroy();
      delete this.swap;
    }
  }

  /**
   * Executes `calculateItemPosition` to handle calculate item position.
   * @zh 执行 `calculateItemPosition`，用于计算条目位置。
   */
  calculateItemPosition() {
    this.gridster.movingItem = this.gridsterItem.$item;
    this.positionX = this.gridster.pixelsToPositionX(this.left, Math.round);
    this.positionY = this.gridster.pixelsToPositionY(this.top, Math.round);
    this.positionXBackup = this.gridsterItem.$item.x;
    this.positionYBackup = this.gridsterItem.$item.y;
    this.gridsterItem.$item.x = this.positionX;
    if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
      this.gridsterItem.$item.x = this.positionXBackup;
    }
    this.gridsterItem.$item.y = this.positionY;
    if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
      this.gridsterItem.$item.y = this.positionYBackup;
    }
    this.gridster.gridRenderer.setCellPosition(this.gridsterItem.renderer, this.gridsterItem.el, this.left, this.top);

    if (this.positionXBackup !== this.gridsterItem.$item.x || this.positionYBackup !== this.gridsterItem.$item.y) {
      const lastPosition = this.path[this.path.length - 1];
      let direction = '';
      if (lastPosition.x < this.gridsterItem.$item.x) {
        direction = this.push.fromWest;
      } else if (lastPosition.x > this.gridsterItem.$item.x) {
        direction = this.push.fromEast;
      } else if (lastPosition.y < this.gridsterItem.$item.y) {
        direction = this.push.fromNorth;
      } else if (lastPosition.y > this.gridsterItem.$item.y) {
        direction = this.push.fromSouth;
      }
      this.push.pushItems(direction, this.gridster.$options.disablePushOnDrag);
      this.swap.swapItems();
      this.collision = this.gridster.checkCollision(this.gridsterItem.$item);
      if (this.collision) {
        this.gridsterItem.$item.x = this.positionXBackup;
        this.gridsterItem.$item.y = this.positionYBackup;
        if (this.gridster.$options.draggable.dropOverItems && this.collision !== true && this.collision.$item) {
          this.gridster.movingItem = null;
        }
      } else {
        this.path.push({x: this.gridsterItem.$item.x, y: this.gridsterItem.$item.y});
      }
      this.push.checkPushBack();
    }
    this.gridster.previewStyle(true);
  }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   */
  toggle() {
    const enableDrag = this.gridsterItem.canBeDragged();
    if (!this.enabled && enableDrag) {
      this.enabled = !this.enabled;
      this.dragStartFunction = this.dragStartDelay.bind(this);
      this.mousedown = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'mousedown', this.dragStartFunction);
      this.touchstart = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'touchstart', this.dragStartFunction);
    } else if (this.enabled && !enableDrag) {
      this.enabled = !this.enabled;
      this.mousedown();
      this.touchstart();
    }
  }

  /**
   * Executes `dragStartDelay` to handle drag start delay.
   * @zh 执行 `dragStartDelay`，用于拖拽开始延迟。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  dragStartDelay(e): void {
    if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('gridster-item-resizable-handler') > -1) {
      return;
    }
    if (GridsterUtils.checkContentClassForEvent(this.gridster, e)) {
      return;
    }
    GridsterUtils.checkTouchEvent(e);
    if (!this.gridster.$options.draggable.delayStart) {
      this.dragStart(e);
      return;
    }
    const timeout = setTimeout(() => {
      this.dragStart(e);
      cancelDrag();
    }, this.gridster.$options.draggable.delayStart);
    const cancelMouse = this.gridsterItem.renderer.listen('document', 'mouseup', cancelDrag);
    const cancelMouseLeave = this.gridsterItem.renderer.listen('document', 'mouseleave', cancelDrag);
    const cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', cancelDrag);
    const cancelTouchMove = this.gridsterItem.renderer.listen('document', 'touchmove', cancelMove);
    const cancelTouchEnd = this.gridsterItem.renderer.listen('document', 'touchend', cancelDrag);
    const cancelTouchCancel = this.gridsterItem.renderer.listen('document', 'touchcancel', cancelDrag);

    function cancelMove(eventMove) {
      GridsterUtils.checkTouchEvent(eventMove);
      if (Math.abs(eventMove.clientX - e.clientX) > 9 || Math.abs(eventMove.clientY - e.clientY) > 9) {
        cancelDrag();
      }
    }

    function cancelDrag() {
      clearTimeout(timeout);
      cancelOnBlur();
      cancelMouse();
      cancelMouseLeave();
      cancelTouchMove();
      cancelTouchEnd();
      cancelTouchCancel();
    }
  }
}
