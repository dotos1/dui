import { ChangeDetectorRef, Component, ComponentFactoryResolver, DoCheck, HostListener, Injector, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBase } from './menu-base';
import { MenuBarItem } from './menu-model';

@Component({
  selector: 'dui-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    hostID: 'dui-menu-bar' + Math.random().toString(36).substring(2, 15)
  },
})
export class MenuBarComponent extends MenuBase implements OnInit,DoCheck{

  @Input() dense: boolean = true;

   @Input() declare  items: MenuBarItem[];

  @Input() menuClasses

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  constructor(
    public override changeDetectorRef: ChangeDetectorRef,
    protected override router: Router,
    protected override resolver: ComponentFactoryResolver,
    protected override injector: Injector) {
    super(router,changeDetectorRef, resolver, injector);
  }

  ngOnInit() {
    this.items.forEach(item => {
      this.initFieldExpression(item);
    });
  }


  override ngDoCheck() {
    super.ngDoCheck();
  }

  public click(menu, comp?) {
    if (menu.handler) {
      menu.handler(menu, comp);
    }
  }
}
