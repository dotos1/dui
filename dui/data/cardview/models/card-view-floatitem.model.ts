
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewTextItemModel } from './card-view-textitem.model';
import { CardViewItem,CardViewTextItemProperties } from '../interfaces';
import { CardViewItemFloatValidator } from '../validators';

export class CardViewFloatItemModel extends CardViewTextItemModel implements CardViewItem, DynamicComponentModel {
  override type: string = 'float';
  override inputType: string = 'number';

  constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
    super(cardViewTextItemProperties);

    this.validators.push(new CardViewItemFloatValidator());
    if (cardViewTextItemProperties.value) {
      this.value = parseFloat(cardViewTextItemProperties.value);
    }
  }
}
