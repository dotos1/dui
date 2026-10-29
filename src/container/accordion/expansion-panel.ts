/**
 * @fileoverview Module `src/container/accordion/expansion-panel.ts` providing expansion panel definitions and implementation.
 * @zh 模块文件 `src/container/accordion/expansion-panel.ts`，提供展开面板面板相关的定义与实现。
 */


import { DuiConfig } from '@dotos/dui/base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { CanDisable, mixinDisabled } from '@angular/material/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  EventEmitter,
  Output,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Injector
} from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder } from '@dotos/dui/core/form';

import { Accordion } from './accordion';
import { Container } from '../container.main';
/**
 * Time and timing curve for expansion panel animations.
 * @zh 常量/变量 `EXPANSION_PANEL_ANIMATION_TIMING`，定义 `src/container/accordion` 中的展开面板面板动画时间。
 */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/**
 * Used to generate unique ID for each accordion item.
 * @zh 常量/变量 `nextId`，定义 `src/container/accordion` 中的下一个唯一标识。
 */
let nextId = 0;

/**
 * Angular component `ExpansionPanelBase` providing expansion panel base presentation and interaction in `src/container/accordion`.
 * @zh Angular 组件 `ExpansionPanelBase`，提供展开面板面板基础的视图渲染与交互逻辑（位于 `src/container/accordion`）。
 */
@Component({
  template: '',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'dui-expansion-panel-base' + Math.random().toString(36).substring(2, 15),
  }
})
export class ExpansionPanelBase extends Container implements OnChanges,OnDestroy{
  /**
   * Input property `config` (`any`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`any`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: DuiConfig = {};

  /**
   * Property `xtype` (`string`) storing xtype (default: `'expansion-panel'`).
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型（默认值：`'expansion-panel'`）。
   */
  public override xtype: string = 'expansion-panel';

  /**
   * Template/content query reference `viewContainer` (`@ViewChild`) targeting view container.
   * @zh 模板/内容视图查询引用 `viewContainer`（`@ViewChild`），指向视图容器。
   */
  //@ts-ignore
  @ViewChild('panel', { read: ViewContainerRef }) public override viewContainer: ViewContainerRef;

  /**
   * label?: string
   * Sets label of [ExpansionPanelComponent] header.
   * Defaults to 'Click to expand'

   * @zh 输入属性 `label`（类型：`string`），用于配置标签。
   */
  @Input() label: string;

  /**
   * sublabel?: string
   * Sets sublabel of [ExpansionPanelComponent] header.

   * @zh 输入属性 `description`（类型：`string`），用于配置描述。
   */
  @Input() description: string;

  /**
   * Property `buttons` (`Array<any>`) storing buttons.
   * @zh 属性 `buttons`（类型：`Array<any>`），用于存储或配置按钮。
   */
  public buttons;

  /**
   * Creates an instance of `ExpansionPanelBase` and initializes its dependencies and internal state.
   * @zh 创建 `ExpansionPanelBase` 实例，并初始化其依赖项与内部状态。
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param _expansionDispatcher - Injected or initial expansion dispatcher (`UniqueSelectionDispatcher`) / 注入或传入的展开面板派发器（`UniqueSelectionDispatcher`）
   */
  constructor(
    public override detectRef: ChangeDetectorRef,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    protected _expansionDispatcher: UniqueSelectionDispatcher,
  ) {
    super(resolver, injector, detectRef);
    //  this.el = this._element.nativeElement;
  }

  /**
   * Property `_accordion` (`Accordion`) storing accordion.
   * @zh 属性 `_accordion`（类型：`Accordion`），用于存储或配置手风琴。
   */
  public _accordion: Accordion;

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {

    super.init(config);
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    this.addConfiguredItems();
    this._accordion = this.ownerCt;
    this._removeUniqueSelectionListener =
      this._expansionDispatcher.listen((id: string, accordionId: string) => {
        if (this._accordion && !this._accordion.multi &&
          this._accordion.id === accordionId && this.id !== id) {
          this.expanded = false;
        }
      });
  }
  /**
   * Property `_expand` (`boolean`) storing expand (default: `false`).
   * @zh 属性 `_expand`（类型：`boolean`），用于存储或配置展开（默认值：`false`）。
   */
  private _expand: boolean = false;

  /**
   * Property `flex` (`number`) storing flex (default: `0`).
   * @zh 属性 `flex`（类型：`number`），用于存储或配置flex（默认值：`0`）。
   */
  public flex: number = 0;

