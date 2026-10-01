
import { Injectable, Type } from '@angular/core';
import { DynamicComponentMapper, DynamicComponentResolveFunction, DynamicComponentResolver } from '@dotos/dui/core/services';
import { 
  CardViewDateItemComponent,CardViewMapItemComponent,CardViewTextItemComponent,
  CardViewSelectItemComponent,CardViewBoolItemComponent,CardViewKeyValuePairsItemComponent,
  CardViewArrayItemComponent
 } from '../components';
 
@Injectable({
  providedIn: 'root'
})
export class CardItemTypeService extends DynamicComponentMapper {

  protected override defaultValue: Type<{}> = CardViewTextItemComponent;

  protected override types: { [key: string]: DynamicComponentResolveFunction } = {
    'text': DynamicComponentResolver.fromType(CardViewTextItemComponent),
    'select': DynamicComponentResolver.fromType(CardViewSelectItemComponent),
    'int': DynamicComponentResolver.fromType(CardViewTextItemComponent),
    'float': DynamicComponentResolver.fromType(CardViewTextItemComponent),
    'date': DynamicComponentResolver.fromType(CardViewDateItemComponent),
    'datetime': DynamicComponentResolver.fromType(CardViewDateItemComponent),
    'bool': DynamicComponentResolver.fromType(CardViewBoolItemComponent),
    'map': DynamicComponentResolver.fromType(CardViewMapItemComponent),
    'keyvaluepairs': DynamicComponentResolver.fromType(CardViewKeyValuePairsItemComponent),
    'array': DynamicComponentResolver.fromType(CardViewArrayItemComponent)
  };
}
