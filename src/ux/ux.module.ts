
import { NgModule } from '@angular/core';
import { CodeEditorModule } from './code-editor/code-editor.module';
import { IconPickerModule } from './iconpicker/icon-picker.module';

const MODULE_ARRAY: Array<any> = [
  CodeEditorModule,
  IconPickerModule,
];
@NgModule({
  imports: MODULE_ARRAY
})
export class ExtUxModule {

}
