import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { action, observable } from '@dotos/dui/core/mobx';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-children',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  templateUrl: 'tree-node-children.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-children' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeChildrenComponent {
  // node 必须是 observable：模板跑在 mobxAutorun 里，autorun 的依赖是在
  // detectChanges 期间收集的。父节点重新加载子节点时会换成全新的 TreeNode 实例
  // （id 不变），普通 @Input 换实例不产生 mobx 通知，autorun 会一直盯着旧实例，
  // 新实例后到的 children 就再也刷不出来——表现为节点永远转圈。
  @Input()
  get node() {
    return this._node;
  }
  set node(node) {
    this.setNode(node);
  }
  @action setNode(node) {
    this._node = node;
  }
  @observable _node: TreeNode;

  @Input() templates: any;
}
