/**
 * @fileoverview Module `src/ux/avatar/avatar.module.ts` providing avatar module definitions and implementation.
 * @zh 模块文件 `src/ux/avatar/avatar.module.ts`，提供头像模块相关的定义与实现。
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';
import { AvatarService } from './avatar.service';
import { AvatarConfig } from './avatar-config';
import { AVATAR_CONFIG } from './avatar-config.token';
import { AvatarConfigService } from './avatar-config.service';

/**
 * Angular module `AvatarModule` declaring and exporting avatar module components, directives, pipes, and providers.
 * @zh Angular 模块 `AvatarModule`，声明并导出头像模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  declarations: [AvatarComponent],
  providers: [ AvatarService, AvatarConfigService],
  exports: [AvatarComponent]
})
export class AvatarModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param avatarConfig - avatar config parameter (`AvatarConfig`) / 头像配置参数（`AvatarConfig`）
   * @returns Result of type `ModuleWithProviders<AvatarModule>` / 类型为 `ModuleWithProviders<AvatarModule>` 的返回值
   */
  static forRoot(avatarConfig?: AvatarConfig): ModuleWithProviders<AvatarModule> {
    return {
      ngModule: AvatarModule,
      providers: [
        { provide: AVATAR_CONFIG, useValue: avatarConfig ? avatarConfig : {} }
      ]
    };
  }
}
