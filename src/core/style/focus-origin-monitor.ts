/**
 * @fileoverview Module `src/core/style/focus-origin-monitor.ts` providing focus origin monitor definitions and implementation.
 * @zh 模块文件 `src/core/style/focus-origin-monitor.ts`，提供聚焦originmonitor相关的定义与实现。
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  Injectable,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  Renderer2,
  SkipSelf,
} from '@angular/core';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs';
import {Platform} from '@angular/cdk/platform';
import { of } from 'rxjs';

// This is the value used by AngularJS Material. Through trial and error (on iPhone 6S) they found
// that a value of around 650ms seems appropriate.
/**
 * Constant/variable `TOUCH_BUFFER_MS` defining touch buffer ms in `src/core/style`.
 * @zh 常量/变量 `TOUCH_BUFFER_MS`，定义 `src/core/style` 中的触摸缓冲区毫秒。
 */
export const TOUCH_BUFFER_MS = 650;


/**
 * Type alias `FocusOrigin` representing focus origin (`'touch' | 'mouse' | 'keyboard' | 'program'`).
 * @zh 类型别名 `FocusOrigin`，表示聚焦Origin（`'touch' | 'mouse' | 'keyboard' | 'program'`）。
 */
export type FocusOrigin = 'touch' | 'mouse' | 'keyboard' | 'program';


/**
 * Type alias `MonitoredElementInfo` representing monitored element info (`{ unlisten: Function, checkChildren: boolean, renderer: Renderer2, sub...`).
 * @zh 类型别名 `MonitoredElementInfo`，表示Monitored元素信息（`{ unlisten: Function, checkChildren: boolean, renderer: Renderer2, sub...`）。
 */
type MonitoredElementInfo = {
  /**
   * Property `unlisten` (`Function`) storing unlisten.
   * @zh 属性 `unlisten`（类型：`Function`），用于存储或配置取消监听。
   */
  unlisten: Function,
  /**
   * Property `checkChildren` (`boolean`) storing check children.
   * @zh 属性 `checkChildren`（类型：`boolean`），用于存储或配置检查子级列表。
   */
  checkChildren: boolean,
  /**
   * Property `renderer` (`Renderer2`) storing renderer.
   * @zh 属性 `renderer`（类型：`Renderer2`），用于存储或配置渲染器。
   */
  renderer: Renderer2,
  /**
   * Property `subject` (`Subject<FocusOrigin>`) storing subject.
   * @zh 属性 `subject`（类型：`Subject<FocusOrigin>`），用于存储或配置主题流。
   */
  subject: Subject<FocusOrigin>
};


/**
 * Monitors mouse and keyboard events to determine the cause of focus events.
 * @zh 可注入的 Angular 服务 `FocusOriginMonitor`，管理 `src/core/style` 中的聚焦OriginMonitor状态与业务操作。
 */
@Injectable()
export class FocusOriginMonitor implements OnDestroy {
  /**
   * The focus origin that the next focus event is a result of.
   * @zh 属性 `_origin`（类型：`FocusOrigin`），用于存储或配置origin（默认值：`null`）。
   */
  private _origin: FocusOrigin = null;

  /**
   * The FocusOrigin of the last focus event tracked by the FocusOriginMonitor.
   * @zh 属性 `_lastFocusOrigin`（类型：`FocusOrigin`），用于存储或配置末尾聚焦Origin。
   */
  private _lastFocusOrigin: FocusOrigin;

  /**
   * Whether the window has just been focused.
   * @zh 属性 `_windowFocused`（类型：`boolean`），用于存储或配置窗口已聚焦（默认值：`false`）。
   */
  private _windowFocused = false;

  /**
   * The target of the last touch event.
   * @zh 属性 `_lastTouchTarget`（类型：`EventTarget`），用于存储或配置末尾触摸目标。
   */
  private _lastTouchTarget: EventTarget;

  /**
   * The timeout id of the touch timeout, used to cancel timeout later.
   * @zh 属性 `_touchTimeout`（类型：`any`），用于存储或配置触摸延时器。
   */
  private _touchTimeout;

  /**
   * Weak map of elements being monitored to their info.
   * @zh 属性 `_elementInfo`（类型：`WeakMap<Element, MonitoredElementInfo>`），用于存储或配置元素信息。
   */
  private _elementInfo = new WeakMap<Element, MonitoredElementInfo>();

