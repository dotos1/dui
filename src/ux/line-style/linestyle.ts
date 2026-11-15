/**
 * @fileoverview Module `src/ux/line-style/linestyle.ts` providing linestyle definitions and implementation.
 * @zh 模块文件 `src/ux/line-style/linestyle.ts`，提供linestyle相关的定义与实现。
 */

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation, ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldConfig } from '@dotos/dui/core/form';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { MatField } from '@dotos/dui/form';
import { DotosConfigService, ThemeService, matColor } from '@dotos/dui/theme';
import { TranslateService } from '@dotos/dui/translator';
import {isString}  from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Constant/variable `PRE_DEFINED_THEMES` defining pre defined themes in `src/ux/line-style`.
 * @zh 常量/变量 `PRE_DEFINED_THEMES`，定义 `src/ux/line-style` 中的PREDEFINED主题。
 */
export const PRE_DEFINED_THEMES = [
  { value: '0,0,0' },
  { value: '1,1,1' },
  { value: '5,5,5' },
  { value: '20,5,10' },
  { value: '15,3,3' },
  { value: '20,3,3,3,3' },
  { value: '12,3,3' },
];
/**
 * Angular component `LineStyleSelector` (selector: 'line-style-field') providing line style selector presentation and interaction in `src/ux/line-style`.
 * @zh Angular 组件 `LineStyleSelector`（selector: 'line-style-field'），提供线段样式选择器的视图渲染与交互逻辑（位于 `src/ux/line-style`）。
 */
