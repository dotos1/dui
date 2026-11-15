/**
 * @fileoverview Module `projects/testdui/src/app/m2-parity/m2-parity.module.ts` declaring M2 parity showcase module.
 * @zh 模块文件 `projects/testdui/src/app/m2-parity/m2-parity.module.ts`，声明并导出 M2 外观对比验收模块。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { M2ParityComponent, M2ParityDialogComponent } from './m2-parity.component';

/**
 * Constant `m2ParityRoutes` defining child routes for `/m2-parity`.
 * @zh 常量 `m2ParityRoutes`，定义 `/m2-parity` 子路由配置。
 */
export const m2ParityRoutes: Routes = [
  {
    path: '',
    component: M2ParityComponent,
  },
];

/**
 * Angular module `M2ParityModule` declaring and exporting M2 parity showcase components.
 * @zh Angular 模块 `M2ParityModule`，声明并导出 M2 对比验收组件与所需 Material 模块。
 */
@NgModule({
  declarations: [M2ParityComponent, M2ParityDialogComponent],
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    RouterModule.forChild(m2ParityRoutes),
  ],
})
export class M2ParityModule {}
