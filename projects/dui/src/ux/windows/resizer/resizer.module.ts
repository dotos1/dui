import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UtilsModule } from '../utils';
import { ResizableDirective } from './directives';

@NgModule({
    declarations: [
        ResizableDirective
    ],
    imports: [
      CommonModule,
      UtilsModule
    ],
    exports: [
        ResizableDirective
    ]
})
export class ResizerModule {}
