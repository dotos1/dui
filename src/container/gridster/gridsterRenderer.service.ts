/**
 * @fileoverview Module `src/container/gridster/gridsterRenderer.service.ts` providing gridster renderer service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterRenderer.service.ts`，提供网格拖拽布局渲染器服务相关的定义与实现。
 */

import { Injectable, Renderer2 } from '@angular/core';
import { GridsterComponentInterface } from './gridster.interface';
import { DirTypes, GridType } from './gridsterConfig.interface';
import { GridsterItem } from './gridsterItem.interface';

/**
 * Injectable Angular service `GridsterRenderer` managing gridster renderer state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterRenderer`，管理 `src/container/gridster` 中的网格拖拽布局渲染器状态与业务操作。
 */
@Injectable()
export class GridsterRenderer {

  /**
   * Creates an instance of `GridsterRenderer` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterRenderer` 实例，并初始化其依赖项与内部状态。
   * @param gridster - Injected or initial gridster (`GridsterComponentInterface`) / 注入或传入的网格拖拽布局（`GridsterComponentInterface`）
   */
  constructor(private gridster: GridsterComponentInterface) {
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    delete this.gridster;
  }

  /**
   * Executes `updateItem` to handle update item.
   * @zh 执行 `updateItem`，用于更新条目。
   * @param el - el parameter (`any`) / DOM元素参数（`any`）
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @param renderer - renderer parameter (`Renderer2`) / 渲染器参数（`Renderer2`）
   */
  updateItem(el, item: GridsterItem, renderer: Renderer2) {
    if (this.gridster.mobile) {
      this.clearCellPosition(renderer, el);
      if (this.gridster.$options.keepFixedHeightInMobile) {
        renderer.setStyle(el, 'height', (item.rows * this.gridster.$options.fixedRowHeight) + 'px');
      } else {
        renderer.setStyle(el, 'height', (item.rows * this.gridster.curWidth / item.cols) + 'px');
      }
      if (this.gridster.$options.keepFixedWidthInMobile) {
        renderer.setStyle(el, 'width', this.gridster.$options.fixedColWidth + 'px');
      } else {
        renderer.setStyle(el, 'width', '');
      }

      renderer.setStyle(el, 'margin-bottom', this.gridster.$options.margin + 'px');
      renderer.setStyle(el, 'margin-right', '');
    } else {
      const x = Math.round(this.gridster.curColWidth * item.x);
      const y = Math.round(this.gridster.curRowHeight * item.y);
      const width = this.gridster.curColWidth * item.cols - this.gridster.$options.margin;
      const height = (this.gridster.curRowHeight * item.rows - this.gridster.$options.margin);
      // set the cell style
      this.setCellPosition(renderer, el, x, y);
      renderer.setStyle(el, 'width', width + 'px');
      renderer.setStyle(el, 'height', height + 'px');
      let marginBottom: string | null = null;
      let marginRight: string | null = null;
      if (this.gridster.$options.outerMargin) {
        if (this.gridster.rows === item.rows + item.y) {
          if (this.gridster.$options.outerMarginBottom !== null) {
            marginBottom = this.gridster.$options.outerMarginBottom + 'px';
          } else {
            marginBottom = this.gridster.$options.margin + 'px';
          }
        }
        if (this.gridster.columns === item.cols + item.x) {
          if (this.gridster.$options.outerMarginBottom !== null) {
            marginRight = this.gridster.$options.outerMarginRight + 'px';
          } else {
            marginRight = this.gridster.$options.margin + 'px';
          }
        }
      }

      renderer.setStyle(el, 'margin-bottom', marginBottom);
      renderer.setStyle(el, 'margin-right', marginRight);
    }
  }

