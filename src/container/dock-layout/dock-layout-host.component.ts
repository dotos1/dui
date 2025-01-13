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


export const dock_LAYOUT_TAG_NAME = "dock-layout-host";

@Component({
  selector: dock_LAYOUT_TAG_NAME,
  template: "",
  styleUrls: ['./dock-layout-base.scss','./dock-layout-theme.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DockLayoutHostComponent implements OnInit,OnDestroy {
  private _dockLayout: DockLayout;
  private _containerMap = new Map<ComponentContainer, ComponentRef<any>>();
  private _windowResizeListener = () => this.handleWindowResizeEvent();

  @Output()
  layoutChanged = new EventEmitter<void>();


  @Output()
  activeStackChanged = new EventEmitter<any>();


  get dockLayout() {
    return this._dockLayout;
  }

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

    this._dockLayout.on('stackContentClick',(val:any)=>{
      this.activeStackChanged.emit(val.target);
    });

    this._dockLayout.on('activeContentItemChanged',(val)=>{
     // let parentItem=val.parentItem;
      this.activeStackChanged.emit(val);
    });

    globalThis.addEventListener("resize", this._windowResizeListener);
  }
  ngOnInit() {
    this.themeService.refreshTheme();
  }

  getComponentRef(container: ComponentContainer) {
    return this._containerMap.get(container);
  }

  ngOnDestroy() {
    globalThis.removeEventListener("resize", this._windowResizeListener);
    this._dockLayout.destroy();
  }

  public handleWindowResizeEvent() {
    this._dockLayout.setSize(
      this._elRef.nativeElement.clientWidth,
      this._elRef.nativeElement.clientHeight
    );
  }

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

  private handleReleaseComponentEvent(container: ComponentContainer) {
    const componentRef = this._containerMap.get(container);
    if (componentRef === undefined) {
      throw new Error("Could not release component. Container not found");
    } else {
      this.appRef.detachView(componentRef.hostView);
      let comp=componentRef.instance;
      if(comp.parent&&comp.parent.dispose){
        comp.parent.dispose();
      }
      componentRef.destroy();
      this._containerMap.delete(container);
    }
  }
}
