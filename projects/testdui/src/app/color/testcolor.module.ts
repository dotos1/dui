/**
 * @fileoverview Module `projects/testdui/src/app/color/testcolor.module.ts` providing testcolor module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/color/testcolor.module.ts`，提供testcolor模块相关的定义与实现。
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoadingModule, LoadingService } from '@dotos/dui/common/loading';
import { ColorFieldModule, FormModule, FormWrapperModule } from "@dotos/dui/form";
import { IconPickerModule } from '@dotos/dui/ux/iconpicker';
import { TestColorComponent } from "./testcolor.component";
/**
 * Constant/variable `FrameRootRoutes` defining frame root routes in `projects/testdui/src/app/color`.
 * @zh 常量/变量 `FrameRootRoutes`，定义 `projects/testdui/src/app/color` 中的框架根节点Routes。
 */
export const FrameRootRoutes: Routes = [
    {
        path: '',
        component: TestColorComponent,
  
    }
  ];
/**
 * Angular module `TestColorModule` declaring and exporting test color module components, directives, pipes, and providers.
 * @zh Angular 模块 `TestColorModule`，声明并导出测试颜色模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    declarations: [
        TestColorComponent
    ],
    imports: [
        ColorFieldModule,
        FormModule,
        FormWrapperModule,

        LoadingModule,
        IconPickerModule,
        RouterModule.forChild(FrameRootRoutes)
    ],
    providers: [
        LoadingService,
      ],
})
export class TestColorModule { 
}