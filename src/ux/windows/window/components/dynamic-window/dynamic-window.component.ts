/**
 * @fileoverview Module `src/ux/windows/window/components/dynamic-window/dynamic-window.component.ts` providing dynamic window component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/dynamic-window/dynamic-window.component.ts`，提供动态窗口组件相关的定义与实现。
 */

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Injector,
    NgModuleRef,
    OnDestroy,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { combineLatest, fromEvent, Observable, Subject, timer } from 'rxjs';
import { filter, map, skip, skipUntil, takeUntil } from 'rxjs/operators';

import { ɵEventOutside } from '../../../core/helpers';
import { ɵGlobalEvents } from '../../../core/services/global-events.service';

import { DraggableDirective } from '../../../drag-and-drop';
import { ResizableDirective, ResizeInfo } from '../../../resizer';
import { DYNAMIC_WINDOW_SHARED_CONFIG as SHARED_CONFIG } from '../../data';
import {
    ɵDynamicStateEnum as DynamicState,
    ɵDynamicWindowCssVariableEnum as CssVariable
} from '../../enums';
import { ɵMergeConfigs } from '../../helpers';
import { DynamicWindowConfig } from '../../interfaces';
import { ɵBaseDynamicWindowComponent } from './base-dynamic-window.component';
import {  Router } from '@angular/router';
import { ThemeService } from '@dotos/dui/theme';
import { DotosConfigService } from '@dotos/dui/theme';
import { duiWindowTheme } from '../../../window.theme';


/**
 * Angular component `ɵDynamicWindowComponent` (selector: 'dui-dynamic-window') providing ɵdynamic window component presentation and interaction in `src/ux/windows/window/components/dynamic-window`.
 * @zh Angular 组件 `ɵDynamicWindowComponent`（selector: 'dui-dynamic-window'），提供ɵDynamic窗口组件的视图渲染与交互逻辑（位于 `src/ux/windows/window/components/dynamic-window`）。
 */
