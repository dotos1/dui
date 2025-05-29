import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tree-loading-component',
  templateUrl: 'loading.component.html',
  host: {
    hostID: 'tree-loading-component' + Math.random().toString(36).substring(2, 15)
  }
})
export class LoadingComponent {
  @Input() template: TemplateRef<any>;
  @Input() node: TreeNode;
}
