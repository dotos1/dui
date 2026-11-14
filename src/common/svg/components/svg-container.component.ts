/**
 * @fileoverview Module `src/common/svg/components/svg-container.component.ts` providing svg container component definitions and implementation.
 * @zh 模块文件 `src/common/svg/components/svg-container.component.ts`，提供SVG矢量图容器组件相关的定义与实现。
 */


import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';

import { SVG, Container, Pattern, Rect } from '@svgdotjs/svg.js';

/**
 * Angular component `SvgContainerComponent` (selector: 'svg-container') providing svg container component presentation and interaction in `src/common/svg/components`.
 * @zh Angular 组件 `SvgContainerComponent`（selector: 'svg-container'），提供SVG矢量图容器组件的视图渲染与交互逻辑（位于 `src/common/svg/components`）。
 */
@Component({
  selector: 'svg-container',
  templateUrl: 'svg-container.component.html',
  styleUrls: ['./svg-container.component.scss'],
  standalone: false
})
export class SvgContainerComponent implements AfterViewInit, OnChanges {
  /**
   * Property `pointXCoordinate` (`number`) storing point x coordinate.
   * @zh 属性 `pointXCoordinate`（类型：`number`），用于存储或配置坐标点X坐标坐标。
   */
  public pointXCoordinate: number;
  /**
   * Property `pointYCoordinate` (`number`) storing point y coordinate.
   * @zh 属性 `pointYCoordinate`（类型：`number`），用于存储或配置坐标点Y坐标坐标。
   */
  public pointYCoordinate: number;
  /**
   * Property `mouseInContainer` (`boolean`) storing mouse in container (default: `false`).
   * @zh 属性 `mouseInContainer`（类型：`boolean`），用于存储或配置鼠标在容器（默认值：`false`）。
   */
  public mouseInContainer = false;
  /**
   * Property `_svg` (`Container`) storing svg.
   * @zh 属性 `_svg`（类型：`Container`），用于存储或配置SVG矢量图。
   */
  private _svg: Container;
  /**
   * Property `_grid` (`Rect`) storing grid.
   * @zh 属性 `_grid`（类型：`Rect`），用于存储或配置网格表格。
   */
  private _grid: Rect;
  /**
   * Property `_pattern` (`Pattern`) storing pattern.
   * @zh 属性 `_pattern`（类型：`Pattern`），用于存储或配置模式/图案。
   */
  private _pattern: Pattern;
  /**
   * Property `_triggerCoordinateChange` (`boolean`) storing trigger coordinate change (default: `false`).
   * @zh 属性 `_triggerCoordinateChange`（类型：`boolean`），用于存储或配置触发坐标变更（默认值：`false`）。
   */
  private _triggerCoordinateChange = false;
  /**
   * Property `_singleClickHappened` (`boolean`) storing single click happened.
   * @zh 属性 `_singleClickHappened`（类型：`boolean`），用于存储或配置单个点击Happened。
   */
  private _singleClickHappened: boolean;

  /**
   * Input property `containerId` (`string`) configuring container id.
   * @zh 输入属性 `containerId`（类型：`string`），用于配置容器唯一标识。
   */
  @Input() public containerId: string; // Container id which will be used to create the container.
  /**
   * Input property `height` (`number`) configuring height (default: `200`).
   * @zh 输入属性 `height`（类型：`number`），用于配置高度（默认值：`200`）。
   */
  @Input() public height = 200; // Height of the container.
  /**
   * Input property `showGrid` (`boolean`) configuring show grid (default: `false`).
   * @zh 输入属性 `showGrid`（类型：`boolean`），用于配置显示网格表格（默认值：`false`）。
   */
  @Input() public showGrid = false; // Indicator if grid image should be shown in the background of svg container.
  /**
   * Input property `grid` (`{ width: number; height: number; strokeColor: string; }`) configuring grid.
   * @zh 输入属性 `grid`（类型：`{ width: number; height: number; strokeColor: string; }`），用于配置网格表格。
   */
  @Input() public grid: {
    width: number;
    height: number;
    strokeColor: string;
  } = {
    width: 10,
    height: 10,
    strokeColor: 'black'
  }; 
  /**
   * Input property `hoverable` (`boolean`) configuring hoverable (default: `false`).
   * @zh 输入属性 `hoverable`（类型：`boolean`），用于配置hoverable（默认值：`false`）。
   */
  @Input() public hoverable = false;
  /**
   * Input property `pointSize` (`number`) configuring point size (default: `10`).
   * @zh 输入属性 `pointSize`（类型：`number`），用于配置坐标点尺寸（默认值：`10`）。
   */
  @Input() public pointSize = 10; 
  /**
   * Input property `viewBox` (`number[]`) configuring view box (default: `[]`).
   * @zh 输入属性 `viewBox`（类型：`number[]`），用于配置视图盒子容器（默认值：`[]`）。
   */
  @Input() public viewBox: number[] = []; // Viewbox of the container, must be an array consisting of 4 integers [x, y, width, height].

