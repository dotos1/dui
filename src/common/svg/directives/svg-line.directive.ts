/**
 * @fileoverview Module `src/common/svg/directives/svg-line.directive.ts` providing svg line directive definitions and implementation.
 * @zh 模块文件 `src/common/svg/directives/svg-line.directive.ts`，提供SVG矢量图线段指令相关的定义与实现。
 */


import { Directive, Input, Output, AfterViewChecked, OnDestroy, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { Line } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

/**
 * Angular directive `SvgLineDirective` (selector: 'svg-line') attaching svg line directive behavior to host DOM elements.
 * @zh Angular 指令 `SvgLineDirective`（selector: 'svg-line'），为宿主 DOM 元素附加SVG矢量图线段指令行为。
 */
@Directive({
  selector: 'svg-line'
})
export class SvgLineDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Property `_line` (`Line`) storing line.
   * @zh 属性 `_line`（类型：`Line`），用于存储或配置线段。
   */
  private _line: Line;
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
   * Input property `x0` (`number`) configuring x0 (default: `0`).
   * @zh 输入属性 `x0`（类型：`number`），用于配置x0（默认值：`0`）。
   */
  @Input() x0 = 0; 
  /**
   * Input property `y0` (`number`) configuring y0 (default: `0`).
   * @zh 输入属性 `y0`（类型：`number`），用于配置y0（默认值：`0`）。
   */
  @Input() y0 = 0; 
  /**
   * Input property `x1` (`number`) configuring x1 (default: `1`).
   * @zh 输入属性 `x1`（类型：`number`），用于配置x1（默认值：`1`）。
   */
  @Input() x1 = 1; 
  /**
   * Input property `y1` (`number`) configuring y1 (default: `1`).
   * @zh 输入属性 `y1`（类型：`number`），用于配置y1（默认值：`1`）。
   */
  @Input() y1 = 1; 
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
   * Output event emitter `onInitialize` (`EventEmitter<Line>`) firing when on initialize occurs.
   * @zh 输出事件 `onInitialize`（类型：`EventEmitter<Line>`），当触发当初始化时向外发出事件。
   */
  @Output() onInitialize: EventEmitter<Line> = new EventEmitter();

  /**
   * Creates an instance of `SvgLineDirective` and initializes its dependencies and internal state.
   * @zh 创建 `SvgLineDirective` 实例，并初始化其依赖项与内部状态。
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
    if (this._svgContainer.getContainer() && !this._line) {
      this.createLine();
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._line.remove();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`any`) / 变更集合参数（`any`）
   */
  ngOnChanges(changes): void {
    if (this._line) {
      this.updateLine();
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
   * Executes `updateLine` to handle update line.
   * @zh 执行 `updateLine`，用于更新线段。
   */
  private updateLine(): void {
    this._line
      .plot(this.x0, this.y0, this.x1, this.y1) 
      .stroke({ color: this.borderColor, width: this.borderSize }); 
    this.setCorrectPosition();
  }
  /**
   * Executes `createLine` to handle create line.
   * @zh 执行 `createLine`，用于创建线段。
   */
  private createLine(): void {
    this._line = this._svgContainer.getContainer()
      .line(this.x0, this.y0, this.x1, this.y1)
      .stroke({ color: this.borderColor, width: this.borderSize }) 
      .on('click', (evt: MouseEvent) => this.clickEvent.emit(evt)) 
      .on('dblclick', (evt: MouseEvent) => this.doubleClickEvent.emit(evt)) 
      .on('mouseover', (evt: MouseEvent) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: MouseEvent) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._line);
  }
  /**
   * Executes `setCorrectPosition` to handle set correct position.
   * @zh 执行 `setCorrectPosition`，用于集合Correct位置。
   */
  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._line.position() !== position) {
      this._line.insertBefore(this._svgContainer.getContainer().get(position));
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
      this._line
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._line
        .addClass(classToAdd);
    }
  }
}
