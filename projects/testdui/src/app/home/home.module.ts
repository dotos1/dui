/**
 * @fileoverview Module `projects/testdui/src/app/home/home.module.ts` providing home module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/home/home.module.ts`，提供home模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { HighlightModule } from '@dotos1/dui/ux/highlight';
import { TranslateModule } from '@dotos1/dui/translator';

import { HomePageComponent } from './pages/home-page/home-page.component';

/**
 * Constant/variable `homeRoutes` defining home routes in `projects/testdui/src/app/home`.
 * @zh 常量/变量 `homeRoutes`，定义 `projects/testdui/src/app/home` 中的homeRoutes。
 */
const homeRoutes: Routes = [
  { path: '', component: HomePageComponent },
];

/**
 * Angular module `HomeModule` declaring and exporting home module components, directives, pipes, and providers.
 * @zh Angular 模块 `HomeModule`，声明并导出Home模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    HighlightModule,
    TranslateModule.forChild(),
  ],
})
export class HomeModule {}
