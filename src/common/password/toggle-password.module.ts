/**
 * @fileoverview Module `src/common/password/toggle-password.module.ts` providing toggle password module definitions and implementation.
 * @zh 模块文件 `src/common/password/toggle-password.module.ts`，提供开关密码模块相关的定义与实现。
 */



import { CommonModule } from '@angular/common';
import {  NgModule } from '@angular/core';
import { TranslateModule } from '@dotos1/dui/translator';
import { CommonServicesModule } from '@dotos1/dui/core/services';
import { ToastrModule } from '@dotos1/dui/common/toastr';
import { TogglePasswordComponent } from './toggle-password.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Angular module `TogglePasswordModule` declaring and exporting toggle password module components, directives, pipes, and providers.
 * @zh Angular 模块 `TogglePasswordModule`，声明并导出开关密码模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
    MatButtonModule,
    MatIconModule,
    CommonServicesModule,
    TranslateModule
  ],
  providers: [
    TogglePasswordComponent
  ],
  declarations: [
    TogglePasswordComponent
  ],
  exports: [
    TogglePasswordComponent
  ]
})
export class TogglePasswordModule {

}
