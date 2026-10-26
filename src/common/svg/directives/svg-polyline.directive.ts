/**
 * @fileoverview Module `src/common/svg/directives/svg-polyline.directive.ts` providing svg polyline directive definitions and implementation.
 * @zh 模块文件 `src/common/svg/directives/svg-polyline.directive.ts`，提供SVG矢量图折线指令相关的定义与实现。
 */


import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, ElementRef } from '@angular/core';
import { Polyline, PointArrayAlias } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

/**
 * Angular directive `SvgPolylineDirective` (selector: 'svg-polyline') attaching svg polyline directive behavior to host DOM elements.
 * @zh Angular 指令 `SvgPolylineDirective`（selector: 'svg-polyline'），为宿主 DOM 元素附加SVG矢量图折线指令行为。
 */
@Directive({
  selector: 'svg-polyline'
})
export class SvgPolylineDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Property `_polyline` (`Polyline`) storing polyline.
   * @zh 属性 `_polyline`（类型：`Polyline`），用于存储或配置折线。
   */
  private _polyline: Polyline;
  /**
   * Input property `points` (`PointArrayAlias`) configuring points.
   * @zh 输入属性 `points`（类型：`PointArrayAlias`），用于配置点集合。
   */
  @Input() points: PointArrayAlias; 
  /**
   * Input property `borderSize` (`number`) configuring border size.
   * @zh 输入属性 `borderSize`（类型：`number`），用于配置边框尺寸。
   */
  @Input() borderSize: number; 
  /**
   * Input property `borderColor` (`string`) configuring border color (default: `'#000'`).
   * @zh 输入属性 `borderColor`（类型：`string`），用于配置边框颜色（默认值：`'#000'`）。
   */
  @Input() borderColor = '#000'; 
  /**
   * Input property `fill` (`string`) configuring fill (default: `'#000'`).
   * @zh 输入属性 `fill`（类型：`string`），用于配置填充（默认值：`'#000'`）。
   */
  @Input() fill = '#000';
  /**
   * Input property `classes` (`string[]`) configuring classes (default: `[]`).
   * @zh 输入属性 `classes`（类型：`string[]`），用于配置类名集合（默认值：`[]`）。
   */
  @Input() classes: string[] = [];
  /**
   * Output event emitter `clickEvent` (`EventEmitter<MouseEvent>`) firing when click event occurs.
   * @zh 输出事件 `clickEvent`（类型：`EventEmitter<MouseEvent>`），当触发点击事件时向外发出事件。
   */
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  /**
   * Output event emitter `doubleClickEvent` (`EventEmitter<MouseEvent>`) firing when double click event occurs.
   * @zh 输出事件 `doubleClickEvent`（类型：`EventEmitter<MouseEvent>`），当触发双倍点击事件时向外发出事件。
   */
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  /**
   * Output event emitter `mouseOverEvent` (`EventEmitter<MouseEvent>`) firing when mouse over event occurs.
   * @zh 输出事件 `mouseOverEvent`（类型：`EventEmitter<MouseEvent>`），当触发鼠标越过事件时向外发出事件。
   */
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  /**
   * Output event emitter `mouseOutEvent` (`EventEmitter<MouseEvent>`) firing when mouse out event occurs.
   * @zh 输出事件 `mouseOutEvent`（类型：`EventEmitter<MouseEvent>`），当触发鼠标输出事件时向外发出事件。
   */
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  /**
   * Output event emitter `onInitialize` (`EventEmitter<Polyline>`) firing when on initialize occurs.
   * @zh 输出事件 `onInitialize`（类型：`EventEmitter<Polyline>`），当触发当初始化时向外发出事件。
   */
  @Output() onInitialize: EventEmitter<Polyline> = new EventEmitter();

  /**
   * Creates an instance of `SvgPolylineDirective` and initializes its dependencies and internal state.
   * @zh 创建 `SvgPolylineDirective` 实例，并初始化其依赖项与内部状态。
   * @param _svgContainer - Injected or initial svg container (`SvgContainerComponent`) / 注入或传入的SVG矢量图容器（`SvgContainerComponent`）
   * @param _elRef - Injected or initial el ref (`ElementRef`) / 注入或传入的DOM元素引用（`ElementRef`）
   */
  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }
  /**
   * Angular lifecycle hook invoked after every check of the component's view and child views.
   * @zh Angular 生命周期钩子：在每次检查完组件视图及其子视图后调用。
   */
  ngAfterViewChecked(): void {
    if (this._svgContainer.getContainer() && !this._polyline) {
      this.createPolyline();
    }
  }
  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._polyline.remove();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`any`) / 变更集合参数（`any`）
   */
  ngOnChanges(changes): void {
    if (this._polyline) {
      this.updatePolyline();
      if (changes.classes && changes.classes.currentValue !== changes.classes.previousValue) {
        const classesToRemove = changes.classes.previousValue.filter((previousClass: string) =>
          !changes.classes.currentValue.some((currentClass: string) => currentClass === previousClass)
        );
        const classesToAdd = changes.classes.currentValue.filter((currentClass: string) =>
          !changes.classes.previousValue.some((previousClass: string) => currentClass === previousClass)
        );
        this.addRemoveClasses(classesToAdd, classesToRemove);
      }
    }
  }
  /**
   * Executes `updatePolyline` to handle update polyline.
   * @zh 执行 `updatePolyline`，用于更新折线。
   */
  private updatePolyline(): void {
    this._polyline
      .plot(this.points) 
      .fill(this.fill) 
      .stroke({ color: this.borderColor, width: this.borderSize }); 
    this.setCorrectPosition();
  }

  /**
   * Executes `createPolyline` to handle create polyline.
   * @zh 执行 `createPolyline`，用于创建折线。
   */
  private createPolyline(): void {
    this._polyline = this._svgContainer.getContainer()
      .polyline(this.points) 
      .fill(this.fill) 
      .stroke({ color: this.borderColor, width: this.borderSize }) 
      .on('click', (evt: MouseEvent) => this.clickEvent.emit(evt)) 
      .on('dblclick', (evt: MouseEvent) => this.doubleClickEvent.emit(evt)) 
      .on('mouseover', (evt: MouseEvent) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: MouseEvent) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._polyline);
  }
  /**
   * Executes `setCorrectPosition` to handle set correct position.
   * @zh 执行 `setCorrectPosition`，用于集合Correct位置。
   */
  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._polyline.position() !== position) {
      this._polyline.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }
  /**
   * Executes `addRemoveClasses` to handle add remove classes.
   * @zh 执行 `addRemoveClasses`，用于添加移除类名集合。
   * @param classesToAdd - classes to add parameter (`string[]`) / 类名集合转换为添加参数（`string[]`）
   * @param classesToRemove - classes to remove parameter (`string[]`) / 类名集合转换为移除参数（`string[]`）
   */
  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._polyline
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._polyline
        .addClass(classToAdd);
    }
  }
}
