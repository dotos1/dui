
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewTextItemPipeProperty, CardViewTextItemProperties } from '../interfaces';

export class CardViewTextItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  type: string = 'text';
  inputType: string = 'text';
  multiline?: boolean;
  multivalued?: boolean;
  pipes?: CardViewTextItemPipeProperty[];
  clickCallBack?: any;

  constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
    super(cardViewTextItemProperties);
    this.multiline = !!cardViewTextItemProperties.multiline;
    this.multivalued = !!cardViewTextItemProperties.multivalued;
    this.pipes = cardViewTextItemProperties.pipes || [];
    this.clickCallBack = cardViewTextItemProperties.clickCallBack ? cardViewTextItemProperties.clickCallBack : null;

    if (this.default && this.isEmpty()) {
      this.value = this.default;
    }
  }

  get displayValue(): string {
    return this.applyPipes(this.value);
  }

  private applyPipes(displayValue) {
    if (this.pipes.length) {
      displayValue = this.pipes.reduce((accumulator, { pipe, params = [] }) => {
        return pipe.transform(accumulator, ...params);
      }, displayValue);
    }

    return displayValue;
  }
}
