import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkPreviewComponent } from './components/link-preview.component';
import { LinkPreviewCacheService } from './services/link-preview-cache.service';

@NgModule({
   declarations: [LinkPreviewComponent],
   exports: [LinkPreviewComponent],
   imports: [CommonModule],
   providers: [LinkPreviewCacheService]
})
export class LinkPreviewModule {}
