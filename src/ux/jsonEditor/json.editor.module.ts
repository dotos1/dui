import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CardModule } from '@dotos/dui/container';
import { Dui } from '@dotos/dui/core';
import { ButtonModule } from '@dotos/dui/ui/button';
import { DialogsModule } from '@dotos/dui/common/dialogs';
import { TranslationService } from '@dotos/dui/translator';
import { MonacoEditorModule } from '@dotos/dui/ux/monaco-editor';

import { JsonEditor } from './json.editor';
@NgModule({
  declarations: [
    JsonEditor,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    CardModule,
    ButtonModule,
    DialogsModule,
    FlexLayoutModule,
    MonacoEditorModule.forRoot({})
  ]
})
export class JsonEditorModule {
  entryComponents = [JsonEditor];
  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    translateService: TranslationService) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
