/**
 * @fileoverview Module `src/common/dynamic/extensions.module.ts` providing extensions module definitions and implementation.
 * @zh 模块文件 `src/common/dynamic/extensions.module.ts`，提供extensions模块相关的定义与实现。
 */



import { DynamicExtensionComponent } from './dynamic.component';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
/**
 * Angular module `ExtensionsModule` declaring and exporting extensions module components, directives, pipes, and providers.
 * @zh Angular 模块 `ExtensionsModule`，声明并导出Extensions模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports:[
    MatMenuModule
  ],
  declarations: [
    DynamicExtensionComponent
  ],
  exports: [
    DynamicExtensionComponent
  ]
})
export class ExtensionsModule {

}
