import { ChangeDetectorRef, ComponentFactoryResolver, DoCheck, Injectable, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentBase, Dui } from '@dotos/dui/core';
import * as _ from 'lodash-es';
import { MenuBarItem, MenuModel } from './menu-model';
@Injectable()
export abstract class MenuBase implements DoCheck{

  @Input() set children(c) {
    this._children = c;
  }
  get children() {
    return this._children;
  }
  protected _children: MenuModel[] = [];

  ownerCt: any;

  items: MenuBarItem[] = [];

  constructor(
    protected router: Router,
    public changeDetectorRef: ChangeDetectorRef,
    protected resolver: ComponentFactoryResolver,
    protected injector: Injector) {
  }

  init(config: any) {
    if (config && config.children) {
      this.children = config.children;
    }
  }
  ngDoCheck() {
    this.doCheck();
    this.checkExpressionChange();
    this.changeDetectorRef.markForCheck();
  }
  public initFieldExpression(config: any) {
    if (config.expressionProperties) {
      for (const key in config.expressionProperties as any) {
        if (typeof config.expressionProperties[key] === 'string' || _.isFunction(config.expressionProperties[key])) {
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
    if (config.disableExpression) {
      if (typeof config.disableExpression === 'string') {
        config.disableExpression = Dui.evalStringExpression(config.disableExpression, ['comp', 'owner']);
      }
    }
  }

  public doCheck() {
    
    if (this.children) {
      if (this.children.length != 0) {
        this.children.forEach(item => {
          if (item.doCheck) {
            item.doCheck(item);
          }
        });
      }
    }
    if (this.items) {
      if (this.items.length != 0) {
        this.items.forEach(item => {
          if (item.doCheck) {
            item.doCheck(item);
          }
        });
      }
    }
  }
  public checkExpressionChange() {
    if (this.children && this.children.length != 0) {
      this.children.forEach(item => {
        this.checkMenuExpressionChange(item, this.ownerCt);
        this.checkMenuVisibilityChange(item, this.ownerCt);
        this.checkMenuDisableChange(item, this.ownerCt);
      });
    }

    if (this.items && this.items.length != 0) {

      this.items.forEach(item => {
        this.checkMenuExpressionChange(item, this.ownerCt);
        this.checkMenuVisibilityChange(item, this.ownerCt);
        this.checkMenuDisableChange(item, this.ownerCt);
      });
    }
  }

  public checkMenuExpressionChange(comp: MenuModel, owner: ComponentBase) {
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
  public checkMenuVisibilityChange(comp: MenuModel, owner: ComponentBase) {
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
  public checkMenuDisableChange(comp: MenuModel, owner: ComponentBase) {
    if (!comp || !comp.disableExpression) {
      return;
    }
    const disableExpressionResult: boolean = !!Dui.evalExpression(
      comp.disableExpression,
      { comp },
      [comp, owner],
    );
    if (disableExpressionResult !== comp.disable) {
      comp.disable = disableExpressionResult;
    }
  }
}
