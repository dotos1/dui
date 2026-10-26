/**
 * @fileoverview Module `src/container/gridster/gridsterResizable.service.ts` providing gridster resizable service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterResizable.service.ts`，提供网格拖拽布局是否可调尺寸服务相关的定义与实现。
 */

import {Injectable, NgZone} from '@angular/core';
import {GridsterComponentInterface} from './gridster.interface';
import {DirTypes} from './gridsterConfig.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterPush} from './gridsterPush.service';
import {GridsterPushResize} from './gridsterPushResize.service';
import {GridsterResizeEventType} from './gridsterResizeEventType.interface';

import {cancelScroll, scroll} from './gridsterScroll.service';
import {GridsterUtils} from './gridsterUtils.service';

/**
 * Injectable Angular service `GridsterResizable` managing gridster resizable state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterResizable`，管理 `src/container/gridster` 中的网格拖拽布局是否可调尺寸状态与业务操作。
 */
@Injectable()
export class GridsterResizable {
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
   * Property `lastMouse` (`{ clientX: number, clientY: number }`) storing last mouse.
   * @zh 属性 `lastMouse`（类型：`{ clientX: number, clientY: number }`），用于存储或配置末尾鼠标。
   */
  lastMouse: {
    clientX: number,
    clientY: number
  };
  /**
   * Property `itemBackup` (`Array<number>`) storing item backup.
   * @zh 属性 `itemBackup`（类型：`Array<number>`），用于存储或配置条目Backup。
   */
  itemBackup: Array<number>;
  /**
   * Property `resizeEventScrollType` (`GridsterResizeEventType`) storing resize event scroll type.
   * @zh 属性 `resizeEventScrollType`（类型：`GridsterResizeEventType`），用于存储或配置调整尺寸事件滚动类型。
   */
  resizeEventScrollType: GridsterResizeEventType;
  /**
   * Property `directionFunction` (`(e: any) => void`) storing direction function.
   * @zh 属性 `directionFunction`（类型：`(e: any) => void`），用于存储或配置方向函数。
   */
  directionFunction: (e) => void;
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
   * Property `resizeEnabled` (`boolean`) storing resize enabled.
   * @zh 属性 `resizeEnabled`（类型：`boolean`），用于存储或配置调整尺寸已启用。
   */
  resizeEnabled: boolean;
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
   * Property `push` (`GridsterPush`) storing push.
   * @zh 属性 `push`（类型：`GridsterPush`），用于存储或配置推入。
   */
  push: GridsterPush;
  /**
   * Property `pushResize` (`GridsterPushResize`) storing push resize.
   * @zh 属性 `pushResize`（类型：`GridsterPushResize`），用于存储或配置推入调整尺寸。
   */
  pushResize: GridsterPushResize;
  /**
   * Property `minHeight` (`number`) storing min height.
   * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度。
   */
  minHeight: number;
  /**
   * Property `minWidth` (`number`) storing min width.
   * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度。
   */
  minWidth: number;
  /**
   * Property `offsetTop` (`number`) storing offset top.
   * @zh 属性 `offsetTop`（类型：`number`），用于存储或配置偏移量顶部位置。
   */
  offsetTop: number;
  /**
   * Property `offsetLeft` (`number`) storing offset left.
   * @zh 属性 `offsetLeft`（类型：`number`），用于存储或配置偏移量左侧位置。
   */
  offsetLeft: number;
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
   * Property `diffRight` (`number`) storing diff right.
   * @zh 属性 `diffRight`（类型：`number`），用于存储或配置diff右侧位置。
   */
  diffRight: number;
  /**
   * Property `diffBottom` (`number`) storing diff bottom.
   * @zh 属性 `diffBottom`（类型：`number`），用于存储或配置diff底部位置。
   */
  diffBottom: number;
  /**
   * Property `margin` (`number`) storing margin.
   * @zh 属性 `margin`（类型：`number`），用于存储或配置外边距。
   */
  margin: number;
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
   * Property `bottom` (`number`) storing bottom.
   * @zh 属性 `bottom`（类型：`number`），用于存储或配置底部位置。
   */
  bottom: number;
  /**
   * Property `right` (`number`) storing right.
   * @zh 属性 `right`（类型：`number`），用于存储或配置右侧位置。
   */
  right: number;
  /**
   * Property `width` (`number`) storing width.
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  width: number;
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  height: number;
  /**
   * Property `newPosition` (`number`) storing new position.
   * @zh 属性 `newPosition`（类型：`number`），用于存储或配置新位置。
   */
  newPosition: number;

