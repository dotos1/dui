import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-checkbox',
   encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-checkbox.component.html',
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class TreeNodeCheckboxComponent {
  @Input() node: TreeNode;
  @Input() label: string;
}
