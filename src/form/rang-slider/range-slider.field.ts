import { Component, ViewChild ,  forwardRef, ChangeDetectionStrategy} from '@angular/core';
import { MatField } from '../base/mat.field';
import { RangeSlider } from './range-slider.component';

@Component({
  selector: 'range-slider-field',
  templateUrl:'./range-slider.field.html',
  styleUrls: ['./range-slider.field.scss'],
  host: {
    style: 'flex:1;display:flex;flex-direction:row;width:98%;',
    hostID: 'range-slider-field' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeSliderFieldComponent extends MatField {

  @ViewChild(forwardRef(() => RangeSlider),{static: true})
  private slider: RangeSlider;

  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
  };
  override onContainerClick(event: MouseEvent): void {
  //  this.slider.focus();
    super.onContainerClick(event);
  }
}
