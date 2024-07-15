import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { duiAnimations } from '@dotos/dui/common/animations';
import { MatColors } from '@dotos/dui/core/color';
import { TriggerPopup } from '@dotos/dui/common/trigger';
import { ESCAPE } from '@angular/cdk/keycodes';
import * as _ from 'lodash';

@Component({
  selector: 'color-picker-content',
  templateUrl: './color-picker.content.html',
  styleUrls: ['./color-picker.content.scss'],
  host: {
    'class': 'color-picker',
    '(keydown)': '_handleKeydown($event)',
  },
  animations: duiAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ColorPickerContent implements TriggerPopup {
  host: any;
  _params: any;
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
  private _color: any;
  private _onlyPalette: boolean = false;
  private _modelChange: (value: any) => void;
  private _modelTouched: (value: any) => void;

  /**
   * Constructor
   */
  constructor() {

    this.colorChanged = new EventEmitter();
    this.colors = {}
    _.forIn(MatColors.all,  (value, key)=> {
      if (key != 'common' && key != 'dui-white' && key != 'dui-black') {
        this.colors[key] = value;
      };
    });

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

  get params(): any {
    return this._params;
  }
  /**
  * set accessor including call the onchange callback
  */
  set params(v: any) {
    this._params = v;
    this.color = MatColors.getColorName(v.value);
  }


  @Input()
  set onlyPalette(value) {
    this._onlyPalette = value;
  }

  /**
   * Selected class
   *
   * param value
   */
  @Input()
  set color(value) {
    if (!value || value === '' || this._color === value) {
      return;
    }

    // Split the color value (red-400, blue-500, dui-dark-700 etc.)
    const colorParts = value.split('-');

    // Take the very last part as the selected hue value
    this.selectedHue = colorParts[colorParts.length - 1];

    // Remove the last part
    colorParts.pop();

    // Rejoin the remaining parts as the selected palette name
    this.selectedPalette = colorParts.join('-');

    // Store the color value
    this._color = value;
  }

  get color(): string {
    return this._color;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Control Value Accessor implementation
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register on change function
   *
   * param fn
   */
  registerOnChange(fn: any): void {
    this._modelChange = fn;
  }

  /**
   * Register on touched function
   *
   * param fn
   */
  registerOnTouched(fn: any): void {
    this._modelTouched = fn;
  }

  /**
   * Write value to the view from model
   *
   * param color
   */
  writeValue(color: any): void {
    // Return if null
    if (!color) {
      return;
    }

    // Set the color
    this.color = color;

    // Update the selected color
    this.updateSelectedColor();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Select palette
   *
   * param event
   * param palette
   */
  selectPalette(event, palette): void {
    // Stop propagation
    event.stopPropagation();

    // Go to 'hues' view
    if (this._onlyPalette) {
      this.view = 'palettes';
    } else {
      this.view = 'hues';
    }

    // Update the selected palette
    this.selectedPalette = palette;

    // Update the selected color
    this.updateSelectedColor();
  }

  /**
   * Select hue
   *
   * param event
   * param hue
   */
  selectHue(event, hue): void {
    // Stop propagation
    event.stopPropagation();

    this.selectedHue = hue;
    this.updateSelectedColor();

    if (this.host) {
      let val = {};
      val['value'] = this.selectedColor.bg;
      val['text'] = this.selectedColor.bg;
      this.host._selectAndClose(val);
      this.host.close();
    }
  }

  /**
   * Remove color
   *
   * param event
   */
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

  /**
   * Go to palettes view
   *
   * param event
   */
  goToPalettesView(event): void {
    // Stop propagation
    event.stopPropagation();

    this.view = 'palettes';
  }

  /**
   * On menu open
   */
  onMenuOpen(): void {
    if (this.selectedPalette === '' || this._onlyPalette) {
      this.view = 'palettes';
    } else {
      this.view = 'hues';
    }
  }

  _handleKeydown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case ESCAPE:
        this.host.close();
        break;
      default:
        /* Return so that we don't preventDefault on keys that are not explicitly handled. */
        return;
    }
    event.preventDefault();
  }
}
