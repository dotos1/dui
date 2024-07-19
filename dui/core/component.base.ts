
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, ComponentRef, Directive, DoCheck, HostBinding, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base } from '@dotos/dui/base';
import * as _ from 'lodash-es';
import { Dui } from './dui';

@Directive()
export class ComponentBase extends Base<HTMLElement> implements OnInit,DoCheck, OnChanges,OnDestroy, AfterViewChecked, AfterViewInit, AfterContentInit, AfterContentChecked {

  @HostBinding('style.display') display = 'inherit';

  @Input() public ownerCt: any;

  @Input()  public disabled: any = false;


  public id;

  public xtype = 'component';


  public reference: ComponentRef<ComponentBase>;

  public _hidden = false;

  public plugins: any;

  public inited: boolean = false;

  public ref = '';

  public style: any;

  protected listeners: any;


  hideExpression?: boolean | string | ((model: any, formState: any) => boolean);

  expressionProperties?: { [property: string]: string | ((model: any, formState: any) => boolean) } | any;

  get hidden() {
    return this._hidden;
  }
  set hidden(hidden: boolean) {
    this.detectRef.markForCheck();
    if (hidden) {
      this.display = 'none';
    } else {
      this.display = 'inherit';
    }
    this._hidden = hidden;
    this.detectRef.detectChanges();
  }


  show() {
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }


  get disable(): boolean {
    return this.disabled;
  }

  set disable(opts: boolean) {
    this.disabled = opts;
    this.detectRef.detectChanges();
  }

  constructor(
    protected detectRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.inited = true;
    this.trigger('onInit', this);
  }

  ngOnDestroy() {
    this.trigger('onDestroy', this);
    this.detectRef.detach();
    this.onDestroy();
  }

  ngAfterViewChecked() {
    this.trigger('afterViewChecked', this);
  }
  ngAfterViewInit() {
    this.trigger('afterViewInit', this);
  }
  ngAfterContentInit() {
    this.trigger('afterContentInit', this);
  }
  ngAfterContentChecked() {
    this.trigger('afterContentChecked', this);
    // this.detectRef.detectChanges();
  }

  ngDoCheck() {
     this.trigger('doCheck', this);
    this.checkExpressionChange();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.trigger('onChanges', changes);
  }

  public initFieldExpression(config: any) {
    if (config.expressionProperties) {
      for (const key in config.expressionProperties as any) {
        if (typeof config.expressionProperties[key] === 'string' || _.isFunction(config.expressionProperties[key])) {
          // cache built expression
          config.expressionProperties[key] = {
            expression: _.isFunction(config.expressionProperties[key]) ? config.expressionProperties[key] : Dui.evalStringExpression(config.expressionProperties[key], ['comp', 'owner']),
            expressionValueSetter: Dui.evalExpressionValueSetter(key, ['expressionValue', 'comp', 'owner']),
          };
        }
      }
    }
    if (config.hideExpression) {
      if (typeof config.hideExpression === 'string') {
        config.hideExpression = Dui.evalStringExpression(config.hideExpression, ['comp', 'owner']);
      }
    }
  }

  public checkExpressionChange() {
    this.checkCompExpressionChange(this, this.ownerCt);
    this.checkCompVisibilityChange(this, this.ownerCt);
  }

