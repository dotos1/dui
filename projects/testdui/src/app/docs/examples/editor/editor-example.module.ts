import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Editor, EditorModule } from '@dotos/dui/ux/editor';

@Component({
  selector: 'app-editor-example',
  template: `
    <h2>富文本编辑器示例</h2>
    <dui-editor [editor]="editor" style="display:block; border:1px solid rgba(0,0,0,.1); min-height:200px;"></dui-editor>
  `,
})
export class EditorExampleComponent {
  editor = new Editor({ content: '<p>在这里输入 <strong>富文本</strong> 内容。</p>' } as any);
}

const routes: Routes = [{ path: '', component: EditorExampleComponent }];

@NgModule({
  declarations: [EditorExampleComponent],
  imports: [CommonModule, EditorModule.forRoot(), RouterModule.forChild(routes)],
})
export class EditorExampleModule {}
