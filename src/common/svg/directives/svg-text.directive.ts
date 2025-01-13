
import { Directive, Input, Output, EventEmitter, OnDestroy, AfterViewChecked, OnChanges, ElementRef } from '@angular/core';
import { Text } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

@Directive({
  selector: 'svg-text'
})
export class SvgTextDirective implements AfterViewChecked, OnChanges, OnDestroy {
  private _text: Text;

  @Input() color = '#000'; 
  @Input() text = ''; 
  @Input() x = 0; 
  @Input() y = 0; 
  @Input() size = 10; 
  @Input() classes: string[] = []; 

  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Text> = new EventEmitter();


  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  ngAfterViewChecked(): void {
    if (this._svgContainer.getContainer() && !this._text) {
      this.createText();
    }
  }

  ngOnDestroy(): void {
    this._text.remove();
  }

  ngOnChanges(changes: any): void {
    if (this._text) {
      this.updateText();
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
  private updateText(): void {
    this._text
      .text(this.text) 
      .fill(this.color) 
      .font({
        size: this.size 
      })
      .move(this.x, this.y); 
    this.setCorrectPosition();
  }
  private createText(): void {
    this._text = this._svgContainer.getContainer()
      .text(this.text) 
      .fill(this.color) 
      .font({
        size: this.size 
      })
      .move(this.x, this.y)
      .on('click', (evt: any) => this.clickEvent.emit(evt)) 
      .on('dblclick', (evt: any) => this.doubleClickEvent.emit(evt)) 
      .on('mouseover', (evt: any) => this.mouseOverEvent.emit(evt))
      .on('mouseout', (evt: any) => this.mouseOutEvent.emit(evt)); 

    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._text);
  }

  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._text.position() !== position) {
      this._text.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._text
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._text
        .addClass(classToAdd);
    }
  }
}
