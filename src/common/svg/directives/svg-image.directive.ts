/**
 * @fileoverview Module `src/common/svg/directives/svg-image.directive.ts` providing svg image directive definitions and implementation.
 * @zh 模块文件 `src/common/svg/directives/svg-image.directive.ts`，提供SVG矢量图图像指令相关的定义与实现。
 */


import { Directive, Input, Output, AfterViewChecked, OnDestroy, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { Image } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

/**
 * Angular directive `SvgImageDirective` (selector: 'svg-image') attaching svg image directive behavior to host DOM elements.
 * @zh Angular 指令 `SvgImageDirective`（selector: 'svg-image'），为宿主 DOM 元素附加SVG矢量图图像指令行为。
 */
@Directive({
  selector: 'svg-image'
})
export class SvgImageDirective implements AfterViewChecked, OnDestroy, OnChanges {

  /**
   * Property `_image` (`Image`) storing image.
   * @zh 属性 `_image`（类型：`Image`），用于存储或配置图像。
   */
  private _image: Image;

  /**
   * Input property `imageUrl` (`string`) configuring image url.
   * @zh 输入属性 `imageUrl`（类型：`string`），用于配置图像链接地址。
   */
  @Input() imageUrl: string; // Path to the image for SVG image.
  /**
   * Input property `x` (`number`) configuring x (default: `0`).
   * @zh 输入属性 `x`（类型：`number`），用于配置X坐标（默认值：`0`）。
   */
  @Input() x = 0; // Starting point on x axis.
  /**
   * Input property `y` (`number`) configuring y (default: `0`).
   * @zh 输入属性 `y`（类型：`number`），用于配置Y坐标（默认值：`0`）。
   */
  @Input() y = 0; // Starting point on y axis.
  /**
   * Input property `height` (`number`) configuring height (default: `100`).
   * @zh 输入属性 `height`（类型：`number`），用于配置高度（默认值：`100`）。
   */
  @Input() height = 100; // Height of the image.
  /**
   * Input property `width` (`number`) configuring width (default: `100`).
   * @zh 输入属性 `width`（类型：`number`），用于配置宽度（默认值：`100`）。
   */
  @Input() width = 100; // Width of the image.
  /**
   * Input property `classes` (`string[]`) configuring classes (default: `[]`).
   * @zh 输入属性 `classes`（类型：`string[]`），用于配置类名集合（默认值：`[]`）。
   */
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

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
   * Output event emitter `onInitialize` (`EventEmitter<Image>`) firing when on initialize occurs.
   * @zh 输出事件 `onInitialize`（类型：`EventEmitter<Image>`），当触发当初始化时向外发出事件。
   */
  @Output() onInitialize: EventEmitter<Image> = new EventEmitter();

  /**
   * Creates an instance of `SvgImageDirective` and initializes its dependencies and internal state.
   * @zh 创建 `SvgImageDirective` 实例，并初始化其依赖项与内部状态。
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
    // Check if container is created and no image object is created
    if (this._svgContainer.getContainer() && !this._image) {
      this.createImage();
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._image.remove();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`any`) / 变更集合参数（`any`）
   */
  ngOnChanges(changes): void {
    // Make sure we check it only when image is initialized
    if (this._image) {
      // Update image also in case image url has changed
      if (changes.imageUrl && changes.imageUrl.currentValue !== changes.imageUrl.previousValue) {
        // Update image properties and image itself
        this.updateImage(true);
      } else if (
        (changes.x && changes.x.currentValue !== changes.x.previousValue) ||
        (changes.y && changes.y.currentValue !== changes.y.previousValue) ||
        (changes.width && changes.width.currentValue !== changes.width.previousValue) ||
        (changes.height && changes.height.currentValue !== changes.height.previousValue)
      ) {
        // Update only image properties
        this.updateImage(false);
      }

      // Check if classes were changed
      if (changes.classes && changes.classes.currentValue !== changes.classes.previousValue) {
        // Get classes that needs to be removed
        const classesToRemove = changes.classes.previousValue.filter((previousClass: string) =>
          !changes.classes.currentValue.some((currentClass: string) => currentClass === previousClass)
        );

        // Get classes that needs to be added
        const classesToAdd = changes.classes.currentValue.filter((currentClass: string) =>
          !changes.classes.previousValue.some((previousClass: string) => currentClass === previousClass)
        );

        // Add and remove classes
        this.addRemoveClasses(classesToAdd, classesToRemove);
      }
    }
  }
  /**
   * Executes `updateImage` to handle update image.
   * @zh 执行 `updateImage`，用于更新图像。
   * @param reloadImage - reload image parameter (`boolean`) / 重新加载图像参数（`boolean`）
   */
  private updateImage(reloadImage: boolean): void {
    if (reloadImage) {
      this._image
        .load(this.imageUrl) 
        .size(this.width, this.height) 
        .move(this.x, this.y); 
    } else { 
      this._image
        .size(this.width, this.height) 
        .move(this.x, this.y); 
    }
    this.setCorrectPosition();
  }
  /**
   * Executes `createImage` to handle create image.
   * @zh 执行 `createImage`，用于创建图像。
   */
  private createImage(): void {
    this._image = this._svgContainer.getContainer()
      .image() 
      .load(this.imageUrl) 
      .size(this.width, this.height) 
      .move(this.x, this.y) 
      .on('click', (evt: MouseEvent) => this.clickEvent.emit(evt))
      .on('dblclick', (evt: MouseEvent) => this.doubleClickEvent.emit(evt))
      .on('mouseover', (evt: MouseEvent) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: MouseEvent) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._image);
  }

  /**
   * Executes `setCorrectPosition` to handle set correct position.
   * @zh 执行 `setCorrectPosition`，用于集合Correct位置。
   */
  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._image.position() !== position) {
      this._image.insertBefore(this._svgContainer.getContainer().get(position));
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
      this._image
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._image
        .addClass(classToAdd);
    }
  }
}
