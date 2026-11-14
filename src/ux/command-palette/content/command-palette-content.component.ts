/**
 * @fileoverview Module `src/ux/command-palette/content/command-palette-content.component.ts` providing command palette content component definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/content/command-palette-content.component.ts`，提供命令调色板内容组件相关的定义与实现。
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { take, timer } from 'rxjs';
import { CommandItemGroup } from '../model/command-item-group';
import { CommandPaletteScrollCalculator, CommandPaletteScrollParams } from './command-palette-scroll-calculator';

/**
 * Angular component `CommandPaletteContentComponent` (selector: 'command-palette-content') providing command palette content component presentation and interaction in `src/ux/command-palette/content`.
 * @zh Angular 组件 `CommandPaletteContentComponent`（selector: 'command-palette-content'），提供命令调色板内容组件的视图渲染与交互逻辑（位于 `src/ux/command-palette/content`）。
 */
@Component({
  selector: 'command-palette-content',
  templateUrl: './command-palette-content.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  
})
export class CommandPaletteContentComponent implements OnChanges, OnInit, AfterViewInit {

  /**
   * Input property `groups` (`CommandItemGroup[]`) configuring groups (default: `[]`).
   * @zh 输入属性 `groups`（类型：`CommandItemGroup[]`），用于配置分组（默认值：`[]`）。
   */
  @Input()
  groups: CommandItemGroup[] = [];

  /**
   * Input property `selectedItemIndex` (`number`) configuring selected item index (default: `0`).
   * @zh 输入属性 `selectedItemIndex`（类型：`number`），用于配置已选中条目索引（默认值：`0`）。
   */
  @Input()
  selectedItemIndex: number = 0;

  /**
   * Output event emitter `itemVisited$` (`EventEmitter<number>`) firing when item visited occurs.
   * @zh 输出事件 `itemVisited$`（类型：`EventEmitter<number>`），当触发条目已访问时向外发出事件。
   */
  @Output()
  readonly itemVisited$: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Output event emitter `itemClicked$` (`EventEmitter<number>`) firing when item clicked occurs.
   * @zh 输出事件 `itemClicked$`（类型：`EventEmitter<number>`），当触发条目点击时向外发出事件。
   */
  @Output()
  readonly itemClicked$: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Property `disableMouseEnter` (`boolean`) storing disable mouse enter (default: `false`).
   * @zh 属性 `disableMouseEnter`（类型：`boolean`），用于存储或配置禁用鼠标进入（默认值：`false`）。
   */
  private disableMouseEnter: boolean = false;

  /**
   * 搜索时每次按键都会重建 groups，trackBy 让未变化的分组/条目保留原 DOM。
   * @zh 搜索时每次按键都会重建 groups，trackBy 让未变化的分组/条目保留原 DOM。
   */
  trackByGroupTitle = (_index: number, group: CommandItemGroup) => group ? group.title : _index;
  /**
   * Property `trackByItemText` (`(_index: number, item: { text?: any; }) => any`) storing track by item text.
   * @zh 属性 `trackByItemText`（类型：`(_index: number, item: { text?: any; }) => any`），用于存储或配置track按条目文本。
   */
  trackByItemText = (_index: number, item: { text? }) => item ? item.text : _index;

  /**
   * Property `elementRefNativeElem` (`HTMLElement`) storing element ref native elem.
   * @zh 属性 `elementRefNativeElem`（类型：`HTMLElement`），用于存储或配置元素引用原生Elem。
   */
  private elementRefNativeElem!: HTMLElement;
  /**
   * Property `scrollCalculator` (`CommandPaletteScrollCalculator`) storing scroll calculator (default: `new CommandPaletteScrollCalculator()`).
   * @zh 属性 `scrollCalculator`（类型：`CommandPaletteScrollCalculator`），用于存储或配置滚动Calculator（默认值：`new CommandPaletteScrollCalculator()`）。
   */
  private readonly scrollCalculator: CommandPaletteScrollCalculator = new CommandPaletteScrollCalculator();

  /**
   * Creates an instance of `CommandPaletteContentComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CommandPaletteContentComponent` 实例，并初始化其依赖项与内部状态。
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param document - Injected or initial document (`Document`) / 注入或传入的文档对象（`Document`）
   */
  constructor(
    private readonly elementRef: ElementRef,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedItemIndex'] && !changes['selectedItemIndex'].firstChange) {
      this.scrollToSelectedItem();
    }
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.elementRefNativeElem = this.elementRef.nativeElement;
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToSelectedItem();
    });
  }

  /**
   * Executes `onMouseenter` to handle on mouseenter.
   * @zh 执行 `onMouseenter`，用于当鼠标进入。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  onMouseenter(index: number): void {
    if (this.disableMouseEnter) {
      return;
    }
    this.itemVisited$.next(index);
  }

  /**
   * Executes `scrollToSelectedItem` to handle scroll to selected item.
   * @zh 执行 `scrollToSelectedItem`，用于滚动转换为已选中条目。
   */
  private scrollToSelectedItem(): void {
    this.disableMouseEnter = true;
    const selectedElement = this.document.querySelectorAll<HTMLElement>('.command-palette__content-item')[this.selectedItemIndex] as HTMLElement;
    if (!selectedElement) {
      this.disableMouseEnter = false;
      return;
    }
    const selectedElementTopPosition = selectedElement.offsetTop;
    const containerTopPosition = this.elementRefNativeElem.offsetTop;
    const containerScrollTop: number = this.elementRefNativeElem.scrollTop;
    const containerHeight: number = this.elementRefNativeElem.offsetHeight;
    const rowHeight: number = 40;

    const params: CommandPaletteScrollParams = {
      selectedElementTopPosition,
      containerTopPosition,
      containerScrollTop,
      containerHeight,
      rowHeight
    };

    const calculatedScrollTop = this.scrollCalculator.calculate(params);

    this.elementRefNativeElem.scroll({
      top: calculatedScrollTop < 0 ? 0 : calculatedScrollTop,
      behavior: 'auto'
    });

    timer(1)
      .pipe(take(1))
      .subscribe(() => this.disableMouseEnter = false)
  }
}
