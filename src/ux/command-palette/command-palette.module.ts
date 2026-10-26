/**
 * @fileoverview Module `src/ux/command-palette/command-palette.module.ts` providing command palette module definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/command-palette.module.ts`，提供命令调色板模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommandPaletteComponent } from './command-palette.component';
import { CommandPaletteHeaderComponent } from './header/command-palette-header.component';
import { CommandPaletteContentComponent } from './content/command-palette-content.component';
import { CommandPaletteShortcutsService } from './services/command-palette-shortcuts.service';
import { CommandPaletteCreatorService } from './services/command-palette-creator-service';
import { CommandPaletteGroupStorageService } from './services/command-palette-group-storage.service';

/**
 * Angular module `CommandPaletteModule` declaring and exporting command palette module components, directives, pipes, and providers.
 * @zh Angular 模块 `CommandPaletteModule`，声明并导出命令调色板模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    CommandPaletteComponent,
    CommandPaletteHeaderComponent,
    CommandPaletteContentComponent
  ],
  providers: [
    CommandPaletteShortcutsService,
    CommandPaletteCreatorService,
    CommandPaletteGroupStorageService
  ]
})
export class CommandPaletteModule { }
