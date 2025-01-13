import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  AlphaModule,  CheckboardModule,  EditableInputModule,  HueModule,  SaturationModule,  SwatchModule,
} from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import {GradientDialogComponent } from './gradient-dialog.component';
import {GradientFieldsComponent } from './gradient-fields.component';
// import {GradientPresetColorsComponent } from './gradient-preset-colors.component';
import {GradientComponent } from './gradient.component';
import { GradientHueComponent } from './components/gradient-hue.component';
import { GradientOpacityComponent } from './components/gradient-opacity.component';
import { GradientBarHandleComponent } from './components/gradient-bar-handle.component';
import { GradientBarComponent } from './components/gradient-bar.component';
import { GradientSquareComponent } from './components/gradient-square.component';
import { GradientPresetsComponent } from './components/gradient-presets.component';
import { EyeDropperComponent } from './components/eye-dropper.component';
import { GradientControlsComponent } from './components/gradient-controls.component';
import { ControlsComponent } from './components/controls.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
   GradientComponent,
   GradientFieldsComponent,
   GradientHueComponent,
   GradientBarHandleComponent,
   GradientBarComponent,
   GradientSquareComponent,
   GradientOpacityComponent,
   GradientPresetsComponent,
   EyeDropperComponent,
   ControlsComponent,
   GradientControlsComponent,
  //  GradientPresetColorsComponent,
   GradientDialogComponent
  ],
  exports: [
   GradientComponent,
   GradientFieldsComponent,
  //  GradientPresetColorsComponent,
   GradientDialogComponent
  ],
  imports: [
    CommonModule,
    AlphaModule,
    MatIconModule,
    CheckboardModule,
    EditableInputModule,
    HueModule,
    SaturationModule,
    SwatchModule,
    MatButtonModule
  ],
})
export class ColorGradientModule {
  entryComponents = [
    GradientComponent,
   GradientFieldsComponent,
   ];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
