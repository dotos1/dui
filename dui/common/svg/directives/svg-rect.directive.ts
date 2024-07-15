
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, ElementRef } from '@angular/core';
import { Rect } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

@Directive({
  selector: 'svg-rect'
})
export class SvgRectDirective implements AfterViewChecked, OnChanges, OnDestroy {

  private _rect: Rect;
  @Input() height: number; 
  @Input() width: number; 
  @Input() color = '#000'; 
  @Input() x = 0; 
  @Input() y = 0; 
  @Input() rx = 0; 
  @Input() ry = 0; 
  @Input() classes: string[] = []; 

  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Rect> = new EventEmitter();

  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) {}

  ngAfterViewChecked(): void {
    if (this._svgContainer.getContainer() && !this._rect) {
      this.createRect();
    }
  }

  ngOnDestroy(): void {
    this._rect.remove();
  }

  ngOnChanges(changes: any): void {
    if (this._rect) {
      this.updateRect();
      if (changes.classes && changes.classes.currentValue !== changes.classes.previousValue) {
        const classesToRemove = changes.classes.previousValue.filter((previousClass: string) =>
          !changes.classes.currentValue.some((currentClass: string) => currentClass === previousClass)
        );
        const classesToAdd = changes.classes.currentValue.filter((currentClass: string) =>
          !changes.classes.previousValue.some((previousClass: string) => currentClass === previousClass)
        );
        this.addRemoveClasses(classesToAdd, classesToRemove);
      }
    }
  }

  private updateRect(): void {
    this._rect
      .size(this.width, this.height) 
      .fill(this.color) 
      .radius(this.rx, this.ry) 
      .move(this.x, this.y); 
    this.setCorrectPosition();
  }

  private createRect(): void {
    this._rect = this._svgContainer.getContainer()
      .rect(this.width, this.height) 
      .fill(this.color) 
      .move(this.x, this.y) 
      .radius(this.rx, this.ry) 
      .on('click', (evt: any) => this.clickEvent.emit(evt)) 
      .on('dblclick', (evt: any) => this.doubleClickEvent.emit(evt))
      .on('mouseover', (evt: any) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: any) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._rect);
  }

  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._rect.position() !== position) {
      this._rect.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._rect
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._rect
        .addClass(classToAdd);
    }
  }
}
