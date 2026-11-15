/**
 * @fileoverview Module `src/ui/topbar/topbar.module.ts` providing topbar module definitions and implementation.
 * @zh 模块文件 `src/ui/topbar/topbar.module.ts`，提供顶栏模块相关的定义与实现。
 */


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { TranslateModule } from '@dotos1/dui/translator';

import { ToolbarDividerComponent } from './topbar-divider.component';
import { TopbarTitleComponent } from './topbar-title.component';
import { TopbarComponent } from './topbar.component';
/**
 * Angular module `TopbarModule` declaring and exporting topbar module components, directives, pipes, and providers.
 * @zh Angular 模块 `TopbarModule`，声明并导出顶栏模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MatToolbarModule,
    ],
    declarations: [
        TopbarComponent,
        TopbarTitleComponent,
        ToolbarDividerComponent
    ],
    exports: [
        TopbarComponent,
        TopbarTitleComponent,
        ToolbarDividerComponent
    ]
})
export class TopbarModule {}
