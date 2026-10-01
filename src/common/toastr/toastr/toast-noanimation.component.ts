
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
  /** @zh 提示消息的正文文本。 */
  message?: string | null;
  /** @zh 提示消息的标题。 */
  title?: string;
  /** @zh 该提示的解析后配置项。 */
  options: IndividualConfig;
  /** @zh 该提示被重复触发的次数。 */
  duplicatesCount!: number;
  /** @zh 该提示的原始自动关闭时长（毫秒）。 */
  originalTimeout: number;
  /** width of progress bar */
  width = signal(-1);
  /** a combination of toast type and options.toastClass */
  @HostBinding('class') toastClasses = '';

  /** hides component when waiting to be displayed */
  @HostBinding('style.display')
  get displayStyle() {
    if (this.state() === 'inactive') {
      return 'none';
    }

    return null;
  }

  /** controls animation */
  state = signal('inactive');
  private timeout: any;
  private intervalId: any;
  private hideTime!: number;
  private sub: Subscription;
  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

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

export const DefaultNoAnimationsGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: ToastNoAnimation,
};

@NgModule({
  declarations: [ToastNoAnimation],
  imports: [    
    CommonModule,
    TranslateModule
  ],
  exports: [ToastNoAnimation],

})
export class ToastNoAnimationModule {
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
