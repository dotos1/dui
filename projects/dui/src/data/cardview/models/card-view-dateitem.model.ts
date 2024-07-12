
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { LocalizedDatePipe } from '@dotos/dui/util/pipes';
import { TranslationService } from '@dotos/dui/i18n';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewDateItemProperties } from '../interfaces';


export class CardViewDateItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  type: string = 'date';
  format: string;
  locale: string;

  localizedDatePipe: LocalizedDatePipe;

  constructor(
    cardViewDateItemProperties: CardViewDateItemProperties,
    public translateService: TranslationService) {
    super(cardViewDateItemProperties);

    if (cardViewDateItemProperties.format) {
      this.format = cardViewDateItemProperties.format;
    }

    if (cardViewDateItemProperties.locale) {
      this.locale = cardViewDateItemProperties.locale;
    }

  }

  get displayValue() {
    if (!this.value) {
      return this.default;
    } else {
      this.localizedDatePipe = new LocalizedDatePipe(this.translateService);
      return this.localizedDatePipe.transform(this.value, this.format, this.locale);
    }
  }
}
