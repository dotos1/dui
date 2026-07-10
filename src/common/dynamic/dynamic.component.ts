
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
  /** @zh 承载动态创建组件的视图容器。 */
  @ViewChild('content', {static:true, read: ViewContainerRef })
  content: ViewContainerRef;

  /**
   * Identifier assigned to (or read back from) the dynamically created component's config.
   * @zh 赋予（或从）动态创建组件的配置中读回的标识符。
   */
  @Input() id: string;

  /**
   * The registered factory key used to look up which component to instantiate.
   * @zh 用于查找应实例化哪个组件的已注册工厂键名。
   */
  @Input() xtype: string;

  /**
   * Runtime configuration passed to (or an already-rendered reference reused by) the dynamic component.
   * @zh 传递给动态组件的运行时配置（或复用一个已渲染完成的引用）。
   */
  @Input() config: any;

  /**
   * When `true`, the dynamically created component instance is not destroyed on `ngOnDestroy`.
   * @zh 为 `true` 时，`ngOnDestroy` 阶段不会销毁动态创建的组件实例。
   */
  @Input() keep: boolean=false;

  /**
   * Reference to the dynamically created component instance.
   * @zh 动态创建的组件实例的引用。
   */
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
