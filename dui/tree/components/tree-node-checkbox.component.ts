import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-checkbox',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  templateUrl: 'tree-node-checkbox.component.html',
})
export class TreeNodeCheckboxComponent {
  @Input() node: TreeNode;
  @Input() label: string;
  
}
