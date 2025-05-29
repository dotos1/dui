import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-checkbox',
   encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-checkbox.component.html',
  host: {
    hostID: 'tree-node-checkbox' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeCheckboxComponent {
  @Input() node: TreeNode;
  @Input() label: string;
}
