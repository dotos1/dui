
import {
  Component,
  ViewEncapsulation,
  ComponentFactoryResolver, Injector,
  OnDestroy,
  HostListener,
  ViewChild,
  AfterViewInit,
  Inject,
  Input,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  DoCheck,
  OnInit
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MenuBase,MenuDirective } from '@dotos/dui/ui/menu';

import { ContextMenuOverlayRef } from './context-menu-overlay';
import { CONTEXT_MENU_DIRECTION } from './direction.token';

@Component({
  selector: 'dui-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  host: {
    class: 'dui-context-menu-holder',
    hostID: 'dui-context-menu' + Math.random().toString(36).substring(2, 15)
  },
  encapsulation: ViewEncapsulation.None,

})
export class ContextMenuComponent extends MenuBase implements OnInit,OnDestroy,DoCheck, AfterViewInit {

  @ViewChildren(MenuDirective) extendMenus: QueryList<MenuDirective>;

  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  @Input()
  public popup=true;

  @Input() override set children(c){
    this._children=c;
  }
   override get children(){
    return this._children;
  }

  @ViewChild(MatMenuTrigger,{static:false})
  menuTrigger: MatMenuTrigger;

  public source;

  @HostListener('document:keydown.Escape', ['$event'])
  handleKeydownEscape(event: KeyboardEvent) {
    if (event) {
      if (this.contextMenuOverlayRef) {
        this.contextMenuOverlayRef.close();
      }
    }
  }

  protected comps = [];

  constructor(
    protected override router: Router,
    protected override resolver: ComponentFactoryResolver,
    protected override injector: Injector,
    public override changeDetectorRef: ChangeDetectorRef,
    private contextMenuOverlayRef: ContextMenuOverlayRef,
    @Inject(CONTEXT_MENU_DIRECTION) public direction: Directionality
  ) {
    super(router,changeDetectorRef, resolver, injector);
  }

  override ngDoCheck() {
    super.ngDoCheck();
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit() {

    this.children.forEach(item => {
      if (item.xtype && item.xtype == 'menu' && !item.handler) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        item.handler = (item) => { };
      }
      this.initFieldExpression(item);
    });
  }

  onClickOutsideEvent() {
    if (this.contextMenuOverlayRef) {
      this.contextMenuOverlayRef.close();
    }
  }

  runAction(menu,event) {
    if (menu.handler) {
      menu.handler(menu,event);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngAfterViewInit() {
    let k = 0;
    this.extendMenus.forEach((menuHost) => {
      const viewContainerRef = menuHost.viewContainerRef;
      viewContainerRef.clear();
      if (this.comps[k]?.reference?.hostView) {
        viewContainerRef.insert(this.comps[k].reference.hostView, 0);
      }
      k++;
    })
    if (this.menuTrigger) {
      this.menuTrigger.menuClosed
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          if (this.contextMenuOverlayRef) {
            this.contextMenuOverlayRef.close();
          }
        });
    }
    if(this.popup){
      this.menuTrigger.openMenu();
      this.changeDetectorRef.detectChanges();
    }
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }

  contextMenu(){
    return false;
  }
}
