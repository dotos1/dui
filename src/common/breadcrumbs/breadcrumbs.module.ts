/**
 * @fileoverview Module `src/common/breadcrumbs/breadcrumbs.module.ts` providing breadcrumbs module definitions and implementation.
 * @zh 模块文件 `src/common/breadcrumbs/breadcrumbs.module.ts`，提供面包屑导航模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

/**
 * Angular module `BreadcrumbsModule` declaring and exporting breadcrumbs module components, directives, pipes, and providers.
 * @zh Angular 模块 `BreadcrumbsModule`，声明并导出面包屑导航模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [BreadcrumbsComponent, BreadcrumbComponent],
  exports: [BreadcrumbsComponent, BreadcrumbComponent],
})
export class BreadcrumbsModule {}
