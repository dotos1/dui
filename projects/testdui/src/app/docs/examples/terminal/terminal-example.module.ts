import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerminalModule, TerminalComponent } from '@dotos/dui/ux/terminal';

@Component({
  selector: 'app-terminal-example',
  template: `
    <h2>终端示例</h2>
    <p>这是一个本地回显终端（不连接真实后端），输入任意字符会直接显示在终端里。</p>
    <div style="width:100%; max-width:600px; height:300px;">
      <dui-terminal #term (keyInput)="onInput($event)"></dui-terminal>
    </div>
  `,
})
export class TerminalExampleComponent {
  @ViewChild('term') term!: TerminalComponent;

  onInput(char: string): void {
    this.term.write(char);
  }
}

const routes: Routes = [{ path: '', component: TerminalExampleComponent }];

@NgModule({
  declarations: [TerminalExampleComponent],
  imports: [CommonModule, TerminalModule, RouterModule.forChild(routes)],
})
export class TerminalExampleModule {}
