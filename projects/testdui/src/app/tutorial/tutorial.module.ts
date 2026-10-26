/**
 * @fileoverview Module `projects/testdui/src/app/tutorial/tutorial.module.ts` providing tutorial module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/tutorial/tutorial.module.ts`，提供tutorial模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { HighlightModule } from '@dotos/dui/ux/highlight';
import { TranslateModule } from '@dotos/dui/translator';

import { TutorialPageComponent } from './pages/tutorial-page/tutorial-page.component';

/**
 * Constant/variable `tutorialRoutes` defining tutorial routes in `projects/testdui/src/app/tutorial`.
 * @zh 常量/变量 `tutorialRoutes`，定义 `projects/testdui/src/app/tutorial` 中的tutorialRoutes。
 */
const tutorialRoutes: Routes = [
  { path: '', component: TutorialPageComponent },
];

/**
 * Angular module `TutorialModule` declaring and exporting tutorial module components, directives, pipes, and providers.
 * @zh Angular 模块 `TutorialModule`，声明并导出Tutorial模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [TutorialPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(tutorialRoutes),
    MatTabsModule,
    HighlightModule,
    TranslateModule.forChild(),
  ],
})
export class TutorialModule {}
