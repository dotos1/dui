import { Component, ChangeDetectionStrategy, SimpleChanges, ChangeDetectorRef, ViewEncapsulation, OnChanges } from '@angular/core';
import {
  ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef, Input
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import * as _ from 'lodash';
import { ComponentBase } from '@dotos/dui/core';
import { Dui } from '@dotos/dui/core';
import { Container } from '../container.main'
import { TranslateService } from '@dotos/dui/i18n';

@Component({
  selector: 'card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    style: 'flex:1;'
  }
})
export class DuiCardComponent extends Container implements OnChanges{

  @ViewChild(MatPaginator)
  pagebar: MatPaginator;


  @Input() config: any = {};


  public override xtype: string = 'card';

  public direction: string = 'top';

  public open: boolean = false;

  public alwaysVisible: boolean = false;


  public title: string;


  public subtitle: string;


  public width: number = 100;


  public color: string = 'primary';


  public closable: boolean = false;


  public override disabled: boolean = false;


  public buttons: Array<any> = [];


  private actionButtons: Array<any> = [];


  public buttonAlign = 'right';


  public fabLocation: string = 'bottom';


  public ltbar: Array<any>;

  private ltButtons: Array<any> = [];


  public rtbar: any[];

  private rtButtons: any[] = [];


  public bbar: any;

  public fbar: any;

  private fButtons: Array<any> = [];


  public autoHeight: boolean = false;


  public bottomToolbar: any;

  public fxLayout: string = 'row';

  public override style: any = { overflow: 'auto', width: '100%', height: '100%' };

  public contenStyle:any={"padding":"8px"};

  public cardStyle: any = {};

  @ViewChild('panel', { read: ViewContainerRef, static: false }) public override viewContainer: ViewContainerRef;

  @ViewChild('actionbar', { read: ViewContainerRef, static: false }) public actionbar: ViewContainerRef;

  @ViewChild('lefttopbar', { read: ViewContainerRef, static: false }) public lefttopbar: ViewContainerRef;

  @ViewChild('righttopbar', { read: ViewContainerRef, static: false }) public righttopbar: ViewContainerRef;

  @ViewChild('rightopfab', { read: ViewContainerRef, static: false }) public rightopfab: ViewContainerRef;

  @ViewChild('righbottomfab', { read: ViewContainerRef, static: false }) public righbottomfab: ViewContainerRef;

  public searchBoxTerm: string;

  public searchFacet: any;

  public _state: any = {};

  public set state(state: any) {
    this._state = state;
    if (this.detectRef) {
      this.detectRef.detectChanges();
    }
  };

  public get state(): any {
    return this._state;
  }

  public pageBar: any;