  /**
   * Output event emitter `clickEvent` (`EventEmitter<{ x: number; y: number; }>`) firing when click event occurs.
   * @zh 输出事件 `clickEvent`（类型：`EventEmitter<{ x: number; y: number; }>`），当触发点击事件时向外发出事件。
   */
  @Output() public clickEvent: EventEmitter<{ x: number, y: number }>
    = new EventEmitter(); // Event handler for retrieving coordinates at clicked position
  /**
   * Output event emitter `doubleClickEvent` (`EventEmitter<{ x: number; y: number; }>`) firing when double click event occurs.
   * @zh 输出事件 `doubleClickEvent`（类型：`EventEmitter<{ x: number; y: number; }>`），当触发双倍点击事件时向外发出事件。
   */
  @Output() public doubleClickEvent: EventEmitter<{ x: number, y: number }>
    = new EventEmitter(); // Event handler for retrieving coordinates at position where you double-click.
  /**
   * Output event emitter `mouseOverEvent` (`EventEmitter<MouseEvent>`) firing when mouse over event occurs.
   * @zh 输出事件 `mouseOverEvent`（类型：`EventEmitter<MouseEvent>`），当触发鼠标越过事件时向外发出事件。
   */
  @Output() public mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter(); // Event handler when mouse is moved over the container.
  /**
   * Output event emitter `mouseOutEvent` (`EventEmitter<MouseEvent>`) firing when mouse out event occurs.
   * @zh 输出事件 `mouseOutEvent`（类型：`EventEmitter<MouseEvent>`），当触发鼠标输出事件时向外发出事件。
   */
  @Output() public mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter(); // Event handler when the mouse exits the container.
  /**
   * Output event emitter `mouseMoveEvent` (`EventEmitter<{ x: number; y: number; }>`) firing when mouse move event occurs.
   * @zh 输出事件 `mouseMoveEvent`（类型：`EventEmitter<{ x: number; y: number; }>`），当触发鼠标移动事件时向外发出事件。
   */
  @Output() public mouseMoveEvent: EventEmitter<{ x: number, y: number }> = new EventEmitter();
    // Event handler when the mouse is being moved on the container.
  /**
   * Output event emitter `onInitialize` (`EventEmitter<Container>`) firing when on initialize occurs.
   * @zh 输出事件 `onInitialize`（类型：`EventEmitter<Container>`），当触发当初始化时向外发出事件。
   */
  @Output() public onInitialize: EventEmitter<Container> = new EventEmitter();

