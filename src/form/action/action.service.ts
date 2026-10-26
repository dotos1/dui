/**
 * @fileoverview Module `src/form/action/action.service.ts` providing action service definitions and implementation.
 * @zh 模块文件 `src/form/action/action.service.ts`，提供动作服务相关的定义与实现。
 */

import { HttpClient } from '@angular/common/http';
import { Load } from './load.service';
import { Submit } from './submit.service';
import { Dui } from '@dotos/dui/core';
import { LoadingService } from '@dotos/dui/common/loading';

/**
 * Type alias `ACTION_TYPES` representing action types (`{ 'load': Load; 'submit': Submit }`).
 * @zh 类型别名 `ACTION_TYPES`，表示动作类型列表（`{ 'load': Load; 'submit': Submit }`）。
 */
export type ACTION_TYPES = {
  /**
   * Property `load` (`Load`) storing load.
   * @zh 属性 `load`（类型：`Load`），用于存储或配置加载。
   */
  'load': Load;
  /**
   * Property `submit` (`Submit`) storing submit.
   * @zh 属性 `submit`（类型：`Submit`），用于存储或配置提交。
   */
  'submit': Submit
};

/**
 * Class `FormAction` encapsulating form action data structures and logic in `src/form/action`.
 * @zh 类 `FormAction`，封装 `src/form/action` 中的表单动作数据结构与处理逻辑。
 */
export class FormAction {

  /**
   * Property `CLIENT_INVALID` (`string`) storing client invalid (default: `'client'`).
   * @zh 属性 `CLIENT_INVALID`（类型：`string`），用于存储或配置CLIENT无效（默认值：`'client'`）。
   */
  public static CLIENT_INVALID: string = 'client';

  /**
   * Property `SERVER_INVALID` (`string`) storing server invalid (default: `'server'`).
   * @zh 属性 `SERVER_INVALID`（类型：`string`），用于存储或配置SERVER无效（默认值：`'server'`）。
   */
  public static SERVER_INVALID: string = 'server';

  /**
   * Property `CONNECT_FAILURE` (`string`) storing connect failure (default: `'connect'`).
   * @zh 属性 `CONNECT_FAILURE`（类型：`string`），用于存储或配置连接FAILURE（默认值：`'connect'`）。
   */
  public static CONNECT_FAILURE: string = 'connect';

  /**
   * Property `LOAD_FAILURE` (`string`) storing load failure (default: `'load'`).
   * @zh 属性 `LOAD_FAILURE`（类型：`string`），用于存储或配置加载FAILURE（默认值：`'load'`）。
   */
  public static LOAD_FAILURE: string = 'load';

  /**
   * Property `form` (`any`) storing form.
   * @zh 属性 `form`（类型：`any`），用于存储或配置表单。
   */
  public form;

  /**
   * Property `options` (`any`) storing options.
   * @zh 属性 `options`（类型：`any`），用于存储或配置配置选项。
   */
  public options;

  /**
   * Property `url` (`string`) storing url.
   * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
   */
  public url: string;


  /**
   * Property `method` (`string`) storing method.
   * @zh 属性 `method`（类型：`string`），用于存储或配置方法。
   */
  public method: string;

  /**
   * Property `params` (`any`) storing params.
   * @zh 属性 `params`（类型：`any`），用于存储或配置参数集合。
   */
  public params;

  /**
   * Property `timeout` (`number`) storing timeout.
   * @zh 属性 `timeout`（类型：`number`），用于存储或配置延时器。
   */
  public timeout: number;

  /**
   * Property `scope` (`any`) storing scope.
   * @zh 属性 `scope`（类型：`any`），用于存储或配置scope。
   */
  public scope;

  /**
   * Property `type` (`string`) storing type (default: `'default'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'default'`）。
   */
  public type: string = 'default';

  /**
   * Property `failureType` (`string`) storing failure type.
   * @zh 属性 `failureType`（类型：`string`），用于存储或配置failure类型。
   */
  public failureType: string;

  /**
   * Property `result` (`any`) storing result.
   * @zh 属性 `result`（类型：`any`），用于存储或配置结果。
   */
  public result;

  /**
   * Creates an instance of `FormAction` and initializes its dependencies and internal state.
   * @zh 创建 `FormAction` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param loadingService - Injected or initial loading service (`LoadingService`) / 注入或传入的加载中服务（`LoadingService`）
   */
  constructor(protected http: HttpClient,
    public loadingService: LoadingService) {

  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param form - form parameter (`any`) / 表单参数（`any`）
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @returns Result of type `FormAction` / 类型为 `FormAction` 的返回值
   */
  init(form, options): FormAction {
    this.form = form;
    this.options = options || {};
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `run` to handle run.
   * @zh 执行 `run`，用于运行。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   */
  public run(options) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `success` to handle success.
   * @zh 执行 `success`，用于成功。
   * @param result - result parameter (`any`) / 结果参数（`any`）
   */
  public success(result) {
  }
  /**
   * Executes `failure` to handle failure.
   * @zh 执行 `failure`，用于failure。
   * @param result - result parameter (`any`) / 结果参数（`any`）
   */
  public failure(result) {
    this.loadingService.resolve();
    this.result = result;
    this.failureType = FormAction.CONNECT_FAILURE;
    this.form.afterAction(this, result, false);
  }

  /**
   * Executes `getUrl` to handle get url.
   * @zh 执行 `getUrl`，用于获取链接地址。
   */
  public getUrl() {
    let url = this.options.url || this.form.url;
    return url;
  }
  /**
   * Executes `getMethod` to handle get method.
   * @zh 执行 `getMethod`，用于获取方法。
   */
  public getMethod() {
    return (this.options.method || this.form.method || 'POST').toUpperCase();
  }
  // private
  /**
   * Executes `getParams` to handle get params.
   * @zh 执行 `getParams`，用于获取参数集合。
   */
  public getParams() {
    const bp = this.form.baseParams;
    let p = this.options.params;
    if (p) {
      p = Dui.applyIf(p, bp);
    } else {
      if (bp) {
        p = bp;
      }
    }
    return p;
  }
  /**
   * Executes `createCallback` to handle create callback.
   * @zh 执行 `createCallback`，用于创建回调函数。
   * @param opt - opt parameter (`any`) / 选项参数（`any`）
   */
  public createCallback(opt?) {
    const opts = opt || {};
    let that = this;
    return {
      success: that.success,
      failure: that.failure,
      timeout: opts.timeout * 1000 || that.form.timeout * 1000, upload: that.form.fileUpload ? that.success : undefined
    };
  }
}
