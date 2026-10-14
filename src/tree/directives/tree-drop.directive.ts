import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2
} from '@angular/core';
import { TreeDraggedElement } from '../models/';

const DRAG_OVER_CLASS = 'is-dragging-over';
const DRAG_DISABLED_CLASS = 'is-dragging-over-disabled';

@Directive({
  selector: '[treeDrop]',
  
})
export class TreeDropDirective implements AfterViewInit, OnDestroy {
  @Input() allowDragoverStyling = true;
  @Output('treeDrop') onDropCallback = new EventEmitter();
  @Output('treeDropDragOver') onDragOverCallback = new EventEmitter();
  @Output('treeDropDragLeave') onDragLeaveCallback = new EventEmitter();
  @Output('treeDropDragEnter') onDragEnterCallback = new EventEmitter();
  private readonly dragOverEventHandler: (ev: DragEvent) => void;
  private readonly dragEnterEventHandler: (ev: DragEvent) => void;
  private readonly dragLeaveEventHandler: (ev: DragEvent) => void;
  private unlisteners: Array<() => void> = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _allowDrop = (element, $event) => true;

  @Input() set treeAllowDrop(allowDrop) {
    if (allowDrop instanceof Function) {
      this._allowDrop = allowDrop;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    else this._allowDrop = (element, $event) => allowDrop;
  }

  allowDrop($event) {
    return this._allowDrop(this.treeDraggedElement.get(), $event);
  }

  constructor(private el: ElementRef, private renderer: Renderer2, private treeDraggedElement: TreeDraggedElement, private ngZone: NgZone) {
    this.dragOverEventHandler = this.onDragOver.bind(this);
    this.dragEnterEventHandler = this.onDragEnter.bind(this);
    this.dragLeaveEventHandler = this.onDragLeave.bind(this);
  }

  ngAfterViewInit() {
    let el: HTMLElement = this.el.nativeElement;
    this.ngZone.runOutsideAngular(() => {
      this.unlisteners.push(
        this.renderer.listen(el, 'dragover', this.dragOverEventHandler),
        this.renderer.listen(el, 'dragenter', this.dragEnterEventHandler),
        this.renderer.listen(el, 'dragleave', this.dragLeaveEventHandler),
      );
    });
  }

  ngOnDestroy() {
    this.unlisteners.forEach(unlisten => unlisten());
    this.unlisteners = [];
  }

  onDragOver($event) {

    if (!this.allowDrop($event)) {
      if (this.allowDragoverStyling) {
        return this.addDisabledClass();
      }
      return;
    }
    this.onDragOverCallback.emit({event: $event, element: this.treeDraggedElement.get()});
    $event.preventDefault();
    if (this.allowDragoverStyling) {
      this.addClass();
    }
  }

  onDragEnter($event) {

    if (!this.allowDrop($event)) return;
    $event.preventDefault();
    this.onDragEnterCallback.emit({event: $event, element: this.treeDraggedElement.get()});
  }

  onDragLeave($event) {
    if (!this.allowDrop($event)) {
      if (this.allowDragoverStyling) {
        return this.removeDisabledClass();
      }
      return;
    }
    this.onDragLeaveCallback.emit({event: $event, element: this.treeDraggedElement.get()});

    if (this.allowDragoverStyling) {
      this.removeClass();
    }
  }

  @HostListener('drop', ['$event']) onDrop($event) {
    if (!this.allowDrop($event)) return;
    $event.preventDefault();
    this.onDropCallback.emit({event: $event, element: this.treeDraggedElement.get()});
    if (this.allowDragoverStyling) {
      this.removeClass();
    }
    this.treeDraggedElement.set(null);
  }

  private addClass() {
    this.renderer.addClass(this.el.nativeElement, DRAG_OVER_CLASS);
  }

  private removeClass() {
    this.renderer.removeClass(this.el.nativeElement, DRAG_OVER_CLASS);
  }

  private addDisabledClass() {
    this.renderer.addClass(this.el.nativeElement, DRAG_DISABLED_CLASS);
  }

  private removeDisabledClass() {
    this.renderer.removeClass(this.el.nativeElement, DRAG_DISABLED_CLASS);
  }
}
