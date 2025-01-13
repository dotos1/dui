import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContextService, PickerContextProps } from './hooks/context.service';

@Component({
  selector: 'color-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.scss'],
  host: {
    style: 'width:220px',
    '(keydown)': '_handleKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class GradientComponent {
  @Input() hideControls?: boolean = false;

  @Input() hidePresets?: boolean = false;
  @Input() hideOpacity?: boolean = false;
  @Input() hideHue?: boolean = false;
  @Input() hideEyeDrop?: boolean = false;
  @Input() hideColorTypeBtns?: boolean = false;
  @Input() hideGradientType?: boolean = false;
  @Input() hideGradientAngle?: boolean = false;
  @Input() hideGradientStop?: boolean = false;
  @Input() hideGradientControls?: boolean = false;

  @Input() presets?: string[] = [];

  public conext: PickerContextProps;

  constructor(public contextService: ContextService) {
    this.conext = contextService.getContext();
  }
}
