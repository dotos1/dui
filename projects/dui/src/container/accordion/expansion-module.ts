import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { A11yModule } from '@angular/cdk/a11y';
import { Accordion } from './accordion';
import { FormBuilder } from '@dotos/dui/core/form';


import {
  ExpansionPanel,
  ExpansionPanelActionRow,
  ExpansionPanelBase
} from './expansion-panel';
import {
  ExpansionPanelDescription,
  ExpansionPanelHeader,
  ExpansionPanelTitle,
} from './expansion-panel-header';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/i18n';


@NgModule({
  imports: [
    CommonModule,
    A11yModule,
     CdkAccordionModule,
     TranslateModule,
     MatIconModule,
     MatDividerModule
  ],
  exports: [
    Accordion,
    ExpansionPanel,
    ExpansionPanelActionRow,
    ExpansionPanelHeader,
    ExpansionPanelTitle,
    ExpansionPanelDescription
  ],
  declarations: [
    ExpansionPanelBase,
    Accordion,
    ExpansionPanel,
    ExpansionPanelActionRow,
    ExpansionPanelHeader,
    ExpansionPanelTitle,
    ExpansionPanelDescription
  ],
  providers: [FormBuilder]
})
export class ExpansionModule {
  entryComponents = [
    Accordion,
    ExpansionPanel,];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
