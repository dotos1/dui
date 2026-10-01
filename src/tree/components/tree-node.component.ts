import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import { observable, action } from '@dotos/dui/core/mobx';
import { TreeNode } from '../defs/api';

@Component({
  selector: 'TreeNode, tree-node',
  encapsulation: ViewEncapsulation.None,
     changeDetection: ChangeDetectionStrategy.OnPush, 
  styles: [],
  templateUrl: 'tree-node.component.html',
  host: {
    hostID: 'tree-node' + Math.random().toString(36).substring(2, 15)
  }
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
