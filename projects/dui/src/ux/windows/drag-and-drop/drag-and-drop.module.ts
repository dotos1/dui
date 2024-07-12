import { NgModule } from '@angular/core';
import { UtilsModule } from '../utils';
import { DraggableDirective } from './directives';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        DraggableDirective
    ],
    imports: [
      CommonModule,
      UtilsModule
    ],
    exports: [
        DraggableDirective
    ]
})
export class DragAndDropModule {}

