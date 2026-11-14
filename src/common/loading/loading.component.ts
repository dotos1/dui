/**
 * @fileoverview Module `src/common/loading/loading.component.ts` providing loading component definitions and implementation.
 * @zh 模块文件 `src/common/loading/loading.component.ts`，提供加载中组件相关的定义与实现。
 */

import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  DoCheck,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';

/**
 * Enumeration `LoadingType` defining supported loading type constants.
 * @zh 枚举 `LoadingType`，定义支持的加载中类型常量集合。
 */
export enum LoadingType {
  /**
   * Enum member `LoadingType.Circular` = 'circular' representing circular.
   * @zh 枚举项 `LoadingType.Circular` = 'circular'，表示Circular。
   */
  Circular = 'circular',
  /**
   * Enum member `LoadingType.Linear` = 'linear' representing linear.
   * @zh 枚举项 `LoadingType.Linear` = 'linear'，表示Linear。
   */
  Linear = 'linear',
}

/**
 * Enumeration `LoadingMode` defining supported loading mode constants.
 * @zh 枚举 `LoadingMode`，定义支持的加载中模式常量集合。
 */
export enum LoadingMode {
  /**
   * Enum member `LoadingMode.Determinate` = 'determinate' representing determinate.
   * @zh 枚举项 `LoadingMode.Determinate` = 'determinate'，表示Determinate。
   */
  Determinate = 'determinate',
  /**
   * Enum member `LoadingMode.Indeterminate` = 'indeterminate' representing indeterminate.
   * @zh 枚举项 `LoadingMode.Indeterminate` = 'indeterminate'，表示半选状态。
   */
  Indeterminate = 'indeterminate',
}

/**
 * Enumeration `LoadingStrategy` defining supported loading strategy constants.
 * @zh 枚举 `LoadingStrategy`，定义支持的加载中策略常量集合。
 */
export enum LoadingStrategy {
  /**
   * Enum member `LoadingStrategy.Overlay` = 'overlay' representing overlay.
   * @zh 枚举项 `LoadingStrategy.Overlay` = 'overlay'，表示浮层。
   */
  Overlay = 'overlay',
  /**
   * Enum member `LoadingStrategy.Replace` = 'replace' representing replace.
   * @zh 枚举项 `LoadingStrategy.Replace` = 'replace'，表示替换。
   */
  Replace = 'replace',
}

/**
 * Enumeration `LoadingStyle` defining supported loading style constants.
 * @zh 枚举 `LoadingStyle`，定义支持的加载中样式常量集合。
 */
export enum LoadingStyle {
  /**
   * Enum member `LoadingStyle.FullScreen` = 'fullscreen' representing full screen.
   * @zh 枚举项 `LoadingStyle.FullScreen` = 'fullscreen'，表示完整屏幕。
   */
  FullScreen = 'fullscreen',
  /**
   * Enum member `LoadingStyle.Overlay` = 'overlay' representing overlay.
   * @zh 枚举项 `LoadingStyle.Overlay` = 'overlay'，表示浮层。
   */
  Overlay = 'overlay',
  /**
   * Enum member `LoadingStyle.None` = 'none' representing none.
   * @zh 枚举项 `LoadingStyle.None` = 'none'，表示无。
   */
  None = 'none',
}

/**
 * Constant/variable `TD_CIRCLE_DIAMETER` defining td circle diameter in `src/common/loading`.
 * @zh 常量/变量 `TD_CIRCLE_DIAMETER`，定义 `src/common/loading` 中的TD圆形DIAMETER。
 */
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
  host: {
    hostID: 'dui-loading' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class LoadingComponent implements DoCheck {
  /**
   * Property `_mode` (`LoadingMode`) storing mode (default: `LoadingMode.Indeterminate`).
   * @zh 属性 `_mode`（类型：`LoadingMode`），用于存储或配置模式（默认值：`LoadingMode.Indeterminate`）。
   */
  private _mode: LoadingMode = LoadingMode.Indeterminate;
  /**
   * Property `_defaultMode` (`LoadingMode`) storing default mode (default: `LoadingMode.Indeterminate`).
   * @zh 属性 `_defaultMode`（类型：`LoadingMode`），用于存储或配置默认模式（默认值：`LoadingMode.Indeterminate`）。
   */
  private _defaultMode: LoadingMode = LoadingMode.Indeterminate;
  /**
   * Property `_value` (`number`) storing value (default: `0`).
   * @zh 属性 `_value`（类型：`number`），用于存储或配置值（默认值：`0`）。
   */
  private _value = 0;
  /**
   * Property `_circleDiameter` (`number`) storing circle diameter (default: `TD_CIRCLE_DIAMETER`).
   * @zh 属性 `_circleDiameter`（类型：`number`），用于存储或配置圆形Diameter（默认值：`TD_CIRCLE_DIAMETER`）。
   */
  private _circleDiameter: number = TD_CIRCLE_DIAMETER;

  /**
   * Flag for animation

   * @zh 属性 `animation`（类型：`boolean`），用于存储或配置动画（默认值：`false`）。
   */
  animation = false;

  /**
   * Content injected into loading component.

   * @zh 属性 `content`（类型：`any`），用于存储或配置内容。
   */
  content;

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

  /**
   * Property `style` (`LoadingStyle`) storing style (default: `LoadingStyle.None`).
   * @zh 加载指示器的展示样式：全屏、覆盖层或无（内嵌）。
   * @zh 加载指示器的展示样式：全屏、覆盖层或无（内嵌）。
   */
  style: LoadingStyle = LoadingStyle.None;

  /**
   * height: number
   * Sets height of [DuiLoadingComponent].

   * @zh 属性 `height`（类型：`number`），用于存储或配置高度（默认值：`100`）。
   */
  height = 100;

  /**
   * type: LoadingType
   * Sets type of [DuiLoadingComponent] rendered.

   * @zh 属性 `type`（类型：`LoadingType`），用于存储或配置类型（默认值：`LoadingType.Circular`）。
   */
  type: LoadingType = LoadingType.Circular;

  /**
   * color: primary' | 'accent' | 'warn'
   * Sets theme color of [DuiLoadingComponent] rendered.

   * @zh 属性 `color`（类型：`"primary" | "accent" | "warn"`），用于存储或配置颜色（默认值：`'primary'`）。
   */
  color: 'primary' | 'accent' | 'warn' = 'primary';

  /**
   * Creates an instance of `LoadingComponent` and initializes its dependencies and internal state.
   * @zh 创建 `LoadingComponent` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
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

   * @zh 执行 `show`，用于显示。
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

   * @zh 执行 `hide`，用于隐藏。
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

   * @zh 执行 `_setCircleDiameter`，用于集合圆形Diameter。
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

   * @zh 执行 `_hostHeight`，用于宿主高度。
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