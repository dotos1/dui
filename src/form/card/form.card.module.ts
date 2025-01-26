import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@dotos/dui/form';
import { MatInputModule  } from '@angular/material/input';
import { MatCardModule  } from '@angular/material/card';
import {  MatFormFieldModule, } from '@angular/material/form-field';
import { MatDividerModule  } from '@angular/material/divider';
import { MatPaginatorModule  } from '@angular/material/paginator';
import { FormCard } from './form.card';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';

@NgModule({
  declarations: [FormCard],
  imports: [
    CommonModule,
    FormModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule,
    TranslateModule,
    MatPaginatorModule,
    FlexLayoutModule
  ],
  exports: [FormCard],
})
export class FormCardModule {
  entryComponents = [FormCard];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
