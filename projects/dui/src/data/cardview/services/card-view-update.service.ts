
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CardViewBaseItemModel } from '../models';

export interface UpdateNotification {
  target: any;
  changed: any;
}

export interface ClickNotification {
  target: any;
}

export function transformKeyToObject(key: string, value): Object {
  const objectLevels: string[] = key.split('.').reverse();

  return objectLevels.reduce<{}>((previousValue, currentValue) => {
    return { [currentValue]: previousValue };
  }, value);
}

@Injectable({
  providedIn: 'root'
})
export class CardViewUpdateService {

  itemUpdated$ = new Subject<UpdateNotification>();
  itemClicked$ = new Subject<ClickNotification>();
  updateItem$ = new Subject<CardViewBaseItemModel>();

  update(property: CardViewBaseItemModel, newValue: any) {
    this.itemUpdated$.next({
      target: property,
      changed: transformKeyToObject(property.key, newValue)
    });
  }

  clicked(property: CardViewBaseItemModel) {
    this.itemClicked$.next({
      target: property
    });
  }

  updateElement(notification: CardViewBaseItemModel) {
    this.updateItem$.next(notification);
  }

}
