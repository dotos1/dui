/**
 * @fileoverview Module `src/form/rang-slider/range-slider.field.ts` providing range slider field definitions and implementation.
 * @zh 模块文件 `src/form/rang-slider/range-slider.field.ts`，提供范围滑块字段相关的定义与实现。
 */

import { Component, ViewChild ,  forwardRef, ChangeDetectionStrategy} from '@angular/core';
import { MatField } from '../base/mat.field';
import { FormControl } from '@angular/forms';
import { MatSliderRangeThumb } from '@angular/material/slider';
import { Subject, takeUntil, merge  } from 'rxjs';


/**
 * Angular component `RangeSliderFieldComponent` (selector: 'range-slider-field') providing range slider field component presentation and interaction in `src/form/rang-slider`.
 * @zh Angular 组件 `RangeSliderFieldComponent`（selector: 'range-slider-field'），提供范围滑块字段组件的视图渲染与交互逻辑（位于 `src/form/rang-slider`）。
 */
@Component({
  selector: 'range-slider-field',
  templateUrl:'./range-slider.field.html',
  styleUrls: ['./range-slider.field.scss'],
 host: {
    style: 'flex:1;display:flex;flex-direction:row;',
    hostID: 'slider-field' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RangeSliderFieldComponent extends MatField {
  /**
   * Template/content query reference `rangeSlider` (`MatSliderRangeThumb`) targeting range slider.
   * @zh 模板/内容视图查询引用 `rangeSlider`（`@ViewChild`），指向范围滑块。
   */
  @ViewChild(forwardRef(() => MatSliderRangeThumb ),{static: true})
  private rangeSlider: MatSliderRangeThumb ;


  /**
   * Property `startCtrl` (`FormControl<number>`) storing start ctrl (default: `new FormControl(20)`).
   * @zh 属性 `startCtrl`（类型：`FormControl<number>`），用于存储或配置开始Ctrl（默认值：`new FormControl(20)`）。
   */
  startCtrl = new FormControl(20);
  /**
   * Property `endCtrl` (`FormControl<number>`) storing end ctrl (default: `new FormControl(80)`).
   * @zh 属性 `endCtrl`（类型：`FormControl<number>`），用于存储或配置结束Ctrl（默认值：`new FormControl(80)`）。
   */
  endCtrl = new FormControl(80);

  /**
   * Property `destroy$` (`Subject<void>`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `destroy$`（类型：`Subject<void>`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private destroy$ = new Subject<void>();

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  override ngOnInit() {
    super.ngOnInit();

    this.formControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        if (val && val.length === 2) {

          this.startCtrl.setValue(val[0], { emitEvent: false });
          this.endCtrl.setValue(val[1], { emitEvent: false });
        }
      });

    merge(this.startCtrl.valueChanges, this.endCtrl.valueChanges)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const startVal = this.startCtrl.value ?? 0;
        const endVal = this.endCtrl.value ?? 100;
        this.formControl.setValue([startVal, endVal], { emitEvent: true });
      });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    // 用了 takeUntil(destroy$) 但从未触发过 destroy$，两个订阅（连同它们
    // 闭包持有的组件实例）会一直存活到 formControl 本身被回收为止
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy();
  }

  /**
   * Property `defaultOptions` (`{ hideFieldUnderline: boolean; floatLabel: string; }`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`{ hideFieldUnderline: boolean; floatLabel: string; }`），用于存储或配置默认配置选项。
   */
  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
  };
  /**
   * Executes `onContainerClick` to handle on container click.
   * @zh 执行 `onContainerClick`，用于当容器点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  override onContainerClick(event: MouseEvent): void {
    this.rangeSlider.focus();
    super.onContainerClick(event);
  }
}
