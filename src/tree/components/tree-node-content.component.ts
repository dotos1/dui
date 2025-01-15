import { Component, Input, ViewEncapsulation, TemplateRef } from '@angular/core';

import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-content',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-content.component.html',
  host: {
    '[style.flex]': '1',
    'hostID': crypto.randomUUID().toString()
  },
})
export class TreeNodeContent {

  @Input() set node(node) {
    this._node =node ;
  }
  get node(): TreeNode {
    return this._node;
  }
  private _node: TreeNode;

  @Input() index: number;
  @Input() template: TemplateRef<any>;

}
