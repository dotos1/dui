import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { action, observable } from '@dotos/dui/core/mobx';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-checkbox',
   encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-checkbox.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-checkbox' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeCheckboxComponent {
  //同 TreeNodeChildrenComponent：模板在 mobxAutorun 里，换实例必须走 observable
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

  @Input() label: string;
}
