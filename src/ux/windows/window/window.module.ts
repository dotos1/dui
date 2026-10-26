/**
 * @fileoverview Module `src/ux/windows/window/window.module.ts` providing window module definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/window.module.ts`，提供窗口模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { DragAndDropModule } from '../drag-and-drop';
import { ResizerModule } from '../resizer';
import { ScrollViewModule } from '../scroll-view';
import { UtilsModule } from '../utils';
import {
    TitleBarButtonComponent,
    TitleBarComponent,
    TitleBarContentComponent,
    TitleBarControlsComponent,
    TitleBarIconComponent,
    WindowComponent, ɵDynamicWindowComponent
} from './components';
import { ɵDYNAMIC_WINDOW_SHARED_CONFIG_PROVIDER } from './data';

/**
 * Angular module `WindowModule` declaring and exporting window module components, directives, pipes, and providers.
 * @zh Angular 模块 `WindowModule`，声明并导出窗口模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    declarations: [
        ɵDynamicWindowComponent,
        TitleBarButtonComponent,
        TitleBarComponent,
        TitleBarContentComponent,
        TitleBarControlsComponent,
        TitleBarIconComponent,
        WindowComponent
    ],
    imports: [
        CommonModule,
        UtilsModule,
        MatIconModule,
        ScrollViewModule,
        ResizerModule,
        RouterModule,
        DragAndDropModule
    ],
    exports: [
        TitleBarButtonComponent,
        TitleBarComponent,
        TitleBarContentComponent,
        TitleBarControlsComponent,
        TitleBarIconComponent,
        WindowComponent
    ],
    providers: [
        ɵDYNAMIC_WINDOW_SHARED_CONFIG_PROVIDER
    ]
})
export class WindowModule {}
