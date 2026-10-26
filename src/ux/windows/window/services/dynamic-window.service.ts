/**
 * @fileoverview Module `src/ux/windows/window/services/dynamic-window.service.ts` providing dynamic window service definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/services/dynamic-window.service.ts`，提供动态窗口服务相关的定义与实现。
 */

import { DOCUMENT } from '@angular/common';
import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Inject,
    Injectable,
    Injector,
    Type
} from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ɵDynamicWindowInjector, ɵDynamicWindowRefModel } from '../classes';
import { ɵDynamicWindowComponent } from '../components';
import { DynamicWindowConfig, DynamicWindowRef, ɵDynamicWindowInputParams } from '../interfaces';
import { ɵDynamicWindowReferencesService } from './dynamic-window-references.service';

/**
 * Allows open your component inside an dui-styled window *
 * @zh 可注入的 Angular 服务 `DynamicWindowService`，管理 `src/ux/windows/window/services` 中的动态窗口服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class DynamicWindowService {

   /**
    * Property `windowSet` (`Map<string,ɵDynamicWindowRefModel>`) storing window set.
    * @zh 属性 `windowSet`（类型：`Map<string,ɵDynamicWindowRefModel>`），用于存储或配置窗口集合。
    */
   public windowSet:Map<string,ɵDynamicWindowRefModel>=new  Map<string,ɵDynamicWindowRefModel>();

    /**
     * Contains references to windows opened via the service
     * @zh 获取当前引用（`references$: Observable<DynamicWindowRef[]>`）。
     */
    public get references$(): Observable<DynamicWindowRef[]> {
        return this.referencesService.data$;
    }

    /**
     * Contains references to windows opened via the service
     * @zh 获取当前引用（`references: DynamicWindowRef[]`）。
     */
    public get references(): DynamicWindowRef[] {
        return this.referencesService.data;
    }

    /**
     * Creates an instance of `DynamicWindowService` and initializes its dependencies and internal state.
     * @zh 创建 `DynamicWindowService` 实例，并初始化其依赖项与内部状态。
     * @param document - Injected or initial document (`Document`) / 注入或传入的文档对象（`Document`）
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
     * @param applicationRef - Injected or initial application ref (`ApplicationRef`) / 注入或传入的application引用（`ApplicationRef`）
     * @param referencesService - Injected or initial references service (`ɵDynamicWindowReferencesService`) / 注入或传入的引用服务（`ɵDynamicWindowReferencesService`）
     */
    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly injector: Injector,
        private readonly componentFactoryResolver: ComponentFactoryResolver,
        private readonly applicationRef: ApplicationRef,
        private readonly referencesService: ɵDynamicWindowReferencesService
    ) {}

    /**
     * Opens a window containing the given component
     * @zh 执行 `open`，用于打开。
     */
    public open(component: Type<unknown>, config: DynamicWindowConfig = {}): DynamicWindowRef {
        const windowRef = this.createDynamicWindow();
        this.referencesService.register(windowRef, config);
        this.applyDataForCreatedWindowInstance({ component, windowRef });
        return windowRef;
    }

    /**
     * Executes `openWindow` to handle open window.
     * @zh 执行 `openWindow`，用于打开窗口。
     * @param config - config parameter (`DynamicWindowConfig`) / 配置参数（`DynamicWindowConfig`）
     * @returns Result of type `DynamicWindowRef` / 类型为 `DynamicWindowRef` 的返回值
     */
    public openWindow(config: DynamicWindowConfig = {}): DynamicWindowRef {
      if(this.windowSet.has(config.id)){
        const windowRef = this.windowSet.get(config.id);
        windowRef.show();
        windowRef.makeActive();
        return windowRef;
      }else{
        const windowRef = this.createDynamicWindow();
        this.windowSet.set(config.id,windowRef);
        this.referencesService.register(windowRef, config);
        return windowRef;
      }
    }

    /**
     * Executes `hideAll` to handle hide all.
     * @zh 执行 `hideAll`，用于隐藏全部。
     */
    public hideAll(): void {
      this.references
          .forEach((windowRef) => windowRef.hide());
    }

    /**
     * Executes `showAll` to handle show all.
     * @zh 执行 `showAll`，用于显示全部。
     */
    public showAll(): void {
      this.references
          .forEach((windowRef) => windowRef.show());
    }

    /**
     * Closes all windows
     * @zh 执行 `closeAll`，用于关闭全部。
     */
    public closeAll(): void {
        this.references
            .forEach((windowRef) => windowRef.close());
    }

    /**
     * Executes `createDynamicWindow` to handle create dynamic window.
     * @zh 执行 `createDynamicWindow`，用于创建动态窗口。
     * @returns Result of type `ɵDynamicWindowRefModel` / 类型为 `ɵDynamicWindowRefModel` 的返回值
     */
    private createDynamicWindow(): ɵDynamicWindowRefModel {
        const windowRef = new ɵDynamicWindowRefModel();

        windowRef.afterClosed$.subscribe(()=>{
          this.windowSet.delete( windowRef.config.id);
        });

        const windowInjector = new ɵDynamicWindowInjector({ injector: this.injector, windowRef });
        const componentRef = this.createComponentRef(windowInjector);
        windowRef.setComponentRef(componentRef);
        this.initWindowRefAfterClosedObserver(windowRef, componentRef);
        this.appendWindowComponentToBody(componentRef);
        return windowRef;
    }

    /**
     * Executes `createComponentRef` to handle create component ref.
     * @zh 执行 `createComponentRef`，用于创建组件引用。
     * @param windowInjector - window injector parameter (`ɵDynamicWindowInjector`) / 窗口注入器参数（`ɵDynamicWindowInjector`）
     * @returns Result of type `ComponentRef<ɵDynamicWindowComponent>` / 类型为 `ComponentRef<ɵDynamicWindowComponent>` 的返回值
     */
    private createComponentRef(
        windowInjector: ɵDynamicWindowInjector
    ): ComponentRef<ɵDynamicWindowComponent> {
        return this.componentFactoryResolver
            .resolveComponentFactory(ɵDynamicWindowComponent)
            .create(windowInjector);
    }

    /**
     * Executes `appendWindowComponentToBody` to handle append window component to body.
     * @zh 执行 `appendWindowComponentToBody`，用于追加窗口组件转换为主体。
     * @param componentRef - component ref parameter (`ComponentRef<ɵDynamicWindowComponent>`) / 组件引用参数（`ComponentRef<ɵDynamicWindowComponent>`）
     */
    private appendWindowComponentToBody(componentRef: ComponentRef<ɵDynamicWindowComponent>): void {
        const componentHostView = componentRef.hostView as EmbeddedViewRef<unknown>;
        const componentHtmlElement = componentHostView.rootNodes[0] as HTMLElement;

        this.applicationRef.attachView(componentHostView);
        this.document.body.appendChild(componentHtmlElement);
    }

    /**
     * Executes `initWindowRefAfterClosedObserver` to handle init window ref after closed observer.
     * @zh 执行 `initWindowRefAfterClosedObserver`，用于初始化窗口引用之后是否关闭观察者。
     * @param windowRef - window ref parameter (`ɵDynamicWindowRefModel`) / 窗口引用参数（`ɵDynamicWindowRefModel`）
     * @param componentRef - component ref parameter (`ComponentRef<ɵDynamicWindowComponent>`) / 组件引用参数（`ComponentRef<ɵDynamicWindowComponent>`）
     */
    private initWindowRefAfterClosedObserver(
        windowRef: ɵDynamicWindowRefModel,
        componentRef: ComponentRef<ɵDynamicWindowComponent>
    ): void {
        const destroyDelayInMs = 300;

        windowRef.afterClosed$
            .pipe(
                tap(() => this.referencesService.remove(windowRef)),
                delay(destroyDelayInMs)
            )
            .subscribe(() => componentRef.destroy());
    }

    /**
     * Executes `applyDataForCreatedWindowInstance` to handle apply data for created window instance.
     * @zh 执行 `applyDataForCreatedWindowInstance`，用于应用数据用于已创建窗口实例。
     * @param options - { window ref, component } parameter (`ɵDynamicWindowInputParams`) / {窗口Ref,组件}参数（`ɵDynamicWindowInputParams`）
     */
    private applyDataForCreatedWindowInstance(
        { windowRef, component }: ɵDynamicWindowInputParams
    ): void {
        const { instance: windowInstance } = windowRef.componentRef;
        windowInstance.childComponentType = component;
        windowInstance.windowRef = windowRef;
    }
}
