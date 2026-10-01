import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopbarModule } from '@dotos/dui/ui/topbar';
import { HighlightModule } from '@dotos/dui/ux/highlight';

@Component({
  selector: 'app-topbar-example',
  template: `
    <h2>顶部工具栏示例</h2>
    <dui-topbar title="示例标题" color="primary" style="display:block; border-radius:4px; overflow:hidden;">
      <span style="flex:1 1 auto"></span>
      <span>右侧内容</span>
    </dui-topbar>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class TopbarExampleComponent {
  readonly exampleSource = `<dui-topbar title="示例标题" color="primary">
  <span style="flex:1 1 auto"></span>
  <span>右侧内容</span>
</dui-topbar>`;
}

const routes: Routes = [{ path: '', component: TopbarExampleComponent }];

@NgModule({
  declarations: [TopbarExampleComponent],
  imports: [CommonModule, TopbarModule, HighlightModule, RouterModule.forChild(routes)],
})
export class TopbarExampleModule {}
