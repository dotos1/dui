/**
 * @fileoverview Module `src/common/carousel/carousel.module.ts` providing carousel module definitions and implementation.
 * @zh 模块文件 `src/common/carousel/carousel.module.ts`，提供carousel模块相关的定义与实现。
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCarouselComponent } from './carousel.component';
import { MatCarouselSlideComponent } from './carousel-slide/carousel-slide.component';
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';

/**
 * Class `MatCarouselHammerConfig` encapsulating mat carousel hammer config data structures and logic in `src/common/carousel`.
 * @zh 类 `MatCarouselHammerConfig`，封装 `src/common/carousel` 中的MaterialCarouselHammer配置数据结构与处理逻辑。
 */
export class MatCarouselHammerConfig extends HammerGestureConfig {
  /**
   * Property `overrides` (`{ pinch: { enable: boolean; }; rotate: { enable: boolean; }; }`) storing overrides.
   * @zh 属性 `overrides`（类型：`{ pinch: { enable: boolean; }; rotate: { enable: boolean; }; }`），用于存储或配置overrides。
   */
  override overrides = {
    pinch: { enable: false },
    rotate: { enable: false }
  };
}
/**
 * Angular module `MatCarouselModule` declaring and exporting mat carousel module components, directives, pipes, and providers.
 * @zh Angular 模块 `MatCarouselModule`，声明并导出MaterialCarousel模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [MatCarouselComponent, MatCarouselSlideComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [MatCarouselComponent, MatCarouselSlideComponent]
})
export class MatCarouselModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @returns Result of type `ModuleWithProviders<MatCarouselModule>` / 类型为 `ModuleWithProviders<MatCarouselModule>` 的返回值
   */
  static forRoot(): ModuleWithProviders<MatCarouselModule>  {
    return {
      ngModule: MatCarouselModule,
      providers: [
        { provide: HAMMER_GESTURE_CONFIG, useClass: MatCarouselHammerConfig }
      ]
    };
  }
}
