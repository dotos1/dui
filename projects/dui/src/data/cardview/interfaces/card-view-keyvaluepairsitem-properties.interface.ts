
import { CardViewItemProperties } from './card-view-item-properties.interface';

export interface CardViewKeyValuePairsItemType {
  name: string;
  value: string;
}

export interface CardViewKeyValuePairsItemProperties extends CardViewItemProperties {
  value: CardViewKeyValuePairsItemType[];
}
