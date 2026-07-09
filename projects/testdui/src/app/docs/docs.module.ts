import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';

import { MarkdownModule } from '@dotos/dui/ux/markdown';
import { HighlightModule } from '@dotos/dui/ux/highlight';
import { TopbarModule } from '@dotos/dui/ui/topbar';

import { DocsRoutingModule } from './docs-routing.module';

import { DocsShellComponent } from './shell/docs-shell.component';
import { NavTreeComponent } from './shell/nav-tree/nav-tree.component';
import { DocsHomeComponent } from './pages/docs-home/docs-home.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ModuleShellComponent } from './pages/module-shell/module-shell.component';
import { ModuleOverviewPageComponent } from './pages/module-overview-page/module-overview-page.component';
import { ApiReferencePageComponent } from './pages/api-reference-page/api-reference-page.component';

@NgModule({
  declarations: [
    DocsShellComponent,
    NavTreeComponent,
    DocsHomeComponent,
    CategoryPageComponent,
    ModuleShellComponent,
    ModuleOverviewPageComponent,
    ApiReferencePageComponent,
  ],
  imports: [
    CommonModule,
    DocsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MarkdownModule,
    HighlightModule,
    TopbarModule,
  ],
})
export class DocsModule {}
