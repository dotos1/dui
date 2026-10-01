import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormModule } from '../components/form.module';

import { DuiPipesModule } from '@dotos/dui/util/pipes';
import { Dui, StyleModule } from '@dotos/dui/core';
import { ColorPickerContent } from './color-picker.content';
import { ColorPickerField } from './color-picker.field';
import { ColorCompactModule } from '@dotos/dui/common/colorpicker/components';
import { ColorChromeModule } from '@dotos/dui/common/colorpicker/components';
import { ColorGithubModule } from '@dotos/dui/common/colorpicker/components';
import { ColorSketchModule } from '@dotos/dui/common/colorpicker/components';
import { TranslateModule } from '@dotos/dui/translator';

@NgModule({
  declarations: [
    ColorPickerContent,
    ColorPickerField,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    DuiPipesModule,
    FormModule.forChild(),
    ReactiveFormsModule,
    OverlayModule,
    PortalModule,
    A11yModule,
    StyleModule,
    TranslateModule,
    ColorCompactModule,
    ColorChromeModule,
    ColorGithubModule,
    ColorSketchModule,
    MatInputModule
  ],
  exports: [
    ColorCompactModule,
    ColorChromeModule,
    ColorGithubModule,
    ColorSketchModule,
    ColorPickerContent,
    ColorPickerField
  ],
})
export class ColorFieldModule {
  entryComponents = [
    ColorPickerContent,
    ColorPickerField
  ];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
