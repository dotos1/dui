
import { CardViewItemValidator } from './card-view-item-validator.interface';

export interface CardViewItemProperties {
  label: string;
  value: any;
  key: any;
  default?: any;
  editable?: boolean;
  clickable?: any;
  icon?: string;
  validators?: CardViewItemValidator[];
  data?: any;
}
