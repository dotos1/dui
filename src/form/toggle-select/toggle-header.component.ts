/**
 * @fileoverview Module `src/form/toggle-select/toggle-header.component.ts` providing toggle header component definitions and implementation.
 * @zh 模块文件 `src/form/toggle-select/toggle-header.component.ts`，提供开关表头组件相关的定义与实现。
 */


import {
  AfterContentChecked,
  AfterContentInit, AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input, NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild, ChangeDetectionStrategy
} from '@angular/core';

import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { coerceBoolean } from '@dotos/dui/core/decorators';
import { MediaBreakpoints } from '@dotos/dui/core/media';

/**
 * Interface `ToggleHeaderOption` defining the contract and properties for toggle header option.
 * @zh 接口 `ToggleHeaderOption`，定义开关表头选项的数据结构契约与属性规范。
 */
export interface ToggleHeaderOption {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value;
}

/**
 * Type alias `ToggleHeaderAppearance` representing toggle header appearance (`'fill' | 'fill-invert' | 'stroked'`).
 * @zh 类型别名 `ToggleHeaderAppearance`，表示开关表头Appearance（`'fill' | 'fill-invert' | 'stroked'`）。
 */
export type ToggleHeaderAppearance = 'fill' | 'fill-invert' | 'stroked';

/**
 * Type alias `ScrollDirection` representing scroll direction (`'after' | 'before'`).
 * @zh 类型别名 `ScrollDirection`，表示滚动方向（`'after' | 'before'`）。
 */
export type ScrollDirection = 'after' | 'before';

/**
 * Angular directive `ToggleOption` (selector: 'toggle-option') attaching toggle option behavior to host DOM elements.
 * @zh Angular 指令 `ToggleOption`（selector: 'toggle-option'），为宿主 DOM 元素附加开关选项行为。
 */
@Directive(
  {
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'toggle-option',
    standalone: false,
  }
)
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class ToggleOption {

  /**
   * Input property `value` (`any`) configuring value.
   * @zh 输入属性 `value`（类型：`any`），用于配置值。
   */
  @Input() value;

  /**
   * Gets the current view value (`viewValue: string`).
   * @zh 获取当前视图值（`viewValue: string`）。
   */
  get viewValue(): string {
    return (this._element?.nativeElement.textContent || '').trim();
  }

  /**
   * Creates an instance of `ToggleOption` and initializes its dependencies and internal state.
   * @zh 创建 `ToggleOption` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef<HTMLElement>`) / 注入或传入的元素（`ElementRef<HTMLElement>`）
   */
  constructor(
    private _element: ElementRef<HTMLElement>
  ) {}
}

/**
 * Angular directive `_ToggleBase` attaching toggle base behavior to host DOM elements.
 * @zh Angular 指令 `_ToggleBase`，为宿主 DOM 元素附加开关基础行为。
 */
@Directive({ standalone: false })
export abstract class _ToggleBase implements AfterContentInit, OnDestroy {

  /**
   * Template/content query reference `toggleOptions` (`QueryList<ToggleOption>`) targeting toggle options.
   * @zh 模板/内容视图查询引用 `toggleOptions`（`@ContentChildren`），指向开关配置选项。
   */
  @ContentChildren(ToggleOption) toggleOptions: QueryList<ToggleOption>;

  /**
   * Input property `options` (`ToggleHeaderOption[]`) configuring options (default: `[]`).
   * @zh 输入属性 `options`（类型：`ToggleHeaderOption[]`），用于配置配置选项（默认值：`[]`）。
   */
  @Input()
  options: ToggleHeaderOption[] = [];

  /**
   * Property `_destroyed` (`Subject<void>`) storing destroyed (default: `new Subject<void>()`).
   * @zh 属性 `_destroyed`（类型：`Subject<void>`），用于存储或配置已销毁（默认值：`new Subject<void>()`）。
   */
  protected _destroyed = new Subject<void>();

