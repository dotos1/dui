/**
 * @fileoverview Module `src/common/dragselect/select-item.directive.ts` providing select item directive definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/select-item.directive.ts`，提供下拉选择条目指令相关的定义与实现。
 */

import { isPlatformBrowser } from '@angular/common';

import {
  Directive,
  DoCheck,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
  Renderer2,
  OnInit,
  HostBinding
} from '@angular/core';

import { DragToSelectConfig, BoundingBox } from './models';
import { CONFIG } from './tokens';
import { calculateBoundingClientRect } from './utils';

/**
 * Constant/variable `SELECT_ITEM_INSTANCE` defining select item instance in `src/common/dragselect`.
 * @zh 常量/变量 `SELECT_ITEM_INSTANCE`，定义 `src/common/dragselect` 中的下拉选择条目实例。
 */
export const SELECT_ITEM_INSTANCE = Symbol();

/**
 * Marks an element as selectable within a parent {@link SelectContainerComponent}.
 * @zh 将元素标记为父级 {@link SelectContainerComponent} 中可被框选的项。
 */
@Directive({
  selector: '[dtsSelectItem]',
  exportAs: 'dtsSelectItem',
  host: {
    class: 'dts-select-item'
  },
  standalone: false
})
export class SelectItemDirective implements OnInit, DoCheck {
  /**
   * Property `_boundingClientRect` (`BoundingBox`) storing bounding client rect.
   * @zh 属性 `_boundingClientRect`（类型：`BoundingBox`），用于存储或配置包围边界Client矩形。
   */
  private _boundingClientRect: BoundingBox | undefined;

  /**
   * Whether this item is currently selected (kept in sync with the `config.selectedClass` host class).
   * @zh 该条目当前是否被选中（与宿主的 `config.selectedClass` 类名保持同步）。
   */
  selected = false;

  /**
   * Host binding `rangeStart` bound to host attribute/property `class.dts-range-start` for range start.
   * @zh 该条目当前是否作为范围选择的起点。
   * @zh 该条目当前是否作为范围选择的起点。
   */
  @HostBinding('class.dts-range-start') rangeStart = false;

  /**
   * Host binding `hostClass` bound to host attribute/property `class.dts-select-item` for host class.
   * @zh 内部使用，始终为 `true`，用于绑定 `dts-select-item` 宿主类名。
   * @zh 内部使用，始终为 `true`，用于绑定 `dts-select-item` 宿主类名。
   */
    @HostBinding('class.dts-select-item')
  readonly hostClass = true;
  /**
   * The value reported for this item when selected/deselected; defaults to the directive
   * instance itself if not provided.
   * @zh 该条目被选中/取消选中时上报的值；未提供时默认为指令实例本身。
   */
  @Input() dtsSelectItem;

  /**
   * Input property `dtsDisabled` (`boolean`) configuring dts disabled (default: `false`).
   * @zh 是否禁用该条目的选择（禁用时它不参与选择容器的框选/点击逻辑）。
   * @zh 是否禁用该条目的选择（禁用时它不参与选择容器的框选/点击逻辑）。
   */
    @Input()
  @HostBinding('class.dts-disabled')
  dtsDisabled = false;

  /**
   * The effective value used to represent this item (`dtsSelectItem` if provided, else the
   * directive instance itself).
   * @zh 用于代表该条目的有效值（若提供了 `dtsSelectItem` 则为其值，否则为指令实例本身）。
   */
  get value() {
    return this.dtsSelectItem != null ? this.dtsSelectItem : this;
  }

  /**
   * Creates an instance of `SelectItemDirective` and initializes its dependencies and internal state.
   * @zh 创建 `SelectItemDirective` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`DragToSelectConfig`) / 注入或传入的配置（`DragToSelectConfig`）
   * @param platformId - Injected or initial platform id (`Object`) / 注入或传入的platform唯一标识（`Object`）
   * @param host - Injected or initial host (`ElementRef<any>`) / 注入或传入的宿主（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(
    @Inject(CONFIG) private config: DragToSelectConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private host: ElementRef,
    private renderer: Renderer2
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.nativeElememnt[SELECT_ITEM_INSTANCE] = this;
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck() {
    this.applySelectedClass();
  }

  /**
   * Toggles whether this item is the current range-selection start.
   * @zh 切换该条目是否作为当前范围选择的起点。
   */
  toggleRangeStart() {
    this.rangeStart = !this.rangeStart;
  }

  /**
   * The host native element.
   * @zh 宿主原生元素。
   */
  get nativeElememnt() {
    return this.host.nativeElement;
  }

  /**
   * Returns this item's cached bounding client rect, computing it first if not yet cached.
   * @zh 返回该条目缓存的边界矩形，若尚未缓存则先计算。
   */
  getBoundingClientRect() {
    if (isPlatformBrowser(this.platformId) && !this._boundingClientRect) {
      this.calculateBoundingClientRect();
    }
    return this._boundingClientRect;
  }

  /**
   * Recalculates and caches this item's bounding client rect.
   * @zh 重新计算并缓存该条目的边界矩形。
   */
  calculateBoundingClientRect() {
    const boundingBox = calculateBoundingClientRect(this.host.nativeElement);
    this._boundingClientRect = boundingBox;
    return boundingBox;
  }

  /**
   * Executes `_select` to handle select.
   * @zh 执行 `_select`，用于下拉选择。
   */
  _select() {
    this.selected = true;
  }

  /**
   * Executes `_deselect` to handle deselect.
   * @zh 执行 `_deselect`，用于取消选中。
   */
  _deselect() {
    this.selected = false;
  }

  /**
   * Executes `applySelectedClass` to handle apply selected class.
   * @zh 执行 `applySelectedClass`，用于应用已选中类名。
   */
  private applySelectedClass() {

    if (this.selected) {
      this.renderer.addClass(this.host.nativeElement, this.config.selectedClass);
    } else {
      this.renderer.removeClass(this.host.nativeElement, this.config.selectedClass);
    }
  }
}
