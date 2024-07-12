
import { Directive, Input, Output, AfterViewChecked, OnDestroy, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { Line } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

@Directive({
  selector: 'svg-line'
})
export class SvgLineDirective implements AfterViewChecked, OnChanges, OnDestroy {
  private _line: Line;
  @Input() borderSize: number; 
  @Input() borderColor = '#000'; 
  @Input() x0 = 0; 
  @Input() y0 = 0; 
  @Input() x1 = 1; 
  @Input() y1 = 1; 
  @Input() classes: string[] = []; 
  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Line> = new EventEmitter();

  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  ngAfterViewChecked(): void {
    if (this._svgContainer.getContainer() && !this._line) {
      this.createLine();
    }
  }

  ngOnDestroy(): void {
    this._line.remove();
  }

  ngOnChanges(changes: any): void {
    if (this._line) {
      this.updateLine();
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
  private updateLine(): void {
    this._line
      .plot(this.x0, this.y0, this.x1, this.y1) 
      .stroke({ color: this.borderColor, width: this.borderSize }); 
    this.setCorrectPosition();
  }
  private createLine(): void {
    this._line = this._svgContainer.getContainer()
      .line(this.x0, this.y0, this.x1, this.y1)
      .stroke({ color: this.borderColor, width: this.borderSize }) 
      .on('click', (evt: any) => this.clickEvent.emit(evt)) 
      .on('dblclick', (evt: any) => this.doubleClickEvent.emit(evt)) 
      .on('mouseover', (evt: any) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: any) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._line);
  }
  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._line.position() !== position) {
      this._line.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }
  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._line
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._line
        .addClass(classToAdd);
    }
  }
}
