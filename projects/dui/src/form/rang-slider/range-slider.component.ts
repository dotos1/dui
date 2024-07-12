import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import {coerceBooleanProperty, coerceNumberProperty} from '@angular/cdk/coercion';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CanDisable, mixinColor, mixinDisableRipple} from '@angular/material/core';
import {Subscription} from 'rxjs';

export const MAT_SLIDER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RangeSlider),
  multi: true,
};


const _MatSliderMixinBase = mixinColor(
  mixinDisableRipple(
    class {
      constructor(public _elementRef: ElementRef<HTMLElement>) {}
    },
  ),
  'primary',
);

interface RangeSliderValue {
  min: number;
  max: number;
}


export class RangeSliderChange {

  source!: RangeSlider;

  minValue!: number|null;

  maxValue!: number|null;
}


@Component({
  preserveWhitespaces: false,
  selector: 'range-slider',
  exportAs: 'RangeSlider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  inputs: ['disabled', 'color', 'tabIndex'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MAT_SLIDER_VALUE_ACCESSOR],
  host: {
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(mouseenter)': 'onMouseEnter()',
    '(slide)': 'onSlide($event)',
    '(slideend)': 'onSlideEnd()',
    '(slidestart)': 'onSlideStart($event)',
    'class': 'mat-slider mat-slider-horizontal',
    'role': 'slider',
    '[tabIndex]': 'tabIndex',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuenow]': 'value',
    '[attr.aria-valuenowmin]': 'minValue',
    '[attr.aria-valuenowmax]': 'maxValue',
    '[attr.aria-orientation]': '"horizontal"',
    '[class.mat-slider-disabled]': 'disabled',
    '[class.mat-slider-sliding]': 'isSliding',
    '[class.mat-slider-thumb-label-showing]': 'thumbLabel',
    '[class.mat-slider-min-value]': 'isStartValue',
    style: 'flex:1;display:flex;flex-direction:row;width:100%'
  }
})
export class RangeSlider extends _MatSliderMixinBase implements  OnInit, OnDestroy, CanDisable, ControlValueAccessor {

  private clickedPoint?: 'min'|'max';

  private focusSubscription: Subscription;


  private dimensions: ClientRect|null = null;

  private roundToDecimal = 1;

  private controlValueAccessorChangeFn:
      (value: RangeSliderValue) => void = () => {};


  private onTouched: () => any = () => {};


  @ViewChild('sliderWrapper') private sliderWrapper!: ElementRef;

  get percentValue(): RangeSliderValue {
    return this.percentValueInt;
  }
  private percentValueInt: RangeSliderValue = {'min': 0, 'max': 1};


  @Input()
  get thumbLabel(): boolean {
    return this.thumbLabelInt;
  }
  set thumbLabel(value: boolean) {
    this.thumbLabelInt = coerceBooleanProperty(value);
  }
  private thumbLabelInt = false;


  @Input()
  get max(): number {
    return this.maxInt;
  }
  set max(v: number) {
    this.maxInt = coerceNumberProperty(v, this.maxInt);

    if (this.maxValueInt === null) {
      this.maxValue = this.maxInt;
    }
    if (this.minValue && this.maxValue) {
      this.percentValueInt =
          this.calculatePercentage({min: this.minValue, max: this.maxValue});
    }
    this.changeDetectorRef.markForCheck();
  }
  private maxInt = 100;


  @Input()
  get min(): number {
    return this.minInt;
  }
  set min(v: number) {
    this.minInt = coerceNumberProperty(v, this.minInt);
    if (this.minValueInt === null) {
      this.minValue = this.minInt;
    }
    if (this.minValue && this.maxValue) {
      this.percentValueInt =
          this.calculatePercentage({min: this.minValue, max: this.maxValue});
    }
    this.changeDetectorRef.markForCheck();
  }
  private minInt = 0;

  @Input()
  get step(): number {
    return this.stepInt;
  }
  set step(v: number) {
    this.stepInt = coerceNumberProperty(v, this.stepInt);

    if (this.stepInt % 1 !== 0) {
      this.roundToDecimal = this.stepInt.toString().split('.').pop().length;
    }
    this.changeDetectorRef.markForCheck();
  }
  private stepInt = 1;


  @Input()
  get minValue(): number|null {
    if (this.minValueInt === null) {
      this.minValue = this.min;
    }
    return this.minValueInt;
  }
  set minValue(v: number|null) {
    if (v !== this.minValueInt) {
      this.minValueInt =
          parseFloat(coerceNumberProperty(v).toFixed(this.roundToDecimal));
      this.percentValueInt = this.calculatePercentage(
          {min: this.minValueInt, max: this.maxValueInt});
      this.changeDetectorRef.markForCheck();
    }
  }
  private minValueInt: number|null = null;

