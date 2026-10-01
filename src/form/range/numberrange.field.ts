import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { TranslateService } from '@dotos/dui/translator';
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
 */
@Component({
  selector: 'number-range-field',
  templateUrl: './numberrange.field.html',
  styleUrls: ['./range.field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberRangeFieldComponent),
    multi: true
  }],
  host: {
    style: 'flex:1;display:flex;flex-direction:row;align-items:center;',
    hostID: 'number-range-field' + Math.random().toString(36).substring(2, 15),
  }
})
export class NumberRangeFieldComponent extends RangeField {

  type: string = 'number-range';

  constructor(protected override translate: TranslateService) {
    super(translate);
  }

  get sliderMin(): number {
    return this.toBound(this.field.min, 0);
  }

  get sliderMax(): number {
    return this.toBound(this.field.max, 100);
  }

  get sliderStep(): number {
    return this.field.step != undefined ? Number(this.field.step) : 1;
  }

  protected formatPart(value: any): string {
    return this.isBlank(value) ? '' : String(value);
  }

  /** 配置缺失时兜个底，免得 mat-slider 拿到 NaN 直接报错；真正的把关在配置侧。 */
  private toBound(value: any, fallback: number): number {
    if (this.isBlank(value)) {
      return fallback;
    }
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  }

  /** 滑块的 thumb 只接受数字，后台下发的缺省值是字符串。 */
  protected override parsePart(value: any): any {
    if (this.isBlank(value)) {
      return null;
    }
    const num = Number(value);
    return isNaN(num) ? null : num;
  }
}