@Component({
  selector: 'line-style-field',
  templateUrl: './linestyle.html',
  styleUrls: ['./linestyle.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    style: 'flex:1;',
    
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LineStyleSelector<F extends FieldConfig = FieldConfig>
  extends MatField
  implements OnInit, OnDestroy, AfterViewInit
{
  /**
   * Template/content query reference `lineCavases` (`QueryList<ElementRef<any>>`) targeting line cavases.
   * @zh 模板/内容视图查询引用 `lineCavases`（`@ViewChildren`），指向线段Cavases。
   */
  @ViewChildren('linestyle') lineCavases: QueryList<ElementRef>;

  /**
   * Template/content query reference `lineStyleTriggerEl` (`ElementRef<any>`) targeting line style trigger el.
   * @zh 模板/内容视图查询引用 `lineStyleTriggerEl`（`@ViewChild`），指向线段样式触发DOM元素。
   */
  @ViewChild('lineStyleTrigger')
  private lineStyleTriggerEl: ElementRef;
  

  /**
   * Property `styleOptions` (`{ value: string; }[]`) storing style options (default: `PRE_DEFINED_THEMES`).
   * @zh 属性 `styleOptions`（类型：`{ value: string; }[]`），用于存储或配置样式配置选项（默认值：`PRE_DEFINED_THEMES`）。
   */
  public styleOptions = PRE_DEFINED_THEMES;

  /**
   * Property `inputValue` (`any[]`) storing input value (default: `[]`).
   * @zh 属性 `inputValue`（类型：`any[]`），用于存储或配置输入属性值（默认值：`[]`）。
   */
  public inputValue = [];

  /**
   * Property `formControlUnbind` (`() => void`) storing form control unbind.
   * @zh 属性 `formControlUnbind`（类型：`() => void`），用于存储或配置表单表单控件解绑。
   */
  private formControlUnbind?: () => void;

  /**
   * Input setter `field` updating field.
   * @zh 输入属性 `field` 的设置器，用于更新字段。
   * @param f - New field value (`any`) / 新的字段值（`any`）
   */
  @Input()
  override set field(f) {
    this._field = f;
    this.unbindFormControl();
    if (this._field?.formControl instanceof FormControl) {
      // 用 registerOnChange 而不是 valueChanges(b8c5e5c 复核):外部用
      // setValue(v, { emitEvent: false }) 回填时 valueChanges 不发,线型预览就
      // 停在旧值;registerOnChange 的回调只看 emitModelToViewChange,照样重绘。
      // 换 field 或销毁时用 _unregisterOnChange 解绑(Angular 内部方法,
      // @angular/forms 的 cleanUpControl 也是这么解的),否则回调挂在长寿的
      // FormControl 上,组件销毁后还会被调用。
      const control = this._field.formControl as FormControl;
      const onChange = (value) => {
        if (value != null) {
          this.setValue(value);
        }
      };
      control.registerOnChange(onChange);
      this.formControlUnbind = () => (control as unknown as { _unregisterOnChange? })._unregisterOnChange?.(onChange);
    }
  }

  /**
   * Executes `unbindFormControl` to handle unbind form control.
   * @zh 执行 `unbindFormControl`，用于解绑表单表单控件。
   */
  private unbindFormControl() {
    this.formControlUnbind?.();
    this.formControlUnbind = undefined;
  }
  /**
   * Gets the current field (`field: any`).
   * @zh 获取当前字段（`field: any`）。
   */
  override get field() {
    return this._field || {};
  }
  /**
   * Property `onDestroy$` (`Subject<void>`) storing on destroy (default: `new Subject<void>()`).
   * @zh 属性 `onDestroy$`（类型：`Subject<void>`），用于存储或配置当销毁（默认值：`new Subject<void>()`）。
   */
  private onDestroy$ = new Subject<void>();
  /**
   * Property `lineColor` (`string`) storing line color (default: `'rgba(0, 0, 0, 1.0)'`).
   * @zh 属性 `lineColor`（类型：`string`），用于存储或配置线段颜色（默认值：`'rgba(0, 0, 0, 1.0)'`）。
   */
  private lineColor = 'rgba(0, 0, 0, 1.0)';

  /**
   * Creates an instance of `LineStyleSelector` and initializes its dependencies and internal state.
   * @zh 创建 `LineStyleSelector` 实例，并初始化其依赖项与内部状态。
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
   * @param dotosConfigService - Injected or initial dotos config service (`DotosConfigService`) / 注入或传入的DotOS配置服务（`DotosConfigService`）
   */
  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected override translate: TranslateService,
    protected themeService: ThemeService,
    public localStore: LocalStorageService,
    protected dotosConfigService: DotosConfigService
  ) {
    super(translate);
  }
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    super.ngOnInit();
    this.dotosConfigService.config
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        let theme = this.themeService.getTheme();
        this.lineColor = matColor(theme.foreground, 'text');
      });
    const config = this.localStore.get('dotosConfig');
    this.dotosConfigService.config = config;
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setValue(this.inputValue);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    this.unbindFormControl();
    super.ngOnDestroy();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Executes `openedChange` to handle opened change.
   * @zh 执行 `openedChange`，用于是否展开变更。
   */
  openedChange() {
    for (let i = 0; i < PRE_DEFINED_THEMES.length; i++) {
      this.drawDashedLine(i, PRE_DEFINED_THEMES[i].value);
    }
  }

  /**
   * Executes `drawDashedLine` to handle draw dashed line.
   * @zh 执行 `drawDashedLine`，用于绘制Dashed线段。
   * @param index - index parameter (`any`) / 索引参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  drawDashedLine(index, value) {
    let dashs = value.split(',');
    let canvas = this.lineCavases.get(index).nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = this.lineColor;
    ctx.beginPath();
    ctx.setLineDash(dashs);
    ctx.moveTo(2, canvas.height/2-1);
    ctx.lineTo(canvas.width-2, canvas.height/2-1);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  /**
   * Executes `change` to handle change.
   * @zh 执行 `change`，用于变更。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  change($event) {
    let dashs = $event.value;
    this.setValue(dashs);
    if (this.field.change) {
      this.field.change(this, $event);
    }
  }
  /**
   * Executes `setValue` to handle set value.
   * @zh 执行 `setValue`，用于集合值。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  setValue(value) {
    let dashs = [];
    if(isString(value)){
      dashs= value.split(',');
    }
    let canvas = this.lineStyleTriggerEl.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = this.lineColor;

    ctx.beginPath();
    ctx.setLineDash(dashs);
    ctx.moveTo(0, canvas.height/2-1);
    ctx.lineTo(canvas.width-5, canvas.height/2-1);
    ctx.lineWidth = 2;
    ctx.stroke();

    this._changeDetectorRef.detectChanges();
    this.inputValue = value;
    this.field.inputValue = value;
    this.field.formControl.value = value;
  }
  /**
   * Executes `compareWith` to handle compare with.
   * @zh 执行 `compareWith`，用于比较带有。
   * @param o1 - o1 parameter (`any`) / o1参数（`any`）
   * @param o2 - o2 parameter (`any`) / o2参数（`any`）
   */
  compareWith(o1, o2) {
    return o1 === o2;
  }
}
