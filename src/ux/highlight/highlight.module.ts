import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { HighlightComponent } from './highlight.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CopyCodeButtonComponent } from './copy-code-button/copy-code-button.component';
import { TranslateModule } from '@dotos/dui/translator';

@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    MatIconModule,
    TranslateModule,
    MatTooltipModule,
     MatButtonModule
  ],
  declarations: [
    HighlightComponent,
     CopyCodeButtonComponent],
  exports: [HighlightComponent],
})
export class HighlightModule {}