  /**
   * Event emitted every time the AccordionItem is closed.
   * @zh 输出事件 `closed`（类型：`EventEmitter`），当触发是否关闭时向外发出事件。
   */
  @Output() closed = new EventEmitter<void>();
  /**
   * Event emitted every time the AccordionItem is opened.
   * @zh 输出事件 `opened`（类型：`EventEmitter`），当触发是否展开时向外发出事件。
   */
  @Output() opened = new EventEmitter<void>();
  /**
   * Event emitted when the AccordionItem is destroyed.
   * @zh 输出事件 `destroyed`（类型：`EventEmitter`），当触发已销毁时向外发出事件。
   */
  @Output() destroyed = new EventEmitter<void>();
  /**
   * The unique AccordionItem id.
   * @zh 属性 `id`（类型：`any`），用于存储或配置唯一标识（默认值：`'cdk-accordion-child-${nextId++}'`）。
   */
  override readonly id = `cdk-accordion-child-${nextId++}`;

  /**
   * Whether the AccordionItem is expanded.
   * @zh 输入属性 `expanded`（类型：`any`）的读取器，返回当前已展开。
   */
  @Input()
  get expanded() { return this._expanded; }
  /**
   * Sets the expanded (`expanded`).
   * @zh 设置已展开（`expanded`）。
   * @param expanded - New expanded value (`any`) / 新的已展开值（`any`）
   */
  set expanded(expanded) {
    expanded = coerceBooleanProperty(expanded);

    // Only emit events and update the internal value if the value changes.
    if (this._expanded !== expanded) {
      this._expanded = expanded;
      if (expanded) {
        this.opened.emit();
        if (this.ownerCt && this.ownerCt.items) {
          this.ownerCt.items.each( (item)=> {
            if (item.xtype == 'expansion-panel' && item != this) {
              item.expanded = false;
            }
          })
        }
        this.flex = 1;
        this.trigger('expand', this);
        /**
         * In the unique selection dispatcher, the id parameter is the id of the CdkAccordionItem,
         * the name value is the id of the accordion.
         */
        const accordionId = this._accordion ? this._accordion.id : this.id;
        this._expansionDispatcher.notify(this.id, accordionId);
      } else {
        this.flex = 0;
        this.trigger('collapse', this);
        this.closed.emit();
      }

      // Ensures that the animation will run when the value is set outside of an `@Input`.
      // This includes cases like the open, close and toggle methods.
      this.detectRef.markForCheck();
    }
  }
  /**
   * Property `_expanded` (`boolean`) storing expanded.
   * @zh 属性 `_expanded`（类型：`boolean`），用于存储或配置已展开。
   */
  private _expanded: boolean;

  /**
   * Unregister function for _expansionDispatcher.
   * @zh 属性 `_removeUniqueSelectionListener`（类型：`() => void`），用于存储或配置移除唯一Selection监听器（默认值：`() => { }`）。
   */
  private _removeUniqueSelectionListener: () => void = () => { };

  /**
   * Emits an event for the accordion item being destroyed.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    this.destroyed.emit();
    this._removeUniqueSelectionListener();
  }

  /**
   * Toggles the expanded state of the accordion item.
   * @zh 执行 `toggle`，用于开关。
   */
  toggle(): void {
    this.expanded = !this.expanded;
  }

  /**
   * Sets the expanded state of the accordion item to false.
   * @zh 执行 `close`，用于关闭。
   */
  close(): void {
    this.expanded = false;
  }

  /**
   * Sets the expanded state of the accordion item to true.
   * @zh 执行 `open`，用于打开。
   */
  open(): void {
    this.expanded = true;
  }
}
/**
 * Constant/variable `_ExpansionPanelMixinBase` defining expansion panel mixin base in `src/container/accordion`.
 * @zh 常量/变量 `_ExpansionPanelMixinBase`，定义 `src/container/accordion` 中的展开面板面板Mixin基础。
 */
export const _ExpansionPanelMixinBase = mixinDisabled(ExpansionPanelBase);

/**
 * ExpansionPanel's states.
 * @zh 类型别名 `ExpansionPanelState`，表示展开面板面板状态（`'expanded' | 'collapsed'`）。
 */
export type ExpansionPanelState = 'expanded' | 'collapsed';