  @Input()
  get maxValue(): number|null {
    if (this.maxValueInt === null) {
      this.maxValue = this.max;
    }
    return this.maxValueInt;
  }
  set maxValue(v: number|null) {
    if (v !== this.maxValueInt) {
      this.maxValueInt =
          parseFloat(coerceNumberProperty(v).toFixed(this.roundToDecimal));
      this.percentValueInt = this.calculatePercentage(
          {min: this.minValueInt, max: this.maxValueInt});
      this.changeDetectorRef.markForCheck();
    }
  }
  private maxValueInt: number|null = null;


  @Input() displayWith?: (value: number|null) => string | number;

  @Input()   disabled=false;


  @Output() readonly change = new EventEmitter<RangeSliderChange>();


  @Output() readonly input = new EventEmitter<RangeSliderChange>();


  get minDisplayValue(): string|number {
    if (this.displayWith) {
      return this.displayWith(this.minValue);
    }
    if (this.roundToDecimal && this.minValue && this.minValue % 1 !== 0) {
      return this.minValue.toFixed(this.roundToDecimal);
    }
    return this.minValue || this.min;
  }

  /** The maximum value to be used for display purposes. */
  get maxDisplayValue(): string|number {
    if (this.displayWith) {
      return this.displayWith(this.maxValue);
    }

    if (this.roundToDecimal && this.maxValue && this.maxValue % 1 !== 0) {
      return this.maxValue.toFixed(this.roundToDecimal);
    }

    return this.maxValue || this.max;
  }

  /** Whether the slider is at its start init value. */
  get isStartValue() {
    return this.percentValue.min === 0 && this.percentValue.max === 1;
  }


  isActive = false;


  isSliding = false;

  /** CSS styles for the track fill element. */
  get trackFillStyles(): {[key: string]: string} {
    const translate = Math.round(this.percentValue.min * 100);
    const scale = (1 - this.percentValue.min) - (1 - this.percentValue.max);

    return {transform: `translateX(${translate}%) scale3d(${scale},1,1)`};
  }

  constructor(
      readonly elementRef: ElementRef,
      private readonly focusMonitor: FocusMonitor,
      private readonly changeDetectorRef: ChangeDetectorRef) {
    super(elementRef);
  }


  ngOnInit() {
    this.focusSubscription =
        this.focusMonitor.monitor(this.elementRef.nativeElement, true)
            .subscribe((origin: FocusOrigin) => {
              this.isActive = !!origin && origin !== 'keyboard';
              this.changeDetectorRef.detectChanges();
            });
  }