  /**
   * Creates an instance of `GridsterResizable` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterResizable` 实例，并初始化其依赖项与内部状态。
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
    this.itemBackup = [0, 0, 0, 0];
    this.resizeEventScrollType = {w: false, e: false, n: false, s: false};
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    if (this.gridster.previewStyle) {
      this.gridster.previewStyle();
    }
    delete this.gridsterItem;
    delete this.gridster;
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
    if (this.gridster.options.resizable && this.gridster.options.resizable.start) {
      this.gridster.options.resizable.start(this.gridsterItem.item, this.gridsterItem, e);
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

    this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-resizing');
    this.lastMouse.clientX = e.clientX;
    this.lastMouse.clientY = e.clientY;
    this.left = this.gridsterItem.left;
    this.top = this.gridsterItem.top;
    this.width = this.gridsterItem.width;
    this.height = this.gridsterItem.height;
    this.bottom = this.gridsterItem.top + this.gridsterItem.height;
    this.right = this.gridsterItem.left + this.gridsterItem.width;
    this.margin = this.gridster.$options.margin;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.diffLeft = e.clientX + this.offsetLeft - this.left;
    this.diffRight = e.clientX + this.offsetLeft - this.right;
    this.diffTop = e.clientY + this.offsetTop - this.top;
    this.diffBottom = e.clientY + this.offsetTop - this.bottom;
    this.minHeight = this.gridster.positionYToPixels(this.gridsterItem.$item.minItemRows || this.gridster.$options.minItemRows)
      - this.margin;
    this.minWidth = this.gridster.positionXToPixels(this.gridsterItem.$item.minItemCols || this.gridster.$options.minItemCols)
      - this.margin;
    this.gridster.movingItem = this.gridsterItem.$item;
    this.gridster.previewStyle();
    this.push = new GridsterPush(this.gridsterItem);
    this.pushResize = new GridsterPushResize(this.gridsterItem);
    this.gridster.dragInProgress = true;
    this.gridster.updateGrid();

    if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-n') > -1) {
      this.resizeEventScrollType.n = true;
      this.directionFunction = this.handleN;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-w') > -1) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.e = true;
        this.directionFunction = this.handleE;
      } else {
        this.resizeEventScrollType.w = true;
        this.directionFunction = this.handleW;
      }
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-s') > -1) {
      this.resizeEventScrollType.s = true;
      this.directionFunction = this.handleS;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-e') > -1) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.w = true;
        this.directionFunction = this.handleW;
      } else {
        this.resizeEventScrollType.e = true;
        this.directionFunction = this.handleE;
      }
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-nw') > -1) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.n = true;
        this.resizeEventScrollType.e = true;
        this.directionFunction = this.handleNE;
      } else {
        this.resizeEventScrollType.n = true;
        this.resizeEventScrollType.w = true;
        this.directionFunction = this.handleNW;
      }
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-ne') > -1) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.n = true;
        this.resizeEventScrollType.w = true;
        this.directionFunction = this.handleNW;
      } else {
        this.resizeEventScrollType.n = true;
        this.resizeEventScrollType.e = true;
        this.directionFunction = this.handleNE;
      }
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-sw') > -1) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.s = true;
        this.resizeEventScrollType.e = true;
        this.directionFunction = this.handleSE;
      } else {
        this.resizeEventScrollType.s = true;
        this.resizeEventScrollType.w = true;
        this.directionFunction = this.handleSW;
      }
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-se') > -1) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.s = true;
        this.resizeEventScrollType.w = true;
        this.directionFunction = this.handleSW;
      } else {
        this.resizeEventScrollType.s = true;
        this.resizeEventScrollType.e = true;
        this.directionFunction = this.handleSE;
      }
    }
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
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    scroll(this.gridster, this.left, this.top, this.width, this.height, e, this.lastMouse, this.directionFunction.bind(this), true,
      this.resizeEventScrollType);
    this.directionFunction(e);

    this.lastMouse.clientX = e.clientX;
    this.lastMouse.clientY = e.clientY;
    // 同 gridsterDraggable.service.ts：directionFunction() 已在 zone 外完成了
    // 尺寸计算与视觉反馈，这里只把强制回到 zone 触发 CD 的部分按帧合并，
    // 原来每个原始 mousemove 都会同步执行一次
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
    this.mousemove();
    this.mouseup();
    this.mouseleave();
    this.cancelOnBlur();
    this.touchmove();
    this.touchend();
    this.touchcancel();
    this.gridster.dragInProgress = false;
    this.gridster.updateGrid();
    if (this.gridster.options.resizable && this.gridster.options.resizable.stop) {
      Promise.resolve(this.gridster.options.resizable.stop(this.gridsterItem.item, this.gridsterItem, e))
        .then(this.makeResize.bind(this), this.cancelResize.bind(this));
    } else {
      this.makeResize();
    }
    setTimeout(() => {
      this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-resizing');
      if (this.gridster) {
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
      }
    });
  }

  /**
   * Executes `cancelResize` to handle cancel resize.
   * @zh 执行 `cancelResize`，用于取消调整尺寸。
   */
  cancelResize(): void {
    this.gridsterItem.$item.cols = this.gridsterItem.item.cols || 1;
    this.gridsterItem.$item.rows = this.gridsterItem.item.rows || 1;
    this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
    this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
    this.gridsterItem.setSize();
    this.push.restoreItems();
    this.pushResize.restoreItems();
    this.push.destroy();
    delete this.push;
    this.pushResize.destroy();
    delete this.pushResize;
  }

