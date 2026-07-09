import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopbarModule } from '@dotos/dui/ui/topbar';

@Component({
  selector: 'app-topbar-example',
  template: `
    <h2>顶部工具栏示例</h2>
    <dui-topbar title="示例标题" color="primary" style="display:block; border-radius:4px; overflow:hidden;">
      <span style="flex:1 1 auto"></span>
      <span>右侧内容</span>
    </dui-topbar>
  `,
})
export class TopbarExampleComponent {}

const routes: Routes = [{ path: '', component: TopbarExampleComponent }];

@NgModule({
  declarations: [TopbarExampleComponent],
  imports: [CommonModule, TopbarModule, RouterModule.forChild(routes)],
})
export class TopbarExampleModule {}
