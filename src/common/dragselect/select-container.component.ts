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
  AfterContentInit
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
  styleUrls: ['./select-container.component.scss']
})
export class SelectContainerComponent implements AfterViewInit, OnDestroy, AfterContentInit {
  /** @zh 宿主原生元素及其边界信息。 */
  host: SelectContainerHost;
  /** @zh 内部使用，绑定到选框元素的样式流。 */
  selectBoxStyles$: Observable<SelectBox<string>>;
  /** @zh 内部使用，绑定到选框元素的 CSS 类流。 */
  selectBoxClasses$: Observable<{ [key: string]: boolean }>;

  @ViewChild('selectBox', { static: true })
  private $selectBox: ElementRef;

  @ContentChildren(SelectItemDirective, { descendants: true })
  private $selectableItems: QueryList<SelectItemDirective>;

  /**
   * The currently selected items' values (two-way bindable via `selectedItemsChange`).
   * @zh 当前选中的条目值（可通过 `selectedItemsChange` 双向绑定）。
   */
  @Input() selectedItems: any;
  /**
   * Whether dragging a selection box selects intersecting items. Defaults to `true`.
   * @zh 拖拽选框是否会选中与之相交的条目，默认为 `true`。
   */
  @Input() selectOnDrag = true;
  /** @zh 是否禁用整个选择容器（拖拽和点击均不生效）。 */
  @Input() disabled = false;
  /** @zh 是否禁用拖拽绘制选框（点击选择仍可用）。 */
  @Input() disableDrag = false;
  /** @zh 是否允许通过单击选中条目。默认为 `true`。 */
  @Input() selectOnClick = true;
  /** @zh 拖拽选框是否需要覆盖条目才能选中它们（而不仅仅是相交）。默认为 `true`。 */
  @Input() dragOverItems = true;
  /** @zh 是否禁用 shift 范围选择。 */
  @Input() disableRangeSelection = false;
  /** @zh 是否进入"选择模式"（悬停/拖过即切换选中状态，而非常规拖框选择）。 */
  @Input() selectMode = false;
  /** @zh 是否要求配合快捷键才能选择（禁用纯点击/拖拽选择）。 */
  @Input() selectWithShortcut = false;

  /** @zh 是否启用自定义选择逻辑（跳过内置的选框绘制样式类）。 */
  @Input()
  @HostBinding('class.dts-custom')
  custom = false;
  /** @zh 内部使用，始终为 `true`，用于绑定 `dts-select-container` 宿主类名。 */
  @HostBinding('class.dts-select-container')
  readonly hostClass = true;
  /** @zh 当前选中项集合发生变化时发出（用于配合 `selectedItems` 双向绑定）。 */
  @Output() selectedItemsChange = new EventEmitter<any>();
  /** @zh 当前选中项集合发生变化时发出。 */
  @Output() select = new EventEmitter<any>();
  /** @zh 单个条目被选中时发出该条目的值。 */
  @Output() itemSelected = new EventEmitter<any>();
  /** @zh 单个条目被取消选中时发出该条目的值。 */
  @Output() itemDeselected = new EventEmitter<any>();
  /** @zh 一次框选/选择操作开始时发出。 */
  @Output() selectionStarted = new EventEmitter<void>();
  /** @zh 一次框选/选择操作结束时发出最终选中的条目集合。 */
  @Output() selectionEnded = new EventEmitter<Array<any>>();

  private _tmpItems = new Map<SelectItemDirective, Action>();

  private _selectedItems$ = new BehaviorSubject<Array<any>>([]);
  private _selectableItems: Array<SelectItemDirective> = [];
  private updateItems$ = new Subject<UpdateAction>();
  private destroy$ = new Subject<void>();

  private _lastRange: [number, number] = [-1, -1];
  private _lastStartIndex: number | undefined = undefined;
  private _newRangeStart = false;
  private _lastRangeSelection: Map<SelectItemDirective, boolean> = new Map();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private shortcuts: ShortcutService,
    private keyboardEvents: KeyboardEventsService,
    private hostElementRef: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) { }

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _filterSelectableItems<T>(predicate: PredicateFn<T>) {
    return from(this._selectableItems).pipe(filter(item => predicate(item.value)));
  }

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

  private _observeSelectableItems() {
    // Listen for updates and either select or deselect an item
    this.updateItems$
      .pipe(
        withLatestFrom(this._selectedItems$),
        takeUntil(this.destroy$),
        filter(([update]) => !update.item.dtsDisabled)
      )
      .subscribe(([update, selectedItems]: [UpdateAction, any[]]) => {
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
      .subscribe(([items, selectedItems]: [QueryList<SelectItemDirective>, any[]]) => {
        const newList = items.toArray();
        this._selectableItems = newList;
          const newValues = newList.map((item) => item.value);
        const removedItems = selectedItems.filter(item => !newValues.includes(item));

        if (removedItems.length) {
          removedItems.forEach(item => this._removeItem(item, selectedItems));
        }

        this.update();
      });
  }

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

  private _calculateBoundingClientRect() {
    this.host.boundingClientRect = calculateBoundingClientRect(this.host);
  }

  private _cursorWithinHost(event: MouseEvent) {
    return cursorWithinElement(event, this.host);
  }

  private _onMouseUp() {
    this._flushItems();
    this.renderer.removeClass(document.body, NO_SELECT_CLASS);
  }

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

  private _isExtendedSelection(event: Event) {
    return this.shortcuts.extendedSelectionShortcut(event) && this.selectOnDrag;
  }

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

  private _addItem(item: SelectItemDirective, selectedItems: Array<any>) {
    let success = false;

    if (!this._hasItem(item, selectedItems)) {
      success = true;
      selectedItems.push(item.value);
      this._selectedItems$.next(selectedItems);
      this.itemSelected.emit(item.value);
    }

    return success;
  }

  private _removeItem(item: SelectItemDirective, selectedItems: Array<any>) {
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

  private _selectItem(item: SelectItemDirective) {
    this.updateItems$.next({ type: UpdateActions.Add, item });
  }

  private _deselectItem(item: SelectItemDirective) {
    this.updateItems$.next({ type: UpdateActions.Remove, item });
  }

  private _hasItem(item: SelectItemDirective, selectedItems: Array<any>) {
    return selectedItems.includes(item.value);
  }

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

  private _resetRangeStart() {
    this._lastRange = [-1, -1];
    const lastRangeStart = this._getLastRangeSelection();

    if (lastRangeStart && lastRangeStart.rangeStart) {
      lastRangeStart.toggleRangeStart();
    }
  }

  private _getLastRangeSelection(): SelectItemDirective | null {
    if (this._lastStartIndex >= 0) {
      return this._selectableItems[this._lastStartIndex];
    }

    return null;
  }
}
