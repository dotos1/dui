import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeModule } from '@dotos/dui/tree';
import { TranslateModule } from '@dotos/dui/translator';

@Component({
  selector: 'app-tree-example',
  template: `
    <h2>树形视图示例</h2>
    <tree-root style="display:block; height:300px;" [nodes]="nodes"></tree-root>
  `,
})
export class TreeExampleComponent {
  nodes = [
    {
      id: 1,
      name: '根节点',
      children: [
        { id: 2, name: '子节点 A' },
        { id: 3, name: '子节点 B', children: [{ id: 4, name: '孙节点 B-1' }] },
      ],
    },
  ];
}

const routes: Routes = [{ path: '', component: TreeExampleComponent }];

@NgModule({
  declarations: [TreeExampleComponent],
  imports: [CommonModule, TranslateModule, TreeModule, RouterModule.forChild(routes)],
})
export class TreeExampleModule {}
