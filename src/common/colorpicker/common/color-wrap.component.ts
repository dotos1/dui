/**
 * @fileoverview Module `src/common/colorpicker/common/color-wrap.component.ts` providing color wrap component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/color-wrap.component.ts`，提供颜色包裹组件相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import {  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  OnDestroy,  OnInit,  Output, ChangeDetectionStrategy,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { simpleCheckForValidColor, toState } from './helpers/color';
import { Color, HSLA, HSVA, RGBA } from './helpers/color.interfaces';
import { ESCAPE } from '@angular/cdk/keycodes';

/**
 * Interface `ColorEvent` defining the contract and properties for color event.
 * @zh 接口 `ColorEvent`，定义颜色事件的数据结构契约与属性规范。
 */
export interface ColorEvent {
  /**
   * Property `$event` (`Event`) storing event.
   * @zh 属性 `$event`（类型：`Event`），用于存储或配置事件。
   */
  $event: Event;
  /**
   * Property `color` (`Color`) storing color.
   * @zh 属性 `color`（类型：`Color`），用于存储或配置颜色。
   */
  color: Color;
}

/**
 * Base class for all `color-*` picker style variants (chrome/sketch/circle/compact/github/...):
 * normalizes the bound `color` (hex/rgb/hsl/hsv) into hsl/hsv/rgb/hex state and dispatches
 * `onChange`/`onChangeComplete`/`onSwatchHover` events.
 * @zh 所有 `color-*` 颜色选择器样式变体（chrome/sketch/circle/compact/github/...）的基类：
 * 将绑定的 `color`（hex/rgb/hsl/hsv）归一化为 hsl/hsv/rgb/hex 状态，
 * 并派发 `onChange`/`onChangeComplete`/`onSwatchHover` 事件。
 */
@Component({
  // create seletor base for test override property
  selector: 'color-wrap',
  template: ``,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,

})
export class ColorWrap implements OnInit, OnChanges, OnDestroy {
  /**
   * @zh 应用到宿主元素上的自定义 CSS 类名。
   * @zh 应用到宿主元素上的自定义 CSS 类名。
   */
  @Input() className?: string;
  /**
   * @zh 当前绑定的颜色值（HSL/HSV/RGB 对象或十六进制字符串）。
   * @zh 当前绑定的颜色值（HSL/HSV/RGB 对象或十六进制字符串）。
   */
  @Input() color: HSLA | HSVA | RGBA | string = {
    h: 250,
    s: 0.5,
    l: 0.2,
    a: 1,
  };
  /**
   * Output event emitter `onChange` (`EventEmitter<ColorEvent>`) firing when on change occurs.
   * @zh 颜色变化时发出（防抖前）。
   * @zh 颜色变化时发出（防抖前）。
   */
  @Output() onChange = new EventEmitter<ColorEvent>();
  /**
   * Output event emitter `onChangeComplete` (`EventEmitter<ColorEvent>`) firing when on change complete occurs.
   * @zh 颜色变化完成后发出（对 `onChange` 做了防抖）。
   * @zh 颜色变化完成后发出（对 `onChange` 做了防抖）。
   */
  @Output() onChangeComplete = new EventEmitter<ColorEvent>();
  /**
   * Output event emitter `onSwatchHover` (`EventEmitter<ColorEvent>`) firing when on swatch hover occurs.
   * @zh 悬停在色块上时发出。
   * @zh 悬停在色块上时发出。
   */
  @Output() onSwatchHover = new EventEmitter<ColorEvent>();
  /**
   * Property `oldHue` (`number`) storing old hue.
   * @zh 上一个有效的色相值，色相未变化（如切换到无色调的黑白）时用于保留。
   * @zh 上一个有效的色相值，色相未变化（如切换到无色调的黑白）时用于保留。
   */
  oldHue: number;
  /**
   * @zh 当前颜色的 HSL 表示。
   * @zh 当前颜色的 HSL 表示。
   */
  hsl: HSLA;
  /**
   * @zh 当前颜色的 HSV 表示。
   * @zh 当前颜色的 HSV 表示。
   */
  hsv: HSVA;
  /**
   * @zh 当前颜色的 RGB 表示。
   * @zh 当前颜色的 RGB 表示。
   */
  rgb: RGBA;
  /**
   * Property `hex` (`string`) storing hex.
   * @zh 当前颜色的十六进制表示。
   * @zh 当前颜色的十六进制表示。
   */
  hex: string;
  /**
   * Property `source` (`string`) storing source.
   * @zh 最近一次颜色变化的来源标识（如 `'hex'`、`'rgb'`、`'hsva'`）。
   * @zh 最近一次颜色变化的来源标识（如 `'hex'`、`'rgb'`、`'hsva'`）。
   */
  source: string;
  /**
   * Property `currentColor` (`string`) storing current color.
   * @zh 初始化时记录的当前颜色（十六进制）。
   * @zh 初始化时记录的当前颜色（十六进制）。
   */
  currentColor: string;
  /**
   * Property `changes` (`Subscription`) storing changes.
   * @zh 内部使用，`onChange` 到 `onChangeComplete` 的防抖订阅。
   * @zh 内部使用，`onChange` 到 `onChangeComplete` 的防抖订阅。
   */
  changes: Subscription;

