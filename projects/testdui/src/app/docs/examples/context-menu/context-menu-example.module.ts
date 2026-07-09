import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContextMenuModule, ContextMenuService } from '@dotos/dui/ui/context-menu';

@Component({
  selector: 'app-context-menu-example',
  template: `
    <h2>右键菜单示例</h2>
    <div
      (contextmenu)="onContextMenu($event)"
      style="width:100%; height:160px; border:1px dashed rgba(0,0,0,.3); border-radius:4px; display:flex; align-items:center; justify-content:center;">
      在此区域内点击鼠标右键
    </div>
    <p style="margin-top:12px;">最近选择：{{ lastAction || '（尚未操作）' }}</p>
  `,
})
export class ContextMenuExampleComponent {
  lastAction = '';

  constructor(private contextMenuService: ContextMenuService) {}

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuService.open({
      source: event,
      children: [
        { title: '复制', handler: () => (this.lastAction = '复制') } as any,
        { title: '粘贴', handler: () => (this.lastAction = '粘贴') } as any,
        { type: 'divider' } as any,
        { title: '删除', handler: () => (this.lastAction = '删除') } as any,
      ],
    });
  }
}

const routes: Routes = [{ path: '', component: ContextMenuExampleComponent }];

@NgModule({
  declarations: [ContextMenuExampleComponent],
  imports: [CommonModule, ContextMenuModule, RouterModule.forChild(routes)],
})
export class ContextMenuExampleModule {}
