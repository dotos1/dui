import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  Output,
} from '@angular/core';
import { CoordinatesModule } from './coordinates.directive';
import { HSLA, RGBA } from './helpers/color.interfaces';
import { TinyColor } from '@dotos/dui/core/color';

@Component({
  selector: 'color-shade',
  templateUrl: './shade.component.html',
  styleUrls: ['./shade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  
})
export class ShadeComponent implements OnChanges {
  @Input() hsl: HSLA;
  @Input() rgb: RGBA;
  @Input() pointer: { [key: string]: string };
  @Input() shadow: string;
  @Input() radius: string;
  @Output() onChange = new EventEmitter<any>();
  gradient: { [key: string]: string };
  pointerLeft: number;
  pointerTop: number;

  ngOnChanges() {
    this.gradient = {
      background: `linear-gradient(to right,
          hsl(${this.hsl.h}, 90%, 55%),
          #000)`,
    };
    const hsv = new TinyColor(this.hsl).toHsv();
    this.pointerLeft = 100 - (hsv.v * 100);
  }

  handleChange({ left, containerWidth, $event }) {
    let data;
    let v: number;
    if (left < 0) {
      v = 0;
    } else if (left > containerWidth) {
      v = 1;
    } else {
      v = Math.round((left * 100) / containerWidth) / 100;
    }

    const hsv = new TinyColor(this.hsl).toHsv();
    if (hsv.v !== v) {
      data = {
        h: this.hsl.h,
        s: 100,
        v: 1 - v,
        l: this.hsl.l,
        a: this.hsl.a,
        source: 'rgb',
      };
    }

    if (!data) {
      return null;
    }

    this.onChange.emit({ data, $event });
  }
}

@NgModule({
  declarations: [ShadeComponent],
  exports: [ShadeComponent],
  imports: [CommonModule, CoordinatesModule],
})
export class ShadeModule { }
