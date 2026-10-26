/**
 * @fileoverview Module `src/core/services/services.module.ts` providing services module definitions and implementation.
 * @zh 模块文件 `src/core/services/services.module.ts`，提供服务模块相关的定义与实现。
 */


import { NgModule } from '@angular/core';
import { CookieService } from './cookie.service';
import { HighlightTransformService } from './highlight-transform.service';
import { LogService } from './log.service';
import { ScriptLoaderService } from './script-loader.service';
import { ShareParamService } from './share-param.service';

/**
 * Angular module `CommonServicesModule` declaring and exporting common services module components, directives, pipes, and providers.
 * @zh Angular 模块 `CommonServicesModule`，声明并导出通用服务模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  providers: [
    CookieService,
    HighlightTransformService,
    LogService,
    ShareParamService,
    ScriptLoaderService],
})
export class CommonServicesModule { }
