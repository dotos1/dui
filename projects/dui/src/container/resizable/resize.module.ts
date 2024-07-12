import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizableComponent } from './resizable.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ResizableComponent],
  exports: [ResizableComponent]
})
export class ResizableModule { }
export { ResizableComponent } from './resizable.component';
