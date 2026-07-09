import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from '@dotos/dui/common/toastr';

@Component({
  selector: 'app-toastr-example',
  template: `
    <h2>消息通知示例</h2>
    <div style="display:flex; gap:12px;">
      <button mat-raised-button color="primary" (click)="toastr.success('操作已成功', '成功')">成功</button>
      <button mat-raised-button color="warn" (click)="toastr.error('发生了一个错误', '错误')">错误</button>
      <button mat-raised-button (click)="toastr.info('这是一条提示信息', '提示')">提示</button>
      <button mat-raised-button (click)="toastr.warning('请注意', '警告')">警告</button>
    </div>
  `,
})
export class ToastrExampleComponent {
  constructor(public toastr: ToastrService) {}
}

const routes: Routes = [{ path: '', component: ToastrExampleComponent }];

@NgModule({
  declarations: [ToastrExampleComponent],
  imports: [CommonModule, MatButtonModule, RouterModule.forChild(routes)],
})
export class ToastrExampleModule {}
