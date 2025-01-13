import { Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation,ChangeDetectionStrategy } from '@angular/core';
import { duiAnimations } from '@dotos/dui/common/animations';
import { MatColors } from '@dotos/dui/core/color';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const MATERIAL_COLOR_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorPickerComponent),
  multi: true
};

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: duiAnimations,
  encapsulation: ViewEncapsulation.None,
  providers: [MATERIAL_COLOR_PICKER_VALUE_ACCESSOR]
})
export class ColorPickerComponent implements ControlValueAccessor {
  colors: any;
  hues: string[];
  view: string;
  selectedColor: any;
  selectedPalette: string;
  selectedHue: string;

  // Color changed
  @Output()
  colorChanged: EventEmitter<any>;

  // Private
  private _color: string;
  private _modelChange: (value: any) => void;
  private _modelTouched: (value: any) => void;

  /**
   * Constructor
   */
  constructor() {
    // Set the defaults
    this.colorChanged = new EventEmitter();
    this.colors = MatColors.all;
    this.hues = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'];
    this.selectedHue = '500';
    this.view = 'palettes';

    // Set the private defaults
    this._color = '';
    this._modelChange = () => {
    };
    this._modelTouched = () => {
    };
  }

  @Input()
  set color(value) {
    if (!value || value === '' || this._color === value) {
      return;
    }
    const colorParts = value.split('-');
    this.selectedHue = colorParts[colorParts.length - 1];
    colorParts.pop();
    this.selectedPalette = colorParts.join('-');
    this._color = value;
  }

  get color(): string {
    return this._color;
  }

  registerOnChange(fn: any): void {
    this._modelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._modelTouched = fn;
  }

  writeValue(color: any): void {
    // Return if null
    if (!color) {
      return;
    }
    this.color = color;
    this.updateSelectedColor();
  }

  selectPalette(event, palette?): void {
    event.stopPropagation();
    this.view = 'hues';
    this.selectedPalette = palette;
    this.updateSelectedColor();
  }

  selectHue(event, hue): void {
    event.stopPropagation();
    this.selectedHue = hue;
    this.updateSelectedColor();
  }

  removeColor(event): void {
    // Stop propagation
    event.stopPropagation();

    // Return to the 'palettes' view
    this.view = 'palettes';

    // Clear the selected palette and hue
    this.selectedPalette = '';
    this.selectedHue = '';

    // Update the selected color
    this.updateSelectedColor();
  }

  /**
   * Update selected color
   */
  updateSelectedColor(): void {
    if (this.selectedColor && this.selectedColor.palette === this.selectedPalette && this.selectedColor.hue === this.selectedHue) {
      return;
    }

    // Set the selected color object
    this.selectedColor = {
      palette: this.selectedPalette,
      hue: this.selectedHue,
      class: this.selectedPalette + '-' + this.selectedHue,
      bg: this.selectedPalette === '' ? '' : MatColors.getColor(this.selectedPalette)[this.selectedHue],
      fg: this.selectedPalette === '' ? '' : MatColors.getColor(this.selectedPalette).contrast[this.selectedHue]
    };

    // Emit the color changed event
    this.colorChanged.emit(this.selectedColor);

    // Mark the model as touched
    this._modelTouched(this.selectedColor.class);

    // Update the model
    this._modelChange(this.selectedColor.class);
  }

  goToPalettesView(event): void {
    event.stopPropagation();
    this.view = 'palettes';
  }

  onMenuOpen(): void {
    if (this.selectedPalette === '') {
      this.view = 'palettes';
    }
    else {
      this.view = 'hues';
    }
  }
}