/**
 * <expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MdAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.

 * @zh Angular 组件 `ExpansionPanel`（selector: 'expansion-panel'），提供展开面板面板的视图渲染与交互逻辑（位于 `src/container/accordion`）。
 */
@Component({
  styleUrls: ['./expansion-panel.scss'],
  selector: 'expansion-panel',
  exportAs: 'matExpansionPanel',
  templateUrl: './expansion-panel.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled', 'expanded'],
  outputs: ['opened', 'closed'],
  host: {
    'class': 'expansion-panel',
    '[class.dui-expanded]': 'expanded',
    '[style.flex]': "flex",
    '[class.expansion-panel-spacing]': '_hasSpacing()',
    hostID: 'dui-expansion-panel' + Math.random().toString(36).substring(2, 15)
  },
  providers: [
    { provide: _ExpansionPanelMixinBase, useExisting: forwardRef(() => ExpansionPanel) }
  ],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
  ]
})
export class ExpansionPanel extends _ExpansionPanelMixinBase
  implements CanDisable, OnChanges, OnDestroy {

  /**
   * Whether the toggle indicator should be hidden.
   * @zh 输入属性 `hideToggle`（类型：`boolean`）的读取器，返回当前隐藏开关。
   */
  @Input()
  get hideToggle(): boolean {
    return this._hideToggle;
  }
  /**
   * Sets the hide toggle (`hideToggle`).
   * @zh 设置隐藏开关（`hideToggle`）。
   * @param value - New hide toggle value (`boolean`) / 新的隐藏开关值（`boolean`）
   */
  set hideToggle(value: boolean) {
    this._hideToggle = coerceBooleanProperty(value);
  }
  /**
   * Property `_hideToggle` (`boolean`) storing hide toggle (default: `false`).
   * @zh 属性 `_hideToggle`（类型：`boolean`），用于存储或配置隐藏开关（默认值：`false`）。
   */
  private _hideToggle = false;

  /**
   * Stream that emits for changes in `@Input` properties.
   * @zh 属性 `_inputChanges`（类型：`Subject`），用于存储或配置输入属性变更集合（默认值：`new Subject<SimpleChanges>()`）。
   */
  _inputChanges = new Subject<SimpleChanges>();

  /**
   * Creates an instance of `ExpansionPanel` and initializes its dependencies and internal state.
   * @zh 创建 `ExpansionPanel` 实例，并初始化其依赖项与内部状态。
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param _uniqueSelectionDispatcher - Injected or initial unique selection dispatcher (`UniqueSelectionDispatcher`) / 注入或传入的唯一Selection派发器（`UniqueSelectionDispatcher`）
   * @param formBuilder - Injected or initial form builder (`FormBuilder`) / 注入或传入的表单构建器（`FormBuilder`）
   */
  constructor(
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    _changeDetectorRef: ChangeDetectorRef,
    _uniqueSelectionDispatcher: UniqueSelectionDispatcher,
    public formBuilder?: FormBuilder, ) {
    super(_changeDetectorRef, resolver, injector, _uniqueSelectionDispatcher);
  }

  /**
   * Whether the expansion indicator should be hidden.
   * @zh 执行 `_getHideToggle`，用于获取隐藏开关。
   */
  _getHideToggle(): boolean {
    if (this._accordion) {
      return this._accordion.hideToggle;
    }
    return this.hideToggle;
  }

  /**
   * Determines whether the expansion panel should have spacing between it and its siblings.
   * @zh 执行 `_hasSpacing`，用于是否包含间距。
   */
  _hasSpacing(): boolean {
    if (this._accordion) {
      return (this.expanded ? this._accordion.displayMode : this._getExpandedState()) === 'default';
    }
    return false;
  }

  /**
   * Gets the expanded state string.
   * @zh 执行 `_getExpandedState`，用于获取已展开状态。
   */
  _getExpandedState(): ExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    this._inputChanges.next(changes);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    super.ngOnDestroy();
    this._inputChanges.complete();
  }
}

/**
 * Angular directive `ExpansionPanelActionRow` (selector: 'dui-action-row') attaching expansion panel action row behavior to host DOM elements.
 * @zh Angular 指令 `ExpansionPanelActionRow`（selector: 'dui-action-row'），为宿主 DOM 元素附加展开面板面板动作行行为。
 */
@Directive({
  selector: 'dui-action-row',
  host: {
    class: 'dui-action-row'
  }
})
export class ExpansionPanelActionRow { }