  /**
   * Unlisten functions for the document/window level listeners registered by this instance.
   * @zh 属性 `_documentEventsUnlisten`（类型：`(() => void)[]`），用于存储或配置文档对象事件集合取消监听（默认值：`[]`）。
   */
  private _documentEventsUnlisten: Array<() => void> = [];

  /**
   * Creates an instance of `FocusOriginMonitor` and initializes its dependencies and internal state.
   * @zh 创建 `FocusOriginMonitor` 实例，并初始化其依赖项与内部状态。
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param _platform - Injected or initial platform (`Platform`) / 注入或传入的platform（`Platform`）
   */
  constructor(private _ngZone: NgZone, private _platform: Platform) {
    this._ngZone.runOutsideAngular(() => this._registerDocumentEvents());
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._documentEventsUnlisten.forEach(unlisten => unlisten());
    this._documentEventsUnlisten = [];
  }

  /**
   * Monitors focus on an element and applies appropriate CSS classes.
   * param element The element to monitor
   * param renderer The renderer to use to apply CSS classes to the element.
   * param checkChildren Whether to count the element as focused when its children are focused.
   *  An observable that emits when the focus state of the element changes.
   *     When the element is blurred, null will be emitted.

   * @zh 执行 `monitor`，用于monitor。
   */
  monitor(
      element: HTMLElement,
      renderer: Renderer2,
      checkChildren: boolean): Observable<FocusOrigin> {
    // Do nothing if we're not on the browser platform.
    if (!this._platform.isBrowser) {
      return of();
    }
    // Check if we're already monitoring this element.
    if (this._elementInfo.has(element)) {
      const info = this._elementInfo.get(element);
      info.checkChildren = checkChildren;
      return info.subject.asObservable();
    }

    // Create monitored element info.
    const info: MonitoredElementInfo = {
      unlisten: null,
      checkChildren: checkChildren,
      renderer: renderer,
      subject: new Subject<FocusOrigin>()
    };
    this._elementInfo.set(element, info);

    // Start listening. We need to listen in capture phase since focus events don't bubble.
    const focusListener = (event: FocusEvent) => this._onFocus(event, element);
    const blurListener = (event: FocusEvent) => this._onBlur(event, element);
    this._ngZone.runOutsideAngular(() => {
      element.addEventListener('focus', focusListener, true);
      element.addEventListener('blur', blurListener, true);
    });

    // Create an unlisten function for later.
    info.unlisten = () => {
      element.removeEventListener('focus', focusListener, true);
      element.removeEventListener('blur', blurListener, true);
    };

    return info.subject.asObservable();
  }

  /**
   * Stops monitoring an element and removes all focus classes.
   * param element The element to stop monitoring.

   * @zh 执行 `stopMonitoring`，用于停止Monitoring。
   */
  stopMonitoring(element: HTMLElement): void {
    const elementInfo = this._elementInfo.get(element);

    if (elementInfo) {
      elementInfo.unlisten();
      elementInfo.subject.complete();

      this._setClasses(element, null);
      this._elementInfo.delete(element);
    }
  }

  /**
   * Focuses the element via the specified focus origin.
   * param element The element to focus.
   * param origin The focus origin.

   * @zh 执行 `focusVia`，用于聚焦Via。
   */
  focusVia(element: HTMLElement, origin: FocusOrigin): void {
    this._setOriginForCurrentEventQueue(origin);
    element.focus();
  }


  /**
   * Executes `_registerDocumentEvents` to handle register document events.
   * @zh 执行 `_registerDocumentEvents`，用于注册文档对象事件集合。
   */
  private _registerDocumentEvents() {
    // Do nothing if we're not on the browser platform.
    if (!this._platform.isBrowser) {
      return;
    }

    // Note: we listen to events in the capture phase so we can detect them even if the user stops
    // propagation.

    // On keydown record the origin and clear any touch event that may be in progress.
    const keydownListener = () => {
      this._lastTouchTarget = null;
      this._setOriginForCurrentEventQueue('keyboard');
    };
    document.addEventListener('keydown', keydownListener, true);

    // On mousedown record the origin only if there is not touch target, since a mousedown can
    // happen as a result of a touch event.
    const mousedownListener = () => {
      if (!this._lastTouchTarget) {
        this._setOriginForCurrentEventQueue('mouse');
      }
    };
    document.addEventListener('mousedown', mousedownListener, true);

    // When the touchstart event fires the focus event is not yet in the event queue. This means
    // we can't rely on the trick used above (setting timeout of 0ms). Instead we wait 650ms to
    // see if a focus happens.
    const touchstartListener = (event: Event) => {
      if (this._touchTimeout != null) {
        clearTimeout(this._touchTimeout);
      }
      this._lastTouchTarget = event.target;
      this._touchTimeout = setTimeout(() => this._lastTouchTarget = null, TOUCH_BUFFER_MS);
    };
    document.addEventListener('touchstart', touchstartListener, true);

    // Make a note of when the window regains focus, so we can restore the origin info for the
    // focused element.
    const windowFocusListener = () => {
      this._windowFocused = true;
      setTimeout(() => this._windowFocused = false, 0);
    };
    window.addEventListener('focus', windowFocusListener);

    this._documentEventsUnlisten.push(
      () => document.removeEventListener('keydown', keydownListener, true),
      () => document.removeEventListener('mousedown', mousedownListener, true),
      () => document.removeEventListener('touchstart', touchstartListener, true),
      () => window.removeEventListener('focus', windowFocusListener)
    );
  }

