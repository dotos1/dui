
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewTextItemModel } from './card-view-textitem.model';
import { CardViewItem,CardViewTextItemProperties } from '../interfaces';
import { CardViewItemIntValidator } from '../validators';

export class CardViewIntItemModel extends CardViewTextItemModel implements CardViewItem, DynamicComponentModel {
  override type: string = 'int';
  override inputType: string = 'number';

  constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
    super(cardViewTextItemProperties);

    this.validators.push(new CardViewItemIntValidator());
    if (cardViewTextItemProperties.value) {
      this.value = parseInt(cardViewTextItemProperties.value, 10);
    }
  }
}
