
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewSelectItemProperties, CardViewSelectItemOption } from '../interfaces';


export class CardViewSelectItemModel<T> extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  type: string = 'select';
  options$: Observable<CardViewSelectItemOption<T>[]>;

  constructor(cardViewSelectItemProperties: CardViewSelectItemProperties<T>) {
    super(cardViewSelectItemProperties);
    this.options$ = cardViewSelectItemProperties.options$;
  }

  get displayValue() {
    return this.options$.pipe(
      switchMap((options) => {
        const option = options.find((o) => o.key === this.value);
        return of(option ? option.label : '');
      })
    );
  }
}
