import {  ChangeDetectorRef, Component,  ComponentFactoryResolver,  DoCheck,  ElementRef, EventEmitter, HostBinding, Injector, Input, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColorEvent } from '@dotos/dui/common/colorpicker/common';
import { ButtonBase } from '@dotos/dui/ui/button';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
  selector: 'colorpicker-button',
  templateUrl: './color-button.html',
  styleUrls: ['./color-button.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': 'flex'
  },
})
export class ColorPickerButton extends ButtonBase implements OnInit,DoCheck {

  @Input() override config: any = {};

  @ViewChild(MatTooltip)  override matTooltip: MatTooltip;

  @Input() override data: any;

  @Input() override ownerCt: any;

  @Output() override click = new EventEmitter<any>();

  @ViewChild('container', { read: ViewContainerRef }) public override _container: ViewContainerRef;

  @ViewChildren(MatMenuTrigger) override triggers: QueryList<MatMenuTrigger>;

  state = {
    h: 150,
    s: 0.50,
    l: 0.20,
    a: 1,
  };


  @HostBinding('style.display')
  get displayFlex(): string {
    return 'flex';
  }
  @HostBinding('style.padding-left.px')
  get paddingLeft(): string {
    if(this.hidden){
      return '0';
    }else{
      return this.config.parentType==undefined?'8':'0';
    }
  }

  @HostBinding('style.padding-right.px')
  get paddingRight(): string {
    if(this.hidden){
      return '0';
    }else{
      return this.config.parentType==undefined?'8':'0';
    }
  }
  iconStyle={ "border-bottom-color":"#000"};

  constructor(
    public override _element: ElementRef,
    public override renderer: Renderer2,
    public router: Router,
    public _changeDetectorRef: ChangeDetectorRef,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
  ) {
    super(_element,renderer,_changeDetectorRef,resolver,injector);
  }
  override ngDoCheck() {
    super.ngDoCheck();
    this.checkExpressionChange();
    this._changeDetectorRef.markForCheck();
  }
  override ngOnInit() {
    this.initFieldExpression(this.config);
  }
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }
  override setValue(v:any): void {
    this.value=v;
    if(v==undefined){
      this.iconStyle["border-bottom-color"]='transparent';
    }else{
      this.iconStyle["border-bottom-color"]=v.hex;
    }
    this._changeDetectorRef.detectChanges();
  }
  changeComplete($event: ColorEvent): void {

    $event.$event.stopPropagation();
    if($event.color==undefined){
      this.state = undefined;
      this.iconStyle["border-bottom-color"]='transparent';
      this.onValueChange($event.color,this);
    }else{
      this.state = $event.color.hsl;
      this.iconStyle["border-bottom-color"]=$event.color.hex;
      this.onValueChange($event.color,this);
    }

    this._changeDetectorRef.detectChanges();
  }
}
