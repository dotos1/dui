import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'TreeNodeDropSlot, tree-node-drop-slot',
  encapsulation: ViewEncapsulation.None,
     changeDetection: ChangeDetectionStrategy.OnPush, 
  styles: [],
  templateUrl: 'tree-node-drop-slot.component.html',
  host: {

    hostID: 'tree-node-drop-slot' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeDropSlot {
  @Input() node: TreeNode;
  @Input() dropIndex: number;
  onDrop($event) {
    this.node.mouseAction('drop', $event.event, {
      from: $event.element,
      to: { parent: this.node, index: this.dropIndex }
    });
  }
  allowDrop(element, $event) {
    return this.node.options.allowDrop(element, { parent: this.node, index: this.dropIndex }, $event);
  }
}
