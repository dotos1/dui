import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DialogsModule, DialogService } from '@dotos/dui/common/dialogs';
import { HighlightModule } from '@dotos/dui/ux/highlight';

@Component({
  selector: 'app-dialogs-example',
  template: `
    <h2>对话框示例</h2>
    <div style="display:flex; gap:12px;">
      <button mat-raised-button (click)="openAlert()">打开提示框</button>
      <button mat-raised-button (click)="openConfirm()">打开确认框</button>
    </div>
    <p style="margin-top:12px;">最近结果：{{ lastResult }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class DialogsExampleComponent {
  lastResult = '（尚未操作）';

  readonly exampleSource = `constructor(private dialogService: DialogService) {}

openAlert(): void {
  this.dialogService
    .openAlert({ title: '提示', message: '这是一个提示框示例。' })
    .afterClosed()
    .subscribe(() => { /* 已关闭 */ });
}

openConfirm(): void {
  this.dialogService
    .openConfirm({ title: '确认', message: '确定要执行此操作吗？' })
    .afterClosed()
    .subscribe((result: boolean) => { /* result 为 true/false */ });
}`;

  constructor(private dialogService: DialogService) {}

  openAlert(): void {
    this.dialogService
      .openAlert({ title: '提示', message: '这是一个提示框示例。' } as any)
      .afterClosed()
      .subscribe(() => (this.lastResult = '提示框已关闭'));
  }

  openConfirm(): void {
    this.dialogService
      .openConfirm({ title: '确认', message: '确定要执行此操作吗？' } as any)
      .afterClosed()
      .subscribe((result: boolean) => (this.lastResult = result ? '用户点击了确认' : '用户取消了'));
  }
}

const routes: Routes = [{ path: '', component: DialogsExampleComponent }];

@NgModule({
  declarations: [DialogsExampleComponent],
  imports: [CommonModule, MatButtonModule, DialogsModule, HighlightModule, RouterModule.forChild(routes)],
})
export class DialogsExampleModule {}
