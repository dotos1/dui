import { CommonModule } from '@angular/common';
import {  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  OnDestroy,  OnInit,  Output,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { simpleCheckForValidColor, toState } from './helpers/color';
import { Color, HSLA, HSVA, RGBA } from './helpers/color.interfaces';
import { ESCAPE } from '@angular/cdk/keycodes';

export interface ColorEvent {
  $event: Event;
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

})
export class ColorWrap implements OnInit, OnChanges, OnDestroy {
  /** @zh 应用到宿主元素上的自定义 CSS 类名。 */
  @Input() className?: string;
  /** @zh 当前绑定的颜色值（HSL/HSV/RGB 对象或十六进制字符串）。 */
  @Input() color: HSLA | HSVA | RGBA | string = {
    h: 250,
    s: 0.5,
    l: 0.2,
    a: 1,
  };
  /** @zh 颜色变化时发出（防抖前）。 */
  @Output() onChange = new EventEmitter<ColorEvent>();
  /** @zh 颜色变化完成后发出（对 `onChange` 做了防抖）。 */
  @Output() onChangeComplete = new EventEmitter<ColorEvent>();
  /** @zh 悬停在色块上时发出。 */
  @Output() onSwatchHover = new EventEmitter<ColorEvent>();
  /** @zh 上一个有效的色相值，色相未变化（如切换到无色调的黑白）时用于保留。 */
  oldHue: number;
  /** @zh 当前颜色的 HSL 表示。 */
  hsl: HSLA;
  /** @zh 当前颜色的 HSV 表示。 */
  hsv: HSVA;
  /** @zh 当前颜色的 RGB 表示。 */
  rgb: RGBA;
  /** @zh 当前颜色的十六进制表示。 */
  hex: string;
  /** @zh 最近一次颜色变化的来源标识（如 `'hex'`、`'rgb'`、`'hsva'`）。 */
  source: string;
  /** @zh 初始化时记录的当前颜色（十六进制）。 */
  currentColor: string;
  /** @zh 内部使用，`onChange` 到 `onChangeComplete` 的防抖订阅。 */
  changes: Subscription;

  /** @zh 承载该选择器的弹出层触发宿主（用于选中后自动关闭）。 */
  host: any;

  _params: any;

  /**
   * Combined params object: setting it applies `value` as the color and merges `config`
   * onto this instance.
   * @zh 组合参数对象：设置时会将 `value` 作为颜色应用，并将 `config` 合并到本实例上。
   */
  get params(): any {
    return this._params;
  }

  /**
   * Combined params object: setting it applies `value` as the color and merges `config`
   * onto this instance.
   * @zh 组合参数对象：设置时会将 `value` 作为颜色应用，并将 `config` 合并到本实例上。
   */
  set params(v: any) {
    this._params = v;
    this.color = v.value;
    if(v.config){
      Object.assign(this,v.config);
    }
  }

  ngOnInit() {
    this.changes = this.onChange
      .pipe(debounceTime(100))
      .subscribe(x => this.onChangeComplete.emit(x));
    this.setState(toState(this.color, 0));
    this.currentColor = this.hex;
  }
  ngOnChanges() {
    if(this.color==undefined){
      this.setState(undefined);
    }else{
      this.setState(toState(this.color, this.oldHue));
    }

  }
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
  /** hook for components after a complete change */
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

@NgModule({
  declarations: [ColorWrap],
  exports: [ColorWrap],
  imports: [CommonModule],
})
export class ColorWrapModule {}
