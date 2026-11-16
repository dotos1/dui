/**
 * @fileoverview Module `src/data/cardview/components/card-view-item-dispatcher/card-view-item-dispatcher.component.ts` providing card view item dispatcher component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view-item-dispatcher/card-view-item-dispatcher.component.ts`，提供卡片视图条目派发器组件相关的定义与实现。
 */


import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import { CardViewItem } from '../../interfaces';
import { CardItemTypeService } from '../../services';
import { CardViewContentProxyDirective } from '../../directives';
import { DEFAULT_SEPARATOR } from '../card-view-textitem/card-view-textitem.component';

/**
 * Angular component `CardViewItemDispatcherComponent` (selector: 'dui-card-view-item-dispatcher') providing card view item dispatcher component presentation and interaction in `src/data/cardview/components/card-view-item-dispatcher`.
 * @zh Angular 组件 `CardViewItemDispatcherComponent`（selector: 'dui-card-view-item-dispatcher'），提供卡片视图条目派发器组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view-item-dispatcher`）。
 */
@Component({
  selector: 'dui-card-view-item-dispatcher',
  template: '<ng-template dui-card-view-content-proxy></ng-template>',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardViewItemDispatcherComponent implements OnChanges {
  /**
   * Input property `property` (`CardViewItem`) configuring property.
   * @zh 输入属性 `property`（类型：`CardViewItem`），用于配置属性。
   */
  @Input()
  property: CardViewItem;

  /**
   * Input property `editable` (`boolean`) configuring editable.
   * @zh 输入属性 `editable`（类型：`boolean`），用于配置是否可编辑。
   */
  @Input()
  editable: boolean;

  /**
   * Input property `displayEmpty` (`boolean`) configuring display empty (default: `true`).
   * @zh 输入属性 `displayEmpty`（类型：`boolean`），用于配置display空（默认值：`true`）。
   */
  @Input()
  displayEmpty: boolean = true;

  /**
   * Input property `displayNoneOption` (`boolean`) configuring display none option (default: `true`).
   * @zh 输入属性 `displayNoneOption`（类型：`boolean`），用于配置display无选项（默认值：`true`）。
   */
  @Input()
  displayNoneOption: boolean = true;

  /**
   * Input property `displayClearAction` (`boolean`) configuring display clear action (default: `true`).
   * @zh 输入属性 `displayClearAction`（类型：`boolean`），用于配置display清空动作（默认值：`true`）。
   */
  @Input()
  displayClearAction: boolean = true;

  /**
   * Input property `copyToClipboardAction` (`boolean`) configuring copy to clipboard action (default: `true`).
   * @zh 输入属性 `copyToClipboardAction`（类型：`boolean`），用于配置复制转换为Clipboard动作（默认值：`true`）。
   */
  @Input()
  copyToClipboardAction: boolean = true;

  /**
   * Input property `useChipsForMultiValueProperty` (`boolean`) configuring use chips for multi value property (default: `true`).
   * @zh 输入属性 `useChipsForMultiValueProperty`（类型：`boolean`），用于配置使用纸片标签用于多值属性（默认值：`true`）。
   */
  @Input()
  useChipsForMultiValueProperty: boolean = true;

  /**
   * Input property `multiValueSeparator` (`string`) configuring multi value separator (default: `DEFAULT_SEPARATOR`).
   * @zh 输入属性 `multiValueSeparator`（类型：`string`），用于配置多值Separator（默认值：`DEFAULT_SEPARATOR`）。
   */
  @Input()
  multiValueSeparator: string = DEFAULT_SEPARATOR;

  /**
   * Template/content query reference `content` (`CardViewContentProxyDirective`) targeting content.
   * @zh 模板/内容视图查询引用 `content`（`@ViewChild`），指向内容。
   */
  @ViewChild(CardViewContentProxyDirective, { static: true })
  private content: CardViewContentProxyDirective;

  /**
   * Property `loaded` (`boolean`) storing loaded (default: `false`).
   * @zh 属性 `loaded`（类型：`boolean`），用于存储或配置已加载（默认值：`false`）。
   */
  private loaded: boolean = false;
  /**
   * Property `componentReference` (`any`) storing component reference (default: `null`).
   * @zh 属性 `componentReference`（类型：`any`），用于存储或配置组件引用（默认值：`null`）。
   */
  private componentReference = null;

  /**
   * Property `ngOnInit` (`any`) storing ng on init.
   * @zh 属性 `ngOnInit`（类型：`any`），用于存储或配置Angular当初始化。
   */
  public ngOnInit;
  /**
   * Property `ngDoCheck` (`any`) storing ng do check.
   * @zh 属性 `ngDoCheck`（类型：`any`），用于存储或配置AngularDo检查。
   */
  public ngDoCheck;

  /**
   * Creates an instance of `CardViewItemDispatcherComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewItemDispatcherComponent` 实例，并初始化其依赖项与内部状态。
   * @param cardItemTypeService - Injected or initial card item type service (`CardItemTypeService`) / 注入或传入的卡片条目类型服务（`CardItemTypeService`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   */
  constructor(private cardItemTypeService: CardItemTypeService) {
    const dynamicLifeCycleMethods = [
      'ngOnInit',
      'ngDoCheck',
      'ngAfterContentInit',
      'ngAfterContentChecked',
      'ngAfterViewInit',
      'ngAfterViewChecked',
      'ngOnDestroy'
    ];

    dynamicLifeCycleMethods.forEach((method) => {
      this[method] = this.proxy.bind(this, method);
    });
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!this.loaded) {
      this.loadComponent();
      this.loaded = true;
    }

    Object.keys(changes)
      .map((changeName) => [changeName, changes[changeName]])
      //@ts-ignore
      .forEach(([inputParamName, simpleChange]: [string, SimpleChange]) => {
        this.componentReference.instance[inputParamName] = simpleChange.currentValue;
      });

    this.proxy('ngOnChanges', changes);
  }

  /**
   * Executes `loadComponent` to handle load component.
   * @zh 执行 `loadComponent`，用于加载组件。
   */
  private loadComponent() {
    const factoryClass = this.cardItemTypeService.resolveComponentType(this.property);

    this.componentReference = this.content.viewContainerRef.createComponent(factoryClass);

    this.componentReference.instance.editable = this.editable;
    this.componentReference.instance.property = this.property;
    this.componentReference.instance.displayEmpty = this.displayEmpty;
    this.componentReference.instance.displayNoneOption = this.displayNoneOption;
    this.componentReference.instance.displayClearAction = this.displayClearAction;
    this.componentReference.instance.copyToClipboardAction = this.copyToClipboardAction;
    this.componentReference.instance.useChipsForMultiValueProperty = this.useChipsForMultiValueProperty;
    this.componentReference.instance.multiValueSeparator = this.multiValueSeparator;
  }

  /**
   * Executes `proxy` to handle proxy.
   * @zh 执行 `proxy`，用于proxy。
   * @param methodName - method name parameter (`any`) / 方法名称参数（`any`）
   * @param args - args parameter (`any[]`) / 参数列表参数（`any[]`）
   */
  private proxy(methodName, ...args) {
    if (this.componentReference.instance[methodName]) {
      this.componentReference.instance[methodName].apply(this.componentReference.instance, args);
    }
  }
}
