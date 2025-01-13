import { NgModule, ModuleWithProviders, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtCodeEditorComponent } from './code-editor.component';
import { Dui } from '@dotos/dui/core';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ExtCodeEditorComponent,
  ],
  exports: [
    ExtCodeEditorComponent,
  ],
  bootstrap: [ ExtCodeEditorComponent ],
})
export class CodeEditorModule {
  entryComponents = [ExtCodeEditorComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
  static forRoot(): ModuleWithProviders<CodeEditorModule> {
    return {
      ngModule: CodeEditorModule,
      providers: [ ],
    };
  }
}
