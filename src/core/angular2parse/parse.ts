/**
 * @fileoverview Module `src/core/angular2parse/parse.ts` providing parse definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/parse.ts`，提供解析相关的定义与实现。
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Parser, Lexer, ASTWithSource } from './angular';
import { ParseVisitorResolver, ParseVisitorCompiler } from './visitors';

/**
 * Angular dependency-injection token `PIPES_CONFIG` for providing pipes config.
 * @zh Angular 依赖注入令牌 `PIPES_CONFIG`，用于提供与注入管道配置。
 */
export const PIPES_CONFIG = new InjectionToken('PipesConfig');

/**
 * Interface `PipesConfig` defining the contract and properties for pipes config.
 * @zh 接口 `PipesConfig`，定义管道配置的数据结构契约与属性规范。
 */
export interface PipesConfig {
  /**
   * Property `pipeName` (`string`) storing pipe name.
   * @zh 属性 `pipeName`（类型：`string`），用于存储或配置管道名称。
   */
  pipeName: string;
  /**
   * Property `pipeInstance` (`any`) storing pipe instance.
   * @zh 属性 `pipeInstance`（类型：`any`），用于存储或配置管道实例。
   */
  pipeInstance;
}

/**
 * Injectable Angular service `Parse` managing parse state and operations in `src/core/angular2parse`.
 * @zh 可注入的 Angular 服务 `Parse`，管理 `src/core/angular2parse` 中的解析状态与业务操作。
 */
@Injectable({providedIn: 'root'})
export class Parse {
  /**
   * Property `_parser` (`Parser`) storing parser (default: `new Parser(new Lexer())`).
   * @zh 属性 `_parser`（类型：`Parser`），用于存储或配置解析器（默认值：`new Parser(new Lexer())`）。
   */
  private _parser: Parser = new Parser(new Lexer());
  /**
   * Property `_pipesCache` (`Map<string, unknown>`) storing pipes cache (default: `new Map<string, any>()`).
   * @zh 属性 `_pipesCache`（类型：`Map<string, unknown>`），用于存储或配置管道缓存（默认值：`new Map<string, any>()`）。
   */
  private _pipesCache = new Map<string, unknown>();
  /**
   * Property `_evalCache` (`Map<string, Function>`) storing eval cache (default: `new Map<string, Function>()`).
   * @zh 属性 `_evalCache`（类型：`Map<string, Function>`），用于存储或配置eval缓存（默认值：`new Map<string, Function>()`）。
   */
  private _evalCache: Map<string, Function> = new Map<string, Function>();
  /**
   * Property `_calcCache` (`Map<string, Function>`) storing calc cache (default: `new Map<string, Function>()`).
   * @zh 属性 `_calcCache`（类型：`Map<string, Function>`），用于存储或配置计算缓存（默认值：`new Map<string, Function>()`）。
   */
  private _calcCache: Map<string, Function> = new Map<string, Function>();

  /**
   * Used to dependency inject the Angular 2 parser.

   * @zh 创建 `Parse` 实例，并初始化其依赖项与内部状态。
   */

  constructor(@Optional() @Inject(PIPES_CONFIG) pipesConfigs: PipesConfig[][]) {
    if (pipesConfigs && pipesConfigs.length) {
      pipesConfigs
        .filter(pipes => pipes && pipes.length)
        .forEach(pipes => pipes.forEach((pipeData) => this._pipesCache.set(pipeData.pipeName, pipeData.pipeInstance)));
    }
  }

  /**
   * Executes `eval` to handle eval.
   * @zh 执行 `eval`，用于求值。
   * @param expression - expression parameter (`string`) / 表达式参数（`string`）
   * @returns Result of type `Function` / 类型为 `Function` 的返回值
   */
  eval(expression: string): Function {
    if (this._evalCache.has(expression)) {
      return this._evalCache.get(expression);
    }

    const visitor = new ParseVisitorCompiler();

    let ast: ASTWithSource = this._parser.parseInterpolation(expression, 'Parse');

    if (!ast) {
      ast = this._parser.parseBinding(expression, 'Parse');
    }

    const fnBody = ast.visit(visitor);
    const pipesCache = this._pipesCache;
    const getFn = new Function('context', 'pipesCache', `return ${fnBody};`);

    const evalParse = function evalParse(context) {
      return getFn(context, pipesCache);
    };

    this._evalCache.set(expression, evalParse);

    return evalParse;
  }

  /**
   * Executes `calc` to handle calc.
   * @zh 执行 `calc`，用于计算。
   * @param expression - expression parameter (`string`) / 表达式参数（`string`）
   * @returns Result of type `Function` / 类型为 `Function` 的返回值
   */
  calc(expression: string): Function {
    if (this._calcCache.has(expression)) {
      return this._calcCache.get(expression);
    }

    const visitor = new ParseVisitorResolver(this._pipesCache);

    let ast: ASTWithSource = this._parser.parseInterpolation(expression, 'Parse');

    if (!ast) {
      ast = this._parser.parseBinding(expression, 'Parse');
    }

    const calcParse = function calcParse(context) {
      return ast.visit(visitor, context);
    };

    this._calcCache.set(expression, calcParse);

    return calcParse;
  }
}
