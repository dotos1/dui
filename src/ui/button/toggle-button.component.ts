/**
 * @fileoverview Module `src/ui/button/toggle-button.component.ts` providing toggle button component definitions and implementation.
 * @zh 模块文件 `src/ui/button/toggle-button.component.ts`，提供开关按钮组件相关的定义与实现。
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    DoCheck,
    Injector,
    Input,
    OnChanges, OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MatButtonToggleAppearance } from '@angular/material/button-toggle';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentBase, Dui } from '@dotos/dui/core';
import {isFunction,isObjectLike}  from 'lodash-es';

/**
 * Angular component `ToggleButtonComponent` (selector: 'toggle-button') providing toggle button component presentation and interaction in `src/ui/button`.
 * @zh Angular 组件 `ToggleButtonComponent`（selector: 'toggle-button'），提供开关按钮组件的视图渲染与交互逻辑（位于 `src/ui/button`）。
 */
@Component({
  selector: 'toggle-button',
  styleUrls: ['./toggle-button.component.scss'],
  templateUrl: './toggle-button.component.html',
  host: {
    style: 'display:flex;padding:1px;height:100%;cursor:pointer',
    hostID: 'dui-toggle-button' + Math.random().toString(36).substring(2, 15)
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ToggleButtonComponent extends ComponentBase implements OnInit,DoCheck,OnChanges {
  /**
   * Input property `config` (`any`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`any`），用于配置配置（默认值：`{}`）。
   */
  @Input() config = {};

  /**
   * Input property `data` (`any`) configuring data.
   * @zh 输入属性 `data`（类型：`any`），用于配置数据。
   */
  @Input() data;

  /**
   * Template/content query reference `childMenu` (`@ViewChild`) targeting child menu.
   * @zh 模板/内容视图查询引用 `childMenu`（`@ViewChild`），指向子级菜单。
   */
  @ViewChild('childMenu', { static: true }) public childMenu;


  /**
   * Property `items` (`Array<any>`) storing items (default: `[]`).
   * @zh 属性 `items`（类型：`Array<any>`），用于存储或配置条目列表（默认值：`[]`）。
   */
  public items = [];

  /**
   * Property `disableRipple` (`boolean`) storing disable ripple (default: `false`).
   * @zh 属性 `disableRipple`（类型：`boolean`），用于存储或配置禁用Ripple（默认值：`false`）。
   */
  public disableRipple: boolean = false;

  /**
   * Property `appearance` (`MatButtonToggleAppearance`) storing appearance (default: `'standard'`).
   * @zh 属性 `appearance`（类型：`MatButtonToggleAppearance`），用于存储或配置appearance（默认值：`'standard'`）。
   */
  public appearance: MatButtonToggleAppearance = 'standard';

  /**
   * Property `multiple` (`boolean`) storing multiple (default: `false`).
   * @zh 属性 `multiple`（类型：`boolean`），用于存储或配置多个（默认值：`false`）。
   */
  public multiple: boolean = false;

  /**
   * Property `name` (`string`) storing name (default: `''`).
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称（默认值：`''`）。
   */
  public name: string = '';

  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  public value ;

  /**
   * Property `disabled` (`boolean`) storing disabled (default: `false`).
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用（默认值：`false`）。
   */
  public override disabled: boolean = false;

  /**
   * Property `vertical` (`boolean`) storing vertical (default: `false`).
   * @zh 属性 `vertical`（类型：`boolean`），用于存储或配置垂直（默认值：`false`）。
   */
  public vertical: boolean = false;

  /**
   * Property `style` (`any`) storing style.
   * @zh 属性 `style`（类型：`any`），用于存储或配置样式。
   */
  public declare style;

  /**
   * Property `icon` (`any`) storing icon.
   * @zh 属性 `icon`（类型：`any`），用于存储或配置图标。
   */
  public icon;

  /**
   * Property `checked` (`boolean`) storing checked (default: `false`).
   * @zh 属性 `checked`（类型：`boolean`），用于存储或配置已勾选（默认值：`false`）。
   */
  public checked:boolean=false;

  /**
   * Property `iconPosition` (`string`) storing icon position (default: `'before'`).
   * @zh 属性 `iconPosition`（类型：`string`），用于存储或配置图标位置（默认值：`'before'`）。
   */
  public iconPosition = 'before';

  /**
   * Property `toolTip` (`string`) storing tool tip (default: `''`).
   * @zh 属性 `toolTip`（类型：`string`），用于存储或配置tool提示（默认值：`''`）。
   */
  public toolTip='';

  /**
   * Property `text` (`string`) storing text (default: `''`).
   * @zh 属性 `text`（类型：`string`），用于存储或配置文本（默认值：`''`）。
   */
  public text='';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Property `change` (`any`) storing change (default: `(e) => { }`).
   * @zh 属性 `change`（类型：`any`），用于存储或配置变更（默认值：`(e) => { }`）。
   */
  public change = (e) => { };

  /**
   * Creates an instance of `ToggleButtonComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ToggleButtonComponent` 实例，并初始化其依赖项与内部状态。
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param matIconRegistry - Injected or initial mat icon registry (`MatIconRegistry`) / 注入或传入的Material图标Registry（`MatIconRegistry`）
   * @param domSanitizer - Injected or initial dom sanitizer (`DomSanitizer`) / 注入或传入的DOM节点安全清理器（`DomSanitizer`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    public resolver: ComponentFactoryResolver,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public injector: Injector, ) {
    super(_changeDetectorRef);
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
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    this.initFieldExpression(this.config);
    this.items.forEach(item => {
      if (item.icon) {
        if (item.icon.startsWith("SVG")) {
          item.iconType = "SVG";
          let vals = item.icon.split(":");
          item.svgIcon = vals[1];
          this.matIconRegistry.addSvgIcon(
            vals[1],
            this.domSanitizer.bypassSecurityTrustResourceUrl(vals[2])
          );
        } else if (item.icon.startsWith("FONT")) {
          item.iconType = "FONT";
          let vals = item.icon.split(":");
          item.icon = vals[1];
        }
      }
      this.initFieldExpression(item);
    });
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
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
    if (config && config.children) {
      this.items = config.children;
    }
    if (config && config.iconPosition) {
      this.iconPosition = config.iconPosition;
    }
    if (config && config.text) {
      this.text = config.text;
    }
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Executes `hasIcon` to handle has icon.
   * @zh 执行 `hasIcon`，用于是否包含图标。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   */
  public hasIcon(item) {
    return item.icon != undefined;
  }

  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   * @param btn - btn parameter (`any`) / 按钮参数（`any`）
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public onClick(btn,e){
    if (e) {
      e.preventDefault();
    }
    if (!btn.disabled) {
      setTimeout(() => {
        if (btn.handler) {
          btn.handler.call(this, btn, e);
        }
      }, 50);
    }
  }
  /**
   * Executes `setValue` to handle set value.
   * @zh 执行 `setValue`，用于集合值。
   * @param v - v parameter (`any`) / v参数（`any`）
   */
  setValue(v){
    this.value=v;
    this._changeDetectorRef.detectChanges();
  }
  /**
   * Executes `onDestroy` to handle on destroy.
   * @zh 执行 `onDestroy`，用于当销毁。
   */
  override onDestroy() {
    super.onDestroy();
  }
  /**
   * Executes `initFieldExpression` to handle init field expression.
   * @zh 执行 `initFieldExpression`，用于初始化字段表达式。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  public override initFieldExpression(config) {
    if (config.expressionProperties) {
      for (const key in config.expressionProperties) {
        if (typeof config.expressionProperties[key] === 'string' || isFunction(config.expressionProperties[key])) {
          config.expressionProperties[key] = {
            expression: isFunction(config.expressionProperties[key]) ? config.expressionProperties[key] : Dui.evalStringExpression(config.expressionProperties[key], ['comp', 'owner']),
            expressionValueSetter: Dui.evalExpressionValueSetter(key, ['expressionValue', 'comp', 'owner']),
          };
        }
      }
    }
    if (config.hideExpression) {
      if (typeof config.hideExpression === 'string') {
        config.hideExpression = Dui.evalStringExpression(config.hideExpression, ['comp', 'owner']);
      }
    }
    if (config.disableExpression) {
      if (typeof config.disableExpression === 'string') {
        config.disableExpression = Dui.evalStringExpression(config.disableExpression, ['comp', 'owner']);
      }
    }
  }

  /**
   * Executes `checkExpressionChange` to handle check expression change.
   * @zh 执行 `checkExpressionChange`，用于检查表达式变更。
   */
  public override checkExpressionChange() {
    this.checkCompExpressionChange(this, this.ownerCt);
    this.checkCompVisibilityChange(this, this.ownerCt);
    if(this.items.length!=0){
      this.items.forEach(item => {
        this.checkMenuExpressionChange(item, this.ownerCt);
        this.checkMenuVisibilityChange(item, this.ownerCt);
        this.checkMenuDisableChange(item, this.ownerCt);
      });
    }
  }

  /**
   * Executes `checkMenuExpressionChange` to handle check menu expression change.
   * @zh 执行 `checkMenuExpressionChange`，用于检查菜单表达式变更。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
  public checkMenuExpressionChange(comp, owner: ComponentBase) {
    if (!comp || !comp.expressionProperties) {
      return;
    }
    const expressionProperties = comp.expressionProperties;
    for (const key in expressionProperties) {
      const expressionValue = Dui.evalExpression(
        expressionProperties[key].expression,
        { comp },
        [comp, owner],
      );
      if (
        expressionProperties[key].expressionValue !== expressionValue
        && (!isObjectLike(expressionValue) || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue))
      ) {
        expressionProperties[key].expressionValue = expressionValue;
        Dui.evalExpression(
          expressionProperties[key].expressionValueSetter,
          { comp },
          [expressionValue, comp, owner],
        );
      }
    }
  }
  /**
   * Executes `checkMenuVisibilityChange` to handle check menu visibility change.
   * @zh 执行 `checkMenuVisibilityChange`，用于检查菜单Visibility变更。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
  public checkMenuVisibilityChange(comp, owner: ComponentBase) {
    if (!comp || !comp.hideExpression) {
      return;
    }
    const hideExpressionResult: boolean = !!Dui.evalExpression(
      comp.hideExpression,
      { comp },
      [comp, owner],
    );
    if (hideExpressionResult !== comp.hidden) {
      comp.hidden = hideExpressionResult;
    }
  }
  /**
   * Executes `checkMenuDisableChange` to handle check menu disable change.
   * @zh 执行 `checkMenuDisableChange`，用于检查菜单禁用变更。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
  public checkMenuDisableChange(comp, owner: ComponentBase) {
    if (!comp || !comp.disableExpression) {
      return;
    }
    const disableExpressionResult: boolean = !!Dui.evalExpression(
      comp.disableExpression,
      { comp },
      [comp, owner],
    );
    if (disableExpressionResult !== comp.disable || disableExpressionResult !== comp.disabled) {
      comp.disable = disableExpressionResult;
      comp.disabled = disableExpressionResult;
    }
  }
}
