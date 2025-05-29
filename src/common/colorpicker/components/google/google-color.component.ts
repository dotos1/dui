import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { getContrastingColor } from '@dotos/dui/common/colorpicker/common';

@Component({
  selector: 'goog-color',
  templateUrl: './google-color.component.html',
  styleUrls: ['./google-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'goog-color-' + Math.random().toString(36).substring(2, 15) }
})
export class GoogColorComponent implements OnChanges {
  @Input() color: string;
  @Input() active: boolean;
  @Output() onClick = new EventEmitter<any>();
  @Output() onSwatchHover = new EventEmitter<any>();
  swatchStyle: { [key: string]: string } = {
    width: '15px',
    height: '15px',
    float: 'left',
    marginRight: '5px',
    marginBottom: '5px',
    position: 'relative',
    cursor: 'pointer',
  };
  swatchFocus: { [key: string]: string } = {};
  getContrastingColor = getContrastingColor;

  ngOnChanges() {
    this.swatchStyle['background'] = this.color;
    this.swatchFocus['boxShadow'] = `0 0 4px ${this.color}`;
    if (this.color.toLowerCase() === '#ffffff') {
      this.swatchStyle['boxShadow'] = 'inset 0 0 0 1px #ddd';
    }
  }
  handleClick({ hex, $event }) {
    this.onClick.emit({ hex, $event });
  }
}
