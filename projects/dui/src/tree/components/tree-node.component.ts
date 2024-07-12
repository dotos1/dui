import { Component, Input, ViewEncapsulation} from '@angular/core';
import { observable, action } from '@dotos/dui/core/mobx';
import { TreeNode } from '../defs/api';

@Component({
  selector: 'TreeNode, tree-node',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  templateUrl: 'tree-node.component.html',
})

export class TreeNodeComponent {
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
  @Input() index: number;
  @Input() templates: any;
}
