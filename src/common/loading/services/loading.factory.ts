import {
  Injectable,
  ComponentFactoryResolver,
  Provider,
  SkipSelf,
  Optional,
  EmbeddedViewRef,
} from '@angular/core';
import {
  Injector,
  ComponentRef,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';
import { TemplatePortal, ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { LoadingContext } from '../directives/loading.directive';
import { LoadingComponent, LoadingStyle } from '../loading.component';
import { ILoadingConfig } from './loading.service';

export interface IInternalLoadingOptions extends ILoadingConfig {
  height?: number;
  style?: LoadingStyle;
}

export interface ILoadingRef {
  observable: Observable<any>;
  componentRef?: ComponentRef<any>;
  overlayRef?: OverlayRef;
  contentRef?: EmbeddedViewRef<object>;
  subject: Subject<any>;
  times: number;
  /**
   * #1001：是否阻塞屏幕交互。缺省 false（非阻塞，指示器仅显示状态，点击穿透到底层内容）；
   * 为 true 时全屏遮罩拦截交互（保持旧的锁屏行为）。
   */
  blocking?: boolean;
}
/**
 * Low-level factory that creates and manages {@link LoadingComponent} instances for the three
 * loading presentation styles (full-screen overlay, positioned overlay, in-place replace);
 * used internally by {@link LoadingService}.
 * @zh 低层工厂，为三种加载展示样式（全屏覆盖、定位覆盖、原地替换）创建并管理
 * {@link LoadingComponent} 实例；供 {@link LoadingService} 内部使用。
 */
@Injectable()
export class LoadingFactory {
  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _overlay: Overlay,
    private _injector: Injector
  ) {}
  /**
   * Creates a full-screen loading overlay, shown/hidden based on the returned ref's
   * registration counter.
   * @zh 创建全屏加载覆盖层，其显示/隐藏由返回的 ref 的注册计数器驱动。
   */
  public createFullScreenComponent(options: ILoadingConfig): ILoadingRef {
    (<IInternalLoadingOptions>options).height = undefined;
    (<IInternalLoadingOptions>options).style = LoadingStyle.FullScreen;
    const loadingRef: ILoadingRef = this._initializeContext();
    let loading = false;
    let overlayRef: OverlayRef;
    loadingRef.observable
      .pipe(distinctUntilChanged())
      .subscribe((registered: number) => {
        if (registered > 0 && !loading) {
          loading = true;
          overlayRef = this._createOverlay(loadingRef.blocking);
          loadingRef.overlayRef = overlayRef;
          loadingRef.componentRef = overlayRef.attach(
            new ComponentPortal(LoadingComponent)
          );
          this._mapOptions(options, loadingRef.componentRef?.instance);
          loadingRef.componentRef?.instance.show();
          loadingRef.componentRef?.changeDetectorRef.detectChanges();
        } else if (registered <= 0 && loading) {
          loading = false;
          loadingRef.componentRef?.instance.hide();
          loadingRef.componentRef?.destroy();
          overlayRef.detach();
          overlayRef.dispose();
          loadingRef.overlayRef = undefined;
        }
      });
    return loadingRef;
  }

  /**
   * Creates a loading indicator that overlays the given template's content in place,
   * shown/hidden based on the returned ref's registration counter.
   * @zh 创建一个覆盖在给定模板内容之上的加载指示器，其显示/隐藏由返回的 ref 的注册计数器驱动。
   */
  public createOverlayComponent(
    options: ILoadingConfig,
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<object>
  ): ILoadingRef {
    (<IInternalLoadingOptions>options).height = undefined;
    (<IInternalLoadingOptions>options).style = LoadingStyle.Overlay;
    const loadingRef: ILoadingRef = this._createComponent(options);
    let loading = false;

    if (loadingRef.componentRef) {
      loadingRef.componentRef.instance.content = new TemplatePortal(
        templateRef,
        viewContainerRef
      );
      viewContainerRef.clear();
      viewContainerRef.insert(loadingRef.componentRef?.hostView, 0);
    }

    loadingRef.observable
      .pipe(distinctUntilChanged())
      .subscribe((registered: number) => {
        if (registered > 0 && !loading) {
          loading = true;
          loadingRef.componentRef?.instance.show();
        } else if (registered <= 0 && loading) {
          loading = false;
          loadingRef.componentRef?.instance.hide();
        }
      });
    return loadingRef;
  }


  /**
   * Creates a loading indicator that swaps in place of the given template's content while
   * loading, restoring the original content once resolved.
   * @zh 创建一个在加载期间取代给定模板内容位置的加载指示器，解析完成后恢复原有内容。
   */
  public createReplaceComponent(
    options: ILoadingConfig,
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<object>,
    context: LoadingContext
  ): ILoadingRef {
    const nativeElement: HTMLElement = <HTMLElement>(
      templateRef.elementRef.nativeElement
    );
    (<IInternalLoadingOptions>options).height = nativeElement.nextElementSibling
      ? nativeElement.nextElementSibling.scrollHeight
      : undefined;
    (<IInternalLoadingOptions>options).style = LoadingStyle.None;
    const loadingRef: ILoadingRef = this._createComponent(options);
    let loading = false;
    const contentRef: EmbeddedViewRef<object> =
      viewContainerRef.createEmbeddedView(templateRef, context);
    loadingRef.contentRef = contentRef;
    loadingRef.observable
      .pipe(distinctUntilChanged())
      .subscribe((registered: number) => {
        if (registered > 0 && !loading && loadingRef.componentRef) {
          loading = true;
          const index: number = viewContainerRef.indexOf(
            loadingRef.componentRef.hostView
          );
          if (index < 0) {
            viewContainerRef.detach(viewContainerRef.indexOf(contentRef));
            viewContainerRef.insert(loadingRef.componentRef.hostView, 0);
          }
          loadingRef.componentRef?.instance.show();
        } else if (registered <= 0 && loading && loadingRef.componentRef) {
          loading = false;
          loadingRef.componentRef?.instance.hide();
          // detach loader and attach the content if content is there
          const index: number = viewContainerRef.indexOf(contentRef);
          if (index < 0) {
            viewContainerRef.detach(
              viewContainerRef.indexOf(loadingRef.componentRef.hostView)
            );
            viewContainerRef.insert(contentRef, 0);
          }

          contentRef.detectChanges();
          contentRef.markForCheck();
        }
      });
    return loadingRef;
  }

  private _createOverlay(blocking: boolean = false): OverlayRef {
    const state: OverlayConfig = new OverlayConfig();
    state.hasBackdrop = false;
    // #1001：非阻塞(缺省)时给 pane 加 dui-loading-nonblocking，使其 pointer-events:none，
    // 点击穿透到底层内容——加载中仍可操作，进度条仅作状态显示；
    // blocking=true 时用 dui-loading-blocking，保持 pane 拦截交互的旧行为。
    state.panelClass = blocking
      ? 'dui-loading-blocking'
      : 'dui-loading-nonblocking';
    state.positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    return this._overlay.create(state);
  }

  private _createComponent(options: IInternalLoadingOptions): ILoadingRef {
    const compRef: ILoadingRef = this._initializeContext();
    compRef.componentRef = this._componentFactoryResolver
      .resolveComponentFactory(LoadingComponent)
      .create(this._injector);
    this._mapOptions(options, compRef.componentRef.instance);
    return compRef;
  }

  private _initializeContext(): ILoadingRef {
    const subject: Subject<any> = new Subject<any>();
    return {
      observable: subject.asObservable(),
      subject,
      componentRef: undefined,
      times: 0,
    };
  }

  private _mapOptions(
    options: IInternalLoadingOptions,
    instance: LoadingComponent
  ): void {
    if (options.style) {
      instance.style = options.style;
    }

    if (options.type !== undefined) {
      instance.type = options.type;
    }
    if (options.height !== undefined) {
      instance.height = options.height;
    }
    if (options.mode !== undefined) {
      instance.mode = options.mode;
    }
    if (options.color !== undefined) {
      instance.color = options.color;
    }
  }
}

export function LOADING_FACTORY_PROVIDER_FACTORY(
  parent: LoadingFactory,
  componentFactoryResolver: ComponentFactoryResolver,
  overlay: Overlay,
  injector: Injector
): LoadingFactory {
  return (
    parent || new LoadingFactory(componentFactoryResolver, overlay, injector)
  );
}

export const LOADING_FACTORY_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: LoadingFactory,
  deps: [
    [new Optional(), new SkipSelf(), LoadingFactory],
    ComponentFactoryResolver,
    Overlay,
    Injector,
  ],
  useFactory: LOADING_FACTORY_PROVIDER_FACTORY,
};