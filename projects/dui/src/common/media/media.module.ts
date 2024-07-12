import { Type } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MEDIA_PROVIDER } from './services/media.service';
import { MediaToggleDirective } from './directives/media-toggle.directive';

const EXT_MEDIA: Type<any>[] = [
  MediaToggleDirective
];

export { MediaService, MediaToggleDirective };

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EXT_MEDIA
  ],
  exports: [
    EXT_MEDIA
  ],
  providers: [
    MEDIA_PROVIDER
  ]
})
export class MediaModule {

}
