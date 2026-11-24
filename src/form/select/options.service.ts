/**
 * @fileoverview Module `src/form/select/options.service.ts` providing options service definitions and implementation.
 * @zh 模块文件 `src/form/select/options.service.ts`，提供配置选项服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import { errorText } from '@dotos1/dui/net';
import { Observable } from 'rxjs';
import { SelectOption } from './select.field';

/**
 * Class `SelectOptionsResult` encapsulating select options result data structures and logic in `src/form/select`.
 * @zh 类 `SelectOptionsResult`，封装 `src/form/select` 中的下拉选择配置选项结果数据结构与处理逻辑。
 */
export class SelectOptionsResult {
  /**
   * Property `options` (`SelectOption[]`) storing options.
   * @zh 属性 `options`（类型：`SelectOption[]`），用于存储或配置配置选项。
   */
  options: SelectOption[];
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
 * Injectable Angular service `SelectOptionsService` managing select options service state and operations in `src/form/select`.
 * @zh 可注入的 Angular 服务 `SelectOptionsService`，管理 `src/form/select` 中的下拉选择配置选项服务状态与业务操作。
 */
@Injectable()
export class SelectOptionsService {
  /**
   * Property `optionsSubject` (`BehaviorSubject<SelectOptionsResult>`) storing options subject (default: `new BehaviorSubject(null)`).
   * @zh 属性 `optionsSubject`（类型：`BehaviorSubject<SelectOptionsResult>`），用于存储或配置配置选项主题流（默认值：`new BehaviorSubject(null)`）。
   */
  private optionsSubject: BehaviorSubject<SelectOptionsResult> = new BehaviorSubject(null);
  /**
   * Property `options` (`Observable<SelectOptionsResult>`) storing options (default: `this.optionsSubject.asObservable()`).
   * @zh 属性 `options`（类型：`Observable<SelectOptionsResult>`），用于存储或配置配置选项（默认值：`this.optionsSubject.asObservable()`）。
   */
  options: Observable<SelectOptionsResult> = this.optionsSubject.asObservable();

  /**
   * Creates an instance of `SelectOptionsService` and initializes its dependencies and internal state.
   * @zh 创建 `SelectOptionsService` 实例，并初始化其依赖项与内部状态。
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
    let ops: SelectOption[] = [];
    if((method || 'POST').toUpperCase()=='GET'){
      this.http.get(url,{
        params: params
      }).subscribe((val:{ success?; data?; message? }) => {
          if (val && val.success){
            ops=val.data;
            this.optionsSubject.next({options: ops, params: params, error: null });
          }else{
            this.optionsSubject.next({options: [], params: params, error: (val && val.message) || errorText('ERROR.UNKNOWN')});
          }
        },
        error => {
          this.optionsSubject.next({options: [], params: params, error: error});
        }
      );
    }else{
      this.http.post(url, params, {
        params: params,
        responseType: 'json'
      }).subscribe( (val: { success?; data?; message? }) => {
        if (val && val.success){
             ops=val.data;
             this.optionsSubject.next({options: ops, params: params, error: null });
        }else{
             this.optionsSubject.next({options: [], params: params, error: (val && val.message) || errorText('ERROR.UNKNOWN')});
        };
      },
      error => {
        this.optionsSubject.next({options: [], params: params, error: error});
      });
    }
  }
  /**
   * Executes `setOptions` to handle set options.
   * @zh 执行 `setOptions`，用于集合配置选项。
   * @param opts - opts parameter (`any`) / 选项列表参数（`any`）
   */
  setOptions(opts){
    this.optionsSubject.next({options: opts, params: {}, error: null });
  }
}
