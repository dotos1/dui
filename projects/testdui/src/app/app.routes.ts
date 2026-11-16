/**
 * @fileoverview Module `projects/testdui/src/app/app.routes.ts` providing app routes definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/app.routes.ts`，提供approutes相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app` 中的routes。
 */
export const routes: Routes = [
  {
    path: 'm2-parity',
    loadChildren: () => import('./m2-parity/m2-parity.module').then(m => m.M2ParityModule),
  },
  {
    path: 'color',
    loadChildren: () => import('./color/testcolor.module').then(m => m.TestColorModule),
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./tutorial/tutorial.module').then(m => m.TutorialModule),
  },
  {
    path: 'components',
    loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule),
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
];
/**
 * Angular module `AppRoutingModule` declaring and exporting app routing module components, directives, pipes, and providers.
 * @zh Angular 模块 `AppRoutingModule`，声明并导出AppRouting模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
