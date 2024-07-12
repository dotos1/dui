

import { CardViewItemProperties, CardViewItemValidator } from '../interfaces';

export abstract class CardViewBaseItemModel {
  label: string;
  value: any;
  key: any;
  default: any;
  editable: boolean;
  clickable: boolean;
  icon?: string;
  validators?: CardViewItemValidator[];
  data?: any;

  constructor(cardViewItemProperties: CardViewItemProperties) {
    this.label = cardViewItemProperties.label || '';
    this.value = cardViewItemProperties.value && cardViewItemProperties.value.displayName || cardViewItemProperties.value;
    this.key = cardViewItemProperties.key;
    this.default = cardViewItemProperties.default;
    this.editable = !!cardViewItemProperties.editable;
    this.clickable = !!cardViewItemProperties.clickable;
    this.icon = cardViewItemProperties.icon || '';
    this.validators = cardViewItemProperties.validators || [];
    this.data = cardViewItemProperties.data || null;
  }

  isEmpty(): boolean {
    return this.value === undefined || this.value === null || this.value === '';
  }

  isValid(newValue: any): boolean {
    if (!this.validators.length) {
      return true;
    }

    return this.validators
      .map((validator) => validator.isValid(newValue))
      .reduce((isValidUntilNow, isValid) => isValidUntilNow && isValid, true);
  }

  getValidationErrors(value): string[] {
    if (!this.validators.length) {
      return [];
    }

    return this.validators.filter((validator) => !validator.isValid(value)).map((validator) => validator.message);
  }
}
