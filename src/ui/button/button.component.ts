/**
 * @fileoverview Module `src/ui/button/button.component.ts` providing button component definitions and implementation.
 * @zh 模块文件 `src/ui/button/button.component.ts`，提供按钮组件相关的定义与实现。
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';

import { ButtonBase, DuiButtonConfig } from './button.base';


/**
 * Angular component `ButtonComponent` (selector: 'dui-button') providing button component presentation and interaction in `src/ui/button`.
 * @zh Angular 组件 `ButtonComponent`（selector: 'dui-button'），提供按钮组件的视图渲染与交互逻辑（位于 `src/ui/button`）。
 */
@Component({
  selector: 'dui-button',
  styleUrls: ['./button.component.scss'],
  templateUrl: './button.component.html',
  host: {
    '[style.display]': 'flex',
    hostID: 'dui-button' + Math.random().toString(36).substring(2, 15)
  },

  changeDetection: ChangeDetectionStrategy.Default
})
export class ButtonComponent extends ButtonBase implements OnChanges,DoCheck {

   /**
    * Template/content query reference `matTooltip` (`@ViewChild`) targeting mat tooltip.
    * @zh 模板/内容视图查询引用 `matTooltip`（`@ViewChild`），指向Material悬浮提示。
    */
   @ViewChild(MatTooltip)  declare matTooltip: MatTooltip;

  /**
   * Input property `config` (`any`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`any`），用于配置配置（默认值：`{}`）。
   */
  @Input() override config: DuiButtonConfig = {};

  /**
   * Input property `data` (`any`) configuring data.
   * @zh 输入属性 `data`（类型：`any`），用于配置数据。
   */
  @Input() declare data;

  /**
   * Input property `ownerCt` (`any`) configuring owner ct.
   * @zh 输入属性 `ownerCt`（类型：`any`），用于配置所属者Ct。
   */
  @Input() declare ownerCt;

  /**
   * Input property `iconStyle` (`any`) configuring icon style.
   * @zh 输入属性 `iconStyle`（类型：`any`），用于配置图标样式。
   */
  @Input() iconStyle;

  /**
   * Input property `hasMenu` (`boolean`) configuring has menu (default: `false`).
   * @zh 输入属性 `hasMenu`（类型：`boolean`），用于配置是否包含菜单（默认值：`false`）。
   */
  @Input()  hasMenu=false;
  
  /**
   * Output event emitter `click` (`EventEmitter`) firing when click occurs.
   * @zh 输出事件 `click`（类型：`EventEmitter`），当触发点击时向外发出事件。
   */
  @Output() override click = new EventEmitter();

  /**
   * Property `showIcon` (`boolean`) storing show icon (default: `true`).
   * @zh 属性 `showIcon`（类型：`boolean`），用于存储或配置显示图标（默认值：`true`）。
   */
  public showIcon=true;

  /**
   * Property `onlyIcon` (`boolean`) storing only icon (default: `false`).
   * @zh 属性 `onlyIcon`（类型：`boolean`），用于存储或配置only图标（默认值：`false`）。
   */
  public onlyIcon=false;

  /**
   * Template/content query reference `_container` (`@ViewChild`) targeting container.
   * @zh 模板/内容视图查询引用 `_container`（`@ViewChild`），指向容器。
   */
  @ViewChild('container', { read: ViewContainerRef }) public declare _container: ViewContainerRef;

  /**
   * Template/content query reference `triggers` (`@ViewChildren`) targeting triggers.
   * @zh 模板/内容视图查询引用 `triggers`（`@ViewChildren`），指向触发。
   */
  @ViewChildren(MatMenuTrigger) declare triggers: QueryList<MatMenuTrigger>;

  /**
   * Creates an instance of `ButtonComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ButtonComponent` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef`) / 注入或传入的元素（`ElementRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    public override _element: ElementRef,
    public override renderer: Renderer2,
    public override changeDetectorRef: ChangeDetectorRef,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,) {
    super(_element,renderer,changeDetectorRef,resolver,injector);
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  override ngDoCheck() {
    super.ngDoCheck();
    this.checkExpressionChange();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
      this.changeDetectorRef.detectChanges()
    }
  }

  /**
   * Executes `getEl` to handle get el.
   * @zh 执行 `getEl`，用于获取DOM元素。
   */
  override getEl() {
    return this._element.nativeElement;
  }

  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  override onClick(e) {
    if (e) {
      e.preventDefault();
    }
    if (!this.disabled) {
      if (this.matTooltip&&this.matTooltip.message!='') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.matTooltip.hide(10);
      }
        if (this.handler) {
          this.handler.call(this, this.data || this, e);
        }
        this.click.emit(e);
    }
  }   
}
