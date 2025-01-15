import { Component, AfterViewInit, ViewChild, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'slide-toggle',
  templateUrl: './slide-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'hostID': crypto.randomUUID().toString()}
})

export class SliderToggleField extends MatField implements AfterViewInit {

  @ViewChild(forwardRef(() => MatSlideToggle), { static: true })
  private slideToggle: MatSlideToggle;

  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
    hideLabel: true,
    color: 'accent',
    defaultValue: false
  };

  override onContainerClick(event: MouseEvent): void {
    this.slideToggle.focus();
    super.onContainerClick(event);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  click(event){
    if(this.field.wrappers.indexOf('editor-field')!=-1){
      this.slideToggle.toggle();
    }
  }
  override init(): void {
    super.init();
  }
}
