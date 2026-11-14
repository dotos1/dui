/**
 * @fileoverview Module `src/container/dock-layout/dock-layout-host.component.ts` providing dock layout host component definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/dock-layout-host.component.ts`，提供停靠面板布局宿主组件相关的定义与实现。
 */

import {
  ApplicationRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { ThemeService } from '@dotos/dui/theme';
import { DockLayoutComponentService } from "./dock-layout-component.service";
import { ComponentContainer } from "./container/component-container";
import { ResolvedComponentItemConfig } from "./config/resolved-config";
import { DockLayout } from "./dock-layout";
import { TranslateService } from "@dotos/dui/translator";


/**
 * Constant/variable `dock_LAYOUT_TAG_NAME` defining dock layout tag name in `src/container/dock-layout`.
 * @zh 常量/变量 `dock_LAYOUT_TAG_NAME`，定义 `src/container/dock-layout` 中的停靠面板布局标签名称。
 */
export const dock_LAYOUT_TAG_NAME = "dock-layout-host";

/**
 * Angular component `DockLayoutHostComponent` providing dock layout host component presentation and interaction in `src/container/dock-layout`.
 * @zh Angular 组件 `DockLayoutHostComponent`，提供停靠面板布局宿主组件的视图渲染与交互逻辑（位于 `src/container/dock-layout`）。
 */
@Component({
  selector: dock_LAYOUT_TAG_NAME,
  template: "",
  styleUrls: ['./dock-layout-base.scss','./dock-layout-theme.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class DockLayoutHostComponent implements OnInit,OnDestroy {
  /**
   * Property `_dockLayout` (`DockLayout`) storing dock layout.
   * @zh 属性 `_dockLayout`（类型：`DockLayout`），用于存储或配置停靠面板布局。
   */
  private _dockLayout: DockLayout;
  /**
   * Property `_containerMap` (`Map<ComponentContainer, ComponentRef<unknown>>`) storing container map.
   * @zh 属性 `_containerMap`（类型：`Map<ComponentContainer, ComponentRef<unknown>>`），用于存储或配置容器映射表。
   */
  private _containerMap = new Map<ComponentContainer, ComponentRef<unknown>>();
  /**
   * Property `_windowResizeListener` (`() => void`) storing window resize listener (default: `() => this.handleWindowResizeEvent()`).
   * @zh 属性 `_windowResizeListener`（类型：`() => void`），用于存储或配置窗口调整尺寸监听器（默认值：`() => this.handleWindowResizeEvent()`）。
   */
  private _windowResizeListener = () => this.handleWindowResizeEvent();

  /**
   * Output event emitter `layoutChanged` (`EventEmitter<void>`) firing when layout changed occurs.
   * @zh 输出事件 `layoutChanged`（类型：`EventEmitter<void>`），当触发布局已变更时向外发出事件。
   */
  @Output()
  layoutChanged = new EventEmitter<void>();


  /**
   * Output event emitter `activeStackChanged` (`EventEmitter<any>`) firing when active stack changed occurs.
   * @zh 输出事件 `activeStackChanged`（类型：`EventEmitter<any>`），当触发激活栈已变更时向外发出事件。
   */
  @Output()
  activeStackChanged = new EventEmitter();


  /**
   * Gets the current dock layout (`dockLayout: any`).
   * @zh 获取当前停靠面板布局（`dockLayout: any`）。
   */
  get dockLayout() {
    return this._dockLayout;
  }

  /**
   * Creates an instance of `DockLayoutHostComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DockLayoutHostComponent` 实例，并初始化其依赖项与内部状态。
   * @param translator - Injected or initial translator (`TranslateService`) / 注入或传入的翻译器（`TranslateService`）
   * @param _elRef - Injected or initial el ref (`ElementRef<HTMLElement>`) / 注入或传入的DOM元素引用（`ElementRef<HTMLElement>`）
   * @param appRef - Injected or initial app ref (`ApplicationRef`) / 注入或传入的app引用（`ApplicationRef`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param dockLayoutComponentService - Injected or initial dock layout component service (`DockLayoutComponentService`) / 注入或传入的停靠面板布局组件服务（`DockLayoutComponentService`）
   */
  constructor(
    protected translator:TranslateService,
    private _elRef: ElementRef<HTMLElement>,
    private appRef: ApplicationRef,
    protected themeService: ThemeService,
    private dockLayoutComponentService: DockLayoutComponentService
  ) {
    this._dockLayout = new DockLayout(translator,this._elRef.nativeElement);

    this._dockLayout.getComponentEvent = (container, itemConfig) =>
      this.handleGetComponentEvent(container, itemConfig);

    this._dockLayout.releaseComponentEvent = (container) =>
      this.handleReleaseComponentEvent(container);

    this._dockLayout.on('stateChanged',()=>{
      this.layoutChanged.emit();
    });

    this._dockLayout.on('stackContentClick',(val:{ target? })=>{
      this.activeStackChanged.emit(val.target);
    });

    this._dockLayout.on('activeContentItemChanged',(val)=>{
     // let parentItem=val.parentItem;
      this.activeStackChanged.emit(val);
    });

    globalThis.addEventListener("resize", this._windowResizeListener);
  }
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.themeService.refreshTheme();
  }

  /**
   * Executes `getComponentRef` to handle get component ref.
   * @zh 执行 `getComponentRef`，用于获取组件引用。
   * @param container - container parameter (`ComponentContainer`) / 容器参数（`ComponentContainer`）
   */
  getComponentRef(container: ComponentContainer) {
    return this._containerMap.get(container);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    globalThis.removeEventListener("resize", this._windowResizeListener);
    this._dockLayout.destroy();
  }

  /**
   * Executes `handleWindowResizeEvent` to handle handle window resize event.
   * @zh 执行 `handleWindowResizeEvent`，用于连接手柄窗口调整尺寸事件。
   */
  public handleWindowResizeEvent() {
    this._dockLayout.setSize(
      this._elRef.nativeElement.clientWidth,
      this._elRef.nativeElement.clientHeight
    );
  }

  /**
   * Executes `handleGetComponentEvent` to handle handle get component event.
   * @zh 执行 `handleGetComponentEvent`，用于连接手柄获取组件事件。
   * @param container - container parameter (`ComponentContainer`) / 容器参数（`ComponentContainer`）
   * @param itemConfig - item config parameter (`ResolvedComponentItemConfig`) / 条目配置参数（`ResolvedComponentItemConfig`）
   */
  private handleGetComponentEvent(
    container: ComponentContainer,
    itemConfig: ResolvedComponentItemConfig
  ) {

    const componentType = itemConfig.componentType;
      const componentRef = this.dockLayoutComponentService.createComponent(
        componentType,
        container
      );
      if(componentRef){
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<unknown>)
          .rootNodes[0] as HTMLElement;
        container.element.appendChild(domElem);
        this._containerMap.set(container, componentRef);
        return componentRef.instance;
      }
  }

  /**
   * Executes `handleReleaseComponentEvent` to handle handle release component event.
   * @zh 执行 `handleReleaseComponentEvent`，用于连接手柄Release组件事件。
   * @param container - container parameter (`ComponentContainer`) / 容器参数（`ComponentContainer`）
   */
  private handleReleaseComponentEvent(container: ComponentContainer) {
    const componentRef = this._containerMap.get(container);
    if (componentRef === undefined) {
      throw new Error("Could not release component. Container not found");
    } else {
      this.appRef.detachView(componentRef.hostView);
      let comp = componentRef.instance as { parent?: { dispose?: () => void } };
      if(comp.parent&&comp.parent.dispose){
        comp.parent.dispose();
      }
      componentRef.destroy();
      this._containerMap.delete(container);
    }
  }
}
