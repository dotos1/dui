/**
 * @fileoverview Module `src/core/dynamic/dynamic.module.ts` providing dynamic module definitions and implementation.
 * @zh 模块文件 `src/core/dynamic/dynamic.module.ts`，提供动态模块相关的定义与实现。
 */


import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicComponent } from "./dynamic.component";
import { FlexLayoutModule } from "ngx-flexible-layout";
import { TranslateModule } from "@dotos/dui/translator";
import { SafeurlPipe } from "./safeurl.pipe";

/**
 * Angular module `DynamicModule` declaring and exporting dynamic module components, directives, pipes, and providers.
 * @zh Angular 模块 `DynamicModule`，声明并导出动态模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [  CommonModule,FlexLayoutModule,TranslateModule],
  declarations: [DynamicComponent, SafeurlPipe],
  exports: [
    DynamicComponent,
    SafeurlPipe
  ],
  providers:[SafeurlPipe]
})
export class DynamicModule {}
