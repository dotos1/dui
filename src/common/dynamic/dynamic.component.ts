
import {
  Component,
  Input,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ComponentRef
} from '@angular/core';
import { Dui } from '@dotos/dui/core';

/**
 * Dynamically instantiates a component registered in the `Dui` component factory registry
 * under the given `xtype`, based on runtime `config`.
 * @zh 根据运行时 `config`，动态实例化在 `Dui` 组件工厂注册表中以给定 `xtype` 注册的组件。
 */
@Component({
  selector: 'dui-dynamic-component',
  template: `<div   #content></div>`,
  host: {
    hostID: "dui-dynamic-component" + Math.random().toString(36).substring(2, 15)
  }
})
export class DynamicExtensionComponent implements OnChanges, OnDestroy {
  @ViewChild('content', {static:true, read: ViewContainerRef })
  content: ViewContainerRef;

  @Input() id: string;

  @Input() xtype: string;

  @Input() config: any;

  @Input() keep: boolean=false;

  public componentRef:ComponentRef<any>;
  private loaded: boolean = false;

  constructor( private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      let config=changes['config'].currentValue;
      if(config.rendered){
        this.loaded=true;
        this.content.clear();
        this.componentRef = config.reference;
        this.content.insert(this.componentRef.hostView);
        if(this.config['id']) this.id= this.config.id;
      }else{
        this.config = changes['config'].currentValue;
        if(this.config['id']) this.id= this.config.id;
        if(this.config['xtype']) this.xtype= this.config.xtype;
      }
    }
    if (!this.loaded) {
      this.loadComponent();
      this.loaded = true;
      this.updateInstance();
      this.proxy('ngOnChanges', changes);
    }
  }
  private loadComponent() {
    const factory: any = Dui.getComponentFactory(this.xtype);
    if (factory) {
      const component = factory.componentType;
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      if (componentFactory) {
        this.content.clear();
        this.componentRef = this.content.createComponent(componentFactory, 0);
      }
    } else {
      throw new Error(this.xtype + ' not exits in factory');
    }
  }

  ngOnDestroy() {
    if (this.componentCreated()&&!this.keep) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
  private updateInstance() {
    if (this.componentCreated()) {
      this.componentRef.instance.config = this.config;
      this.componentRef.instance.init(this.config);
    }
  }

  private proxy(lifecycleMethod, ...args) {
    if (this.componentCreated() && this.lifecycleHookIsImplemented(lifecycleMethod)) {
      this.componentRef.instance[lifecycleMethod].apply(this.componentRef.instance, args);
    }
  }

  private componentCreated(): boolean {
    return !!this.componentRef && !!this.componentRef.instance;
  }

  private lifecycleHookIsImplemented(lifecycleMethod: string): boolean {
    return !!this.componentRef.instance[lifecycleMethod];
  }
}
