

import { CardViewItemProperties } from './card-view-item-properties.interface';
import { CardViewTextItemPipeProperty } from './card-view-textitem-pipe-property.interface';

export interface CardViewTextItemProperties extends CardViewItemProperties {
  multiline?: boolean;
  multivalued?: boolean;
  pipes?: CardViewTextItemPipeProperty[];
  clickCallBack?: any;
}