  /**
   * Sets the focus classes on the element based on the given focus origin.
   * param element The element to update the classes on.
   * param origin The focus origin.

   * @zh 执行 `_setClasses`，用于集合类名集合。
   */
  private _setClasses(element: HTMLElement, origin: FocusOrigin): void {
    const renderer = this._elementInfo.get(element).renderer;
    const toggleClass = (className: string, shouldSet: boolean) => {
      shouldSet ? renderer.addClass(element, className) : renderer.removeClass(element, className);
    };

    toggleClass('cdk-focused', !!origin);
    toggleClass('cdk-touch-focused', origin === 'touch');
    toggleClass('cdk-keyboard-focused', origin === 'keyboard');
    toggleClass('cdk-mouse-focused', origin === 'mouse');
    toggleClass('cdk-program-focused', origin === 'program');
  }

  /**
   * Sets the origin and schedules an async function to clear it at the end of the event queue.
   * param origin The origin to set.

   * @zh 执行 `_setOriginForCurrentEventQueue`，用于集合Origin用于当前事件队列。
   */
  private _setOriginForCurrentEventQueue(origin: FocusOrigin): void {
    this._origin = origin;
    setTimeout(() => this._origin = null, 0);
  }

  /**
   * Checks whether the given focus event was caused by a touchstart event.
   * param event The focus event to check.
   *  Whether the event was caused by a touch.

   * @zh 执行 `_wasCausedByTouch`，用于wasCaused按触摸。
   */
  private _wasCausedByTouch(event: FocusEvent): boolean {
    // Note(mmalerba): This implementation is not quite perfect, there is a small edge case.
    // Consider the following dom structure:
    //
    // <div #parent tabindex="0" cdkFocusClasses>
    //   <div #child (click)="#parent.focus()"></div>
    // </div>
    //
    // If the user touches the #child element and the #parent is programmatically focused as a
    // result, this code will still consider it to have been caused by the touch event and will
    // apply the cdk-touch-focused class rather than the cdk-program-focused class. This is a
    // relatively small edge-case that can be worked around by using
    // focusVia(parentEl, renderer,  'program') to focus the parent element.
    //
    // If we decide that we absolutely must handle this case correctly, we can do so by listening
    // for the first focus event after the touchstart, and then the first blur event after that
    // focus event. When that blur event fires we know that whatever follows is not a result of the
    // touchstart.
    const focusTarget = event.target;
    return this._lastTouchTarget instanceof Node && focusTarget instanceof Node &&
        (focusTarget === this._lastTouchTarget || focusTarget.contains(this._lastTouchTarget));
  }

  /**
   * Handles focus events on a registered element.
   * param event The focus event.
   * param element The monitored element.

   * @zh 执行 `_onFocus`，用于当聚焦。
   */
  private _onFocus(event: FocusEvent, element: HTMLElement) {
    // NOTE(mmalerba): We currently set the classes based on the focus origin of the most recent
    // focus event affecting the monitored element. If we want to use the origin of the first event
    // instead we should check for the cdk-focused class here and return if the element already has
    // it. (This only matters for elements that have includesChildren = true).

    // If we are not counting child-element-focus as focused, make sure that the event target is the
    // monitored element itself.
    if (!this._elementInfo.get(element).checkChildren && element !== event.target) {
      return;
    }

    // If we couldn't detect a cause for the focus event, it's due to one of three reasons:
    // 1) The window has just regained focus, in which case we want to restore the focused state of
    //    the element from before the window blurred.
    // 2) It was caused by a touch event, in which case we mark the origin as 'touch'.
    // 3) The element was programmatically focused, in which case we should mark the origin as
    //    'program'.
    if (!this._origin) {
      if (this._windowFocused && this._lastFocusOrigin) {
        this._origin = this._lastFocusOrigin;
      } else if (this._wasCausedByTouch(event)) {
        this._origin = 'touch';
      } else {
        this._origin = 'program';
      }
    }

    this._setClasses(element, this._origin);
    this._elementInfo.get(element).subject.next(this._origin);
    this._lastFocusOrigin = this._origin;
    this._origin = null;
  }

