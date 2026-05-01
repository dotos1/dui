import { Component, Input, ViewEncapsulation, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-content',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-content.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    '[style.flex]': '1',
    hostID: 'tree-node-content' + Math.random().toString(36).substring(2, 15),
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

  private sub: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.sub = this.node.treeModel.subscribe('updateData', (event: any) => {
      if (event.node === this.node) {
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    if (this.sub && this.sub.unsubscribe) {
      this.sub.unsubscribe();
    }
  }
}
