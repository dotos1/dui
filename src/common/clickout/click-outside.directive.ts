/**
 * @fileoverview Module `src/common/clickout/click-outside.directive.ts` providing click outside directive definitions and implementation.
 * @zh 模块文件 `src/common/clickout/click-outside.directive.ts`，提供点击外部指令相关的定义与实现。
 */

import {
  Directive,  ElementRef,  EventEmitter,  Inject,  Injectable,  Input,  OnChanges,  OnDestroy,  OnInit,  Output,  PLATFORM_ID,  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Emits `clickOutside` whenever a click (or other configured event) happens outside the
 * host element, useful for closing dropdowns/popups.
 * @zh 当点击（或其他配置的事件）发生在宿主元素之外时发出 `clickOutside`，常用于关闭下拉菜单/弹出层。
 */
@Injectable()
@Directive({ selector: '[clickOutside]' })
export class ClickOutsideDirective implements OnInit, OnChanges, OnDestroy {

  /**
   * Input property `attachOutsideOnClick` (`boolean`) configuring attach outside on click (default: `false`).
   * @zh 仅在宿主元素被点击之后才开始监听"外部点击"（而不是从一开始就监听）。
   * @zh 仅在宿主元素被点击之后才开始监听"外部点击"（而不是从一开始就监听）。
   */
  @Input() attachOutsideOnClick: boolean = false;
  /**
   * Input property `delayClickOutsideInit` (`boolean`) configuring delay click outside init (default: `false`).
   * @zh 延迟初始化外部点击监听器（等待一个微任务）。
   * @zh 延迟初始化外部点击监听器（等待一个微任务）。
   */
  @Input() delayClickOutsideInit: boolean = false;
  /**
   * CSS selector for elements that should be excluded (clicking them doesn't count as "outside").
   * @zh 需要排除的元素的 CSS 选择器（点击这些元素不算作"外部点击"）。
   */
  @Input() exclude: string = '';
  /**
   * Input property `excludeBeforeClick` (`boolean`) configuring exclude before click (default: `false`).
   * @zh 在每次点击前都重新计算排除元素列表（否则只计算一次）。
   * @zh 在每次点击前都重新计算排除元素列表（否则只计算一次）。
   */
  @Input() excludeBeforeClick: boolean = false;
  /**
   * Input property `clickOutsideEvents` (`string`) configuring click outside events (default: `''`).
   * @zh 逗号分隔的自定义监听事件列表，默认只监听 `click`。
   * @zh 逗号分隔的自定义监听事件列表，默认只监听 `click`。
   */
  @Input() clickOutsideEvents: string = '';

  /**
   * Emitted when a click (or configured event) occurs outside the host element.
   * @zh 当点击（或配置的事件）发生在宿主元素之外时发出。
   */
  @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * Property `_nodesExcluded` (`Array<HTMLElement>`) storing nodes excluded (default: `[]`).
   * @zh 属性 `_nodesExcluded`（类型：`Array<HTMLElement>`），用于存储或配置节点列表Excluded（默认值：`[]`）。
   */
  private _nodesExcluded: Array<HTMLElement> = [];
  /**
   * Property `_events` (`Array<string>`) storing events (default: `['click']`).
   * @zh 属性 `_events`（类型：`Array<string>`），用于存储或配置事件集合（默认值：`['click']`）。
   */
  private _events: Array<string> = ['click'];
  /**
   * Property `_delayTimeoutId` (`any`) storing delay timeout id.
   * @zh 属性 `_delayTimeoutId`（类型：`any`），用于存储或配置延迟延时器唯一标识。
   */
  private _delayTimeoutId;

  /**
   * Creates an instance of `ClickOutsideDirective` and initializes its dependencies and internal state.
   * @zh 创建 `ClickOutsideDirective` 实例，并初始化其依赖项与内部状态。
   * @param _el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   * @param platformId - Injected or initial platform id (`Object`) / 注入或传入的platform唯一标识（`Object`）
   */
  constructor(private _el: ElementRef,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this._initOnClickBody = this._initOnClickBody.bind(this);
    this._onClickBody = this._onClickBody.bind(this);
  }


  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { return; }

    this._init();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) { return; }

    this._removeClickOutsideListener();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!isPlatformBrowser(this.platformId)) { return; }

    if (changes['attachOutsideOnClick'] || changes['exclude']) {
      this._removeClickOutsideListener();
      this._init();
    }
  }

  /**
   * Executes `_removeClickOutsideListener` to handle remove click outside listener.
   * @zh 执行 `_removeClickOutsideListener`，用于移除点击外部监听器。
   */
  private _removeClickOutsideListener() {
    if (this._delayTimeoutId) {
      clearTimeout(this._delayTimeoutId);
      this._delayTimeoutId = null;
    }

    if (this.attachOutsideOnClick) {
      this._events.forEach(e => this._el.nativeElement.removeEventListener(e, this._initOnClickBody));
    }

    this._events.forEach(e => document.body.removeEventListener(e, this._onClickBody));
  }

  /**
   * Executes `_init` to handle init.
   * @zh 执行 `_init`，用于初始化。
   */
  private _init() {
    if (this.clickOutsideEvents !== '') {
      this._events = this.clickOutsideEvents.split(',').map(e => e.trim());
    }

    this._excludeCheck();

    if (this.attachOutsideOnClick) {
      this._events.forEach(e => this._el.nativeElement.addEventListener(e, this._initOnClickBody));
    } else {
      this._initOnClickBody();
    }
  }

  /**
   * Executes `_initOnClickBody` to handle init on click body.
   * @zh 执行 `_initOnClickBody`，用于初始化当点击主体。
   */
  private _initOnClickBody() {
    if (this.delayClickOutsideInit) {
      if (this._delayTimeoutId) {
        clearTimeout(this._delayTimeoutId);
      }
      this._delayTimeoutId = setTimeout(this._initClickListeners.bind(this));
    } else {
      this._initClickListeners();
    }
  }

  /**
   * Executes `_initClickListeners` to handle init click listeners.
   * @zh 执行 `_initClickListeners`，用于初始化点击监听器列表。
   */
  private _initClickListeners() {
    this._events.forEach(e => document.body.addEventListener(e, this._onClickBody));
  }

  /**
   * Executes `_excludeCheck` to handle exclude check.
   * @zh 执行 `_excludeCheck`，用于exclude检查。
   */
  private _excludeCheck() {
    if (this.exclude) {
      try {
        const nodes = Array.from(document.querySelectorAll(this.exclude)) as Array<HTMLElement>;
        if (nodes) {
          this._nodesExcluded = nodes;
        }
      } catch (err) {
        console.error('[ng-click-outside] Check your exclude selector syntax.', err);
      }
    }
  }

  /**
   * Executes `_onClickBody` to handle on click body.
   * @zh 执行 `_onClickBody`，用于当点击主体。
   * @param ev - ev parameter (`Event`) / 事件参数（`Event`）
   */
  private _onClickBody(ev: Event) {
    if (this.excludeBeforeClick) {
      this._excludeCheck();
    }

    if (!this._el.nativeElement.contains(ev.target) && !this._shouldExclude(ev.target)) {
      this.clickOutside.emit(ev);

      if (this.attachOutsideOnClick) {
        this._events.forEach(e => document.body.removeEventListener(e, this._onClickBody));
      }
    }
  }

  /**
   * Executes `_shouldExclude` to handle should exclude.
   * @zh 执行 `_shouldExclude`，用于是否应当Exclude。
   * @param target - target parameter (`any`) / 目标参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private _shouldExclude(target): boolean {
    for (const excludedNode of this._nodesExcluded) {
      if (excludedNode.contains(target)) {
        return true;
      }
    }

    return false;
  }
}
