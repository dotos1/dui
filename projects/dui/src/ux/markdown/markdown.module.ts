import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from './markdown.component';
import { MarkdownLoaderService } from './loader/markdown-loader.service';

@NgModule({
  imports: [CommonModule],
  declarations: [MarkdownComponent],
  exports: [MarkdownComponent],
  providers: [MarkdownLoaderService],
})
export class MarkdownModule {}
