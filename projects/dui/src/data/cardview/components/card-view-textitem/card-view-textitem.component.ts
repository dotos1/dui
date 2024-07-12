
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslateService } from '@dotos/dui/i18n';
import { ClipboardService } from '@dotos/dui/common/clipboard';

import { CardViewTextItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';
import { ThemeService } from '@dotos/dui/theme';



export const DEFAULT_SEPARATOR = ', ';
const templateTypes = {
  clickableTemplate: 'clickableTemplate',
  multilineTemplate: 'multilineTemplate',
  chipsTemplate: 'chipsTemplate',
  emptyTemplate: 'emptyTemplate',
  defaultTemplate: 'defaultTemplate'
};

@Component({
  selector: 'dui-card-view-textitem',
  templateUrl: './card-view-textitem.component.html',
  styleUrls: ['./card-view-textitem.component.scss']
})
export class CardViewTextItemComponent  implements OnChanges,OnDestroy {

  @Input()
  property: CardViewTextItemModel;

  @Input()
  editable: boolean = false;

  @Input()
  displayEmpty: boolean = true;

  @Input()
  copyToClipboardAction: boolean = true;

  @Input()
  useChipsForMultiValueProperty: boolean = true;

  @Input()
  multiValueSeparator: string = DEFAULT_SEPARATOR;

  editedValue: string | string[];
  errorMessages: string[];
  templateType: string;


  protected destroy$ = new Subject<boolean>();


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  constructor(
    public cardViewUpdateService: CardViewUpdateService,
    public themeService: ThemeService,
    private clipboardService: ClipboardService,
    private translateService: TranslateService) {
      this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
       //@ts-ignore
      .subscribe((itemModel: CardViewTextItemModel) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
  }

  ngOnChanges(): void {
    this.resetValue();
    this.setTemplateType();
  }

  private setTemplateType() {
    if (this.showProperty || this.isEditable) {
      if (this.isClickable) {
        this.templateType = templateTypes.clickableTemplate;
      } else if (this.isChipViewEnabled) {
        this.templateType = templateTypes.chipsTemplate;
      } else {
        this.templateType = templateTypes.defaultTemplate;
      }
    } else {
      this.templateType = templateTypes.emptyTemplate;
    }
  }

  resetValue() {
    if (this.isChipViewEnabled) {
      this.editedValue = this.property.value ? Array.from(this.property.value) : [];
    } else {
      this.editedValue = this.property.displayValue;
    }
  }

  private resetErrorMessages() {
    this.errorMessages = [];
  }

  update(): void {
    if (this.property.isValid(this.editedValue)) {
      const updatedValue = this.prepareValueForUpload(this.property, this.editedValue);
      this.cardViewUpdateService.update(<CardViewTextItemModel>{ ...this.property }, updatedValue);
      this.property.value = updatedValue;
      this.resetErrorMessages();
    } else {
      this.errorMessages = this.property.getValidationErrors(this.editedValue);
    }
  }

  prepareValueForUpload(property: CardViewTextItemModel, value: string | string[]): string | string[] {
    if (property.multivalued && typeof value === 'string') {
      const listOfValues = value.split(this.multiValueSeparator.trim()).map((item) => item.trim());
      return listOfValues;
    }
    return value;
  }

  removeValueFromList(itemIndex: number) {
    if (typeof this.editedValue !== 'string') {
      this.editedValue.splice(itemIndex, 1);
      this.update();
    }
  }

  addValueToList(newListItem: MatChipInputEvent) {
    const chipInput = newListItem.input;
    const chipValue = newListItem.value.trim() || '';

    if (typeof this.editedValue !== 'string') {
      if (chipValue) {
        this.editedValue.push(chipValue);
        this.update();
      }

      if (chipInput) {
        chipInput.value = '';
      }
    }
  }

  clicked(): void {
    if (typeof this.property.clickCallBack === 'function') {
      this.property.clickCallBack();
    } else {
      this.cardViewUpdateService.clicked(this.property);
    }
  }

  clearValue() {
    this.editedValue = '';
  }

  copyToClipboard(valueToCopy: string) {
    if (this.copyToClipboard) {
      const clipboardMessage = this.translateService.instant('METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
      this.clipboardService.copyContentToClipboard(valueToCopy, clipboardMessage);
    }
  }

  get showProperty(): boolean {
    return this.displayEmpty || !this.property.isEmpty();
  }

  get showClickableIcon(): boolean {
    return this.hasIcon && this.editable;
  }

  get isEditable(): boolean {
    return this.editable && this.property.editable;
  }

  get isClickable(): boolean {
    return this.property.clickable;
  }

  get hasIcon(): boolean {
    return !!this.property.icon;
  }

  get hasErrors(): boolean {
    return this.errorMessages && this.errorMessages.length > 0;
  }

  get isChipViewEnabled(): boolean {
    return this.property.multivalued && this.useChipsForMultiValueProperty;
  }
}
