/**
 * @fileoverview Module `src/form/action/submit.service.ts` providing submit service definitions and implementation.
 * @zh 模块文件 `src/form/action/submit.service.ts`，提供提交服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormAction } from './action.service';
import { LoadingService } from '@dotos/dui/common/loading';

/**
 * Injectable Angular service `Submit` managing submit state and operations in `src/form/action`.
 * @zh 可注入的 Angular 服务 `Submit`，管理 `src/form/action` 中的提交状态与业务操作。
 */
@Injectable()
export class Submit extends FormAction {

  /**
   * Property `failureType` (`any`) storing failure type.
   * @zh 属性 `failureType`（类型：`any`），用于存储或配置failure类型。
   */
  override failureType;

  /**
   * Property `type` (`string`) storing type (default: `'submit'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'submit'`）。
   */
  public override type = 'submit';

  /**
   * Creates an instance of `Submit` and initializes its dependencies and internal state.
   * @zh 创建 `Submit` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param loadingService - Injected or initial loading service (`LoadingService`) / 注入或传入的加载中服务（`LoadingService`）
   */
  constructor(protected override http: HttpClient,
    public override loadingService: LoadingService) {
    super(http,loadingService);
  }

  /**
   * Executes `run` to handle run.
   * @zh 执行 `run`，用于运行。
   * @returns Result of type `Promise<any>` / 类型为 `Promise<any>` 的返回值
   */
  public override run()  {
    const o = this.options;
    this.loadingService.register();
    return new Promise((resolve, reject) => {
      this.http.post(this.getUrl(), this.form.getValues(), {
        headers: o.headers,
        params: this.getParams(),
        responseType: 'json'
      }).subscribe( (val: { success?: boolean }) => {
        if (val.success) {
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
      });
    });
  }

  /**
   * Executes `success` to handle success.
   * @zh 执行 `success`，用于成功。
   * @param result - result parameter (`any`) / 结果参数（`any`）
   */
  public override success(result) {
    this.result = result;
    this.loadingService.resolve();
    if (result === true || result.success) {
      this.form.afterAction(this, result, true);
      return;
    }
    if (result.errors) {
      this.form.markInvalid(result.errors);
    }
    this.failureType = FormAction.SERVER_INVALID;
    this.form.afterAction(this, result, false);
  }
}
