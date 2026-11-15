/**
 * @fileoverview Module `src/common/dynamic/dynamic.component.ts` providing dynamic component definitions and implementation.
 * @zh 模块文件 `src/common/dynamic/dynamic.component.ts`，提供动态组件相关的定义与实现。
 */


import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ComponentRef, ChangeDetectionStrategy
} from '@angular/core';
import { Dui } from '@dotos1/dui/core';

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
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class DynamicExtensionComponent implements OnChanges, OnDestroy {
  /**
   * Template/content query reference `content` (`ViewContainerRef`) targeting content.
   * @zh 承载动态创建组件的视图容器。
   * @zh 承载动态创建组件的视图容器。
   */
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
  @Input() config;

  /**
   * When `true`, the dynamically created component instance is not destroyed on `ngOnDestroy`.
   * @zh 为 `true` 时，`ngOnDestroy` 阶段不会销毁动态创建的组件实例。
   */
  @Input() keep: boolean=false;

  /**
   * Reference to the dynamically created component instance.
   * @zh 动态创建的组件实例的引用。
   */
  public componentRef;
  /**
   * Property `loaded` (`boolean`) storing loaded (default: `false`).
   * @zh 属性 `loaded`（类型：`boolean`），用于存储或配置已加载（默认值：`false`）。
   */
  private loaded: boolean = false;

  /**
   * Creates an instance of `DynamicExtensionComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DynamicExtensionComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() { }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      let config=changes['config'].currentValue;
      if (!config) {
        return;
      }
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
    // 加载完成后 config 再变也不重新 updateInstance()/init()(b8c5e5c 复核)。
    // duix/aios 的 xyflow node-wrapper 的 config 是 getter,每次变更检测都返回
    // 新对象 —— 在这里响应它,iotos 规则流和 dataflow 的每个节点每一轮变更检测
    // 都会被重新 init 一遍。需要换组件的调用方应当换掉 <dui-dynamic> 本身。
  }
  /**
   * Executes `loadComponent` to handle load component.
   * @zh 执行 `loadComponent`，用于加载组件。
   */
  private loadComponent() {
    const factory = Dui.getComponentFactory(this.xtype);
    if (factory) {
      const component = factory.componentType;
      this.content.clear();
      this.componentRef = this.content.createComponent(component, { index: 0 });
    } else {
      throw new Error(this.xtype + ' not exits in factory');
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this.componentCreated()&&!this.keep) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
  /**
   * Executes `updateInstance` to handle update instance.
   * @zh 执行 `updateInstance`，用于更新实例。
   */
  private updateInstance() {
    if (this.componentCreated()) {
      this.componentRef.instance.config = this.config;
      this.componentRef.instance.init(this.config);
    }
  }

  /**
   * Executes `proxy` to handle proxy.
   * @zh 执行 `proxy`，用于proxy。
   * @param lifecycleMethod - lifecycle method parameter (`any`) / lifecycle方法参数（`any`）
   * @param args - args parameter (`any[]`) / 参数列表参数（`any[]`）
   */
  private proxy(lifecycleMethod, ...args) {
    if (this.componentCreated() && this.lifecycleHookIsImplemented(lifecycleMethod)) {
      this.componentRef.instance[lifecycleMethod].apply(this.componentRef.instance, args);
    }
  }

  /**
   * Executes `componentCreated` to handle component created.
   * @zh 执行 `componentCreated`，用于组件已创建。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private componentCreated(): boolean {
    return !!this.componentRef && !!this.componentRef.instance;
  }

  /**
   * Executes `lifecycleHookIsImplemented` to handle lifecycle hook is implemented.
   * @zh 执行 `lifecycleHookIsImplemented`，用于lifecycleHook是否为Implemented。
   * @param lifecycleMethod - lifecycle method parameter (`string`) / lifecycle方法参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private lifecycleHookIsImplemented(lifecycleMethod: string): boolean {
    return !!this.componentRef.instance[lifecycleMethod];
  }
}
