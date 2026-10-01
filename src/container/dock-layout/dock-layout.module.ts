import { ModuleWithProviders, NgModule } from "@angular/core";
import { DockLayoutComponentService } from "./dock-layout-component.service";
import { DockLayoutHostComponent } from "./dock-layout-host.component";
import { TranslateModule, TranslationService } from "@dotos/dui/translator";

@NgModule({
  declarations: [DockLayoutHostComponent],
  providers: [DockLayoutComponentService],
  imports: [
    TranslateModule,
  ],
  exports: [DockLayoutHostComponent],
})
export class DockLayoutModule {
  static forRoot(): ModuleWithProviders<DockLayoutModule> {
    return {
      ngModule: DockLayoutModule,
      providers: [DockLayoutComponentService],
    };
  }
  constructor(
    translateService: TranslationService) {
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
