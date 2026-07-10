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


export interface ActiveToast<C> {
  /** Your Toast ID. Use this to close it individually */
  toastId: number;
  /** the title of your toast. Stored to prevent duplicates */
  title: string;
  /** the message of your toast. Stored to prevent duplicates */
  message: string;
  /** a reference to the component see portal.ts */
  portal: ComponentRef<C>;
  /** a reference to your toast */
  toastRef: ToastRef<C>;
  /** triggered when toast is active */
  onShown: Observable<void>;
  /** triggered when toast is destroyed */
  onHidden: Observable<void>;
  /** triggered on toast click */
  onTap: Observable<void>;
  /** available for your use in custom toast */
  onAction: Observable<any>;
}

/**
 * Displays toast notifications (success/error/info/warning), with deduplication,
 * max-opened limiting, and manual clear/remove control.
 * @zh 展示 toast 通知（成功/错误/提示/警告），支持去重、最大展示数量限制，以及手动清除/移除。
 */
@Injectable({ providedIn: 'root' })
export class ToastrService {
  toastrConfig: GlobalConfig;
  currentlyActive = 0;
  toasts: ActiveToast<any>[] = [];
  overlayContainer?: ToastContainerDirective;
  previousToastMessage: string | undefined;
  private index = 0;

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
  show<ConfigPayload = any>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}, type = '') {
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
  success<ConfigPayload = any>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}) {
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
  error<ConfigPayload = any>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}) {
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
  info<ConfigPayload = any>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}) {
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
  warning<ConfigPayload = any>(message?: string, title?: string, override: Partial<IndividualConfig<ConfigPayload>> = {}) {
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

  /** create a clone of global config and apply individual settings */
  private applyConfig(override: Partial<IndividualConfig> = {}): GlobalConfig {
    return { ...this.toastrConfig, ...override };
  }

  /**
   * Find toast object by id
   */
  private _findToast(toastId: number): { index: number; activeToast: ActiveToast<any> } | null {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return { index: i, activeToast: this.toasts[i] };
      }
    }
    return null;
  }

  /**
   * Determines the need to run inside angular's zone then builds the toast
   */
  private _preBuildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig,
  ): ActiveToast<any> | null {
    if (config.onActivateTick) {
      return this.ngZone.run(() => this._buildNotification(toastType, message, title, config));
    }
    return this._buildNotification(toastType, message, title, config);
  }

  /**
   * Creates and attaches toast data to component
   * returns the active toast, or in case preventDuplicates is enabled the original/non-duplicate active toast.
   */
  private _buildNotification(
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig,
  ): ActiveToast<any> | null {
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
    const ins: ActiveToast<any> = {
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