  /**
   * Executes `updateGridster` to handle update gridster.
   * @zh 执行 `updateGridster`，用于更新网格拖拽布局。
   */
  updateGridster() {
    let addClass = '';
    let removeClass1 = '';
    let removeClass2 = '';
    let removeClass3 = '';
    if (this.gridster.$options.gridType === GridType.Fit) {
      addClass = GridType.Fit;
      removeClass1 = GridType.ScrollVertical;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.ScrollVertical) {
      this.gridster.curRowHeight = this.gridster.curColWidth;
      addClass = GridType.ScrollVertical;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.ScrollHorizontal) {
      this.gridster.curColWidth = this.gridster.curRowHeight;
      addClass = GridType.ScrollHorizontal;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.Fixed) {
      this.gridster.curColWidth = this.gridster.$options.fixedColWidth +
        (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
      this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight +
        (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
      addClass = GridType.Fixed;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.ScrollHorizontal;
    } else if (this.gridster.$options.gridType === GridType.VerticalFixed) {
      this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight +
        (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
      addClass = GridType.ScrollVertical;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.HorizontalFixed) {
      this.gridster.curColWidth = this.gridster.$options.fixedColWidth +
        (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
      addClass = GridType.ScrollHorizontal;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.Fixed;
    }

    if (this.gridster.mobile) {
      this.gridster.renderer.removeClass(this.gridster.el, addClass);
    } else {
      this.gridster.renderer.addClass(this.gridster.el, addClass);
    }
    this.gridster.renderer.removeClass(this.gridster.el, removeClass1);
    this.gridster.renderer.removeClass(this.gridster.el, removeClass2);
    this.gridster.renderer.removeClass(this.gridster.el, removeClass3);
  }

  /**
   * Executes `getGridColumnStyle` to handle get grid column style.
   * @zh 执行 `getGridColumnStyle`，用于获取网格表格列样式。
   * @param i - i parameter (`number`) / i参数（`number`）
   */
  getGridColumnStyle(i: number) {
    return {
      ...this.getLeftPosition(this.gridster.curColWidth * i),
      width: this.gridster.curColWidth - this.gridster.$options.margin + 'px',
      height: this.gridster.gridRows.length * this.gridster.curRowHeight - this.gridster.$options.margin + 'px'
    };
  }

  /**
   * Executes `getGridRowStyle` to handle get grid row style.
   * @zh 执行 `getGridRowStyle`，用于获取网格表格行样式。
   * @param i - i parameter (`number`) / i参数（`number`）
   */
  getGridRowStyle(i: number) {
    return {
      ...this.getTopPosition(this.gridster.curRowHeight * i),
      width: this.gridster.gridColumns.length * this.gridster.curColWidth - this.gridster.$options.margin + 'px',
      height: this.gridster.curRowHeight - this.gridster.$options.margin + 'px'
    };
  }

  /**
   * Executes `getLeftPosition` to handle get left position.
   * @zh 执行 `getLeftPosition`，用于获取左侧位置位置。
   * @param d - d parameter (`number`) / d参数（`number`）
   * @returns Result of type `{ left?: string, transform?: string }` / 类型为 `{ left?: string, transform?: string }` 的返回值
   */
  getLeftPosition(d: number): { left?: string, transform?: string } {
    const dPosition = this.gridster.$options.dirType === DirTypes.RTL ? -d : d;
    if (this.gridster.$options.useTransformPositioning) {
      return {
        transform: 'translateX(' + dPosition + 'px)',
      };
    } else {
      return {
        left: (this.getLeftMargin() + dPosition) + 'px'
      };
    }
  }

  /**
   * Executes `getTopPosition` to handle get top position.
   * @zh 执行 `getTopPosition`，用于获取顶部位置位置。
   * @param d - d parameter (`number`) / d参数（`number`）
   * @returns Result of type `{ top?: string, transform?: string }` / 类型为 `{ top?: string, transform?: string }` 的返回值
   */
  getTopPosition(d: number): { top?: string, transform?: string } {
    if (this.gridster.$options.useTransformPositioning) {
      return {
        transform: 'translateY(' + d + 'px)',
      };
    } else {
      return {
        top: this.getTopMargin() + d + 'px'
      };
    }
  }

  /**
   * Executes `clearCellPosition` to handle clear cell position.
   * @zh 执行 `clearCellPosition`，用于清空单元格位置。
   * @param renderer - renderer parameter (`Renderer2`) / 渲染器参数（`Renderer2`）
   * @param el - el parameter (`any`) / DOM元素参数（`any`）
   */
  clearCellPosition(renderer: Renderer2, el): void {
    if (this.gridster.$options.useTransformPositioning) {
      renderer.setStyle(el, 'transform', '');
    } else {
      renderer.setStyle(el, 'top', '');
      renderer.setStyle(el, 'left', '');
    }
  }

  /**
   * Executes `setCellPosition` to handle set cell position.
   * @zh 执行 `setCellPosition`，用于集合单元格位置。
   * @param renderer - renderer parameter (`Renderer2`) / 渲染器参数（`Renderer2`）
   * @param el - el parameter (`any`) / DOM元素参数（`any`）
   * @param x - x parameter (`number`) / X坐标参数（`number`）
   * @param y - y parameter (`number`) / Y坐标参数（`number`）
   */
  setCellPosition(renderer: Renderer2, el, x: number, y: number): void {
    const xPosition = this.gridster.$options.dirType === DirTypes.RTL ? -x : x;
    if (this.gridster.$options.useTransformPositioning) {
      const transform = 'translate3d(' + xPosition + 'px, ' + y + 'px, 0)';
      renderer.setStyle(el, 'transform', transform);
    } else {
      renderer.setStyle(el, 'left', this.getLeftMargin() + xPosition + 'px');
      renderer.setStyle(el, 'top', this.getTopMargin() + y + 'px');
    }
  }

  /**
   * Executes `getLeftMargin` to handle get left margin.
   * @zh 执行 `getLeftMargin`，用于获取左侧位置外边距。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getLeftMargin(): number {
    if (this.gridster.$options.outerMargin) {
      if (this.gridster.$options.outerMarginLeft !== null) {
        return this.gridster.$options.outerMarginLeft;
      } else {
        return this.gridster.$options.margin;
      }
    } else {
      return 0;
    }
  }

  /**
   * Executes `getTopMargin` to handle get top margin.
   * @zh 执行 `getTopMargin`，用于获取顶部位置外边距。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getTopMargin(): number {
    if (this.gridster.$options.outerMargin) {
      if (this.gridster.$options.outerMarginTop !== null) {
        return this.gridster.$options.outerMarginTop;
      } else {
        return this.gridster.$options.margin;
      }
    } else {
      return 0;
    }
  }
}
