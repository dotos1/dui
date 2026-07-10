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
  subject: Subject<any>;
  times: number;
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
          overlayRef = this._createOverlay();
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
        }
      });
    return loadingRef;
  }

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

  private _createOverlay(): OverlayRef {
    const state: OverlayConfig = new OverlayConfig();
    state.hasBackdrop = false;
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