/**
 * @fileoverview Module `src/ui/speeddial/fab.button.ts` providing fab button definitions and implementation.
 * @zh 模块文件 `src/ui/speeddial/fab.button.ts`，提供fab按钮相关的定义与实现。
 */

import { DuiConfig } from '@dotos/dui/base';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    DoCheck,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ComponentBase } from '@dotos/dui/core';
import {isString}  from 'lodash-es';

/**
 * Angular component `FabButtonComponent` (selector: 'fabbutton') providing fab button component presentation and interaction in `src/ui/speeddial`.
 * @zh Angular 组件 `FabButtonComponent`（selector: 'fabbutton'），提供Fab按钮组件的视图渲染与交互逻辑（位于 `src/ui/speeddial`）。
 */
@Component({
  selector: 'fabbutton',
  styleUrls: ['./fab.button.scss'],
  templateUrl: './fab.button.html',
  host: {
    '[style.display]': 'display',
    hostID: 'dui-fab-button' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class FabButtonComponent extends ComponentBase implements OnChanges,DoCheck{

  /**
   * Template/content query reference `matTooltip` (`MatTooltip`) targeting mat tooltip.
   * @zh 模板/内容视图查询引用 `matTooltip`（`@ViewChild`），指向Material悬浮提示。
   */
  @ViewChild(MatTooltip)  matTooltip: MatTooltip;

  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: DuiConfig = {};

  /**
   * Input property `type` (`string`) configuring type (default: `'mat-fab'`).
   * @zh 输入属性 `type`（类型：`string`），用于配置类型（默认值：`'mat-fab'`）。
   */
  @Input() public type = 'mat-fab';

  /**
   * Input property `text` (`any`) configuring text.
   * @zh 输入属性 `text`（类型：`any`），用于配置文本。
   */
  @Input() public text;

  /**
   * Input property `disableRipple` (`boolean`) configuring disable ripple (default: `false`).
   * @zh 输入属性 `disableRipple`（类型：`boolean`），用于配置禁用Ripple（默认值：`false`）。
   */
  @Input()  public disableRipple: boolean = false;

  /**
   * Input property `color` (`string`) configuring color (default: `''`).
   * @zh 输入属性 `color`（类型：`string`），用于配置颜色（默认值：`''`）。
   */
  @Input() public color: string = '';

  /**
   * Input property `icon` (`any`) configuring icon.
   * @zh 输入属性 `icon`（类型：`any`），用于配置图标。
   */
  @Input()  public icon;

  /**
   * Output event emitter `click` (`EventEmitter<any>`) firing when click occurs.
   * @zh 输出事件 `click`（类型：`EventEmitter<any>`），当触发点击时向外发出事件。
   */
  @Output() click = new EventEmitter();

  /**
   * Property `handler` (`any`) storing handler.
   * @zh 属性 `handler`（类型：`any`），用于存储或配置处理器。
   */
  public handler;

  /**
   * Property `style` (`{ color: string; }`) storing style (default: `{ color: 'rgba(255,255,255,0.84)' }`).
   * @zh 属性 `style`（类型：`{ color: string; }`），用于存储或配置样式（默认值：`{ color: 'rgba(255,255,255,0.84)' }`）。
   */
  public override style = { color: 'rgba(255,255,255,0.84)' };

  /**
   * Property `rendered` (`boolean`) storing rendered (default: `false`).
   * @zh 属性 `rendered`（类型：`boolean`），用于存储或配置已渲染（默认值：`false`）。
   */
  private rendered: boolean = false;

  /**
   * Property `items` (`any[]`) storing items (default: `[]`).
   * @zh 属性 `items`（类型：`any[]`），用于存储或配置条目列表（默认值：`[]`）。
   */
  public items = [];


  /**
   * Creates an instance of `FabButtonComponent` and initializes its dependencies and internal state.
   * @zh 创建 `FabButtonComponent` 实例，并初始化其依赖项与内部状态。
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    public override detectRef: ChangeDetectorRef,
    public resolver: ComponentFactoryResolver,
    public injector: Injector,) {
    super(detectRef);
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
    }
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
    this.rendered = true;
    if (this.hidden) {
      this.display = 'none';
    }
    if (config && config.children) {
      this.items = config.children;
    }
    for (let i = 0; i < this.items.length; i++) {
      if (isString(this.items[i]) && this.items[i] === '-') {
        this.items[i] = { type: 'divider' };
      }
      if (!this.items[i].xtype) {
        this.items[i].xtype = 'menuitem';
      }
    }
    this.detectRef.detectChanges();
    this.checkExpressionChange();
  }

  /**
   * Executes `hasIcon` to handle has icon.
   * @zh 执行 `hasIcon`，用于是否包含图标。
   */
  public hasIcon() {
    return this.icon != undefined;
  }


  /**
   * Executes `setHandler` to handle set handler.
   * @zh 执行 `setHandler`，用于集合处理器。
   * @param handler - handler parameter (`Function`) / 处理器参数（`Function`）
   */
  setHandler(handler: Function): void {
    this.handler = handler;
  }

  /**
   * Executes `setIcon` to handle set icon.
   * @zh 执行 `setIcon`，用于集合图标。
   * @param icon - icon parameter (`string`) / 图标参数（`string`）
   */
  setIcon(icon: string): void {
    this.icon = icon;
  }

  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onClick(e) {
    if (e) {
      e.preventDefault();

    }
    if (!this.disabled) {
      if (this.matTooltip && this.matTooltip.message) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.matTooltip.hide();
      }
        this.trigger('click', { button: this, event: e });
        if (this.handler) {
          this.handler.call(this, this, e);
        }
        this.click.emit(e);
    }
  }
}
