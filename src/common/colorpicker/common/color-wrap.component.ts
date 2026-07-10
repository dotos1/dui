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
  @Input() className?: string;
  @Input() color: HSLA | HSVA | RGBA | string = {
    h: 250,
    s: 0.5,
    l: 0.2,
    a: 1,
  };
  @Output() onChange = new EventEmitter<ColorEvent>();
  @Output() onChangeComplete = new EventEmitter<ColorEvent>();
  @Output() onSwatchHover = new EventEmitter<ColorEvent>();
  oldHue: number;
  hsl: HSLA;
  hsv: HSVA;
  rgb: RGBA;
  hex: string;
  source: string;
  currentColor: string;
  changes: Subscription;

  host: any;

  _params: any;

  get params(): any {
    return this._params;
  }

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
