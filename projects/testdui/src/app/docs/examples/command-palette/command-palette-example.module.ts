import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandPaletteModule, CommandPaletteService } from '@dotos/dui/ux/command-palette';

@Component({
  selector: 'app-command-palette-example',
  template: `
    <h2>命令面板示例</h2>
    <p>按 <code>Ctrl/Cmd + K</code> 打开命令面板（Esc 关闭），试试搜索"新建文件"或"保存"。</p>
    <p style="margin-top:12px;">最近执行：{{ lastAction || '（尚未执行）' }}</p>
  `,
})
export class CommandPaletteExampleComponent implements OnInit {
  lastAction = '';

  constructor(private cmdPalette: CommandPaletteService) {}

  ngOnInit(): void {
    this.cmdPalette.init();
    this.cmdPalette.addGroups([
      {
        title: '操作',
        items: [
          { text: '新建文件', callback: () => (this.lastAction = '新建文件') },
          { text: '保存', callback: () => (this.lastAction = '保存') },
          { text: '打开 Angular 官网', href: 'https://angular.dev' },
        ],
      },
    ] as any);
  }
}

const routes: Routes = [{ path: '', component: CommandPaletteExampleComponent }];

@NgModule({
  declarations: [CommandPaletteExampleComponent],
  imports: [CommonModule, CommandPaletteModule, RouterModule.forChild(routes)],
})
export class CommandPaletteExampleModule {}
