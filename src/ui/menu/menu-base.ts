/**
 * @fileoverview Module `src/ui/menu/menu-base.ts` providing menu base definitions and implementation.
 * @zh 模块文件 `src/ui/menu/menu-base.ts`，提供菜单基础相关的定义与实现。
 */

import { ChangeDetectorRef, DoCheck, Injectable, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentBase, Dui } from '@dotos1/dui/core';
import {isFunction,isObjectLike}  from 'lodash-es';
import { MenuBarItem, MenuModel } from './menu-model';
/**
 * Injectable Angular service `MenuBase` managing menu base state and operations in `src/ui/menu`.
 * @zh 可注入的 Angular 服务 `MenuBase`，管理 `src/ui/menu` 中的菜单基础状态与业务操作。
 */
@Injectable()
export abstract class MenuBase implements DoCheck{

  /**
   * Input setter `children` updating children.
   * @zh 输入属性 `children` 的设置器，用于更新子级列表。
   * @param c - New children value (`MenuModel[]`) / 新的子级列表值（`MenuModel[]`）
   */
  @Input() set children(c) {
    this._children = c;
  }
  /**
   * Gets the current children (`children: any`).
   * @zh 获取当前子级列表（`children: any`）。
   */
  get children() {
    return this._children;
  }
  /**
   * Property `_children` (`MenuModel[]`) storing children (default: `[]`).
   * @zh 属性 `_children`（类型：`MenuModel[]`），用于存储或配置子级列表（默认值：`[]`）。
   */
  protected _children: MenuModel[] = [];

  /**
   * Property `ownerCt` (`any`) storing owner ct.
   * @zh 属性 `ownerCt`（类型：`any`），用于存储或配置所属者Ct。
   */
  ownerCt;

  /**
   * Property `items` (`MenuBarItem[]`) storing items (default: `[]`).
   * @zh 属性 `items`（类型：`MenuBarItem[]`），用于存储或配置条目列表（默认值：`[]`）。
   */
  items: MenuBarItem[] = [];

  /**
   * Creates an instance of `MenuBase` and initializes its dependencies and internal state.
   * @zh 创建 `MenuBase` 实例，并初始化其依赖项与内部状态。
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  /**
   * Legacy compatibility placeholder for component factory resolver.
   * @zh 属性 `resolver`（类型：`unknown`），历史兼容占位字段。
   */
  protected resolver?: unknown;

  constructor(
    protected router: Router,
    public changeDetectorRef: ChangeDetectorRef,
    protected injector: Injector) {
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  init(config) {
    if (config && config.children) {
      this.children = config.children;
    }
  }
  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck() {
    this.doCheck();
    this.checkExpressionChange();
    this.changeDetectorRef.markForCheck();
  }
  /**
   * Executes `initFieldExpression` to handle init field expression.
   * @zh 执行 `initFieldExpression`，用于初始化字段表达式。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  public initFieldExpression(config) {
    if (config.expressionProperties) {
      for (const key in config.expressionProperties) {
        if (typeof config.expressionProperties[key] === 'string' || isFunction(config.expressionProperties[key])) {
          config.expressionProperties[key] = {
            expression: isFunction(config.expressionProperties[key]) ? config.expressionProperties[key] : Dui.evalStringExpression(config.expressionProperties[key], ['comp', 'owner']),
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

  /**
   * Executes `doCheck` to handle do check.
   * @zh 执行 `doCheck`，用于执行检查。
   */
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
  /**
   * Executes `checkExpressionChange` to handle check expression change.
   * @zh 执行 `checkExpressionChange`，用于检查表达式变更。
   */
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

  /**
   * Executes `checkMenuExpressionChange` to handle check menu expression change.
   * @zh 执行 `checkMenuExpressionChange`，用于检查菜单表达式变更。
   * @param comp - comp parameter (`MenuModel`) / 组件参数（`MenuModel`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
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
        && (!isObjectLike(expressionValue) || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue))
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
  /**
   * Executes `checkMenuVisibilityChange` to handle check menu visibility change.
   * @zh 执行 `checkMenuVisibilityChange`，用于检查菜单Visibility变更。
   * @param comp - comp parameter (`MenuModel`) / 组件参数（`MenuModel`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
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
  /**
   * Executes `checkMenuDisableChange` to handle check menu disable change.
   * @zh 执行 `checkMenuDisableChange`，用于检查菜单禁用变更。
   * @param comp - comp parameter (`MenuModel`) / 组件参数（`MenuModel`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
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
