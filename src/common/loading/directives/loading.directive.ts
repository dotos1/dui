import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { ViewContainerRef, TemplateRef } from '@angular/core';

import {
  LoadingType,
  LoadingMode,
  LoadingStrategy,
} from '../loading.component';
import { LoadingService } from '../services/loading.service';
import { ILoadingRef } from '../services/loading.factory';


export class LoadingContext {
  public $implicit: any = undefined;
  public tdLoading: any = undefined;
}


let TD_LOADING_NEXT_ID = 0;

/**
 * Structural-style directive that shows a {@link LoadingComponent} over/instead of its host
 * element until the `duiLoadingUntil` condition becomes truthy.
 * @zh 结构型指令，在 `duiLoadingUntil` 条件变为真值之前，于宿主元素之上/取代宿主元素显示 {@link LoadingComponent}。
 */
@Directive({
  selector: '[duiLoading]',
})
export class LoadingDirective implements OnInit, OnDestroy {
  private _context: LoadingContext = new LoadingContext();
  private _loadingRef?: ILoadingRef;


  /**
   * Unique name for this loading instance, auto-generated if omitted.
   * @zh 本加载实例的唯一名称，省略时自动生成。
   */
  @Input('duiLoading')
  name!: string;


  /**
   * Shows the loading indicator while this value is falsy; hides it once truthy.
   * @zh 当该值为假时显示加载指示器；变为真值后隐藏。
   */
  @Input('duiLoadingUntil')
  set until(until: any) {
    if (!this.name) {
      this.name = 'dui-loading-until-' + TD_LOADING_NEXT_ID++;
    }
    this._context.$implicit = this._context.tdLoading = until;
    if (!until) {
      this._loadingService.register(this.name);
    } else {
      this._loadingService.resolveAll(this.name);
    }
  }

  /** @zh 加载指示器的样式类型：圆形或线性。 */
  @Input('duiLoadingType')
  type: LoadingType = LoadingType.Circular;

  /** @zh 加载指示器的模式：确定或不确定。 */
  @Input('duiLoadingMode') mode: LoadingMode = LoadingMode.Indeterminate;

  /** @zh 加载指示器的展示策略：覆盖层（Overlay）或原地替换（Replace）。 */
  @Input('duiLoadingStrategy')
  strategy: LoadingStrategy.Overlay | LoadingStrategy.Replace =
    LoadingStrategy.Replace;

  /** @zh 加载指示器的 Material 主题色。 */
  @Input('duiLoadingColor') color: 'primary' | 'accent' | 'warn' = 'primary';

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _templateRef: TemplateRef<LoadingContext>,
    private _loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this._registerComponent();
  }


  ngOnDestroy(): void {
    this._loadingService.removeComponent(this.name);
    this._loadingRef = undefined;
  }

  private _registerComponent(): void {
    if (!this.name) {
      throw new Error('Name is needed to register loading directive');
    }
  
    if (!this._loadingRef) {
      this._loadingRef = this._loadingService.createComponent(
        {
          name: this.name,
          type: this.type,
          mode: this.mode,
          color: this.color,
          strategy: this.strategy,
        },
        this._viewContainerRef,
        this._templateRef,
        this._context
      );
    }
  }
}
