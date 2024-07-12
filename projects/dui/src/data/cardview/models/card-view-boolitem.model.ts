
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewBoolItemProperties } from '../interfaces';

export class CardViewBoolItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  type: string = 'bool';
  override value: boolean = false;
  override default: boolean;

  constructor(cardViewBoolItemProperties: CardViewBoolItemProperties) {
    super(cardViewBoolItemProperties);

    if (cardViewBoolItemProperties.value !== undefined) {
      this.value = !!JSON.parse(cardViewBoolItemProperties.value);
    }
  }

  get displayValue() {
    if (this.isEmpty()) {
      return this.default;
    } else {
      return this.value;
    }
  }
}
