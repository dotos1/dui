import { Component, ViewChild ,  forwardRef, ChangeDetectionStrategy} from '@angular/core';
import { MatField } from '../base/mat.field';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderRangeThumb } from '@angular/material/slider';
import { Subject, takeUntil, merge  } from 'rxjs';


@Component({
  selector: 'range-slider-field',
  templateUrl:'./range-slider.field.html',
  styleUrls: ['./range-slider.field.scss'],
 host: {
    style: 'flex:1;display:flex;flex-direction:row;',
    hostID: 'slider-field' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderFieldComponent),
      multi: true,
    }
  ]
})
export class RangeSliderFieldComponent extends MatField {
  @ViewChild(forwardRef(() => MatSliderRangeThumb ),{static: true})
  private rangeSlider: MatSliderRangeThumb ;


  startCtrl = new FormControl(20);
  endCtrl = new FormControl(80);

  private destroy$ = new Subject<void>();

  override ngOnInit() {
    super.ngOnInit

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
        this.formControl.setValue([startVal, endVal], { emitEvent: false });
      });
  }

  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
  };
  override onContainerClick(event: MouseEvent): void {
    this.rangeSlider.focus();
    super.onContainerClick(event);
  }
}
