import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoadingModule, LoadingService } from '@dotos/dui/common/loading';
import { ColorFieldModule, FormModule, FormWrapperModule } from "@dotos/dui/form";
import { IconPickerModule } from '@dotos/dui/ux/iconpicker';
import { TestColorComponent } from "./testcolor.component";
export const FrameRootRoutes: Routes = [
    {
        path: '',
        component: TestColorComponent,
  
    }
  ];
@NgModule({
    declarations: [
        TestColorComponent
    ],
    imports: [
        ColorFieldModule,
        FormWrapperModule, 

        LoadingModule,
        IconPickerModule,
        RouterModule.forChild(FrameRootRoutes)
    ],
    providers: [
        LoadingService,
      ],
})
export class TestColorModule { 
}