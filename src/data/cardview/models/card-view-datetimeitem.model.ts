
import { TranslationService } from '@dotos/dui/translator';
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewDateItemModel } from './card-view-dateitem.model';
import { CardViewItem,CardViewDateItemProperties } from '../interfaces';

export class CardViewDatetimeItemModel extends CardViewDateItemModel implements CardViewItem, DynamicComponentModel {
  override type: string = 'datetime';
  override format: string = 'MMM d, y, H:mm';

  constructor(
    cardViewDateItemProperties: CardViewDateItemProperties,
    public override translateService: TranslationService) {
    super(cardViewDateItemProperties, translateService);

    if (cardViewDateItemProperties.format) {
      this.format = cardViewDateItemProperties.format;
    }
  }
}
