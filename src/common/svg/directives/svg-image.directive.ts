
import { Directive, Input, Output, AfterViewChecked, OnDestroy, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { Image } from '@svgdotjs/svg.js';
import { SvgContainerComponent } from '../components/svg-container.component';

@Directive({
  selector: 'svg-image'
})
export class SvgImageDirective implements AfterViewChecked, OnDestroy, OnChanges {

  private _image: Image;

  @Input() imageUrl: string; // Path to the image for SVG image.
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() height = 100; // Height of the image.
  @Input() width = 100; // Width of the image.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  @Output() clickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Image> = new EventEmitter();

  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  ngAfterViewChecked(): void {
    // Check if container is created and no image object is created
    if (this._svgContainer.getContainer() && !this._image) {
      this.createImage();
    }
  }

  ngOnDestroy(): void {
    this._image.remove();
  }

  ngOnChanges(changes: any): void {
    // Make sure we check it only when image is initialized
    if (this._image) {
      // Update image also in case image url has changed
      if (changes.imageUrl && changes.imageUrl.currentValue !== changes.imageUrl.previousValue) {
        // Update image properties and image itself
        this.updateImage(true);
      } else if (
        (changes.x && changes.x.currentValue !== changes.x.previousValue) ||
        (changes.y && changes.y.currentValue !== changes.y.previousValue) ||
        (changes.width && changes.width.currentValue !== changes.width.previousValue) ||
        (changes.height && changes.height.currentValue !== changes.height.previousValue)
      ) {
        // Update only image properties
        this.updateImage(false);
      }

      // Check if classes were changed
      if (changes.classes && changes.classes.currentValue !== changes.classes.previousValue) {
        // Get classes that needs to be removed
        const classesToRemove = changes.classes.previousValue.filter((previousClass: string) =>
          !changes.classes.currentValue.some((currentClass: string) => currentClass === previousClass)
        );

        // Get classes that needs to be added
        const classesToAdd = changes.classes.currentValue.filter((currentClass: string) =>
          !changes.classes.previousValue.some((previousClass: string) => currentClass === previousClass)
        );

        // Add and remove classes
        this.addRemoveClasses(classesToAdd, classesToRemove);
      }
    }
  }
  private updateImage(reloadImage: boolean): void {
    if (reloadImage) {
      this._image
        .load(this.imageUrl) 
        .size(this.width, this.height) 
        .move(this.x, this.y); 
    } else { 
      this._image
        .size(this.width, this.height) 
        .move(this.x, this.y); 
    }
    this.setCorrectPosition();
  }
  private createImage(): void {
    this._image = this._svgContainer.getContainer()
      .image() 
      .load(this.imageUrl) 
      .size(this.width, this.height) 
      .move(this.x, this.y) 
      .on('click', (evt: any) => this.clickEvent.emit(evt))
      .on('dblclick', (evt: any) => this.doubleClickEvent.emit(evt))
      .on('mouseover', (evt: any) => this.mouseOverEvent.emit(evt)) 
      .on('mouseout', (evt: any) => this.mouseOutEvent.emit(evt)); 
    this.setCorrectPosition();
    this.addRemoveClasses(this.classes);
    this.onInitialize.emit(this._image);
  }

  private setCorrectPosition() {
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);
    if (this._svgContainer.getContainer().get(position) && this._image.position() !== position) {
      this._image.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    for (const classToRemove of classesToRemove) {
      this._image
        .removeClass(classToRemove);
    }
    for (const classToAdd of classesToAdd) {
      this._image
        .addClass(classToAdd);
    }
  }
}
