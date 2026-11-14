/**
 * @fileoverview Module `src/common/svg/directives/svg-ellipse.directive.ts` providing svg ellipse directive definitions and implementation.
 * @zh 模块文件 `src/common/svg/directives/svg-ellipse.directive.ts`，提供SVG矢量图椭圆指令相关的定义与实现。
 */


import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, ElementRef } from '@angular/core';
import { Ellipse } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

/**
 * Angular directive `SvgEllipseDirective` (selector: 'svg-ellipse') attaching svg ellipse directive behavior to host DOM elements.
 * @zh Angular 指令 `SvgEllipseDirective`（selector: 'svg-ellipse'），为宿主 DOM 元素附加SVG矢量图椭圆指令行为。
 */
@Directive({
  selector: 'svg-ellipse',
  standalone: false
})
export class SvgEllipseDirective implements AfterViewChecked, OnChanges, OnDestroy {

  /**
   * Property `_ellipse` (`Ellipse`) storing ellipse.
   * @zh 属性 `_ellipse`（类型：`Ellipse`），用于存储或配置椭圆。
   */
  private _ellipse: Ellipse;

  /**
   * Input property `height` (`number`) configuring height.
   * @zh 输入属性 `height`（类型：`number`），用于配置高度。
   */
  @Input() height: number; 
  /**
   * Input property `width` (`number`) configuring width.
   * @zh 输入属性 `width`（类型：`number`），用于配置宽度。
   */
  @Input() width: number; 
  /**
   * Input property `color` (`string`) configuring color (default: `'#000'`).
   * @zh 输入属性 `color`（类型：`string`），用于配置颜色（默认值：`'#000'`）。
   */
  @Input() color = '#000';
  /**
   * Input property `x` (`number`) configuring x (default: `0`).
   * @zh 输入属性 `x`（类型：`number`），用于配置X坐标（默认值：`0`）。
   */
  @Input() x = 0; 
  /**
   * Input property `y` (`number`) configuring y (default: `0`).
   * @zh 输入属性 `y`（类型：`number`），用于配置Y坐标（默认值：`0`）。
   */
  @Input() y = 0; 
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
   * Output event emitter `onInitialize` (`EventEmitter<Ellipse>`) firing when on initialize occurs.
   * @zh 输出事件 `onInitialize`（类型：`EventEmitter<Ellipse>`），当触发当初始化时向外发出事件。
   */
  @Output() onInitialize: EventEmitter<Ellipse> = new EventEmitter();

  /**
   * Creates an instance of `SvgEllipseDirective` and initializes its dependencies and internal state.
   * @zh 创建 `SvgEllipseDirective` 实例，并初始化其依赖项与内部状态。
   * @param _svgContainer - Injected or initial svg container (`SvgContainerComponent`) / 注入或传入的SVG矢量图容器（`SvgContainerComponent`）
   * @param _elRef - Injected or initial el ref (`ElementRef<any>`) / 注入或传入的DOM元素引用（`ElementRef<any>`）
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
    if (this._svgContainer.getContainer() && !this._ellipse) {
      this.createEllipse();
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._ellipse.remove();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`any`) / 变更集合参数（`any`）
   */
  ngOnChanges(changes): void {
    if (this._ellipse) {
      this.updateEllipse();
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
   * Executes `updateEllipse` to handle update ellipse.
   * @zh 执行 `updateEllipse`，用于更新椭圆。
   */
  private updateEllipse(): void {
    this._ellipse
      .size(this.width, this.height)
      .fill(this.color) 
      .attr('cx', +this.x + +this.width / 2) 
      .attr('cy', +this.y + +this.height / 2); 
    this.setCorrectPosition();
  }

  /**
   * Executes `createEllipse` to handle create ellipse.
   * @zh 执行 `createEllipse`，用于创建椭圆。
   */
  private createEllipse(): void {
    this._ellipse = this._svgContainer.getContainer()
      .ellipse(this.width, this.height) 
      .fill(this.color) 
      .attr('cx', +this.x + +this.width / 2) 
      .attr('cy', +this.y + +this.height / 2) 
      .on('click', (evt: MouseEvent) => {
        this.clickEvent.emit(evt);
      })
      .on('dblclick', (evt: MouseEvent) => this.doubleClickEvent.emit(evt))
      .on('mouseover', (evt: MouseEvent) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: MouseEvent) => this.mouseOutEvent.emit(evt));
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._ellipse);
  }

  /**
   * Executes `setCorrectPosition` to handle set correct position.
   * @zh 执行 `setCorrectPosition`，用于集合Correct位置。
   */
  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._ellipse.position() !== position) {
      this._ellipse.insertBefore(this._svgContainer.getContainer().get(position));
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
      this._ellipse
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._ellipse
        .addClass(classToAdd);
    }
  }
}
