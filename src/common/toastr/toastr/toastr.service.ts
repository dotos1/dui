/**
 * @fileoverview Module `src/common/toastr/toastr/toastr.service.ts` providing toastr service definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/toastr.service.ts`，提供轻提示服务相关的定义与实现。
 */

import { ComponentRef, Inject, Injectable, Injector, NgZone, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { Overlay } from '../overlay/overlay';
import { ComponentPortal } from '../portal/portal';
import { ToastRef } from './toast-ref';
import { ToastContainerDirective } from './toast.directive';
import {
  GlobalConfig,
  IndividualConfig,
  ToastPackage,
  ToastToken,
  TOAST_CONFIG,
} from './toastr-config';
import { TranslateService } from '@dotos/dui/translator';


/**
 * Interface `ActiveToast` defining the contract and properties for active toast.
 * @zh 接口 `ActiveToast`，定义激活Toast的数据结构契约与属性规范。
 */
export interface ActiveToast<C> {
  /**
   * Your Toast ID. Use this to close it individually
   * @zh 属性 `toastId`（类型：`number`），用于存储或配置toast唯一标识。
   */
  toastId: number;
  /**
   * the title of your toast. Stored to prevent duplicates
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title: string;
  /**
   * the message of your toast. Stored to prevent duplicates
   * @zh 属性 `message`（类型：`string`），用于存储或配置消息。
   */
  message: string;
  /**
   * a reference to the component see portal.ts
   * @zh 属性 `portal`（类型：`ComponentRef<C>`），用于存储或配置传送门容器。
   */
  portal: ComponentRef<C>;
  /**
   * a reference to your toast
   * @zh 属性 `toastRef`（类型：`ToastRef<C>`），用于存储或配置toast引用。
   */
  toastRef: ToastRef<C>;
  /**
   * triggered when toast is active
   * @zh 属性 `onShown`（类型：`Observable<void>`），用于存储或配置当已显示。
   */
  onShown: Observable<void>;
  /**
   * triggered when toast is destroyed
   * @zh 属性 `onHidden`（类型：`Observable<void>`），用于存储或配置当隐藏。
   */
  onHidden: Observable<void>;
  /**
   * triggered on toast click
   * @zh 属性 `onTap`（类型：`Observable<void>`），用于存储或配置当Tap。
   */
  onTap: Observable<void>;
  /**
   * available for your use in custom toast
   * @zh 属性 `onAction`（类型：`Observable<any>`），用于存储或配置当动作。
   */
  onAction;
}

/**
 * Displays toast notifications (success/error/info/warning), with deduplication,
 * max-opened limiting, and manual clear/remove control.
 * @zh 展示 toast 通知（成功/错误/提示/警告），支持去重、最大展示数量限制，以及手动清除/移除。
 */
@Injectable({ providedIn: 'root' })
export class ToastrService {
  /**
   * Property `toastrConfig` (`GlobalConfig`) storing toastr config.
   * @zh 当前生效的全局配置（默认配置与模块注册时传入的配置合并后的结果）。
   * @zh 当前生效的全局配置（默认配置与模块注册时传入的配置合并后的结果）。
   */
  toastrConfig: GlobalConfig;
  /**
   * Property `currentlyActive` (`number`) storing currently active (default: `0`).
   * @zh 当前处于激活（可见）状态的提示数量。
   * @zh 当前处于激活（可见）状态的提示数量。
   */
  currentlyActive = 0;
  /**
   * Property `toasts` (`ActiveToast<any>[]`) storing toasts (default: `[]`).
   * @zh 当前已加入队列/展示中的全部提示。
   * @zh 当前已加入队列/展示中的全部提示。
   */
  toasts = [];
  /**
   * Property `overlayContainer` (`ToastContainerDirective`) storing overlay container.
   * @zh 自定义的提示容器，未设置时使用默认的全局覆盖层容器。
   * @zh 自定义的提示容器，未设置时使用默认的全局覆盖层容器。
   */
  overlayContainer?: ToastContainerDirective;
  /**
   * Property `previousToastMessage` (`string | undefined`) storing previous toast message.
   * @zh 上一条展示的提示消息文本（用于去重判断）。
   * @zh 上一条展示的提示消息文本（用于去重判断）。
   */
  previousToastMessage: string | undefined;
  /**
   * Property `index` (`number`) storing index (default: `0`).
   * @zh 属性 `index`（类型：`number`），用于存储或配置索引（默认值：`0`）。
   */
  private index = 0;

  /**
   * Creates an instance of `ToastrService` and initializes its dependencies and internal state.
   * @zh 创建 `ToastrService` 实例，并初始化其依赖项与内部状态。
   * @param token - Injected or initial token (`ToastToken`) / 注入或传入的令牌（`ToastToken`）
   * @param overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param _injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    @Inject(TOAST_CONFIG) token: ToastToken,
  
    public overlay: Overlay,
    public _injector: Injector,
    public sanitizer: DomSanitizer,
    public ngZone: NgZone,
  ) {
    this.toastrConfig = {
      ...token.default,
      ...token.config,
    };
    if (token.config.iconClasses) {
      this.toastrConfig.iconClasses = {
        ...token.default.iconClasses,
        ...token.config.iconClasses,
      };
    }
  }
  /**
   * Shows a toast of a custom/blank type.
   * @zh 显示一个自定义/空类型的 toast。
   */
  show<ConfigPayload = unknown>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}, type = '') {
    let translateService: TranslateService=this._injector.get(TranslateService);
    let msg=message?translateService.instant(message):'';
    let translateedTitle=title?translateService.instant(title):undefined;
    return this._preBuildNotification(
      type, 
      msg,
      translateedTitle, 
      this.applyConfig(override));
  }
  /**
   * Shows a success toast.
   * @zh 显示一个成功类型的 toast。
   */
  success<ConfigPayload = unknown>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}) {
    let translateService: TranslateService=this._injector.get(TranslateService);
    const type = this.toastrConfig.iconClasses.success || '';
    let msg=message?translateService.instant(message):'';
    let translateedTitle=title?translateService.instant(title):undefined;
    return this._preBuildNotification(
      type, 
      msg,
      translateedTitle, 
      this.applyConfig(override));
  }
  /**
   * Shows an error toast.
   * @zh 显示一个错误类型的 toast。
   */
  error<ConfigPayload = unknown>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}) {
    const type = this.toastrConfig.iconClasses.error || '';
        let translateService: TranslateService=this._injector.get(TranslateService);
            let msg=message?translateService.instant(message):'';
    let translateedTitle=title?translateService.instant(title):undefined;
    return this._preBuildNotification(type,
      msg,
      translateedTitle, 
       this.applyConfig(override));
  }
  /**
   * Shows an info toast.
   * @zh 显示一个提示类型的 toast。
   */
  info<ConfigPayload = unknown>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}) {
    const type = this.toastrConfig.iconClasses.info || '';
       let translateService: TranslateService=this._injector.get(TranslateService);
           let msg=message?translateService.instant(message):'';
    let translateedTitle=title?translateService.instant(title):undefined;
    return this._preBuildNotification(type,
          msg,
      translateedTitle, 
      this.applyConfig(override));
  }
  /**
   * Shows a warning toast.
   * @zh 显示一个警告类型的 toast。
   */
  warning<ConfigPayload = unknown>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}) {
    const type = this.toastrConfig.iconClasses.warning || '';
       let translateService: TranslateService=this._injector.get(TranslateService);
       let msg=message?translateService.instant(message):'';
      let translateedTitle=title?translateService.instant(title):undefined;
      return this._preBuildNotification(type, 
        msg,
        translateedTitle, 
        this.applyConfig(override));
  }
  /**
   * Remove all or a single toast by id.
   * @zh 移除全部 toast，或按 id 移除单个 toast。
   */
  clear(toastId?: number) {
    // Call every toastRef manualClose function
    for (const toast of this.toasts) {
      if (toastId !== undefined) {
        if (toast.toastId === toastId) {
          toast.toastRef.manualClose();
          return;
        }
      } else {
        toast.toastRef.manualClose();
      }
    }
  }
  /**
   * Remove and destroy a single toast by id.
   * @zh 按 id 移除并销毁单个 toast。
   */
  remove(toastId: number) {
    const found = this._findToast(toastId);
    if (!found) {
      return false;
    }
    found.activeToast.toastRef.close();
    this.toasts.splice(found.index, 1);
    this.currentlyActive = this.currentlyActive - 1;
    if (!this.toastrConfig.maxOpened || !this.toasts.length) {
      return false;
    }
    if (this.currentlyActive < this.toastrConfig.maxOpened && this.toasts[this.currentlyActive]) {
      const p = this.toasts[this.currentlyActive].toastRef;
      if (!p.isInactive()) {
        this.currentlyActive = this.currentlyActive + 1;
        p.activate();
      }
    }
    return true;
  }


  /**
   * Finds a currently-displayed toast with the same title/message (used to avoid stacking
   * duplicate notifications), optionally resetting its timeout or bumping its duplicate count.
   * @zh 查找当前已展示的、标题/消息相同的提示（用于避免重复堆叠通知），
   * 可选地重置其超时时间或增加其重复计数。
   */
  findDuplicate(title = '', message = '', resetOnDuplicate: boolean, countDuplicates: boolean) {
    const { includeTitleDuplicates } = this.toastrConfig;

    for (const toast of this.toasts) {
      const hasDuplicateTitle = includeTitleDuplicates && toast.title === title;
      if ((!includeTitleDuplicates || hasDuplicateTitle) && toast.message === message) {
        toast.toastRef.onDuplicate(resetOnDuplicate, countDuplicates);
        return toast;
      }
    }

    return null;
  }

  /**
   * create a clone of global config and apply individual settings
   * @zh 执行 `applyConfig`，用于应用配置。
   */
  private applyConfig(override: Partial<IndividualConfig> = {}): GlobalConfig {
    return { ...this.toastrConfig, ...override };
  }

  /**
   * Find toast object by id

   * @zh 执行 `_findToast`，用于查找Toast。
   */
  private _findToast(toastId: number) {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return { index: i, activeToast: this.toasts[i] };
      }
    }
    return null;
  }

  /**
   * Determines the need to run inside angular's zone then builds the toast

   * @zh 执行 `_preBuildNotification`，用于pre构建通知。
   */
  private _preBuildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig,
  ) {
    if (config.onActivateTick) {
      return this.ngZone.run(() => this._buildNotification(toastType, message, title, config));
    }
    return this._buildNotification(toastType, message, title, config);
  }

  /**
   * Creates and attaches toast data to component
   * returns the active toast, or in case preventDuplicates is enabled the original/non-duplicate active toast.

   * @zh 执行 `_buildNotification`，用于构建通知。
   */
  private _buildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig,
  ) {
    if (!config.toastComponent) {
      throw new Error('toastComponent required');
    }
    // max opened and auto dismiss = true
    // if timeout = 0 resetting it would result in setting this.hideTime = Date.now(). Hence, we only want to reset timeout if there is
    // a timeout at all
    const duplicate = this.findDuplicate(
      title,
      message,
      this.toastrConfig.resetTimeoutOnDuplicate && config.timeOut > 0,
      this.toastrConfig.countDuplicates,
    );
    if (
      ((this.toastrConfig.includeTitleDuplicates && title) || message) &&
      this.toastrConfig.preventDuplicates &&
      duplicate !== null
    ) {
      return duplicate;
    }

    this.previousToastMessage = message;
    let keepInactive = false;
    if (this.toastrConfig.maxOpened && this.currentlyActive >= this.toastrConfig.maxOpened) {
      keepInactive = true;
      if (this.toastrConfig.autoDismiss) {
        this.clear(this.toasts[0].toastId);
      }
    }

    const overlayRef = this.overlay.create(config.positionClass, this.overlayContainer);
    this.index = this.index + 1;
    let sanitizedMessage: string | undefined | null = message;
    if (message && config.enableHtml) {
      sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, message);
    }

    const toastRef = new ToastRef(overlayRef);
    const toastPackage = new ToastPackage(
      this.index,
      config,
      sanitizedMessage,
      title,
      toastType,
      toastRef,
    );

    /** New injector that contains an instance of `ToastPackage`. */
    const providers = [{provide: ToastPackage, useValue: toastPackage}];
    const toastInjector = Injector.create({providers, parent: this._injector});

    const component = new ComponentPortal(config.toastComponent, toastInjector);
    const portal = overlayRef.attach(component, config.newestOnTop);
    toastRef.componentInstance = portal.instance;
    const ins = {
      toastId: this.index,
      title: title || '',
      message: message || '',
      toastRef,
      onShown: toastRef.afterActivate(),
      onHidden: toastRef.afterClosed(),
      onTap: toastPackage.onTap(),
      onAction: toastPackage.onAction(),
      portal,
    };

    if (!keepInactive) {
      this.currentlyActive = this.currentlyActive + 1;
      setTimeout(() => {
        ins.toastRef.activate();
      });
    }

    this.toasts.push(ins);
    return ins;
  }
}
