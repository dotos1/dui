
import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';

import { SVG, Container, Pattern, Rect } from '@svgdotjs/svg.js';

@Component({
  selector: 'svg-container',
  templateUrl: 'svg-container.component.html',
  styleUrls: ['./svg-container.component.css']
})
export class SvgContainerComponent implements AfterViewInit, OnChanges {
  public pointXCoordinate: number;
  public pointYCoordinate: number;
  public mouseInContainer = false;
  private _svg: Container;
  private _grid: Rect;
  private _pattern: Pattern;
  private _triggerCoordinateChange = false;
  private _singleClickHappened: boolean;

  @Input() public containerId: string; // Container id which will be used to create the container.
  @Input() public height = 200; // Height of the container.
  @Input() public showGrid = false; // Indicator if grid image should be shown in the background of svg container.
  @Input() public grid: {
    width: number;
    height: number;
    strokeColor: string;
  } = {
    width: 10,
    height: 10,
    strokeColor: 'black'
  }; 
  @Input() public hoverable = false;
  @Input() public pointSize = 10; 
  @Input() public viewBox: number[] = []; // Viewbox of the container, must be an array consisting of 4 integers [x, y, width, height].

  @Output() public clickEvent: EventEmitter<{ x: number, y: number }>
    = new EventEmitter(); // Event handler for retrieving coordinates at clicked position
  @Output() public doubleClickEvent: EventEmitter<{ x: number, y: number }>
    = new EventEmitter(); // Event handler for retrieving coordinates at position where you double-click.
  @Output() public mouseOverEvent: EventEmitter<MouseEvent> = new EventEmitter(); // Event handler when mouse is moved over the container.
  @Output() public mouseOutEvent: EventEmitter<MouseEvent> = new EventEmitter(); // Event handler when the mouse exits the container.
  @Output() public mouseMoveEvent: EventEmitter<{ x: number, y: number }> = new EventEmitter();
    // Event handler when the mouse is being moved on the container.
  @Output() public onInitialize: EventEmitter<Container> = new EventEmitter();

  /**
   * Create SVG Container component instance.
   * @param cdRef - Change Detector Ref object instance.
   */
  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: any): void {
    if (this._svg) {
      if (changes.viewBox && changes.viewBox.currentValue !== changes.viewBox.previousValue) {
        this.viewBox = changes.viewBox.currentValue;
        this.updateViewbox();
      }
      if (changes.height && changes.height.currentValue !== changes.height.previousValue) {
        this.height = changes.height.currentValue;
        this._svg.size('100%', this.height);
      }
      if (changes.showGrid || changes.grid) {
        this.grid = changes.grid ? changes.grid.currentValue : this.grid;
        this.showGrid = changes.showGrid ? changes.showGrid.currentValue : this.showGrid;
        this.setGridPattern();
      }
      if (
        changes.hoverable && changes.hoverable.currentValue !== changes.hoverable.previousValue ||
        changes.pointSize && changes.pointSize.currentValue !== changes.pointSize.previousValue
      ) {
        this.hoverable = changes.hoverable ? changes.hoverable.currentValue : this.hoverable;
        this.pointSize = changes.pointSize ? changes.pointSize.currentValue : this.pointSize;
        this.cdRef.detectChanges();
      }
    }
  }

  ngAfterViewInit(): void {
    this.setContainer(this.containerId);
  }
  getContainer(): Container {
    return this._svg;
  }
  adjustPointPosition(event: MouseEvent): void {
    if (!this.hoverable) {
      return;
    }
    if (this._triggerCoordinateChange) {
      this.pointXCoordinate = event.offsetX - this.pointSize / 2;
      this.pointYCoordinate = event.offsetY - this.pointSize / 2;
    }
    this._triggerCoordinateChange = true;
  }
  adjustMouseMovePosition(event: MouseEvent): void {
    if (this.hoverable && this._triggerCoordinateChange) {
      this.mouseMoveEvent.emit({
        x: this.pointXCoordinate + this.pointSize / 2,
        y: this.pointYCoordinate + this.pointSize / 2
      });
    } else if (!this.hoverable) {
      this.mouseMoveEvent.emit({
        x: event.offsetX,
        y: event.offsetY
      });
    }
  }
  onPointClick(): void {
    this._singleClickHappened = true;
    const x = this.pointXCoordinate + this.pointSize / 2;
    const y = this.pointYCoordinate + this.pointSize / 2;
    setTimeout(() => {
      if (this._singleClickHappened) {
        this.clickEvent.emit({ x, y });
      }
    }, 250);
  }
  onPointDoubleClick(): void {
    this.doubleClickEvent.emit({
      x: this.pointXCoordinate + this.pointSize / 2,
      y: this.pointYCoordinate + this.pointSize / 2
    });
    this._singleClickHappened = false;
  }
  onPointHover(): void {
    this._triggerCoordinateChange = false;
  }
  private updateViewbox(): void {
    if (this.viewBox.length === 4) {
      this._svg.viewbox(this.viewBox[0], this.viewBox[1], this.viewBox[2], this.viewBox[3]);
    } else {
      this._svg.viewbox();
    }
  }

  private setContainer(id: string): void {
    if (this.viewBox && this.viewBox.length === 4) {
      this._svg = SVG()
        .addTo(`#${id}`)
        .size('100%', this.height)
        .viewbox(this.viewBox[0], this.viewBox[1], this.viewBox[2], this.viewBox[3]);
    } else {
      this._svg = SVG()
        .addTo(`#${id}`)
        .size('100%', this.height);
    }
    if (this.showGrid) {
      this.setGridPattern();
    }
    this.onInitialize.emit(this._svg);
  }

  /**
   * Does all required pre-requisites and initializes or updates grid pattern.
   */
  private setGridPattern(): void {
    // Let's remove old pattern if we have created one
    if (this._pattern) {
      this._pattern.remove();
    }

    // Let's remove old grid if we have created one
    if (this._grid) {
      this._grid.remove();
    }

    // Let's check if we want to show grid
    if (this.showGrid) {
      // Let's create the pattern
      this._pattern = this._svg
        .pattern(
          this.grid.width,
          this.grid.height,
          (addedPattern: Pattern) => {
            addedPattern
              .rect(this.grid.width, this.grid.height)
              .fill('transparent')
              .stroke(this.grid.strokeColor);
          }
        );
      this._grid = this._svg
        .rect()
        .size('100%', '100%')
        .fill(this._pattern);
    }
  }
}
