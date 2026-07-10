import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  DoCheck,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { FadeInOutAnimation } from '@dotos/dui/common/animations';

export enum LoadingType {
  Circular = 'circular',
  Linear = 'linear',
}

export enum LoadingMode {
  Determinate = 'determinate',
  Indeterminate = 'indeterminate',
}

export enum LoadingStrategy {
  Overlay = 'overlay',
  Replace = 'replace',
}

export enum LoadingStyle {
  FullScreen = 'fullscreen',
  Overlay = 'overlay',
  None = 'none',
}

export const TD_CIRCLE_DIAMETER = 40;

/**
 * A circular or linear loading indicator, usable standalone or driven by {@link LoadingDirective}
 * / {@link LoadingService} (full-screen, overlay, or in-place replace strategies).
 * @zh 圆形或线性加载指示器，可独立使用，也可由 {@link LoadingDirective} / {@link LoadingService}
 * 驱动（支持全屏、遮罩层、原地替换等策略）。
 */
@Component({
  selector: 'dui-loading',
  styleUrls: ['./loading.component.scss'],
  templateUrl: './loading.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.Default,
  animations: [FadeInOutAnimation],
  host: {
    hostID: 'dui-loading' + Math.random().toString(36).substring(2, 15),
  }
})
export class LoadingComponent implements DoCheck {
  private _mode: LoadingMode = LoadingMode.Indeterminate;
  private _defaultMode: LoadingMode = LoadingMode.Indeterminate;
  private _value = 0;
  private _circleDiameter: number = TD_CIRCLE_DIAMETER;

  /**
   * Flag for animation
   */
  animation = false;

  /**
   * Content injected into loading component.
   */
  content!: TemplatePortal<any>;

  /**
   * Sets mode of [DuiLoadingComponent] to LoadingMode.Determinate or LoadingMode.Indeterminate
   * @zh 设置加载指示器为确定模式（LoadingMode.Determinate）或不确定模式（LoadingMode.Indeterminate）。
   */
  set mode(mode: LoadingMode) {
    this._defaultMode = mode;
  }
  /**
   * The loading indicator's current mode (determinate or indeterminate).
   * @zh 加载指示器当前的模式（确定或不确定）。
   */
  get mode(): LoadingMode {
    return this._mode;
  }

  /**
   * Sets value of [DuiLoadingComponent] if mode is 'LoadingMode.Determinate'
   * @zh 当模式为 'LoadingMode.Determinate' 时，设置加载指示器的进度值。
   */
  set value(value: number) {
    this._value = value;
    this._changeDetectorRef.markForCheck();
  }
  /**
   * The loading indicator's current progress value (used in determinate mode).
   * @zh 加载指示器当前的进度值（用于确定模式）。
   */
  get value(): number {
    return this._value;
  }

  /** @zh 加载指示器的展示样式：全屏、覆盖层或无（内嵌）。 */
  style: LoadingStyle = LoadingStyle.None;

  /**
   * height: number
   * Sets height of [DuiLoadingComponent].
   */
  height = 100;

  /**
   * type: LoadingType
   * Sets type of [DuiLoadingComponent] rendered.
   */
  type: LoadingType = LoadingType.Circular;

  /**
   * color: primary' | 'accent' | 'warn'
   * Sets theme color of [DuiLoadingComponent] rendered.
   */
  color: 'primary' | 'accent' | 'warn' = 'primary';

  constructor(
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngDoCheck(): void {

    if (this.isOverlay() && this._hostHeight() > 1 && this.animation) {
      this._setCircleDiameter();
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * The CSS height to apply to the host (`undefined` for overlay/full-screen styles, which
   * fill their container).
   * @zh 应用到宿主的 CSS 高度（覆盖层/全屏样式下为 `undefined`，因为它们会填满容器）。
   */
  getHeight(): string | undefined {

    if (this.isOverlay() || this.isFullScreen()) {
      return undefined;
    } else {
      return this.height ? `${this.height}px` : '150px';
    }
  }

  /**
   * The current circular spinner diameter.
   * @zh 当前圆形加载指示器的直径。
   */
  getCircleDiameter(): number {
    return this._circleDiameter;
  }

  /**
   * The circular spinner's stroke width, derived from its diameter.
   * @zh 圆形加载指示器的描边宽度，根据其直径推导得出。
   */
  getCircleStrokeWidth(): number {
    const strokeWidth: number = this.getCircleDiameter() / 10;
    return Math.abs(strokeWidth);
  }

  /**
   * Whether the indicator is rendered as a circular spinner.
   * @zh 该指示器是否以圆形样式渲染。
   */
  isCircular(): boolean {
    return this.type === LoadingType.Circular;
  }

  /**
   * Whether the indicator is rendered as a linear progress bar.
   * @zh 该指示器是否以线性样式渲染。
   */
  isLinear(): boolean {
    return this.type === LoadingType.Linear;
  }

  /**
   * Whether the indicator is displayed using the full-screen presentation style.
   * @zh 该指示器是否以全屏展示样式显示。
   */
  isFullScreen(): boolean {
    return this.style === LoadingStyle.FullScreen;
  }

  /**
   * Whether the indicator is displayed using the overlay presentation style.
   * @zh 该指示器是否以覆盖层展示样式显示。
   */
  isOverlay(): boolean {
    return this.style === LoadingStyle.Overlay;
  }

  /**
   * Starts in animation and returns an observable for completition event.
   */
  show(): void {
    /* need to switch back to the selected mode, so we have saved it in another variable
     *  and then recover it. (issue with protractor)
     */
    this._mode = this._defaultMode;
    // Set values before the animations starts
    this._setCircleDiameter();
    // Check for changes for `OnPush` change detection
    this.animation = true;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Starts out animation and returns an observable for completition event.
   */
  hide(): void {
    this.animation = false;
    /* need to switch back and forth from determinate/indeterminate so the setInterval()
     * inside mat-progress-spinner stops and protractor doesnt timeout waiting to sync.
     */
    this._mode = LoadingMode.Determinate;
    // Check for changes for `OnPush` change detection
    /* little hack to reset the loader value and animation before removing it from DOM
     * else, the loader will appear with prev value when its registered again
     * and will do an animation going prev value to 0.
     */
    this.value = 0;
    // Check for changes for `OnPush` change detection
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Calculate the proper diameter for the circle and set it
   */
  private _setCircleDiameter(): void {
    // we set a default diameter of 100 since this is the default in material
    let diameter: number = TD_CIRCLE_DIAMETER;
    // if height is provided, then we take that as diameter
    if (this.height) {
      diameter = this.height;
      // else if its not provided, then we take the host height
    } else if (this.height === undefined) {
      diameter = this._hostHeight();
    }
    // if the diameter is over TD_CIRCLE_DIAMETER, we set TD_CIRCLE_DIAMETER
    if (diameter <= TD_CIRCLE_DIAMETER) {
      this._circleDiameter = Math.floor(diameter);
    } else {
      this._circleDiameter = TD_CIRCLE_DIAMETER;
    }
  }

  /**
   * Returns the host height of the loading component
   */
  private _hostHeight(): number {
    if (<HTMLElement>this._elementRef.nativeElement) {
      return (<HTMLElement>(
        this._elementRef.nativeElement
      )).getBoundingClientRect().height;
    }
    return 0;
  }
}