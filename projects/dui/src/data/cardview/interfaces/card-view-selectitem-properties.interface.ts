
import { CardViewItemProperties } from './card-view-item-properties.interface';
import { Observable } from 'rxjs';

export interface CardViewSelectItemOption<T> {
  label: string;
  key: T;
}

export interface CardViewSelectItemProperties<T> extends CardViewItemProperties {
  value: string;
  options$: Observable<CardViewSelectItemOption<T>[]>;
}
