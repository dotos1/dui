import { Injectable } from "@angular/core";
import { DockLayoutHostComponent } from "./dock-layout-host.component";
import { DockLayout } from "./dock-layout";
import { TranslateService } from "@dotos/dui/i18n";
import { LayoutManager } from "./layout-manager";

export type ngComponentInstance = any;

@Injectable({
  providedIn: "root",
})
export class DockLayoutManagerService {
  private _dockLayoutHostComponent: DockLayoutHostComponent;
  private _dockLayout: DockLayout;
  private _components=[];

  constructor(   
    private translation: TranslateService){
  }
  setDockLayoutHostComponent(value: DockLayoutHostComponent) {
    this._dockLayoutHostComponent = value;
    this._dockLayout = this._dockLayoutHostComponent.dockLayout;
  }

  get components(){
    return this._components;
  }

  getComponent(id:string){
    for(let comp of this._components){
      if(comp.id==id){
        return comp;
      }
    }
    return undefined;
  }
  
  get dockLayout(): DockLayout {
    if (!this._dockLayout) {
      throw new Error("DockLayoutHostComponent not yet set.");
    }
    return this._dockLayout;
  }
  get dockLayoutHostComponent(): DockLayoutHostComponent {
    if (!this._dockLayoutHostComponent) {
      throw new Error("DockLayoutHostComponent not yet set.");
    }
    return this._dockLayoutHostComponent;
  }
  destroyComponents(comp:any){
    this.removeComponents(comp);
    let component=this._dockLayout.findFirstComponentItemById(comp.id);
    if(component){
      let stack=component.parentItem;
      stack.removeChild(component);
    }
  }
  removeComponents(comp:any){
    if(comp){
      for(let k=0;k<this._components.length;k++){
        if(this._components[k].id==comp.id){
          this._components.splice(k,1);
        }
      }
    }
  }
  addComponent(comp: any,containerId?:string): ngComponentInstance {
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
  }
}