  /**
   * Executes `makeResize` to handle make resize.
   * @zh 执行 `makeResize`，用于生成调整尺寸。
   */
  makeResize(): void {
    this.gridsterItem.setSize();
    this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
    this.push.setPushedItems();
    this.pushResize.setPushedItems();
    this.push.destroy();
    delete this.push;
    this.pushResize.destroy();
    delete this.pushResize;
  }

  /**
   * Executes `handleN` to handle handle n.
   * @zh 执行 `handleN`，用于连接手柄N。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  handleN(e): void {
    this.top = e.clientY + this.offsetTop - this.diffTop;
    this.height = this.bottom - this.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
      this.top = this.bottom - this.minHeight;
    }
    this.newPosition = this.gridster.pixelsToPositionY(this.top + this.margin, Math.floor);
    if (this.gridsterItem.$item.y !== this.newPosition) {
      this.itemBackup[1] = this.gridsterItem.$item.y;
      this.itemBackup[3] = this.gridsterItem.$item.rows;
      this.gridsterItem.$item.rows += this.gridsterItem.$item.y - this.newPosition;
      this.gridsterItem.$item.y = this.newPosition;
      this.pushResize.pushItems(this.pushResize.fromSouth);
      this.push.pushItems(this.push.fromSouth, this.gridster.$options.disablePushOnResize);
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.y = this.itemBackup[1];
        this.gridsterItem.$item.rows = this.itemBackup[3];
        this.setItemTop(this.gridster.positionYToPixels(this.gridsterItem.$item.y));
        this.setItemHeight(this.gridster.positionYToPixels(this.gridsterItem.$item.rows) - this.margin);
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.setItemTop(this.top);
    this.setItemHeight(this.height);
  }

  /**
   * Executes `handleW` to handle handle w.
   * @zh 执行 `handleW`，用于连接手柄W。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  handleW(e): void {
    this.left = e.clientX + this.offsetLeft - this.diffLeft;
    this.width = this.right - this.left;
    if (this.minWidth > this.width) {
      this.width = this.minWidth;
      this.left = this.right - this.minWidth;
    }
    this.newPosition = this.gridster.pixelsToPositionX(this.left + this.margin, Math.floor);
    if (this.gridsterItem.$item.x !== this.newPosition) {
      this.itemBackup[0] = this.gridsterItem.$item.x;
      this.itemBackup[2] = this.gridsterItem.$item.cols;
      this.gridsterItem.$item.cols += this.gridsterItem.$item.x - this.newPosition;
      this.gridsterItem.$item.x = this.newPosition;
      this.pushResize.pushItems(this.pushResize.fromEast);
      this.push.pushItems(this.push.fromEast, this.gridster.$options.disablePushOnResize);
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.x = this.itemBackup[0];
        this.gridsterItem.$item.cols = this.itemBackup[2];
        this.setItemLeft(this.gridster.positionXToPixels(this.gridsterItem.$item.x));
        this.setItemWidth(this.gridster.positionXToPixels(this.gridsterItem.$item.cols) - this.margin);
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.setItemLeft(this.left);
    this.setItemWidth(this.width);
  }

  /**
   * Executes `handleS` to handle handle s.
   * @zh 执行 `handleS`，用于连接手柄S。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  handleS(e): void {
    this.height = e.clientY + this.offsetTop - this.diffBottom - this.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
    }
    this.bottom = this.top + this.height;
    this.newPosition = this.gridster.pixelsToPositionY(this.bottom, Math.ceil);
    if ((this.gridsterItem.$item.y + this.gridsterItem.$item.rows) !== this.newPosition) {
      this.itemBackup[3] = this.gridsterItem.$item.rows;
      this.gridsterItem.$item.rows = this.newPosition - this.gridsterItem.$item.y;
      this.pushResize.pushItems(this.pushResize.fromNorth);
      this.push.pushItems(this.push.fromNorth, this.gridster.$options.disablePushOnResize);
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.rows = this.itemBackup[3];
        this.setItemHeight(this.gridster.positionYToPixels(this.gridsterItem.$item.rows) - this.margin);
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.setItemHeight(this.height);
  }

  /**
   * Executes `handleE` to handle handle e.
   * @zh 执行 `handleE`，用于连接手柄E。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  handleE(e): void {
    this.width = e.clientX + this.offsetLeft - this.diffRight - this.left;
    if (this.minWidth > this.width) {
      this.width = this.minWidth;
    }
    this.right = this.left + this.width;
    this.newPosition = this.gridster.pixelsToPositionX(this.right, Math.ceil);
    if ((this.gridsterItem.$item.x + this.gridsterItem.$item.cols) !== this.newPosition) {
      this.itemBackup[2] = this.gridsterItem.$item.cols;
      this.gridsterItem.$item.cols = this.newPosition - this.gridsterItem.$item.x;
      this.pushResize.pushItems(this.pushResize.fromWest);
      this.push.pushItems(this.push.fromWest, this.gridster.$options.disablePushOnResize);
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.cols = this.itemBackup[2];
        this.setItemWidth(this.gridster.positionXToPixels(this.gridsterItem.$item.cols) - this.margin);
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.setItemWidth(this.width);
  }

  /**
   * Executes `handleNW` to handle handle nw.
   * @zh 执行 `handleNW`，用于连接手柄NW。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  handleNW(e): void {
    this.handleN(e);
    this.handleW(e);
  }

  /**
   * Executes `handleNE` to handle handle ne.
   * @zh 执行 `handleNE`，用于连接手柄NE。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  handleNE(e): void {
    this.handleN(e);
    this.handleE(e);
  }

  /**
   * Executes `handleSW` to handle handle sw.
   * @zh 执行 `handleSW`，用于连接手柄SW。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  handleSW(e): void {
    this.handleS(e);
    this.handleW(e);
  }

  /**
   * Executes `handleSE` to handle handle se.
   * @zh 执行 `handleSE`，用于连接手柄SE。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  handleSE(e): void {
    this.handleS(e);
    this.handleE(e);
  }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   */
  toggle(): void {
    this.resizeEnabled = this.gridsterItem.canBeResized();
  }

