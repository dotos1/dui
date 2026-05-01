import { 
  Component, 
  Input, 
  ViewEncapsulation, 
  ChangeDetectionStrategy, 
  ElementRef, 
  NgZone, 
  OnInit, 
  OnDestroy 
} from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'tree-node-wrapper',
  encapsulation: ViewEncapsulation.None,
  styles:[],
  templateUrl: 'tree-node-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-wrapper' + Math.random().toString(36).substring(2, 15) 
  }
})
export class TreeNodeWrapperComponent implements OnInit, OnDestroy {
  @Input() node: TreeNode;
  @Input() index: number;
  @Input() templates: any;

  private cleanupListeners: (() => void)[] =[];

  constructor(
    private el: ElementRef,
    private ngZone: NgZone
  ) { }
 ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      const nativeEl = this.el.nativeElement;
      const createHandler = (actionName: string, runInZone: boolean) => (event: MouseEvent) => {
        const wrapper = nativeEl.querySelector('.node-content-wrapper');
        if (wrapper && wrapper.contains(event.target as Node)) {
          if (this.node && this.node.mouseAction) {
            if (runInZone) {
               this.ngZone.run(() => {
                 this.node.mouseAction(actionName, event);
               });
            } else {
               this.node.mouseAction(actionName, event);
            }
          }
        }
      };

      const clickHandler = createHandler('click', true);
      const dblClickHandler = createHandler('dblClick', true);
      const contextMenuHandler = createHandler('contextMenu', true);
      
      const mouseOverHandler = createHandler('mouseOver', false);
      const mouseOutHandler = createHandler('mouseOut', false);

      nativeEl.addEventListener('click', clickHandler);
      nativeEl.addEventListener('dblclick', dblClickHandler);
      nativeEl.addEventListener('contextmenu', contextMenuHandler);
      nativeEl.addEventListener('mouseover', mouseOverHandler);
      nativeEl.addEventListener('mouseout', mouseOutHandler);

      this.cleanupListeners =[
        () => nativeEl.removeEventListener('click', clickHandler),
        () => nativeEl.removeEventListener('dblclick', dblClickHandler),
        () => nativeEl.removeEventListener('contextmenu', contextMenuHandler),
        () => nativeEl.removeEventListener('mouseover', mouseOverHandler),
        () => nativeEl.removeEventListener('mouseout', mouseOutHandler)
      ];
    });
  }

  ngOnDestroy() {
    this.cleanupListeners.forEach(cleanup => cleanup());
    this.cleanupListeners = [];
  }
}