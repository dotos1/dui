import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { HighlightModule } from '@dotos/dui/ux/highlight';
import { TranslateModule } from '@dotos/dui/translator';

import { TutorialPageComponent } from './pages/tutorial-page/tutorial-page.component';

const tutorialRoutes: Routes = [
  { path: '', component: TutorialPageComponent },
];

@NgModule({
  declarations: [TutorialPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(tutorialRoutes),
    MatTabsModule,
    HighlightModule,
    TranslateModule.forChild(),
  ],
})
export class TutorialModule {}
