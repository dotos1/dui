/**
 * @fileoverview Module `src/ui/color-button/color-button.ts` providing color button definitions and implementation.
 * @zh 模块文件 `src/ui/color-button/color-button.ts`，提供颜色按钮相关的定义与实现。
 */

import { ChangeDetectorRef, Component, DoCheck, ElementRef, EventEmitter, HostBinding, Injector, Input, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColorEvent } from '@dotos/dui/common/colorpicker/common';
import { ButtonBase, DuiButtonConfig } from '@dotos/dui/ui/button';
import { MatTooltip } from '@angular/material/tooltip';


/**
 * Angular component `ColorPickerButton` (selector: 'colorpicker-button') providing color picker button presentation and interaction in `src/ui/color-button`.
 * @zh Angular 组件 `ColorPickerButton`（selector: 'colorpicker-button'），提供颜色选择器按钮的视图渲染与交互逻辑（位于 `src/ui/color-button`）。
 */
@Component({
  selector: 'colorpicker-button',
  templateUrl: './color-button.html',
  styleUrls: ['./color-button.scss'],
  host: {
    '[style.display]': 'flex'
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ColorPickerButton extends ButtonBase implements OnInit,DoCheck {

  /**
   * Input property `config` (`DuiButtonConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiButtonConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() override config: DuiButtonConfig = {};

  /**
   * Template/content query reference `matTooltip` (`MatTooltip`) targeting mat tooltip.
   * @zh 模板/内容视图查询引用 `matTooltip`（`@ViewChild`），指向Material悬浮提示。
   */
  @ViewChild(MatTooltip) override matTooltip: MatTooltip = undefined;

  /**
   * Input property `data` (`unknown`) configuring data.
   * @zh 输入属性 `data`（类型：`unknown`），用于配置数据。
   */
  @Input() override data: unknown = undefined;

  /**
   * Input property `ownerCt` (`any`) configuring owner ct.
   * @zh 输入属性 `ownerCt`（类型：`any`），用于配置所属者Ct。
   */
  @Input() override ownerCt = undefined;

  /**
   * Output event emitter `click` (`EventEmitter<any>`) firing when click occurs.
   * @zh 输出事件 `click`（类型：`EventEmitter<any>`），当触发点击时向外发出事件。
   */
  @Output() override click = new EventEmitter();

  /**
   * Template/content query reference `_container` (`ViewContainerRef`) targeting container.
   * @zh 模板/内容视图查询引用 `_container`（`@ViewChild`），指向容器。
   */
  @ViewChild('container', { read: ViewContainerRef }) public override _container: ViewContainerRef = undefined;

  /**
   * Template/content query reference `triggers` (`QueryList<MatMenuTrigger>`) targeting triggers.
   * @zh 模板/内容视图查询引用 `triggers`（`@ViewChildren`），指向触发。
   */
  @ViewChildren(MatMenuTrigger) override triggers: QueryList<MatMenuTrigger> = undefined;

  /**
   * Property `state` (`{ h: number; s: number; l: number; a: number; }`) storing state (default: `{ h: 150, s: 0.50, l: 0.20, a: 1, }`).
   * @zh 属性 `state`（类型：`{ h: number; s: number; l: number; a: number; }`），用于存储或配置状态（默认值：`{ h: 150, s: 0.50, l: 0.20, a: 1, }`）。
   */
  state = {
    h: 150,
    s: 0.50,
    l: 0.20,
    a: 1,
  };


  /**
   * Host-bound getter `displayFlex` (`string`) computing display flex.
   * @zh 宿主绑定读取器 `displayFlex`（绑定至 `style.display`），计算并返回displayFlex。
   */
  @HostBinding('style.display')
  get displayFlex(): string {
    return 'flex';
  }
  /**
   * Host-bound getter `paddingLeft` (`string`) computing padding left.
   * @zh 宿主绑定读取器 `paddingLeft`（绑定至 `style.padding-left.px`），计算并返回内边距左侧位置。
   */
  @HostBinding('style.padding-left.px')
  get paddingLeft(): string {
    if(this.hidden){
      return '0';
    }else{
      return this.config.parentType==undefined?'8':'0';
    }
  }

  /**
   * Host-bound getter `paddingRight` (`string`) computing padding right.
   * @zh 宿主绑定读取器 `paddingRight`（绑定至 `style.padding-right.px`），计算并返回内边距右侧位置。
   */
  @HostBinding('style.padding-right.px')
  get paddingRight(): string {
    if(this.hidden){
      return '0';
    }else{
      return this.config.parentType==undefined?'8':'0';
    }
  }
  /**
   * Property `iconStyle` (`{ "border-bottom-color": string; }`) storing icon style (default: `{ "border-bottom-color":"#000"}`).
   * @zh 属性 `iconStyle`（类型：`{ "border-bottom-color": string; }`），用于存储或配置图标样式（默认值：`{ "border-bottom-color":"#000"}`）。
   */
  iconStyle={ "border-bottom-color":"#000"};

  /**
   * Creates an instance of `ColorPickerButton` and initializes its dependencies and internal state.
   * @zh 创建 `ColorPickerButton` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    public override _element: ElementRef,
    public override renderer: Renderer2,
    public router: Router,
    public _changeDetectorRef: ChangeDetectorRef,
    public override injector: Injector,
  ) {
    super(_element, renderer, _changeDetectorRef, injector);
  }
  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  override ngDoCheck() {
    super.ngDoCheck();
    this.checkExpressionChange();
    this._changeDetectorRef.markForCheck();
  }
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    this.initFieldExpression(this.config);
  }
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }
  /**
   * Executes `setValue` to handle set value.
   * @zh 执行 `setValue`，用于集合值。
   * @param v - v parameter (`any`) / v参数（`any`）
   */
  override setValue(v): void {
    this.value=v;
    if(v==undefined){
      this.iconStyle = { ...this.iconStyle, "border-bottom-color": 'transparent' };
    }else{
      this.iconStyle = { ...this.iconStyle, "border-bottom-color": v.hex };
    }
    this._changeDetectorRef.detectChanges();
  }
  /**
   * Executes `changeComplete` to handle change complete.
   * @zh 执行 `changeComplete`，用于变更完成。
   * @param $event - event parameter (`ColorEvent`) / 事件参数（`ColorEvent`）
   */
  changeComplete($event: ColorEvent): void {

    $event.$event.stopPropagation();
    if($event.color==undefined){
      this.state = undefined;
      this.iconStyle = { ...this.iconStyle, "border-bottom-color": 'transparent' };
      this.onValueChange($event.color,this);
    }else{
      this.state = $event.color.hsl;
      this.iconStyle = { ...this.iconStyle, "border-bottom-color": $event.color.hex };
      this.onValueChange($event.color,this);
    }

    this._changeDetectorRef.detectChanges();
  }
}
