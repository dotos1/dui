/**
 * @fileoverview Module `src/common/toastr/toastr/toast.component.ts` providing toast component definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/toast.component.ts`，提供toast组件相关的定义与实现。
 */

import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Injector,
  NgZone,
  OnDestroy,
  ViewEncapsulation,
  WritableSignal,
  signal,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { IndividualConfig, ToastPackage } from './toastr-config';
import { ToastrService } from './toastr.service';

/**
 * Angular component `Toast` (selector: '[toast-component]') providing toast presentation and interaction in `src/common/toastr/toastr`.
 * @zh Angular 组件 `Toast`（selector: '[toast-component]'），提供Toast的视图渲染与交互逻辑（位于 `src/common/toastr/toastr`）。
 */
@Component({
  selector: '[toast-component]',
  template: `
  <button *ngIf="options.closeButton" (click)="remove()" type="button" class="toast-close-button" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title">
    {{ title }} 
    <ng-container *ngIf="duplicatesCount">[{{ duplicatesCount + 1 }}]</ng-container>
  </div>
  <div *ngIf="message && options.enableHtml" role="alert"
    [class]="options.messageClass" [innerHTML]="message">
  </div>
  <div *ngIf="message && !options.enableHtml" role="alert"
    [class]="options.messageClass" [attr.aria-label]="message">
    {{ message}}
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width]="width() + '%'"></div>
  </div>
  `,
    styleUrls: ['./toastr.scss'],
    encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      state('active', style({ opacity: 1 })),
      state('removed', style({ opacity: 0 })),
      transition('inactive => active', animate('{{ easeTime }}ms {{ easing }}')),
      transition('active => removed', animate('{{ easeTime }}ms {{ easing }}')),
    ]),
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class Toast<ConfigPayload = unknown> implements OnDestroy {
  /**
   * Property `message` (`string`) storing message.
   * @zh 提示消息的正文文本。
   * @zh 提示消息的正文文本。
   */
  message?: string | null;
  /**
   * Property `title` (`string`) storing title.
   * @zh 提示消息的标题。
   * @zh 提示消息的标题。
   */
  title?: string;
  /**
   * Property `options` (`IndividualConfig<ConfigPayload>`) storing options.
   * @zh 该提示的解析后配置项。
   * @zh 该提示的解析后配置项。
   */
  options: IndividualConfig<ConfigPayload>;
  /**
   * Property `duplicatesCount` (`number`) storing duplicates count.
   * @zh 该提示被重复触发的次数。
   * @zh 该提示被重复触发的次数。
   */
  duplicatesCount!: number;
  /**
   * Property `originalTimeout` (`number`) storing original timeout.
   * @zh 该提示的原始自动关闭时长（毫秒）。
   * @zh 该提示的原始自动关闭时长（毫秒）。
   */
  originalTimeout: number;
  /**
   * Property `width` (`WritableSignal<number>`) storing width (default: `signal(-1)`).
   * @zh 进度条当前宽度百分比。
   * @zh 进度条当前宽度百分比。
   */
  width = signal(-1);
  /**
   * @zh 内部使用，绑定宿主的 CSS 类名（提示类型 + 自定义类）。
   * @zh 内部使用，绑定宿主的 CSS 类名（提示类型 + 自定义类）。
   */
  @HostBinding('class') toastClasses = '';

  /**
   * Property `state` (`WritableSignal<{…}>`) storing state.
   * @zh 内部使用，驱动进入/激活/移除动画的状态信号。
   * @zh 内部使用，驱动进入/激活/移除动画的状态信号。
   */
  state: WritableSignal<{
    value: 'inactive' | 'active' | 'removed';
    params: { easeTime: number | string; easing: string };
  }>;

  /**
   * Host-bound getter `_state` (`{…}`) computing state.
   * @zh 内部使用，绑定 `flyInOut` 动画触发器。
   * @zh 内部使用，绑定 `flyInOut` 动画触发器。
   */
  @HostBinding('@flyInOut') get _state() {
    return this.state();
  }

  /**
   * The host's `display` style: `'none'` while inactive (not yet shown), else `undefined`.
   * @zh 宿主的 `display` 样式：未激活（尚未显示）时为 `'none'`，否则为 `undefined`。
   */
  @HostBinding('style.display')
  get displayStyle(): string | undefined {
    if (this.state().value === 'inactive') {
      return 'none';
    }
    return undefined;
  }

  /**
   * Property `timeout` (`any`) storing timeout.
   * @zh 属性 `timeout`（类型：`any`），用于存储或配置延时器。
   */
  private timeout;
  /**
   * Property `intervalId` (`any`) storing interval id.
   * @zh 属性 `intervalId`（类型：`any`），用于存储或配置间隔定时器唯一标识。
   */
  private intervalId;
  /**
   * Property `hideTime` (`number`) storing hide time.
   * @zh 属性 `hideTime`（类型：`number`），用于存储或配置隐藏时间。
   */
  private hideTime!: number;
  /**
   * Property `sub` (`Subscription`) storing sub.
   * @zh 属性 `sub`（类型：`Subscription`），用于存储或配置子。
   */
  private sub: Subscription;
  /**
   * Property `sub1` (`Subscription`) storing sub1.
   * @zh 属性 `sub1`（类型：`Subscription`），用于存储或配置sub1。
   */
  private sub1: Subscription;
  /**
   * Property `sub2` (`Subscription`) storing sub2.
   * @zh 属性 `sub2`（类型：`Subscription`），用于存储或配置sub2。
   */
  private sub2: Subscription;
  /**
   * Property `sub3` (`Subscription`) storing sub3.
   * @zh 属性 `sub3`（类型：`Subscription`），用于存储或配置sub3。
   */
  private sub3: Subscription;

  /**
   * Creates an instance of `Toast` and initializes its dependencies and internal state.
   * @zh 创建 `Toast` 实例，并初始化其依赖项与内部状态。
   * @param toastrService - Injected or initial toastr service (`ToastrService`) / 注入或传入的轻提示服务（`ToastrService`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param toastPackage - Injected or initial toast package (`ToastPackage<unknown>`) / 注入或传入的toastPackage（`ToastPackage<unknown>`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    protected toastrService: ToastrService,
    private injector: Injector,
 
    public toastPackage: ToastPackage,
    protected ngZone?: NgZone,
  ) {

    this.message =toastPackage.message;
    this.title = toastPackage.title;
    this.options = toastPackage.config as IndividualConfig<ConfigPayload>;
    this.originalTimeout = toastPackage.config.timeOut;
    this.toastClasses = `${toastPackage.toastType} ${toastPackage.config.toastClass}`;
    this.sub = toastPackage.toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.sub1 = toastPackage.toastRef.manualClosed().subscribe(() => {
      this.remove();
    });
    this.sub2 = toastPackage.toastRef.timeoutReset().subscribe(() => {
      this.resetTimeout();
    });
    this.sub3 = toastPackage.toastRef.countDuplicate().subscribe(count => {
      this.duplicatesCount = count;
    });
    this.state = signal({
      value: 'inactive',
      params: {
        easeTime: this.toastPackage.config.easeTime,
        easing: 'ease-in',
      },
    });
  }
  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }

  /**
   * Transitions the toast to active state and starts its auto-dismiss timer/progress bar.
   * @zh 将提示切换为激活状态，并启动其自动关闭计时器/进度条。
   */
  activateToast() {
    this.state.update(state => ({ ...state, value: 'active' }));
    if (
      !(this.options.disableTimeOut === true || this.options.disableTimeOut === 'timeOut') &&
      this.options.timeOut
    ) {
      this.outsideTimeout(() => this.remove(), this.options.timeOut);
      this.hideTime = new Date().getTime() + this.options.timeOut;
      if (this.options.progressBar) {
        this.outsideInterval(() => this.updateProgress(), 10);
      }
    }
  }
  /**
   * updates progress bar width

   * @zh 执行 `updateProgress`，用于更新进度条。
   */
  updateProgress() {
    if (this.width() === 0 || this.width() === 100 || !this.options.timeOut) {
      return;
    }
    const now = new Date().getTime();
    const remaining = this.hideTime - now;
    this.width.set((remaining / this.options.timeOut) * 100);
    if (this.options.progressAnimation === 'increasing') {
      this.width.update(width => 100 - width);
    }
    if (this.width() <= 0) {
      this.width.set(0);
    }
    if (this.width() >= 100) {
      this.width.set(100);
    }
  }

  /**
   * Resets the auto-dismiss timer back to the toast's original timeout.
   * @zh 将自动关闭计时器重置为提示的原始超时时长。
   */
  resetTimeout() {
    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.update(state => ({ ...state, value: 'active' }));

    this.outsideTimeout(() => this.remove(), this.originalTimeout);
    this.options.timeOut = this.originalTimeout;
    this.hideTime = new Date().getTime() + (this.options.timeOut || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.outsideInterval(() => this.updateProgress(), 10);
    }
  }

  /**
   * tells toastrService to remove this toast after animation time

   * @zh 执行 `remove`，用于移除。
   */
  remove() {
    if (this.state().value === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.state.update(state => ({ ...state, value: 'removed' }));
    this.outsideTimeout(
      () => this.toastrService.remove(this.toastPackage.toastId),
      +this.toastPackage.config.easeTime,
    );
  }
  /**
   * @hidden Handles a click on the toast: triggers the tap event and optionally dismisses it.
   * @zh 内部使用，处理提示上的点击事件：触发 tap 事件，并可选地关闭提示。
   */
  @HostListener('click')
  tapToast() {
    if (this.state().value === 'removed') {
      return;
    }
    this.toastPackage.triggerTap();
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  /**
   * @hidden Pauses the auto-dismiss timer/progress bar while the pointer hovers the toast.
   * @zh 内部使用，指针悬停在提示上方时暂停自动关闭计时器/进度条。
   */
  @HostListener('mouseenter')
  stickAround() {
    if (this.state().value === 'removed') {
      return;
    }

    if (this.options.disableTimeOut !== 'extendedTimeOut') {
      clearTimeout(this.timeout);
      this.options.timeOut = 0;
      this.hideTime = 0;

      // disable progressBar
      clearInterval(this.intervalId);
      this.width.set(0);
    }
  }
  /**
   * @hidden Resumes (with the extended timeout) dismissing the toast once the pointer leaves.
   * @zh 内部使用，指针离开后以延长后的超时时长恢复关闭提示的流程。
   */
  @HostListener('mouseleave')
  delayedHideToast() {
    if (
      (this.options.disableTimeOut === true || this.options.disableTimeOut === 'extendedTimeOut') ||
      this.options.extendedTimeOut === 0 ||
      this.state().value === 'removed'
    ) {
      return;
    }
    this.outsideTimeout(() => this.remove(), this.options.extendedTimeOut);
    this.options.timeOut = this.options.extendedTimeOut;
    this.hideTime = new Date().getTime() + (this.options.timeOut || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.outsideInterval(() => this.updateProgress(), 10);
    }
  }

  /**
   * Runs `setTimeout` outside Angular's zone (if `ngZone` is available) to avoid unnecessary
   * change detection, re-entering the zone when the callback fires.
   * @zh 在 Angular zone 之外（若提供了 `ngZone`）执行 `setTimeout`，避免不必要的变更检测，
   * 回调触发时重新进入 zone。
   */
  outsideTimeout(func: { () }, timeout: number) {
    if (this.ngZone) {
      this.ngZone.runOutsideAngular(
        () =>
          (this.timeout = setTimeout(
            () => this.runInsideAngular(func),
            timeout
          ))
      );
    } else {
      this.timeout = setTimeout(() => func(), timeout);
    }
  }

  /**
   * Runs `setInterval` outside Angular's zone (if `ngZone` is available) to avoid unnecessary
   * change detection, re-entering the zone on each tick.
   * @zh 在 Angular zone 之外（若提供了 `ngZone`）执行 `setInterval`，避免不必要的变更检测，
   * 每次触发时重新进入 zone。
   */
  outsideInterval(func: { () }, timeout: number) {
    if (this.ngZone) {
      this.ngZone.runOutsideAngular(
        () =>
          (this.intervalId = setInterval(
            () => this.runInsideAngular(func),
            timeout
          ))
      );
    } else {
      this.intervalId = setInterval(() => func(), timeout);
    }
  }

  /**
   * Executes `runInsideAngular` to handle run inside angular.
   * @zh 执行 `runInsideAngular`，用于运行内部Angular。
   * @param func - func parameter (`() => any`) / func参数（`() => any`）
   */
  private runInsideAngular(func: { () }) {
    if (this.ngZone) {
      this.ngZone.run(() => func());
    } else {
      func();
    }
  }
}