  /**
   * Executes `dragStartDelay` to handle drag start delay.
   * @zh 执行 `dragStartDelay`，用于拖拽开始延迟。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  dragStartDelay(e): void {
    GridsterUtils.checkTouchEvent(e);
    if (!this.gridster.$options.resizable.delayStart) {
      this.dragStart(e);
      return;
    }
    const timeout = setTimeout(() => {
      this.dragStart(e);
      cancelDrag();
    }, this.gridster.$options.resizable.delayStart);
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

  /**
   * Executes `setItemTop` to handle set item top.
   * @zh 执行 `setItemTop`，用于集合条目顶部位置。
   * @param top - top parameter (`number`) / 顶部位置参数（`number`）
   */
  setItemTop(top: number): void {
    this.gridster.gridRenderer.setCellPosition(this.gridsterItem.renderer, this.gridsterItem.el, this.left, top);
  }

  /**
   * Executes `setItemLeft` to handle set item left.
   * @zh 执行 `setItemLeft`，用于集合条目左侧位置。
   * @param left - left parameter (`number`) / 左侧位置参数（`number`）
   */
  setItemLeft(left: number): void {
    this.gridster.gridRenderer.setCellPosition(this.gridsterItem.renderer, this.gridsterItem.el, left, this.top);
  }

  /**
   * Executes `setItemHeight` to handle set item height.
   * @zh 执行 `setItemHeight`，用于集合条目高度。
   * @param height - height parameter (`number`) / 高度参数（`number`）
   */
  setItemHeight(height: number): void {
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', height + 'px');
  }

  /**
   * Executes `setItemWidth` to handle set item width.
   * @zh 执行 `setItemWidth`，用于集合条目宽度。
   * @param width - width parameter (`number`) / 宽度参数（`number`）
   */
  setItemWidth(width: number): void {
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', width + 'px');
  }
}
