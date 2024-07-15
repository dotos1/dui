import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-wrapper',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  templateUrl: 'tree-node-wrapper.component.html',
})
export class TreeNodeWrapperComponent {
  @Input() node: TreeNode;
  @Input() index: number;
  @Input() templates: any;
  constructor() { }
}
