import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,
} from '@angular/core';
import { isValidHex, HSLA, RGBA } from '@dotos/dui/common/colorpicker/common';
import { TinyColor } from '@dotos/dui/core/color';

@Component({
  selector: 'color-gradient-fields',
  templateUrl: './gradient-fields.component.html',
  styleUrls: ['./gradient-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class GradientFieldsComponent {
  @Input() hsl: HSLA;
  @Input() rgb: RGBA;
  @Input() hex: string;
  @Input() disableAlpha = false;
  @Output() onChange = new EventEmitter<any>();
  input: { [key: string]: string } = {
    width: '100%',
    padding: '4px 10% 3px',
    border: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 0 1px #ccc',
    fontSize: '11px',
  };
  label: { [key: string]: string } = {
    display: 'block',
    textAlign: 'center',
    fontSize: '11px',
    paddingTop: '3px',
    paddingBottom: '4px',
    textTransform: 'capitalize',
  };

  round(value) {
    return Math.round(value);
  }
  handleChange({ data, $event }) {
    if (data.hex) {
      if (isValidHex(data.hex)) {
        const color = new TinyColor(data.hex);
        this.onChange.emit({
          data: {
            hex: this.disableAlpha ? color.toHex() : color.toHex8(),
            source: 'hex',
          },
          $event,
        });
      }
    } else if (data.r || data.g || data.b) {
      this.onChange.emit({
        data: {
          r: data.r || this.rgb.r,
          g: data.g || this.rgb.g,
          b: data.b || this.rgb.b,
          source: 'rgb',
        },
        $event,
      });
    } else if (data.a) {
      if (data.a < 0) {
        data.a = 0;
      } else if (data.a > 100) {
        data.a = 100;
      }
      data.a /= 100;

      if (this.disableAlpha) {
        data.a = 1;
      }

      this.onChange.emit({
        data: {
          h: this.hsl.h,
          s: this.hsl.s,
          l: this.hsl.l,
          a: Math.round(data.a * 100) / 100,
          source: 'rgb',
        },
        $event,
      });
    } else if (data.h || data.s || data.l) {
      this.onChange.emit({
        data: {
          h: data.h || this.hsl.h,
          s: Number((data.s && data.s) || this.hsl.s),
          l: Number((data.l && data.l) || this.hsl.l),
          source: 'hsl',
        },
        $event,
      });
    }
  }
}
