import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContextMenuModule, ContextMenuService } from '@dotos/dui/ui/context-menu';
import { HighlightModule } from '@dotos/dui/ux/highlight';

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

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class ContextMenuExampleComponent {
  lastAction = '';

  readonly exampleSource = `<div (contextmenu)="onContextMenu($event)">在此区域内点击鼠标右键</div>

constructor(private contextMenuService: ContextMenuService) {}

onContextMenu(event: MouseEvent): void {
  event.preventDefault();
  this.contextMenuService.open({
    source: event,
    children: [
      { title: '复制', handler: () => this.copy() },
      { title: '粘贴', handler: () => this.paste() },
      { type: 'divider' },
      { title: '删除', handler: () => this.remove() },
    ],
  });
}`;

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
  imports: [CommonModule, ContextMenuModule, HighlightModule, RouterModule.forChild(routes)],
})
export class ContextMenuExampleModule {}
