import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MonacoEditorModule } from '@dotos/dui/ux/monaco-editor';

@Component({
  selector: 'app-monaco-editor-example',
  template: `
    <h2>代码编辑器示例（Monaco）</h2>
    <monaco-editor style="display:block; height:300px;"
      [options]="{ language: 'json', theme: 'vs-dark' }"
      [(ngModel)]="code"></monaco-editor>
  `,
})
export class MonacoEditorExampleComponent {
  code = '{\n  "hello": "world"\n}';
}

const routes: Routes = [{ path: '', component: MonacoEditorExampleComponent }];

@NgModule({
  declarations: [MonacoEditorExampleComponent],
  imports: [CommonModule, FormsModule, MonacoEditorModule.forRoot({}), RouterModule.forChild(routes)],
})
export class MonacoEditorExampleModule {}
