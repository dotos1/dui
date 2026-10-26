/**
 * @fileoverview Module `src/form/field/options.service.ts` providing options service definitions and implementation.
 * @zh 模块文件 `src/form/field/options.service.ts`，提供配置选项服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import { Observable } from 'rxjs';

/**
 * Class `OptionsResult` encapsulating options result data structures and logic in `src/form/field`.
 * @zh 类 `OptionsResult`，封装 `src/form/field` 中的配置选项结果数据结构与处理逻辑。
 */
export class OptionsResult {
  /**
   * Property `options` (`string[]`) storing options.
   * @zh 属性 `options`（类型：`string[]`），用于存储或配置配置选项。
   */
  options: string[];
  /**
   * Property `params` (`{}`) storing params.
   * @zh 属性 `params`（类型：`{}`），用于存储或配置参数集合。
   */
  params: {};
  /**
   * Property `error` (`string`) storing error.
   * @zh 属性 `error`（类型：`string`），用于存储或配置错误。
   */
  error: string;
}

/**
 * Injectable Angular service `OptionsService` managing options service state and operations in `src/form/field`.
 * @zh 可注入的 Angular 服务 `OptionsService`，管理 `src/form/field` 中的配置选项服务状态与业务操作。
 */
@Injectable()
export class OptionsService {
  /**
   * Property `optionsSubject` (`BehaviorSubject<OptionsResult>`) storing options subject (default: `new BehaviorSubject(null)`).
   * @zh 属性 `optionsSubject`（类型：`BehaviorSubject<OptionsResult>`），用于存储或配置配置选项主题流（默认值：`new BehaviorSubject(null)`）。
   */
  private optionsSubject: BehaviorSubject<OptionsResult> = new BehaviorSubject(null);
  /**
   * Property `options` (`Observable<OptionsResult>`) storing options (default: `this.optionsSubject.asObservable()`).
   * @zh 属性 `options`（类型：`Observable<OptionsResult>`），用于存储或配置配置选项（默认值：`this.optionsSubject.asObservable()`）。
   */
  options: Observable<OptionsResult> = this.optionsSubject.asObservable();

  /**
   * Creates an instance of `OptionsService` and initializes its dependencies and internal state.
   * @zh 创建 `OptionsService` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   */
  constructor(protected http: HttpClient) { }

  /**
   * Executes `getOptions` to handle get options.
   * @zh 执行 `getOptions`，用于获取配置选项。
   * @param url - url parameter (`string`) / 链接地址参数（`string`）
   * @param method - method parameter (`string`) / 方法参数（`string`）
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   */
  getOptions(url:string,method:string,params) {
    let ops: string[] = [];
    if((method || 'POST').toUpperCase()=='GET'){
      this.http.get(url,{
        params: params,
        responseType: 'json'
      }).subscribe((val:{ success?; result?; message? }) => {
          if (val && val.success){
            ops=val.result;
            this.optionsSubject.next({options: ops, params: params, error: null });
          }else{
            this.optionsSubject.next({options: [], params: params, error: val ? val.message : 'Error'});
          }
        },
        error =>{
          this.optionsSubject.next({options: [], params: params, error: error});
        }
      );
    }else{
      this.http.post(url, params, {
        params: params,
        responseType: 'json'
      }).subscribe( (val: { success?; result?; message? }) => {
        if (val && val.success){
             ops=val.result;
             this.optionsSubject.next({options: ops, params: params, error: null });
        }else{
             this.optionsSubject.next({options: [], params: params, error: val ? val.message : 'Error'});
        };
      },
      error => {
           this.optionsSubject.next({options: [], params: params, error: error});
      });
    }
  }
}
