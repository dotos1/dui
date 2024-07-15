
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewKeyValuePairsItemProperties } from '../interfaces';

export class CardViewKeyValuePairsItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  type: string = 'keyvaluepairs';

  constructor(cardViewKeyValuePairsItemProperties: CardViewKeyValuePairsItemProperties) {
    super(cardViewKeyValuePairsItemProperties);
  }

  get displayValue() {
    return this.value;
  }
}
