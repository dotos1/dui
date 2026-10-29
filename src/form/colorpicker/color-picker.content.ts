/**
 * @fileoverview Module `src/form/colorpicker/color-picker.content.ts` providing color picker content definitions and implementation.
 * @zh 模块文件 `src/form/colorpicker/color-picker.content.ts`，提供颜色选择器内容相关的定义与实现。
 */

import { ESCAPE } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { duiAnimations } from '@dotos/dui/common/animations';
import { TriggerPopup } from '@dotos/dui/common/trigger';
import { MatColors } from '@dotos/dui/core/color';
import {forIn}  from 'lodash-es';

/**
 * Angular component `ColorPickerContent` (selector: 'color-picker-content') providing color picker content presentation and interaction in `src/form/colorpicker`.
 * @zh Angular 组件 `ColorPickerContent`（selector: 'color-picker-content'），提供颜色选择器内容的视图渲染与交互逻辑（位于 `src/form/colorpicker`）。
 */
@Component({
  selector: 'color-picker-content',
  templateUrl: './color-picker.content.html',
  styleUrls: ['./color-picker.content.scss'],
  host: {
    'class': 'color-picker',
    '(keydown)': '_handleKeydown($event)',
    hostID: 'color-picker-content' + Math.random().toString(36).substring(2, 15),
  },
  animations: duiAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,

})
export class ColorPickerContent implements TriggerPopup {
  /**
   * Property `host` (`any`) storing host.
   * @zh 属性 `host`（类型：`any`），用于存储或配置宿主。
   */
  host;
  /**
   * Property `_params` (`any`) storing params.
   * @zh 属性 `_params`（类型：`any`），用于存储或配置参数集合。
   */
  _params;
  /**
   * Property `colors` (`any`) storing colors.
   * @zh 属性 `colors`（类型：`any`），用于存储或配置颜色列表。
   */
  colors;
  /**
   * Property `hues` (`string[]`) storing hues.
   * @zh 属性 `hues`（类型：`string[]`），用于存储或配置色相。
   */
  hues: string[];
  /**
   * Property `view` (`string`) storing view.
   * @zh 属性 `view`（类型：`string`），用于存储或配置视图。
   */
  view: string;
  /**
   * Property `selectedColor` (`any`) storing selected color.
   * @zh 属性 `selectedColor`（类型：`any`），用于存储或配置已选中颜色。
   */
  selectedColor;
  /**
   * Property `selectedPalette` (`string`) storing selected palette.
   * @zh 属性 `selectedPalette`（类型：`string`），用于存储或配置已选中调色板。
   */
  selectedPalette: string;
  /**
   * Property `selectedHue` (`string`) storing selected hue.
   * @zh 属性 `selectedHue`（类型：`string`），用于存储或配置已选中色相。
   */
  selectedHue: string;

  // Color changed
  /**
   * Output event emitter `colorChanged` (`any`) firing when color changed occurs.
   * @zh 输出事件 `colorChanged`（类型：`any`），当触发颜色已变更时向外发出事件。
   */
  @Output()
  colorChanged;

  // Private
  /**
   * Property `_color` (`any`) storing color.
   * @zh 属性 `_color`（类型：`any`），用于存储或配置颜色。
   */
  private _color;
  /**
   * Property `_onlyPalette` (`boolean`) storing only palette (default: `false`).
   * @zh 属性 `_onlyPalette`（类型：`boolean`），用于存储或配置only调色板（默认值：`false`）。
   */
  private _onlyPalette: boolean = false;
  /**
   * Property `_modelChange` (`(value: any) => void`) storing model change.
   * @zh 属性 `_modelChange`（类型：`(value: any) => void`），用于存储或配置模型变更。
   */
  private _modelChange: (value) => void;
  /**
   * Property `_modelTouched` (`(value: any) => void`) storing model touched.
   * @zh 属性 `_modelTouched`（类型：`(value: any) => void`），用于存储或配置模型是否已触碰。
   */
  private _modelTouched: (value) => void;

  /**
   * Constructor

   * @zh 创建 `ColorPickerContent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {

    this.colorChanged = new EventEmitter();
    this.colors = {}
    forIn(MatColors.all,  (value, key)=> {
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

  /**
   * Gets the current params (`params: any`).
   * @zh 获取当前参数集合（`params: any`）。
   */
  get params() {
    return this._params;
  }
  /**
  * set accessor including call the onchange callback

   * @zh 设置参数集合（`params`）。
   */
  set params(v) {
    this._params = v;
    this.color = MatColors.getColorName(v.value);
  }


  /**
   * Input setter `onlyPalette` updating only palette.
   * @zh 输入属性 `onlyPalette` 的设置器，用于更新only调色板。
   * @param value - New only palette value (`any`) / 新的only调色板值（`any`）
   */
  @Input()
  set onlyPalette(value) {
    this._onlyPalette = value;
  }

  /**
   * Selected class
   *
   * param value

   * @zh 输入属性 `color` 的设置器，用于更新颜色。
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

  /**
   * Gets the current color (`color: string`).
   * @zh 获取当前颜色（`color: string`）。
   */
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

   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   */
  registerOnChange(fn): void {
    this._modelChange = fn;
  }

  /**
   * Register on touched function
   *
   * param fn

   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   */
  registerOnTouched(fn): void {
    this._modelTouched = fn;
  }

  /**
   * Write value to the view from model
   *
   * param color

   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   */
  writeValue(color): void {
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

   * @zh 执行 `selectPalette`，用于下拉选择调色板。
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

   * @zh 执行 `selectHue`，用于下拉选择色相。
   */
  selectHue(event, hue): void {
    // Stop propagation
    event.stopPropagation();

    this.selectedHue = hue;
    this.updateSelectedColor();

    if (this.host) {
      let val: Record<string, unknown> = {};
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

   * @zh 执行 `removeColor`，用于移除颜色。
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

   * @zh 执行 `updateSelectedColor`，用于更新已选中颜色。
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

   * @zh 执行 `goToPalettesView`，用于跳转到转换为调色板视图。
   */
  goToPalettesView(event): void {
    // Stop propagation
    event.stopPropagation();

    this.view = 'palettes';
  }

  /**
   * On menu open

   * @zh 执行 `onMenuOpen`，用于当菜单打开。
   */
  onMenuOpen(): void {
    if (this.selectedPalette === '' || this._onlyPalette) {
      this.view = 'palettes';
    } else {
      this.view = 'hues';
    }
  }

  /**
   * Executes `_handleKeydown` to handle handle keydown.
   * @zh 执行 `_handleKeydown`，用于连接手柄按键按下。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   */
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
