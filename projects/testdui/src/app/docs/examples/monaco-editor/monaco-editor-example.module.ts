import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MonacoEditorModule } from '@dotos/dui/ux/monaco-editor';
import { HighlightModule } from '@dotos/dui/ux/highlight';

@Component({
  selector: 'app-monaco-editor-example',
  template: `
    <h2>代码编辑器示例（Monaco）</h2>
    <monaco-editor style="display:block; height:300px;"
      [options]="{ language: 'json', theme: 'vs-dark' }"
      [(ngModel)]="code"></monaco-editor>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class MonacoEditorExampleComponent {
  code = '{\n  "hello": "world"\n}';

  readonly exampleSource = `<monaco-editor
  [options]="{ language: 'json', theme: 'vs-dark' }"
  [(ngModel)]="code"></monaco-editor>`;
}

const routes: Routes = [{ path: '', component: MonacoEditorExampleComponent }];

@NgModule({
  declarations: [MonacoEditorExampleComponent],
  imports: [CommonModule, FormsModule, MonacoEditorModule.forRoot({}), HighlightModule, RouterModule.forChild(routes)],
})
export class MonacoEditorExampleModule {}
