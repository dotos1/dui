import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MultiWindowService } from './providers/multi-window.service';
import { WStorageService } from './providers/storage.service';
import { NGXMW_CONFIG } from './providers/config.provider';
import { MultiWindowConfig } from './types/multi-window.config';
import { MultiWindowRef } from './providers/window.provider';

@NgModule({
  imports: [CommonModule],
  providers: [
    WStorageService,
    MultiWindowService,
    MultiWindowRef,
    { provide: NGXMW_CONFIG, useValue: {} },
  ],
})
export class MultiWindowModule {
  static forRoot(config?: MultiWindowConfig): ModuleWithProviders<MultiWindowModule> {
    return {
      ngModule: MultiWindowModule,
      providers: [MultiWindowService, { provide: NGXMW_CONFIG, useValue: config }],
    };
  }
}
