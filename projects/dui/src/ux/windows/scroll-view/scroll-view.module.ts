import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UtilsModule } from '../utils';
import { ScrollViewComponent } from './components';

@NgModule({
    declarations: [
        ScrollViewComponent
    ],
    imports: [
      CommonModule,
      UtilsModule
    ],
    exports: [
        ScrollViewComponent
    ]
})
export class ScrollViewModule {}
