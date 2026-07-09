import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatatableModule } from '@dotos/dui/data/datatable';

@Component({
  selector: 'app-datatable-example',
  template: `
    <h2>数据表格示例</h2>
    <dui-datatable style="display:block; height:300px;" [rows]="rows" [columns]="columns"></dui-datatable>
  `,
})
export class DatatableExampleComponent {
  columns = [
    { prop: 'name', name: '姓名' },
    { prop: 'role', name: '角色' },
    { prop: 'age', name: '年龄' },
  ];
  rows = [
    { name: '张三', role: '前端工程师', age: 28 },
    { name: '李四', role: '后端工程师', age: 32 },
    { name: '王五', role: '产品经理', age: 30 },
  ];
}

const routes: Routes = [{ path: '', component: DatatableExampleComponent }];

@NgModule({
  declarations: [DatatableExampleComponent],
  imports: [CommonModule, DatatableModule, RouterModule.forChild(routes)],
})
export class DatatableExampleModule {}
