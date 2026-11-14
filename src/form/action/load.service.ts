/**
 * @fileoverview Module `src/form/action/load.service.ts` providing load service definitions and implementation.
 * @zh 模块文件 `src/form/action/load.service.ts`，提供加载服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormAction } from './action.service';
import { LoadingService } from '@dotos/dui/common/loading';

/**
 * Injectable Angular service `Load` managing load state and operations in `src/form/action`.
 * @zh 可注入的 Angular 服务 `Load`，管理 `src/form/action` 中的加载状态与业务操作。
 */
@Injectable()
export class Load extends FormAction {
  /**
   * Property `reader` (`any`) storing reader.
   * @zh 属性 `reader`（类型：`any`），用于存储或配置读取器。
   */
  reader;
  /**
   * Property `failureType` (`any`) storing failure type.
   * @zh 属性 `failureType`（类型：`any`），用于存储或配置failure类型。
   */
  declare failureType;
  /**
   * Property `type` (`string`) storing type (default: `'load'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'load'`）。
   */
  public override type = 'load';

  /**
   * Creates an instance of `Load` and initializes its dependencies and internal state.
   * @zh 创建 `Load` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param loadingService - Injected or initial loading service (`LoadingService`) / 注入或传入的加载中服务（`LoadingService`）
   */
  constructor(
    protected override http: HttpClient,
    public override loadingService: LoadingService) {
    super(http,loadingService);
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param form - form parameter (`any`) / 表单参数（`any`）
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @returns Result of type `FormAction` / 类型为 `FormAction` 的返回值
   */
  override init(form, options): FormAction {
    this.reader = form.reader;
    return super.init(form, options);
  }

  /**
   * Executes `run` to handle run.
   * @zh 执行 `run`，用于运行。
   * @returns Result of type `Promise<unknown>` / 类型为 `Promise<unknown>` 的返回值
   */
  public override run()  {
    this.loadingService.register();
    return new Promise((resolve, reject) => { this.http.get(this.getUrl(),
      {
        headers: this.options.headers,
        params: this.getParams(),
        responseType: 'json'
      }).subscribe(
        val => {
          if (val['success']) {
            this.success(val);
            resolve(val);
          }else {
            this.failure(val);
            reject(val);
          }
        },
        error => {
          this.failure(error);
          reject(error);
        }
      );
    });
  }

  /**
   * Executes `success` to handle success.
   * @zh 执行 `success`，用于成功。
   * @param result - result parameter (`any`) / 结果参数（`any`）
   */
  public override success(result) {
    this.loadingService.resolve();
    if (result === true || !result.success || !result.data) {
      this.failureType = FormAction.LOAD_FAILURE;
      this.form.afterAction(this, result, false);
      return;
    }
    if(result.field){
      this.form.updateField(result.field);
    }
    this.form.setValues(result.data);
    this.form.clearInvalid();
    this.form.afterAction(this, result, true);
  }
}
