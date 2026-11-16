/**
 * @fileoverview Module `src/common/dragselect/select-container.component.ts` providing select container component definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/select-container.component.ts`，提供下拉选择容器组件相关的定义与实现。
 */

import {
  Component,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild,
  NgZone,
  ContentChildren,
  QueryList,
  HostBinding,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  AfterContentInit, ChangeDetectionStrategy
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { Observable, Subject, combineLatest, merge, from, fromEvent, BehaviorSubject, asyncScheduler } from 'rxjs';

import {
  switchMap,
  takeUntil,
  map,
  tap,
  filter,
  auditTime,
  mapTo,
  share,
  withLatestFrom,
  distinctUntilChanged,
  observeOn,
  startWith,
  concatMapTo,
  first
} from 'rxjs/operators';

import { SelectItemDirective, SELECT_ITEM_INSTANCE } from './select-item.directive';
import { ShortcutService } from './shortcut.service';

import { createSelectBox, whenSelectBoxVisible } from './operators';

import {
  Action,
  SelectBox,
  MousePosition,
  SelectContainerHost,
  UpdateAction,
  UpdateActions,
  PredicateFn,
  BoundingBox
} from './models';

import { AUDIT_TIME, NO_SELECT_CLASS } from './constants';

import {
  inBoundingBox,
  cursorWithinElement,
  clearSelection,
  boxIntersects,
  calculateBoundingClientRect,
  getRelativeMousePosition,
  getMousePosition,
  hasMinimumSize
} from './utils';
import { KeyboardEventsService } from './keyboard-events.service';

/**
 * A drag-to-select container: draws a selection rectangle as the user drags, and toggles
 * the `selected` state of any {@link SelectItemDirective} children it intersects.
 * Also supports click-to-select and shift/ctrl range/multi selection.
 * @zh 拖拽框选容器：用户拖拽时绘制选框，并切换与选框相交的所有 {@link SelectItemDirective}
 * 子元素的选中状态；同时支持点击选择、以及 shift/ctrl 范围/多选。
 */
@Component({
  selector: 'dts-select-container',
  exportAs: 'dts-select-container',
  host: {
    class: 'dts-select-container'
  },
  template: `
    <ng-content></ng-content>
    <div
      class="dts-select-box"
      #selectBox
      [ngClass]="selectBoxClasses$ | async"
      [ngStyle]="selectBoxStyles$ | async"
    ></div>
  `,
  styleUrls: ['./select-container.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class SelectContainerComponent implements AfterViewInit, OnDestroy, AfterContentInit {
  /**
   * Property `host` (`SelectContainerHost`) storing host.
   * @zh 宿主原生元素及其边界信息。
   * @zh 宿主原生元素及其边界信息。
   */
  host: SelectContainerHost;
  /**
   * Property `selectBoxStyles$` (`Observable<SelectBox<string>>`) storing select box styles.
   * @zh 内部使用，绑定到选框元素的样式流。
   * @zh 内部使用，绑定到选框元素的样式流。
   */
  selectBoxStyles$: Observable<SelectBox<string>>;
  /**
   * @zh 内部使用，绑定到选框元素的 CSS 类流。
   * @zh 内部使用，绑定到选框元素的 CSS 类流。
   */
  selectBoxClasses$: Observable<{ [key: string]: boolean }>;

  /**
   * Template/content query reference `$selectBox` (`ElementRef<any>`) targeting select box.
   * @zh 模板/内容视图查询引用 `$selectBox`（`@ViewChild`），指向下拉选择盒子容器。
   */
  @ViewChild('selectBox', { static: true })
  private $selectBox: ElementRef;

  /**
   * Template/content query reference `$selectableItems` (`QueryList<SelectItemDirective>`) targeting selectable items.
   * @zh 模板/内容视图查询引用 `$selectableItems`（`@ContentChildren`），指向是否可选中条目列表。
   */
  @ContentChildren(SelectItemDirective, { descendants: true })
  private $selectableItems: QueryList<SelectItemDirective>;

  /**
   * The currently selected items' values (two-way bindable via `selectedItemsChange`).
   * @zh 当前选中的条目值（可通过 `selectedItemsChange` 双向绑定）。
   */
  @Input() selectedItems;
  /**
   * Whether dragging a selection box selects intersecting items. Defaults to `true`.
   * @zh 拖拽选框是否会选中与之相交的条目，默认为 `true`。
   */
  @Input() selectOnDrag = true;
  /**
   * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
   * @zh 是否禁用整个选择容器（拖拽和点击均不生效）。
   * @zh 是否禁用整个选择容器（拖拽和点击均不生效）。
   */
  @Input() disabled = false;
  /**
   * Input property `disableDrag` (`boolean`) configuring disable drag (default: `false`).
   * @zh 是否禁用拖拽绘制选框（点击选择仍可用）。
   * @zh 是否禁用拖拽绘制选框（点击选择仍可用）。
   */
  @Input() disableDrag = false;
  /**
   * Input property `selectOnClick` (`boolean`) configuring select on click (default: `true`).
   * @zh 是否允许通过单击选中条目。默认为 `true`。
   * @zh 是否允许通过单击选中条目。默认为 `true`。
   */
  @Input() selectOnClick = true;
  /**
   * Input property `dragOverItems` (`boolean`) configuring drag over items (default: `true`).
   * @zh 拖拽选框是否需要覆盖条目才能选中它们（而不仅仅是相交）。默认为 `true`。
   * @zh 拖拽选框是否需要覆盖条目才能选中它们（而不仅仅是相交）。默认为 `true`。
   */
  @Input() dragOverItems = true;
  /**
   * @zh 是否禁用 shift 范围选择。
   * @zh 是否禁用 shift 范围选择。
   */
  @Input() disableRangeSelection = false;
  /**
   * Input property `selectMode` (`boolean`) configuring select mode (default: `false`).
   * @zh 是否进入"选择模式"（悬停/拖过即切换选中状态，而非常规拖框选择）。
   * @zh 是否进入"选择模式"（悬停/拖过即切换选中状态，而非常规拖框选择）。
   */
  @Input() selectMode = false;
  /**
   * Input property `selectWithShortcut` (`boolean`) configuring select with shortcut (default: `false`).
   * @zh 是否要求配合快捷键才能选择（禁用纯点击/拖拽选择）。
   * @zh 是否要求配合快捷键才能选择（禁用纯点击/拖拽选择）。
   */
  @Input() selectWithShortcut = false;

  /**
   * Input property `custom` (`boolean`) configuring custom (default: `false`).
   * @zh 是否启用自定义选择逻辑（跳过内置的选框绘制样式类）。
   * @zh 是否启用自定义选择逻辑（跳过内置的选框绘制样式类）。
   */
  @Input()
  @HostBinding('class.dts-custom')
  custom = false;
  /**
   * Host binding `hostClass` bound to host attribute/property `class.dts-select-container` for host class.
   * @zh 内部使用，始终为 `true`，用于绑定 `dts-select-container` 宿主类名。
   * @zh 内部使用，始终为 `true`，用于绑定 `dts-select-container` 宿主类名。
   */
  @HostBinding('class.dts-select-container')
  readonly hostClass = true;
  /**
   * Output event emitter `selectedItemsChange` (`EventEmitter<any>`) firing when selected items change occurs.
   * @zh 当前选中项集合发生变化时发出（用于配合 `selectedItems` 双向绑定）。
   * @zh 当前选中项集合发生变化时发出（用于配合 `selectedItems` 双向绑定）。
   */
  @Output() selectedItemsChange = new EventEmitter();
  /**
   * Output event emitter `select` (`EventEmitter<any>`) firing when select occurs.
   * @zh 当前选中项集合发生变化时发出。
   * @zh 当前选中项集合发生变化时发出。
   */
  @Output() select = new EventEmitter();
  /**
   * Output event emitter `itemSelected` (`EventEmitter<any>`) firing when item selected occurs.
   * @zh 单个条目被选中时发出该条目的值。
   * @zh 单个条目被选中时发出该条目的值。
   */
  @Output() itemSelected = new EventEmitter();
  /**
   * Output event emitter `itemDeselected` (`EventEmitter<any>`) firing when item deselected occurs.
   * @zh 单个条目被取消选中时发出该条目的值。
   * @zh 单个条目被取消选中时发出该条目的值。
   */
  @Output() itemDeselected = new EventEmitter();
  /**
   * Output event emitter `selectionStarted` (`EventEmitter<void>`) firing when selection started occurs.
   * @zh 一次框选/选择操作开始时发出。
   * @zh 一次框选/选择操作开始时发出。
   */
  @Output() selectionStarted = new EventEmitter<void>();
  /**
   * Output event emitter `selectionEnded` (`EventEmitter<unknown[]>`) firing when selection ended occurs.
   * @zh 一次框选/选择操作结束时发出最终选中的条目集合。
   * @zh 一次框选/选择操作结束时发出最终选中的条目集合。
   */
  @Output() selectionEnded = new EventEmitter<Array<unknown>>();

  /**
   * Property `_tmpItems` (`Map<SelectItemDirective, Action>`) storing tmp items (default: `new Map<SelectItemDirective, Action>()`).
   * @zh 属性 `_tmpItems`（类型：`Map<SelectItemDirective, Action>`），用于存储或配置临时条目列表（默认值：`new Map<SelectItemDirective, Action>()`）。
   */
  private _tmpItems = new Map<SelectItemDirective, Action>();

  /**
   * Property `_selectedItems$` (`BehaviorSubject<unknown[]>`) storing selected items (default: `new BehaviorSubject<Array<any>>([])`).
   * @zh 属性 `_selectedItems$`（类型：`BehaviorSubject<unknown[]>`），用于存储或配置已选中条目列表（默认值：`new BehaviorSubject<Array<any>>([])`）。
   */
  private _selectedItems$ = new BehaviorSubject<Array<unknown>>([]);
  /**
   * Property `_selectableItems` (`SelectItemDirective[]`) storing selectable items (default: `[]`).
   * @zh 属性 `_selectableItems`（类型：`SelectItemDirective[]`），用于存储或配置是否可选中条目列表（默认值：`[]`）。
   */
  private _selectableItems: Array<SelectItemDirective> = [];
  /**
   * Property `updateItems$` (`Subject<UpdateAction>`) storing update items (default: `new Subject<UpdateAction>()`).
   * @zh 属性 `updateItems$`（类型：`Subject<UpdateAction>`），用于存储或配置更新条目列表（默认值：`new Subject<UpdateAction>()`）。
   */
  private updateItems$ = new Subject<UpdateAction>();
  /**
   * Property `destroy$` (`Subject<void>`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `destroy$`（类型：`Subject<void>`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private destroy$ = new Subject<void>();

  /**
   * Property `_lastRange` (`[number, number]`) storing last range (default: `[-1, -1]`).
   * @zh 属性 `_lastRange`（类型：`[number, number]`），用于存储或配置末尾范围（默认值：`[-1, -1]`）。
   */
  private _lastRange: [number, number] = [-1, -1];
  /**
   * Property `_lastStartIndex` (`number`) storing last start index (default: `undefined`).
   * @zh 属性 `_lastStartIndex`（类型：`number`），用于存储或配置末尾开始索引（默认值：`undefined`）。
   */
  private _lastStartIndex: number | undefined = undefined;
  /**
   * Property `_newRangeStart` (`boolean`) storing new range start (default: `false`).
   * @zh 属性 `_newRangeStart`（类型：`boolean`），用于存储或配置新范围开始（默认值：`false`）。
   */
  private _newRangeStart = false;
  /**
   * Property `_lastRangeSelection` (`Map<SelectItemDirective, boolean>`) storing last range selection (default: `new Map()`).
   * @zh 属性 `_lastRangeSelection`（类型：`Map<SelectItemDirective, boolean>`），用于存储或配置末尾范围Selection（默认值：`new Map()`）。
   */
  private _lastRangeSelection: Map<SelectItemDirective, boolean> = new Map();

  /**
   * Creates an instance of `SelectContainerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `SelectContainerComponent` 实例，并初始化其依赖项与内部状态。
   * @param platformId - Injected or initial platform id (`Object`) / 注入或传入的platform唯一标识（`Object`）
   * @param shortcuts - Injected or initial shortcuts (`ShortcutService`) / 注入或传入的快捷键列表（`ShortcutService`）
   * @param keyboardEvents - Injected or initial keyboard events (`KeyboardEventsService`) / 注入或传入的键盘事件集合（`KeyboardEventsService`）
   * @param hostElementRef - Injected or initial host element ref (`ElementRef<any>`) / 注入或传入的宿主元素引用（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private shortcuts: ShortcutService,
    private keyboardEvents: KeyboardEventsService,
    private hostElementRef: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) { }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.host = this.hostElementRef.nativeElement;

      this._initSelectedItemsChange();

      this._calculateBoundingClientRect();
      this._observeBoundingRectChanges();
      this._observeSelectableItems();

      const mouseup$ = this.keyboardEvents.mouseup$.pipe(
        filter(() => !this.disabled),
        tap(() => this._onMouseUp()),
        share()
      );

      const mousemove$ = this.keyboardEvents.mousemove$.pipe(
        filter(() => !this.disabled),
        share()
      );

      const mousedown$ = fromEvent<MouseEvent>(this.host, 'mousedown').pipe(
        filter(event => event.button === 0), // only emit left mouse
        filter(() => !this.disabled),
        filter((event) => this.selectOnClick || event.target === this.host),
        tap(event => this._onMouseDown(event)),
        share()
      );

      const dragging$ = mousedown$.pipe(
        filter(event => !this.shortcuts.disableSelection(event)),
        filter(() => !this.selectMode),
        filter(() => !this.disableDrag),
         filter((event) => this.dragOverItems || event.target === this.host),
        switchMap(() => mousemove$.pipe(takeUntil(mouseup$))),
        share()
      );

      const currentMousePosition$: Observable<MousePosition> = mousedown$.pipe(
        map((event: MouseEvent) => getRelativeMousePosition(event, this.host))
      );

      const show$ = dragging$.pipe(mapTo(1));
      const hide$ = mouseup$.pipe(mapTo(0));
      const opacity$ = merge(show$, hide$).pipe(distinctUntilChanged());

      const selectBox$ = combineLatest([dragging$, opacity$, currentMousePosition$]).pipe(
        createSelectBox(this.host),
        share()
      );

      this.selectBoxClasses$ = merge(
        dragging$,
        mouseup$,
        this.keyboardEvents.distinctKeydown$,
        this.keyboardEvents.distinctKeyup$
      ).pipe(
        auditTime(AUDIT_TIME),
        withLatestFrom(selectBox$),
        map(([event, selectBox]) => {
          return {
            'dts-adding': hasMinimumSize(selectBox, 0, 0) && !this.shortcuts.removeFromSelection(event),
            'dts-removing': this.shortcuts.removeFromSelection(event)
          };
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      );

      const selectOnMouseUp$ = dragging$.pipe(
        filter(() => !this.selectOnDrag),
        filter(() => !this.selectMode),
        filter(event => this._cursorWithinHost(event)),
        switchMap(() => mouseup$.pipe(first())),
        filter(
          event =>
            (!this.shortcuts.disableSelection(event) && !this.shortcuts.toggleSingleItem(event)) ||
            this.shortcuts.removeFromSelection(event)
        )
      );

      const selectOnDrag$ = selectBox$.pipe(
        auditTime(AUDIT_TIME),
        withLatestFrom(mousemove$, (selectBox, event: MouseEvent) => ({
          selectBox,
          event
        })),
        filter(() => this.selectOnDrag),
        filter(({ selectBox }) => hasMinimumSize(selectBox)),
        map(({ event }) => event)
      );

      const selectOnKeyboardEvent$ = merge(
        this.keyboardEvents.distinctKeydown$,
        this.keyboardEvents.distinctKeyup$
      ).pipe(
        auditTime(AUDIT_TIME),
        whenSelectBoxVisible(selectBox$),
        tap(event => {
          if (this._isExtendedSelection(event)) {
            this._tmpItems.clear();
          } else {
            this._flushItems();
          }
        })
      );

      merge(selectOnMouseUp$, selectOnDrag$, selectOnKeyboardEvent$)
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => this._selectItems(event));

      this.selectBoxStyles$ = selectBox$.pipe(
        map(selectBox => ({
          top: `${selectBox.top}px`,
          left: `${selectBox.left}px`,
          width: `${selectBox.width}px`,
          height: `${selectBox.height}px`,
          opacity: selectBox.opacity
        }))
      );

      this._initSelectionOutputs(mousedown$, mouseup$);
    }
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._selectableItems = this.$selectableItems.toArray();
  }

  /**
   * Selects all selectable items.
   * @zh 选中全部可选条目。
   */
  selectAll() {
    this.$selectableItems.forEach(item => {
      this._selectItem(item);
    });
  }

  /**
   * Selects the given list of {@link SelectItemDirective} items.
   * @zh 选中给定的 {@link SelectItemDirective} 条目列表。
   */
  setSelect(selecteds) {
    selecteds.forEach(item => {
      this._selectItem(item);
    });
  }

  /**
   * Toggles the selected state of every item whose value matches the given predicate.
   * @zh 切换所有值匹配给定断言函数的条目的选中状态。
   */
  toggleItems<T>(predicate: PredicateFn<T>) {
    this._filterSelectableItems(predicate).subscribe((item: SelectItemDirective) => this._toggleItem(item));
  }

  /**
   * Selects every item whose value matches the given predicate.
   * @zh 选中所有值匹配给定断言函数的条目。
   */
  selectItems<T>(predicate: PredicateFn<T>) {
    this._filterSelectableItems(predicate).subscribe((item: SelectItemDirective) => this._selectItem(item));
  }

  /**
   * Deselects every item whose value matches the given predicate.
   * @zh 取消选中所有值匹配给定断言函数的条目。
   */
  deselectItems<T>(predicate: PredicateFn<T>) {
    this._filterSelectableItems(predicate).subscribe((item: SelectItemDirective) => this._deselectItem(item));
  }

  /**
   * Clears the current selection.
   * @zh 清空当前选中项。
   */
  clearSelection() {
    this.$selectableItems.forEach(item => {
      this._deselectItem(item);
    });
  }

  /**
   * Recalculates the container's and every selectable item's bounding rectangle
   * (call after layout changes that aren't automatically observed).
   * @zh 重新计算容器及每个可选条目的边界矩形（在未被自动监听到的布局变化后调用）。
   */
  update() {
    this._calculateBoundingClientRect();
    this.$selectableItems.forEach(item => item.calculateBoundingClientRect());
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Executes `_filterSelectableItems` to handle filter selectable items.
   * @zh 执行 `_filterSelectableItems`，用于过滤是否可选中条目列表。
   * @param predicate - predicate parameter (`PredicateFn<T>`) / predicate参数（`PredicateFn<T>`）
   */
  private _filterSelectableItems<T>(predicate: PredicateFn<T>) {
    return from(this._selectableItems).pipe(filter(item => predicate(item.value)));
  }

  /**
   * Executes `_initSelectedItemsChange` to handle init selected items change.
   * @zh 执行 `_initSelectedItemsChange`，用于初始化已选中条目列表变更。
   */
  private _initSelectedItemsChange() {
    this._selectedItems$
      .pipe(
        auditTime(AUDIT_TIME),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: selectedItems => {
          this.selectedItemsChange.emit(selectedItems);
          this.select.emit(selectedItems);
        },
        complete: () => {
          this.selectedItemsChange.emit([]);
        }
      });
  }

  /**
   * Executes `_observeSelectableItems` to handle observe selectable items.
   * @zh 执行 `_observeSelectableItems`，用于观察是否可选中条目列表。
   */
  private _observeSelectableItems() {
    // Listen for updates and either select or deselect an item
    this.updateItems$
      .pipe(
        withLatestFrom(this._selectedItems$),
        takeUntil(this.destroy$),
        filter(([update]) => !update.item.dtsDisabled)
      )
      .subscribe(([update, selectedItems]) => {
        const item = update.item;
        switch (update.type) {
          case UpdateActions.Add:
            if (this._addItem(item, selectedItems)) {
              item._select();
            }
            break;
          case UpdateActions.Remove:
            if (this._removeItem(item, selectedItems)) {
              item._deselect();
            }
            break;
        }
      });

    // Update the container as well as all selectable items if the list has changed
    this.$selectableItems.changes
      .pipe(
        withLatestFrom(this._selectedItems$),
        observeOn(asyncScheduler),
        takeUntil(this.destroy$)
      )
      .subscribe(([items, selectedItems]) => {
        const newList = items.toArray();
        this._selectableItems = newList;
          const newValues = newList.map((item) => item.value);
        const removedItems = selectedItems.filter(item => !newValues.includes(item));

        if (removedItems.length) {
          removedItems.forEach(item => this._removeItem(item as SelectItemDirective, selectedItems));
        }

        this.update();
      });
  }

  /**
   * Executes `_observeBoundingRectChanges` to handle observe bounding rect changes.
   * @zh 执行 `_observeBoundingRectChanges`，用于观察包围边界矩形变更集合。
   */
  private _observeBoundingRectChanges() {
    this.ngZone.runOutsideAngular(() => {
      const resize$ = fromEvent(window, 'resize');
      const windowScroll$ = fromEvent(window, 'scroll');
      const containerScroll$ = fromEvent(this.host, 'scroll');

      merge(resize$, windowScroll$, containerScroll$)
        .pipe(
          startWith('INITIAL_UPDATE'),
          auditTime(AUDIT_TIME),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.update();
        });
    });
  }

  /**
   * Executes `_initSelectionOutputs` to handle init selection outputs.
   * @zh 执行 `_initSelectionOutputs`，用于初始化Selection输出事件。
   * @param mousedown$ - mousedown parameter (`Observable<MouseEvent>`) / 鼠标按下参数（`Observable<MouseEvent>`）
   * @param mouseup$ - mouseup parameter (`Observable<MouseEvent>`) / 鼠标抬起参数（`Observable<MouseEvent>`）
   */
  private _initSelectionOutputs(mousedown$: Observable<MouseEvent>, mouseup$: Observable<MouseEvent>) {
    mousedown$
      .pipe(
        filter(event => this._cursorWithinHost(event)),
        tap(() => this.selectionStarted.emit()),
        concatMapTo(mouseup$.pipe(first())),
        withLatestFrom(this._selectedItems$),
        map(([, items]) => items),
        takeUntil(this.destroy$)
      )
      .subscribe(items => {
        this.selectionEnded.emit(items);
      });
  }

  /**
   * Executes `_calculateBoundingClientRect` to handle calculate bounding client rect.
   * @zh 执行 `_calculateBoundingClientRect`，用于计算包围边界Client矩形。
   */
  private _calculateBoundingClientRect() {
    this.host.boundingClientRect = calculateBoundingClientRect(this.host);
  }

  /**
   * Executes `_cursorWithinHost` to handle cursor within host.
   * @zh 执行 `_cursorWithinHost`，用于光标Within宿主。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  private _cursorWithinHost(event: MouseEvent) {
    return cursorWithinElement(event, this.host);
  }

  /**
   * Executes `_onMouseUp` to handle on mouse up.
   * @zh 执行 `_onMouseUp`，用于当鼠标向上。
   */
  private _onMouseUp() {
    this._flushItems();
    this.renderer.removeClass(document.body, NO_SELECT_CLASS);
  }

  /**
   * Executes `_onMouseDown` to handle on mouse down.
   * @zh 执行 `_onMouseDown`，用于当鼠标向下。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  private _onMouseDown(event: MouseEvent) {
    if (this.shortcuts.disableSelection(event) || this.disabled) {
      return;
    }

    clearSelection(window);

    if (!this.disableDrag) {
      this.renderer.addClass(document.body, NO_SELECT_CLASS);
    }

    if (this.shortcuts.removeFromSelection(event)) {
      return;
    }

    const mousePoint = getMousePosition(event);
    const [currentIndex, clickedItem] = this._getClosestSelectItem(event);

    let [startIndex, endIndex] = this._lastRange;

    const isMoveRangeStart = this.shortcuts.moveRangeStart(event);

    const shouldResetRangeSelection =
      !this.shortcuts.extendedSelectionShortcut(event) || isMoveRangeStart || this.disableRangeSelection;

    if (shouldResetRangeSelection) {
      this._resetRangeStart();
    }

    // move range start
    if (shouldResetRangeSelection && !this.disableRangeSelection) {
      if (currentIndex > -1) {
        this._newRangeStart = true;
        this._lastStartIndex = currentIndex;
        clickedItem.toggleRangeStart();

        this._lastRangeSelection.clear();
      } else {
        this._lastStartIndex = -1;
      }
    }

    if (currentIndex > -1) {
      startIndex = Math.min(this._lastStartIndex, currentIndex);
      endIndex = Math.max(this._lastStartIndex, currentIndex);
      this._lastRange = [startIndex, endIndex];
    }

    if (isMoveRangeStart) {
      return;
    }

    this.$selectableItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const withinBoundingBox = inBoundingBox(mousePoint, itemRect);

      if (this.shortcuts.extendedSelectionShortcut(event) && this.disableRangeSelection) {
        return;
      }

      const withinRange =
        this.shortcuts.extendedSelectionShortcut(event) &&
        startIndex > -1 &&
        endIndex > -1 &&
        index >= startIndex &&
        index <= endIndex &&
        startIndex !== endIndex;

      const shouldAdd =
        (withinBoundingBox &&
          !this.shortcuts.toggleSingleItem(event) &&
          !this.selectMode &&
          !this.selectWithShortcut) ||
        (this.shortcuts.extendedSelectionShortcut(event) && item.selected && !this._lastRangeSelection.get(item)) ||
        withinRange ||
        (withinBoundingBox && this.shortcuts.toggleSingleItem(event) && !item.selected) ||
        (!withinBoundingBox && this.shortcuts.toggleSingleItem(event) && item.selected) ||
        (withinBoundingBox && !item.selected && this.selectMode) ||
        (!withinBoundingBox && item.selected && this.selectMode);

      const shouldRemove =
        (!withinBoundingBox &&
          !this.shortcuts.toggleSingleItem(event) &&
          !this.selectMode &&
          !this.shortcuts.extendedSelectionShortcut(event) &&
          !this.selectWithShortcut) ||
        (this.shortcuts.extendedSelectionShortcut(event) && currentIndex > -1) ||
        (!withinBoundingBox && this.shortcuts.toggleSingleItem(event) && !item.selected) ||
        (withinBoundingBox && this.shortcuts.toggleSingleItem(event) && item.selected) ||
        (!withinBoundingBox && !item.selected && this.selectMode) ||
        (withinBoundingBox && item.selected && this.selectMode);

      if (shouldAdd) {
        this._selectItem(item);
      } else if (shouldRemove) {
        this._deselectItem(item);
      }

      if (withinRange && !this._lastRangeSelection.get(item)) {
        this._lastRangeSelection.set(item, true);
      } else if (!withinRange && !this._newRangeStart && !item.selected) {
        this._lastRangeSelection.delete(item);
      }
    });

    // if we don't toggle a single item, we set `newRangeStart` to `false`
    // meaning that we are building up a range
    if (!this.shortcuts.toggleSingleItem(event)) {
      this._newRangeStart = false;
    }
  }

  /**
   * Executes `_selectItems` to handle select items.
   * @zh 执行 `_selectItems`，用于下拉选择条目列表。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  private _selectItems(event: Event) {
    const selectionBox = calculateBoundingClientRect(this.$selectBox.nativeElement);

    this.$selectableItems.forEach((item, index) => {
      if (this._isExtendedSelection(event)) {
        this._extendedSelectionMode(selectionBox, item, event);
      } else {
        this._normalSelectionMode(selectionBox, item, event);

        if (this._lastStartIndex < 0 && item.selected) {
          item.toggleRangeStart();
          this._lastStartIndex = index;
        }
      }
    });
  }

  /**
   * Executes `_isExtendedSelection` to handle is extended selection.
   * @zh 执行 `_isExtendedSelection`，用于是否为ExtendedSelection。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  private _isExtendedSelection(event: Event) {
    return this.shortcuts.extendedSelectionShortcut(event) && this.selectOnDrag;
  }

  /**
   * Executes `_normalSelectionMode` to handle normal selection mode.
   * @zh 执行 `_normalSelectionMode`，用于normalSelection模式。
   * @param selectBox - select box parameter (`BoundingBox`) / 下拉选择盒子容器参数（`BoundingBox`）
   * @param item - item parameter (`SelectItemDirective`) / 条目参数（`SelectItemDirective`）
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  private _normalSelectionMode(selectBox: BoundingBox, item: SelectItemDirective, event: Event) {
    const inSelection = boxIntersects(selectBox, item.getBoundingClientRect());

    const shouldAdd = inSelection && !item.selected && !this.shortcuts.removeFromSelection(event);

    const shouldRemove =
      (!inSelection && item.selected && !this.shortcuts.addToSelection(event)) ||
      (inSelection && item.selected && this.shortcuts.removeFromSelection(event));

    if (shouldAdd) {
      this._selectItem(item);
    } else if (shouldRemove) {
      this._deselectItem(item);
    }
  }

  /**
   * Executes `_extendedSelectionMode` to handle extended selection mode.
   * @zh 执行 `_extendedSelectionMode`，用于extendedSelection模式。
   * @param selectBox - select box parameter (`any`) / 下拉选择盒子容器参数（`any`）
   * @param item - item parameter (`SelectItemDirective`) / 条目参数（`SelectItemDirective`）
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  private _extendedSelectionMode(selectBox, item: SelectItemDirective, event: Event) {
    const inSelection = boxIntersects(selectBox, item.getBoundingClientRect());

    const shoudlAdd =
      (inSelection && !item.selected && !this.shortcuts.removeFromSelection(event) && !this._tmpItems.has(item)) ||
      (inSelection && item.selected && this.shortcuts.removeFromSelection(event) && !this._tmpItems.has(item));

    const shouldRemove =
      (!inSelection && item.selected && this.shortcuts.addToSelection(event) && this._tmpItems.has(item)) ||
      (!inSelection && !item.selected && this.shortcuts.removeFromSelection(event) && this._tmpItems.has(item));

    if (shoudlAdd) {
      if (item.selected) {
        item._deselect();
      } else {
        item._select();
      }
      const action = this.shortcuts.removeFromSelection(event)
        ? Action.Delete
        : this.shortcuts.addToSelection(event)
          ? Action.Add
          : Action.None;

      this._tmpItems.set(item, action);
    } else if (shouldRemove) {
      if (this.shortcuts.removeFromSelection(event)) {
        item._select();
      } else {
        item._deselect();
      }
      this._tmpItems.delete(item);
    }
  }

  /**
   * Executes `_flushItems` to handle flush items.
   * @zh 执行 `_flushItems`，用于刷新条目列表。
   */
  private _flushItems() {
    this._tmpItems.forEach((action, item) => {
      if (action === Action.Add) {
        this._selectItem(item);
      }

      if (action === Action.Delete) {
        this._deselectItem(item);
      }
    });

    this._tmpItems.clear();
  }

  /**
   * Executes `_addItem` to handle add item.
   * @zh 执行 `_addItem`，用于添加条目。
   * @param item - item parameter (`SelectItemDirective`) / 条目参数（`SelectItemDirective`）
   * @param selectedItems - selected items parameter (`any`) / 已选中条目列表参数（`any`）
   */
  private _addItem(item: SelectItemDirective, selectedItems) {
    let success = false;

    if (!this._hasItem(item, selectedItems)) {
      success = true;
      selectedItems.push(item.value);
      this._selectedItems$.next(selectedItems);
      this.itemSelected.emit(item.value);
    }

    return success;
  }

  /**
   * Executes `_removeItem` to handle remove item.
   * @zh 执行 `_removeItem`，用于移除条目。
   * @param item - item parameter (`SelectItemDirective`) / 条目参数（`SelectItemDirective`）
   * @param selectedItems - selected items parameter (`any`) / 已选中条目列表参数（`any`）
   */
  private _removeItem(item: SelectItemDirective, selectedItems) {
    let success = false;
    const value = item instanceof SelectItemDirective ? item.value : item;
    const index = selectedItems.indexOf(value);

    if (index > -1) {
      success = true;
      selectedItems.splice(index, 1);
      this._selectedItems$.next(selectedItems);
      this.itemDeselected.emit(value);
    }

    return success;
  }

  /**
   * Executes `_toggleItem` to handle toggle item.
   * @zh 执行 `_toggleItem`，用于开关条目。
   * @param item - item parameter (`SelectItemDirective`) / 条目参数（`SelectItemDirective`）
   */
  private _toggleItem(item: SelectItemDirective) {
    if (item.selected) {
      this._deselectItem(item);
    } else {
      this._selectItem(item);
    }
  }

  /**
   * Selects a single {@link SelectItemDirective} item.
   * @zh 选中单个 {@link SelectItemDirective} 条目。
   */
  public selectItem(item: SelectItemDirective) {
    this.updateItems$.next({ type: UpdateActions.Add, item });
  }

  /**
   * Executes `_selectItem` to handle select item.
   * @zh 执行 `_selectItem`，用于下拉选择条目。
   * @param item - item parameter (`SelectItemDirective`) / 条目参数（`SelectItemDirective`）
   */
  private _selectItem(item: SelectItemDirective) {
    this.updateItems$.next({ type: UpdateActions.Add, item });
  }

  /**
   * Executes `_deselectItem` to handle deselect item.
   * @zh 执行 `_deselectItem`，用于取消选中条目。
   * @param item - item parameter (`SelectItemDirective`) / 条目参数（`SelectItemDirective`）
   */
  private _deselectItem(item: SelectItemDirective) {
    this.updateItems$.next({ type: UpdateActions.Remove, item });
  }

  /**
   * Executes `_hasItem` to handle has item.
   * @zh 执行 `_hasItem`，用于是否包含条目。
   * @param item - item parameter (`SelectItemDirective`) / 条目参数（`SelectItemDirective`）
   * @param selectedItems - selected items parameter (`any`) / 已选中条目列表参数（`any`）
   */
  private _hasItem(item: SelectItemDirective, selectedItems) {
    return selectedItems.includes(item.value);
  }

  /**
   * Executes `_getClosestSelectItem` to handle get closest select item.
   * @zh 执行 `_getClosestSelectItem`，用于获取Closest下拉选择条目。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   * @returns Result of type `[number, SelectItemDirective]` / 类型为 `[number, SelectItemDirective]` 的返回值
   */
  private _getClosestSelectItem(event: Event): [number, SelectItemDirective] {
    const target = (event.target as HTMLElement).closest('.dts-select-item');
    let index = -1;
    let targetItem = null;
    if (target) {
      targetItem = target[SELECT_ITEM_INSTANCE];
      index = this._selectableItems.indexOf(targetItem);
    }
    return [index, targetItem];
  }

  /**
   * Executes `_resetRangeStart` to handle reset range start.
   * @zh 执行 `_resetRangeStart`，用于重置范围开始。
   */
  private _resetRangeStart() {
    this._lastRange = [-1, -1];
    const lastRangeStart = this._getLastRangeSelection();

    if (lastRangeStart && lastRangeStart.rangeStart) {
      lastRangeStart.toggleRangeStart();
    }
  }

  /**
   * Executes `_getLastRangeSelection` to handle get last range selection.
   * @zh 执行 `_getLastRangeSelection`，用于获取末尾范围Selection。
   * @returns Result of type `SelectItemDirective` / 类型为 `SelectItemDirective` 的返回值
   */
  private _getLastRangeSelection(): SelectItemDirective | null {
    if (this._lastStartIndex >= 0) {
      return this._selectableItems[this._lastStartIndex];
    }

    return null;
  }
}