  ngOnDestroy() {
    if( this.focusSubscription){
      this.focusSubscription.unsubscribe();
    }
     this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  onFocus() {
    this.dimensions = this.getSliderDimensions();
  }

  onBlur() {
    this.onTouched();
  }

  onMouseDown(point: 'min'|'max') {
    this.clickedPoint = point;
  }

  onMouseEnter() {
    if (this.disabled) {
      return;
    }
    this.dimensions = this.getSliderDimensions();
  }

  onTrackClick(event: MouseEvent) {
    if (this.disabled) {
      return;
    }
    const oldMinValue = this.minValue;
    const oldMaxValue = this.maxValue;

    this.updateValueFromPosition(
        this.clickedPoint, {x: event.clientX, y: event.clientY});

    this.clickedPoint = undefined;
    this.isSliding = false;

    // Emit a change and input event if any value changed.
    if ((oldMinValue !== this.minValue) || (oldMaxValue !== this.maxValue)) {
      this.emitInputEvent();
      this.emitChangeEvent();
    }
  }

  onRingClick(event: MouseEvent, point: 'min'|'max') {
    if (this.disabled) {
      return;
    }
    this.clickedPoint = point;
  }

  onSlide(event: any) {
    if (this.disabled) {
      return;
    }
    if (!this.isSliding) {
      this.onSlideStart(null);
    }
    event.preventDefault();
    const oldMinValue = this.minValue;
    const oldMaxValue = this.maxValue;
    this.updateValueFromPosition(
        this.clickedPoint, {x: event.center.x, y: event.center.y});
    if ((oldMinValue !== this.minValue) || (oldMaxValue !== this.maxValue)) {
      this.emitInputEvent();
      this.emitChangeEvent();
    }
  }

  onSlideStart(event: any) {
    if (this.disabled || this.isSliding) {
      return;
    }
    this.onMouseEnter();
    this.isSliding = true;
    if (event) {
      const oldMinValue = this.minValue;
      const oldMaxValue = this.maxValue;
      this.updateValueFromPosition(
          this.clickedPoint, {x: event.center.x, y: event.center.y});
      if ((oldMinValue !== this.minValue) || (oldMaxValue !== this.maxValue)) {
        this.emitInputEvent();
        this.emitChangeEvent();
      }
      event.preventDefault();
    }
  }

  onSlideEnd() {
    this.isSliding = false;
  }
  trackBackgroundStyles(point: 'min'|'max'): {[key: string]: string} {
    const percentValue = this.percentValue[point];
    const percentRestValue = 1 - percentValue;
    const value = Math.round(percentValue * 100);
    const restValue = 100 - value;
    const translate = point === 'min' ? -restValue : 0;
    const scale = point === 'min' ? percentValue : percentRestValue;
    return {transform: `translateX(${translate}%) scale3d(${scale},1,1)`};
  }

  thumbContainerStyles(point: 'min'|'max'): {[key: string]: string} {
    const offset = (1 - this.percentValue[point]) * 100;
    return {'transform': `translateX(-${offset}%)`};
  }

  thumbContainerClasses(point: 'min'|'max'): string[] {
    const res: string[] = [];

    if (this.clickedPoint && this.clickedPoint === point) {
      res.push('active');
    }
    return res;
  }

  /** Calculates the percentage of the slider that a value is. */
  private calculatePercentage(value: RangeSliderValue): RangeSliderValue {
    return {
      min: ((value.min || 0) - this.min) / (this.max - this.min),
      max: ((value.max || 0) - this.min) / (this.max - this.min),
    };
  }

  /** Calculates the value a percentage of the slider corresponds to. */
  private calculateValue(percentage: number) {
    return this.min + percentage * (this.max - this.min);
  }


  private updateValueFromPosition(
      valueType: 'min'|'max'|undefined, pos: {x: number, y: number}) {
    const updateValue = (type: 'min'|'max', val: number) => {
      if (type === 'min') {
        this.minValue = val < this.maxValue? val : this.maxValue;
      } else if (type === 'max') {
        this.maxValue = val > this.minValue? val : this.minValue;
      }
    };

    if (!this.dimensions || !valueType) {
      return;
    }

    const offset = this.dimensions.left;
    const size = this.dimensions.width;
    const posComponent = pos.x;

    const percent = RangeSlider.clamp((posComponent - offset) / size);

    if (percent === 0) {
      updateValue(valueType, this.min);
    } else if (percent === 1) {
      updateValue(valueType, this.max);
    } else {
      const exactValue = this.calculateValue(percent);

      const closestValue =
          Math.round((exactValue - this.min) / this.step) * this.step +
          this.min;
      updateValue(
          valueType, RangeSlider.clamp(closestValue, this.min, this.max));
    }
  }

  /**
   * Get the bounding client rect of the slider track element.
   * The track is used rather than the native element to ignore the extra space
   * that the thumb can take up.
   */
  private getSliderDimensions() {
    return this.sliderWrapper ?
        this.sliderWrapper.nativeElement.getBoundingClientRect() :
        null;
  }

  /** Return a number between two numbers. */
  private static clamp(value: number, min = 0, max = 1) {
    return Math.max(min, Math.min(value, max));
  }

  /**
   * Emits a change event if the current values is different from the last
   * emitted value.
   */
  private emitChangeEvent() {
    this.controlValueAccessorChangeFn(
        {min: this.minValue, max: this.maxValue});
    this.change.emit(this.createChangeEvent());
  }

  /**
   * Emits an input event when the current value is different from the last
   * emitted value.
   */
  private emitInputEvent() {
    this.input.emit(this.createChangeEvent());
  }

  /** Creates a range slider change object from specified values. */
  private createChangeEvent(minValue = this.minValue, maxValue = this.maxValue):
      RangeSliderChange {
    const event = new RangeSliderChange();

    event.source = this;
    event.minValue = minValue;
    event.maxValue = maxValue;

    return event;
  }


  writeValue(value: RangeSliderValue) {
    if(value){
      this.minValue = value.min;
      this.maxValue = value.max;
    }
  }


  registerOnChange(fn: (value: RangeSliderValue) => void) {
    this.controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }


  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
