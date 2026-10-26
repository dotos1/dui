/**
 * @fileoverview Module `projects/testdui/src/app/docs/docs-routing.module.ts` providing docs routing module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/docs-routing.module.ts`，提供文档routing模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { docsRoutes } from './docs.routes';

/**
 * Angular module `DocsRoutingModule` declaring and exporting docs routing module components, directives, pipes, and providers.
 * @zh Angular 模块 `DocsRoutingModule`，声明并导出文档Routing模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [RouterModule.forChild(docsRoutes)],
  exports: [RouterModule],
})
export class DocsRoutingModule {}
