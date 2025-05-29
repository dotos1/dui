import { Component, Input, ViewEncapsulation,ChangeDetectionStrategy } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-expander',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  templateUrl: 'tree-node-expander.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'tree-node-expander' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeExpanderComponent {
  @Input() node: TreeNode;
}
