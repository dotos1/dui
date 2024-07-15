import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IconSpriteComponent } from './icon-sprite.component';
import { IconSpriteDirective } from './icon-sprite.directive';
import { IconSpriteConfig } from './icon-sprite-config.model';


@NgModule({
  imports: [CommonModule],
  declarations: [
    IconSpriteComponent,
    IconSpriteDirective
  ],
  exports: [IconSpriteComponent]
})
export class IconSpriteModule {
  static forRoot(config: IconSpriteConfig): ModuleWithProviders<IconSpriteModule> {
    return {
      ngModule: IconSpriteModule,
      providers: [
        { provide: IconSpriteConfig, useValue: config }
      ]
    };
  }
}
