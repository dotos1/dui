

import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem } from '../interfaces';

export class CardViewMapItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  type: string = 'map';
  override value: Map<string, string>;

  get displayValue() {
    if (this.value && this.value.size > 0) {
      return this.value.values().next().value;
    } else {
      return this.default;
    }
  }
}
