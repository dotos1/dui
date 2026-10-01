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
  }
})
export class SelectItemDirective implements OnInit, DoCheck {
  private _boundingClientRect: BoundingBox | undefined;

  /**
   * Whether this item is currently selected (kept in sync with the `config.selectedClass` host class).
   * @zh 该条目当前是否被选中（与宿主的 `config.selectedClass` 类名保持同步）。
   */
  selected = false;

  /** @zh 该条目当前是否作为范围选择的起点。 */
  @HostBinding('class.dts-range-start') rangeStart = false;

  /** @zh 内部使用，始终为 `true`，用于绑定 `dts-select-item` 宿主类名。 */
    @HostBinding('class.dts-select-item')
  readonly hostClass = true;
  /**
   * The value reported for this item when selected/deselected; defaults to the directive
   * instance itself if not provided.
   * @zh 该条目被选中/取消选中时上报的值；未提供时默认为指令实例本身。
   */
  @Input() dtsSelectItem: any | undefined;

  /** @zh 是否禁用该条目的选择（禁用时它不参与选择容器的框选/点击逻辑）。 */
    @Input()
  @HostBinding('class.dts-disabled')
  dtsDisabled = false;

  /**
   * The effective value used to represent this item (`dtsSelectItem` if provided, else the
   * directive instance itself).
   * @zh 用于代表该条目的有效值（若提供了 `dtsSelectItem` 则为其值，否则为指令实例本身）。
   */
  get value(): SelectItemDirective | any {
    return this.dtsSelectItem != null ? this.dtsSelectItem : this;
  }

  constructor(
    @Inject(CONFIG) private config: DragToSelectConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private host: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.nativeElememnt[SELECT_ITEM_INSTANCE] = this;
  }

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

  _select() {
    this.selected = true;
  }

  _deselect() {
    this.selected = false;
  }

  private applySelectedClass() {

    if (this.selected) {
      this.renderer.addClass(this.host.nativeElement, this.config.selectedClass);
    } else {
      this.renderer.removeClass(this.host.nativeElement, this.config.selectedClass);
    }
  }
}
