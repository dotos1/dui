import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuModule } from '@dotos/dui/ui/menu';
import { HighlightModule } from '@dotos/dui/ux/highlight';

@Component({
  selector: 'app-menu-example',
  template: `
    <h2>菜单栏示例</h2>
    <dui-menu-bar [items]="items"></dui-menu-bar>
    <p style="margin-top:12px;">最近点击：{{ lastAction || '（尚未点击）' }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class MenuExampleComponent {
  lastAction = '';
  items = [
    {
      title: '文件',
      children: [
        { title: '新建', handler: () => (this.lastAction = '新建') },
        { title: '打开', handler: () => (this.lastAction = '打开') },
        { type: 'divider' },
        { title: '退出', handler: () => (this.lastAction = '退出') },
      ],
    },
    {
      title: '编辑',
      children: [
        { title: '撤销', handler: () => (this.lastAction = '撤销') },
        { title: '重做', handler: () => (this.lastAction = '重做') },
      ],
    },
  ];

  readonly exampleSource = `<dui-menu-bar [items]="items"></dui-menu-bar>

items = [
  {
    title: '文件',
    children: [
      { title: '新建', handler: () => this.newFile() },
      { title: '打开', handler: () => this.open() },
      { type: 'divider' },
      { title: '退出', handler: () => this.quit() },
    ],
  },
];`;
}

const routes: Routes = [{ path: '', component: MenuExampleComponent }];

@NgModule({
  declarations: [MenuExampleComponent],
  imports: [CommonModule, MenuModule, HighlightModule, RouterModule.forChild(routes)],
})
export class MenuExampleModule {}
