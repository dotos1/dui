import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../components/form.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from 'ngx-flexible-layout';

import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { PopoverModule } from '@dotos/dui/common/popover';
import { ButtonModule } from '@dotos/dui/ui/button';
import { ConfigOption, AbstractFormModule } from '@dotos/dui/core/form';

import { WrapperEditorField } from './editor-field';
import { ExtFieldWrapper } from './field-wrapper';
import { WrapperFormField } from './form-field';
import { LabelWrapperField } from './label-field';
import { FormSection } from './form.section';
import { RepeatTypeComponent } from './repeat-section.type';
import { RowEditorComponent } from './row.editor';
import { Fieldset } from './fieldset';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { MatButtonModule } from '@angular/material/button';

export const FIELD_TYPE_COMPONENTS = [
  FormSection,
  ExtFieldWrapper,
  WrapperFormField,
  LabelWrapperField,
  Fieldset,
  WrapperEditorField,
  RepeatTypeComponent,
  RowEditorComponent
];

export const MATERIAL_FORMLY_CONFIG: ConfigOption = {
  wrappers: [
    { name: 'label-field', component: LabelWrapperField },
    { name: 'form-field', component: WrapperFormField },
    { name: 'editor-field', component: WrapperEditorField },
    { name: 'fieldset', component: Fieldset },
    { name: 'field-wrapper', component: ExtFieldWrapper },
  ]
};

@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    FlexLayoutModule,
    MatIconModule,
    MatExpansionModule,
    AbstractFormModule,
    ButtonModule,
    PopoverModule,
    TranslateModule,
    FormModule.forRoot(MATERIAL_FORMLY_CONFIG),
  ],
  exports: FIELD_TYPE_COMPONENTS
})
export class FormWrapperModule {
  entryComponents = FIELD_TYPE_COMPONENTS;
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
