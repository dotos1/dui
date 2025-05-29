import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';

import { ButtonBase } from './button.base';


@Component({
  selector: 'dui-button',
  styleUrls: ['./button.component.scss'],
  templateUrl: './button.component.html',
  host: {
    '[style.display]': 'flex',
    hostID: 'dui-button' + Math.random().toString(36).substring(2, 15)
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ButtonComponent extends ButtonBase implements OnChanges,DoCheck {

   @ViewChild(MatTooltip)  declare matTooltip: MatTooltip;

  @Input() override config: any = {};

  @Input() declare data: any;

  @Input() declare ownerCt: any;

  @Input() iconStyle: any;

  @Input()  hasMenu=false;
  
  @Output() override click = new EventEmitter<any>();

  public showIcon=true;

  public onlyIcon=false;

  @ViewChild('container', { read: ViewContainerRef }) public declare _container: ViewContainerRef;

  @ViewChildren(MatMenuTrigger) declare triggers: QueryList<MatMenuTrigger>;

  constructor(
    public override _element: ElementRef,
    public override renderer: Renderer2,
    public override changeDetectorRef: ChangeDetectorRef,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,) {
    super(_element,renderer,changeDetectorRef,resolver,injector);
  }

  override ngDoCheck() {
    super.ngDoCheck();
    this.checkExpressionChange();
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
      this.changeDetectorRef.detectChanges()
    }
  }

  override getEl() {
    return this._element.nativeElement;
  }

  override onClick(e) {
    if (e) {
      e.preventDefault();
    }
    if (!this.disabled) {
      if (this.matTooltip&&this.matTooltip.message!='') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.matTooltip.hide(10);
      }
        if (this.handler) {
          this.handler.call(this, this.data || this, e);
        }
        this.click.emit(e);
    }
  }   
}
