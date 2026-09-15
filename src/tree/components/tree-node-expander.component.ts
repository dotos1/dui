import { Component, Input, ViewEncapsulation,ChangeDetectionStrategy } from '@angular/core';
import { action, observable } from '@dotos/dui/core/mobx';
import { TreeNode } from '../models/tree-node.model';
import { 
  ElementRef, 
  NgZone, 
  OnInit, 
  OnDestroy 
} from '@angular/core';

@Component({
  selector: 'tree-node-expander',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-expander.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-expander' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeExpanderComponent implements OnInit, OnDestroy {
  //同 TreeNodeChildrenComponent：模板在 treeMobxAutorun 里，换实例必须走 observable
  @Input()
  get node() {
    return this._node;
  }
  set node(node) {
    this.setNode(node);
  }
  @action setNode(node) {
    this._node = node;
  }
  @observable _node: TreeNode;


  private clickListener: (event: MouseEvent) => void;

  constructor(
    private el: ElementRef, 
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.clickListener = (event: MouseEvent) => {
      const wrapper = this.el.nativeElement.querySelector('.toggle-children-wrapper');
      if (wrapper && wrapper.contains(event.target as Node)) {
        if (this.node && this.node.hasChildren && this.node.mouseAction) {
          this.node.mouseAction('expanderClick', event);
        }
      }
    };

    this.ngZone.runOutsideAngular(() => {
      this.el.nativeElement.addEventListener('click', this.clickListener);
    });
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.el.nativeElement.removeEventListener('click', this.clickListener);
    }
  }
}