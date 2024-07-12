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

@Directive({
  selector: '[duiLoading]',
})
export class LoadingDirective implements OnInit, OnDestroy {
  private _context: LoadingContext = new LoadingContext();
  private _loadingRef?: ILoadingRef;


  @Input('duiLoading')
  name!: string;


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

 
  @Input('duiLoadingType')
  type: LoadingType = LoadingType.Circular;


  @Input('duiLoadingMode') mode: LoadingMode = LoadingMode.Indeterminate;


  @Input('duiLoadingStrategy')
  strategy: LoadingStrategy.Overlay | LoadingStrategy.Replace =
    LoadingStrategy.Replace;

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
