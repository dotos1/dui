import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatRadioGroup } from '@angular/material/radio';
import { TranslateService} from '@dotos/dui/translator';
import { observe } from '@dotos/dui/core/form';

@Component({
  selector: 'radio-group',
  styleUrls: ['./radiogroup.component.scss'],
  templateUrl: './radiogroup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class RadioGroupField extends MatField implements AfterViewInit,OnDestroy{

  @ViewChild(MatRadioGroup, { static: true }) radioGroup!: MatRadioGroup;
  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
    options: [],
    tabindex: -1,
  };


  public readOnly = false;

  private focusObserver!: ReturnType<typeof observe>;

  constructor(protected override translate: TranslateService) {
    super(translate);
  }

  override ngAfterViewInit() {
    this.focusObserver = observe(this.field, ['focused'], ({ currentValue }) => {
      if (this.field.tabindex === -1 && currentValue && this.radioGroup._radios.length > 0) {
        setTimeout(() => {
          const radio = this.radioGroup.selected ? this.radioGroup.selected : this.radioGroup._radios.first;
          radio.focus();
        });
      }
    });
  }

  override init() {
    super.init();
    this.field.validation.messages['required'] = this.field.blankText ?
      this.translate.instant(this.field.blankText) : this.translate.instant("FORM.LEASTSELECT")
  }

  override onContainerClick(event: MouseEvent): void {
    if (this.radioGroup._radios.length) {
      if (this.radioGroup.selected) {
        this.radioGroup.selected.focus();
      } else {
        this.radioGroup._radios.first.focus();
      }
    }
    super.onContainerClick(event);
  }

  override ngOnDestroy() {
    this.focusObserver && this.focusObserver.unsubscribe();
  }
}
