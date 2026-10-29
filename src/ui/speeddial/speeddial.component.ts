/**
 * @fileoverview Module `src/ui/speeddial/speeddial.component.ts` providing speeddial component definitions and implementation.
 * @zh 模块文件 `src/ui/speeddial/speeddial.component.ts`，提供speeddial组件相关的定义与实现。
 */


import { DuiConfig } from '@dotos/dui/base';
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { ComponentBase } from '@dotos/dui/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AnimationMode, Direction } from './speed-dial';
/**
 * Angular component `ExtSpeedDialComponent` (selector: 'speeddial') providing ext speed dial component presentation and interaction in `src/ui/speeddial`.
 * @zh Angular 组件 `ExtSpeedDialComponent`（selector: 'speeddial'），提供Ext速度Dial组件的视图渲染与交互逻辑（位于 `src/ui/speeddial`）。
 */
@Component({
  selector: 'speeddial',
  templateUrl: './speeddial.component.html',
  host: {
    '[style.display]': 'display',
    hostID: 'dui-speeddial' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.Default,

})
export class ExtSpeedDialComponent extends ComponentBase implements OnInit,OnChanges,DoCheck {

  /**
   * Property `state` (`any`) storing state.
   * @zh 属性 `state`（类型：`any`），用于存储或配置状态。
   */
  public state;

  /**
   * Template/content query reference `_container` (`ViewContainerRef`) targeting container.
   * @zh 模板/内容视图查询引用 `_container`（`@ViewChild`），指向容器。
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public _container: ViewContainerRef;

  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: DuiConfig = {};
  /**
   * Input property `icon` (`string`) configuring icon.
   * @zh 输入属性 `icon`（类型：`string`），用于配置图标。
   */
  @Input() icon: string;
  /**
   * Input property `title` (`string`) configuring title.
   * @zh 输入属性 `title`（类型：`string`），用于配置标题。
   */
  @Input() title: string;

  /**
   * Input property `direction` (`Direction`) configuring direction (default: `'up'`).
   * @zh 输入属性 `direction`（类型：`Direction`），用于配置方向（默认值：`'up'`）。
   */
  @Input() direction:Direction ='up';

  /**
   * Output event emitter `events` (`Subject<unknown>`) firing when events occurs.
   * @zh 输出事件 `events`（类型：`Subject<unknown>`），当触发事件集合时向外发出事件。
   */
  @Output() events = new Subject();
  /**
   * Input property `color` (`string`) configuring color.
   * @zh 输入属性 `color`（类型：`string`），用于配置颜色。
   */
  @Input() color: string;
  /**
   * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
   * @zh 输入属性 `disabled`（类型：`boolean`），用于配置已禁用（默认值：`false`）。
   */
  @Input() override disabled: boolean = false;
  /**
   * Input property `spin` (`boolean`) configuring spin (default: `false`).
   * @zh 输入属性 `spin`（类型：`boolean`），用于配置spin（默认值：`false`）。
   */
  @Input() spin = false;
  /**
   * Input property `type` (`string`) configuring type (default: `'mat-fab'`).
   * @zh 输入属性 `type`（类型：`string`），用于配置类型（默认值：`'mat-fab'`）。
   */
  @Input() type = 'mat-fab';
  /**
   * Input property `animationMode` (`AnimationMode`) configuring animation mode (default: `'fling'`).
   * @zh 输入属性 `animationMode`（类型：`AnimationMode`），用于配置动画模式（默认值：`'fling'`）。
   */
  @Input() animationMode:AnimationMode = 'fling';
  /**
   * Input property `items` (`any[]`) configuring items (default: `[]`).
   * @zh 输入属性 `items`（类型：`any[]`），用于配置条目列表（默认值：`[]`）。
   */
  @Input() items = [];
  /**
   * Input property `disableRipple` (`boolean`) configuring disable ripple (default: `false`).
   * @zh 输入属性 `disableRipple`（类型：`boolean`），用于配置禁用Ripple（默认值：`false`）。
   */
  @Input() disableRipple: boolean = false;
  /**
   * Input property `toolTip` (`string`) configuring tool tip.
   * @zh 输入属性 `toolTip`（类型：`string`），用于配置tool提示。
   */
  @Input() toolTip: string;

  /**
   * Property `style` (`{ color: string; }`) storing style (default: `{ color: 'rgba(255,255,255,0.84)' }`).
   * @zh 属性 `style`（类型：`{ color: string; }`），用于存储或配置样式（默认值：`{ color: 'rgba(255,255,255,0.84)' }`）。
   */
  public override style = { color: 'rgba(255,255,255,0.84)' };

  /**
   * Property `open` (`boolean`) storing open (default: `false`).
   * @zh 属性 `open`（类型：`boolean`），用于存储或配置打开（默认值：`false`）。
   */
  public open = false;

  /**
   * Property `_fixed` (`boolean`) storing fixed (default: `false`).
   * @zh 属性 `_fixed`（类型：`boolean`），用于存储或配置固定（默认值：`false`）。
   */
  private _fixed = false;

  /**
   * Gets the current fixed (`fixed: boolean`).
   * @zh 获取当前固定（`fixed: boolean`）。
   */
  get fixed(): boolean {
    return this._fixed;
  }

  /**
   * Sets the fixed (`fixed`).
   * @zh 设置固定（`fixed`）。
   * @param fixed - New fixed value (`boolean`) / 新的固定值（`boolean`）
   */
  set fixed(fixed: boolean) {
    this._fixed = fixed;
    if (this._fixed) {
      this.open = true;
    }
  }

  /**
   * Property `isFab` (`boolean`) storing is fab (default: `false`).
   * @zh 属性 `isFab`（类型：`boolean`），用于存储或配置是否为Fab（默认值：`false`）。
   */
  public isFab: boolean = false;

  /**
   * Property `iconType` (`string`) storing icon type (default: `''`).
   * @zh 属性 `iconType`（类型：`string`），用于存储或配置图标类型（默认值：`''`）。
   */
  public iconType: string = '';

  /**
   * Property `svgIcon` (`string`) storing svg icon (default: `''`).
   * @zh 属性 `svgIcon`（类型：`string`），用于存储或配置SVG矢量图图标（默认值：`''`）。
   */
  public svgIcon: string = '';

  /**
   * Property `rendered` (`boolean`) storing rendered (default: `false`).
   * @zh 属性 `rendered`（类型：`boolean`），用于存储或配置已渲染（默认值：`false`）。
   */
  private rendered: boolean = false;

  /**
   * Creates an instance of `ExtSpeedDialComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ExtSpeedDialComponent` 实例，并初始化其依赖项与内部状态。
   * @param elementref - Injected or initial elementref (`ElementRef<any>`) / 注入或传入的elementref（`ElementRef<any>`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(
    public elementref: ElementRef,
    public resolver: ComponentFactoryResolver,
    public injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(detectRef);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    this.items.forEach(item => {
      if (!item.handler) {
        item.handler = () => { };
      }
      this.initFieldExpression(item);
    });
  }

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
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  override ngDoCheck() {
    if (this.rendered) {
      this.checkExpressionChange();
      this.detectRef.markForCheck();
    }
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
    if (this.hidden) {
      this.display = 'none';
    }
    this.rendered = true;
    this.detectRef.detectChanges();
    this.checkExpressionChange();
  }
}
