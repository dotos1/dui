import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  AlphaModule,  CheckboardModule,  EditableInputModule,  HueModule,  SaturationModule,  SwatchModule,
} from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { SketchDialogComponent } from './sketch-dialog.component';
import { SketchFieldsComponent } from './sketch-fields.component';
import { SketchPresetColorsComponent } from './sketch-preset-colors.component';
import { SketchComponent } from './sketch.component';


@NgModule({
  declarations: [
    SketchComponent,
    SketchFieldsComponent,
    SketchPresetColorsComponent,
    SketchDialogComponent
  ],
  exports: [
    SketchComponent,
    SketchFieldsComponent,
    SketchPresetColorsComponent,
    SketchDialogComponent
  ],
  imports: [
    CommonModule,
    AlphaModule,
    CheckboardModule,
    EditableInputModule,
    HueModule,
    SaturationModule,
    SwatchModule,
    MatButtonModule
  ],
})
export class ColorSketchModule {
  entryComponents = [
     SketchComponent,
    SketchFieldsComponent,
    SketchPresetColorsComponent,];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
