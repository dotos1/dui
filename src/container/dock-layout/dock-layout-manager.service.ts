/**
 * @fileoverview Module `src/container/dock-layout/dock-layout-manager.service.ts` providing dock layout manager service definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/dock-layout-manager.service.ts`，提供停靠面板布局管理器服务相关的定义与实现。
 */

import { Injectable } from "@angular/core";
import { DockLayoutHostComponent } from "./dock-layout-host.component";
import { DockLayout } from "./dock-layout";
import { TranslateService } from "@dotos/dui/translator";
import { LayoutManager } from "./layout-manager";

/**
 * Type alias `ngComponentInstance` representing ng component instance (`any`).
 * @zh 类型别名 `ngComponentInstance`，表示Angular组件实例（`any`）。
 */
export type ngComponentInstance = unknown;

/**
 * Injectable Angular service `DockLayoutManagerService` managing dock layout manager service state and operations in `src/container/dock-layout`.
 * @zh 可注入的 Angular 服务 `DockLayoutManagerService`，管理 `src/container/dock-layout` 中的停靠面板布局管理器服务状态与业务操作。
 */
@Injectable({
  providedIn: "root",
})
export class DockLayoutManagerService {
  /**
   * Property `_dockLayoutHostComponent` (`DockLayoutHostComponent`) storing dock layout host component.
   * @zh 属性 `_dockLayoutHostComponent`（类型：`DockLayoutHostComponent`），用于存储或配置停靠面板布局宿主组件。
   */
  private _dockLayoutHostComponent: DockLayoutHostComponent;
  /**
   * Property `_dockLayout` (`DockLayout`) storing dock layout.
   * @zh 属性 `_dockLayout`（类型：`DockLayout`），用于存储或配置停靠面板布局。
   */
  private _dockLayout: DockLayout;
  /**
   * Property `_components` (`any[]`) storing components (default: `[]`).
   * @zh 属性 `_components`（类型：`any[]`），用于存储或配置组件列表（默认值：`[]`）。
   */
  private _components=[];

  /**
   * Creates an instance of `DockLayoutManagerService` and initializes its dependencies and internal state.
   * @zh 创建 `DockLayoutManagerService` 实例，并初始化其依赖项与内部状态。
   * @param translation - Injected or initial translation (`TranslateService`) / 注入或传入的翻译文本（`TranslateService`）
   */
  constructor(   
    private translation: TranslateService){
  }
  /**
   * Executes `setDockLayoutHostComponent` to handle set dock layout host component.
   * @zh 执行 `setDockLayoutHostComponent`，用于集合停靠面板布局宿主组件。
   * @param value - value parameter (`DockLayoutHostComponent`) / 值参数（`DockLayoutHostComponent`）
   */
  setDockLayoutHostComponent(value: DockLayoutHostComponent) {
    this._dockLayoutHostComponent = value;
    this._dockLayout = this._dockLayoutHostComponent.dockLayout;
  }

  /**
   * Gets the current components (`components: any`).
   * @zh 获取当前组件列表（`components: any`）。
   */
  get components(){
    return this._components;
  }

  /**
   * Executes `getComponent` to handle get component.
   * @zh 执行 `getComponent`，用于获取组件。
   * @param id - id parameter (`string`) / 唯一标识参数（`string`）
   */
  getComponent(id:string){
    for(let comp of this._components){
      if(comp.id==id){
        return comp;
      }
    }
    return undefined;
  }
  
  /**
   * Gets the current dock layout (`dockLayout: DockLayout`).
   * @zh 获取当前停靠面板布局（`dockLayout: DockLayout`）。
   */
  get dockLayout(): DockLayout {
    if (!this._dockLayout) {
      throw new Error("DockLayoutHostComponent not yet set.");
    }
    return this._dockLayout;
  }
  /**
   * Gets the current dock layout host component (`dockLayoutHostComponent: DockLayoutHostComponent`).
   * @zh 获取当前停靠面板布局宿主组件（`dockLayoutHostComponent: DockLayoutHostComponent`）。
   */
  get dockLayoutHostComponent(): DockLayoutHostComponent {
    if (!this._dockLayoutHostComponent) {
      throw new Error("DockLayoutHostComponent not yet set.");
    }
    return this._dockLayoutHostComponent;
  }
  /**
   * Executes `destroyComponents` to handle destroy components.
   * @zh 执行 `destroyComponents`，用于销毁组件列表。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   */
  destroyComponents(comp){
    this.removeComponents(comp);
    let component=this._dockLayout.findFirstComponentItemById(comp.id);
    if(component){
      let stack=component.parentItem;
      stack.removeChild(component);
    }
  }
  /**
   * Executes `removeComponents` to handle remove components.
   * @zh 执行 `removeComponents`，用于移除组件列表。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   */
  removeComponents(comp){
    if(comp){
      for(let k=0;k<this._components.length;k++){
        if(this._components[k].id==comp.id){
          this._components.splice(k,1);
        }
      }
    }
  }
  /**
   * Executes `addComponent` to handle add component.
   * @zh 执行 `addComponent`，用于添加组件。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @param containerId - container id parameter (`string`) / 容器唯一标识参数（`string`）
   * @returns Result of type `ngComponentInstance` / 类型为 `ngComponentInstance` 的返回值
   */
  addComponent(comp,containerId?:string): ngComponentInstance {
    if (!this._dockLayout) {
      throw new Error("DockLayoutHostComponent not yet set.");
    }
    let title=this.translation.instant(comp.title.label);
    let component;
    if(containerId){
        component =  this._dockLayout.newComponent(comp,{stackId:comp.content.id},title,containerId);
    }else{
      let locationSelectors = LayoutManager.defaultLocationSelectors;
      const location =  this._dockLayout.findFirstLocation(locationSelectors);
      let parentItem = location.parentItem;
      containerId=parentItem.id;
      comp.stackId=containerId;
      component = this._dockLayout.newComponent(comp,{stackId:containerId},title);
    }
    this._components.push(component);
    const componentRef = this._dockLayoutHostComponent.getComponentRef(
      component.container
    );
    if (componentRef) {
      return componentRef.instance;
    }
    return undefined;
  }
}
