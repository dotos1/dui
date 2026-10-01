
import { Directive, Input, Output, EventEmitter, OnDestroy, AfterViewChecked, OnChanges, ElementRef } from '@angular/core';
import { Path } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

@Directive({
  selector: 'svg-path'
})
export class SvgPathDirective implements AfterViewChecked, OnChanges, OnDestroy {
  private _path: Path;

  @Input() path = ''; 
  @Input() borderColor = '#000'; 
  @Input() borderSize = 2; 
  @Input() x = 0; 
  @Input() y = 0;
  @Input() fill = ''; 
  @Input() classes: string[] = []; 

  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Path> = new EventEmitter();

  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  ngAfterViewChecked(): void {
    if (this._svgContainer.getContainer() && !this._path) {
      this.createPath();
    }
  }

  ngOnDestroy(): void {
    this._path.remove();
  }

  ngOnChanges(changes: any): void {
    if (this._path) {
      this.updatePath();
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

  private updatePath(): void {
    this._path
      .plot(this.path) 
      .stroke({ color: this.borderColor, width: this.borderSize }) 
      .fill(this.fill || 'rgba(0, 0, 0, 0)') 
      .move(this.x, this.y); 
    this.setCorrectPosition();
  }

  private createPath(): void {
    this._path = this._svgContainer.getContainer()
      .path(this.path) 
      .stroke({ color: this.borderColor, width: this.borderSize })
      .fill(this.fill || 'rgba(0, 0, 0, 0)')
      .move(this.x, this.y) 
      .on('click', (evt: any) => this.clickEvent.emit(evt)) 
      .on('dblclick', (evt: any) => this.doubleClickEvent.emit(evt)) 
      .on('mouseover', (evt: any) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: any) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._path);
  }
  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._path.position() !== position) {
      this._path.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._path
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._path
        .addClass(classToAdd);
    }
  }
}