  /**
   * Creates an instance of `_ToggleBase` and initializes its dependencies and internal state.
   * @zh 创建 `_ToggleBase` 实例，并初始化其依赖项与内部状态。
   */
  protected constructor() {
   
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit(): void {
    this.toggleOptions.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      this.syncToggleHeaderOptions();
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Executes `syncToggleHeaderOptions` to handle sync toggle header options.
   * @zh 执行 `syncToggleHeaderOptions`，用于同步开关表头配置选项。
   */
  private syncToggleHeaderOptions() {
    if (this.toggleOptions?.length) {
      this.options.length = 0;
      this.toggleOptions.forEach(option => {
        this.options.push(
          { name: option.viewValue,
            value: option.value
          }
        );
      });
    }
  }

}

/**
 * Angular component `ToggleHeaderComponent` (selector: 'toggle-header') providing toggle header component presentation and interaction in `src/form/toggle-select`.
 * @zh Angular 组件 `ToggleHeaderComponent`（selector: 'toggle-header'），提供开关表头组件的视图渲染与交互逻辑（位于 `src/form/toggle-select`）。
 */
@Component({
  selector: 'toggle-header',
  templateUrl: './toggle-header.component.html',
  styleUrls: ['./toggle-header.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ToggleHeaderComponent extends _ToggleBase implements OnInit, AfterViewInit, AfterContentInit,
  AfterContentChecked, AfterViewChecked, OnDestroy {

  /**
   * Template/content query reference `toggleGroup` (`ElementRef<HTMLElement>`) targeting toggle group.
   * @zh 模板/内容视图查询引用 `toggleGroup`（`@ViewChild`），指向开关分组。
   */
  @ViewChild('toggleGroup', {static: false})
  toggleGroup: ElementRef<HTMLElement>;

  /**
   * Template/content query reference `buttonToggleGroup` (`MatButtonToggleGroup`) targeting button toggle group.
   * @zh 模板/内容视图查询引用 `buttonToggleGroup`（`@ViewChild`），指向按钮开关分组。
   */
  @ViewChild(MatButtonToggleGroup, {static: false})
  buttonToggleGroup: MatButtonToggleGroup;

  /**
   * Template/content query reference `toggleGroupContainer` (`ElementRef<HTMLElement>`) targeting toggle group container.
   * @zh 模板/内容视图查询引用 `toggleGroupContainer`（`@ViewChild`），指向开关分组容器。
   */
  @ViewChild('toggleGroupContainer', {static: false})
  toggleGroupContainer: ElementRef<HTMLElement>;

  /**
   * Host binding `showPaginationControls` bound to host attribute/property `class.toggle-header-pagination-controls-enabled` for show pagination controls.
   * @zh 宿主绑定属性 `showPaginationControls`，绑定至宿主元素 `class.toggle-header-pagination-controls-enabled` 以控制显示分页控件集合。
   */
  @HostBinding('class.toggle-header-pagination-controls-enabled')
  private showPaginationControls = false;
  /**
   * Property `_showPaginationControlsChanged` (`boolean`) storing show pagination controls changed (default: `false`).
   * @zh 属性 `_showPaginationControlsChanged`（类型：`boolean`），用于存储或配置显示分页控件集合已变更（默认值：`false`）。
   */
  private _showPaginationControlsChanged = false;

  /**
   * Property `toggleGroupResize$` (`ResizeObserver`) storing toggle group resize.
   * @zh 属性 `toggleGroupResize$`（类型：`ResizeObserver`），用于存储或配置开关分组调整尺寸。
   */
  private toggleGroupResize$: ResizeObserver;

  /**
   * Property `leftPaginationEnabled` (`boolean`) storing left pagination enabled (default: `false`).
   * @zh 属性 `leftPaginationEnabled`（类型：`boolean`），用于存储或配置左侧位置分页已启用（默认值：`false`）。
   */
  leftPaginationEnabled = false;
  /**
   * Property `rightPaginationEnabled` (`boolean`) storing right pagination enabled (default: `false`).
   * @zh 属性 `rightPaginationEnabled`（类型：`boolean`），用于存储或配置右侧位置分页已启用（默认值：`false`）。
   */
  rightPaginationEnabled = false;

  /**
   * Property `_scrollDistance` (`number`) storing scroll distance (default: `0`).
   * @zh 属性 `_scrollDistance`（类型：`number`），用于存储或配置滚动距离（默认值：`0`）。
   */
  private _scrollDistance = 0;
  /**
   * Property `_scrollDistanceChanged` (`boolean`) storing scroll distance changed.
   * @zh 属性 `_scrollDistanceChanged`（类型：`boolean`），用于存储或配置滚动距离已变更。
   */
  private _scrollDistanceChanged: boolean;

  /**
   * Gets the current scroll distance (`scrollDistance: number`).
   * @zh 获取当前滚动距离（`scrollDistance: number`）。
   */
  get scrollDistance(): number {
    return this._scrollDistance;
  }
  /**
   * Sets the scroll distance (`scrollDistance`).
   * @zh 设置滚动距离（`scrollDistance`）。
   * @param value - New scroll distance value (`number`) / 新的滚动距离值（`number`）
   */
  set scrollDistance(value: number) {
    this._scrollTo(value);
  }

  /**
   * Input property `value` (`any`) configuring value.
   * @zh 输入属性 `value`（类型：`any`），用于配置值。
   */
  @Input()
  value;

  /**
   * Output event emitter `valueChange` (`EventEmitter<any>`) firing when value change occurs.
   * @zh 输出事件 `valueChange`（类型：`EventEmitter<any>`），当触发值变更时向外发出事件。
   */
  @Output()
  valueChange = new EventEmitter();

  /**
   * Input property `name` (`string`) configuring name.
   * @zh 输入属性 `name`（类型：`string`），用于配置名称。
   */
  @Input()
  name: string;

  /**
   * Input property `disablePagination` (`boolean`) configuring disable pagination (default: `false`).
   * @zh 输入属性 `disablePagination`（类型：`boolean`），用于配置禁用分页（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  disablePagination = false;

  /**
   * Input property `selectMediaBreakpoint` (`string`) configuring select media breakpoint (default: `'md-lg'`).
   * @zh 输入属性 `selectMediaBreakpoint`（类型：`string`），用于配置下拉选择媒体Breakpoint（默认值：`'md-lg'`）。
   */
  @Input()
  selectMediaBreakpoint = 'md-lg';

  /**
   * Input setter `useSelectOnMdLg` updating use select on md lg.
   * @zh 输入属性 `useSelectOnMdLg` 的设置器，用于更新使用下拉选择当MdLg。
   * @param value - New use select on md lg value (`boolean`) / 新的使用下拉选择当MdLg值（`boolean`）
   */
  @Input()
  @coerceBoolean()
  set useSelectOnMdLg(value: boolean) {
    if (value) {
      this.selectMediaBreakpoint = 'md-lg';
    } else {
      if (this.selectMediaBreakpoint === 'md-lg') {
        this.selectMediaBreakpoint = '';
      }
    }
  }

  /**
   * Input property `ignoreMdLgSize` (`boolean`) configuring ignore md lg size (default: `false`).
   * @zh 输入属性 `ignoreMdLgSize`（类型：`boolean`），用于配置忽略MdLg尺寸（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  ignoreMdLgSize = false;

  /**
   * Input property `appearance` (`ToggleHeaderAppearance`) configuring appearance (default: `'stroked'`).
   * @zh 输入属性 `appearance`（类型：`ToggleHeaderAppearance`），用于配置appearance（默认值：`'stroked'`）。
   */
  @Input()
  appearance: ToggleHeaderAppearance = 'stroked';

  /**
   * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
   * @zh 输入属性 `disabled`（类型：`boolean`），用于配置已禁用（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  disabled = false;

  /**
   * Input property `fillHeight` (`boolean`) configuring fill height (default: `false`).
   * @zh 输入属性 `fillHeight`（类型：`boolean`），用于配置填充高度（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  fillHeight = false;

  /**
   * Input property `extraPadding` (`boolean`) configuring extra padding (default: `false`).
   * @zh 输入属性 `extraPadding`（类型：`boolean`），用于配置extra内边距（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  extraPadding = false;

  /**
   * Input property `primaryBackground` (`boolean`) configuring primary background (default: `false`).
   * @zh 输入属性 `primaryBackground`（类型：`boolean`），用于配置主色背景（默认值：`false`）。
   */
  @Input()
  @coerceBoolean()
  primaryBackground = false;

  /**
   * Gets the current is md lg (`isMdLg: boolean`).
   * @zh 获取当前是否为MdLg（`isMdLg: boolean`）。
   */
  get isMdLg(): boolean {
    return !this.ignoreMdLgSize && this.isMdLgValue;
  }

  /**
   * Property `isMdLgValue` (`boolean`) storing is md lg value.
   * @zh 属性 `isMdLgValue`（类型：`boolean`），用于存储或配置是否为MdLg值。
   */
  private isMdLgValue: boolean;
  /**
   * Property `useSelectSubject` (`BehaviorSubject<boolean>`) storing use select subject (default: `new BehaviorSubject(false)`).
   * @zh 属性 `useSelectSubject`（类型：`BehaviorSubject<boolean>`），用于存储或配置使用下拉选择主题流（默认值：`new BehaviorSubject(false)`）。
   */
  private useSelectSubject = new BehaviorSubject(false);

  /**
   * Property `useSelect$` (`Observable<boolean>`) storing use select.
   * @zh 属性 `useSelect$`（类型：`Observable<boolean>`），用于存储或配置使用下拉选择。
   */
  useSelect$ = this.useSelectSubject.asObservable().pipe(distinctUntilChanged());

  /**
   * Property `observeBreakpointSubscription` (`Subscription`) storing observe breakpoint subscription.
   * @zh 属性 `observeBreakpointSubscription`（类型：`Subscription`），用于存储或配置observeBreakpoint订阅对象。
   */
  private observeBreakpointSubscription: Subscription;
  /**
   * Property `_paginationTimeout` (`any`) storing pagination timeout.
   * @zh 属性 `_paginationTimeout`（类型：`any`），用于存储或配置分页延时器。
   */
  private _paginationTimeout;

  /**
   * Creates an instance of `ToggleHeaderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ToggleHeaderComponent` 实例，并初始化其依赖项与内部状态。
   * @param cd - Injected or initial cd (`ChangeDetectorRef`) / 注入或传入的cd（`ChangeDetectorRef`）
   * @param platform - Injected or initial platform (`Platform`) / 注入或传入的platform（`Platform`）
   * @param breakpointObserver - Injected or initial breakpoint observer (`BreakpointObserver`) / 注入或传入的breakpoint观察者（`BreakpointObserver`）
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   */
  constructor(
              private cd: ChangeDetectorRef,
              private platform: Platform,
              private breakpointObserver: BreakpointObserver,
              private zone: NgZone) {
    super();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    const mediaBreakpoints = [MediaBreakpoints['md-lg']];
    if (this.selectMediaBreakpoint && this.selectMediaBreakpoint !== 'md-lg') {
      mediaBreakpoints.push(MediaBreakpoints[this.selectMediaBreakpoint]);
    }
    this.observeBreakpointSubscription = this.breakpointObserver
      .observe(mediaBreakpoints)
      .subscribe((state: BreakpointState) => {
          this.isMdLgValue = state.breakpoints[MediaBreakpoints['md-lg']];
          if (this.selectMediaBreakpoint) {
            this.useSelectSubject.next(state.breakpoints[MediaBreakpoints[this.selectMediaBreakpoint]]);
          } else {
            this.useSelectSubject.next(false);
          }
          this.cd.markForCheck();
        }
      );
    if (!this.disablePagination) {
      this.valueChange.pipe(takeUntil(this._destroyed)).subscribe(() => {
        this.scrollToToggleOptionValue();
      });
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    if (this._paginationTimeout) {
      clearTimeout(this._paginationTimeout);
      this._paginationTimeout = null;
    }
    if (this.observeBreakpointSubscription) {
      this.observeBreakpointSubscription.unsubscribe();
    }
    this.stopObservePagination();
    super.ngOnDestroy();
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    if (!this.disablePagination) {
      this.useSelect$.pipe(takeUntil(this._destroyed)).subscribe((useSelect) => {
        if (this._paginationTimeout) {
          clearTimeout(this._paginationTimeout);
          this._paginationTimeout = null;
        }
        if (useSelect) {
          this.removePagination();
        } else {
          this._paginationTimeout = setTimeout(() => {
            this._paginationTimeout = null;
            this.startObservePagination();
          }, 0);
        }
      });
    }
  }

  /**
   * Angular lifecycle hook invoked after every check of projected content.
   * @zh Angular 生命周期钩子：在每次检查完投影内容后调用。
   */
  ngAfterContentChecked() {
    if (this._scrollDistanceChanged) {
      this.updateToggleHeaderScrollPosition();
      this._scrollDistanceChanged = false;
      this.cd.markForCheck();
    }
  }

  /**
   * Angular lifecycle hook invoked after every check of the component's view and child views.
   * @zh Angular 生命周期钩子：在每次检查完组件视图及其子视图后调用。
   */
  ngAfterViewChecked() {
    if (this._showPaginationControlsChanged) {
      this.scrollToToggleOptionValue();
      this._showPaginationControlsChanged = false;
      this.cd.markForCheck();
    }
  }

  /**
   * Executes `trackByHeaderOption` to handle track by header option.
   * @zh 执行 `trackByHeaderOption`，用于跟踪按表头选项。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param option - option parameter (`ToggleHeaderOption`) / 选项参数（`ToggleHeaderOption`）
   */
  trackByHeaderOption(index: number, option: ToggleHeaderOption){
    return option.value;
  }

  /**
   * Executes `handlePaginatorClick` to handle handle paginator click.
   * @zh 执行 `handlePaginatorClick`，用于连接手柄分页器点击。
   * @param direction - direction parameter (`ScrollDirection`) / 方向参数（`ScrollDirection`）
   * @param $event - event parameter (`Event`) / 事件参数（`Event`）
   */
  handlePaginatorClick(direction: ScrollDirection, $event: Event) {
    if ($event) {
      $event.stopPropagation();
    }
    this.scrollHeader(direction);
  }

  /**
   * Executes `handlePaginatorTouchStart` to handle handle paginator touch start.
   * @zh 执行 `handlePaginatorTouchStart`，用于连接手柄分页器触摸开始。
   * @param direction - direction parameter (`ScrollDirection`) / 方向参数（`ScrollDirection`）
   * @param $event - event parameter (`Event`) / 事件参数（`Event`）
   */
  handlePaginatorTouchStart(direction: ScrollDirection, $event: Event) {
    if (direction === 'before' && !this.leftPaginationEnabled ||
        direction === 'after' && !this.rightPaginationEnabled) {
      $event.preventDefault();
    }
  }

  /**
   * Executes `startObservePagination` to handle start observe pagination.
   * @zh 执行 `startObservePagination`，用于开始Observe分页。
   */
  private startObservePagination() {
    this.stopObservePagination();
    if (!this.toggleGroupContainer?.nativeElement) {
      return;
    }
    this.toggleGroupResize$ = new ResizeObserver(() => {
      this.zone.run(() => {
        this.updatePagination();
      });
    });
    this.toggleGroupResize$.observe(this.toggleGroupContainer.nativeElement);
  }

  /**
   * Executes `removePagination` to handle remove pagination.
   * @zh 执行 `removePagination`，用于移除分页。
   */
  private removePagination() {
    this.stopObservePagination();
    this.showPaginationControls = false;
  }

  /**
   * Executes `stopObservePagination` to handle stop observe pagination.
   * @zh 执行 `stopObservePagination`，用于停止Observe分页。
   */
  private stopObservePagination() {
    if (this.toggleGroupResize$) {
      this.toggleGroupResize$.disconnect();
      this.toggleGroupResize$ = null;
    }
  }

  /**
   * Executes `scrollHeader` to handle scroll header.
   * @zh 执行 `scrollHeader`，用于滚动表头。
   * @param direction - direction parameter (`ScrollDirection`) / 方向参数（`ScrollDirection`）
   */
  private scrollHeader(direction: ScrollDirection) {
    const viewLength = this.toggleGroup.nativeElement.offsetWidth;
    // Move the scroll distance one-third the length of the tab list's viewport.
    const scrollAmount = ((direction === 'before' ? -1 : 1) * viewLength) / 3;
    return this._scrollTo(this._scrollDistance + scrollAmount);
  }

  /**
   * Executes `scrollToToggleOptionValue` to handle scroll to toggle option value.
   * @zh 执行 `scrollToToggleOptionValue`，用于滚动转换为开关选项值。
   */
  private scrollToToggleOptionValue() {
    if (this.buttonToggleGroup && this.buttonToggleGroup.selected) {
      const selectedToggleButton = this.buttonToggleGroup.selected as MatButtonToggle;
      const index = this.options.findIndex(o => o.value === selectedToggleButton.value);
      const isLast = index === this.options.length - 1;
      const isFirst = index === 0;
      const viewLength = this.toggleGroupContainer.nativeElement.offsetWidth;
      const {offsetLeft, offsetWidth} = (selectedToggleButton._buttonElement.nativeElement.offsetParent as HTMLElement);
      const labelBeforePos = isFirst ? 0 : offsetLeft;
      const labelAfterPos = isLast ? this.toggleGroup.nativeElement.scrollWidth : labelBeforePos + offsetWidth;
      const beforeVisiblePos = this.scrollDistance;
      const afterVisiblePos = this.scrollDistance + viewLength;
      if (labelBeforePos < beforeVisiblePos) {
        this.scrollDistance -= beforeVisiblePos - labelBeforePos;
      } else if (labelAfterPos > afterVisiblePos) {
        this.scrollDistance += Math.min(
          labelAfterPos - afterVisiblePos,
          labelBeforePos - beforeVisiblePos,
        );
      }
    }
  }

  /**
   * Executes `updatePagination` to handle update pagination.
   * @zh 执行 `updatePagination`，用于更新分页。
   */
  private updatePagination() {
    this.checkPaginationEnabled();
    this.checkPaginationControls();
    this.updateToggleHeaderScrollPosition();
  }

  /**
   * Executes `checkPaginationEnabled` to handle check pagination enabled.
   * @zh 执行 `checkPaginationEnabled`，用于检查分页已启用。
   */
  private checkPaginationEnabled() {
    if (this.toggleGroupContainer) {
      const isEnabled = this.toggleGroup.nativeElement.scrollWidth > this.toggleGroupContainer.nativeElement.offsetWidth;
      if (isEnabled !== this.showPaginationControls) {
        if (!isEnabled) {
          this.scrollDistance = 0;
        } else {
          this._showPaginationControlsChanged = true;
        }
        this.cd.markForCheck();
        this.showPaginationControls = isEnabled;
      }
    } else {
      this.showPaginationControls = false;
    }
  }

  /**
   * Executes `checkPaginationControls` to handle check pagination controls.
   * @zh 执行 `checkPaginationControls`，用于检查分页控件集合。
   */
  private checkPaginationControls() {
    if (!this.showPaginationControls) {
      this.leftPaginationEnabled = this.rightPaginationEnabled = false;
    } else {
      // Check if the pagination arrows should be activated.
      this.leftPaginationEnabled = this.scrollDistance > 0;
      this.rightPaginationEnabled = this.scrollDistance < this.getMaxScrollDistance();
      this.cd.markForCheck();
    }
  }

  /**
   * Executes `getMaxScrollDistance` to handle get max scroll distance.
   * @zh 执行 `getMaxScrollDistance`，用于获取最大值滚动距离。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private getMaxScrollDistance(): number {
    const lengthOfToggleGroup = this.toggleGroup.nativeElement.scrollWidth;
    const viewLength = this.toggleGroupContainer.nativeElement.offsetWidth;
    return lengthOfToggleGroup - viewLength || 0;
  }

  /**
   * Executes `_scrollTo` to handle scroll to.
   * @zh 执行 `_scrollTo`，用于滚动转换为。
   * @param position - position parameter (`number`) / 位置参数（`number`）
   */
  private _scrollTo(position: number) {
    if (!this.showPaginationControls) {
      return {maxScrollDistance: 0, distance: 0};
    } else {
      const maxScrollDistance = this.getMaxScrollDistance();
      this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));
      this._scrollDistanceChanged = true;
      this.checkPaginationControls();
      return {maxScrollDistance, distance: this._scrollDistance};
    }
  }

  /**
   * Executes `updateToggleHeaderScrollPosition` to handle update toggle header scroll position.
   * @zh 执行 `updateToggleHeaderScrollPosition`，用于更新开关表头滚动位置。
   */
  private updateToggleHeaderScrollPosition() {
    if (this.toggleGroupContainer) {
      const scrollDistance = this.scrollDistance;
      const translateX = -scrollDistance;
      this.toggleGroup.nativeElement.style.transform = `translateX(${Math.round(translateX)}px)`;
      if (this.platform.TRIDENT || this.platform.EDGE) {
        this.toggleGroupContainer.nativeElement.scrollLeft = 0;
      }
    }
  }
}
