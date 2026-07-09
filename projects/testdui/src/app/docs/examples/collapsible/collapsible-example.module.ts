import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollapsibleModule } from '@dotos/dui/common/collapsible';

@Component({
  selector: 'app-collapsible-example',
  template: `
    <h2>折叠面板示例</h2>
    <p>点击标题右侧的箭头图标展开/收起内容：</p>
    <dui-collapsible title="点击这里展开/收起" style="display:block; border:1px solid rgba(0,0,0,.1); border-radius:4px;">
      <div style="padding: 12px;">这里是可折叠的内容区域。</div>
    </dui-collapsible>
  `,
})
export class CollapsibleExampleComponent {}

const routes: Routes = [{ path: '', component: CollapsibleExampleComponent }];

@NgModule({
  declarations: [CollapsibleExampleComponent],
  imports: [CommonModule, CollapsibleModule, RouterModule.forChild(routes)],
})
export class CollapsibleExampleModule {}
