/**
 * @fileoverview Module `src/common/toastr/toastr/toast-noanimation.component.ts` providing toast noanimation component definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/toast-noanimation.component.ts`，提供toastnoanimation组件相关的定义与实现。
 */


import { ChangeDetectionStrategy, ModuleWithProviders, ViewEncapsulation, signal } from '@angular/core';
import {
  ApplicationRef,
  Component,
  HostBinding,
  HostListener,
  NgModule,
  OnDestroy,
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  DefaultNoComponentGlobalConfig,
  GlobalConfig,
  IndividualConfig,
  ToastPackage,
  TOAST_CONFIG,
} from './toastr-config';
import { ToastrService } from './toastr.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular component `ToastNoAnimation` (selector: '[toast-component]') providing toast no animation presentation and interaction in `src/common/toastr/toastr`.
 * @zh Angular 组件 `ToastNoAnimation`（selector: '[toast-component]'），提供ToastNo动画的视图渲染与交互逻辑（位于 `src/common/toastr/toastr`）。
 */
@Component({
  selector: '[toast-component]',
  template: `
  <button *ngIf="options.closeButton" (click)="remove()" type="button" class="toast-close-button" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title|translate">
    {{ title|translate }} 
    <ng-container *ngIf="duplicatesCount">[{{ duplicatesCount + 1 }}]</ng-container>
  </div>
  <div *ngIf="message && options.enableHtml" role="alert"
    [class]="options.messageClass" [innerHTML]="message|translate">
  </div>
  <div *ngIf="message && !options.enableHtml" role="alert"
    [class]="options.messageClass" [attr.aria-label]="message|translate">
    {{ message|translate }}
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width]="width() + '%'"></div>
  </div>
  `,
    encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class ToastNoAnimation implements OnDestroy {
  /**
   * Property `message` (`string | null`) storing message.
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
   * Property `options` (`IndividualConfig`) storing options.
   * @zh 该提示的解析后配置项。
   * @zh 该提示的解析后配置项。
   */
  options: IndividualConfig;
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
   * width of progress bar
   * @zh 属性 `width`（类型：`any`），用于存储或配置宽度（默认值：`signal(-1)`）。
   */
  width = signal(-1);
  /**
   * a combination of toast type and options.toastClass
   * @zh 宿主绑定属性 `toastClasses`，绑定至宿主元素 `class` 以控制toast类名集合。
   */
  @HostBinding('class') toastClasses = '';

  /**
   * hides component when waiting to be displayed
   * @zh 宿主绑定读取器 `displayStyle`（绑定至 `style.display`），计算并返回display样式。
   */
  @HostBinding('style.display')
  get displayStyle() {
    if (this.state() === 'inactive') {
      return 'none';
    }

    return null;
  }

  /**
   * controls animation
   * @zh 属性 `state`（类型：`any`），用于存储或配置状态（默认值：`signal('inactive')`）。
   */
  state = signal('inactive');
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
   * Creates an instance of `ToastNoAnimation` and initializes its dependencies and internal state.
   * @zh 创建 `ToastNoAnimation` 实例，并初始化其依赖项与内部状态。
   * @param toastrService - Injected or initial toastr service (`ToastrService`) / 注入或传入的轻提示服务（`ToastrService`）
   * @param toastPackage - Injected or initial toast package (`ToastPackage`) / 注入或传入的toastPackage（`ToastPackage`）
   * @param appRef - Injected or initial app ref (`ApplicationRef`) / 注入或传入的app引用（`ApplicationRef`）
   */
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    protected appRef: ApplicationRef,
  ) {
    this.message = toastPackage.message;
    this.title = toastPackage.title;
    this.options = toastPackage.config;
    this.originalTimeout = toastPackage.config.timeOut;
    this.toastClasses = `${toastPackage.toastType} ${
      toastPackage.config.toastClass
    }`;
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
    this.state.set('active');
    if (!(this.options.disableTimeOut === true || this.options.disableTimeOut === 'timeOut') && this.options.timeOut) {
      this.timeout = setTimeout(() => {
        this.remove();
      }, this.options.timeOut);
      this.hideTime = new Date().getTime() + this.options.timeOut;
      if (this.options.progressBar) {
        this.intervalId = setInterval(() => this.updateProgress(), 10);
      }
    }
    if (this.options.onActivateTick) {
      this.appRef.tick();
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
    this.state.set('active');

    this.options.timeOut = this.originalTimeout;
    this.timeout = setTimeout(() => this.remove(), this.originalTimeout);
    this.hideTime = new Date().getTime() + (this.originalTimeout || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }

  /**
   * tells toastrService to remove this toast after animation time

   * @zh 执行 `remove`，用于移除。
   */
  remove() {
    if (this.state() === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.state.set('removed');
    this.timeout = setTimeout(() =>
      this.toastrService.remove(this.toastPackage.toastId),
    );
  }
  /**
   * @hidden Handles a click on the toast: triggers the tap event and optionally dismisses it.
   * @zh 内部使用，处理提示上的点击事件：触发 tap 事件，并可选地关闭提示。
   */
  @HostListener('click')
  tapToast() {
    if (this.state() === 'removed') {
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
    if (this.state() === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.options.timeOut = 0;
    this.hideTime = 0;

    // disable progressBar
    clearInterval(this.intervalId);
    this.width.set(0);
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
      this.state() === 'removed'
    ) {
      return;
    }
    this.timeout = setTimeout(
      () => this.remove(),
      this.options.extendedTimeOut,
    );
    this.options.timeOut = this.options.extendedTimeOut;
    this.hideTime = new Date().getTime() + (this.options.timeOut || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }
}

/**
 * Constant/variable `DefaultNoAnimationsGlobalConfig` defining default no animations global config in `src/common/toastr/toastr`.
 * @zh 常量/变量 `DefaultNoAnimationsGlobalConfig`，定义 `src/common/toastr/toastr` 中的默认No动画全局配置。
 */
export const DefaultNoAnimationsGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: ToastNoAnimation,
};

/**
 * Angular module `ToastNoAnimationModule` declaring and exporting toast no animation module components, directives, pipes, and providers.
 * @zh Angular 模块 `ToastNoAnimationModule`，声明并导出ToastNo动画模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ToastNoAnimation],
  imports: [    
    CommonModule,
    TranslateModule
  ],
  exports: [ToastNoAnimation],

})
export class ToastNoAnimationModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`Partial<GlobalConfig>`) / 配置参数（`Partial<GlobalConfig>`）
   * @returns Result of type `ModuleWithProviders<ToastNoAnimationModule>` / 类型为 `ModuleWithProviders<ToastNoAnimationModule>` 的返回值
   */
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<ToastNoAnimationModule> {
    return {
      ngModule: ToastNoAnimationModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: {
            default: DefaultNoAnimationsGlobalConfig,
            config,
          },
        },
      ],
    };
  }
}
