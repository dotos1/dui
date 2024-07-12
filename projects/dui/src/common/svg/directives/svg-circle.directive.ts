/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, EventEmitter, OnDestroy, AfterViewChecked, OnChanges, ElementRef } from '@angular/core';
import { Circle } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

@Directive({
  selector: 'svg-circle'
})
export class SvgCircleDirective implements AfterViewChecked, OnChanges, OnDestroy {
  private _circle: Circle;
  @Input() diameter: number; 
  @Input() color = '#000'; 
  @Input() x = 0; 
  @Input() y = 0; 
  @Input() classes: string[] = []; 

  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Circle> = new EventEmitter();

  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  ngAfterViewChecked(): void {
    if (this._svgContainer.getContainer() && !this._circle) {
      this.createCircle();
    }
  }

  ngOnDestroy(): void {
    this._circle.remove();
  }

  ngOnChanges(changes: any): void {
    if (this._circle) {
      this.updateCircle();
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
  private updateCircle(): void {
    this._circle
      .size(this.diameter) 
      .fill(this.color) 
      .attr('cx', +this.x + +this.diameter / 2) 
      .attr('cy', +this.y + +this.diameter / 2); 
    this.setCorrectPosition();
  }
  private createCircle(): void {
    this._circle = this._svgContainer.getContainer()
      .circle(this.diameter)
      .fill(this.color) 
      .attr('cx', +this.x + +this.diameter / 2) 
      .attr('cy', +this.y + +this.diameter / 2) 
      .on('click', (evt: any) => this.clickEvent.emit(evt)) 
      .on('dblclick', (evt: any) => this.doubleClickEvent.emit(evt)) 
      .on('mouseover', (evt: any) => this.mouseOverEvent.emit(evt))
      .on('mouseout', (evt: any) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._circle);
  }

  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._circle.position() !== position) {
      this._circle.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._circle
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._circle
        .addClass(classToAdd);
    }
  }
}