  /**
   * Handles blur events on a registered element.
   * param event The blur event.
   * param element The monitored element.

   * @zh 执行 `_onBlur`，用于当失焦。
   */
  private _onBlur(event: FocusEvent, element: HTMLElement) {
    // If we are counting child-element-focus as focused, make sure that we aren't just blurring in
    // order to focus another child of the monitored element.
    if (this._elementInfo.get(element).checkChildren && event.relatedTarget instanceof Node &&
        element.contains(event.relatedTarget)) {
      return;
    }

    this._setClasses(element, null);
    this._elementInfo.get(element).subject.next(null);
  }
}


/**
 * Directive that determines how a particular element was focused (via keyboard, mouse, touch, or
 * programmatically) and adds corresponding classes to the element.
 *
 * There are two variants of this directive:
 * 1) cdkMonitorElementFocus: does not consider an element to be focused if one of its children is
 *    focused.
 * 2) cdkMonitorSubtreeFocus: considers an element focused if it or any of its children are focused.

 * @zh Angular 指令 `CdkMonitorFocus`（selector: '[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]'），为宿主 DOM 元素附加CDK工具Monitor聚焦行为。
 */
@Directive({
  selector: '[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]',
})
export class CdkMonitorFocus implements OnDestroy {
  /**
   * Output event emitter `cdkFocusChange` (`EventEmitter<FocusOrigin>`) firing when cdk focus change occurs.
   * @zh 输出事件 `cdkFocusChange`（类型：`EventEmitter<FocusOrigin>`），当触发CDK工具聚焦变更时向外发出事件。
   */
  @Output() cdkFocusChange = new EventEmitter<FocusOrigin>();

  /**
   * Creates an instance of `CdkMonitorFocus` and initializes its dependencies and internal state.
   * @zh 创建 `CdkMonitorFocus` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _focusOriginMonitor - Injected or initial focus origin monitor (`FocusOriginMonitor`) / 注入或传入的聚焦OriginMonitor（`FocusOriginMonitor`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(private _elementRef: ElementRef, private _focusOriginMonitor: FocusOriginMonitor,
              renderer: Renderer2) {
    this._focusOriginMonitor.monitor(
        this._elementRef.nativeElement, renderer,
        this._elementRef.nativeElement.hasAttribute('cdkMonitorSubtreeFocus'))
        .subscribe(origin => this.cdkFocusChange.emit(origin));
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._focusOriginMonitor.stopMonitoring(this._elementRef.nativeElement);
  }
}


/**
 * Executes `FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY` to handle focus origin monitor provider factory.
 * @zh 执行 `FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY`，用于聚焦ORIGINMONITOR提供者工厂。
 * @param parentDispatcher - parent dispatcher parameter (`FocusOriginMonitor`) / 父级派发器参数（`FocusOriginMonitor`）
 * @param ngZone - ng zone parameter (`NgZone`) / Angular区域(NgZone)参数（`NgZone`）
 * @param platform - platform parameter (`Platform`) / platform参数（`Platform`）
 */
export function FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY(
    parentDispatcher: FocusOriginMonitor, ngZone: NgZone, platform: Platform) {
  return parentDispatcher || new FocusOriginMonitor(ngZone, platform);
}


/**
 * Constant/variable `FOCUS_ORIGIN_MONITOR_PROVIDER` defining focus origin monitor provider in `src/core/style`.
 * @zh 常量/变量 `FOCUS_ORIGIN_MONITOR_PROVIDER`，定义 `src/core/style` 中的聚焦ORIGINMONITOR提供者。
 */
export const FOCUS_ORIGIN_MONITOR_PROVIDER = {
  // If there is already a FocusOriginMonitor available, use that. Otherwise, provide a new one.
  provide: FocusOriginMonitor,
  deps: [[new Optional(), new SkipSelf(), FocusOriginMonitor], NgZone, Platform],
  useFactory: FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY
};
