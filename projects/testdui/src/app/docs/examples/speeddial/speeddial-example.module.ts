import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpeedDialModule } from '@dotos/dui/ui/speeddial';

@Component({
  selector: 'app-speeddial-example',
  template: `
    <h2>速度拨号按钮示例</h2>
    <div style="position:relative; height:220px;">
      <speeddial icon="add" direction="up" [items]="items"></speeddial>
    </div>
    <p>最近选择：{{ lastAction || '（尚未点击）' }}</p>
  `,
})
export class SpeeddialExampleComponent {
  lastAction = '';
  items = [
    { icon: 'edit', title: '编辑', handler: () => (this.lastAction = '编辑') },
    { icon: 'share', title: '分享', handler: () => (this.lastAction = '分享') },
    { icon: 'delete', title: '删除', handler: () => (this.lastAction = '删除') },
  ];
}

const routes: Routes = [{ path: '', component: SpeeddialExampleComponent }];

@NgModule({
  declarations: [SpeeddialExampleComponent],
  imports: [CommonModule, SpeedDialModule, RouterModule.forChild(routes)],
})
export class SpeeddialExampleModule {}
