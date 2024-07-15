
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicComponent } from "./dynamic.component";
import { SafeurlPipe } from "./safeurl.pipe";
import { MustachePipe } from "./mustache.pipe";

@NgModule({
  imports: [  CommonModule],
  declarations: [DynamicComponent,MustachePipe, SafeurlPipe],
  exports: [
    DynamicComponent,
    MustachePipe,
    SafeurlPipe
  ],
  providers:[SafeurlPipe, MustachePipe]
})
export class DynamicModule {}
