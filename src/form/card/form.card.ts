/**
 * @fileoverview Module `src/form/card/form.card.ts` providing form card definitions and implementation.
 * @zh 模块文件 `src/form/card/form.card.ts`，提供表单卡片相关的定义与实现。
 */

import { DuiConfig } from '@dotos/dui/base';
import {
  Component, Input, ViewChild, ChangeDetectionStrategy,
  SimpleChanges, ChangeDetectorRef, Injector, OnInit, OnChanges
} from '@angular/core';
import { DuiCardComponent } from '@dotos/dui/container';
import { FormComponent } from '@dotos/dui/form';
import { TranslateService } from '@dotos/dui/translator';

/**
 * Angular component `FormCard` (selector: 'form-card') providing form card presentation and interaction in `src/form/card`.
 * @zh Angular 组件 `FormCard`（selector: 'form-card'），提供表单卡片的视图渲染与交互逻辑（位于 `src/form/card`）。
 */
@Component({
  selector: 'form-card',
  styleUrls: ['./form.card.scss'],
  templateUrl: './form.card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 
    hostID: 'dui-form-card' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})

export class FormCard extends DuiCardComponent implements OnInit,OnChanges {

  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() override config: DuiConfig = {};


  /**
   * Template/content query reference `formComponent` (`FormComponent`) targeting form component.
   * @zh 模板/内容视图查询引用 `formComponent`（`@ViewChild`），指向表单组件。
   */
  @ViewChild(FormComponent, { static: true })
  formComponent: FormComponent;


  /**
   * Property `hideHead` (`boolean`) storing hide head (default: `false`).
   * @zh 属性 `hideHead`（类型：`boolean`），用于存储或配置隐藏Head（默认值：`false`）。
   */
  public hideHead: boolean = false;

  /**
   * Property `layout` (`string`) storing layout (default: `'form'`).
   * @zh 属性 `layout`（类型：`string`），用于存储或配置布局（默认值：`'form'`）。
   */
  public override layout = 'form';

  /**
   * Creates an instance of `FormCard` and initializes its dependencies and internal state.
   * @zh 创建 `FormCard` 实例，并初始化其依赖项与内部状态。
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param translateService - Injected or initial translate service (`TranslateService`) / 注入或传入的翻译服务（`TranslateService`）
   */
  constructor(
    public override injector: Injector,
    protected _changeDetectorRef: ChangeDetectorRef,
    public override translateService: TranslateService) {
    super(injector, _changeDetectorRef, translateService);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    super.ngOnInit();
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

  // private
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
    this.initItems();
  }

  /**
   * Provides access to the {@link Ext.form.BasicForm Form} which this Panel contains.
   * returnwhich this Panel contains.

   * @zh 执行 `getForm`，用于获取表单。
   */
  getForm(): FormComponent {
    return this.formComponent;
  }

  // private
  /**
   * Executes `beforeDestroy` to handle before destroy.
   * @zh 执行 `beforeDestroy`，用于之前销毁。
   */
  override beforeDestroy() {
    //  this.formComponent.destroy(true);
    super.beforeDestroy();
  }

  // Determine if a Component is usable as a form Field.
  /**
   * Executes `isField` to handle is field.
   * @zh 执行 `isField`，用于是否为字段。
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  isField(c) {
    return !!c.setValue && !!c.getValue && !!c.markInvalid && !!c.clearInvalid;
  }

}