  /**
   * Property `host` (`any`) storing host.
   * @zh 承载该选择器的弹出层触发宿主（用于选中后自动关闭）。
   * @zh 承载该选择器的弹出层触发宿主（用于选中后自动关闭）。
   */
  host;

  /**
   * Property `_params` (`any`) storing params.
   * @zh 属性 `_params`（类型：`any`），用于存储或配置参数集合。
   */
  _params;

  /**
   * Combined params object: setting it applies `value` as the color and merges `config`
   * onto this instance.
   * @zh 组合参数对象：设置时会将 `value` 作为颜色应用，并将 `config` 合并到本实例上。
   */
  get params() {
    return this._params;
  }

  /**
   * Combined params object: setting it applies `value` as the color and merges `config`
   * onto this instance.
   * @zh 组合参数对象：设置时会将 `value` 作为颜色应用，并将 `config` 合并到本实例上。
   */
  set params(v) {
    this._params = v;
    this.color = v.value;
    if(v.config){
      Object.assign(this,v.config);
    }
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.changes = this.onChange
      .pipe(debounceTime(100))
      .subscribe(x => this.onChangeComplete.emit(x));
    this.setState(toState(this.color, 0));
    this.currentColor = this.hex;
  }
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    if(this.color==undefined){
      this.setState(undefined);
    }else{
      this.setState(toState(this.color, this.oldHue));
    }

  }
  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.changes.unsubscribe();
  }
  /**
   * Applies a resolved color state (hsl/hsv/rgb/hex/source) onto this instance, or clears it
   * if `data` is `undefined`.
   * @zh 将解析后的颜色状态（hsl/hsv/rgb/hex/source）应用到本实例，若 `data` 为 `undefined` 则清空状态。
   */
  setState(data) {
    if(data==undefined){
      this.oldHue = undefined;
      this.hsl = undefined;
      this.hsv = undefined;
      this.rgb = undefined;
      this.hex = undefined;
      this.source = undefined;
    }else{
      this.oldHue = data.oldHue;
      this.hsl = data.hsl;
      this.hsv = data.hsv;
      this.rgb = data.rgb;
      this.hex = data.hex;
      this.source = data.source;
    }

    this.afterValidChange();
  }
  /**
   * Validates and applies an incoming color change, emitting `onChange`.
   * @zh 校验并应用传入的颜色变化，发出 `onChange`。
   */
  handleChange(data, $event) {
    if(data==undefined){
      this.onChange.emit({color: data, $event });
      if (this.host) {
        this.host._selectAndClose(data);
      }
    }else{
      const isValidColor = simpleCheckForValidColor(data);
      if (isValidColor) {
        const color = toState(data, data.h || this.oldHue);
        this.setState(color);
        this.onChange.emit({ color, $event });
        this.afterValidChange();
        if (this.host) {
          this.host._selectAndClose(color.hex);
        }
      }
    }
  }
  /**
   * hook for components after a complete change
   * @zh 执行 `afterValidChange`，用于之后有效变更。
   */
  afterValidChange() {}

  /**
   * Validates a hovered swatch color and emits `onSwatchHover`.
   * @zh 校验悬停色块的颜色并发出 `onSwatchHover`。
   */
  handleSwatchHover(data, $event) {
    const isValidColor = simpleCheckForValidColor(data);
    if (isValidColor) {
      const color = toState(data, data.h || this.oldHue);
      this.setState(color);
      this.onSwatchHover.emit({ color, $event });
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
        return;
    }
    event.preventDefault();
  }
}

/**
 * Angular module `ColorWrapModule` declaring and exporting color wrap module components, directives, pipes, and providers.
 * @zh Angular 模块 `ColorWrapModule`，声明并导出颜色包裹模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ColorWrap],
  exports: [ColorWrap],
  imports: [CommonModule],
})
export class ColorWrapModule {}
