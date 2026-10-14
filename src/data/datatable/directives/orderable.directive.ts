import {
  Directive, Output, EventEmitter, ContentChildren,
  QueryList, KeyValueDiffers, AfterContentInit, OnDestroy, Inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DraggableDirective } from './draggable.directive';
import { DOCUMENT } from "@angular/common";

@Directive({ selector: '[orderable]' })
export class OrderableDirective implements AfterContentInit, OnDestroy {
  @Output() reorder: EventEmitter<any> = new EventEmitter();
  @Output() targetChanged: EventEmitter<any> = new EventEmitter();

  @ContentChildren(DraggableDirective, { descendants: true })
  draggables: QueryList<DraggableDirective>;

  positions: any;
  differ: any;
  lastDraggingIndex: number;
  private draggableSubscriptions = new Map<DraggableDirective, Subscription>();
  private changesSubscription: Subscription;

  constructor(differs: KeyValueDiffers, @Inject(DOCUMENT) private document: any) {
    this.differ = differs.find({}).create();
  }

  ngAfterContentInit(): void {
    // HACK: Investigate Better Way
    this.updateSubscriptions();
    this.changesSubscription = this.draggables.changes.subscribe(this.updateSubscriptions.bind(this));
  }

  ngOnDestroy(): void {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    this.draggableSubscriptions.forEach(sub => sub.unsubscribe());
    this.draggableSubscriptions.clear();
  }

  updateSubscriptions(): void {
    const diffs = this.differ.diff(this.createMapDiffs());

    if (diffs) {
      const subscribe = ({ currentValue, previousValue }: any) => {
        unsubscribe({ previousValue });

        if (currentValue) {
          const sub = new Subscription();
          sub.add(currentValue.dragStart.subscribe(this.onDragStart.bind(this)));
          sub.add(currentValue.dragging.subscribe(this.onDragging.bind(this)));
          sub.add(currentValue.dragEnd.subscribe(this.onDragEnd.bind(this)));
          this.draggableSubscriptions.set(currentValue, sub);
        }
      };

      const unsubscribe = ({ previousValue }: any) => {
        if (previousValue) {
          const sub = this.draggableSubscriptions.get(previousValue);
          if (sub) {
            sub.unsubscribe();
            this.draggableSubscriptions.delete(previousValue);
          }
        }
      };

      diffs.forEachAddedItem(subscribe);
      // diffs.forEachChangedItem(subscribe.bind(this));
      diffs.forEachRemovedItem(unsubscribe);
    }
  }

  onDragStart(): void {
    this.positions = {};

    let i = 0;
    for (const dragger of this.draggables.toArray()) {
      const elm = dragger.element;
      const left = parseInt(elm.offsetLeft.toString(), 0);
      this.positions[dragger.dragModel.prop] = {
        left,
        right: left + parseInt(elm.offsetWidth.toString(), 0),
        index: i++,
        element: elm
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragging({ element, model, event }: any): void {
    const prevPos = this.positions[model.prop];
    const target = this.isTarget(model, event);

    if (target) {
      if (this.lastDraggingIndex !== target.i) {
        this.targetChanged.emit({
          prevIndex: this.lastDraggingIndex,
          newIndex: target.i,
          initialIndex: prevPos.index
        });
        this.lastDraggingIndex = target.i;
      }
    } else if (this.lastDraggingIndex !== prevPos.index) {
      this.targetChanged.emit({
        prevIndex: this.lastDraggingIndex,
        initialIndex: prevPos.index
      });
      this.lastDraggingIndex = prevPos.index;
    }
  }

  onDragEnd({ element, model, event }: any): void {
    const prevPos = this.positions[model.prop];

    const target = this.isTarget(model, event);
    if (target) {
      this.reorder.emit({
        prevIndex: prevPos.index,
        newIndex: target.i,
        model
      });
    }

    this.lastDraggingIndex = undefined;
    element.style.left = 'auto';
  }

  isTarget(model: any, event: any): any {
    let i = 0;
    const x = event.x || event.clientX;
    const y = event.y || event.clientY;
    const targets = this.document.elementsFromPoint(x, y);

    for (const prop in this.positions) {
      // current column position which throws event.
      const pos = this.positions[prop];

      // since we drag the inner span, we need to find it in the elements at the cursor
      if (model.prop !== prop && targets.find((el: any) => el === pos.element)) {
        return {
          pos,
          i
        };
      }

      i++;
    }
  }

  private createMapDiffs(): { [key: string]: DraggableDirective } {
    return this.draggables.toArray().reduce((acc, curr) => {
      acc[curr.dragModel.$$id] = curr;
      return acc;
    }, {});
  }
}
