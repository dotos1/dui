

import { Observable } from 'rxjs';
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewArrayItemProperties } from '../interfaces';

export interface CardViewArrayItem {
  icon: string;
  value: string;
}

export class CardViewArrayItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {

  type: string = 'array';
  override value: Observable<CardViewArrayItem[]>;
  noOfItemsToDisplay: number;

  constructor(cardViewArrayItemProperties: CardViewArrayItemProperties) {
    super(cardViewArrayItemProperties);
    this.noOfItemsToDisplay = cardViewArrayItemProperties.noOfItemsToDisplay;
  }

  get displayValue(): Observable<CardViewArrayItem[]> {
    return this.value;
  }
}
