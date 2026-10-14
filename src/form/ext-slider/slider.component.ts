import { Component, ViewChild ,  forwardRef, ChangeDetectionStrategy} from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatSliderThumb  } from '@angular/material/slider';
@Component({
  selector: 'slider-field',
  styleUrls: ['./slider.component.scss'],
  templateUrl: './slider.component.html',
  host: {
    style: 'flex:1;display:flex;flex-direction:row;',
    hostID: 'slider-field' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderFieldComponent extends MatField {

  @ViewChild(forwardRef(() => MatSliderThumb ),{static: true})
  private slider: MatSliderThumb ;

  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
  };
  override onContainerClick(event: MouseEvent): void {
    this.slider.focus();
    super.onContainerClick(event);
  }
}
