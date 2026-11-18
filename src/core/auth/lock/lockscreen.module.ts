/**
 * @fileoverview Module `src/core/auth/lock/lockscreen.module.ts` providing lockscreen module definitions and implementation.
 * @zh 模块文件 `src/core/auth/lock/lockscreen.module.ts`，提供lockscreen模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from '@dotos1/dui/common/clickout'
import { TranslateModule, TranslationService } from '@dotos1/dui/translator';
import { LockscreenDialog } from './lockscreen.dialog';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { encrypt } from '@dotos1/dui/core/crypt';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogsModule } from '@dotos1/dui/common/dialogs';

/**
 * Angular module `LockscreenSaverModule` declaring and exporting lockscreen saver module components, directives, pipes, and providers.
 * @zh Angular 模块 `LockscreenSaverModule`，声明并导出LockscreenSaver模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    LockscreenDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    DialogsModule,
    RouterModule
  ],
  providers: [
    encrypt
  ],
})

export class LockscreenSaverModule {
  /**
   * Creates an instance of `LockscreenSaverModule` and initializes its dependencies and internal state.
   * @zh 创建 `LockscreenSaverModule` 实例，并初始化其依赖项与内部状态。
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(
    translateService: TranslationService) {
    translateService.addTranslationFolder('dotos/home', 'i18n');
  }
}
