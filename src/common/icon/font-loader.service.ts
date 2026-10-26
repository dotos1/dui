/**
 * @fileoverview Module `src/common/icon/font-loader.service.ts` providing font loader service definitions and implementation.
 * @zh 模块文件 `src/common/icon/font-loader.service.ts`，提供字体加载器服务相关的定义与实现。
 */

import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@dotos/dui/translator';
import { of } from 'rxjs';

/**
 * Constant/variable `FontFace` defining font face in `src/common/icon`.
 * @zh 常量/变量 `FontFace`，定义 `src/common/icon` 中的字体Face。
 */
declare const FontFace;
/**
 * Constant/variable `document` defining document in `src/common/icon`.
 * @zh 常量/变量 `document`，定义 `src/common/icon` 中的文档对象。
 */
declare const document;

/**
 * Injectable Angular service `FontLoaderService` managing font loader service state and operations in `src/common/icon`.
 * @zh 可注入的 Angular 服务 `FontLoaderService`，管理 `src/common/icon` 中的字体加载器服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class FontLoaderService {
  /**
   * Property `fontSet` (`Set<string>`) storing font set (default: `new Set<string>()`).
   * @zh 已加载过的字体名称集合，避免重复加载。
   * @zh 已加载过的字体名称集合，避免重复加载。
   */
  public  fontSet:Set<string>=new Set<string>();

  /**
   * Creates an instance of `FontLoaderService` and initializes its dependencies and internal state.
   * @zh 创建 `FontLoaderService` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param _apiBase - Injected or initial api base (`string`) / 注入或传入的API接口基础（`string`）
   */
  constructor(
    protected translate: TranslateService,
    @Inject('apiBase') private _apiBase: string) {
  }

  /**
   * Loads a custom web font (via the `FontFace` API) by name/URL/weight, skipping if already loaded.
   * @zh 通过 `FontFace` API 按名称/URL/字重加载自定义 Web 字体，若已加载过则跳过。
   */
  loadFonts(name:string,url: string, weight: number){
    if(this.fontSet.has(name)){
      return of(name).toPromise();
    }else{
      let ff = new FontFace(name, "url(" + url + ")", { style: 'normal', weight: weight });
      document.fonts.add(ff);
      return ff.load();
    }
  }
}
