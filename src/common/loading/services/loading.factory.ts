/**
 * @fileoverview Module `src/common/loading/services/loading.factory.ts` providing loading factory definitions and implementation.
 * @zh 模块文件 `src/common/loading/services/loading.factory.ts`，提供加载中工厂相关的定义与实现。
 */

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

/**
 * Interface `IInternalLoadingOptions` defining the contract and properties for i internal loading options.
 * @zh 接口 `IInternalLoadingOptions`，定义I内部加载中配置选项的数据结构契约与属性规范。
 */
export interface IInternalLoadingOptions extends ILoadingConfig {
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  height?: number;
  /**
   * Property `style` (`LoadingStyle`) storing style.
   * @zh 属性 `style`（类型：`LoadingStyle`），用于存储或配置样式。
   */
  style?: LoadingStyle;
}

/**
 * Interface `ILoadingRef` defining the contract and properties for i loading ref.
 * @zh 接口 `ILoadingRef`，定义I加载中引用的数据结构契约与属性规范。
 */
export interface ILoadingRef {
  /**
   * Property `observable` (`Observable<number>`) storing observable.
   * @zh 属性 `observable`（类型：`Observable<number>`），用于存储或配置可观察流。
   */
  observable: Observable<number>;
  /**
   * Property `componentRef` (`ComponentRef<LoadingComponent>`) storing component ref.
   * @zh 属性 `componentRef`（类型：`ComponentRef<LoadingComponent>`），用于存储或配置组件引用。
   */
  componentRef?: ComponentRef<LoadingComponent>;
  /**
   * Property `overlayRef` (`OverlayRef`) storing overlay ref.
   * @zh 属性 `overlayRef`（类型：`OverlayRef`），用于存储或配置浮层引用。
   */
  overlayRef?: OverlayRef;
  /**
   * Property `contentRef` (`EmbeddedViewRef<object>`) storing content ref.
   * @zh 属性 `contentRef`（类型：`EmbeddedViewRef<object>`），用于存储或配置内容引用。
   */
  contentRef?: EmbeddedViewRef<object>;
  /**
   * Property `subject` (`Subject<number>`) storing subject.
   * @zh 属性 `subject`（类型：`Subject<number>`），用于存储或配置主题流。
   */
  subject: Subject<number>;
  /**
   * Property `times` (`number`) storing times.
   * @zh 属性 `times`（类型：`number`），用于存储或配置时间。
   */
  times: number;
  /**
   * #1001：是否阻塞屏幕交互。缺省 false（非阻塞，指示器仅显示状态，点击穿透到底层内容）；
   * 为 true 时全屏遮罩拦截交互（保持旧的锁屏行为）。

   * @zh #1001：是否阻塞屏幕交互。缺省 false（非阻塞，指示器仅显示状态，点击穿透到底层内容）；
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
  /**
   * Creates an instance of `LoadingFactory` and initializes its dependencies and internal state.
   * @zh 创建 `LoadingFactory` 实例，并初始化其依赖项与内部状态。
   * @param _componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param _overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param _injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
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

  /**
   * Executes `_createOverlay` to handle create overlay.
   * @zh 执行 `_createOverlay`，用于创建浮层。
   * @param blocking - blocking parameter (`boolean`) / 块参数（`boolean`）
   * @returns Result of type `OverlayRef` / 类型为 `OverlayRef` 的返回值
   */
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

  /**
   * Executes `_createComponent` to handle create component.
   * @zh 执行 `_createComponent`，用于创建组件。
   * @param options - options parameter (`IInternalLoadingOptions`) / 配置选项参数（`IInternalLoadingOptions`）
   * @returns Result of type `ILoadingRef` / 类型为 `ILoadingRef` 的返回值
   */
  private _createComponent(options: IInternalLoadingOptions): ILoadingRef {
    const compRef: ILoadingRef = this._initializeContext();
    compRef.componentRef = this._componentFactoryResolver
      .resolveComponentFactory(LoadingComponent)
      .create(this._injector);
    this._mapOptions(options, compRef.componentRef.instance);
    return compRef;
  }

  /**
   * Executes `_initializeContext` to handle initialize context.
   * @zh 执行 `_initializeContext`，用于初始化上下文。
   * @returns Result of type `ILoadingRef` / 类型为 `ILoadingRef` 的返回值
   */
  private _initializeContext(): ILoadingRef {
    const subject = new Subject<number>();
    return {
      observable: subject.asObservable(),
      subject,
      componentRef: undefined,
      times: 0,
    };
  }

  /**
   * Executes `_mapOptions` to handle map options.
   * @zh 执行 `_mapOptions`，用于映射表配置选项。
   * @param options - options parameter (`IInternalLoadingOptions`) / 配置选项参数（`IInternalLoadingOptions`）
   * @param instance - instance parameter (`LoadingComponent`) / 实例参数（`LoadingComponent`）
   */
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

/**
 * Executes `LOADING_FACTORY_PROVIDER_FACTORY` to handle loading factory provider factory.
 * @zh 执行 `LOADING_FACTORY_PROVIDER_FACTORY`，用于加载中工厂提供者工厂。
 * @param parent - parent parameter (`LoadingFactory`) / 父级参数（`LoadingFactory`）
 * @param componentFactoryResolver - component factory resolver parameter (`ComponentFactoryResolver`) / 组件工厂解析器参数（`ComponentFactoryResolver`）
 * @param overlay - overlay parameter (`Overlay`) / 浮层参数（`Overlay`）
 * @param injector - injector parameter (`Injector`) / 注入器参数（`Injector`）
 * @returns Result of type `LoadingFactory` / 类型为 `LoadingFactory` 的返回值
 */
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

/**
 * Constant/variable `LOADING_FACTORY_PROVIDER` defining loading factory provider in `src/common/loading/services`.
 * @zh 常量/变量 `LOADING_FACTORY_PROVIDER`，定义 `src/common/loading/services` 中的加载中工厂提供者。
 */
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