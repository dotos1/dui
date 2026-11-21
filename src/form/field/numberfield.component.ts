/**
 * @fileoverview Module `src/form/field/numberfield.component.ts` providing numberfield component definitions and implementation.
 * @zh 模块文件 `src/form/field/numberfield.component.ts`，提供numberfield组件相关的定义与实现。
 */


import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { Dui } from '@dotos1/dui/core';
import { TranslateService } from '@dotos1/dui/translator';
import {isObjectLike}  from 'lodash-es';
import { MatField } from '../base/mat.field';

/**
 * Normalized unit configuration used by `NumberFieldComponent`.
 * @zh 数字字段内部使用的规范化单位配置。
 */
export interface NormalizedUnit {
  /** Native unit id. @zh 原生单位 id。 */
  nativeUnit: string;
  /** Unit list. @zh 单位列表。 */
  units: { id: string; name: string; factor: number; offset: number }[];
}

/**
 * Normalizes the `unit` option of a number field. Accepts a string (`'m'`), an array of units
 * (strings or `{ id, name?, factor?, offset? }`), or the full `{ nativeUnit, units }` form.
 * Returns `null` when no usable unit is configured.
 * @zh 规范化数字字段的 `unit` 配置：支持字符串、单位数组（元素为字符串或对象）、完整的 `{ nativeUnit, units }`；无有效单位时返回 `null`。
 * @param unit - raw `unit` option / 原始 unit 配置
 */
export function normalizeUnit(unit: unknown): NormalizedUnit | null {
  if (unit === null || unit === undefined || unit === '' || unit === false) return null;
  const toItem = (u: unknown) => {
    if (typeof u === 'string' || typeof u === 'number') {
      return { id: String(u), name: String(u), factor: 1, offset: 0 };
    }
    if (isObjectLike(u)) {
      const o = u as Record<string, unknown>;
      const id = String(o['id'] ?? o['name'] ?? '');
      return { id, name: String(o['name'] ?? id), factor: Number(o['factor'] ?? 1), offset: Number(o['offset'] ?? 0) };
    }
    return null;
  };
  let nativeUnit: string | undefined;
  let rawUnits: unknown[];
  if (Array.isArray(unit)) {
    rawUnits = unit;
  } else if (isObjectLike(unit)) {
    const o = unit as Record<string, unknown>;
    nativeUnit = o['nativeUnit'] != null ? String(o['nativeUnit']) : undefined;
    rawUnits = Array.isArray(o['units']) ? (o['units'] as unknown[]) : [];
  } else {
    rawUnits = [unit];
  }
  const units = rawUnits.map(toItem).filter((u): u is NonNullable<ReturnType<typeof toItem>> => !!u && u.id !== '');
  if (nativeUnit === undefined) nativeUnit = units[0]?.id;
  if (nativeUnit === undefined) return null;
  if (!units.some(u => u.id === nativeUnit)) units.unshift({ id: nativeUnit, name: nativeUnit, factor: 1, offset: 0 });
  return { nativeUnit, units };
}

/**
 * Angular component `NumberFieldComponent` (selector: 'number-field') providing number field component presentation and interaction in `src/form/field`.
 * @zh Angular 组件 `NumberFieldComponent`（selector: 'number-field'），提供数字字段组件的视图渲染与交互逻辑（位于 `src/form/field`）。
 */
@Component({
  selector: 'number-field',
  templateUrl: './numberfield.component.html',
  styleUrls: ['./numberfield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'number-field' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class NumberFieldComponent extends MatField implements AfterViewInit {

  /**
   * Property `type` (`string`) storing type (default: `'number'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'number'`）。
   */
  type: string = 'number';

  /**
   * Property `defaultUnit` (`string`) storing default unit (default: `''`).
   * @zh 属性 `defaultUnit`（类型：`string`），用于存储或配置默认Unit（默认值：`''`）。
   */
  defaultUnit='';

  /**
   * Property `currentUnit` (`string`) storing current unit (default: `''`).
   * @zh 属性 `currentUnit`（类型：`string`），用于存储或配置当前Unit（默认值：`''`）。
   */
  currentUnit='';

  /**
   * Property `units` (`{ id: string; name: string; factor: number; offset: number; }[]`) storing units (default: `[]`).
   * @zh 属性 `units`（类型：`{ id: string; name: string; factor: number; offset: number; }[]`），用于存储或配置units（默认值：`[]`）。
   */
  units: NormalizedUnit['units'] = [];

  /**
   * Normalized unit configuration (`null` when the field has no unit).
   * @zh 规范化后的单位配置（无单位时为 `null`）。
   */
  unitCfg: NormalizedUnit | null = null;

  /**
   * Creates an instance of `NumberFieldComponent` and initializes its dependencies and internal state.
   * @zh 创建 `NumberFieldComponent` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   */
  constructor(
    protected _elementRef: ElementRef,
    protected override translate: TranslateService
  ) {
    super(translate);
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  override ngAfterViewInit() {
    super.ngAfterViewInit()
    let val=this.field.formControl.value;
    if (isObjectLike(val) && val.text) {
      this._elementRef.nativeElement.children[0].value = val.text;
    }
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  override init(): void {
    super.init();
    if (this.field.xtype=='number-field'&& this.field.min != undefined) {
      let minErrorText= this.field.minText?this.translate.instant(this.field.minText):this.translate.instant("FORM.MINTEXT");
      this.field.validation.messages['min'] = Dui.format(minErrorText, this.field.min);
    }
    if (this.field.xtype=='number-field'&& this.field.max != undefined) {
      let maxErrorText= this.field.maxText?this.translate.instant(this.field.maxText):this.translate.instant("FORM.MAXTEXT");
      this.field.validation.messages['max'] = Dui.format(maxErrorText, this.field.max);
    }
    this.unitCfg = normalizeUnit(this.field.unit);
    if(this.unitCfg){
      this.defaultUnit=this.unitCfg.nativeUnit;
      this.currentUnit=this.unitCfg.nativeUnit;
      this.units=this.unitCfg.units;
    }
  }

  /**
   * Executes `unitchange` to handle unitchange.
   * @zh 执行 `unitchange`，用于unitchange。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  unitchange(event){
    this.currentUnit=event.value;
    let unit=this.units.filter((u)=>u.id== this.currentUnit)[0];
    let val=this.field.formControl.value;
    if(this.currentUnit!=this.defaultUnit && unit){
      // `!= ''` loosely coerces '' to 0, so `0 != ''` is false -- a formControl value of
      // exactly 0 (e.g. 0°C) silently skipped the conversion entirely. `!== ''` compares
      // by type as well as value, so 0 correctly passes the guard.
      if(val !== '' && val !== null && val !== undefined){
        this.field.inputValue=val*unit.factor+unit.offset;
      } else {
        this.field.inputValue = null;
      }
    }else{
      if(val !== '' && val !== null && val !== undefined){
        this.field.inputValue=val;
      } else {
        this.field.inputValue = null;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onChange` to handle on change.
   * @zh 执行 `onChange`，用于当变更。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public onChange(e) {
    let unit=this.units.filter((u)=>u.id== this.currentUnit)[0];
    let val=this.field.formControl.value;
    if(this.currentUnit!=this.defaultUnit && unit){
      // Same `!= ''` vs `0` pitfall as unitchange() above.
      if(val !== '' && val !== null && val !== undefined){
        this.field.formControl.patchValue((val-unit.offset)/unit.factor);
        this.field.inputValue=val;
      } else {
        this.field.formControl.patchValue(null);
        this.field.inputValue = null;
      }
    }else{
      this.field.inputValue=val;
    }
  }
}
