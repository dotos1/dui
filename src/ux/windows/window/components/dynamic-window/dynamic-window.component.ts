import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
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

      @ViewChild('container', { static: false, read: ViewContainerRef })
      public viewRef: ViewContainerRef;

    @ViewChild('content', { read: ViewContainerRef, static: true })
    private readonly contentViewRef: ViewContainerRef;

    @ViewChild(DraggableDirective, { static: true })
    private readonly draggableDirective: DraggableDirective;

    @ViewChild(ResizableDirective, { static: true })
    private readonly resizableDirective: ResizableDirective;

    outlet!: any;

    private moduleRef:NgModuleRef<any>;

    private _unsubscribeAll: Subject<void>;

    constructor(
        @Inject(SHARED_CONFIG) private readonly sharedConfig$: Observable<DynamicWindowConfig>,
        private readonly hostRef: ElementRef<HTMLElement>,
        private readonly globalEvents: ɵGlobalEvents,
        private readonly componentFactoryResolver: ComponentFactoryResolver,
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

    public ngOnInit(): void {

        this.initDynamicStateManager();
        this.initConfigObserver();
        this.initBeforeHiddenStateObserver();
        this.initIsHiddenStateObserver();
        this.initIsFullscreenStateObserver();
        this.initAfterClosedStateObserver();
        this.initWindowIdOrderObserver();
        this.initIsActiveObserver();
        this.initOutsideClickObserver();
        this._dotosConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this._themeService.loadTheme(duiWindowTheme);
        });
    }

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
        let bootstrapComponents=this.moduleRef['_bootstrapComponents'];
        if(bootstrapComponents&&bootstrapComponents.length>0){
          let comp=this.viewRef.createComponent(bootstrapComponents[0], { ngModuleRef: this.moduleRef });
          if(this.config.params){
            let conmInstance:any= comp.instance;
             conmInstance.init(this.config.params,this.config.path);
          }
        }
    }

    public override ngOnDestroy(): void {
      super.ngOnDestroy();
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
    }

    public onHideButtonClick(): void {
        if (this.config.isAllowHide) {
            this.windowRef.hide();
        }
    }

    public onFullscreenButtonClick(): void {
        if (this.config.isAllowFullscreen) {
            this.windowRef.toggleFullscreen();
        }
    }

    public onCloseButtonClick(): void {
        if (this.config.isAllowClose) {
            this.windowRef.close();
        }
    }

    public onDragStart(): void {
        if (this.config.isExitFullscreenByDragTitleBar && this.windowRef.isFullscreen) {
            this.draggableDirective.updateConfigWithoutChanges({
                shiftX: (this.widthAtWindowedMode / 2),
                shiftY: (this.titleBarElement.clientHeight / 2)
            });
        }
        this.changeDetector.detach();
    }

    public onDragging(): void {
        if (this.config.isExitFullscreenByDragTitleBar && this.windowRef.isFullscreen) {
            this.windowRef.goWindowed();
        }
    }

    public onDragEnd(): void {
        this.draggableDirective.updateConfigWithoutChanges({ shiftX: null, shiftY: null });
        this.changeDetector.reattach();
    }

    public onTitleBarDblClick(): void {
        if (this.config.isAllowFullscreen && this.config.isToggleFullscreenByDblClickOnTitleBar) {
            this.windowRef.toggleFullscreen();
        }
    }

    public onResizeStart(): void {
        this.changeDetector.detach();
    }

    public onResizing({ resizableElement }: ResizeInfo): void {
        this.widthAtWindowedMode = resizableElement.offsetWidth;
        this.heightAtWindowedMode = resizableElement.offsetHeight;
    }

    public onResizeEnd(): void {
        this.changeDetector.reattach();
    }

    private initChildComponent(componentType: Type<any>): void {
        const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        this.childComponentRef = this.contentViewRef.createComponent(factory);
    }

    private initDynamicStateManager(): void {
        this.dynamicStateManager.apply(DynamicState.Opening);
        this.dynamicStateManager
            .registerAfterStartCallback(() => this.changeDetector.detectChanges());
        this.dynamicStateManager
            .registerAfterEndCallback(() => this.changeDetector.markForCheck());
    }

    private initWindowSizes(): void {
        this.widthAtWindowedMode = (this.config.width ?? this.windowElement.offsetWidth);
        this.heightAtWindowedMode = (this.config.height ?? this.windowElement.offsetHeight);

        this.windowElement.style.setProperty(CssVariable.Width, `${this.widthAtWindowedMode}px`);
        this.windowElement.style.setProperty(CssVariable.Height, `${this.heightAtWindowedMode}px`);
    }

    private initHtmlElements(): void {
        this.windowElement = this.hostRef.nativeElement.querySelector('.dui-window');
        this.titleBarElement = this.windowElement.querySelector('.dui-title-bar');
        this.titleBarButtons = Array.from(
            this.titleBarElement.querySelectorAll('.dui-title-bar-button .dui-icon')
        );
    }

    private initMousedownObserver(): void {
        fromEvent(this.windowElement, 'mousedown')
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe(() => this.windowRef.makeActive());
    }

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

    private initWindowIdOrderObserver(): void {
        this.windowRef.orderIndex$
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe((orderIndex) => {
                this.windowOrderIndex = orderIndex;

                this.updateZIndex();
                this.changeDetector.detectChanges();
            });
    }

    private initBeforeHiddenStateObserver(): void {
        this.windowRef.beforeHidden$
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe(() => this.dynamicStateManager.apply(DynamicState.Hiding));
    }

    private initIsHiddenStateObserver(): void {
        this.windowRef.isHidden$
            .pipe(
                skip(1),
                filter((isHidden) => !isHidden),
                takeUntil(this.viewDestroyed$)
            )
            .subscribe(() => this.dynamicStateManager.apply(DynamicState.Showing));
    }

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

    private initAfterClosedStateObserver(): void {
        this.windowRef.afterClosed$
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe(() => this.dynamicStateManager.apply(DynamicState.Closing));
    }

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
