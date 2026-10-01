import { Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation,ChangeDetectionStrategy } from '@angular/core';
import { duiAnimations } from '@dotos/dui/common/animations';
import { MatColors } from '@dotos/dui/core/color';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const MATERIAL_COLOR_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorPickerComponent),
  multi: true
};

/**
 * Material-style palette color picker: pick a base color then a shade (hue), implements
 * `ControlValueAccessor` so it works with Angular forms.
 * @zh Material 风格的调色板颜色选择器：先选基础色再选色阶（hue），实现了 `ControlValueAccessor`，
 * 可直接用于 Angular 表单。
 */
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
  /** @zh 可选的调色板集合，来自 `MatColors.all`。 */
  colors: any;
  /** @zh 可选的色阶（hue）列表。 */
  hues: string[];
  /** @zh 当前显示的面板视图：`'palettes'`（调色板）或 `'hues'`（色阶）。 */
  view: string;
  /** @zh 当前选中的颜色对象（含 palette/hue/class/bg/fg）。 */
  selectedColor: any;
  /** @zh 当前选中的调色板名称。 */
  selectedPalette: string;
  /** @zh 当前选中的色阶（hue）。 */
  selectedHue: string;

  /**
   * Emits the selected color object whenever it changes.
   * @zh 选中颜色发生变化时发出对应的颜色对象。
   */
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

  /**
   * The current color, encoded as `<palette>-<hue>` (e.g. `red-500`).
   * @zh 当前颜色，编码为 `<调色板>-<色阶>` 格式（如 `red-500`）。
   */
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

  /**
   * The current color, encoded as `<palette>-<hue>` (e.g. `red-500`).
   * @zh 当前颜色，编码为 `<调色板>-<色阶>` 格式（如 `red-500`）。
   */
  get color(): string {
    return this._color;
  }

  /** @zh Angular 表单 `ControlValueAccessor` 接口方法：注册值变化回调。 */
  registerOnChange(fn: any): void {
    this._modelChange = fn;
  }

  /** @zh Angular 表单 `ControlValueAccessor` 接口方法：注册触摸回调。 */
  registerOnTouched(fn: any): void {
    this._modelTouched = fn;
  }

  /** @zh Angular 表单 `ControlValueAccessor` 接口方法：写入外部传入的值。 */
  writeValue(color: any): void {
    // Return if null
    if (!color) {
      return;
    }
    this.color = color;
    this.updateSelectedColor();
  }

  /**
   * Switches to the hue-selection view for the given palette.
   * @zh 切换到给定调色板的色阶选择视图。
   */
  selectPalette(event, palette?): void {
    event.stopPropagation();
    this.view = 'hues';
    this.selectedPalette = palette;
    this.updateSelectedColor();
  }

  /**
   * Selects the given hue within the currently selected palette.
   * @zh 在当前选中的调色板内选择给定的色阶。
   */
  selectHue(event, hue): void {
    event.stopPropagation();
    this.selectedHue = hue;
    this.updateSelectedColor();
  }

  /**
   * Clears the current selection and returns to the palette-selection view.
   * @zh 清除当前选择并返回调色板选择视图。
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
   * Returns to the palette-selection view without changing the current selection.
   * @zh 返回调色板选择视图，不改变当前选择。
   */
  goToPalettesView(event): void {
    event.stopPropagation();
    this.view = 'palettes';
  }

  /**
   * Sets the initial view (palettes or hues) shown when the picker menu opens, based on
   * whether a palette is already selected.
   * @zh 根据是否已选中调色板，设置选择器菜单打开时显示的初始视图（调色板或色阶）。
   */
  onMenuOpen(): void {
    if (this.selectedPalette === '') {
      this.view = 'palettes';
    }
    else {
      this.view = 'hues';
    }
  }
}
