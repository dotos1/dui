import { AfterViewInit, Directive, DoCheck, ElementRef, HostListener, Input, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { TreeDraggedElement } from '../models';


@Directive({
  selector: '[treeDrag]',
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class TreeDragDirective implements AfterViewInit, DoCheck, OnDestroy {
  @Input('treeDrag') draggedElement;
  @Input() treeDragEnabled;
  private readonly dragEventHandler: (ev: DragEvent) => void;

  constructor(private el: ElementRef, private renderer: Renderer2, private treeDraggedElement: TreeDraggedElement, private ngZone: NgZone) {
    this.dragEventHandler = this.onDrag.bind(this);
  }

  ngAfterViewInit() {
    let el: HTMLElement = this.el.nativeElement;
    this.ngZone.runOutsideAngular(() => {
      el.addEventListener('drag', this.dragEventHandler);
    });
  }

  ngDoCheck() {
    this.renderer.setAttribute(this.el.nativeElement, 'draggable', this.treeDragEnabled ? 'true' : 'false');
  }

  ngOnDestroy() {
    let el: HTMLElement = this.el.nativeElement;
    el.removeEventListener('drag', this.dragEventHandler);
  }

  @HostListener('dragstart', ['$event']) onDragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
    this.treeDraggedElement.set(this.draggedElement);
    if (this.draggedElement.mouseAction) {
      this.draggedElement.mouseAction('dragStart', ev);
    }
  }

  onDrag(ev) {
    if (this.draggedElement.mouseAction) {
      this.draggedElement.mouseAction('drag', ev);
    }
  }

  @HostListener('dragend') onDragEnd() {
    if (this.draggedElement.mouseAction) {
      this.draggedElement.mouseAction('dragEnd');
    }
    this.treeDraggedElement.set(null);
  }
}
