import { Component, ViewChild ,  forwardRef, ChangeDetectionStrategy} from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatSliderThumb  } from '@angular/material/slider';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'slider-field',
  styleUrls: ['./slider.component.scss'],
  templateUrl: './slider.component.html',
  host: {
    style: 'flex:1;display:flex;flex-direction:row;',
    
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderFieldComponent),
      multi: true,
    }
  ]
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
