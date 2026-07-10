import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelModule, DuiTabsModule } from '@dotos/dui/container';
import { HighlightModule } from '@dotos/dui/ux/highlight';

@Component({
  selector: 'app-container-example',
  template: `
    <h2>面板 / 标签页示例</h2>
    <tabpanel style="display:block; height:280px;" [config]="config"></tabpanel>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class ContainerExampleComponent {
  config = {
    items: [
      { xtype: 'panel', titile: '标签一', html: '<p style="padding:12px;">第一个标签页的内容。</p>' },
      { xtype: 'panel', titile: '标签二', html: '<p style="padding:12px;">第二个标签页的内容。</p>' },
      { xtype: 'panel', titile: '标签三', html: '<p style="padding:12px;">第三个标签页的内容。</p>' },
    ],
  };

  readonly exampleSource = `<tabpanel [config]="config"></tabpanel>

config = {
  items: [
    { xtype: 'panel', titile: '标签一', html: '...' },
    { xtype: 'panel', titile: '标签二', html: '...' },
  ],
};`;
}

const routes: Routes = [{ path: '', component: ContainerExampleComponent }];

@NgModule({
  declarations: [ContainerExampleComponent],
  imports: [CommonModule, PanelModule, DuiTabsModule, HighlightModule, RouterModule.forChild(routes)],
})
export class ContainerExampleModule {}
