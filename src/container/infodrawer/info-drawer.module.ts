/**
 * @fileoverview Module `src/container/infodrawer/info-drawer.module.ts` providing info drawer module definitions and implementation.
 * @zh 模块文件 `src/container/infodrawer/info-drawer.module.ts`，提供信息抽屉面板模块相关的定义与实现。
 */


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, } from '@angular/material/tabs';
import { MatRippleModule, } from '@angular/material/core';
import { InfoDrawerLayoutComponent, InfoDrawerTitleDirective, InfoDrawerButtonsDirective, InfoDrawerContentDirective } from './info-drawer-layout.component';
import { InfoDrawerComponent, InfoDrawerTabComponent } from './info-drawer.component';
import { TranslateModule } from '@dotos/dui/translator';
import { MatButtonModule } from '@angular/material/button';

/**
 * Executes `declarations` to handle declarations.
 * @zh 执行 `declarations`，用于声明列表。
 */
export function declarations() {
  return [
    InfoDrawerLayoutComponent,
    InfoDrawerTabComponent,
    InfoDrawerComponent,
    InfoDrawerTitleDirective,
    InfoDrawerButtonsDirective,
    InfoDrawerContentDirective
  ];
}

/**
 * Angular module `InfoDrawerModule` declaring and exporting info drawer module components, directives, pipes, and providers.
 * @zh Angular 模块 `InfoDrawerModule`，声明并导出信息抽屉面板模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTabsModule,
    TranslateModule//.forChild()
  ],
  declarations: declarations(),
  exports: declarations()
})
export class InfoDrawerModule { }
