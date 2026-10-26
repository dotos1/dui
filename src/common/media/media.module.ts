/**
 * @fileoverview Module `src/common/media/media.module.ts` providing media module definitions and implementation.
 * @zh 模块文件 `src/common/media/media.module.ts`，提供媒体模块相关的定义与实现。
 */

import { Type } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MEDIA_PROVIDER } from './services/media.service';
import { MediaToggleDirective } from './directives/media-toggle.directive';

/**
 * Constant/variable `EXT_MEDIA` defining ext media in `src/common/media`.
 * @zh 常量/变量 `EXT_MEDIA`，定义 `src/common/media` 中的EXT媒体。
 */
const EXT_MEDIA = [
  MediaToggleDirective
];

export { MediaService, MediaToggleDirective };

/**
 * Angular module `MediaModule` declaring and exporting media module components, directives, pipes, and providers.
 * @zh Angular 模块 `MediaModule`，声明并导出媒体模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EXT_MEDIA
  ],
  exports: [
    EXT_MEDIA
  ],
  providers: [
    MEDIA_PROVIDER
  ]
})
export class MediaModule {

}