  /**
   * Create SVG Container component instance.
   * @param cdRef - Change Detector Ref object instance.

   * @zh 创建 `SvgContainerComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`any`) / 变更集合参数（`any`）
   */
  ngOnChanges(changes): void {
    if (this._svg) {
      if (changes.viewBox && changes.viewBox.currentValue !== changes.viewBox.previousValue) {
        this.viewBox = changes.viewBox.currentValue;
        this.updateViewbox();
      }
      if (changes.height && changes.height.currentValue !== changes.height.previousValue) {
        this.height = changes.height.currentValue;
        this._svg.size('100%', this.height);
      }
      if (changes.showGrid || changes.grid) {
        this.grid = changes.grid ? changes.grid.currentValue : this.grid;
        this.showGrid = changes.showGrid ? changes.showGrid.currentValue : this.showGrid;
        this.setGridPattern();
      }
      if (
        changes.hoverable && changes.hoverable.currentValue !== changes.hoverable.previousValue ||
        changes.pointSize && changes.pointSize.currentValue !== changes.pointSize.previousValue
      ) {
        this.hoverable = changes.hoverable ? changes.hoverable.currentValue : this.hoverable;
        this.pointSize = changes.pointSize ? changes.pointSize.currentValue : this.pointSize;
        this.cdRef.detectChanges();
      }
    }
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    this.setContainer(this.containerId);
  }
  /**
   * Executes `getContainer` to handle get container.
   * @zh 执行 `getContainer`，用于获取容器。
   * @returns Result of type `Container` / 类型为 `Container` 的返回值
   */
  getContainer(): Container {
    return this._svg;
  }
  /**
   * Executes `adjustPointPosition` to handle adjust point position.
   * @zh 执行 `adjustPointPosition`，用于调整坐标点位置。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  adjustPointPosition(event: MouseEvent): void {
    if (!this.hoverable) {
      return;
    }
    if (this._triggerCoordinateChange) {
      this.pointXCoordinate = event.offsetX - this.pointSize / 2;
      this.pointYCoordinate = event.offsetY - this.pointSize / 2;
    }
    this._triggerCoordinateChange = true;
  }
  /**
   * Executes `adjustMouseMovePosition` to handle adjust mouse move position.
   * @zh 执行 `adjustMouseMovePosition`，用于调整鼠标移动位置。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  adjustMouseMovePosition(event: MouseEvent): void {
    if (this.hoverable && this._triggerCoordinateChange) {
      this.mouseMoveEvent.emit({
        x: this.pointXCoordinate + this.pointSize / 2,
        y: this.pointYCoordinate + this.pointSize / 2
      });
    } else if (!this.hoverable) {
      this.mouseMoveEvent.emit({
        x: event.offsetX,
        y: event.offsetY
      });
    }
  }
  /**
   * Executes `onPointClick` to handle on point click.
   * @zh 执行 `onPointClick`，用于当坐标点点击。
   */
  onPointClick(): void {
    this._singleClickHappened = true;
    const x = this.pointXCoordinate + this.pointSize / 2;
    const y = this.pointYCoordinate + this.pointSize / 2;
    setTimeout(() => {
      if (this._singleClickHappened) {
        this.clickEvent.emit({ x, y });
      }
    }, 250);
  }
  /**
   * Executes `onPointDoubleClick` to handle on point double click.
   * @zh 执行 `onPointDoubleClick`，用于当坐标点双倍点击。
   */
  onPointDoubleClick(): void {
    this.doubleClickEvent.emit({
      x: this.pointXCoordinate + this.pointSize / 2,
      y: this.pointYCoordinate + this.pointSize / 2
    });
    this._singleClickHappened = false;
  }
  /**
   * Executes `onPointHover` to handle on point hover.
   * @zh 执行 `onPointHover`，用于当坐标点Hover。
   */
  onPointHover(): void {
    this._triggerCoordinateChange = false;
  }
  /**
   * Executes `updateViewbox` to handle update viewbox.
   * @zh 执行 `updateViewbox`，用于更新Viewbox。
   */
  private updateViewbox(): void {
    if (this.viewBox.length === 4) {
      this._svg.viewbox(this.viewBox[0], this.viewBox[1], this.viewBox[2], this.viewBox[3]);
    } else {
      this._svg.viewbox();
    }
  }

  /**
   * Executes `setContainer` to handle set container.
   * @zh 执行 `setContainer`，用于集合容器。
   * @param id - id parameter (`string`) / 唯一标识参数（`string`）
   */
  private setContainer(id: string): void {
    if (this.viewBox && this.viewBox.length === 4) {
      this._svg = SVG()
        .addTo(`#${id}`)
        .size('100%', this.height)
        .viewbox(this.viewBox[0], this.viewBox[1], this.viewBox[2], this.viewBox[3]);
    } else {
      this._svg = SVG()
        .addTo(`#${id}`)
        .size('100%', this.height);
    }
    if (this.showGrid) {
      this.setGridPattern();
    }
    this.onInitialize.emit(this._svg);
  }

  /**
   * Does all required pre-requisites and initializes or updates grid pattern.

   * @zh 执行 `setGridPattern`，用于集合网格表格模式/图案。
   */
  private setGridPattern(): void {
    // Let's remove old pattern if we have created one
    if (this._pattern) {
      this._pattern.remove();
    }

    // Let's remove old grid if we have created one
    if (this._grid) {
      this._grid.remove();
    }

    // Let's check if we want to show grid
    if (this.showGrid) {
      // Let's create the pattern
      this._pattern = this._svg
        .pattern(
          this.grid.width,
          this.grid.height,
          (addedPattern: Pattern) => {
            addedPattern
              .rect(this.grid.width, this.grid.height)
              .fill('transparent')
              .stroke(this.grid.strokeColor);
          }
        );
      this._grid = this._svg
        .rect()
        .size('100%', '100%')
        .fill(this._pattern);
    }
  }
}