@Component({
    selector: 'dui-dynamic-window',
    templateUrl: './dynamic-window.component.html',
    host: {
        'class': 'dui-dynamic-window'
    },
    styleUrls: ['./window.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ɵDynamicWindowComponent
    extends ɵBaseDynamicWindowComponent
    implements OnInit, AfterViewInit,OnDestroy {

      /**
       * Template/content query reference `viewRef` (`ViewContainerRef`) targeting view ref.
       * @zh 模板/内容视图查询引用 `viewRef`（`@ViewChild`），指向视图引用。
       */
      @ViewChild('container', { static: false, read: ViewContainerRef })
      public viewRef: ViewContainerRef;

    /**
     * Template/content query reference `contentViewRef` (`ViewContainerRef`) targeting content view ref.
     * @zh 模板/内容视图查询引用 `contentViewRef`（`@ViewChild`），指向内容视图引用。
     */
    @ViewChild('content', { read: ViewContainerRef, static: true })
    private readonly contentViewRef: ViewContainerRef;

    /**
     * Template/content query reference `draggableDirective` (`DraggableDirective`) targeting draggable directive.
     * @zh 模板/内容视图查询引用 `draggableDirective`（`@ViewChild`），指向是否可拖拽指令。
     */
    @ViewChild(DraggableDirective, { static: true })
    private readonly draggableDirective: DraggableDirective;

    /**
     * Template/content query reference `resizableDirective` (`ResizableDirective`) targeting resizable directive.
     * @zh 模板/内容视图查询引用 `resizableDirective`（`@ViewChild`），指向是否可调尺寸指令。
     */
    @ViewChild(ResizableDirective, { static: true })
    private readonly resizableDirective: ResizableDirective;

    /**
     * Property `outlet` (`any`) storing outlet.
     * @zh 属性 `outlet`（类型：`any`），用于存储或配置outlet。
     */
    outlet;

    /**
     * Property `moduleRef` (`any`) storing module ref.
     * @zh 属性 `moduleRef`（类型：`any`），用于存储或配置模块引用。
     */
    private moduleRef;

    /**
     * Property `_unsubscribeAll` (`Subject<void>`) storing unsubscribe all.
     * @zh 属性 `_unsubscribeAll`（类型：`Subject<void>`），用于存储或配置取消订阅全部。
     */
    private _unsubscribeAll: Subject<void>;

    /**
     * Creates an instance of `ɵDynamicWindowComponent` and initializes its dependencies and internal state.
     * @zh 创建 `ɵDynamicWindowComponent` 实例，并初始化其依赖项与内部状态。
     * @param sharedConfig$ - Injected or initial shared config (`Observable<DynamicWindowConfig>`) / 注入或传入的共享配置（`Observable<DynamicWindowConfig>`）
     * @param hostRef - Injected or initial host ref (`ElementRef<HTMLElement>`) / 注入或传入的宿主引用（`ElementRef<HTMLElement>`）
     * @param globalEvents - Injected or initial global events (`ɵGlobalEvents`) / 注入或传入的全局事件集合（`ɵGlobalEvents`）
     * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
     * @param changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
     * @param matIconRegistry - Injected or initial mat icon registry (`MatIconRegistry`) / 注入或传入的Material图标Registry（`MatIconRegistry`）
     * @param domSanitizer - Injected or initial dom sanitizer (`DomSanitizer`) / 注入或传入的DOM节点安全清理器（`DomSanitizer`）
     * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
     * @param _themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
     * @param _dotosConfigService - Injected or initial dotos config service (`DotosConfigService`) / 注入或传入的DotOS配置服务（`DotosConfigService`）
     * @param _injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        @Inject(SHARED_CONFIG) private readonly sharedConfig$: Observable<DynamicWindowConfig>,
        private readonly hostRef: ElementRef<HTMLElement>,
        private readonly globalEvents: ɵGlobalEvents,
        private readonly changeDetector: ChangeDetectorRef,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        protected router: Router,
        protected _themeService: ThemeService,
        protected _dotosConfigService: DotosConfigService,
        private _injector: Injector
    ) {
        super();
        this._unsubscribeAll = new Subject();
    }

    /**
     * Angular lifecycle hook invoked once after component or directive inputs are initialized.
     * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
     */
    public ngOnInit(): void {

        this.initDynamicStateManager();
        this.initConfigObserver();
        this.initBeforeHiddenStateObserver();
        this.initIsHiddenStateObserver();
        this.initIsFullscreenStateObserver();
        this.initAfterClosedStateObserver();
        this.initWindowIdOrderObserver();
        this.initIsActiveObserver();
        this._dotosConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this._themeService.loadTheme(duiWindowTheme);
        });
    }

    /**
     * Angular lifecycle hook invoked once after the component's view and child views are initialized.
     * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
     */
    public override ngAfterViewInit(): void {
        super.ngAfterViewInit();
        if(this.childComponentType){
          this.initChildComponent(this.childComponentType);
        }
        this.initHtmlElements();
        this.initWindowSizes();
        this.initMousedownObserver();
        this.windowRef.setWindowElement(this.windowElement);
        this.windowRef.setDraggableDirective(this.draggableDirective);
        this.windowRef.setResizableDirective(this.resizableDirective);
        this.changeDetector.detectChanges();
      //  this.router.navigate('/de')
        let bootstrapComponents=this.moduleRef?.['_bootstrapComponents'];
        if(bootstrapComponents&&bootstrapComponents.length>0){
          let comp=this.viewRef.createComponent(bootstrapComponents[0], { ngModuleRef: this.moduleRef });
          if(this.config.params){
            let conmInstance= comp.instance as { init?: (...args: unknown[]) => void };
             conmInstance.init(this.config.params,this.config.path);
          }
        }
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    public override ngOnDestroy(): void {
      this.dynamicStateManager.destroy();
      super.ngOnDestroy();
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
    }

    /**
     * Executes `onHideButtonClick` to handle on hide button click.
     * @zh 执行 `onHideButtonClick`，用于当隐藏按钮点击。
     */
    public onHideButtonClick(): void {
        if (this.config.isAllowHide) {
            this.windowRef.hide();
        }
    }

    /**
     * Executes `onFullscreenButtonClick` to handle on fullscreen button click.
     * @zh 执行 `onFullscreenButtonClick`，用于当全屏按钮点击。
     */
    public onFullscreenButtonClick(): void {
        if (this.config.isAllowFullscreen) {
            this.windowRef.toggleFullscreen();
        }
    }

    /**
     * Executes `onCloseButtonClick` to handle on close button click.
     * @zh 执行 `onCloseButtonClick`，用于当关闭按钮点击。
     */
    public onCloseButtonClick(): void {
        if (this.config.isAllowClose) {
            this.windowRef.close();
        }
    }

    /**
     * Executes `onDragStart` to handle on drag start.
     * @zh 执行 `onDragStart`，用于当拖拽开始。
     */
    public onDragStart(): void {
        if (this.config.isExitFullscreenByDragTitleBar && this.windowRef.isFullscreen) {
            this.draggableDirective.updateConfigWithoutChanges({
                shiftX: (this.widthAtWindowedMode / 2),
                shiftY: (this.titleBarElement.clientHeight / 2)
            });
        }
        this.changeDetector.detach();
    }

    /**
     * Executes `onDragging` to handle on dragging.
     * @zh 执行 `onDragging`，用于当拖拽中。
     */
    public onDragging(): void {
        if (this.config.isExitFullscreenByDragTitleBar && this.windowRef.isFullscreen) {
            this.windowRef.goWindowed();
        }
    }

    /**
     * Executes `onDragEnd` to handle on drag end.
     * @zh 执行 `onDragEnd`，用于当拖拽结束。
     */
    public onDragEnd(): void {
        this.draggableDirective.updateConfigWithoutChanges({ shiftX: null, shiftY: null });
        this.changeDetector.reattach();
    }

    /**
     * Executes `onTitleBarDblClick` to handle on title bar dbl click.
     * @zh 执行 `onTitleBarDblClick`，用于当标题条Dbl点击。
     */
    public onTitleBarDblClick(): void {
        if (this.config.isAllowFullscreen && this.config.isToggleFullscreenByDblClickOnTitleBar) {
            this.windowRef.toggleFullscreen();
        }
    }

    /**
     * Executes `onResizeStart` to handle on resize start.
     * @zh 执行 `onResizeStart`，用于当调整尺寸开始。
     */
    public onResizeStart(): void {
        this.changeDetector.detach();
    }

    /**
     * Executes `onResizing` to handle on resizing.
     * @zh 执行 `onResizing`，用于当调整尺寸中。
     * @param options - { resizable element } parameter (`ResizeInfo`) / {是否可调尺寸元素}参数（`ResizeInfo`）
     */
    public onResizing({ resizableElement }: ResizeInfo): void {
        this.widthAtWindowedMode = resizableElement.offsetWidth;
        this.heightAtWindowedMode = resizableElement.offsetHeight;
    }

    /**
     * Executes `onResizeEnd` to handle on resize end.
     * @zh 执行 `onResizeEnd`，用于当调整尺寸结束。
     */
    public onResizeEnd(): void {
        this.changeDetector.reattach();
    }

    /**
     * Executes `initChildComponent` to handle init child component.
     * @zh 执行 `initChildComponent`，用于初始化子级组件。
     * @param componentType - component type parameter (`Type<unknown>`) / 组件类型参数（`Type<unknown>`）
     */
    private initChildComponent(componentType: Type<unknown>): void {
        this.childComponentRef = this.contentViewRef.createComponent(componentType);
    }

    /**
     * Executes `initDynamicStateManager` to handle init dynamic state manager.
     * @zh 执行 `initDynamicStateManager`，用于初始化动态状态管理器。
     */
    private initDynamicStateManager(): void {
        this.dynamicStateManager.apply(DynamicState.Opening);
        this.dynamicStateManager
            .registerAfterStartCallback(() => this.changeDetector.detectChanges());
        this.dynamicStateManager
            .registerAfterEndCallback(() => this.changeDetector.markForCheck());
    }

    /**
     * Executes `initWindowSizes` to handle init window sizes.
     * @zh 执行 `initWindowSizes`，用于初始化窗口尺寸列表。
     */
    private initWindowSizes(): void {
        this.widthAtWindowedMode = (this.config.width ?? this.windowElement.offsetWidth);
        this.heightAtWindowedMode = (this.config.height ?? this.windowElement.offsetHeight);

        this.windowElement.style.setProperty(CssVariable.Width, `${this.widthAtWindowedMode}px`);
        this.windowElement.style.setProperty(CssVariable.Height, `${this.heightAtWindowedMode}px`);
    }

    /**
     * Executes `initHtmlElements` to handle init html elements.
     * @zh 执行 `initHtmlElements`，用于初始化HTML内容元素列表。
     */
    private initHtmlElements(): void {
        this.windowElement = this.hostRef.nativeElement.querySelector('.dui-window');
        this.titleBarElement = this.windowElement.querySelector('.dui-title-bar');
        this.titleBarButtons = Array.from(
            this.titleBarElement.querySelectorAll('.dui-title-bar-button .dui-icon')
        );
    }

    /**
     * Executes `initMousedownObserver` to handle init mousedown observer.
     * @zh 执行 `initMousedownObserver`，用于初始化鼠标按下观察者。
     */
    private initMousedownObserver(): void {
        fromEvent(this.windowElement, 'mousedown')
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe(() => this.windowRef.makeActive());
    }

    /**
     * Executes `initOutsideClickObserver` to handle init outside click observer.
     * @zh 执行 `initOutsideClickObserver`，用于初始化外部点击观察者。
     */
    private initOutsideClickObserver(): void {
        this.globalEvents.fromDocument('click')
            .pipe(
                skipUntil(timer(4)),
                filter(() => this.isWindowed || this.isFullscreen),
                filter((event) => ɵEventOutside.checkForElement(this.windowElement, event)),
                takeUntil(this._viewDestroyedOrWindowInactive$)
            )
            .subscribe(() => this.windowRef.makeInactive());
    }

    /**
     * Executes `initWindowIdOrderObserver` to handle init window id order observer.
     * @zh 执行 `initWindowIdOrderObserver`，用于初始化窗口唯一标识顺序观察者。
     */
    private initWindowIdOrderObserver(): void {
        this.windowRef.orderIndex$
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe((orderIndex) => {
                this.windowOrderIndex = orderIndex;

                this.updateZIndex();
                this.changeDetector.detectChanges();
            });
    }

    /**
     * Executes `initBeforeHiddenStateObserver` to handle init before hidden state observer.
     * @zh 执行 `initBeforeHiddenStateObserver`，用于初始化之前隐藏状态观察者。
     */
    private initBeforeHiddenStateObserver(): void {
        this.windowRef.beforeHidden$
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe(() => this.dynamicStateManager.apply(DynamicState.Hiding));
    }

    /**
     * Executes `initIsHiddenStateObserver` to handle init is hidden state observer.
     * @zh 执行 `initIsHiddenStateObserver`，用于初始化是否为隐藏状态观察者。
     */
    private initIsHiddenStateObserver(): void {
        this.windowRef.isHidden$
            .pipe(
                skip(1),
                filter((isHidden) => !isHidden),
                takeUntil(this.viewDestroyed$)
            )
            .subscribe(() => this.dynamicStateManager.apply(DynamicState.Showing));
    }

    /**
     * Executes `initIsFullscreenStateObserver` to handle init is fullscreen state observer.
     * @zh 执行 `initIsFullscreenStateObserver`，用于初始化是否为全屏状态观察者。
     */
    private initIsFullscreenStateObserver(): void {
        this.windowRef.isFullscreen$
            .pipe(
                skip(1),
                map((state) => (
                    (state) ?
                        DynamicState.EnteringFullscreen :
                        DynamicState.EnteringWindowed
                )),
                takeUntil(this.viewDestroyed$)
            )
            .subscribe((dynamicState) => this.dynamicStateManager.apply(dynamicState));
    }

    /**
     * Executes `initIsActiveObserver` to handle init is active observer.
     * @zh 执行 `initIsActiveObserver`，用于初始化是否为激活观察者。
     */
    private initIsActiveObserver(): void {
        this.windowRef.isActive$
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe((isActive) => {
                if (isActive) {
                    this.initOutsideClickObserver();
                }
                this.changeDetector.detectChanges();
            });
    }

    /**
     * Executes `initAfterClosedStateObserver` to handle init after closed state observer.
     * @zh 执行 `initAfterClosedStateObserver`，用于初始化之后是否关闭状态观察者。
     */
    private initAfterClosedStateObserver(): void {
        this.windowRef.afterClosed$
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe(() => this.dynamicStateManager.apply(DynamicState.Closing));
    }

    /**
     * Executes `initConfigObserver` to handle init config observer.
     * @zh 执行 `initConfigObserver`，用于初始化配置观察者。
     */
    private initConfigObserver(): void {
        combineLatest([
            this.sharedConfig$,
            this.windowRef.config$
        ]).pipe(takeUntil(this.viewDestroyed$))
            .subscribe(([sharedConfig, updatedConfig]) => {
                 this.config = ɵMergeConfigs(updatedConfig, sharedConfig);
                this.moduleRef=updatedConfig.moduleRef;
                this.changeDetector.detectChanges();
            });
    }
}
