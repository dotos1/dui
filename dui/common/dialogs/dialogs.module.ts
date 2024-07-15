import { ComponentFactoryResolver, Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  duiDialogComponent,
  duiDialogTitleDirective,
  duiDialogActionsDirective,
  duiDialogContentDirective,
  duiDialogStatusDirective,
} from './dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './prompt-dialog/prompt-dialog.component';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';
import { DialogService } from './services/dialog.service';
import { WindowDialogComponent } from './window-dialog/window-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@dotos/dui/i18n';
import { Dui } from '@dotos/dui/core';

const DIALOGS: Type<any>[] = [
  AlertDialogComponent,
  ConfirmDialogComponent,
  PromptDialogComponent,
  duiDialogComponent,
  duiDialogStatusDirective,
  duiDialogTitleDirective,
  duiDialogActionsDirective,
  duiDialogContentDirective,
  WindowDialogComponent,
  AlertDialogComponent,
  ConfirmDialogComponent,
  PromptDialogComponent,
  StatusDialogComponent,
];
const DIALOGS_ENTRY_COMPONENTS: Type<any>[] = [
  AlertDialogComponent,
  ConfirmDialogComponent,
  PromptDialogComponent
];
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    FlexLayoutModule
  ],
  declarations: [...DIALOGS],
  exports: [...DIALOGS],
  providers: [DialogService],
})
export class DialogsModule {
  entryComponents = DIALOGS_ENTRY_COMPONENTS;
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