  public checkCompExpressionChange(comp: ComponentBase, owner: ComponentBase) {
    if (!comp || !comp.expressionProperties) {
      return;
    }
    const expressionProperties = comp.expressionProperties;
    for (const key in expressionProperties) {
      const expressionValue = Dui.evalExpression(
        expressionProperties[key].expression,
        { comp },
        [comp, owner],
      );
      if (
        expressionProperties[key].expressionValue !== expressionValue
        && (!_.isObjectLike(expressionValue) || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue))
      ) {
        expressionProperties[key].expressionValue = expressionValue;
        Dui.evalExpression(
          expressionProperties[key].expressionValueSetter,
          { comp },
          [expressionValue, comp, owner],
        );
      }
    }
  }

  public checkCompVisibilityChange(comp: ComponentBase, owner: ComponentBase) {
    if (!comp || !comp.hideExpression) {
      return;
    }
    const hideExpressionResult: boolean = !!Dui.evalExpression(
      comp.hideExpression,
      { comp },
      [comp, owner],
    );
    if (hideExpressionResult !== comp.hidden) {
      comp.hidden = hideExpressionResult;
    }
  }

  init(config: any) {
    config = config || {};
    this.initFieldExpression(config);
    Dui.apply(this, config);

    this.initComponent();
    if (this.plugins) {
      if (Array.isArray(this.plugins)) {
        for (let i = 0, len = this.plugins.length; i < len; i++) {
          this.plugins[i] = this.initPlugin(this.plugins[i]);
        }
      } else {
        this.plugins = this.initPlugin(this.plugins);
      }
    }
    if (this.inited) {
      if (config.listeners && config.listeners.onInit != undefined) {
        this.trigger('onInit', this);
        this.trigger('afterViewInit', this);
        this.trigger('afterContentInit', this);
      }
    }
    this.trigger('change', this);
  }

  initComponent() {
    if (this.listeners) {
      let e, oe;
      for (e in this.listeners) {
        oe = this.listeners[e];
        this.addEventListener(e, oe.fn || oe);
      }
      delete this.listeners;
    }
  }
  initPlugin(p) {
    if (p.ptype && !_.isFunction(p.init)) {
      p = Dui.createPlugin(p);
    } else {
      if (_.isString(p)) {
        p = Dui.createPlugin({ ptype: p });
      }
    }
    p.init(this);
    return p;
  }
  public override on(eventName: string, handler: Function): void {
    this.addEventListener(eventName, handler);
  }

  public override off(eventName: string, handler: Function): void {
    this.removeEventListener(eventName, handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAdded(container, pos) {
    this.ownerCt = container;
  }

  onRemoved() {
    delete this.ownerCt;
  }

  getXType(): string {
    return this.xtype;
  }

  isXType(comp: any, shallow: boolean) {
    let xtype;
    if (_.isFunction(comp)) {
      xtype = comp['xtype'];
    } else {
      if (_.isObjectLike(xtype)) {
        xtype = comp.constructor.xtype;
      }
    }
    return !shallow ? ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') !== -1 : this.xtype === xtype;
  }

  getXTypes() {
    const tc: any = this.constructor;
    if (!tc.xtypes) {
      const c = [];
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let sc: any = this;
      while (sc && sc.constructor.xtype) {
        c.unshift(sc.constructor.xtype);
        sc = sc.constructor.superclass;
      }
      tc.xtypeChain = c;
      tc.xtypes = c.join('/');
    }
    return tc.xtypes;
  }

  findParentBy(fn: Function) {
    let p;
    for (p = this.ownerCt; (p !== null) && !fn(p, this); p = p.ownerCt) { }
    return p || null;
  }

  findParentByType(xtype: string | ComponentBase | Object, shallow: boolean) {
    return this.findParentBy(
      function (c) {
        return c.isXType(xtype, shallow);
      });
  }

  nextSibling(): any {
    if (this.ownerCt) {
      const index = this.ownerCt.items.indexOf(this);
      if (index !== -1 && index + 1 < this.ownerCt.items.getCount()) {
        return this.ownerCt.items.itemAt(index + 1);
      }
    }
    return null;
  }

  previousSibling(): any {
    if (this.ownerCt) {
      const index = this.ownerCt.items.indexOf(this);
      if (index > 0) {
        return this.ownerCt.items.itemAt(index - 1);
      }
    }
    return null;
  }

  protected getModuleName(): string { return this.xtype };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onPropertyChanged(newProperties: Object, oldProperties?: Object): void {
    this.init(newProperties);
  };
  // private
  public beforeDestroy() { }

  // private
  public onDestroy() { }
}
