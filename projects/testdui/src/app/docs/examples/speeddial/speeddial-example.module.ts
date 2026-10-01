import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpeedDialModule } from '@dotos/dui/ui/speeddial';
import { HighlightModule } from '@dotos/dui/ux/highlight';

@Component({
  selector: 'app-speeddial-example',
  template: `
    <h2>速度拨号按钮示例</h2>
    <div style="position:relative; height:220px;">
      <speeddial icon="add" direction="up" [items]="items"></speeddial>
    </div>
    <p>最近选择：{{ lastAction || '（尚未点击）' }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class SpeeddialExampleComponent {
  lastAction = '';
  items = [
    { icon: 'edit', title: '编辑', handler: () => (this.lastAction = '编辑') },
    { icon: 'share', title: '分享', handler: () => (this.lastAction = '分享') },
    { icon: 'delete', title: '删除', handler: () => (this.lastAction = '删除') },
  ];

  readonly exampleSource = `<speeddial icon="add" direction="up" [items]="items"></speeddial>

items = [
  { icon: 'edit', title: '编辑', handler: () => this.edit() },
  { icon: 'share', title: '分享', handler: () => this.share() },
  { icon: 'delete', title: '删除', handler: () => this.remove() },
];`;
}

const routes: Routes = [{ path: '', component: SpeeddialExampleComponent }];

@NgModule({
  declarations: [SpeeddialExampleComponent],
  imports: [CommonModule, SpeedDialModule, HighlightModule, RouterModule.forChild(routes)],
})
export class SpeeddialExampleModule {}
