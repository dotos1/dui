import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-children',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  templateUrl: 'tree-node-children.component.html',
  host: {
    hostID: 'tree-node-children' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeChildrenComponent {
  @Input() node: TreeNode;
  @Input() templates: any;
}
