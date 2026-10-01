
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicComponent } from "./dynamic.component";
import { FlexLayoutModule } from "ngx-flexible-layout";
import { TranslateModule } from "@dotos/dui/translator";
import { SafeurlPipe } from "./safeurl.pipe";

@NgModule({
  imports: [  CommonModule,FlexLayoutModule,TranslateModule],
  declarations: [DynamicComponent, SafeurlPipe],
  exports: [
    DynamicComponent,
    SafeurlPipe
  ],
  providers:[SafeurlPipe]
})
export class DynamicModule {}
