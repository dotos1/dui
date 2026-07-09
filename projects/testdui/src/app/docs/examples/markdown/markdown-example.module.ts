import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from '@dotos/dui/ux/markdown';

@Component({
  selector: 'app-markdown-example',
  template: `
    <h2>Markdown 渲染示例</h2>
    <dui-markdown [content]="content"></dui-markdown>
  `,
})
export class MarkdownExampleComponent {
  content = [
    '# 标题一',
    '',
    '这是一段 **加粗** 和 *斜体* 文字，还有一个 [链接](https://angular.dev)。',
    '',
    '```typescript',
    "const hello = 'world';",
    '```',
    '',
    '- 列表项一',
    '- 列表项二',
  ].join('\n');
}

const routes: Routes = [{ path: '', component: MarkdownExampleComponent }];

@NgModule({
  declarations: [MarkdownExampleComponent],
  imports: [CommonModule, MarkdownModule, RouterModule.forChild(routes)],
})
export class MarkdownExampleModule {}
