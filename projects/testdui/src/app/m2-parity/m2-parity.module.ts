/**
 * @fileoverview Module `projects/testdui/src/app/m2-parity/m2-parity.module.ts` declaring M2 parity showcase module.
 * Covers all 16 Material categories, 6 DUI custom components (`ng-scrollbar`, `query-builder`, `toggle-select`,
 * `date-field` / `mat-datetimepicker`, `dui-card-view`, `link-preview`), M2 typography (`h1~h6`, `display-1`),
 * and downstream `duix` / `sdos` dynamic `loadTheme` probes.
 * @zh 模块文件 `projects/testdui/src/app/m2-parity/m2-parity.module.ts`，声明并导出覆盖 16 类 Material 组件、6 类 DUI 自研组件及下游 `duix`/`sdos` 动态主题探针的 M2 对比验收模块。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
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
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { ClipboardModule, ClipboardService } from '@dotos1/dui/common/clipboard';
import { LoadingModule, LoadingService } from '@dotos1/dui/common/loading';
import { NgScrollbarModule } from '@dotos1/dui/common/scrollbar';
import { configFactory, ConfigLoader, ConfigService } from '@dotos1/dui/core/config';
import { LogService } from '@dotos1/dui/core/services';
import { CardViewModule } from '@dotos1/dui/data/cardview';
import { FormModule, FormWrapperModule } from '@dotos1/dui/form';
import { DateFieldModule } from '@dotos1/dui/form/date';
import { MatNativeDatetimeModule } from '@dotos1/dui/form/date/adapter';
import { MatDatetimepickerModule } from '@dotos1/dui/form/date/picker';
import { ToggleSelectModule } from '@dotos1/dui/form/toggle-select';
import { LinkPreviewModule } from '@dotos1/dui/ux/link-preview';
import { QueryBuilderModule } from '@dotos1/dui/ux/query-builder';
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
 * @zh Angular 模块 `M2ParityModule`，声明并导出 M2 对比验收组件与所需 Material 及 DUI 自研模块。
 */
@NgModule({
  declarations: [M2ParityComponent, M2ParityDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatNativeDateModule,
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
    MatSliderModule,
    MatTableModule,
    MatTabsModule,
    ClipboardModule,
    LoadingModule,
    NgScrollbarModule,
    CardViewModule,
    FormModule.forRoot(),
    FormWrapperModule,
    DateFieldModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    ToggleSelectModule,
    LinkPreviewModule,
    QueryBuilderModule,
    RouterModule.forChild(m2ParityRoutes),
  ],
  providers: [
    LoadingService,
    { provide: ConfigLoader, useFactory: configFactory },
    ConfigService,
    LogService,
    ClipboardService,
  ],
})
export class M2ParityModule {}
