
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, ElementRef } from '@angular/core';
import { Ellipse } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

@Directive({
  selector: 'svg-ellipse'
})
export class SvgEllipseDirective implements AfterViewChecked, OnChanges, OnDestroy {

  private _ellipse: Ellipse;

  @Input() height: number; 
  @Input() width: number; 
  @Input() color = '#000';
  @Input() x = 0; 
  @Input() y = 0; 
  @Input() classes: string[] = []; 

  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Ellipse> = new EventEmitter();

  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  ngAfterViewChecked(): void {
    if (this._svgContainer.getContainer() && !this._ellipse) {
      this.createEllipse();
    }
  }

  ngOnDestroy(): void {
    this._ellipse.remove();
  }

  ngOnChanges(changes: any): void {
    if (this._ellipse) {
      this.updateEllipse();
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

  private updateEllipse(): void {
    this._ellipse
      .size(this.width, this.height)
      .fill(this.color) 
      .attr('cx', +this.x + +this.width / 2) 
      .attr('cy', +this.y + +this.height / 2); 
    this.setCorrectPosition();
  }

  private createEllipse(): void {
    this._ellipse = this._svgContainer.getContainer()
      .ellipse(this.width, this.height) 
      .fill(this.color) 
      .attr('cx', +this.x + +this.width / 2) 
      .attr('cy', +this.y + +this.height / 2) 
      .on('click', (evt: any) => {
        this.clickEvent.emit(evt);
      })
      .on('dblclick', (evt: any) => this.doubleClickEvent.emit(evt))
      .on('mouseover', (evt: any) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: any) => this.mouseOutEvent.emit(evt));
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._ellipse);
  }

  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._ellipse.position() !== position) {
      this._ellipse.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._ellipse
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._ellipse
        .addClass(classToAdd);
    }
  }
}
