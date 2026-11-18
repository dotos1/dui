/**
 * @fileoverview Module `src/common/colorpicker/components/google/google-color.services.ts` providing google color services definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/google/google-color.services.ts`，提供google颜色服务相关的定义与实现。
 */

import {Injectable} from "@angular/core";
import { LocalStorageService } from '@dotos1/dui/core/storage';
/**
 * Injectable Angular service `GoogleColorService` managing google color service state and operations in `src/common/colorpicker/components/google`.
 * @zh 可注入的 Angular 服务 `GoogleColorService`，管理 `src/common/colorpicker/components/google` 中的Google颜色服务状态与业务操作。
 */
@Injectable()
export class GoogleColorService {
 /**
  * Property `customcolors` (`string[]`) storing customcolors (default: `['#cf1717' ]`).
  * @zh 属性 `customcolors`（类型：`string[]`），用于存储或配置customcolors（默认值：`['#cf1717' ]`）。
  */
 public customcolors = ['#cf1717' ];
 /**
  * Property `version` (`number`) storing version (default: `0`).
  * @zh 属性 `version`（类型：`number`），用于存储或配置version（默认值：`0`）。
  */
 public version =0;
 /**
  * Creates an instance of `GoogleColorService` and initializes its dependencies and internal state.
  * @zh 创建 `GoogleColorService` 实例，并初始化其依赖项与内部状态。
  * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
  */
 constructor( 
    public localStore: LocalStorageService) {
      if(localStore.get('google-custom-colors')){
         this.customcolors=localStore.get('google-custom-colors');
      }
 }

 /**
  * Executes `addCustom` to handle add custom.
  * @zh 执行 `addCustom`，用于添加自定义。
  * @param color - color parameter (`any`) / 颜色参数（`any`）
  */
 addCustom(color) {
    this.customcolors.push(color);
    this.localStore.set('google-custom-colors', this.customcolors);
    this.version++;
 }
}