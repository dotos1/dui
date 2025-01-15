import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tree-loading-component',
  templateUrl: 'loading.component.html',
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class LoadingComponent {
  @Input() template: TemplateRef<any>;
  @Input() node: TreeNode;
}
