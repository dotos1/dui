import { ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { FieldType } from './field.type';
import { FieldConfig } from '../models/field.config';

@Directive()
export abstract class FieldWrapper<F extends FieldConfig = FieldConfig> extends FieldType<F> {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
}
