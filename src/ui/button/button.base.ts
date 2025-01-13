import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Injector,
    QueryList,
    Renderer2,
    ViewContainerRef
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import {isString}  from 'lodash-es';

import { ComponentBase } from '@dotos/dui/core';

export class ButtonBase extends ComponentBase {

   matTooltip: MatTooltip;

   config: any = {};

   data: any;

   override ownerCt: any;

   click = new EventEmitter<any>();

  public type = 'mat-button';

  public get items(){
    return this._items;
  }

  public set items(items){
    this.processItems(items);
     this._items=items;
     this.changeDetectorRef.detectChanges();
  }

  public _items: Array<any> = [];

  public flex: any;

  public title: any;

  public text: any;

  public value:any;

  public default:any;

  public disableRipple: boolean = false;

  public color: string = '';

  public toolTip: any;

  public icon: any;

  public iconType = "FONT";

  public svgIcon = "";

  public handler: any;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public change=(value)=>{};

  public tabIndex: number = 0;

  public menu: any;

  public override style: any;

  public checked:boolean=false;

  public dropdown:boolean=false;

  public iconPosition = 'before';

   public _container: ViewContainerRef;

  triggers: QueryList<MatMenuTrigger>;

  constructor(
    public _element: ElementRef,
    public renderer: Renderer2,
    public changeDetectorRef: ChangeDetectorRef,
    public resolver: ComponentFactoryResolver,
    public injector: Injector,) {
    super(changeDetectorRef);
  }

  getEl() {
    return this._element.nativeElement;
  }

  override init(config: any) {
    super.init(config);
    this.config=config;
    if (config && config.children) {
      this.items = config.children;
    }
    if (config && config.iconPosition) {
      this.iconPosition = config.iconPosition;
    }
    this.default=this.value;
    this.processItems(this.items);
     this.changeDetectorRef.detectChanges();
     this.checkExpressionChange();
  }
  processItems(items){
    for (let i = 0; i < items.length; i++) {
      if (isString(items[i]) && items[i] === '-') {
        items[i] = { type: 'divider' };
      }
      if (!items[i].xtype) {
        items[i].xtype = 'menuitem';
      }
      if(this.dropdown){
        if (items[i].value==this.value&&items[i].text!=undefined) {
          this.title=this.text=items[i].text?items[i].text:items[i].title;
       }
       if (items[i].value==this.value&&items[i].icon!=undefined) {
           this.icon=items[i].icon;
       }
       items[i].parentItem=this;
      }
    }
  }
  openMenu(trigger: MatMenuTrigger, level: number) {
    this.triggers
      .filter((x: any) => x._element.nativeElement.dataset.level >= level && x !== trigger)
      .forEach(x => {
        x.closeMenu();
      });
    trigger.triggersSubmenu();
  }

  public onValueChange(value,e?){
    this.setValue(value);
    setTimeout(() => {
      if (this.change) {
        this.change(value);
      }
      this.click.emit(e);
    }, 50);
  }
  closeAllMenu() {
    this.triggers.forEach(x => {
      x.closeMenu();
    });
  }

  closeSubMenu(level: number) {
    this.triggers
      .filter((x: any) => x._element.nativeElement.dataset.level > level)
      .forEach(x => {
        x.closeMenu();
      });
  }

  public hasIcon() {
    return this.icon != undefined;
  }

  // private
  override onDestroy() {
    super.onDestroy();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setHandler(handler: Function, scope: Object): void {
    this.handler = handler;
  }

  setIcon(icon: string): void {
    this.icon = icon;
  }
  getValue(): any {
    return this.value;
  }
  setValue(v): void {
    if(this.dropdown){
      if(v==null||v==undefined){
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].value==this.default) {
              this.title=this.text=this.items[i].text?this.items[i].text:this.items[i].title;
              this.value=this.items[i].value;
              this.icon=this.items[i].icon;
          }
        }
      }else if(isString(v)){
        this.value=v;
        let  inItem=false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].value==v) {
              this.title=this.text=this.items[i].text?this.items[i].text:this.items[i].title;
              this.icon=this.items[i].icon;
              inItem=true;
           }
        }
        if(!inItem)   this.title=this.text=   this.value;

      }else{
        if(v.text){
          this.title=this.text=v.text?v.text:v.title;
        }
        if(v.value){
          this.value=v.value;
        }
        if(v.icon){
          this.icon=v.icon;
        }
      }
      this.changeDetectorRef.detectChanges();
    }
  }
  onClick(e) {
    if (e) {
      e.preventDefault();
      if (this.matTooltip.message!='') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.matTooltip.hide();
      }
    }
    if (!this.disabled) {
      setTimeout(() => {
        if (this.handler) {
          this.handler.call(this, this.data || this, e);
        }
        this.click.emit(e);
      }, 50);
    }
  }
  // private
  onDisable() {
    this.onDisableChange(true);
  }

  // private
  onEnable() {
    this.onDisableChange(false);
  }

  onDisableChange(disabled) {
    this.disabled = disabled;
  }
}
