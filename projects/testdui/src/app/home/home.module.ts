import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { HighlightModule } from '@dotos/dui/ux/highlight';
import { TranslateModule } from '@dotos/dui/translator';

import { HomePageComponent } from './pages/home-page/home-page.component';

const homeRoutes: Routes = [
  { path: '', component: HomePageComponent },
];

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    HighlightModule,
    TranslateModule.forChild(),
  ],
})
export class HomeModule {}