  constructor(
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef,
    public translateService: TranslateService) {
    super(resolver, injector, detectRef);
  }


  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }


  override init(config: any) {
    this.buttons=[];
    this.ltButtons=[];
    this.rtButtons=[];
    this.fButtons=[];
    this.actionButtons=[];
    super.init(config);
    if (config) {
      this.searchFacet = config.searchFacet;
    }
    this.detectRef.detectChanges();

    if (this.buttons) {
      this._addButtons(this.buttons);
    }
    if (this.ltbar) {
      this._createTopLeftToolbar(this.ltbar);
    }
    if (this.rtbar) {
      this._createTopRightToolbar(this.rtbar);
    }
    if (this.fbar) {
      this._createFbar(this.fbar);
    }
    const items = this.items;
    if (items && this.xtype === 'card') {
      delete this.items;
      this.add(items);
    }
  }



  initEvents() {
  }

  getPagebar() {
    return this.pagebar;
  }

  setTitle(title: string) {
    this.title = title;
  }
  setSubTitle(subtitle: string) {
    this.subtitle = subtitle;
  }

  lookupButton(c) {
    if (_.isString(c)) {
      if (c === '-') {
        c = this.createComponent({
          xtype: 'divider',
          vertical: true
        });
      } else {
        if (c === ' ') {
          c = this.createComponent({
            xtype: 'tbspacer',
            width: 2
          });
        } else {
          if (c === '->') {
            c = this.createComponent({
              xtype: 'tbfill'
            });
          } else {
            c = this.createComponent({
              xtype: 'tbtext',
              text: c
            });
          }
        }
      }
      this.applyDefaults(c);
    } else {
      c = this.createComponent(c);
    }
    return c;
  }


  protected _addButtons(buttons: Array<any>, options?: any): void {
    if(this.actionbar){
      this.actionbar.clear()
    } ;
    for (let i = 0; i < buttons.length; i++) {
      if(buttons[i].xtype){
        this.addButton(buttons[i], options);
      }
    }
  }

  addButton(config: any, options?: any): void {
    Dui.apply(config, options);
    this._addButton(this.actionbar, this.actionButtons, config);
  }

  private _addButton(container: ViewContainerRef, buttons: Array<any>, config: any): void {
    const component: ComponentBase = this.lookupButton(config);
    component.ownerCt = this;
    const index = buttons.length;
    buttons.push(component);
    if (container != undefined) {
      container.insert(component.reference.hostView, index);
    }
  }

  protected _createTopLeftToolbar(buttons: Array<any>, options?: any): void {
    if(this.lefttopbar) this.lefttopbar.clear();
    for (let i = 0; i < buttons.length; i++) {
      if(buttons[i].xtype){
      this.addLeftTopButton(buttons[i], options);
      }
    }
  }

  public addLeftTopButton(config: any, options?: any): void {
    Dui.apply(config, options);
    this._addButton(this.lefttopbar, this.ltButtons, config);
  }

  protected _createTopRightToolbar(buttons: Array<any>, options?: any): void {
    if(this.righttopbar) this.righttopbar.clear();
    for (let i = 0; i < buttons.length; i++) {
      if(buttons[i].xtype){
      this.addRightTopButton(buttons[i], options);
      }
    }
  }

  public addRightTopButton(config: any, options?: any): void {
    Dui.apply(config, options);

    this._addButton(this.righttopbar, this.rtButtons, config);
  }

  _createFbar(config: any, options?: any): void {
    if(this.righbottomfab) this.righbottomfab.clear();
    if(this.rightopfab) this.rightopfab.clear();
    if (Array.isArray(config)) {
      for (let i = 0; i < config.length; i++) {
        if(config[i].xtype){
        this.addFabButton(config[i], options);
        }
      }
      // if (config.length == 1) {
      //   this.addFabButton(config[0], options);
      // } else {
      //   let conf: any = {
      //     xtype: "speeddial",
      //     icon: 'menu',
      //     open: false,
      //     direction: 'left',
      //     items: config
      //   };
      //   this.addFabButton(conf, options);
      // }
    } else {
      this.addFabButton(config, options);
    }
  }

  public addFabButton(config: any, options?: any): void {
    Dui.apply(config, options);
    let location = this.righbottomfab;
    if (this.fabLocation === 'top') {
      location = this.rightopfab;
    }
    this._addButton(location, this.fButtons, config);
  }

  /**
   * Returns the {@link Dui.ui.Toolbar toolbar} from the footer (<code>{@link #fbar}</code>) section of the panel.
   *  The toolbar
   */
  getButtons(): Array<any> {
    return this.actionButtons;
  }


  getLtButtons(): Array<any> {
    return this.ltButtons;
  }


  getRtButtons(): Array<any> {
    return this.rtButtons;
  }


  getFabButtons(): Array<any> {
    return this.fButtons;
  }


  getAllButtons(): Array<ComponentBase> {
    const allButtons = _.concat(this.ltButtons, this.rtButtons, this.actionButtons, this.fButtons);
    return allButtons;
  }


  getButtonMenus(buttons?): Array<ComponentBase> {
    if (_.isUndefined(buttons)) {
      buttons = _.concat(this.ltButtons, this.rtButtons, this.actionButtons, this.fButtons);
    }
    return buttons;
  }
}
