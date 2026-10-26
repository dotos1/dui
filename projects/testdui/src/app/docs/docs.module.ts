/**
 * @fileoverview Module `projects/testdui/src/app/docs/docs.module.ts` providing docs module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/docs.module.ts`，提供文档模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MarkdownModule } from '@dotos/dui/ux/markdown';
import { HighlightModule } from '@dotos/dui/ux/highlight';

import { DocsRoutingModule } from './docs-routing.module';

import { DocsShellComponent } from './shell/docs-shell.component';
import { NavTreeComponent } from './shell/nav-tree/nav-tree.component';
import { DocsHomeComponent } from './pages/docs-home/docs-home.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ModuleShellComponent } from './pages/module-shell/module-shell.component';
import { ModuleOverviewPageComponent } from './pages/module-overview-page/module-overview-page.component';
import { ApiReferencePageComponent } from './pages/api-reference-page/api-reference-page.component';

/**
 * Angular module `DocsModule` declaring and exporting docs module components, directives, pipes, and providers.
 * @zh Angular 模块 `DocsModule`，声明并导出文档模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    DocsShellComponent,
    NavTreeComponent,
    DocsHomeComponent,
    CategoryPageComponent,
    ModuleShellComponent,
    ModuleOverviewPageComponent,
    ApiReferencePageComponent,
  ],
  imports: [
    CommonModule,
    DocsRoutingModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule,
    MatTooltipModule,
    MarkdownModule,
    HighlightModule,
  ],
})
export class DocsModule {}
