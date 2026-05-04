import {
  Component, Input, ViewEncapsulation, OnInit, OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { reaction, comparer } from 'mobx'; 
import { observable, computed, action } from '@dotos/dui/core/mobx';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { TreeNode } from '../models/tree-node.model';
import { TreeModel } from '../models/tree.model';

@Component({
  selector: 'tree-node-collection',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-collection.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-collection' + Math.random().toString(36).substring(2, 15)    
  }
})
export class TreeNodeCollectionComponent implements OnInit, OnDestroy {
  @Input()
  get nodes() { return this._nodes; }
  set nodes(nodes) {
    this.setNodes(nodes);
  }

  @Input() treeModel: TreeModel;
  @Input() templates;

  @observable _nodes;
  private virtualScroll: TreeVirtualScroll; 
  @observable viewportNodes: TreeNode[];

  @computed get marginTop(): string {
    const firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0];
    const relativePosition = firstNode && firstNode.parent
     ? firstNode.position - firstNode.parent.position - firstNode.parent.getSelfHeight() : 0;
    return `${relativePosition}px`;
  }

  _dispose =[];

  @action setNodes(nodes) {
    this._nodes = nodes;
  }

  constructor(private cdr: ChangeDetectorRef) {} 

  ngOnInit() {
    this.virtualScroll = this.treeModel.virtualScroll;
    
   this._dispose = [
      reaction(
        () => {
          return this.virtualScroll
            .getViewportNodes(this.nodes)
            .map(n => n.index);
        },
        nodeIndexes => {
          this.viewportNodes = nodeIndexes.map(i => this.nodes[i]);
        },
        { compareStructural: true, fireImmediately: true } as any
      ),
      reaction(
        () => this.nodes,
        nodes => {
          this.viewportNodes = this.virtualScroll.getViewportNodes(nodes);
        }
      )
    ];
  }

  ngOnDestroy() {
    this._dispose.forEach(d => d());
  }

  trackNode(index, node) {
    return node.id;
  }
}