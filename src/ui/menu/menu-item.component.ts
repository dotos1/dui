import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  Injector,
  Input,
  OnInit, QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Dui } from '@dotos/dui/core';
import { MenuBase } from './menu-base';
import { MenuDirective } from './menu-item.directive';
import { MenuModel } from './menu-model';

@Component({
  selector: 'dui-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  
})
export class MenuItemComponent extends MenuBase implements OnInit,DoCheck,AfterViewInit {

  @ViewChildren(MenuDirective) extendMenus: QueryList<MenuDirective>;

  @Input() override set children(c){
    this._children=c;
    this.processItem();
  }
   override get children(){
    return this._children;
  }

  @Input() declare ownerCt: any;

  @Input() value: any;

  @ViewChild('childMenu', { static: true }) public childMenu: MatMenu;


  protected comps = [];

  public xPosition = 'after';

  public yPosition = 'below';

  menuClasses: string[] = ['menu-bar-item-menu'];

  private _dense = false;

  get dense(): boolean {
    return this._dense;
  }
  @Input()
  set dense(value: boolean) {
    this._dense = value;
    if (value) {
      if (!(this.menuClasses.indexOf('menu-bar-item-menu--dense') > -1)) {
        this.menuClasses.push(`${this.menuClass} menu-bar-item-menu--dense`);
      }
    } else {
      if (this.menuClasses.indexOf('menu-bar-item-menu--dense') > -1) {
        this.menuClasses = this.menuClasses.filter(e => e !== 'menu-bar-item-menu--dense');
      }
    }
  }

  get onlyIcon(): boolean {
    return this._onlyIcon;
  }
  @Input()
  set onlyIcon(value: boolean) {
    this._onlyIcon = value;
    if (value) {
      if (!(this.menuClasses.indexOf('only-icon-menu') > -1)) {
        this.menuClasses.push(`only-icon-menu`);
      }
    } else {
      if (this.menuClasses.indexOf('only-icon-menu') > -1) {
        this.menuClasses = this.menuClasses.filter(e => e !== 'only-icon-menu');
      }
    }
  }
  private _onlyIcon=false;

  get menuClass(): string {
    return this.menuClasses.join(' ');
  }

  @Input()
  public showIcon=true;

  @Input()
  set panelClass(panelClass: any) {
    this.menuClasses.push(panelClass);
  }

  get panelClass(): string {
    return this.panelClass;
  }

  public parentItem;

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected override router: Router,
    protected override resolver: ComponentFactoryResolver,
    protected override injector: Injector) {
    super(router,_changeDetectorRef, resolver, injector);
  }

  override init(config: any) {
    if (config && config.children) {
      this.children = config.children;
    }
    this._changeDetectorRef.detectChanges();
  }

  override ngDoCheck() {
    super.ngDoCheck();
    this.checkExpressionChange();
    this._changeDetectorRef.markForCheck();
  }
  ngOnInit() {
    this.processItem();
  }
  processItem(){
    if(this.children){
      this.children.forEach(item => {
        if (item.xtype && item.xtype == 'menuitem' && !item.handler) {
          item.handler = () => { };
        }
        if (item.xtype && item.xtype != 'menuitem' && item.type != 'divider') {
          let component = Dui.create(Dui.apply({ ownerCt: this }, item), this);
          component.ownerCt = this.ownerCt;
          this.comps.push(component);
        }
        if(item.title==undefined&&item.text!=undefined){
          item.title=item.text;
        }
        this.initFieldExpression(item);
      });
    }
  }
  ngAfterViewInit() {
    let k = 0;
    this.extendMenus.forEach((menuHost) => {
      const viewContainerRef = menuHost.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.insert(this.comps[k].reference.hostView, 0);
      k++;
    })
  }
  public click(menu, comp?) {
    if(menu.parentItem&&menu.parentItem.dropdown){
      this.parentItem=menu.parentItem;
      const newValue = menu.value;
      this.parentItem.value = menu.value;
      if (this.parentItem.onValueChange) {
        this.parentItem.onValueChange(newValue,menu);
      }
    }
    if (menu.handler) {
      menu.handler(menu, comp,this);
    }
  }
  onRadioMenuItemClick(parentItem: MenuModel, item: MenuModel, ev: Event) {
    this.parentItem=parentItem;
    if (item.onClick) {
      item.onClick(item, ev);
    }
    const newValue = item.value;
    this.parentItem.value = item.value;
    if (this.parentItem.onValueChange) {
      this.parentItem.onValueChange( newValue,item);
    }
  }

  onCheckboxMenuItemClick(item: MenuModel, ev: Event) {
    if (item.onClick) {
      item.onClick(item, ev);
    }
    const newValue = !item.value;
    item.value = !item.value;
    if (item.onValueChange) {
      item.onValueChange( newValue,item);
    }
  }
}
