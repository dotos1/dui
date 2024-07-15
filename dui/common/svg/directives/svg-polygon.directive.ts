
import { Directive, Input, Output, AfterViewChecked, EventEmitter, OnDestroy, OnChanges, ElementRef } from '@angular/core';
import { Polygon, PointArrayAlias } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

@Directive({
  selector: 'svg-polygon'
})
export class SvgPolygonDirective implements AfterViewChecked, OnChanges, OnDestroy {

  private _polygon: Polygon;
  @Input() points: PointArrayAlias; 
  @Input() borderSize: number; 
  @Input() borderColor = '#000'; 
  @Input() fill = '#000'; 
  @Input() classes: string[] = []; 
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Polygon> = new EventEmitter();

  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  ngAfterViewChecked(): void {
    if (this._svgContainer.getContainer() && !this._polygon) {
      this.createPolygon();
    }
  }

  ngOnDestroy(): void {
    this._polygon.remove();
  }

  ngOnChanges(changes: any): void {
    if (this._polygon) {
      this.updatePolygon();
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
  private updatePolygon(): void {
    this._polygon
      .plot(this.points) 
      .fill(this.fill) 
      .stroke({ color: this.borderColor, width: this.borderSize });
    this.setCorrectPosition();
  }
  private createPolygon(): void {
    this._polygon = this._svgContainer.getContainer()
      .polygon(this.points)
      .fill(this.fill) 
      .stroke({ color: this.borderColor, width: this.borderSize })
      .on('click', (evt: any) => this.clickEvent.emit(evt)) 
      .on('dblclick', (evt: any) => this.doubleClickEvent.emit(evt)) 
      .on('mouseover', (evt: any) => this.mouseOverEvent.emit(evt))
      .on('mouseout', (evt: any) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();  
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._polygon);
  }

  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._polygon.position() !== position) {
      this._polygon.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._polygon
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._polygon
        .addClass(classToAdd);
    }
  }
}
