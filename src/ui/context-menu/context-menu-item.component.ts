
import { Component, Input, ViewEncapsulation, ComponentFactoryResolver, Injector, ChangeDetectorRef, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuModel,MenuBase } from '@dotos/dui/ui/menu';

@Component({
  selector: 'dui-context-menu-item',
  templateUrl: 'context-menu-item.component.html',
  encapsulation: ViewEncapsulation.None,
<<<<<<< HEAD
  host: { class: 'app-context-menu-item','hostID': crypto.randomUUID().toString() },
=======
  host: { class: 'app-context-menu-item'}
>>>>>>> efe8bb5 (warning update)
})
export class ContextMenuItemComponent extends MenuBase implements OnInit,DoCheck {
  @Input()
  menuItem: MenuModel;

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected override router: Router,
    protected override resolver: ComponentFactoryResolver,
    protected override injector: Injector) {
    super(router, _changeDetectorRef,resolver, injector);
  }

  override ngDoCheck() {
    if(this.menuItem.doCheck){
      this.menuItem.doCheck(this.menuItem);
    }
    this.checkMenuExpressionChange(this.menuItem, this.ownerCt);
    this.checkMenuVisibilityChange(this.menuItem, this.ownerCt);
    this.changeDetectorRef.markForCheck();
  }
  ngOnInit() {
    this.initFieldExpression(this.menuItem);
    if(this.menuItem.children){
      this.menuItem.children.forEach(item => {
        this.initFieldExpression(item);
      });
    }
  }
  runAction(menu,event) {
    if (menu.handler) {
      menu.handler(menu,event);
    }
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
  contextMenu(){
    return false;
  }
}
