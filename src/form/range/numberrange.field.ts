/**
 * @fileoverview Module `src/form/range/numberrange.field.ts` providing numberrange field definitions and implementation.
 * @zh 模块文件 `src/form/range/numberrange.field.ts`，提供numberrange字段相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { TranslateService } from '@dotos1/dui/translator';
import { RangeField } from './range.field';

/**
 * 数值区间输入，用于 `between` 条件。
 *
 * 用 Material 的双滑块 mat-slider（matSliderStartThumb / matSliderEndThumb）：
 * 一个控件拖完起止两端，整体只占一个表单字段，扩展过滤器的单值单元格也放得下。
 *
 * 滑块必须有上下界，`min` / `max` 由配置提供：条件列的「输入扩展项」里写
 * {"min":"202001","max":"203012"}。这是数值区间框的必填项，条件字段设置在
 * 保存时会校验——像年月 202401 这种列，没有上下界的滑块是拖不出正确值的。

 * @zh 数值区间输入，用于 `between` 条件。
 */
@Component({
  selector: 'number-range-field',
  templateUrl: './numberrange.field.html',
  styleUrls: ['./range.field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  host: {
    style: 'flex:1;display:flex;flex-direction:row;align-items:center;',
    hostID: 'number-range-field' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class NumberRangeFieldComponent extends RangeField {

  /**
   * Property `type` (`string`) storing type (default: `'number-range'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'number-range'`）。
   */
  type: string = 'number-range';

  /**
   * Creates an instance of `NumberRangeFieldComponent` and initializes its dependencies and internal state.
   * @zh 创建 `NumberRangeFieldComponent` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   */
  constructor(protected override translate: TranslateService) {
    super(translate);
  }

  /**
   * Gets the current slider min (`sliderMin: number`).
   * @zh 获取当前滑块最小值（`sliderMin: number`）。
   */
  get sliderMin(): number {
    return this.toBound(this.field.min, 0);
  }

  /**
   * Gets the current slider max (`sliderMax: number`).
   * @zh 获取当前滑块最大值（`sliderMax: number`）。
   */
  get sliderMax(): number {
    return this.toBound(this.field.max, 100);
  }

  /**
   * Gets the current slider step (`sliderStep: number`).
   * @zh 获取当前滑块步骤（`sliderStep: number`）。
   */
  get sliderStep(): number {
    return this.field.step != undefined ? Number(this.field.step) : 1;
  }

  /**
   * Executes `formatPart` to handle format part.
   * @zh 执行 `formatPart`，用于格式化Part。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  protected formatPart(value): string {
    return this.isBlank(value) ? '' : String(value);
  }

  /**
   * 配置缺失时兜个底，免得 mat-slider 拿到 NaN 直接报错；真正的把关在配置侧。
   * @zh 配置缺失时兜个底，免得 mat-slider 拿到 NaN 直接报错；真正的把关在配置侧。
   */
  private toBound(value, fallback: number): number {
    if (this.isBlank(value)) {
      return fallback;
    }
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  }

  /**
   * 滑块的 thumb 只接受数字，后台下发的缺省值是字符串。
   * @zh 滑块的 thumb 只接受数字，后台下发的缺省值是字符串。
   */
  protected override parsePart(value) {
    if (this.isBlank(value)) {
      return null;
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
  }
}
