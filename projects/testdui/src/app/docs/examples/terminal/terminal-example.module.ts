import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerminalModule, TerminalComponent } from '@dotos/dui/ux/terminal';
import { HighlightModule } from '@dotos/dui/ux/highlight';

@Component({
  selector: 'app-terminal-example',
  template: `
    <h2>终端示例</h2>
    <p>这是一个本地回显终端（不连接真实后端），输入任意字符会直接显示在终端里。</p>
    <div style="width:100%; max-width:600px; height:300px;">
      <dui-terminal #term (keyInput)="onInput($event)"></dui-terminal>
    </div>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class TerminalExampleComponent {
  @ViewChild('term') term!: TerminalComponent;

  readonly exampleSource = `<dui-terminal #term (keyInput)="onInput($event)"></dui-terminal>

@ViewChild('term') term!: TerminalComponent;

onInput(char: string): void {
  this.term.write(char);
}`;

  onInput(char: string): void {
    this.term.write(char);
  }
}

const routes: Routes = [{ path: '', component: TerminalExampleComponent }];

@NgModule({
  declarations: [TerminalExampleComponent],
  imports: [CommonModule, TerminalModule, HighlightModule, RouterModule.forChild(routes)],
})
export class TerminalExampleModule {}
