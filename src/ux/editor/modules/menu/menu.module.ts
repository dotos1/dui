/**
 * @fileoverview Module `src/ux/editor/modules/menu/menu.module.ts` providing menu module definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/menu.module.ts`，提供菜单模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BubbleComponent } from './bubble/bubble.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FloatingMenuComponent } from './floating-menu/floating-menu.component';
import { ImageComponent } from './image/image.component';
import { InsertCommandComponent } from './insert-command/insert-command.component';
import { LinkComponent } from './link/link.component';
import { ToggleCommandComponent } from './toggle-command/toggle-command.component';

import { MenuComponent } from './menu.component';
import { SanitizeHtmlPipe } from '../../pipes/sanitize/sanitize-html.pipe';

/**
 * Angular module `EditorMenuModule` declaring and exporting editor menu module components, directives, pipes, and providers.
 * @zh Angular 模块 `EditorMenuModule`，声明并导出编辑器菜单模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    // pipes
    SanitizeHtmlPipe,

    // components
    MenuComponent,
    ToggleCommandComponent,
    InsertCommandComponent,
    LinkComponent,
    DropdownComponent,
    ImageComponent,
    ColorPickerComponent,

    FloatingMenuComponent,
    BubbleComponent,
  ],
  providers: [
    SanitizeHtmlPipe,
  ],
  exports: [
    MenuComponent,
    FloatingMenuComponent,
  ],
})
export class EditorMenuModule { }
